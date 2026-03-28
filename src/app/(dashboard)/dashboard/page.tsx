import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { getDashboardOrderLists, type DashboardOrderRow } from "@/lib/order-queries";

function fmtDate(d: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

function patientLabel(row: DashboardOrderRow) {
  return row.patientName?.trim() || row.patientEmail?.trim() || "Unnamed patient";
}

function OrderListCard({
  title,
  description,
  orders,
  showPractice,
  emptyHint,
}: {
  title: string;
  description: string;
  orders: DashboardOrderRow[];
  showPractice: boolean;
  emptyHint: string;
}) {
  return (
    <div className="flex flex-col rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="border-b border-[#F0F1F5] px-5 py-4">
        <h2 className="text-[15px] font-bold text-[#1A1F36]">{title}</h2>
        <p className="mt-0.5 text-[13px] text-[#8F95B2]">{description}</p>
      </div>
      <div className="flex-1 p-2">
        {orders.length === 0 ? (
          <p className="px-3 py-8 text-center text-[13px] text-[#8F95B2]">{emptyHint}</p>
        ) : (
          <ul className="divide-y divide-[#F0F1F5]">
            {orders.map((row) => (
              <li key={row.id}>
                <Link
                  href={`/orders/${row.id}`}
                  className="flex flex-col gap-1 rounded-xl px-3 py-3 transition-colors hover:bg-[#F8F9FC]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[14px] font-semibold text-[#1A1F36]">{patientLabel(row)}</span>
                    <OrderStatusBadge status={row.status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[12px] text-[#8F95B2]">
                    <span>Last updated {fmtDate(row.updatedAt)}</span>
                    <span className="hidden sm:inline">·</span>
                    <span>By {row.submittedByName}</span>
                    {showPractice && row.practiceName ? (
                      <>
                        <span className="hidden sm:inline">·</span>
                        <span className="text-[#5A607F]">{row.practiceName}</span>
                      </>
                    ) : null}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { active, resultsReady, totalInScope, scope } = await getDashboardOrderLists(session.user.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1F36]">Dashboard</h1>
          <p className="mt-1 text-[14px] text-[#8F95B2]">
            {scope === "lab"
              ? "All practices — orders in the lab pipeline and those ready to release."
              : scope === "practice"
                ? "Your practice’s test orders: in progress and ready for review."
                : "You are not linked to a practice yet. Contact an administrator."}
          </p>
        </div>
        <div className="flex gap-3 text-[13px] text-[#5A607F]">
          <span>
            <strong className="font-semibold text-[#1A1F36]">{active.length}</strong> active
          </span>
          <span aria-hidden className="text-[#E2E6EF]">
            |
          </span>
          <span>
            <strong className="font-semibold text-[#1A1F36]">{resultsReady.length}</strong> results ready
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Link
          href="/orders"
          className="rounded-2xl border border-[#E2E6EF] bg-white px-5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-colors hover:border-[#C7D4FF] hover:bg-[#FAFBFF]"
        >
          <p className="text-[12px] font-medium uppercase tracking-wide text-[#8F95B2]">All orders</p>
          <p className="mt-1 text-2xl font-bold text-[#1A1F36]">{totalInScope}</p>
          <p className="mt-0.5 text-[12px] text-[#4C6FFF]">Open orders list →</p>
        </Link>
        <Link
          href="/results"
          className="rounded-2xl border border-[#E2E6EF] bg-white px-5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-colors hover:border-[#B8E4D3] hover:bg-[#F4FBF8]"
        >
          <p className="text-[12px] font-medium uppercase tracking-wide text-[#8F95B2]">Results ready</p>
          <p className="mt-1 text-2xl font-bold text-[#1A1F36]">{resultsReady.length}</p>
          <p className="mt-0.5 text-[12px] text-[#2BBBA0]">View results workspace →</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <OrderListCard
          title="Active pipeline"
          description="Submitted, kit received, or processing — not yet released."
          orders={active}
          showPractice={scope === "lab"}
          emptyHint="No orders in progress. New requisitions will appear here."
        />
        <OrderListCard
          title="Results ready"
          description="Reports uploaded — ready for practice review and patient follow-up."
          orders={resultsReady}
          showPractice={scope === "lab"}
          emptyHint="No completed results yet. Finished orders will show here."
        />
      </div>
    </div>
  );
}
