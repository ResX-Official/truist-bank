import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/serviceClient";
import DashboardOverview from "@/app/components/dashboard/DashboardOverview";
import { ensureDefaultAccounts } from "@/app/actions/accounts";
import type { Profile, Account, Transaction } from "@/lib/supabase/types";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(`/${locale}/login`);

  // Auto-create accounts/profile if missing (service client bypasses RLS)
  const acctResult = await ensureDefaultAccounts();
  if (acctResult.error) console.error("[dashboard] ensureDefaultAccounts error:", acctResult.error);
  if (acctResult.created) console.log("[dashboard] created default accounts for user:", user.id);

  // Use service client to guarantee reads bypass RLS
  const service = createServiceClient();
  const [{ data: profile }, { data: accounts }, { data: transactions }] =
    await Promise.all([
      service.from("profiles").select("*").eq("id", user.id).single(),
      service.from("accounts").select("*").eq("user_id", user.id).order("is_primary", { ascending: false }),
      service
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(8),
    ]);

  // Best-effort display name: profile DB > user metadata > email prefix
  const displayName =
    (profile as Profile | null)?.full_name ||
    (user.user_metadata?.full_name as string | undefined) ||
    user.email?.split("@")[0] ||
    "User";

  return (
    <DashboardOverview
      profile={profile as Profile | null}
      displayName={displayName}
      accounts={(accounts ?? []) as Account[]}
      transactions={(transactions ?? []) as Transaction[]}
      locale={locale}
    />
  );
}
