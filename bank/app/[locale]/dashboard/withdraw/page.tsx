import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/serviceClient";
import WithdrawClient from "@/app/components/dashboard/WithdrawClient";
import type { Account } from "@/lib/supabase/types";

export default async function WithdrawPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const service = createServiceClient();
  const [{ data: accounts }, { data: history }] = await Promise.all([
    service.from("accounts").select("id, name, account_type, balance, status").eq("user_id", user.id).eq("status", "active"),
    service.from("withdrawal_requests").select("id, amount, bank_name, status, created_at, admin_note").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
  ]);

  return (
    <WithdrawClient
      accounts={(accounts ?? []) as Account[]}
      history={history ?? []}
    />
  );
}
