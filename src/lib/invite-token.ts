import { createHash, randomBytes } from "crypto";

/** Opaque secret sent by email (hex, URL-safe). */
export function generateInviteRawToken(): string {
  return randomBytes(32).toString("hex");
}

export function hashInviteToken(rawToken: string): string {
  return createHash("sha256").update(rawToken, "utf8").digest("hex");
}
