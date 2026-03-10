import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col bg-white">
        <Header />
        <main className="flex-1 p-6 bg-white">{children}</main>
      </div>
    </div>
  );
}
