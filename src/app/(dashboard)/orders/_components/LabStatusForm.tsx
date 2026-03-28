"use client";

import { useActionState } from "react";
import { updateLabOrderStatusAction, type FormState } from "../actions";
import { formatOrderStatus } from "@/lib/order-format";

export function LabStatusForm({
  orderId,
  options,
}: {
  orderId: string;
  options: string[];
}) {
  const [state, formAction, pending] = useActionState(updateLabOrderStatusAction, null as FormState);

  if (options.length === 0) {
    return null;
  }

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-[#E2E6EF] bg-[#FAFBFC] p-4">
      <input type="hidden" name="orderId" value={orderId} />
      <h3 className="text-[13px] font-bold text-[#1A1F36]">Lab — advance status</h3>
      {state?.error ? (
        <p className="rounded-lg bg-[#FFF0ED] px-3 py-2 text-sm text-[#E2613B]" role="alert">
          {state.error}
        </p>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <label htmlFor="nextStatus" className="mb-1 block text-[12px] font-medium text-[#5A607F]">
            Next step
          </label>
          <select
            id="nextStatus"
            name="nextStatus"
            required
            className="w-full rounded-lg border border-[#E2E6EF] bg-white px-3 py-2 text-[13px] text-[#1A1F36] outline-none focus:border-[#4C6FFF] focus:ring-1 focus:ring-[#4C6FFF]"
            defaultValue=""
          >
            <option value="" disabled>
              Select status…
            </option>
            {options.map((s) => (
              <option key={s} value={s}>
                {formatOrderStatus(s)}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-lg bg-[#4C6FFF] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#3A5BE0] disabled:opacity-60"
        >
          {pending ? "Saving…" : "Update status"}
        </button>
      </div>
      <div>
        <label htmlFor="status-note" className="mb-1 block text-[12px] font-medium text-[#5A607F]">
          Note <span className="font-normal text-[#8F95B2]">(optional)</span>
        </label>
        <input
          id="status-note"
          name="note"
          type="text"
          placeholder="Shown on the timeline"
          className="w-full rounded-lg border border-[#E2E6EF] bg-white px-3 py-2 text-[13px] text-[#1A1F36] outline-none focus:border-[#4C6FFF] focus:ring-1 focus:ring-[#4C6FFF]"
        />
      </div>
    </form>
  );
}
