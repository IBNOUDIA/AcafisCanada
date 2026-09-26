import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { getSupabaseClient } from "./supabaseClient.js";
import { checkRateLimit, RATE_LIMIT_ERROR } from "./rateLimit.js";
import { isValidEmail } from "./validation.js";

interface HandlerResult<T> {
  status: number;
  body: T;
}

const NOT_CONFIGURED_ERROR =
  "Le tableau de bord admin n'est pas encore configuré. Contactez le développeur du site.";
const SESSION_TTL_HOURS = 24;

// ---------------------------------------------------------------------------
// Admin session verification — shared by every admin-only endpoint below.
// There's no self-serve signup: an account only exists if a row was inserted
// into `admins` directly (see supabase/schema.sql).
// ---------------------------------------------------------------------------

interface AdminIdentity {
  email: string;
  name: string;
}

interface AdminSessionVerification {
  status: number;
  admin?: AdminIdentity;
  error?: string;
}

async function verifyAdminSession(token: string | undefined): Promise<AdminSessionVerification> {
  if (!token || typeof token !== "string") {
    return { status: 401, error: "Session requise" };
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return { status: 503, error: NOT_CONFIGURED_ERROR };
  }

  const { data: session, error } = await supabase
    .from("admin_sessions")
    .select("admin_email, expires_at")
    .eq("token", token)
    .maybeSingle();

  if (error) {
    console.error("Admin session lookup failed:", error);
    return { status: 500, error: "Erreur serveur, réessayez dans un instant." };
  }

  if (!session || new Date(session.expires_at).getTime() < Date.now()) {
    return { status: 401, error: "Session expirée, merci de vous reconnecter." };
  }

  const { data: admin, error: adminError } = await supabase
    .from("admins")
    .select("email, name")
    .eq("email", session.admin_email)
    .maybeSingle();

  if (adminError || !admin) {
    return { status: 401, error: "Compte admin introuvable." };
  }

  return { status: 200, admin: { email: admin.email, name: admin.name } };
}

// ---------------------------------------------------------------------------
// Login / logout / change password
// ---------------------------------------------------------------------------

export interface AdminLoginBody {
  email?: string;
  password?: string;
}

export async function handleAdminLogin(
  data: AdminLoginBody,
  ip: string
): Promise<HandlerResult<{ token?: string; name?: string; email?: string; error?: string }>> {
  const { email, password } = data;

  if (!email || !isValidEmail(email) || !password) {
    return { status: 400, body: { error: "Courriel et mot de passe requis" } };
  }

  // Tighter than the member-auth bucket — this is the one endpoint that
  // guards a password, so it's the natural target for a brute-force script.
  if (!(await checkRateLimit(ip, { bucket: "admin-login", limit: 10, windowMinutes: 60 }))) {
    return { status: 429, body: { error: RATE_LIMIT_ERROR } };
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return { status: 503, body: { error: NOT_CONFIGURED_ERROR } };
  }

  const { data: admin, error } = await supabase
    .from("admins")
    .select("*")
    .eq("email", email.toLowerCase().trim())
    .maybeSingle();

  if (error) {
    console.error("Admin lookup failed:", error);
    return { status: 500, body: { error: "Erreur serveur, réessayez dans un instant." } };
  }

  if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
    return { status: 401, body: { error: "Courriel ou mot de passe incorrect." } };
  }

  const token = randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_TTL_HOURS * 60 * 60 * 1000).toISOString();

  const { error: insertError } = await supabase
    .from("admin_sessions")
    .insert({ token, admin_email: admin.email, expires_at: expiresAt });

  if (insertError) {
    console.error("Admin session insert failed:", insertError);
    return { status: 500, body: { error: "Erreur serveur, réessayez dans un instant." } };
  }

  return { status: 200, body: { token, name: admin.name, email: admin.email } };
}

export interface AdminChangePasswordBody {
  token?: string;
  oldPassword?: string;
  newPassword?: string;
}

