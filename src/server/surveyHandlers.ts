import { getSupabaseClient } from "./supabaseClient.js";
import { verifyMember } from "./handlers.js";
import { verifyAdminSession } from "./adminHandlers.js";
import { getResendClient, EMAIL_FROM } from "./email.js";
import {
  SurveyAnswers,
  SurveyQuestion,
  SurveyStatus,
  aggregateSurveyResults,
  cleanQuestions,
  effectiveSurveyStatus,
  validateAnswers,
  validateQuestions,
} from "../lib/surveys.js";

interface HandlerResult<T> {
  status: number;
  body: T;
}

const SERVER_ERROR = "Erreur serveur, réessayez dans un instant.";

function surveyState(row: Record<string, any>): SurveyStatus {
  return effectiveSurveyStatus(row.status, row.closes_at ?? null);
}

// ---------------------------------------------------------------------------
// Member side
// ---------------------------------------------------------------------------

export interface MemberSurveysBody {
  email?: string;
  memberId?: string;
}

// Published surveys (drafts stay hidden). Questions are only sent for surveys
// the member can still answer.
export async function handleMemberSurveysList(
  data: MemberSurveysBody,
  ip: string
): Promise<HandlerResult<{ surveys?: Record<string, unknown>[]; error?: string }>> {
  const verification = await verifyMember(data.email, data.memberId, ip);
  if (verification.status !== 200) {
    return { status: verification.status, body: { error: verification.body.error } };
  }

  const memberId = verification.body.member!.memberId as string;
  const supabase = getSupabaseClient()!;
  const [{ data: rows, error }, { data: mine, error: mineError }] = await Promise.all([
    supabase.from("surveys").select("*").in("status", ["open", "closed"]).order("published_at", { ascending: false }),
    supabase.from("survey_participants").select("survey_id").eq("member_id", memberId),
  ]);

  if (error || mineError) {
    console.error("Member surveys list failed:", error || mineError);
    return { status: 500, body: { error: SERVER_ERROR } };
  }

  const answered = new Set((mine || []).map((p: Record<string, any>) => p.survey_id));
  return {
    status: 200,
    body: {
      surveys: (rows || []).map((row: Record<string, any>) => {
        const state = surveyState(row);
        const hasAnswered = answered.has(row.id);
        return {
          id: row.id,
          title: row.title,
          description: row.description,
          isAnonymous: row.is_anonymous,
          closesAt: row.closes_at,
          state,
          hasAnswered,
          resultsAvailable: state === "closed" && row.results_visible === true,
          questions: state === "open" && !hasAnswered ? row.questions : [],
        };
      }),
    },
  };
}

export interface MemberSurveySubmitBody extends MemberSurveysBody {
  surveyId?: string;
  answers?: unknown;
}

const SUBMIT_ERRORS: Record<string, { status: number; error: string }> = {
  survey_not_found: { status: 404, error: "Sondage introuvable." },
  survey_closed: { status: 409, error: "Ce sondage est clôturé." },
  already_answered: { status: 409, error: "Vous avez déjà répondu à ce sondage." },
};

export async function handleMemberSurveySubmit(
  data: MemberSurveySubmitBody,
  ip: string
): Promise<HandlerResult<{ success?: boolean; error?: string }>> {
  const verification = await verifyMember(data.email, data.memberId, ip);
  if (verification.status !== 200) {
    return { status: verification.status, body: { error: verification.body.error } };
  }
  if (!data.surveyId) {
    return { status: 400, body: { error: "Identifiant de sondage requis" } };
  }

  const supabase = getSupabaseClient()!;
  const { data: survey, error } = await supabase.from("surveys").select("*").eq("id", data.surveyId).maybeSingle();
  if (error) {
    console.error("Member survey lookup failed:", error);
    return { status: 500, body: { error: SERVER_ERROR } };
  }
  if (!survey || survey.status === "draft") {
    return { status: 404, body: { error: SUBMIT_ERRORS.survey_not_found.error } };
  }

  const checked = validateAnswers(survey.questions as SurveyQuestion[], data.answers);
  if ("error" in checked) {
    return { status: 400, body: { error: checked.error } };
  }

  // Status, closing date and "only once" are enforced atomically in the RPC.
  const { error: rpcError } = await supabase.rpc("submit_survey_response", {
    p_survey_id: data.surveyId,
    p_member_id: verification.body.member!.memberId as string,
    p_answers: checked.answers,
  });
  if (rpcError) {
    const known = Object.keys(SUBMIT_ERRORS).find((code) => rpcError.message?.includes(code));
    if (known) return { status: SUBMIT_ERRORS[known].status, body: { error: SUBMIT_ERRORS[known].error } };
    console.error("Supabase submit_survey_response failed:", rpcError);
    return { status: 500, body: { error: SERVER_ERROR } };
  }

  return { status: 200, body: { success: true } };
}

