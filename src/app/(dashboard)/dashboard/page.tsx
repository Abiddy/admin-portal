import Link from "next/link";

const metricCards = [
  {
    label: "Appointments",
    value: "24.4k",
    icon: "calendar",
    color: "bg-blue-700",
    bgLight: "bg-blue-50",
    textColor: "text-blue-700",
  },
  {
    label: "Total Patient",
    value: "166.3k",
    icon: "patient",
    color: "bg-rose-500",
    bgLight: "bg-rose-50",
    textColor: "text-rose-600",
  },
  {
    label: "Clinic Consulting",
    value: "53.5k",
    icon: "clinic",
    color: "bg-amber-500",
    bgLight: "bg-amber-50",
    textColor: "text-amber-600",
  },
  {
    label: "Video Consulting",
    value: "28.0k",
    icon: "video",
    color: "bg-blue-500",
    bgLight: "bg-blue-50",
    textColor: "text-blue-600",
  },
];

const appointmentRequests = [
  { name: "Savannah Nguyen", age: 45, gender: "Male", date: "12 April 9:30", status: "Declined" },
  { name: "Jacob Jones", age: 32, gender: "Female", date: "12 April 10:00", status: "Confirmed" },
  { name: "Marvin McKinney", age: 28, gender: "Male", date: "12 April 10:30", status: "pending" },
];

const todayAppointments = [
  { name: "Jhon Smith", type: "Clinic Consulting", status: "Ongoing" },
  { name: "Frank Murray", type: "Video Consulting", time: "10:25" },
  { name: "Sarah Wilson", type: "Clinic Consulting", time: "11:00" },
];

const recentPatients = [
  { name: "Deveon Lane", visitId: "OPD-2345", date: "Dec 21, 2022", gender: "Male", diseases: "Diabetes", status: "Out-Patient" },
  { name: "Marcus Reid", visitId: "OPD-2346", date: "Dec 20, 2022", gender: "Female", diseases: "Hypertension", status: "In-Patient" },
  { name: "Jordan Blake", visitId: "OPD-2347", date: "Dec 19, 2022", gender: "Male", diseases: "Asthma", status: "Out-Patient" },
];

const calendarDays = [
  { day: "S", dates: [3, 4, 5, 6, 7, 8, 9] },
];

