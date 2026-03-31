"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { createPracticeQuickAction } from "@/app/actions/lab-practice";

export const ADD_PRACTICE_VALUE = "__add_practice__";

export type PracticeOption = { id: string; name: string };

type Props = {
  practices: PracticeOption[];
  onPracticesChange: (next: PracticeOption[]) => void;
  onSelectedIdChange?: (id: string) => void;
  inputName?: string;
  selectId: string;
  labelId?: string;
  required?: boolean;
};

export function PracticeSelectWithAdd({
  practices,
  onPracticesChange,
  onSelectedIdChange,
  inputName = "practiceId",
  selectId,
  labelId,
  required = true,
}: Props) {
  const [selectedId, setSelectedId] = useState("");

  function updateSelected(next: string) {
    setSelectedId(next);
    onSelectedIdChange?.(next);
  }

  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  function openAdd() {
    setNewName("");
    setAddError(null);
    setAddOpen(true);
  }

  async function submitNewPractice(e: React.FormEvent) {
    e.preventDefault();
    setAddError(null);
    setAdding(true);
    try {
      const res = await createPracticeQuickAction(newName);
      if (!res.ok) {
        setAddError(res.error);
        return;
      }
      onPracticesChange([...practices, res.practice].sort((a, b) => a.name.localeCompare(b.name)));
      updateSelected(res.practice.id);
      setAddOpen(false);
      setNewName("");
    } finally {
      setAdding(false);
    }
  }

  return (
    <div>
      <input type="hidden" name={inputName} value={selectedId} />
      <select
        id={selectId}
        value={selectedId}
        required={required}
        aria-labelledby={labelId}
        onChange={(e) => {
          const v = e.target.value;
          if (v === ADD_PRACTICE_VALUE) {
            openAdd();
            return;
          }
          updateSelected(v);
        }}
        className="w-full rounded-lg border border-[#E2E6EF] px-3 py-2.5 text-sm text-[#1A1F36] outline-none focus:border-[#4C6FFF]/60 focus:ring-1 focus:ring-[#4C6FFF]"
      >
        <option value="">Select practice…</option>
        {practices.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
        <option value={ADD_PRACTICE_VALUE}>+ Add Practice</option>
      </select>

      {addOpen && typeof document !== "undefined"
        ? createPortal(
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center p-4"
              role="dialog"
              aria-modal="true"
              aria-label="New practice"
            >
              <button
                type="button"
                className="absolute inset-0 bg-[#1A1F36]/40 backdrop-blur-sm"
                aria-label="Close"
                onClick={() => setAddOpen(false)}
              />
              <form
                onSubmit={submitNewPractice}
                className="relative z-10 w-full max-w-sm rounded-2xl border border-[#E2E6EF] bg-white p-5 shadow-xl"
              >
                <h3 className="text-[15px] font-semibold text-[#1A1F36]">New practice</h3>
                <p className="mt-1 text-[12px] text-[#8F95B2]">Creates the clinic and selects it for this form.</p>
                <label htmlFor={`${selectId}-new-name`} className="mt-4 mb-1.5 block text-sm font-medium text-[#5A607F]">
                  Practice name
                </label>
                <input
                  id={`${selectId}-new-name`}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  type="text"
                  required
                  minLength={2}
                  autoFocus
                  placeholder="e.g. Northside Medical Group"
                  className="w-full rounded-lg border border-[#E2E6EF] px-3 py-2.5 text-sm text-[#1A1F36] outline-none focus:border-[#4C6FFF]/60 focus:ring-1 focus:ring-[#4C6FFF]"
                />
                {addError ? <p className="mt-2 text-sm text-[#E2613B]">{addError}</p> : null}
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setAddOpen(false)}
                    className="rounded-lg border border-[#E2E6EF] px-3 py-2 text-sm font-semibold text-[#5A607F] hover:bg-[#F5F7FA]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={adding}
                    className="rounded-lg bg-[#4C6FFF] px-3 py-2 text-sm font-semibold text-white hover:bg-[#3A5BE0] disabled:opacity-60"
                  >
                    {adding ? "Saving…" : "Create & select"}
                  </button>
                </div>
              </form>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