export interface MemberSurveyResultsBody extends MemberSurveysBody {
  surveyId?: string;
}

// Aggregated results of a closed survey the Bureau chose to share. Free-text
// answers are withheld: in a small community they can identify their author.
export async function handleMemberSurveyResults(
  data: MemberSurveyResultsBody,
  ip: string
): Promise<HandlerResult<{ results?: Record<string, unknown>; error?: string }>> {
  const verification = await verifyMember(data.email, data.memberId, ip);
  if (verification.status !== 200) {
    return { status: verification.status, body: { error: verification.body.error } };
  }
  if (!data.surveyId) {
    return { status: 400, body: { error: "Identifiant de sondage requis" } };
  }

  const supabase = getSupabaseClient()!;
  const { data: survey, error } = await supabase.from("surveys").select("*").eq("id", data.surveyId).maybeSingle();
  if (error) {
    console.error("Member survey results lookup failed:", error);
    return { status: 500, body: { error: SERVER_ERROR } };
  }
  if (!survey || surveyState(survey) !== "closed" || survey.results_visible !== true) {
    return { status: 403, body: { error: "Les résultats de ce sondage ne sont pas publiés." } };
  }

  const { data: responses, error: responsesError } = await supabase
    .from("survey_responses")
    .select("answers")
    .eq("survey_id", data.surveyId);
  if (responsesError) {
    console.error("Member survey responses lookup failed:", responsesError);
    return { status: 500, body: { error: SERVER_ERROR } };
  }

  return {
    status: 200,
    body: {
      results: {
        respondents: (responses || []).length,
        questions: aggregateSurveyResults(
          survey.questions as SurveyQuestion[],
          (responses || []).map((r: Record<string, any>) => r.answers as SurveyAnswers),
          false
        ),
      },
    },
  };
}

// ---------------------------------------------------------------------------
// Admin side (Bureau Exécutif)
// ---------------------------------------------------------------------------

export interface AdminSurveysListBody {
  token?: string;
}

export async function handleAdminSurveysList(
  data: AdminSurveysListBody
): Promise<HandlerResult<{ surveys?: Record<string, unknown>[]; memberCount?: number; error?: string }>> {
  const verification = await verifyAdminSession(data.token);
  if (verification.status !== 200) {
    return { status: verification.status, body: { error: verification.error } };
  }

  const supabase = getSupabaseClient()!;
  const [{ data: rows, error }, { data: participants, error: pError }, { count: memberCount, error: mError }] =
    await Promise.all([
      supabase.from("surveys").select("*").order("created_at", { ascending: false }),
      supabase.from("survey_participants").select("survey_id"),
      supabase.from("members").select("member_id", { count: "exact", head: true }),
    ]);

  if (error || pError || mError) {
    console.error("Admin surveys list failed:", error || pError || mError);
    return { status: 500, body: { error: SERVER_ERROR } };
  }

  const counts = new Map<string, number>();
  for (const p of participants || []) counts.set(p.survey_id, (counts.get(p.survey_id) || 0) + 1);

  return {
    status: 200,
    body: {
      memberCount: memberCount ?? 0,
      surveys: (rows || []).map((row: Record<string, any>) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        questions: row.questions,
        isAnonymous: row.is_anonymous,
        resultsVisible: row.results_visible,
        status: row.status,
        state: surveyState(row),
        closesAt: row.closes_at,
        publishedAt: row.published_at,
        participantCount: counts.get(row.id) || 0,
      })),
    },
  };
}

export interface AdminSurveySaveBody {
  token?: string;
  id?: string; // absent = create
  title?: string;
  description?: string;
  questions?: SurveyQuestion[];
  isAnonymous?: boolean;
  resultsVisible?: boolean;
  closesAt?: string | null;
}

