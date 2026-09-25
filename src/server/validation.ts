// Deliberately simple (not a full RFC 5322 regex, which rejects some valid
// addresses while still letting through plenty of garbage) — just enough to
// catch typos and junk before they hit the database or trigger an email send.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: unknown): email is string {
  return typeof email === "string" && email.trim().length <= 254 && EMAIL_REGEX.test(email.trim());
}
