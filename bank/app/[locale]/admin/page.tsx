import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/adminAuth";
import { createServiceClient } from "@/lib/supabase/serviceClient";
import AdminOverviewClient from "@/app/components/admin/AdminOverviewClient";

export default async function AdminOverviewPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!(await verifyAdminSession())) redirect(`/${locale}/admin/login`);

  const supabase = createServiceClient();
  const [
    { count: totalUsers },
    { count: pendingWithdrawals },
    { count: unreadMessages },
    { data: recentRequestsRaw },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("withdrawal_requests").select("*", { count: "exact", head: true }).in("status", ["otp_pending", "processing"]),
    supabase.from("support_messages").select("*", { count: "exact", head: true }).eq("sender_type", "user").eq("read", false),
    supabase.from("withdrawal_requests").select("id, user_id, amount, bank_name, status, created_at").in("status", ["otp_pending", "processing"]).order("created_at", { ascending: false }).limit(10),
  ]);

  const userIds = [...new Set((recentRequestsRaw ?? []).map((r) => r.user_id))];
  const { data: profilesData } = userIds.length > 0
    ? await supabase.from("profiles").select("id, full_name, email").in("id", userIds)
    : { data: [] };

  const profileMap = Object.fromEntries(
    ((profilesData ?? []) as Array<{ id: string; full_name: string; email: string }>).map((p) => [p.id, p])
  );

  const recentRequests = (recentRequestsRaw ?? []).map((r) => ({
    id: r.id as string,
    user_name: profileMap[r.user_id as string]?.full_name || "Unknown",
    user_email: profileMap[r.user_id as string]?.email || "",
    amount: r.amount as number,
    bank_name: r.bank_name as string,
    status: r.status as string,
    created_at: r.created_at as string,
  }));

  return (
    <AdminOverviewClient
      totalUsers={totalUsers ?? 0}
      pendingWithdrawals={pendingWithdrawals ?? 0}
      unreadMessages={unreadMessages ?? 0}
      recentRequests={recentRequests}
    />
  );
}
