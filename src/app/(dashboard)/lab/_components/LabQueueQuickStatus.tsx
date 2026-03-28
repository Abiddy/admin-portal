"use client";

import { useActionState } from "react";
import { formatOrderStatus } from "@/lib/order-format";
import { forwardStatusOptions } from "@/lib/order-lifecycle";
import { updateLabOrderStatusAction, type FormState } from "../../orders/actions";

export function LabQueueQuickStatus({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const options = forwardStatusOptions(currentStatus);
  const [state, formAction, pending] = useActionState(updateLabOrderStatusAction, null as FormState);

  if (options.length === 0) {
    return <span className="text-[12px] font-medium text-[#8F95B2]">Pipeline complete</span>;
  }

  return (
    <form action={formAction} className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-2">
      <input type="hidden" name="orderId" value={orderId} />
      <select
        name="nextStatus"
        required
        className="min-w-[140px] rounded-lg border border-[#E2E6EF] bg-white px-2 py-1.5 text-[12px] text-[#1A1F36] outline-none focus:border-[#4C6FFF] focus:ring-1 focus:ring-[#4C6FFF]"
        defaultValue=""
      >
        <option value="" disabled>
          Advance to…
        </option>
        {options.map((s) => (
          <option key={s} value={s}>
            {formatOrderStatus(s)}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-[#1A1F36] px-3 py-1.5 text-[12px] font-medium text-white hover:bg-[#2A2F46] disabled:opacity-60"
      >
        {pending ? "…" : "Update"}
      </button>
      {state?.error ? <span className="max-w-[140px] text-[11px] leading-tight text-[#E2613B]">{state.error}</span> : null}
    </form>
  );
}
