import { getSupabaseClient } from "./supabaseClient.js";
import { getResendClient, EMAIL_FROM } from "./email.js";

// Fills freed seats of an activity from its waitlist (oldest first, see
// promote_workshop_waitlist in supabase/schema.sql) and emails each promoted
// family. Called after a cancellation, an admin removal or a capacity
// increase. Never throws: a failed promotion or email must not fail the
// request that freed the seat — the next freed seat retries the promotion.
export async function promoteWaitlist(workshopId: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  const { data: promoted, error } = await supabase.rpc("promote_workshop_waitlist", {
    p_workshop_id: workshopId,
  });
  if (error) {
    console.error("Supabase promote_workshop_waitlist failed:", error);
    return;
  }
  if (!promoted || promoted.length === 0) return;

  const resend = getResendClient();
  if (!resend) {
    console.log(`[Waitlist - RESEND_API_KEY absent] ${promoted.length} place(s) attribuée(s), aucun courriel envoyé`);
    return;
  }

  const { data: rows } = await supabase
    .from("workshop_registrations")
    .select("id, workshops (title, starts_at, location), members (first_name, email), member_children (first_name)")
    .in(
      "id",
      promoted.map((r: { id: string }) => r.id)
    );

  for (const row of (rows || []) as Array<Record<string, any>>) {
    const email: string | undefined = row.members?.email;
    // Imported members without a known address get a placeholder (@acafis.invalid).
    if (!email || email.endsWith("@acafis.invalid")) continue;

    const who = row.member_children ? row.member_children.first_name || "Votre enfant" : "Vous";
    const when = new Date(row.workshops.starts_at).toLocaleString("fr-CA", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "America/Toronto",
    });

    try {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: email,
        subject: `[ACAFIS] Une place s'est libérée — ${row.workshops.title}`,
        text: [
          `Bonjour ${row.members.first_name},`,
          "",
          `Bonne nouvelle : une place s'est libérée. ${who} ${who === "Vous" ? "êtes" : "est"} maintenant inscrit(e) à l'activité « ${row.workshops.title} ».`,
          "",
          `Date : ${when}`,
          `Lieu : ${row.workshops.location}`,
          "",
          "Si vous ne pouvez plus y participer, annulez l'inscription depuis votre Espace Membre pour laisser la place à la famille suivante.",
          "",
          "ACAFIS Canada",
        ].join("\n"),
      });
    } catch (sendError) {
      console.error("Resend waitlist promotion email failed:", sendError);
    }
  }
}