// Creates a draft or updates one. Once published, only the closing date and
// results visibility can still change: the questions and anonymity are what
// members agreed to when answering.
export async function handleAdminSurveySave(
  data: AdminSurveySaveBody
): Promise<HandlerResult<{ id?: string; error?: string }>> {
  const verification = await verifyAdminSession(data.token);
  if (verification.status !== 200) {
    return { status: verification.status, body: { error: verification.error } };
  }

  if (data.closesAt && Number.isNaN(Date.parse(data.closesAt))) {
    return { status: 400, body: { error: "Date de clôture invalide." } };
  }
  const closesAt = data.closesAt ? new Date(data.closesAt).toISOString() : null;

  const supabase = getSupabaseClient()!;
  let existing: Record<string, any> | null = null;
  if (data.id) {
    const { data: row, error } = await supabase.from("surveys").select("status").eq("id", data.id).maybeSingle();
    if (error) {
      console.error("Admin survey lookup failed:", error);
      return { status: 500, body: { error: SERVER_ERROR } };
    }
    if (!row) return { status: 404, body: { error: "Sondage introuvable." } };
    existing = row;
  }

  let columns: Record<string, unknown>;
  if (existing && existing.status !== "draft") {
    columns = { closes_at: closesAt, results_visible: Boolean(data.resultsVisible) };
  } else {
    if (!data.title?.trim() || data.title.length > 200) {
      return { status: 400, body: { error: "Le titre est requis (200 caractères au plus)." } };
    }
    const questionsError = validateQuestions(data.questions);
    if (questionsError) return { status: 400, body: { error: questionsError } };
    columns = {
      title: data.title.trim(),
      description: data.description?.trim().slice(0, 2000) || null,
      questions: cleanQuestions(data.questions!),
      is_anonymous: Boolean(data.isAnonymous),
      results_visible: Boolean(data.resultsVisible),
      closes_at: closesAt,
    };
  }

  const query = existing
    ? supabase.from("surveys").update(columns).eq("id", data.id!).select("id").single()
    : supabase.from("surveys").insert(columns).select("id").single();
  const { data: saved, error } = await query;
  if (error) {
    console.error("Admin survey save failed:", error);
    return { status: 500, body: { error: SERVER_ERROR } };
  }

  return { status: 200, body: { id: saved.id } };
}

export interface AdminSurveyStatusBody {
  token?: string;
  id?: string;
  status?: SurveyStatus;
}

// draft -> open (publish), open -> closed, closed -> open (reopen, e.g. to
// extend). Going back to draft is not allowed: questions would change under
// people who already answered.
export async function handleAdminSurveySetStatus(
  data: AdminSurveyStatusBody
): Promise<HandlerResult<{ success?: boolean; error?: string }>> {
  const verification = await verifyAdminSession(data.token);
  if (verification.status !== 200) {
    return { status: verification.status, body: { error: verification.error } };
  }
  if (!data.id || (data.status !== "open" && data.status !== "closed")) {
    return { status: 400, body: { error: "Requête invalide" } };
  }

  const supabase = getSupabaseClient()!;
  const { data: row, error } = await supabase
    .from("surveys")
    .select("status, published_at, closes_at")
    .eq("id", data.id)
    .maybeSingle();
  if (error) {
    console.error("Admin survey status lookup failed:", error);
    return { status: 500, body: { error: SERVER_ERROR } };
  }
  if (!row) return { status: 404, body: { error: "Sondage introuvable." } };

  const updates: Record<string, unknown> = { status: data.status };
  if (data.status === "open") {
    if (!row.published_at) updates.published_at = new Date().toISOString();
    // Reopening a survey whose closing date has passed would close it again
    // immediately: drop the date (the Bureau can set a new one).
    if (row.closes_at && new Date(row.closes_at).getTime() <= Date.now()) updates.closes_at = null;
  }

  const { error: updateError } = await supabase.from("surveys").update(updates).eq("id", data.id);
  if (updateError) {
    console.error("Admin survey status update failed:", updateError);
    return { status: 500, body: { error: SERVER_ERROR } };
  }
  return { status: 200, body: { success: true } };
}

export interface AdminSurveyAnnounceBody {
  token?: string;
  id?: string;
}

const MEMBER_AREA_URL = "https://www.acafis.ca/espace-membre";

