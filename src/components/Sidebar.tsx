"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { ROLES } from "@/lib/roles";

const portalNav = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/orders", label: "Orders", icon: "orders" },
  { href: "/results", label: "Results", icon: "results" },
] as const;

const labNav = [
  { href: "/lab", label: "Lab queue", icon: "lab" },
  { href: "/lab/onboarding", label: "Clinics & doctors", icon: "onboard" },
] as const;

function NavIcon({
  name,
  active,
}: {
  name: string;
  active: boolean;
}) {
  const cls = `size-5 transition-colors ${active ? "text-[#4C6FFF]" : "text-[#8F95B2]"}`;

  const paths: Record<string, React.ReactNode> = {
    dashboard: (
      <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10-2a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z"
        />
      </svg>
    ),
    orders: (
      <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    results: (
      <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    lab: (
      <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
        />
      </svg>
    ),
    onboard: (
      <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  };

  return paths[name] || null;
}

function NavLink({
  href,
  label,
  icon,
  pathname,
}: {
  href: string;
  label: string;
  icon: string;
  pathname: string;
}) {
  const isActive =
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
  return (
    <li>
      <Link
        href={href}
        className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-all duration-200 ${
          isActive
            ? "bg-[#EEF2FF] text-[#4C6FFF] shadow-[0_1px_3px_rgba(76,111,255,0.08)]"
            : "text-[#5A607F] hover:bg-[#F7F8FC] hover:text-[#1A1F36]"
        }`}
      >
        <NavIcon name={icon} active={isActive} />
        {label}
      </Link>
    </li>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isLabAdmin = session?.user?.role === ROLES.LAB_ADMIN;

  return (
    <aside className="flex w-[260px] shrink-0 flex-col overflow-y-auto bg-white">
      <nav className="flex-1 space-y-7 px-4 pt-5">
        <div>
          <h3 className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8F95B2]">
            Portal
          </h3>
          <ul className="space-y-1">
            {portalNav.map((item) => (
              <NavLink key={item.href} pathname={pathname} {...item} />
            ))}
          </ul>
        </div>

        {isLabAdmin && (
          <div>
            <h3 className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8F95B2]">
              Laboratory
            </h3>
            <ul className="space-y-1">
              {labNav.map((item) => (
                <NavLink key={item.href} pathname={pathname} {...item} />
              ))}
            </ul>
          </div>
        )}
      </nav>

      <div className="border-t border-[#EEF0F6] px-4 py-4">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13.5px] font-medium text-[#E2613B] transition-all duration-200 hover:bg-[#FFF8F6]"
        >
          <svg className="size-5 text-[#E2613B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Log out
        </button>
      </div>
    </aside>
  );
}