function MetricCard({
  label,
  value,
  icon,
  color,
  bgLight,
  textColor,
}: {
  label: string;
  value: string;
  icon: string;
  color: string;
  bgLight: string;
  textColor: string;
}) {
  const icons: Record<string, React.ReactNode> = {
    calendar: (
      <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    patient: (
      <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    clinic: (
      <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    video: (
      <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  };

  return (
    <div className={`rounded-xl ${bgLight} p-4 shadow-sm`}>
      <div className={`inline-flex rounded-lg ${color} p-2 text-white`}>
        {icons[icon]}
      </div>
      <p className="mt-3 text-2xl font-bold text-gray-800">{value}</p>
      <p className={`text-sm font-medium ${textColor}`}>{label}</p>
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-600">
      {initials}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header with welcome and metric cards */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome, Dr. Stephen</h1>
          <p className="mt-1 text-gray-500">Have a nice day at great work</p>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {metricCards.map((card) => (
            <MetricCard key={card.label} {...card} />
          ))}
        </div>
      </div>

      {/* Middle section - 3 columns */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Appointment Request */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Appointment Request</h2>
            <Link href="#" className="text-sm text-blue-700 hover:underline">
              View All &gt;
            </Link>
          </div>
          <ul className="space-y-4">
            {appointmentRequests.map((req) => (
              <li key={req.name} className="flex items-center gap-3">
                <Avatar name={req.name} />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-800">{req.name}</p>
                  <p className="text-sm text-gray-500">
                    {req.age} {req.gender}, {req.date}
                  </p>
                </div>
                {req.status === "pending" ? (
                  <div className="flex gap-1">
                    <button
                      type="button"
                      className="rounded bg-green-100 p-1.5 text-green-600 hover:bg-green-200"
                      aria-label="Confirm"
                    >
                      <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="rounded bg-red-100 p-1.5 text-red-600 hover:bg-red-200"
                      aria-label="Decline"
                    >
                      <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      req.status === "Confirmed"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {req.status}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Patients & Gender */}
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">Patients</h2>
              <select className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-700">
                <option>2020</option>
              </select>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                <div className="rounded-full bg-blue-100 p-2">
                  <svg className="size-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-800">24.4k New Patient</p>
                  <p className="flex items-center gap-1 text-sm text-green-600">
                    <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    15%
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                <div className="rounded-full bg-blue-100 p-2">
                  <svg className="size-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-800">166.3k Old Patient</p>
                  <p className="flex items-center gap-1 text-sm text-green-600">
                    <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    15%
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">Gender</h2>
              <select className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-700">
                <option>2020</option>
              </select>
            </div>
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <div className="relative size-32">
                <svg viewBox="0 0 100 100" className="size-32 -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#1d4ed8"
                    strokeWidth="12"
                    strokeDasharray="113 251"
                    strokeDashoffset="0"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="12"
                    strokeDasharray="75 251"
                    strokeDashoffset="-113"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="12"
                    strokeDasharray="63 251"
                    strokeDashoffset="-188"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-700">100%</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="flex items-center gap-2 text-sm">
                  <span className="size-2 rounded-full bg-blue-700" /> Male 45%
                </p>
                <p className="flex items-center gap-2 text-sm">
                  <span className="size-2 rounded-full bg-amber-500" /> Female 30%
                </p>
                <p className="flex items-center gap-2 text-sm">
                  <span className="size-2 rounded-full bg-blue-500" /> Child 25%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Today Appointments & Calendar */}
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="mb-4 font-semibold text-gray-800">Today Appointments</h2>
            <ul className="space-y-4">
              {todayAppointments.map((apt) => (
                <li key={apt.name} className="flex items-center gap-3">
                  <Avatar name={apt.name} />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-800">{apt.name}</p>
                    <p className="text-sm text-gray-500">{apt.type}</p>
                  </div>
                  {apt.status === "Ongoing" ? (
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-600">
                      Ongoing
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-gray-600">{apt.time}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">03 - 09 May, 2021</span>
              <div className="flex gap-1">
                <button
                  type="button"
                  className="rounded p-1 hover:bg-gray-100"
                  aria-label="Previous"
                >
                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="rounded p-1 hover:bg-gray-100"
                  aria-label="Next"
                >
                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                <span key={d} className="font-medium text-gray-500">
                  {d}
                </span>
              ))}
              {[3, 4, 5, 6, 7, 8, 9].map((n) => (
                <span
                  key={n}
                  className={`rounded-full py-1 ${
                    n === 6 ? "bg-blue-700 font-medium text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {n}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-gray-800 p-4 text-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Next Week</p>
                <p className="mt-1 font-semibold">Upcoming Schedules-2</p>
              </div>
              <button
                type="button"
                className="rounded-lg bg-blue-800 px-4 py-2 text-sm font-medium hover:bg-blue-900"
              >
                Open
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Patients Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="font-semibold text-gray-800">Recent Patients</h2>
          <Link href="#" className="text-sm text-blue-700 hover:underline">
            View All &gt;
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Patient Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Visit Id
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Gender
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Diseases
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {recentPatients.map((patient) => (
                <tr key={patient.visitId} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={patient.name} />
                      <span className="font-medium text-gray-800">{patient.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{patient.visitId}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{patient.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{patient.gender}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{patient.diseases}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className="rounded p-1 hover:bg-gray-200"
                      aria-label="More options"
                    >
                      <svg className="size-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="5" r="1.5" />
                        <circle cx="12" cy="12" r="1.5" />
                        <circle cx="12" cy="19" r="1.5" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
