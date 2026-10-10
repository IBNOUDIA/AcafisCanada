import type { MemberRecord } from "../types";

export const MEMBER_STORAGE_KEY = "acafisMember";

// What every members-only request sends to prove who it is: the session
// token issued after the emailed login code (see handleMemberLogin).
export function memberAuth(member: MemberRecord): { email: string; sessionToken?: string } {
  return { email: member.email, sessionToken: member.sessionToken };
}
