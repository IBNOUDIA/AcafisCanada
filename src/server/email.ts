import { Resend } from "resend";

// Lazy Resend client initialization
let resendClient: Resend | null = null;
export function getResendClient(): Resend | null {
  if (!resendClient && process.env.RESEND_API_KEY) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

// acafis.ca is verified in Resend, so any address @acafis.ca can send (no
// mailbox needed). RESEND_FROM_EMAIL still overrides it if set in Vercel.
export const EMAIL_FROM = process.env.RESEND_FROM_EMAIL || "ACAFIS Canada <notifications@acafis.ca>";
