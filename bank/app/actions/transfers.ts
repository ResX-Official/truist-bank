"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function sendTransfer(
  fromAccountId: string,
  toEmail: string,
  amount: number,
  note?: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  if (amount <= 0) return { error: "Amount must be greater than 0" };
  if (!toEmail) return { error: "Recipient email is required" };

  const { data, error } = await supabase.rpc("transfer_between_users", {
    p_from_account_id: fromAccountId,
    p_to_email: toEmail,
    p_amount: amount,
    p_note: note || null,
  });

  if (error) return { error: "Transfer failed. Please try again." };
  const result = data as { success?: boolean; error?: string } | null;
  if (!result?.success) return { error: result?.error || "Transfer failed" };

  revalidatePath("/");
  return { success: true };
}
