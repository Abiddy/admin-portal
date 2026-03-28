"use client";

import { useActionState } from "react";
import { revertLabOrderStatusAction, type FormState } from "../actions";
import { formatOrderStatus } from "@/lib/order-format";

export function LabRevertForm({
  orderId,
  options,
}: {
  orderId: string;
  options: string[];
}) {
  const [state, formAction, pending] = useActionState(revertLabOrderStatusAction, null as FormState);

  if (options.length === 0) {
    return null;
  }

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-[#F5D08A] bg-[#FFFBF0] p-4">
      <input type="hidden" name="orderId" value={orderId} />
      <h3 className="text-[13px] font-bold text-[#92400E]">Lab — revert to an earlier step</h3>
      <p className="text-[12px] leading-snug text-[#B45309]">
        Use if status was set by mistake (e.g. results ready too early). The timeline will record this change.
      </p>
      {state?.error ? (
        <p className="rounded-lg bg-[#FFF0ED] px-3 py-2 text-sm text-[#E2613B]" role="alert">
          {state.error}
        </p>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <label htmlFor="revertToStatus" className="mb-1 block text-[12px] font-medium text-[#5A607F]">
            Move back to
          </label>
          <select
            id="revertToStatus"
            name="revertToStatus"
            required
            className="w-full rounded-lg border border-[#E2E6EF] bg-white px-3 py-2 text-[13px] text-[#1A1F36] outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]"
            defaultValue=""
          >
            <option value="" disabled>
              Select earlier step…
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
          className="shrink-0 rounded-lg border border-[#D97706] bg-white px-4 py-2 text-[13px] font-medium text-[#B45309] hover:bg-[#FFF7ED] disabled:opacity-60"
        >
          {pending ? "Reverting…" : "Revert status"}
        </button>
      </div>
      <div>
        <label htmlFor="revert-note" className="mb-1 block text-[12px] font-medium text-[#5A607F]">
          Reason <span className="font-normal text-[#8F95B2]">(optional)</span>
        </label>
        <input
          id="revert-note"
          name="note"
          type="text"
          placeholder="e.g. Wrong file attached — reprocessing"
          className="w-full rounded-lg border border-[#E2E6EF] bg-white px-3 py-2 text-[13px] text-[#1A1F36] outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]"
        />
      </div>
    </form>
  );
}
