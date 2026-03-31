"use client";

import { useSearchParams } from "next/navigation";

export function LoginInvitedNotice() {
  const searchParams = useSearchParams();
  if (searchParams.get("invited") !== "1") return null;

  return (
    <p
      className="mb-4 rounded-lg border border-emerald-200/80 bg-emerald-50/90 px-3 py-2 text-center text-sm text-emerald-900"
      role="status"
    >
      Account activated. Sign in with your email and the password you just set.
    </p>
  );
}
