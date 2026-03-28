import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { getResultsWorkspace } from "@/lib/order-queries";

function patientLabel(row: { patientName: string | null; patientEmail: string | null }) {
  return row.patientName?.trim() || row.patientEmail?.trim() || "Unnamed patient";
}

function fmtDate(d: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

export default async function ResultsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { scope, rows } = await getResultsWorkspace(session.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1F36]">Results</h1>
        <p className="mt-1 max-w-2xl text-[14px] text-[#8F95B2]">
          {scope === "lab"
            ? "All practices — every order with at least one result PDF on file. Download for QA or to resend to a clinic."
            : scope === "practice"
              ? "Final reports for your practice. Open the order for notes and the lab thread, or download PDFs here."
              : "Your account is not linked to a practice — you will not see patient results here."}
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E2E6EF] bg-[#FAFBFC] px-6 py-14 text-center">
          <p className="text-[15px] font-medium text-[#5A607F]">No result PDFs yet</p>
          <p className="mt-2 text-[13px] text-[#8F95B2]">
            When the lab uploads a report, it will show up here and on the order detail page.
          </p>
          <Link
            href="/dashboard"
            className="mt-5 inline-block text-[13px] font-medium text-[#4C6FFF] hover:underline"
          >
            Back to dashboard
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#E2E6EF] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-[13px]">
              <thead>
                <tr className="border-b border-[#F0F1F5] bg-[#FAFBFC]">
                  <th className="px-4 py-3 font-semibold text-[#5A607F]">Patient / order</th>
                  {scope === "lab" ? (
                    <th className="px-4 py-3 font-semibold text-[#5A607F]">Practice</th>
                  ) : null}
                  <th className="px-4 py-3 font-semibold text-[#5A607F]">Order status</th>
                  <th className="px-4 py-3 font-semibold text-[#5A607F]">Submitted by</th>
                  <th className="min-w-[220px] px-4 py-3 font-semibold text-[#5A607F]">PDF files</th>
                  <th className="px-4 py-3 font-semibold text-[#5A607F]">Order</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.orderId} className="border-b border-[#F0F1F5] align-top last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-[#1A1F36]">{patientLabel(row)}</p>
                      <p className="text-[11px] text-[#8F95B2]">Updated {fmtDate(row.updatedAt)}</p>
                    </td>
                    {scope === "lab" ? (
                      <td className="px-4 py-3 text-[#3D4354]">{row.practiceName ?? "—"}</td>
                    ) : null}
                    <td className="px-4 py-3">
                      <OrderStatusBadge status={row.status} />
                    </td>
                    <td className="px-4 py-3 text-[#5A607F]">{row.submittedByName}</td>
                    <td className="px-4 py-3">
                      <ul className="space-y-2">
                        {row.files.map((f) => (
                          <li key={f.id} className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="max-w-[200px] truncate font-medium text-[#1A1F36]" title={f.fileName}>
                              {f.fileName}
                            </span>
                            <span className="text-[11px] text-[#8F95B2]">{fmtDate(f.createdAt)}</span>
                            <a
                              href={`/api/results/${f.id}/file`}
                              className="shrink-0 text-[12px] font-semibold text-[#14B8A6] hover:underline"
                            >
                              Download
                            </a>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/orders/${row.orderId}`}
                        className="font-medium text-[#4C6FFF] hover:underline"
                      >
                        View order
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
