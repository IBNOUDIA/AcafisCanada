import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { getSupabaseClient } from "./supabaseClient.js";
import { checkRateLimit, RATE_LIMIT_ERROR } from "./rateLimit.js";
import { isValidEmail } from "./validation.js";
import { promoteWaitlist } from "./waitlist.js";
import { getResendClient, EMAIL_FROM } from "./email.js";

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

export async function verifyAdminSession(token: string | undefined): Promise<AdminSessionVerification> {
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
        phone: row.phone ?? null,
        city: row.city,
        membershipYear: row.membership_year,
        paymentStatus: row.payment_status,
        coopInterest: row.coop_interest,
        isCoopMember: row.is_coop_member === true,
        welcomeSentAt: row.welcome_sent_at ?? null,
        issuedAt: row.issued_at,
      })),
    },
  };
}

export interface AdminSendWelcomeBody {
  token?: string;
  memberIds?: string[];
}

const SITE_MEMBER_AREA_URL = "https://www.acafis.ca/espace-membre";

function welcomeEmailText(row: Record<string, any>): string {
  return [
    `Bonjour ${row.first_name},`,
    "",
    row.is_coop_member
      ? "En tant qu'acquéreur·e de la Coopérative d'habitat ACAFIS, vous êtes aussi membre d'ACAFIS Canada, l'association de la diaspora sénégalaise qui porte le projet."
      : "Vous êtes inscrit·e comme membre d'ACAFIS Canada.",
    "",
    `Votre numéro de membre : ${row.member_id}`,
    "",
    "Il vous permet d'accéder à votre Espace Membre (documents de l'AG, recensement familial, inscription de vos enfants aux activités, sondages) :",
    `  1. Rendez-vous sur ${SITE_MEMBER_AREA_URL}`,
    `  2. Connectez-vous avec ce courriel (${row.email}) et votre numéro de membre.`,
    "",
    "Cotisation annuelle : 25 $ CAD par virement Interac à acafisfinance2@gmail.com (question : « Pays ? », réponse : Senegal).",
    "",
    "Pour toute question : infos@acafis.ca",
    "",
    "Au plaisir de vous compter parmi nous,",
    "Le Bureau Exécutif d'ACAFIS Canada",
    "",
    "—",
    `Welcome to ACAFIS Canada! Your member number is ${row.member_id}. Log in at ${SITE_MEMBER_AREA_URL} with this email address and your member number.`,
  ].join("\n");
}

