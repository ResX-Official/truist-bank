import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/adminAuth";
import AdminLoginClient from "@/app/components/admin/AdminLoginClient";

export default async function AdminLoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (await verifyAdminSession()) redirect(`/${locale}/admin`);

  return <AdminLoginClient locale={locale} />;
}
