"use client";

import { useActionState } from "react";
import { createRequisitionAction, type FormState } from "../actions";

export function RequisitionForm() {
  const [state, formAction, pending] = useActionState(createRequisitionAction, null as FormState);

  return (
    <form action={formAction} className="space-y-5">
      {state?.error ? (
        <p className="rounded-lg border border-[#F5C6C0] bg-[#FFF8F6] px-3 py-2 text-sm text-[#E2613B]" role="alert">
          {state.error}
        </p>
      ) : null}

      <div>
        <label htmlFor="patientName" className="mb-2 block text-sm font-medium text-[#5A607F]">
          Patient name
        </label>
        <input
          id="patientName"
          name="patientName"
          type="text"
          autoComplete="name"
          placeholder="e.g. Jane Cooper"
          className="w-full rounded-lg border border-[#E2E6EF] bg-white px-4 py-3 text-[#1A1F36] outline-none focus:border-[#4C6FFF] focus:ring-1 focus:ring-[#4C6FFF]"
        />
      </div>

      <div>
        <label htmlFor="patientEmail" className="mb-2 block text-sm font-medium text-[#5A607F]">
          Patient email
        </label>
        <input
          id="patientEmail"
          name="patientEmail"
          type="email"
          autoComplete="email"
          placeholder="patient@example.com"
          className="w-full rounded-lg border border-[#E2E6EF] bg-white px-4 py-3 text-[#1A1F36] outline-none focus:border-[#4C6FFF] focus:ring-1 focus:ring-[#4C6FFF]"
        />
      </div>

      <div>
        <label htmlFor="patientPhone" className="mb-2 block text-sm font-medium text-[#5A607F]">
          Patient phone <span className="font-normal text-[#8F95B2]">(optional)</span>
        </label>
        <input
          id="patientPhone"
          name="patientPhone"
          type="tel"
          autoComplete="tel"
          placeholder="555-0100"
          className="w-full rounded-lg border border-[#E2E6EF] bg-white px-4 py-3 text-[#1A1F36] outline-none focus:border-[#4C6FFF] focus:ring-1 focus:ring-[#4C6FFF]"
        />
      </div>

      <div>
        <label htmlFor="notes" className="mb-2 block text-sm font-medium text-[#5A607F]">
          Notes <span className="font-normal text-[#8F95B2]">(optional)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          placeholder="Panel type, clinical context, kit instructions…"
          className="w-full resize-y rounded-lg border border-[#E2E6EF] bg-white px-4 py-3 text-[#1A1F36] outline-none focus:border-[#4C6FFF] focus:ring-1 focus:ring-[#4C6FFF]"
        />
      </div>

      <p className="text-[12px] text-[#8F95B2]">Provide at least a patient name or email.</p>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-[#4C6FFF] px-5 py-3 font-medium text-white transition-colors hover:bg-[#3A5BE0] disabled:opacity-60"
        >
          {pending ? "Submitting…" : "Submit requisition"}
        </button>
      </div>
    </form>
  );
}
