import Link from "next/link";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const isSignup = mode === "signup";

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
        {isSignup ? "Create your account" : "Welcome back"}
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        {isSignup
          ? "Your learning workspace starts here."
          : "Log in to return to your learning spaces."}
      </p>
      <form className="mt-8 space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-800">
            Email
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
            Password
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
          {isSignup ? "Create account" : "Log in"}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        Authentication will be available in the next development phase.
      </p>
      <p className="mt-6 text-sm text-slate-600">
        {isSignup ? "Already have an account? " : "New to StudyFlow? "}
        <Link
          href={isSignup ? "/login" : "/signup"}
          className="font-semibold text-blue-700 hover:underline"
        >
          {isSignup ? "Log in" : "Sign up"}
        </Link>
      </p>
    </div>
  );
}
