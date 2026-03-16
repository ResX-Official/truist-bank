"use server";
import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/serviceClient";
import { verifyAdminSession } from "@/lib/adminAuth";

export async function adminAdjustBalance(
  accountId: string,
  amount: number,
  operation: "add" | "subtract" | "set"
) {
  if (!(await verifyAdminSession())) return { error: "Forbidden" };
  const service = createServiceClient();

  const result = await service.from("accounts").select("balance").eq("id", accountId).single();
  const acc = result.data as { balance: number } | null;
  if (!acc) return { error: "Account not found" };

  let newBalance: number;
  if (operation === "add") newBalance = Number(acc.balance) + amount;
  else if (operation === "subtract") newBalance = Math.max(0, Number(acc.balance) - amount);
  else newBalance = amount;

  const { error } = await service.from("accounts").update({ balance: newBalance }).eq("id", accountId);
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { success: true, newBalance };
}

export async function adminSuspendUser(userId: string, suspend: boolean) {
  if (!(await verifyAdminSession())) return { error: "Forbidden" };
  const service = createServiceClient();
  const status = suspend ? "frozen" : "active";
  await service.from("accounts").update({ status }).eq("user_id", userId);
  revalidatePath("/", "layout");
  return { success: true };
}

export async function adminProvideOTP(requestId: string, otp: string) {
  if (!(await verifyAdminSession())) return { error: "Forbidden" };
  if (!otp.trim()) return { error: "OTP cannot be empty" };
  const service = createServiceClient();
  const { error } = await service
    .from("withdrawal_requests")
    .update({ otp: otp.trim() })
    .eq("id", requestId);
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { success: true };
}

export async function adminApproveWithdrawal(requestId: string) {
  if (!(await verifyAdminSession())) return { error: "Forbidden" };
  const service = createServiceClient();
  const { error } = await service
    .from("withdrawal_requests")
    .update({ status: "completed" })
    .eq("id", requestId)
    .eq("status", "processing");
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { success: true };
}

export async function adminRejectWithdrawal(requestId: string, adminNote: string) {
  if (!(await verifyAdminSession())) return { error: "Forbidden" };
  const service = createServiceClient();
  const { error } = await service
    .from("withdrawal_requests")
    .update({ status: "rejected", admin_note: adminNote.trim() || null })
    .eq("id", requestId);
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { success: true };
}
