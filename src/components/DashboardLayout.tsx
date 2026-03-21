import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#F5F7FA]">
      {/* Top bar: Logo + Header — fixed at top */}
      <div className="flex shrink-0 items-center border-b border-[#E2E6EF] bg-white">
        <div className="flex w-[260px] shrink-0 items-center gap-2.5 px-7 py-4">
          <div className="flex size-9 items-center justify-center rounded-lg bg-[#4C6FFF]">
            <svg className="size-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#1A1F36]">BDL+</span>
        </div>
        <Header />
      </div>

      {/* Below: Sidebar fixed + Content scrolls */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
