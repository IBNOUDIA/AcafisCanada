import { getSupabaseClient } from "./supabaseClient.js";
import { verifyAdminSession } from "./adminHandlers.js";
import { getResendClient, EMAIL_FROM } from "./email.js";

interface HandlerResult<T> {
  status: number;
  body: T;
}

const SERVER_ERROR = "Erreur serveur, réessayez dans un instant.";

// Who a group message goes to. Members with a placeholder @acafis.invalid
// address are never included: they have no mailbox yet.
export const MESSAGE_AUDIENCES = ["all", "coop", "paid"] as const;
type Audience = (typeof MESSAGE_AUDIENCES)[number];

const MAX_SUBJECT = 150;
const MAX_BODY = 5000;

interface Recipient {
  member_id: string;
  first_name: string;
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

function inAudience(m: Recipient, audience: Audience): boolean {
  if (audience === "coop") return m.is_coop_member === true;
  if (audience === "paid") return m.payment_status === "paid";
  return true;
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
    history?: Record<string, unknown>[];
    error?: string;
  }>
> {
  const verification = await verifyAdminSession(data.token);
  if (verification.status !== 200) {
    return { status: verification.status, body: { error: verification.error } };
  }

  const recipients = await loadRecipients();
  if (!recipients) return { status: 500, body: { error: SERVER_ERROR } };

  const audiences = Object.fromEntries(
    MESSAGE_AUDIENCES.map((a) => [a, recipients.filter((m) => inAudience(m, a)).length])
  ) as Record<Audience, number>;

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
  test?: boolean;
}

export async function handleAdminMessageSend(
  data: AdminMessageSendBody
): Promise<HandlerResult<{ sent?: number; error?: string }>> {
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
  if (!all) return { status: 500, body: { error: SERVER_ERROR } };
  const recipients = all.filter((m) => inAudience(m, audience));
  if (recipients.length === 0) {
    return { status: 400, body: { error: "Aucun membre avec un courriel dans ce groupe." } };
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

  await recordMessage(subject, body, audience, sent, admin);
  return { status: 200, body: { sent } };
}

async function recordMessage(
  subject: string,
  body: string,
  audience: Audience,
  sent: number,
  admin: { email: string; name: string }
) {
  const supabase = getSupabaseClient()!;
  const { error } = await supabase.from("member_messages").insert({
    subject,
    body,
    audience,
    sent_count: sent,
    sent_by_email: admin.email,
    sent_by_name: admin.name,
  });
  // The emails are already out: a failed history write is only logged.
  if (error) console.error("Admin message history insert failed:", error);
}
