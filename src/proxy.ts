import { createServerClient } from "@supabase/ssr";
import { hasLocale } from "next-intl";
import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { getSupabaseConfig } from "./lib/supabase/config";

const handleI18nRouting = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const response = handleI18nRouting(request);
  const parts = request.nextUrl.pathname.split("/").filter(Boolean);
  const locale = hasLocale(routing.locales, parts[0]) ? parts[0] : routing.defaultLocale;
  const route = hasLocale(routing.locales, parts[0]) ? parts[1] : parts[0];
  const config = getSupabaseConfig();
  let isAuthenticated = false;

  if (config) {
    const supabase = createServerClient(config.url, config.publishableKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headersToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
          Object.entries(headersToSet).forEach(([name, value]) => {
            response.headers.set(name, value);
          });
        },
      },
    });

    try {
      const { data, error } = await supabase.auth.getClaims();
      isAuthenticated = !error && Boolean(data?.claims);
    } catch {
      // A failed Auth request must never grant access to a private route.
    }
  }

  if (route === "spaces" && !isAuthenticated) {
    const login = NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    response.cookies.getAll().forEach((cookie) => login.cookies.set(cookie));
    for (const name of ["cache-control", "expires", "pragma"]) {
      const value = response.headers.get(name);
      if (value) login.headers.set(name, value);
    }
    return login;
  }

  return response;
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
