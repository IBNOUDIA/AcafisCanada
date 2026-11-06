import { getSupabaseClient } from "./supabaseClient.js";
import { verifyAdminSession } from "./adminHandlers.js";
import { getResendClient, EMAIL_FROM } from "./email.js";

interface HandlerResult<T> {
  status: number;
  body: T;
}

const SERVER_ERROR = "Erreur serveur, réessayez dans un instant.";

// Who a group message goes to. Members with a placeholder @acafis.invalid
// address are never included: they have no mailbox yet. "bureau" is the
// Bureau Exécutif (see BUREAU_NAMES) plus the active admin accounts; "custom"
// is the members the admin ticked one by one.
export const MESSAGE_AUDIENCES = ["all", "coop", "paid", "bureau", "custom"] as const;
type Audience = (typeof MESSAGE_AUDIENCES)[number];

const MAX_SUBJECT = 150;
const MAX_BODY = 5000;
// Resend's free plan allows 100 emails a day.
const MAX_CUSTOM = 100;

// The 11 members of the Bureau Exécutif, as on the site's Bureau page
// (BUREAU_MEMBERS in src/data/acafisData.ts, which can't be imported here
// because it pulls in images). Keep both lists in sync.
const BUREAU_NAMES = [
  "Moustapha Sane",
  "Omar Cisse",
  "Ablaye Diatta",
  "Adama Sow",
  "Landiata Dieme",
  "Pa Sonko",
  "Ibrahima Diop",
  "Ibnou Amar Dia",
  "Mounirou Dieme",
  "Ngoma Dhiediou",
  "Cire Aw",
];

// Bureau names whose member record uses another name.
const BUREAU_ALIASES: Record<string, string[]> = {
  "Ablaye Diatta": ["Abdoulaye Diatta"],
  "Ngoma Dhiediou": ["Mariama Diédhiou"],
};

interface Recipient {
  member_id: string;
  first_name: string;
  last_name?: string;
  email: string;
  is_coop_member?: boolean;
  payment_status?: string;
}

async function loadRecipients(): Promise<Recipient[] | null> {
  const supabase = getSupabaseClient()!;
  const { data, error } = await supabase.from("members").select("*");
  if (error) {
    console.error("Admin messages members lookup failed:", error);
    return null;
  }
  return ((data || []) as Recipient[]).filter((m) => m.email && !m.email.endsWith("@acafis.invalid"));
}

