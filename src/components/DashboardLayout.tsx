import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#F5F7FA]">
      {/* Top bar: Logo + Header — fixed at top */}
      <div className="flex shrink-0 items-center border-b border-[#E2E6EF] bg-white">
        <div className="flex w-[260px] shrink-0 items-center px-7 py-4">
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
