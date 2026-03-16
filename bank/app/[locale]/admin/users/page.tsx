import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/adminAuth";
import { createServiceClient } from "@/lib/supabase/serviceClient";
import AdminUsersClient from "@/app/components/admin/AdminUsersClient";

export default async function AdminUsersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!(await verifyAdminSession())) redirect(`/${locale}/admin/login`);

  const supabase = createServiceClient();
  const { data: users } = await supabase
    .from("profiles")
    .select("*, accounts(*), cards(*)")
    .order("created_at", { ascending: false })
    .limit(50);

  return <AdminUsersClient users={users ?? []} />;
}
