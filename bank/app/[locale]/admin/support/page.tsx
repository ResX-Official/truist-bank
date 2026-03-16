import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/adminAuth";
import { createServiceClient } from "@/lib/supabase/serviceClient";
import AdminSupportClient from "@/app/components/admin/AdminSupportClient";
import type { SupportMessage } from "@/lib/supabase/types";

export default async function AdminSupportPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!(await verifyAdminSession())) redirect(`/${locale}/admin/login`);

  const supabase = createServiceClient();
  const { data: messages } = await supabase
    .from("support_messages")
    .select("*")
    .order("created_at", { ascending: true });

  const rawMessages = (messages ?? []) as SupportMessage[];
  const userIds = [...new Set(rawMessages.map((m) => m.user_id))];

  const { data: userProfiles } = userIds.length > 0
    ? await supabase.from("profiles").select("id, full_name, email").in("id", userIds)
    : { data: [] };

  return (
    <AdminSupportClient
      initialMessages={rawMessages}
      userProfiles={(userProfiles ?? []) as Array<{ id: string; full_name: string; email: string }>}
      adminId="admin"
    />
  );
}