export async function handleAdminChangePassword(
  data: AdminChangePasswordBody
): Promise<HandlerResult<{ success?: boolean; error?: string }>> {
  const verification = await verifyAdminSession(data.token);
  if (verification.status !== 200) {
    return { status: verification.status, body: { error: verification.error } };
  }

  const { oldPassword, newPassword } = data;
  if (!oldPassword || !newPassword || newPassword.length < 8) {
    return { status: 400, body: { error: "Le nouveau mot de passe doit contenir au moins 8 caractères." } };
  }

  const supabase = getSupabaseClient()!;
  const { data: admin, error } = await supabase
    .from("admins")
    .select("password_hash")
    .eq("email", verification.admin!.email)
    .single();

  if (error || !admin || !(await bcrypt.compare(oldPassword, admin.password_hash))) {
    return { status: 401, body: { error: "Mot de passe actuel incorrect." } };
  }

  const newHash = await bcrypt.hash(newPassword, 10);
  const { error: updateError } = await supabase
    .from("admins")
    .update({ password_hash: newHash })
    .eq("email", verification.admin!.email);

  if (updateError) {
    console.error("Admin password update failed:", updateError);
    return { status: 500, body: { error: "Erreur serveur, réessayez dans un instant." } };
  }

  return { status: 200, body: { success: true } };
}

// ---------------------------------------------------------------------------
// Members management
// ---------------------------------------------------------------------------

export interface AdminMembersListBody {
  token?: string;
}

export async function handleAdminMembersList(
  data: AdminMembersListBody
): Promise<HandlerResult<{ members?: Record<string, unknown>[]; error?: string }>> {
  const verification = await verifyAdminSession(data.token);
  if (verification.status !== 200) {
    return { status: verification.status, body: { error: verification.error } };
  }

  const supabase = getSupabaseClient()!;
  const { data: rows, error } = await supabase
    .from("members")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Admin members list failed:", error);
    return { status: 500, body: { error: "Erreur serveur, réessayez dans un instant." } };
  }

  return {
    status: 200,
    body: {
      members: (rows || []).map((row: Record<string, any>) => ({
        memberId: row.member_id,
        firstName: row.first_name,
        lastName: row.last_name,
        email: row.email,
        phone: row.phone,
        city: row.city,
        membershipYear: row.membership_year,
        paymentStatus: row.payment_status,
        coopInterest: row.coop_interest,
        issuedAt: row.issued_at,
      })),
    },
  };
}

export interface AdminSetPaymentStatusBody {
  token?: string;
  memberId?: string;
  paymentStatus?: string;
}

export async function handleAdminSetPaymentStatus(
  data: AdminSetPaymentStatusBody
): Promise<HandlerResult<{ success?: boolean; error?: string }>> {
  const verification = await verifyAdminSession(data.token);
  if (verification.status !== 200) {
    return { status: verification.status, body: { error: verification.error } };
  }

  const { memberId, paymentStatus } = data;
  if (!memberId || (paymentStatus !== "paid" && paymentStatus !== "pending")) {
    return { status: 400, body: { error: "Requête invalide" } };
  }

  const supabase = getSupabaseClient()!;
  const { error } = await supabase
    .from("members")
    .update({ payment_status: paymentStatus })
    .eq("member_id", memberId);

  if (error) {
    console.error("Admin set payment status failed:", error);
    return { status: 500, body: { error: "Erreur serveur, réessayez dans un instant." } };
  }

  return { status: 200, body: { success: true } };
}

// ---------------------------------------------------------------------------
// Family census stats — the actual point of the feature: exact beneficiary
// counts by age bracket and gender for youth activity planning.
// ---------------------------------------------------------------------------

export interface AdminFamilyStatsBody {
  token?: string;
}

