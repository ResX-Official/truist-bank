"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/serviceClient";

async function getAuthUser() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (authData?.user) return authData.user;
  const { data: sessionData } = await supabase.auth.getSession();
  return sessionData?.session?.user ?? null;
}

export async function addCard(data: {
  cardholder_name: string;
  card_number: string;
  expiry_month: number;
  expiry_year: number;
  card_type: "visa" | "mastercard" | "amex" | "discover";
  cvv: string;
  nickname?: string;
}) {
  const user = await getAuthUser();
  if (!user) return { error: "Unauthorized" };

  const digits = data.card_number.replace(/\s/g, "");
  if (!/^\d{13,19}$/.test(digits)) return { error: "Card number must be 13–19 digits" };
  if (!/^\d{3,4}$/.test(data.cvv)) return { error: "CVV must be 3 or 4 digits" };

  const last_four = digits.slice(-4);

  const service = createServiceClient();
  const { error } = await service.from("cards").insert({
    user_id: user.id,
    cardholder_name: data.cardholder_name.trim(),
    card_number: digits,
    last_four,
    expiry_month: data.expiry_month,
    expiry_year: data.expiry_year,
    card_type: data.card_type,
    cvv: data.cvv,
    nickname: data.nickname?.trim() || null,
    is_frozen: false,
  });
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { success: true };
}

export async function freezeCard(cardId: string, freeze: boolean) {
  const user = await getAuthUser();
  if (!user) return { error: "Unauthorized" };
  const service = createServiceClient();
  const { error } = await service.from("cards").update({ is_frozen: freeze }).eq("id", cardId).eq("user_id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { success: true };
}

export async function deleteCard(cardId: string) {
  const user = await getAuthUser();
  if (!user) return { error: "Unauthorized" };
  const service = createServiceClient();
  const { error } = await service.from("cards").delete().eq("id", cardId).eq("user_id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { success: true };
}
