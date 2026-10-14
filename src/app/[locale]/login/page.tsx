import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getCurrentUser } from "@/lib/supabase/user";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Auth" });
  return { title: t("loginTitle") };
}

export default async function LoginPage({ params, searchParams }: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; notice?: string }>;
}) {
  const { locale } = await params;
  if (await getCurrentUser()) redirect(`/${locale}/spaces`);
  const { error, notice } = await searchParams;
  return <div className="py-12 sm:py-16"><AuthForm mode="login" confirmationError={error === "confirmation"} verificationNotice={notice === "verify-login"} /></div>;
}
