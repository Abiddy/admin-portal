"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { AddUserInviteModal } from "@/components/AddUserInviteModal";
import { ROLES } from "@/lib/roles";

function roleLabel(role: string) {
  switch (role) {
    case "LAB_ADMIN":
      return "Lab Admin";
    case "DOCTOR":
      return "Doctor";
    default:
      return role;
  }
}

function initials(name: string | null | undefined, email: string | null | undefined) {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return "?";
}

export function Header() {
  const { data: session, status } = useSession();

  const name = session?.user?.name;
  const email = session?.user?.email;
  const role = session?.user?.role ?? "";

  return (
    <header className="flex flex-1 items-center justify-between px-6 py-3">
      <div className="flex flex-1 items-center justify-center">
        <div className="flex w-full max-w-md items-center gap-2 rounded-lg border border-[#E2E6EF] bg-[#F5F7FA] px-4 py-2">
          <svg className="size-5 shrink-0 text-[#8F95B2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            placeholder="Search orders, patients…"
            className="flex-1 bg-transparent text-sm text-[#1A1F36] placeholder-[#8F95B2] outline-none"
          />
        </div>
      </div>

      <div className="ml-2 flex items-center gap-2">
        {status === "loading" ? (
          <div className="h-10 w-40 animate-pulse rounded-lg bg-[#F0F1F5]" />
        ) : (
          <>
            {role === ROLES.LAB_ADMIN ? (
              <>
                <Link
                  href="/lab/new-requisition"
                  className="rounded-lg border border-[#C7D4FF] bg-[#EEF2FF] px-3 py-2 text-xs font-semibold text-[#4C6FFF] transition-colors hover:bg-[#E0E7FF]"
                >
                  New requisition
                </Link>
                <AddUserInviteModal />
              </>
            ) : null}
            <div className="flex items-center gap-3 border-l border-[#EEF0F6] pl-4">
              <div className="flex size-10 items-center justify-center rounded-full bg-[#EEF2FF] text-sm font-semibold text-[#4C6FFF]">
                {initials(name, email)}
              </div>
              <div className="hidden min-w-0 flex-col sm:flex">
                <span className="truncate text-sm font-medium text-[#1A1F36]">{name || "User"}</span>
                <span className="truncate text-xs text-[#8F95B2]">{roleLabel(role)}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
