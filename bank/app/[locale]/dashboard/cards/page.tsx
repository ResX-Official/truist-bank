import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/serviceClient";
import CardsClient from "@/app/components/dashboard/CardsClient";
import type { Card } from "@/lib/supabase/types";

export default async function CardsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  let user = authData?.user;
  if (!user) {
    const { data: sessionData } = await supabase.auth.getSession();
    user = sessionData?.session?.user ?? null;
  }
  if (!user) redirect(`/${locale}/login`);

  const service = createServiceClient();
  const { data: cards } = await service
    .from("cards")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return <CardsClient cards={(cards ?? []) as Card[]} />;
}
