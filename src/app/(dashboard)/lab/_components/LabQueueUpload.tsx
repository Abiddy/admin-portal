"use client";

import { useActionState } from "react";
import { uploadLabResultAction } from "../actions";
import type { FormState } from "../../orders/actions";

export function LabQueueUpload({ orderId }: { orderId: string }) {
  const [state, formAction, pending] = useActionState(uploadLabResultAction, null as FormState);

  return (
    <form action={formAction} encType="multipart/form-data" className="flex flex-col gap-2">
      <input type="hidden" name="orderId" value={orderId} />
      <div className="flex flex-wrap items-center gap-2">
        <label className="sr-only" htmlFor={`file-${orderId}`}>
          PDF file
        </label>
        <input
          id={`file-${orderId}`}
          name="file"
          type="file"
          accept="application/pdf,.pdf"
          required
          className="max-w-[200px] text-[11px] text-[#5A607F] file:mr-2 file:rounded-md file:border-0 file:bg-[#EEF2FF] file:px-2 file:py-1 file:text-[11px] file:font-medium file:text-[#4C6FFF]"
        />
        <label className="flex cursor-pointer items-center gap-1.5 text-[11px] text-[#5A607F]">
          <input type="checkbox" name="markReady" value="1" className="rounded border-[#E2E6EF]" />
          Mark results ready
        </label>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-lg border border-[#C7D4FF] bg-[#EEF2FF] px-2.5 py-1 text-[11px] font-semibold text-[#4C6FFF] hover:bg-[#E0E7FF] disabled:opacity-60"
      >
        {pending ? "Uploading…" : "Upload PDF"}
      </button>
      {state?.error ? <p className="text-[11px] text-[#E2613B]">{state.error}</p> : null}
    </form>
  );
}