// Emails each selected member their card number (their login credential) —
// used after bulk-adding members, e.g. the Coop-ACAFIS acquéreurs. Members
// with a placeholder @acafis.invalid address are skipped (they claim their
// profile with a personal link instead). Sent through Resend's batch API in
// one request per 100 emails, so the function stays well within Vercel's
// timeout even for the whole membership.
export async function handleAdminSendWelcome(
  data: AdminSendWelcomeBody
): Promise<HandlerResult<{ sent?: number; skipped?: number; error?: string }>> {
  const verification = await verifyAdminSession(data.token);
  if (verification.status !== 200) {
    return { status: verification.status, body: { error: verification.error } };
  }

  const memberIds = Array.isArray(data.memberIds) ? data.memberIds.filter((id) => typeof id === "string") : [];
  if (memberIds.length === 0 || memberIds.length > 200) {
    return { status: 400, body: { error: "Sélection de membres invalide (1 à 200)." } };
  }

  const resend = getResendClient();
  if (!resend) {
    return { status: 503, body: { error: "L'envoi de courriels n'est pas configuré (RESEND_API_KEY manquante)." } };
  }

  const supabase = getSupabaseClient()!;
  const { data: rows, error } = await supabase
    .from("members")
    .select("member_id, first_name, email, is_coop_member")
    .in("member_id", memberIds);

  if (error) {
    console.error("Admin send welcome lookup failed:", error);
    return { status: 500, body: { error: "Erreur serveur, réessayez dans un instant." } };
  }

  const recipients = (rows || []).filter((r: Record<string, any>) => r.email && !r.email.endsWith("@acafis.invalid"));
  const skipped = memberIds.length - recipients.length;

  let sent = 0;
  for (let i = 0; i < recipients.length; i += 100) {
    const chunk = recipients.slice(i, i + 100);
    const { error: sendError } = await resend.batch.send(
      chunk.map((r: Record<string, any>) => ({
        from: EMAIL_FROM,
        to: r.email,
        replyTo: "infos@acafis.ca",
        subject: `Bienvenue à ACAFIS Canada — votre numéro de membre ${r.member_id}`,
        text: welcomeEmailText(r),
      }))
    );
    if (sendError) {
      console.error("Resend welcome batch failed:", sendError);
      return {
        status: 502,
        body: { sent, skipped, error: `Envoi interrompu après ${sent} courriel(s) : ${sendError.message}` },
      };
    }

    const { error: markError } = await supabase
      .from("members")
      .update({ welcome_sent_at: new Date().toISOString() })
      .in(
        "member_id",
        chunk.map((r: Record<string, any>) => r.member_id)
      );
    if (markError) console.error("Admin welcome_sent_at update failed:", markError);
    sent += chunk.length;
  }

  return { status: 200, body: { sent, skipped } };
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

export interface AdminUpdateMemberBody {
  token?: string;
  memberId?: string;
  email?: string;
  phone?: string;
  city?: string;
}

// Lets the secretariat correct a member's contact info — most importantly the
// email, since it's the only login credential. Used e.g. to replace the
// @acafis.invalid placeholder assigned to members bulk-imported from the
// historical dues spreadsheet once their real email is collected.
export async function handleAdminUpdateMember(
  data: AdminUpdateMemberBody
): Promise<HandlerResult<{ success?: boolean; error?: string }>> {
  const verification = await verifyAdminSession(data.token);
  if (verification.status !== 200) {
    return { status: verification.status, body: { error: verification.error } };
  }

  const { memberId, email, phone, city } = data;
  if (!memberId) {
    return { status: 400, body: { error: "Requête invalide" } };
  }
  if (email !== undefined && !isValidEmail(email)) {
    return { status: 400, body: { error: "Adresse courriel invalide" } };
  }

  const updates: Record<string, unknown> = {};
  if (email !== undefined) updates.email = email.toLowerCase().trim();
  if (phone !== undefined) updates.phone = phone.trim() || null;
  if (city !== undefined) updates.city = city.trim() || null;

  if (Object.keys(updates).length === 0) {
    return { status: 400, body: { error: "Aucune modification fournie" } };
  }

  const supabase = getSupabaseClient()!;
  const { error } = await supabase.from("members").update(updates).eq("member_id", memberId);

  if (error) {
    if (error.code === "23505") {
      return { status: 409, body: { error: "Un autre membre existe déjà avec ce courriel." } };
    }
    console.error("Admin update member failed:", error);
    return { status: 500, body: { error: "Erreur serveur, réessayez dans un instant." } };
  }

  return { status: 200, body: { success: true } };
}

export interface AdminDeleteMemberBody {
  token?: string;
  memberId?: string;
}

// Deletes a member entirely (e.g. a Law 25 deletion request). member_children
// and workshop_registrations cascade automatically (see supabase/schema.sql).
export async function handleAdminDeleteMember(
  data: AdminDeleteMemberBody
): Promise<HandlerResult<{ success?: boolean; error?: string }>> {
  const verification = await verifyAdminSession(data.token);
  if (verification.status !== 200) {
    return { status: verification.status, body: { error: verification.error } };
  }

  const { memberId } = data;
  if (!memberId) {
    return { status: 400, body: { error: "Requête invalide" } };
  }

  const supabase = getSupabaseClient()!;
  const { error } = await supabase.from("members").delete().eq("member_id", memberId);

  if (error) {
    console.error("Admin delete member failed:", error);
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
// Activities management (nTIC workshops, soccer team...) — creation plus the
// list of who signed up. Stored in the `workshops` table for history's sake.
// ---------------------------------------------------------------------------

const WORKSHOP_CATEGORIES = ["ntic", "sport", "autre"];

// undefined = not provided, null = no limit, "invalid" = reject the request.
function parseAgeLimit(value: unknown): number | null | undefined | "invalid" {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 120 ? value : "invalid";
}

const AGE_LIMIT_ERROR = "Tranche d'âge invalide (l'âge minimum doit être inférieur ou égal à l'âge maximum).";

const GENDER_RESTRICTIONS = ["feminin", "masculin"];

interface ActivityOptionsInput {
  genderRestriction?: string | null;
  registrationDeadline?: string | null;
  requiresPaidMembership?: boolean;
  feeAmount?: number | null;
}

// Eligibility/logistics options shared by create and update. With
// `allFields`, every option gets a column value (defaults for missing ones);
// otherwise only the options present in `data` are returned.
function parseActivityOptions(
  data: ActivityOptionsInput,
  allFields: boolean
): { columns: Record<string, unknown> } | { error: string } {
  const columns: Record<string, unknown> = {};

  if (allFields || data.genderRestriction !== undefined) {
    const gender = data.genderRestriction || null;
    if (gender !== null && !GENDER_RESTRICTIONS.includes(gender)) {
      return { error: "Restriction de genre invalide." };
    }
    columns.gender_restriction = gender;
  }
  if (allFields || data.registrationDeadline !== undefined) {
    const deadline = data.registrationDeadline || null;
    if (deadline !== null && Number.isNaN(Date.parse(deadline))) {
      return { error: "Date limite d'inscription invalide." };
    }
    columns.registration_deadline = deadline ? new Date(deadline).toISOString() : null;
  }
  if (allFields || data.requiresPaidMembership !== undefined) {
    columns.requires_paid_membership = Boolean(data.requiresPaidMembership);
  }
  if (allFields || data.feeAmount !== undefined) {
    const fee = data.feeAmount ?? null;
    if (fee !== null && (typeof fee !== "number" || !Number.isFinite(fee) || fee < 0 || fee > 10000)) {
      return { error: "Montant des frais invalide." };
    }
    columns.fee_amount = fee === null || fee === 0 ? null : Math.round(fee * 100) / 100;
  }

  return { columns };
}

// Activity fields common to the list and create responses.
function mapWorkshopRow(row: Record<string, any>): Record<string, unknown> {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    startsAt: row.starts_at,
    location: row.location,
    capacity: row.capacity,
    registrationsOpen: row.registrations_open !== false,
    category: row.category ?? "ntic",
    minAge: row.min_age ?? null,
    maxAge: row.max_age ?? null,
    genderRestriction: row.gender_restriction ?? null,
    registrationDeadline: row.registration_deadline ?? null,
    requiresPaidMembership: row.requires_paid_membership === true,
    feeAmount: row.fee_amount === null || row.fee_amount === undefined ? null : Number(row.fee_amount),
  };
}

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
      "*, workshop_registrations (id, created_at, status, fee_paid, attended, members (first_name, last_name, email, phone), member_children (first_name, birth_year, gender, emergency_contact_name, emergency_contact_phone, health_notes, jersey_size, photo_consent, parental_consent_at))"
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
        ...mapWorkshopRow(row),
        // Confirmed seats first, then the waitlist — each in sign-up order,
        // which is also the order the waitlist gets promoted in.
        registrations: [...(row.workshop_registrations || [])]
          .sort(
            (a: Record<string, any>, b: Record<string, any>) =>
              Number(a.status === "waitlist") - Number(b.status === "waitlist") ||
              a.created_at.localeCompare(b.created_at) ||
              a.id.localeCompare(b.id)
          )
          .map((r: Record<string, any>) => {
            const c = r.member_children;
            return {
              id: r.id,
              status: r.status === "waitlist" ? "waitlist" : "confirmed",
              feePaid: r.fee_paid === true,
              attended: r.attended ?? null,
              memberName: `${r.members?.first_name ?? ""} ${r.members?.last_name ?? ""}`.trim(),
              memberEmail: r.members?.email ?? "",
              memberPhone: r.members?.phone ?? "",
              // null when the member registered themself rather than a child
              child: c
                ? {
                    firstName: c.first_name,
                    age: currentYear - c.birth_year,
                    gender: c.gender,
                    sportFile: {
                      emergencyContactName: c.emergency_contact_name ?? "",
                      emergencyContactPhone: c.emergency_contact_phone ?? "",
                      healthNotes: c.health_notes ?? "",
                      jerseySize: c.jersey_size ?? "",
                      photoConsent: c.photo_consent ?? false,
                      parentalConsentAt: c.parental_consent_at ?? null,
                    },
                  }
                : null,
            };
          }),
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
  category?: string;
  minAge?: number | null;
  maxAge?: number | null;
  genderRestriction?: string | null;
  registrationDeadline?: string | null;
  requiresPaidMembership?: boolean;
  feeAmount?: number | null;
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
    return { status: 400, body: { error: "Titre, date et lieu de l'activité requis." } };
  }
  if (!capacity || !Number.isInteger(capacity) || capacity < 1) {
    return { status: 400, body: { error: "Le nombre de places doit être au moins 1." } };
  }
  const category = data.category ?? "ntic";
  if (!WORKSHOP_CATEGORIES.includes(category)) {
    return { status: 400, body: { error: "Catégorie d'activité invalide." } };
  }
  const minAge = parseAgeLimit(data.minAge) ?? null;
  const maxAge = parseAgeLimit(data.maxAge) ?? null;
  if (minAge === "invalid" || maxAge === "invalid" || (minAge !== null && maxAge !== null && minAge > maxAge)) {
    return { status: 400, body: { error: AGE_LIMIT_ERROR } };
  }
  const options = parseActivityOptions(data, true);
  if ("error" in options) {
    return { status: 400, body: { error: options.error } };
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
      category,
      min_age: minAge,
      max_age: maxAge,
      ...options.columns,
    })
    .select()
    .single();

  if (error) {
    console.error("Admin workshop add failed:", error);
    return { status: 500, body: { error: "Erreur serveur, réessayez dans un instant." } };
  }

  return { status: 200, body: { workshop: { ...mapWorkshopRow(row), registrations: [] } } };
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