function nameWords(name: string): string[] {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

// True when a full name (two words at least) is this Bureau name, in any
// word order, or a shorter form of it: "Amar Dia" for "Ibnou Amar Dia".
function matchesBureauName(fullName: string, bureauName: string): boolean {
  const words = nameWords(fullName);
  const bureauWords = nameWords(bureauName);
  return words.length >= 2 && words.every((w) => bureauWords.includes(w));
}

function matchesBureauMember(fullName: string, bureauName: string): boolean {
  return [bureauName, ...(BUREAU_ALIASES[bureauName] || [])].some((name) => matchesBureauName(fullName, name));
}

// The Bureau = active admin accounts (missing is_active = active), greeted
// by the first word of their name, plus the members named in BUREAU_NAMES.
// `missing` lists the names found nowhere with a real email.
async function loadBureau(members: Recipient[]): Promise<{ people: Recipient[]; missing: string[] } | null> {
  const supabase = getSupabaseClient()!;
  const { data, error } = await supabase.from("admins").select("*");
  if (error) {
    console.error("Admin messages bureau lookup failed:", error);
    return null;
  }
  const people: Recipient[] = ((data || []) as Record<string, any>[])
    .filter((a) => a.is_active !== false && a.email)
    .map((a) => ({
      member_id: a.email,
      first_name: String(a.name || "").split(" ")[0] || a.name,
      last_name: String(a.name || "").split(" ").slice(1).join(" "),
      email: a.email,
    }));
  const emails = new Set(people.map((p) => p.email.toLowerCase()));
  for (const m of members) {
    const fullName = `${m.first_name} ${m.last_name || ""}`;
    if (emails.has(m.email.toLowerCase())) continue;
    if (BUREAU_NAMES.some((name) => matchesBureauMember(fullName, name))) {
      people.push(m);
      emails.add(m.email.toLowerCase());
    }
  }
  const missing = BUREAU_NAMES.filter(
    (name) => !people.some((p) => matchesBureauMember(`${p.first_name} ${p.last_name || ""}`, name))
  );
  return { people, missing };
}

function inAudience(m: Recipient, audience: Audience): boolean {
  if (audience === "coop") return m.is_coop_member === true;
  if (audience === "paid") return m.payment_status === "paid";
  return audience === "all";
}

function pickable(m: Recipient) {
  return { id: m.member_id, name: `${m.first_name} ${m.last_name || ""}`.trim(), email: m.email };
}

function messageText(firstName: string, body: string): string {
  return [
    `Bonjour ${firstName},`,
    "",
    body.trim(),
    "",
    "—",
    "Vous recevez ce message en tant que membre d'ACAFIS Canada.",
    "Pour répondre au Bureau Exécutif, répondez simplement à ce courriel (infos@acafis.ca).",
    "Espace Membre : https://www.acafis.ca/espace-membre",
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Audience sizes + history, for the Messages tab
// ---------------------------------------------------------------------------

export interface AdminMessagesListBody {
  token?: string;
}

export async function handleAdminMessagesList(data: AdminMessagesListBody): Promise<
  HandlerResult<{
    audiences?: Record<Audience, number>;
    members?: { id: string; name: string; email: string }[];
    bureau?: { id: string; name: string; email: string }[];
    bureauMissing?: string[];
    history?: Record<string, unknown>[];
    historyError?: string;
    error?: string;
  }>
> {
  const verification = await verifyAdminSession(data.token);
  if (verification.status !== 200) {
    return { status: verification.status, body: { error: verification.error } };
  }

  const recipients = await loadRecipients();
  const bureau = recipients && (await loadBureau(recipients));
  if (!recipients || !bureau) return { status: 500, body: { error: SERVER_ERROR } };

  const audiences = Object.fromEntries(
    MESSAGE_AUDIENCES.map((a) => [a, recipients.filter((m) => inAudience(m, a)).length])
  ) as Record<Audience, number>;
  audiences.bureau = bureau.people.length;
  const byName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name, "fr");

  const supabase = getSupabaseClient()!;
  const { data: rows, error } = await supabase
    .from("member_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);
  // A missing history table must not hide the audience counts.
  if (error) console.error("Admin messages history lookup failed:", error);

  return {
    status: 200,
    body: {
      audiences,
      members: recipients.map(pickable).sort(byName),
      bureau: bureau.people.map(pickable).sort(byName),
      bureauMissing: bureau.missing,
      historyError: error ? error.message : undefined,
      history: (rows || []).map((r: Record<string, any>) => ({
        id: r.id,
        subject: r.subject,
        audience: r.audience,
        sentCount: r.sent_count,
        sentBy: r.sent_by_name,
        createdAt: r.created_at,
      })),
    },
  };
}

// ---------------------------------------------------------------------------
// Send (or send a test to the admin themself)
// ---------------------------------------------------------------------------

export interface AdminMessageSendBody {
  token?: string;
  subject?: string;
  body?: string;
  audience?: string;
  // Only for audience "custom": the member_id of each ticked member.
  memberIds?: string[];
  test?: boolean;
}

export async function handleAdminMessageSend(
  data: AdminMessageSendBody
): Promise<HandlerResult<{ sent?: number; historyError?: string; error?: string }>> {
  const verification = await verifyAdminSession(data.token);
  if (verification.status !== 200) {
    return { status: verification.status, body: { error: verification.error } };
  }
  const admin = verification.admin!;

  const subject = (data.subject || "").trim();
  const body = (data.body || "").trim();
  if (!subject || subject.length > MAX_SUBJECT) {
    return { status: 400, body: { error: `L'objet est requis (${MAX_SUBJECT} caractères au plus).` } };
  }
  if (!body || body.length > MAX_BODY) {
    return { status: 400, body: { error: `Le message est requis (${MAX_BODY} caractères au plus).` } };
  }
  const audience = data.audience as Audience;
  if (!MESSAGE_AUDIENCES.includes(audience)) {
    return { status: 400, body: { error: "Groupe de destinataires invalide." } };
  }
  const memberIds = new Set(Array.isArray(data.memberIds) ? data.memberIds.map(String) : []);
  if (!data.test && audience === "custom" && (memberIds.size === 0 || memberIds.size > MAX_CUSTOM)) {
    return { status: 400, body: { error: `Cochez entre 1 et ${MAX_CUSTOM} destinataires.` } };
  }

  const resend = getResendClient();
  if (!resend) {
    return { status: 503, body: { error: "L'envoi de courriels n'est pas configuré (RESEND_API_KEY manquante)." } };
  }

  // Test: only to the logged-in admin, with their name, not recorded.
  if (data.test) {
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: admin.email,
      replyTo: "infos@acafis.ca",
      subject: `[TEST] ${subject}`,
      text: messageText(admin.name.split(" ")[0] || admin.name, body),
    });
    if (error) {
      console.error("Resend test message failed:", error);
      return { status: 502, body: { error: `Envoi du test impossible : ${error.message}` } };
    }
    return { status: 200, body: { sent: 1 } };
  }

  const all = await loadRecipients();
  const bureau = audience === "bureau" && all ? await loadBureau(all) : null;
  if (!all || (audience === "bureau" && !bureau)) return { status: 500, body: { error: SERVER_ERROR } };
  const recipients =
    audience === "bureau"
      ? bureau!.people
      : audience === "custom"
        ? all.filter((m) => memberIds.has(m.member_id))
        : all.filter((m) => inAudience(m, audience));
  if (recipients.length === 0) {
    return { status: 400, body: { error: "Aucun destinataire avec un courriel dans ce groupe." } };
  }

  // Resend's batch API takes up to 100 emails per request.
  let sent = 0;
  for (let i = 0; i < recipients.length; i += 100) {
    const chunk = recipients.slice(i, i + 100);
    const { error } = await resend.batch.send(
      chunk.map((m) => ({
        from: EMAIL_FROM,
        to: m.email,
        replyTo: "infos@acafis.ca",
        subject,
        text: messageText(m.first_name, body),
      }))
    );
    if (error) {
      console.error("Resend group message batch failed:", error);
      if (sent > 0) await recordMessage(subject, body, audience, sent, admin);
      return { status: 502, body: { sent, error: `Envoi interrompu après ${sent} courriel(s) : ${error.message}` } };
    }
    sent += chunk.length;
  }

  const historyError = await recordMessage(subject, body, audience, sent, admin);
  return { status: 200, body: { sent, historyError } };
}

async function recordMessage(
  subject: string,
  body: string,
  audience: Audience,
  sent: number,
  admin: { email: string; name: string }
): Promise<string | undefined> {
  const supabase = getSupabaseClient()!;
  const { error } = await supabase.from("member_messages").insert({
    subject,
    body,
    audience,
    sent_count: sent,
    sent_by_email: admin.email,
    sent_by_name: admin.name,
  });
  // The emails are already out: a failed history write must not fail the
  // send, but the admin is told so the message doesn't silently go missing.
  if (error) console.error("Admin message history insert failed:", error);
  return error?.message;
}
