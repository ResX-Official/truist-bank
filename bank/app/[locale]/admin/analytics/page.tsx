import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/adminAuth";
import { createServiceClient } from "@/lib/supabase/serviceClient";
import AdminAnalyticsClient from "@/app/components/admin/AdminAnalyticsClient";

export default async function AdminAnalyticsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!(await verifyAdminSession())) redirect(`/${locale}/admin/login`);

  const supabase = createServiceClient();

  const [
    { count: totalUsers },
    { count: totalCards },
    { count: totalWithdrawals },
    { count: pendingWithdrawals },
    { count: completedWithdrawals },
    { data: withdrawalAmounts },
    { data: recentUsers },
    { count: totalMessages },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("cards").select("*", { count: "exact", head: true }),
    supabase.from("withdrawal_requests").select("*", { count: "exact", head: true }),
    supabase.from("withdrawal_requests").select("*", { count: "exact", head: true }).in("status", ["otp_pending", "processing"]),
    supabase.from("withdrawal_requests").select("*", { count: "exact", head: true }).eq("status", "completed"),
    supabase.from("withdrawal_requests").select("amount, status, created_at").order("created_at", { ascending: false }).limit(100),
    supabase.from("profiles").select("id, full_name, email, created_at").order("created_at", { ascending: false }).limit(10),
    supabase.from("support_messages").select("*", { count: "exact", head: true }),
  ]);

  const totalVolume = (withdrawalAmounts ?? [])
    .filter((w) => w.status === "completed")
    .reduce((sum, w) => sum + Number(w.amount), 0);

  const avgWithdrawal = completedWithdrawals && totalVolume
    ? totalVolume / (completedWithdrawals || 1)
    : 0;

  // Build monthly withdrawal data from last 6 months
  const now = new Date();
  const monthlyData: { month: string; volume: number; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    const monthRequests = (withdrawalAmounts ?? []).filter((w) => {
      const wd = new Date(w.created_at);
      return wd.getMonth() === d.getMonth() && wd.getFullYear() === d.getFullYear() && w.status === "completed";
    });
    monthlyData.push({
      month: label,
      volume: monthRequests.reduce((s, w) => s + Number(w.amount), 0),
      count: monthRequests.length,
    });
  }

  return (
    <AdminAnalyticsClient
      totalUsers={totalUsers ?? 0}
      totalCards={totalCards ?? 0}
      totalWithdrawals={totalWithdrawals ?? 0}
      pendingWithdrawals={pendingWithdrawals ?? 0}
      completedWithdrawals={completedWithdrawals ?? 0}
      totalVolume={totalVolume}
      avgWithdrawal={avgWithdrawal}
      totalMessages={totalMessages ?? 0}
      monthlyData={monthlyData}
      recentUsers={(recentUsers ?? []) as Array<{ id: string; full_name: string; email: string; created_at: string }>}
    />
  );
}
