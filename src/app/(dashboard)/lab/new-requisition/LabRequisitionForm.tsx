"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { PracticeSelectWithAdd } from "@/components/PracticeSelectWithAdd";
import type { FormState } from "../../orders/actions";
import { createLabRequisitionAction } from "./actions";

type PracticeRow = { id: string; name: string };
type DoctorRow = { id: string; name: string; email: string };

export function LabRequisitionForm({ practices: initialPractices }: { practices: PracticeRow[] }) {
  const [practices, setPractices] = useState(initialPractices);
  const [practiceId, setPracticeId] = useState("");
  const [doctors, setDoctors] = useState<DoctorRow[]>([]);
  const [doctorId, setDoctorId] = useState("");
  const [state, formAction, pending] = useActionState(createLabRequisitionAction, null as FormState);

  useEffect(() => {
    setPractices(initialPractices);
  }, [initialPractices]);

  useEffect(() => {
    if (!practiceId) {
      setDoctors([]);
      setDoctorId("");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/lab/practices/${encodeURIComponent(practiceId)}/doctors`);
        if (!res.ok) {
          if (!cancelled) {
            setDoctors([]);
            setDoctorId("");
          }
          return;
        }
        const data = (await res.json()) as { doctors?: DoctorRow[] };
        if (!cancelled && data.doctors) {
          setDoctors(data.doctors);
          setDoctorId("");
        }
      } catch {
        if (!cancelled) {
          setDoctors([]);
          setDoctorId("");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [practiceId]);

  const selectedDoctor = doctors.find((d) => d.id === doctorId);

  return (
    <form action={formAction} className="space-y-5">
      {state?.error ? (
        <p className="rounded-lg border border-[#F5C6C0] bg-[#FFF8F6] px-3 py-2 text-sm text-[#E2613B]" role="alert">
          {state.error}
        </p>
      ) : null}

      <div>
        <label id="lab-req-practice-label" htmlFor="lab-req-practice" className="mb-2 block text-sm font-medium text-[#5A607F]">
          Practice
        </label>
        <PracticeSelectWithAdd
          practices={practices}
          onPracticesChange={setPractices}
          onSelectedIdChange={setPracticeId}
          selectId="lab-req-practice"
          labelId="lab-req-practice-label"
        />
      </div>

      <div>
        <label htmlFor="lab-req-doctor" className="mb-2 block text-sm font-medium text-[#5A607F]">
          Doctor
        </label>
        <select
          id="lab-req-doctor"
          name="submittedById"
          value={doctorId}
          required
          disabled={!practiceId || doctors.length === 0}
          onChange={(e) => setDoctorId(e.target.value)}
          className="w-full rounded-lg border border-[#E2E6EF] bg-white px-4 py-3 text-[#1A1F36] outline-none focus:border-[#4C6FFF] focus:ring-1 focus:ring-[#4C6FFF] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="">{practiceId ? "Select doctor…" : "Select a practice first"}</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        {practiceId && doctors.length === 0 ? (
          <p className="mt-2 text-[12px] text-[#8F95B2]">No doctors in this practice yet — invite one with Add user.</p>
        ) : null}
        {selectedDoctor ? (
          <p className="mt-2 text-[13px] text-[#5A607F]">
            <span className="font-medium text-[#3D4354]">Notification email:</span> {selectedDoctor.email}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="lab-patientName" className="mb-2 block text-sm font-medium text-[#5A607F]">
          Patient name
        </label>
        <input
          id="lab-patientName"
          name="patientName"
          type="text"
          autoComplete="name"
          placeholder="e.g. Jane Cooper"
          className="w-full rounded-lg border border-[#E2E6EF] bg-white px-4 py-3 text-[#1A1F36] outline-none focus:border-[#4C6FFF] focus:ring-1 focus:ring-[#4C6FFF]"
        />
      </div>

      <div>
        <label htmlFor="lab-patientEmail" className="mb-2 block text-sm font-medium text-[#5A607F]">
          Patient email
        </label>
        <input
          id="lab-patientEmail"
          name="patientEmail"
          type="email"
          autoComplete="email"
          placeholder="patient@example.com"
          className="w-full rounded-lg border border-[#E2E6EF] bg-white px-4 py-3 text-[#1A1F36] outline-none focus:border-[#4C6FFF] focus:ring-1 focus:ring-[#4C6FFF]"
        />
      </div>

      <div>
        <label htmlFor="lab-patientPhone" className="mb-2 block text-sm font-medium text-[#5A607F]">
          Patient phone <span className="font-normal text-[#8F95B2]">(optional)</span>
        </label>
        <input
          id="lab-patientPhone"
          name="patientPhone"
          type="tel"
          autoComplete="tel"
          placeholder="555-0100"
          className="w-full rounded-lg border border-[#E2E6EF] bg-white px-4 py-3 text-[#1A1F36] outline-none focus:border-[#4C6FFF] focus:ring-1 focus:ring-[#4C6FFF]"
        />
      </div>

      <div>
        <label htmlFor="lab-notes" className="mb-2 block text-sm font-medium text-[#5A607F]">
          Notes <span className="font-normal text-[#8F95B2]">(optional)</span>
        </label>
        <textarea
          id="lab-notes"
          name="notes"
          rows={4}
          placeholder="Panel type, clinical context, kit instructions…"
          className="w-full resize-y rounded-lg border border-[#E2E6EF] bg-white px-4 py-3 text-[#1A1F36] outline-none focus:border-[#4C6FFF] focus:ring-1 focus:ring-[#4C6FFF]"
        />
      </div>

      <p className="text-[12px] text-[#8F95B2]">Provide at least a patient name or email. The doctor receives an email with a link to this order.</p>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={pending || !practiceId || !doctorId}
          className="rounded-lg bg-[#4C6FFF] px-5 py-3 font-medium text-white transition-colors hover:bg-[#3A5BE0] disabled:opacity-60"
        >
          {pending ? "Submitting…" : "Submit requisition"}
        </button>
        <Link
          href="/orders"
          className="inline-flex items-center rounded-lg border border-[#E2E6EF] px-5 py-3 text-sm font-medium text-[#5A607F] hover:bg-[#F5F7FA]"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
