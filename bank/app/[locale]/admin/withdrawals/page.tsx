import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/adminAuth";
import { createServiceClient } from "@/lib/supabase/serviceClient";
import AdminWithdrawalsClient from "@/app/components/admin/AdminWithdrawalsClient";
import type { WithdrawalRequest } from "@/lib/supabase/types";

export default async function AdminWithdrawalsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!(await verifyAdminSession())) redirect(`/${locale}/admin/login`);

  const supabase = createServiceClient();
  const { data: requests } = await supabase
    .from("withdrawal_requests")
    .select("*")
    .order("created_at", { ascending: false });

  const rawRequests = (requests ?? []) as WithdrawalRequest[];
  const userIds = [...new Set(rawRequests.map((r) => r.user_id))];

  const { data: userProfiles } = userIds.length > 0
    ? await supabase.from("profiles").select("id, full_name, email").in("id", userIds)
    : { data: [] };

  const profileMap = Object.fromEntries(
    ((userProfiles ?? []) as Array<{ id: string; full_name: string; email: string }>).map((p) => [p.id, p])
  );

  const enriched = rawRequests.map((r) => ({
    ...r,
    user_name: profileMap[r.user_id]?.full_name || "Unknown",
    user_email: profileMap[r.user_id]?.email || "",
  }));

  return <AdminWithdrawalsClient requests={enriched} />;
}
