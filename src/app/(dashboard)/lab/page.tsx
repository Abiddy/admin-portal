import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { formatOrderStatus } from "@/lib/order-format";
import { getLabQueueOrders } from "@/lib/order-queries";
import { ORDER_STATUS, ROLES } from "@/lib/roles";
import { LabQueueQuickStatus } from "./_components/LabQueueQuickStatus";
import { LabQueueUpload } from "./_components/LabQueueUpload";

const FILTERS: { label: string; value: string }[] = [
  { label: "All", value: "" },
  { label: formatOrderStatus(ORDER_STATUS.SUBMITTED), value: ORDER_STATUS.SUBMITTED },
  { label: formatOrderStatus(ORDER_STATUS.KIT_RECEIVED), value: ORDER_STATUS.KIT_RECEIVED },
  { label: formatOrderStatus(ORDER_STATUS.PROCESSING), value: ORDER_STATUS.PROCESSING },
  { label: formatOrderStatus(ORDER_STATUS.RESULTS_READY), value: ORDER_STATUS.RESULTS_READY },
];

type Props = { searchParams: Promise<{ status?: string }> };

function patientLabel(row: { patientName: string | null; patientEmail: string | null }) {
  return row.patientName?.trim() || row.patientEmail?.trim() || "Unnamed patient";
}

function fmtDate(d: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(d);
}

export default async function LabPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  if (session.user.role !== ROLES.LAB_ADMIN) {
    redirect("/dashboard");
  }

  const sp = await searchParams;
  const statusFilter = sp.status?.trim() || null;
  const rows = await getLabQueueOrders(statusFilter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1F36]">Lab queue</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-[#8F95B2]">
          Work all incoming orders: filter by stage, advance status, upload result PDFs, then coordinate with practices on each order&apos;s{" "}
          <span className="font-medium text-[#5A607F]">thread</span> (open the order).
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = (statusFilter ?? "") === f.value;
          const href = f.value ? `/lab?status=${encodeURIComponent(f.value)}` : "/lab";
          return (
            <Link
              key={f.label + f.value}
              href={href}
              className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                active
                  ? "bg-[#1A1F36] text-white"
                  : "bg-white text-[#5A607F] ring-1 ring-[#E2E6EF] hover:bg-[#F8F9FC]"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E2E6EF] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#F0F1F5] bg-[#FAFBFC]">
                <th className="px-4 py-3 font-semibold text-[#5A607F]">Patient</th>
                <th className="px-4 py-3 font-semibold text-[#5A607F]">Practice</th>
                <th className="px-4 py-3 font-semibold text-[#5A607F]">Status</th>
                <th className="px-4 py-3 font-semibold text-[#5A607F]">Results</th>
                <th className="px-4 py-3 font-semibold text-[#5A607F]">Pipeline</th>
                <th className="min-w-[220px] px-4 py-3 font-semibold text-[#5A607F]">Upload PDF</th>
                <th className="px-4 py-3 font-semibold text-[#5A607F]">Order</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-[#8F95B2]">
                    No orders in this view.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="border-b border-[#F0F1F5] align-top last:border-0">
                    <td className="px-4 py-3 font-medium text-[#1A1F36]">{patientLabel(row)}</td>
                    <td className="px-4 py-3 text-[#3D4354]">{row.practiceName}</td>
                    <td className="px-4 py-3">
                      <OrderStatusBadge status={row.status} />
                    </td>
                    <td className="px-4 py-3 text-[#5A607F]">{row.resultCount}</td>
                    <td className="px-4 py-3">
                      <LabQueueQuickStatus orderId={row.id} currentStatus={row.status} />
                    </td>
                    <td className="px-4 py-3">
                      <LabQueueUpload orderId={row.id} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <Link href={`/orders/${row.id}`} className="font-medium text-[#4C6FFF] hover:underline">
                          Open
                        </Link>
                        <span className="text-[11px] text-[#8F95B2]">{fmtDate(row.createdAt)}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
