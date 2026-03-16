"use server";
import { cookies } from "next/headers";
import { createHash } from "crypto";
import { createAdminToken, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";
import { createServiceClient } from "@/lib/supabase/serviceClient";
import { revalidatePath } from "next/cache";

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export async function adminLogin(username: string, password: string) {
  if (!username.trim() || !password.trim()) return { error: "Username and password are required" };

  const supabase = createServiceClient();
  const { data } = await supabase
    .from("admin_credentials")
    .select("username, password_hash")
    .eq("username", username.trim())
    .single();

  const creds = data as { username: string; password_hash: string } | null;
  if (!creds || hashPassword(password) !== creds.password_hash) {
    return { error: "Invalid username or password" };
  }

  const token = createAdminToken(creds.username);
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
    path: "/",
    sameSite: "lax",
  });

  return { success: true };
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  revalidatePath("/");
  return { success: true };
}

export async function adminChangeCredentials(newUsername: string, newPassword: string) {
  if (!newUsername.trim()) return { error: "Username cannot be empty" };
  if (newPassword.length < 6) return { error: "Password must be at least 6 characters" };

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("admin_credentials")
    .update({ username: newUsername.trim(), password_hash: hashPassword(newPassword) })
    .eq("id", 1);

  if (error) return { error: "Failed to update credentials" };

  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  revalidatePath("/");
  return { success: true };
}
