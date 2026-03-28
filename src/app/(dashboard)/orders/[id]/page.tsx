import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { LabRevertForm } from "../_components/LabRevertForm";
import { LabStatusForm } from "../_components/LabStatusForm";
import { OrderMessageForm } from "../_components/OrderMessageForm";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { orderStatusDotClass } from "@/lib/order-format";
import { earlierStatusOptions, forwardStatusOptions } from "@/lib/order-lifecycle";
import { getOrderForViewer } from "@/lib/order-queries";
import { isLabRole } from "@/lib/roles";

type Props = { params: Promise<{ id: string }> };

function fmtDateTime(d: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

export default async function OrderDetailPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;
  const order = await getOrderForViewer(id, session.user.id);
  if (!order) {
    notFound();
  }

  const isLab = isLabRole(session.user.role);
  const nextStatuses = forwardStatusOptions(order.status);
  const revertStatuses = earlierStatusOptions(order.status);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/dashboard" className="text-[13px] font-medium text-[#4C6FFF] hover:underline">
          ← Dashboard
        </Link>
        <Link href="/orders" className="text-[13px] font-medium text-[#8F95B2] hover:text-[#4C6FFF] hover:underline">
          All orders
        </Link>
        <a
          href={`/api/orders/${order.id}/requisition-pdf`}
          className="ml-auto inline-flex items-center rounded-lg border border-[#E2E6EF] bg-white px-3 py-1.5 text-[13px] font-medium text-[#5A607F] shadow-sm hover:border-[#C7D4FF] hover:text-[#4C6FFF]"
        >
          Download PDF
        </a>
      </div>

      <div className="rounded-2xl border border-[#E2E6EF] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-wide text-[#8F95B2]">Order</p>
            <h1 className="mt-1 text-2xl font-bold text-[#1A1F36]">
              {order.patientName?.trim() || order.patientEmail?.trim() || "Unnamed patient"}
            </h1>
            <p className="mt-1 text-[13px] text-[#8F95B2]">
              {order.practice.name}
              {" · "}
              Submitted by {order.submittedBy.name}
            </p>
          </div>
          <OrderStatusBadge status={order.status} className="px-3 py-1.5 text-[12px]" />
        </div>

        <dl className="mt-6 grid gap-3 text-[13px] sm:grid-cols-2">
          {order.patientEmail ? (
            <div>
              <dt className="text-[#8F95B2]">Email</dt>
              <dd className="font-medium text-[#1A1F36]">{order.patientEmail}</dd>
            </div>
          ) : null}
          {order.patientPhone ? (
            <div>
              <dt className="text-[#8F95B2]">Phone</dt>
              <dd className="font-medium text-[#1A1F36]">{order.patientPhone}</dd>
            </div>
          ) : null}
          <div>
            <dt className="text-[#8F95B2]">Created</dt>
            <dd className="font-medium text-[#1A1F36]">{fmtDateTime(order.createdAt)}</dd>
          </div>
        </dl>

        {order.notes ? (
          <div className="mt-6 rounded-xl bg-[#F8F9FC] p-4">
            <p className="text-[12px] font-medium uppercase tracking-wide text-[#8F95B2]">Notes</p>
            <p className="mt-1 text-[14px] text-[#3D4354]">{order.notes}</p>
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#E2E6EF] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h2 className="text-[15px] font-bold text-[#1A1F36]">Status timeline</h2>
          <p className="mt-0.5 text-[13px] text-[#8F95B2]">How this order moved through the lab pipeline.</p>

          {order.statusEvents.length === 0 ? (
            <div className="mt-4 rounded-xl bg-[#FAFBFC] p-4 text-[13px] text-[#5A607F]">
              <p className="flex flex-wrap items-center gap-2">
                <span>No recorded events yet. Current status:</span>
                <OrderStatusBadge status={order.status} />
              </p>
              <p className="mt-2 text-[12px] text-[#8F95B2]">Older orders may pre-date the timeline; new updates will appear here.</p>
            </div>
          ) : (
            <ul className="relative mt-6 ml-2 space-y-5 border-l border-[#E2E6EF] pl-6">
              {order.statusEvents.map((ev) => (
                <li key={ev.id} className="relative">
                  <span
                    className={`absolute -left-[29px] top-2 size-2.5 rounded-full ring-4 ring-white ${orderStatusDotClass(ev.status)}`}
                  />
                  <OrderStatusBadge status={ev.status} className="text-[12px]" />
                  <p className="mt-0.5 text-[12px] text-[#8F95B2]">
                    {fmtDateTime(ev.createdAt)}
                    {ev.actor ? ` · ${ev.actor.name}` : ""}
                  </p>
                  {ev.note ? <p className="mt-1 text-[13px] text-[#3D4354]">{ev.note}</p> : null}
                </li>
              ))}
            </ul>
          )}

          {isLab ? (
            <div className="mt-6 space-y-4">
              {nextStatuses.length > 0 ? (
                <LabStatusForm orderId={order.id} options={nextStatuses} />
              ) : (
                <p className="text-[13px] text-[#8F95B2]">
                  No further forward steps — this order is at the end of the pipeline. You can still revert below if
                  that was a mistake.
                </p>
              )}
              <LabRevertForm orderId={order.id} options={revertStatuses} />
            </div>
          ) : null}
        </div>

        <div className="rounded-2xl border border-[#E2E6EF] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h2 className="text-[15px] font-bold text-[#1A1F36]">Order thread</h2>
          <p className="mt-0.5 text-[13px] text-[#8F95B2]">Questions and notes between your team and the lab.</p>

          <ul className="mt-4 max-h-[280px] space-y-4 overflow-y-auto pr-1">
            {order.messages.length === 0 ? (
              <li className="text-[13px] text-[#8F95B2]">No messages yet.</li>
            ) : (
              order.messages.map((m) => (
                <li key={m.id} className="rounded-xl bg-[#F8F9FC] px-3 py-2.5">
                  <p className="text-[12px] font-medium text-[#5A607F]">
                    {m.user.name}
                    <span className="font-normal text-[#8F95B2]"> · {fmtDateTime(m.createdAt)}</span>
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-[13px] text-[#1A1F36]">{m.body}</p>
                </li>
              ))
            )}
          </ul>

          <div className="mt-4 border-t border-[#F0F1F5] pt-4">
            <OrderMessageForm orderId={order.id} messageCount={order.messages.length} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#E2E6EF] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <h2 className="text-[15px] font-bold text-[#1A1F36]">Results files</h2>
        {order.results.length === 0 ? (
          <p className="mt-2 text-[13px] text-[#8F95B2]">No files uploaded yet.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {order.results.map((r) => (
              <li
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#EEF0F6] px-3 py-2 text-[13px]"
              >
                <span className="font-medium text-[#1A1F36]">{r.fileName}</span>
                <span className="flex items-center gap-3 text-[#8F95B2]">
                  {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(r.createdAt)}
                  {r.fileKey !== "__pending__" ? (
                    <a
                      href={`/api/results/${r.id}/file`}
                      className="font-medium text-[#4C6FFF] hover:underline"
                    >
                      Download
                    </a>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
