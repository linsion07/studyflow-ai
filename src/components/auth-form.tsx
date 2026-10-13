import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const t = useTranslations("Auth");
  const isSignup = mode === "signup";

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
        {isSignup ? t("signupTitle") : t("loginTitle")}
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        {isSignup ? t("signupDescription") : t("loginDescription")}
      </p>
      <form className="mt-8 space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-800">
            {t("email")}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-600 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-800">
            {t("password")}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-600 focus:outline-none"
          />
        </div>
        <button
          type="button"
          disabled
          className="w-full cursor-not-allowed rounded-xl bg-blue-300 px-5 py-3 text-sm font-semibold text-white"
        >
          {isSignup ? t("createAccount") : t("loginButton")}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        {t("notAvailable")}
      </p>
      <p className="mt-6 text-sm text-slate-600">
        {isSignup ? t("hasAccount") : t("newToStudyFlow")}{" "}
        <Link
          href={isSignup ? "/login" : "/signup"}
          className="font-semibold text-blue-700 hover:underline"
        >
          {isSignup ? t("loginButton") : t("signupButton")}
        </Link>
      </p>
    </div>
  );
}
