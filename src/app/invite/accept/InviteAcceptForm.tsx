"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { acceptUserInviteAction, type AcceptInviteState } from "@/app/actions/user-invite";

export function InviteAcceptForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const [state, formAction, pending] = useActionState(acceptUserInviteAction, null as AcceptInviteState | null);

  if (!token) {
    return (
      <p className="rounded-lg border border-red-200/60 bg-red-50/80 px-3 py-2 text-sm text-[#E2613B]" role="alert">
        Missing invitation token. Open the link from your email, or request a new invite from BDL.
      </p>
    );
  }

  if (state && "success" in state && state.success) {
    return (
      <div className="space-y-4 text-center">
        <p className="rounded-lg border border-emerald-200/80 bg-emerald-50/90 px-3 py-2 text-sm text-emerald-900">
          Your account is ready.
        </p>
        <Link
          href="/login?invited=1"
          className="inline-flex w-full items-center justify-center rounded-lg bg-[#4C6FFF] py-3 font-medium text-white transition-colors hover:bg-[#3A5BE0]"
        >
          Continue to sign in
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <div>
        <label htmlFor="pw" className="mb-2 block text-sm font-medium text-[#5A607F]">
          Password
        </label>
        <input
          id="pw"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-lg border border-white/50 bg-white/55 px-4 py-3 text-[#1A1F36] outline-none focus:border-[#4C6FFF]/70 focus:ring-1 focus:ring-[#4C6FFF]"
        />
      </div>
      <div>
        <label htmlFor="pw2" className="mb-2 block text-sm font-medium text-[#5A607F]">
          Confirm password
        </label>
        <input
          id="pw2"
          name="passwordConfirm"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-lg border border-white/50 bg-white/55 px-4 py-3 text-[#1A1F36] outline-none focus:border-[#4C6FFF]/70 focus:ring-1 focus:ring-[#4C6FFF]"
        />
      </div>
      {state && "error" in state && state.error ? (
        <p className="rounded-lg border border-red-200/60 bg-red-50/80 px-3 py-2 text-sm text-[#E2613B]" role="alert">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-[#4C6FFF] py-3 font-medium text-white transition-colors hover:bg-[#3A5BE0] disabled:opacity-60"
      >
        {pending ? "Saving…" : "Activate account"}
      </button>
    </form>
  );
}