export async function handleAdminFamilyStats(
  data: AdminFamilyStatsBody
): Promise<HandlerResult<{ stats?: Record<string, unknown>; error?: string }>> {
  const verification = await verifyAdminSession(data.token);
  if (verification.status !== 200) {
    return { status: verification.status, body: { error: verification.error } };
  }

  const supabase = getSupabaseClient()!;
  const { data: rows, error } = await supabase.from("member_children").select("birth_year, gender");

  if (error) {
    console.error("Admin family stats failed:", error);
    return { status: 500, body: { error: "Erreur serveur, réessayez dans un instant." } };
  }

  const currentYear = new Date().getFullYear();
  const byGender: Record<string, number> = { feminin: 0, masculin: 0, autre: 0 };
  const ageBrackets = { "0-5": 0, "6-12": 0, "13-17": 0 };

  for (const row of rows || []) {
    byGender[row.gender] = (byGender[row.gender] || 0) + 1;
    const age = currentYear - row.birth_year;
    if (age <= 5) ageBrackets["0-5"]++;
    else if (age <= 12) ageBrackets["6-12"]++;
    else ageBrackets["13-17"]++;
  }

  return {
    status: 200,
    body: { stats: { total: (rows || []).length, byGender, ageBrackets } },
  };
}

// ---------------------------------------------------------------------------
// Members-only documents management
// ---------------------------------------------------------------------------

export interface AdminDocumentsListBody {
  token?: string;
}

export async function handleAdminDocumentsList(
  data: AdminDocumentsListBody
): Promise<HandlerResult<{ documents?: Record<string, unknown>[]; error?: string }>> {
  const verification = await verifyAdminSession(data.token);
  if (verification.status !== 200) {
    return { status: verification.status, body: { error: verification.error } };
  }

  const supabase = getSupabaseClient()!;
  const { data: rows, error } = await supabase
    .from("member_documents")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Admin documents list failed:", error);
    return { status: 500, body: { error: "Erreur serveur, réessayez dans un instant." } };
  }

  return {
    status: 200,
    body: {
      documents: (rows || []).map((row: Record<string, any>) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        fileUrl: row.file_url,
        publishedAt: row.published_at,
      })),
    },
  };
}

export interface AdminDocumentAddBody {
  token?: string;
  title?: string;
  description?: string;
  fileUrl?: string;
  publishedAt?: string;
}

export async function handleAdminDocumentAdd(
  data: AdminDocumentAddBody
): Promise<HandlerResult<{ document?: Record<string, unknown>; error?: string }>> {
  const verification = await verifyAdminSession(data.token);
  if (verification.status !== 200) {
    return { status: verification.status, body: { error: verification.error } };
  }

  const { title, description, fileUrl, publishedAt } = data;
  if (!title?.trim() || !fileUrl?.trim()) {
    return { status: 400, body: { error: "Titre et lien du document requis." } };
  }

  const supabase = getSupabaseClient()!;
  const { data: row, error } = await supabase
    .from("member_documents")
    .insert({
      title: title.trim(),
      description: description?.trim() || null,
      file_url: fileUrl.trim(),
      published_at: publishedAt || new Date().toISOString().slice(0, 10),
    })
    .select()
    .single();

  if (error) {
    console.error("Admin document add failed:", error);
    return { status: 500, body: { error: "Erreur serveur, réessayez dans un instant." } };
  }

  return {
    status: 200,
    body: {
      document: {
        id: row.id,
        title: row.title,
        description: row.description,
        fileUrl: row.file_url,
        publishedAt: row.published_at,
      },
    },
  };
}

export interface AdminDocumentRemoveBody {
  token?: string;
  id?: string;
}

export async function handleAdminDocumentRemove(
  data: AdminDocumentRemoveBody
): Promise<HandlerResult<{ success?: boolean; error?: string }>> {
  const verification = await verifyAdminSession(data.token);
  if (verification.status !== 200) {
    return { status: verification.status, body: { error: verification.error } };
  }

  if (!data.id) {
    return { status: 400, body: { error: "Identifiant requis" } };
  }

  const supabase = getSupabaseClient()!;
  const { error } = await supabase.from("member_documents").delete().eq("id", data.id);

  if (error) {
    console.error("Admin document remove failed:", error);
    return { status: 500, body: { error: "Erreur serveur, réessayez dans un instant." } };
  }

  return { status: 200, body: { success: true } };
}

// ---------------------------------------------------------------------------
// nTIC workshops management — creation plus the list of who signed up
// ---------------------------------------------------------------------------

