import { cookies } from "next/headers";
import { createHmac } from "crypto";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "trust-bank-admin-secret-2026";
const COOKIE_NAME = "trust_admin_session";

export async function verifyAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const value = cookieStore.get(COOKIE_NAME)?.value;
    if (!value) return false;

    const parts = value.split(".");
    if (parts.length !== 3) return false;

    const [username, timestamp, signature] = parts;
    const ts = parseInt(timestamp, 10);
    if (isNaN(ts) || Date.now() - ts > 24 * 60 * 60 * 1000) return false;

    const expected = createHmac("sha256", ADMIN_SECRET)
      .update(`${username}.${timestamp}`)
      .digest("hex");

    return signature === expected;
  } catch {
    return false;
  }
}

export function createAdminToken(username: string): string {
  const timestamp = Date.now().toString();
  const signature = createHmac("sha256", ADMIN_SECRET)
    .update(`${username}.${timestamp}`)
    .digest("hex");
  return `${username}.${timestamp}.${signature}`;
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
