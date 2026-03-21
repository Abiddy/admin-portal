"use client";

import { useState } from "react";

const patients = [
  { id: 1, name: "Dillon M.", phone: "510-501-1245", email: "email@gmail.com", lastMeeting: "10/09/2025", alert: "New Test Kit Soon" },
  { id: 2, name: "Sheriah J.", phone: "510-501-1245", email: "email@gmail.com", lastMeeting: "10/09/2025", alert: "New Test Kit Soon" },
  { id: 3, name: "Ashi S.", phone: "510-501-1245", email: "email@gmail.com", lastMeeting: "10/09/2025", alert: "New Test Kit Soon" },
  { id: 4, name: "Marcus C.", phone: "510-501-1245", email: "email@gmail.com", lastMeeting: "10/09/2025", alert: "New Test Kit Soon" },
  { id: 5, name: "Sheriah J.", phone: "510-501-1245", email: "email@gmail.com", lastMeeting: "10/09/2025", alert: "New Test Kit Soon" },
  { id: 6, name: "Dillon M.", phone: "510-501-1245", email: "email@gmail.com", lastMeeting: "10/09/2025", alert: "New Test Kit Soon" },
  { id: 7, name: "Sheriah J.", phone: "510-501-1245", email: "email@gmail.com", lastMeeting: "10/09/2025", alert: "New Test Kit Soon" },
  { id: 8, name: "Ashi S.", phone: "510-501-1245", email: "email@gmail.com", lastMeeting: "10/09/2025", alert: "New Test Kit Soon" },
  { id: 9, name: "Marcus C.", phone: "510-501-1245", email: "email@gmail.com", lastMeeting: "10/09/2025", alert: "New Test Kit Soon" },
  { id: 10, name: "Sheriah J.", phone: "510-501-1245", email: "email@gmail.com", lastMeeting: "10/09/2025", alert: "New Test Kit Soon" },
  { id: 11, name: "Dillon M.", phone: "510-501-1245", email: "email@gmail.com", lastMeeting: "10/09/2025", alert: "New Test Kit Soon" },
  { id: 12, name: "Sheriah J.", phone: "510-501-1245", email: "email@gmail.com", lastMeeting: "10/09/2025", alert: "New Test Kit Soon" },
  { id: 13, name: "Ashi S.", phone: "510-501-1245", email: "email@gmail.com", lastMeeting: "10/09/2025", alert: "New Test Kit Soon" },
  { id: 14, name: "Marcus C.", phone: "510-501-1245", email: "email@gmail.com", lastMeeting: "10/09/2025", alert: "New Test Kit Soon" },
];

const activityLog = [
  { description: "Sarah G.'s results are ready", time: "10/10/25 at 6:30 AM" },
  { description: "Sarah G.'s test kit processing", time: "10/10/25 at 6:30 AM" },
  { description: "Sarah G. test kit received", time: "10/10/25 at 6:30 AM" },
  { description: "Sarah G. mailed in her test kit", time: "10/10/25 at 6:30 AM" },
  { description: "Sarah G. ordered a test kit.", time: "10/10/25 at 6:30 AM" },
];

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#E2E6EF] text-xs font-medium text-[#5A607F]">
      {initials}
    </div>
  );
}

function SortIcon() {
  return (
    <svg className="ml-1 inline size-3 text-[#8F95B2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
    </svg>
  );
}

function ActionButton({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="rounded-lg p-1.5 text-[#8F95B2] transition-colors hover:bg-[#EEF2FF] hover:text-[#4C6FFF]"
      aria-label={label}
    >
      {children}
    </button>
  );
}

