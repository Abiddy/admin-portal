"use client";

import { useActionState, useEffect, useState } from "react";
import { createUserInviteAction, type InviteFormState } from "@/app/actions/user-invite";
import { PracticeSelectWithAdd } from "@/components/PracticeSelectWithAdd";
import { ROLES } from "@/lib/roles";

type PracticeRow = { id: string; name: string };

function AddUserInviteModalForm({ onClose }: { onClose: () => void }) {
  const [practices, setPractices] = useState<PracticeRow[]>([]);
  const [role, setRole] = useState<string>(ROLES.DOCTOR);
  const [doctorPracticeId, setDoctorPracticeId] = useState("");
  const [state, formAction, pending] = useActionState(createUserInviteAction, null as InviteFormState | null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/lab/practices");
        if (!res.ok) return;
        const data = (await res.json()) as { practices?: PracticeRow[] };
        if (!cancelled && data.practices) setPractices(data.practices);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (state && "success" in state && state.success) {
    return (
      <div className="p-6 pt-0">
        <p className="rounded-lg border border-emerald-200/80 bg-emerald-50/90 px-3 py-2 text-sm text-emerald-900">
          Invite sent. They&apos;ll receive an email with a link to set their password.
        </p>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#4C6FFF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3A5BE0]"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-5 space-y-4 px-6 pb-6">
      <div>
        <label htmlFor="inv-name" className="mb-1.5 block text-sm font-medium text-[#5A607F]">
          Name
        </label>
        <input
          id="inv-name"
          name="name"
          type="text"
          required
          minLength={2}
          className="w-full rounded-lg border border-[#E2E6EF] px-3 py-2.5 text-sm text-[#1A1F36] outline-none focus:border-[#4C6FFF]/60 focus:ring-1 focus:ring-[#4C6FFF]"
        />
      </div>
      <div>
        <label htmlFor="inv-email" className="mb-1.5 block text-sm font-medium text-[#5A607F]">
          Email
        </label>
        <input
          id="inv-email"
          name="email"
          type="email"
          required
          autoComplete="off"
          className="w-full rounded-lg border border-[#E2E6EF] px-3 py-2.5 text-sm text-[#1A1F36] outline-none focus:border-[#4C6FFF]/60 focus:ring-1 focus:ring-[#4C6FFF]"
        />
      </div>
      <div>
        <label htmlFor="inv-role" className="mb-1.5 block text-sm font-medium text-[#5A607F]">
          Role
        </label>
        <select
          id="inv-role"
          name="role"
          value={role}
          onChange={(e) => {
            const v = e.target.value;
            setRole(v);
            if (v !== ROLES.DOCTOR) setDoctorPracticeId("");
          }}
          className="w-full rounded-lg border border-[#E2E6EF] px-3 py-2.5 text-sm text-[#1A1F36] outline-none focus:border-[#4C6FFF]/60 focus:ring-1 focus:ring-[#4C6FFF]"
        >
          <option value={ROLES.DOCTOR}>Doctor (practice)</option>
          <option value={ROLES.LAB_ADMIN}>Lab admin</option>
        </select>
      </div>
      {role === ROLES.DOCTOR ? (
        <div>
          <label id="inv-practice-label" htmlFor="inv-practice" className="mb-1.5 block text-sm font-medium text-[#5A607F]">
            Practice
          </label>
          <PracticeSelectWithAdd
            key={role}
            practices={practices}
            onPracticesChange={setPractices}
            onSelectedIdChange={setDoctorPracticeId}
            selectId="inv-practice"
            labelId="inv-practice-label"
          />
        </div>
      ) : (
        <input type="hidden" name="practiceId" value="" />
      )}

      {state && "error" in state && state.error ? (
        <p className="text-sm text-[#E2613B]" role="alert">
          {state.error}
        </p>
      ) : null}

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-[#E2E6EF] px-4 py-2 text-sm font-semibold text-[#5A607F] hover:bg-[#F5F7FA]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={pending || (role === ROLES.DOCTOR && !doctorPracticeId)}
          className="rounded-lg bg-[#4C6FFF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3A5BE0] disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send invite"}
        </button>
      </div>
    </form>
  );
}

export function AddUserInviteModal() {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setFormKey((k) => k + 1);
          setOpen(true);
        }}
        className="rounded-lg bg-[#4C6FFF] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#3A5BE0]"
      >
        Add user
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="invite-title">
          <button
            type="button"
            className="absolute inset-0 bg-[#1A1F36]/40 backdrop-blur-sm"
            aria-label="Close"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-[#E2E6EF] bg-white shadow-xl">
            <div className="p-6 pb-0">
              <h2 id="invite-title" className="text-lg font-semibold text-[#1A1F36]">
                Invite user
              </h2>
              <p className="mt-1 text-[13px] text-[#8F95B2]">
                We&apos;ll email them a link to set their password (expires in 72 hours). Use <span className="font-medium text-[#5A607F]">+ Add Practice</span> in the practice list if needed.
              </p>
            </div>
            <AddUserInviteModalForm key={formKey} onClose={() => setOpen(false)} />
          </div>
        </div>
      ) : null}
    </>
  );
}
