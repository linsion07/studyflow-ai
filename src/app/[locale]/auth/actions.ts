"use server";

import type { AuthError } from "@supabase/supabase-js";
import { hasLocale } from "next-intl";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { routing } from "@/i18n/routing";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { AuthActionState, AuthErrorCode } from "@/types/auth";

function getFormValues(formData: FormData) {
  const localeValue = formData.get("locale");
  const locale = typeof localeValue === "string" && hasLocale(routing.locales, localeValue)
    ? localeValue
    : routing.defaultLocale;
  const emailValue = formData.get("email");
  const passwordValue = formData.get("password");

  return {
    locale,
    email: typeof emailValue === "string" ? emailValue.trim() : "",
    password: typeof passwordValue === "string" ? passwordValue : "",
  };
}

function mapAuthError(error: AuthError, mode: "login" | "signup"): AuthErrorCode {
  if (error.name === "AuthRetryableFetchError" || error.status === 0) return "serviceUnavailable";
  if (error.code === "over_email_send_rate_limit") return "emailSendLimited";
  if (error.status === 429 || error.code?.includes("rate_limit")) return "rateLimited";
  if (error.code === "email_not_confirmed") return "emailNotConfirmed";
  if (error.code === "email_address_not_authorized") return "emailNotAuthorized";
  if (error.code === "email_address_invalid") return "invalidEmail";
  if (error.code === "weak_password") return "weakPassword";
  if (error.code === "signup_disabled") return "signupDisabled";
  if (mode === "login" && error.code === "invalid_credentials") return "invalidCredentials";
  if ((error.status ?? 0) >= 500) return "serviceUnavailable";
  return mode === "login" ? "loginFailed" : "signupFailed";
}

export async function signIn(_previous: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const { locale, email, password } = getFormValues(formData);
  if (!email || !password) return { error: "invalidInput" };
  if (!getSupabaseConfig()) return { error: "configuration" };

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: mapAuthError(error, "login") };
  } catch {
    return { error: "serviceUnavailable" };
  }

  revalidatePath("/", "layout");
  redirect(`/${locale}/spaces`);
}

export async function signUp(_previous: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const { locale, email, password } = getFormValues(formData);
  const confirmPassword = formData.get("confirmPassword");
  if (!email || password.length < 6) return { error: "invalidInput" };
  if (password !== confirmPassword) return { error: "passwordMismatch" };
  if (!getSupabaseConfig()) return { error: "configuration" };

  const origin = (await headers()).get("origin");
  if (!origin) return { error: "signupFailed", reference: "origin_missing" };

  let hasSession = false;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${origin}/${locale}/auth/confirm` },
    });
    if (error) {
      const mapped = mapAuthError(error, "signup");
      return {
        error: mapped,
        reference: mapped === "signupFailed"
          ? error.code?.match(/^[a-z0-9_]{1,64}$/)?.[0] ?? `status_${error.status ?? "unknown"}`
          : undefined,
      };
    }
    hasSession = Boolean(data.session);
  } catch {
    return { error: "serviceUnavailable" };
  }

  if (!hasSession) return { success: "checkEmail" };

  revalidatePath("/", "layout");
  redirect(`/${locale}/spaces`);
}

export async function signOut(formData: FormData) {
  const { locale } = getFormValues(formData);
  if (getSupabaseConfig()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  revalidatePath("/", "layout");
  redirect(`/${locale}/login`);
}