export interface AdminWorkshopUpdateBody {
  token?: string;
  id?: string;
  title?: string;
  description?: string;
  startsAt?: string;
  location?: string;
  capacity?: number;
  registrationsOpen?: boolean;
  category?: string;
  minAge?: number | null;
  maxAge?: number | null;
  genderRestriction?: string | null;
  registrationDeadline?: string | null;
  requiresPaidMembership?: boolean;
  feeAmount?: number | null;
}

// Partial update: only the fields present in the body are changed, so the
// open/closed toggle can send just { id, registrationsOpen }.
export async function handleAdminWorkshopUpdate(
  data: AdminWorkshopUpdateBody
): Promise<HandlerResult<{ success?: boolean; error?: string }>> {
  const verification = await verifyAdminSession(data.token);
  if (verification.status !== 200) {
    return { status: verification.status, body: { error: verification.error } };
  }

  const { id, title, description, startsAt, location, capacity, registrationsOpen } = data;
  if (!id) {
    return { status: 400, body: { error: "Identifiant requis" } };
  }

  const updates: Record<string, unknown> = {};
  if (title !== undefined) {
    if (!title.trim()) return { status: 400, body: { error: "Le titre de l'activité est requis." } };
    updates.title = title.trim();
  }
  if (description !== undefined) updates.description = description.trim() || null;
  if (startsAt !== undefined) {
    if (Number.isNaN(Date.parse(startsAt))) return { status: 400, body: { error: "Date invalide." } };
    updates.starts_at = new Date(startsAt).toISOString();
  }
  if (location !== undefined) {
    if (!location.trim()) return { status: 400, body: { error: "Le lieu de l'activité est requis." } };
    updates.location = location.trim();
  }
  if (capacity !== undefined) {
    if (!Number.isInteger(capacity) || capacity < 1) {
      return { status: 400, body: { error: "Le nombre de places doit être au moins 1." } };
    }
    updates.capacity = capacity;
  }
  if (registrationsOpen !== undefined) updates.registrations_open = Boolean(registrationsOpen);
  if (data.category !== undefined) {
    if (!WORKSHOP_CATEGORIES.includes(data.category)) {
      return { status: 400, body: { error: "Catégorie d'activité invalide." } };
    }
    updates.category = data.category;
  }
  // The min <= max check only runs when both are sent together (the edit
  // form always does); otherwise the database constraint still guards it.
  const minAge = parseAgeLimit(data.minAge);
  const maxAge = parseAgeLimit(data.maxAge);
  if (minAge === "invalid" || maxAge === "invalid" || (minAge != null && maxAge != null && minAge > maxAge)) {
    return { status: 400, body: { error: AGE_LIMIT_ERROR } };
  }
  if (minAge !== undefined) updates.min_age = minAge;
  if (maxAge !== undefined) updates.max_age = maxAge;
  const options = parseActivityOptions(data, false);
  if ("error" in options) {
    return { status: 400, body: { error: options.error } };
  }
  Object.assign(updates, options.columns);

  if (Object.keys(updates).length === 0) {
    return { status: 400, body: { error: "Aucune modification fournie" } };
  }

  const supabase = getSupabaseClient()!;

  // Lowering capacity below the confirmed seats would silently overbook the
  // activity — the admin has to remove registrations first. Waitlisted rows
  // don't hold a seat, so they don't count.
  if (capacity !== undefined) {
    const { count, error: countError } = await supabase
      .from("workshop_registrations")
      .select("id", { count: "exact", head: true })
      .eq("workshop_id", id)
      .eq("status", "confirmed");
    if (countError) {
      console.error("Admin workshop registrations count failed:", countError);
      return { status: 500, body: { error: "Erreur serveur, réessayez dans un instant." } };
    }
    if ((count ?? 0) > capacity) {
      return {
        status: 409,
        body: { error: `Impossible : ${count} personnes sont déjà inscrites. Retirez des inscrits d'abord.` },
      };
    }
  }

  const { error } = await supabase.from("workshops").update(updates).eq("id", id);

  if (error) {
    // Check constraint violation (e.g. only one age bound sent, crossing the other).
    if (error.code === "23514") {
      return { status: 400, body: { error: AGE_LIMIT_ERROR } };
    }
    console.error("Admin workshop update failed:", error);
    return { status: 500, body: { error: "Erreur serveur, réessayez dans un instant." } };
  }

  // More seats may let waitlisted families in.
  if (capacity !== undefined) {
    await promoteWaitlist(id);
  }

  return { status: 200, body: { success: true } };
}

