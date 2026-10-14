"use client";

import { useActionState, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { signIn, signUp } from "@/app/[locale]/auth/actions";
import { Link } from "@/i18n/navigation";
import { getSupabaseConfig } from "@/lib/supabase/config";

type AuthFormProps = {
  mode: "login" | "signup";
  confirmationError?: boolean;
  verificationNotice?: boolean;
};

export function AuthForm({ mode, confirmationError = false, verificationNotice = false }: AuthFormProps) {
  const t = useTranslations("Auth");
  const locale = useLocale();
  const isSignup = mode === "signup";
  const [state, action, pending] = useActionState(isSignup ? signUp : signIn, {});
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const configured = Boolean(getSupabaseConfig());

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
        {isSignup ? t("signupTitle") : t("loginTitle")}
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        {isSignup ? t("signupDescription") : t("loginDescription")}
      </p>

      {!isSignup && (
        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-sm font-medium text-slate-800">{t("newHere")}</p>
          <Link href="/signup" className="mt-2 inline-flex text-sm font-semibold text-blue-700 hover:underline">
            {t("signupLink")}
          </Link>
        </div>
      )}

      {isSignup && !state.success && (
        <p className="mt-6 rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
          {t("signupSteps")}
        </p>
      )}

      {confirmationError && (
        <p role="alert" className="mt-6 rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {t("confirmationError")}
        </p>
      )}
      {verificationNotice && (
        <p role="status" className="mt-6 rounded-xl bg-blue-50 p-3 text-sm leading-6 text-blue-900">
          {t("verificationNotice")}
        </p>
      )}
      {state.error && (
        <div role="alert" className="mt-6 rounded-xl bg-red-50 p-3 text-sm leading-6 text-red-700">
          <p>{t(state.error)}</p>
          {state.reference && <p className="mt-1 text-xs text-red-600">{t("referenceCode", { code: state.reference })}</p>}
        </div>
      )}
      {!configured && (
        <p role="status" className="mt-6 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
          {t("configuration")}
        </p>
      )}

      {state.success ? (
        <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-5">
          <h2 className="font-semibold text-green-950">{t("checkEmailTitle")}</h2>
          <p role="status" className="mt-2 text-sm leading-6 text-green-900">
            {t("checkEmail")}
          </p>
          <p className="mt-2 text-sm leading-6 text-green-800">{t("checkSpam")}</p>
          <Link href="/login" className="mt-4 inline-flex text-sm font-semibold text-blue-700 hover:underline">
            {t("loginButton")}
          </Link>
        </div>
      ) : (
        <form action={action} className="mt-8 space-y-5">
          <input type="hidden" name="locale" value={locale} />
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-800">
              {t("email")}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-800">
              {t("password")}
            </label>
            <div className="relative mt-2">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete={isSignup ? "new-password" : "current-password"}
                minLength={isSignup ? 6 : undefined}
                required
                aria-describedby={isSignup ? "password-hint" : undefined}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-20 text-slate-900 focus:border-blue-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute inset-y-0 right-3 text-sm font-medium text-slate-600 hover:text-blue-700"
                aria-label={showPassword ? t("hidePassword") : t("showPassword")}
              >
                {showPassword ? t("hidePassword") : t("showPassword")}
              </button>
            </div>
            {isSignup && <p id="password-hint" className="mt-2 text-xs text-slate-500">{t("passwordHint")}</p>}
          </div>
          {isSignup && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-800">
                {t("confirmPassword")}
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                minLength={6}
                required
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>
          )}
          <button
            type="submit"
            disabled={!configured || pending}
            className="w-full rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {pending ? t("submitting") : isSignup ? t("createAccount") : t("loginButton")}
          </button>
        </form>
      )}

      {isSignup && !state.success && (
        <p className="mt-6 text-sm text-slate-600">
          {t("hasAccount")} {" "}
          <Link href="/login" className="font-semibold text-blue-700 hover:underline">
            {t("loginButton")}
          </Link>
        </p>
      )}
    </div>
  );
}
