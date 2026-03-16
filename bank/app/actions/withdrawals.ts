"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/serviceClient";

export async function submitWithdrawal(data: {
  account_id: string;
  amount: number;
  bank_name: string;
  routing_number: string;
  account_number: string;
  account_holder_name: string;
  account_type: "checking" | "savings";
}) {
  const supabase = await createClient();
  // Try getUser() first; fall back to getSession() if the token needs refresh
  const { data: authData, error: authError } = await supabase.auth.getUser();
  let user = authData?.user;
  if (!user) {
    const { data: sessionData } = await supabase.auth.getSession();
    user = sessionData?.session?.user ?? null;
  }
  if (!user) {
    console.error("[submitWithdrawal] auth failed:", authError?.message);
    return { error: authError?.message || "Session expired — please log out and log back in" };
  }
  if (!data.bank_name || !data.routing_number || !data.account_number || !data.account_holder_name)
    return { error: "All fields are required" };
  if (!data.amount || data.amount <= 0) return { error: "Enter a valid amount" };

  const service = createServiceClient();
  const { data: req, error } = await service
    .from("withdrawal_requests")
    .insert({
      user_id: user.id,
      account_id: data.account_id,
      amount: data.amount,
      bank_name: data.bank_name.trim(),
      routing_number: data.routing_number.trim(),
      account_number: data.account_number.trim(),
      account_holder_name: data.account_holder_name.trim(),
      account_type: data.account_type,
      otp: "",
      status: "otp_pending",
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { success: true, requestId: (req as { id: string }).id };
}

export async function verifyWithdrawalOTP(requestId: string, enteredOtp: string) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  let user = authData?.user;
  if (!user) {
    const { data: sessionData } = await supabase.auth.getSession();
    user = sessionData?.session?.user ?? null;
  }
  if (!user) return { error: "Session expired — please log out and log back in" };

  const service = createServiceClient();
  const result = await service
    .from("withdrawal_requests")
    .select("otp, status, user_id")
    .eq("id", requestId)
    .single();
  const req = result.data as { otp: string; status: string; user_id: string } | null;

  if (!req) return { error: "Request not found" };
  if (req.user_id !== user.id) return { error: "Unauthorized" };
  if (req.status !== "otp_pending") return { error: "This request is no longer pending OTP" };
  if (!req.otp) return { error: "OTP has not been issued yet. Please contact support." };
  if (req.otp.trim() !== enteredOtp.trim()) return { error: "Incorrect OTP. Please try again." };

  await service
    .from("withdrawal_requests")
    .update({ status: "processing", otp_verified: true })
    .eq("id", requestId);

  revalidatePath("/", "layout");
  return { success: true };
}

export async function cancelWithdrawal(requestId: string) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  let user = authData?.user;
  if (!user) {
    const { data: sessionData } = await supabase.auth.getSession();
    user = sessionData?.session?.user ?? null;
  }
  if (!user) return { error: "Unauthorized" };

  const service = createServiceClient();
  await service
    .from("withdrawal_requests")
    .update({ status: "cancelled" })
    .eq("id", requestId)
    .eq("user_id", user.id)
    .eq("status", "otp_pending");

  revalidatePath("/", "layout");
  return { success: true };
}