export interface AdminWorkshopRegistrationRemoveBody {
  token?: string;
  id?: string;
}

// Removes a single seat (e.g. a family that told the Bureau they can't come).
export async function handleAdminWorkshopRegistrationRemove(
  data: AdminWorkshopRegistrationRemoveBody
): Promise<HandlerResult<{ success?: boolean; error?: string }>> {
  const verification = await verifyAdminSession(data.token);
  if (verification.status !== 200) {
    return { status: verification.status, body: { error: verification.error } };
  }

  if (!data.id) {
    return { status: 400, body: { error: "Identifiant requis" } };
  }

  const supabase = getSupabaseClient()!;
  const { data: deleted, error } = await supabase
    .from("workshop_registrations")
    .delete()
    .eq("id", data.id)
    .select("workshop_id, status");

  if (error) {
    console.error("Admin workshop registration remove failed:", error);
    return { status: 500, body: { error: "Erreur serveur, réessayez dans un instant." } };
  }

  // A freed confirmed seat goes to the first family on the waitlist.
  if (deleted?.[0]?.status === "confirmed") {
    await promoteWaitlist(deleted[0].workshop_id);
  }

  return { status: 200, body: { success: true } };
}

export interface AdminWorkshopRegistrationUpdateBody {
  token?: string;
  id?: string;
  feePaid?: boolean;
  attended?: boolean | null;
}

// Per-seat bookkeeping by the Bureau Exécutif: activity fee received
// (Interac) and attendance on the day (null = not recorded).
export async function handleAdminWorkshopRegistrationUpdate(
  data: AdminWorkshopRegistrationUpdateBody
): Promise<HandlerResult<{ success?: boolean; error?: string }>> {
  const verification = await verifyAdminSession(data.token);
  if (verification.status !== 200) {
    return { status: verification.status, body: { error: verification.error } };
  }

  if (!data.id) {
    return { status: 400, body: { error: "Identifiant requis" } };
  }

  const updates: Record<string, unknown> = {};
  if (data.feePaid !== undefined) updates.fee_paid = Boolean(data.feePaid);
  if (data.attended !== undefined) updates.attended = data.attended === null ? null : Boolean(data.attended);
  if (Object.keys(updates).length === 0) {
    return { status: 400, body: { error: "Aucune modification fournie" } };
  }

  const supabase = getSupabaseClient()!;
  const { error } = await supabase.from("workshop_registrations").update(updates).eq("id", data.id);

  if (error) {
    console.error("Admin workshop registration update failed:", error);
    return { status: 500, body: { error: "Erreur serveur, réessayez dans un instant." } };
  }

  return { status: 200, body: { success: true } };
}
