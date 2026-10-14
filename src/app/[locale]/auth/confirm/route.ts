import { hasLocale } from "next-intl";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest, context: { params: Promise<{ locale: string }> }) {
  const { locale } = await context.params;
  if (!hasLocale(routing.locales, locale)) {
    return NextResponse.redirect(new URL(`/${routing.defaultLocale}/login`, request.url));
  }

  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const code = request.nextUrl.searchParams.get("code");
  const type = request.nextUrl.searchParams.get("type");

  if (getSupabaseConfig() && (code || (tokenHash && type === "email"))) {
    const supabase = await createClient();
    const { error } = code
      ? await supabase.auth.exchangeCodeForSession(code)
      : await supabase.auth.verifyOtp({ token_hash: tokenHash!, type: "email" });
    if (!error) {
      return NextResponse.redirect(new URL(`/${locale}/spaces`, request.url));
    }
    if (code) {
      return NextResponse.redirect(new URL(`/${locale}/login?notice=verify-login`, request.url));
    }
  }

  return NextResponse.redirect(new URL(`/${locale}/login?error=confirmation`, request.url));
}
