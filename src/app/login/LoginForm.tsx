"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setPending(false);

    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }

    if (res?.url) {
      window.location.href = res.url;
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded-lg border border-red-200/60 bg-red-50/80 px-3 py-2 text-sm text-[#E2613B] backdrop-blur-sm" role="alert">
          {error}
        </p>
      )}
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#5A607F]">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="w-full rounded-lg border border-white/50 bg-white/55 px-4 py-3 text-[#1A1F36] placeholder-[#8F95B2] shadow-[inset_0_1px_2px_rgba(26,31,54,0.04)] outline-none backdrop-blur-sm focus:border-[#4C6FFF]/70 focus:bg-white/70 focus:ring-1 focus:ring-[#4C6FFF]"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium text-[#5A607F]">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          className="w-full rounded-lg border border-white/50 bg-white/55 px-4 py-3 text-[#1A1F36] placeholder-[#8F95B2] shadow-[inset_0_1px_2px_rgba(26,31,54,0.04)] outline-none backdrop-blur-sm focus:border-[#4C6FFF]/70 focus:bg-white/70 focus:ring-1 focus:ring-[#4C6FFF]"
          required
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-[#4C6FFF] py-3 font-medium text-white transition-colors hover:bg-[#3A5BE0] disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