export default function PatientsPage() {
  const [selected, setSelected] = useState(1);
  const selectedPatient = patients.find((p) => p.id === selected);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#1A1F36]">Patients</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-[#E2E6EF] bg-white px-4 py-2">
            <input
              type="text"
              placeholder="Search Up Patient"
              className="w-52 bg-transparent text-[13px] text-[#1A1F36] placeholder-[#8F95B2] outline-none"
            />
            <svg className="size-4 text-[#8F95B2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button type="button" className="flex size-10 items-center justify-center rounded-xl bg-[#4C6FFF] text-white hover:bg-[#3A5BE0]" aria-label="Add patient">
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[3fr_1fr]">
        {/* Patient Table */}
        <div className="rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#EEF0F6]">
                  <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-[#8F95B2]">
                    Patient <SortIcon />
                  </th>
                  <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-[#8F95B2]">Phone</th>
                  <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-[#8F95B2]">Email</th>
                  <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-[#8F95B2]">
                    Last Meeting <SortIcon />
                  </th>
                  <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-[#8F95B2]">Alert</th>
                  <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-[#8F95B2]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr
                    key={patient.id}
                    onClick={() => setSelected(patient.id)}
                    className={`cursor-pointer border-b border-[#F0F1F5] transition-colors last:border-0 ${
                      selected === patient.id ? "bg-[#F5F7FA]" : "hover:bg-[#FAFBFC]"
                    }`}
                  >
                    <td className="whitespace-nowrap px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={patient.name} />
                        <span className="text-[13px] font-medium text-[#1A1F36]">{patient.name}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-[13px] text-[#5A607F]">{patient.phone}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-[13px] text-[#5A607F]">{patient.email}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-[13px] text-[#5A607F]">{patient.lastMeeting}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-[#FFF8ED] px-2.5 py-1 text-[11px] font-semibold text-[#E2963B]">
                        {patient.alert}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-0.5">
                        {/* Appointment */}
                        <ActionButton label="Book appointment">
                          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </ActionButton>
                        {/* Message */}
                        <ActionButton label="Message">
                          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </ActionButton>
                        {/* Orders */}
                        <ActionButton label="Orders">
                          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </ActionButton>
                        {/* Results */}
                        <ActionButton label="Results">
                          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </ActionButton>
                        {/* Treatment Plans */}
                        <ActionButton label="Treatment Plans">
                          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                          </svg>
                        </ActionButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* Newest Assignment */}
          <div className="rounded-2xl bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-[#1A1F36]">Newest Assignment</h3>
              <button type="button" className="text-[12px] font-medium text-[#4C6FFF] underline underline-offset-2 hover:text-[#3A5BE0]">
                View Profile
              </button>
            </div>
            <div className="mb-4 flex items-start gap-3">
              <Avatar name={selectedPatient?.name || ""} />
              <div className="text-[12px] text-[#5A607F]">
                <p><span className="font-semibold text-[#1A1F36]">Patient Name:</span> {selectedPatient?.name}</p>
                <p><span className="font-semibold text-[#1A1F36]">Weight:</span> 190lbs</p>
                <p><span className="font-semibold text-[#1A1F36]">Height:</span> 5 ft 11 in</p>
                <p><span className="font-semibold text-[#1A1F36]">Detail:</span> XYZ</p>
              </div>
            </div>
            <p className="mb-4 text-[12px] leading-relaxed text-[#5A607F]">
              Last appointment, birthday, sex, became patient on this date. Patient history? Further patient details.
            </p>
            <div className="flex items-center gap-1.5">
              {/* Message */}
              <button type="button" className="rounded-lg border border-[#E2E6EF] p-2 text-[#8F95B2] transition-colors hover:bg-[#EEF2FF] hover:text-[#4C6FFF]" aria-label="Message">
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
              {/* Edit appointment */}
              <button type="button" className="rounded-lg border border-[#E2E6EF] p-2 text-[#8F95B2] transition-colors hover:bg-[#EEF2FF] hover:text-[#4C6FFF]" aria-label="Edit appointment">
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
              {/* View documents */}
              <button type="button" className="rounded-lg border border-[#E2E6EF] p-2 text-[#8F95B2] transition-colors hover:bg-[#EEF2FF] hover:text-[#4C6FFF]" aria-label="View all documents">
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </button>
              {/* View Notes */}
              <button type="button" className="rounded-lg border border-[#E2E6EF] p-2 text-[#8F95B2] transition-colors hover:bg-[#EEF2FF] hover:text-[#4C6FFF]" aria-label="View Notes">
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Activity Log */}
          <div className="rounded-2xl bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <h3 className="mb-3 text-[15px] font-bold text-[#1A1F36]">Activity Log</h3>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="pb-2 text-left text-[10px] font-bold uppercase tracking-wider text-[#8F95B2]">Activity</th>
                  <th className="pb-2 text-right text-[10px] font-bold uppercase tracking-wider text-[#8F95B2]">Time</th>
                </tr>
              </thead>
              <tbody>
                {activityLog.map((a, i) => (
                  <tr key={i} className="border-b border-[#F0F1F5] last:border-0">
                    <td className="py-2 text-[11px] text-[#3D4354]">{a.description}</td>
                    <td className="py-2 text-right text-[11px] text-[#8F95B2]">{a.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Order CTA */}
          <div className="rounded-2xl bg-gradient-to-br from-[#4C3FB5] to-[#6C5CE7] p-6 text-center">
            <p className="mb-4 text-[15px] font-semibold text-white">Need to order more test kits?</p>
            <button
              type="button"
              className="rounded-xl bg-white/20 px-6 py-2.5 text-[13px] font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/30"
            >
              Click here to order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