export interface AdminWorkshopsListBody {
  token?: string;
}

export async function handleAdminWorkshopsList(
  data: AdminWorkshopsListBody
): Promise<HandlerResult<{ workshops?: Record<string, unknown>[]; error?: string }>> {
  const verification = await verifyAdminSession(data.token);
  if (verification.status !== 200) {
    return { status: verification.status, body: { error: verification.error } };
  }

  const supabase = getSupabaseClient()!;
  const { data: rows, error } = await supabase
    .from("workshops")
    .select(
      "*, workshop_registrations (id, created_at, members (first_name, last_name, email), member_children (first_name, birth_year))"
    )
    .order("starts_at", { ascending: false });

  if (error) {
    console.error("Admin workshops list failed:", error);
    return { status: 500, body: { error: "Erreur serveur, réessayez dans un instant." } };
  }

  const currentYear = new Date().getFullYear();
  return {
    status: 200,
    body: {
      workshops: (rows || []).map((row: Record<string, any>) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        startsAt: row.starts_at,
        location: row.location,
        capacity: row.capacity,
        registrations: (row.workshop_registrations || []).map((r: Record<string, any>) => ({
          id: r.id,
          memberName: `${r.members?.first_name ?? ""} ${r.members?.last_name ?? ""}`.trim(),
          memberEmail: r.members?.email ?? "",
          // null when the member registered themself rather than a child
          child: r.member_children
            ? { firstName: r.member_children.first_name, age: currentYear - r.member_children.birth_year }
            : null,
        })),
      })),
    },
  };
}

export interface AdminWorkshopAddBody {
  token?: string;
  title?: string;
  description?: string;
  startsAt?: string;
  location?: string;
  capacity?: number;
}

export async function handleAdminWorkshopAdd(
  data: AdminWorkshopAddBody
): Promise<HandlerResult<{ workshop?: Record<string, unknown>; error?: string }>> {
  const verification = await verifyAdminSession(data.token);
  if (verification.status !== 200) {
    return { status: verification.status, body: { error: verification.error } };
  }

  const { title, description, startsAt, location, capacity } = data;
  if (!title?.trim() || !location?.trim() || !startsAt || Number.isNaN(Date.parse(startsAt))) {
    return { status: 400, body: { error: "Titre, date et lieu de l'atelier requis." } };
  }
  if (!capacity || !Number.isInteger(capacity) || capacity < 1) {
    return { status: 400, body: { error: "Le nombre de places doit être au moins 1." } };
  }

  const supabase = getSupabaseClient()!;
  const { data: row, error } = await supabase
    .from("workshops")
    .insert({
      title: title.trim(),
      description: description?.trim() || null,
      starts_at: new Date(startsAt).toISOString(),
      location: location.trim(),
      capacity,
    })
    .select()
    .single();

  if (error) {
    console.error("Admin workshop add failed:", error);
    return { status: 500, body: { error: "Erreur serveur, réessayez dans un instant." } };
  }

  return {
    status: 200,
    body: {
      workshop: {
        id: row.id,
        title: row.title,
        description: row.description,
        startsAt: row.starts_at,
        location: row.location,
        capacity: row.capacity,
        registrations: [],
      },
    },
  };
}

export interface AdminWorkshopRemoveBody {
  token?: string;
  id?: string;
}

export async function handleAdminWorkshopRemove(
  data: AdminWorkshopRemoveBody
): Promise<HandlerResult<{ success?: boolean; error?: string }>> {
  const verification = await verifyAdminSession(data.token);
  if (verification.status !== 200) {
    return { status: verification.status, body: { error: verification.error } };
  }

  if (!data.id) {
    return { status: 400, body: { error: "Identifiant requis" } };
  }

  const supabase = getSupabaseClient()!;
  // Registrations go with it (on delete cascade).
  const { error } = await supabase.from("workshops").delete().eq("id", data.id);

  if (error) {
    console.error("Admin workshop remove failed:", error);
    return { status: 500, body: { error: "Erreur serveur, réessayez dans un instant." } };
  }

  return { status: 200, body: { success: true } };
}
