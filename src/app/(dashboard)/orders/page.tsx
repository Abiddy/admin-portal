import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { getAllOrdersForUser } from "@/lib/order-queries";
import { prisma } from "@/lib/prisma";
import { ROLES } from "@/lib/roles";

function fmtDate(d: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { orders, scope } = await getAllOrdersForUser(session.user.id);

  const viewer = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { practiceId: true, role: true },
  });
  const canCreateRequisition =
    Boolean(viewer?.practiceId) && viewer?.role !== ROLES.LAB_ADMIN;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
        <h1 className="text-2xl font-bold text-[#1A1F36]">Orders</h1>
        <p className="mt-1 text-[14px] text-[#8F95B2]">
          {scope === "lab"
            ? "All practices — every test order in the system."
            : scope === "practice"
              ? "Orders for your practice."
              : "No practice assigned — you will not see orders here."}
        </p>
        </div>
        {canCreateRequisition ? (
          <Link
            href="/orders/new"
            className="inline-flex items-center rounded-lg bg-[#4C6FFF] px-4 py-2.5 text-[13px] font-medium text-white hover:bg-[#3A5BE0]"
          >
            New requisition
          </Link>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E2E6EF] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#F0F1F5] bg-[#FAFBFC]">
                <th className="px-4 py-3 font-semibold text-[#5A607F]">Patient</th>
                {scope === "lab" ? (
                  <th className="px-4 py-3 font-semibold text-[#5A607F]">Practice</th>
                ) : null}
                <th className="px-4 py-3 font-semibold text-[#5A607F]">Status</th>
                <th className="px-4 py-3 font-semibold text-[#5A607F]">Submitted by</th>
                <th className="px-4 py-3 font-semibold text-[#5A607F]">Updated</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={scope === "lab" ? 5 : 4}
                    className="px-4 py-12 text-center text-[#8F95B2]"
                  >
                    No orders yet.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="border-b border-[#F0F1F5] last:border-0">
                    <td className="px-4 py-3">
                      <Link href={`/orders/${o.id}`} className="font-medium text-[#4C6FFF] hover:underline">
                        {o.patientName?.trim() || o.patientEmail?.trim() || "Unnamed patient"}
                      </Link>
                    </td>
                    {scope === "lab" ? (
                      <td className="px-4 py-3 text-[#3D4354]">{o.practiceName ?? "—"}</td>
                    ) : null}
                    <td className="px-4 py-3">
                      <OrderStatusBadge status={o.status} />
                    </td>
                    <td className="px-4 py-3 text-[#5A607F]">{o.submittedByName}</td>
                    <td className="px-4 py-3 text-[#8F95B2]">{fmtDate(o.updatedAt)}</td>
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
