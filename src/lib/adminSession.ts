export const ADMIN_SESSION_KEY = "acafisAdminSession";

export interface AdminSession {
  token: string;
  email: string;
  name: string;
}
