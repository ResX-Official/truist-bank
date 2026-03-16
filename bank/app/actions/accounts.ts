"use server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/serviceClient";

function randomAccountNumber(): string {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

export async function ensureDefaultAccounts(): Promise<{ created?: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return {};

  const service = createServiceClient();

  // Use service client for accounts check — bypasses RLS, always reliable
  const { data: existing, error: checkErr } = await service
    .from("accounts")
    .select("id")
    .eq("user_id", user.id)
    .limit(1);

  if (checkErr) {
    console.error("[ensureDefaultAccounts] accounts check failed:", checkErr.message);
    return { error: checkErr.message };
  }
  if (existing && existing.length > 0) return {};

  // Upsert profile first (avoids FK failure on accounts insert)
  const { error: profileErr } = await service.from("profiles").upsert(
    {
      id: user.id,
      email: user.email ?? "",
      full_name:
        (user.user_metadata?.full_name as string) ??
        user.email?.split("@")[0] ??
        "User",
      role: "user",
    },
    { onConflict: "id" }
  );
  if (profileErr) {
    console.error("[ensureDefaultAccounts] profile upsert failed:", profileErr.message);
    return { error: profileErr.message };
  }

  // Create default accounts
  const { error: acctErr } = await service.from("accounts").insert([
    {
      user_id: user.id,
      account_number: randomAccountNumber(),
      account_type: "checking" as const,
      currency: "USD",
      balance: 0,
      name: "Main Checking",
      is_primary: true,
    },
    {
      user_id: user.id,
      account_number: randomAccountNumber(),
      account_type: "savings" as const,
      currency: "USD",
      balance: 0,
      name: "Savings",
      is_primary: false,
    },
  ]);
  if (acctErr) {
    console.error("[ensureDefaultAccounts] accounts insert failed:", acctErr.message);
    return { error: acctErr.message };
  }

  return { created: true };
}
