"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/serviceClient";
import { verifyAdminSession } from "@/lib/adminAuth";

export async function sendSupportMessage(message: string) {
  if (!message.trim()) return { error: "Message cannot be empty" };
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  let user = authData?.user;
  if (!user) {
    const { data: sessionData } = await supabase.auth.getSession();
    user = sessionData?.session?.user ?? null;
  }
  if (!user) return { error: "Unauthorized" };

  const service = createServiceClient();
  const { error } = await service.from("support_messages").insert({
    user_id: user.id,
    message: message.trim(),
    sender_type: "user",
  });
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { success: true };
}

export async function adminSendSupportMessage(userId: string, message: string) {
  if (!(await verifyAdminSession())) return { error: "Forbidden" };
  if (!message.trim()) return { error: "Message cannot be empty" };

  const service = createServiceClient();
  const { error } = await service.from("support_messages").insert({
    user_id: userId,
    message: message.trim(),
    sender_type: "admin",
  });
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { success: true };
}

export async function fetchUserSupportMessages(userId: string) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  let user = authData?.user;
  if (!user) {
    const { data: sessionData } = await supabase.auth.getSession();
    user = sessionData?.session?.user ?? null;
  }
  if (!user || user.id !== userId) return null;
  const service = createServiceClient();
  const { data } = await service
    .from("support_messages")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });
  return data;
}

export async function adminFetchAllSupportMessages() {
  if (!(await verifyAdminSession())) return null;
  const service = createServiceClient();
  const { data } = await service
    .from("support_messages")
    .select("*")
    .order("created_at", { ascending: true });
  return data;
}

export async function markSupportMessagesRead(userId: string) {
  const service = createServiceClient();
  await service
    .from("support_messages")
    .update({ read: true })
    .eq("user_id", userId)
    .eq("sender_type", "user")
    .eq("read", false);
  return { success: true };
}