// Emails every member who hasn't answered an open survey yet — the first
// announcement and any later reminder are the same action. Members with a
// placeholder @acafis.invalid address are skipped. Resend's batch API sends
// up to 100 emails per request, keeping this well within Vercel's timeout.
export async function handleAdminSurveyAnnounce(
  data: AdminSurveyAnnounceBody
): Promise<HandlerResult<{ sent?: number; error?: string }>> {
  const verification = await verifyAdminSession(data.token);
  if (verification.status !== 200) {
    return { status: verification.status, body: { error: verification.error } };
  }
  if (!data.id) return { status: 400, body: { error: "Identifiant requis" } };

  const resend = getResendClient();
  if (!resend) {
    return { status: 503, body: { error: "L'envoi de courriels n'est pas configuré (RESEND_API_KEY manquante)." } };
  }

  const supabase = getSupabaseClient()!;
  const [{ data: survey, error }, { data: members, error: mError }, { data: participants, error: pError }] =
    await Promise.all([
      supabase.from("surveys").select("*").eq("id", data.id).maybeSingle(),
      supabase.from("members").select("member_id, first_name, email"),
      supabase.from("survey_participants").select("member_id").eq("survey_id", data.id),
    ]);
  if (error || mError || pError) {
    console.error("Admin survey announce lookup failed:", error || mError || pError);
    return { status: 500, body: { error: SERVER_ERROR } };
  }
  if (!survey) return { status: 404, body: { error: "Sondage introuvable." } };
  if (surveyState(survey) !== "open") {
    return { status: 409, body: { error: "Seul un sondage ouvert peut être annoncé." } };
  }

  const answered = new Set((participants || []).map((p: Record<string, any>) => p.member_id));
  const recipients = (members || []).filter(
    (m: Record<string, any>) => m.email && !m.email.endsWith("@acafis.invalid") && !answered.has(m.member_id)
  );

  const closing = survey.closes_at
    ? `Vous avez jusqu'au ${new Date(survey.closes_at).toLocaleString("fr-CA", {
        dateStyle: "long",
        timeStyle: "short",
        timeZone: "America/Toronto",
      })} pour répondre.`
    : "";

  let sent = 0;
  for (let i = 0; i < recipients.length; i += 100) {
    const chunk = recipients.slice(i, i + 100);
    const { error: sendError } = await resend.batch.send(
      chunk.map((m: Record<string, any>) => ({
        from: EMAIL_FROM,
        to: m.email,
        replyTo: "infos@acafis.ca",
        subject: `[ACAFIS] Votre avis compte : ${survey.title}`,
        text: [
          `Bonjour ${m.first_name},`,
          "",
          `Le Bureau Exécutif d'ACAFIS Canada sollicite votre avis : « ${survey.title} ».`,
          ...(survey.description ? ["", survey.description] : []),
          "",
          survey.is_anonymous
            ? "Ce sondage est anonyme : vos réponses ne seront pas liées à votre nom."
            : "Ce sondage est nominatif : le Bureau verra vos réponses avec votre nom.",
          ...(closing ? [closing] : []),
          "",
          `Pour répondre, connectez-vous à votre Espace Membre : ${MEMBER_AREA_URL}`,
          `(avec votre courriel ${m.email} et votre numéro de membre ${m.member_id}).`,
          "",
          "Merci de votre participation,",
          "Le Bureau Exécutif d'ACAFIS Canada",
        ].join("\n"),
      }))
    );
    if (sendError) {
      console.error("Resend survey announce batch failed:", sendError);
      return { status: 502, body: { sent, error: `Envoi interrompu après ${sent} courriel(s) : ${sendError.message}` } };
    }
    sent += chunk.length;
  }

  return { status: 200, body: { sent } };
}

export interface AdminSurveyDeleteBody {
  token?: string;
  id?: string;
}

export async function handleAdminSurveyDelete(
  data: AdminSurveyDeleteBody
): Promise<HandlerResult<{ success?: boolean; error?: string }>> {
  const verification = await verifyAdminSession(data.token);
  if (verification.status !== 200) {
    return { status: verification.status, body: { error: verification.error } };
  }
  if (!data.id) return { status: 400, body: { error: "Identifiant requis" } };

  const supabase = getSupabaseClient()!;
  // Participants and responses go with it (on delete cascade).
  const { error } = await supabase.from("surveys").delete().eq("id", data.id);
  if (error) {
    console.error("Admin survey delete failed:", error);
    return { status: 500, body: { error: SERVER_ERROR } };
  }
  return { status: 200, body: { success: true } };
}

export interface AdminSurveyResultsBody {
  token?: string;
  id?: string;
}

// Full results for the Bureau: aggregates with free-text answers, and every
// response for the CSV export — with the member's name unless anonymous.
export async function handleAdminSurveyResults(
  data: AdminSurveyResultsBody
): Promise<HandlerResult<{ results?: Record<string, unknown>; error?: string }>> {
  const verification = await verifyAdminSession(data.token);
  if (verification.status !== 200) {
    return { status: verification.status, body: { error: verification.error } };
  }
  if (!data.id) return { status: 400, body: { error: "Identifiant requis" } };

  const supabase = getSupabaseClient()!;
  const [{ data: survey, error }, { data: responses, error: rError }] = await Promise.all([
    supabase.from("surveys").select("*").eq("id", data.id).maybeSingle(),
    supabase
      .from("survey_responses")
      .select("id, answers, members (member_id, first_name, last_name)")
      .eq("survey_id", data.id),
  ]);
  if (error || rError) {
    console.error("Admin survey results failed:", error || rError);
    return { status: 500, body: { error: SERVER_ERROR } };
  }
  if (!survey) return { status: 404, body: { error: "Sondage introuvable." } };

  const rows = (responses || []) as Array<Record<string, any>>;
  return {
    status: 200,
    body: {
      results: {
        respondents: rows.length,
        questions: aggregateSurveyResults(
          survey.questions as SurveyQuestion[],
          rows.map((r) => r.answers as SurveyAnswers),
          true
        ),
        responses: rows.map((r) => ({
          member: r.members ? `${r.members.first_name} ${r.members.last_name} (${r.members.member_id})` : null,
          answers: r.answers,
        })),
      },
    },
  };
}
