import Link from "next/link";

const metricCards = [
  {
    label: "Appointments",
    value: "24.4k",
    icon: "calendar",
    iconBg: "bg-[#EFF2F7]",
    iconColor: "text-[#6B7A99]",
  },
  {
    label: "Total Patient",
    value: "166.3k",
    icon: "patient",
    iconBg: "bg-[#FFF0ED]",
    iconColor: "text-[#E2613B]",
  },
  {
    label: "Clinic Consulting",
    value: "53.5k",
    icon: "clinic",
    iconBg: "bg-[#FFF8ED]",
    iconColor: "text-[#E2963B]",
  },
  {
    label: "Video Consulting",
    value: "28.0k",
    icon: "video",
    iconBg: "bg-[#EDFAF7]",
    iconColor: "text-[#2BBBA0]",
  },
];

const patientAgeGroups = [
  { label: "8-15", value: 17, maxValue: 150 },
  { label: "16-20", value: 45, maxValue: 150 },
  { label: "21-29", value: 102, maxValue: 150, highlighted: true },
  { label: "30-45", value: 148, maxValue: 150 },
  { label: "46-60", value: 58, maxValue: 150 },
  { label: "61-80", value: 3, maxValue: 150 },
];

const appointmentRequests = [
  { name: "Savannah Nguyen", date: "06 Feb, 11:00 am - 11:45 am", type: "Individual Counselling" },
  { name: "Jacob Jones", date: "08 Feb, 4:00 am - 5:00 pm", type: "Couple Counselling" },
  { name: "Marvin McKinney", date: "08 Feb, 8:00 pm - 9:00 pm", type: "Family Counselling" },
  { name: "Khalil Ahmed", date: "10 Feb, 11:00 am - 12:00 am", type: "Family Counselling" },
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
  iconBg,
  iconColor,
}: {
  label: string;
  value: string;
  icon: string;
  iconBg: string;
  iconColor: string;
}) {
  const icons: Record<string, React.ReactNode> = {
    calendar: (
      <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    patient: (
      <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    clinic: (
      <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    video: (
      <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  };

  return (
    <div className="rounded-2xl bg-white px-5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className={`mb-3 flex size-12 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}>
        {icons[icon]}
      </div>
      <p className="text-[13px] font-medium text-[#8F95B2]">{label}</p>
      <p className="mt-0.5 text-2xl font-bold text-[#1A1F36]">{value}</p>
    </div>
  );
}

const yAxisLabels = [150, 100, 50, 20, 0];

function PatientsOverviewChart() {
  return (
    <div className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#1A1F36]">Patients Overview</h2>
        <select className="rounded-lg border border-[#E2E6EF] bg-white px-3 py-1.5 text-sm font-medium text-[#5A607F] outline-none">
          <option>This Month</option>
        </select>
      </div>

      <div className="flex flex-1 items-end gap-0">
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between pb-7 pr-3 text-right" style={{ height: 200 }}>
          {yAxisLabels.map((label) => (
            <span key={label} className="text-[11px] font-medium text-[#8F95B2] leading-none">
              {label}
            </span>
          ))}
        </div>

        {/* Bars */}
        <div className="flex flex-1 items-end justify-between gap-2" style={{ height: 220 }}>
          {patientAgeGroups.map((group) => {
            const heightPct = Math.max((group.value / 150) * 100, 3);
            return (
              <div key={group.label} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="rounded-full border border-[#D5DAE5] bg-white px-2 py-0.5 text-[11px] font-semibold text-[#4A5068]">
                  {String(group.value).padStart(2, "0")}
                </span>
                <div className="w-full max-w-[44px]" style={{ height: 170 }}>
                  <div className="flex h-full flex-col justify-end">
                    <div
                      className={`w-full rounded-t-lg transition-all ${
                        group.highlighted
                          ? "bg-gradient-to-t from-[#4C6FFF] to-[#7B9CFF]"
                          : "bg-[#EEF0F6]"
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                </div>
                <span className="text-[12px] font-medium text-[#8F95B2]">
                  {group.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
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
      {/* Top Section - 2 Columns: Stats + Chart */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1fr]">
        {/* Left: Stat Cards 2x2 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {metricCards.map((card) => (
            <MetricCard key={card.label} {...card} />
          ))}
        </div>

        {/* Right: Patients Overview Chart */}
        <PatientsOverviewChart />
      </div>

      {/* Bottom section - 2/3 left + 1/3 right */}
      <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        {/* Left: Today Appointments & Calendar (placeholder for upcoming appointments) */}
        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <h2 className="mb-4 font-semibold text-[#1A1F36]">Today Appointments</h2>
            <ul className="space-y-4">
              {todayAppointments.map((apt) => (
                <li key={apt.name} className="flex items-center gap-3">
                  <Avatar name={apt.name} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#1A1F36]">{apt.name}</p>
                    <p className="text-xs text-[#8F95B2]">{apt.type}</p>
                  </div>
                  {apt.status === "Ongoing" ? (
                    <span className="rounded-full bg-[#EEF2FF] px-2.5 py-0.5 text-xs font-medium text-[#4C6FFF]">
                      Ongoing
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-[#5A607F]">{apt.time}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-[#1A1F36]">03 - 09 May, 2021</span>
              <div className="flex gap-1">
                <button
                  type="button"
                  className="rounded p-1 hover:bg-[#F5F7FA]"
                  aria-label="Previous"
                >
                  <svg className="size-4 text-[#5A607F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="rounded p-1 hover:bg-[#F5F7FA]"
                  aria-label="Next"
                >
                  <svg className="size-4 text-[#5A607F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                <span key={d} className="font-medium text-[#8F95B2]">
                  {d}
                </span>
              ))}
              {[3, 4, 5, 6, 7, 8, 9].map((n) => (
                <span
                  key={n}
                  className={`rounded-full py-1 ${
                    n === 6 ? "bg-[#4C6FFF] font-medium text-white" : "text-[#5A607F] hover:bg-[#F5F7FA]"
                  }`}
                >
                  {n}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-[#1A1F36] p-5 text-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-[#8F95B2]">Next Week</p>
                <p className="mt-1 text-sm font-semibold">Upcoming Schedules-2</p>
              </div>
              <button
                type="button"
                className="rounded-lg bg-[#4C6FFF] px-4 py-2 text-sm font-medium hover:bg-[#3A5BE0]"
              >
                Open
              </button>
            </div>
          </div>
        </div>

        {/* Right: Appointment Request */}
        <div className="rounded-2xl bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-[#1A1F36]">Appoint Request</h2>
            <Link href="#" className="text-[13px] font-medium text-[#4C6FFF] hover:underline">
              See All
            </Link>
          </div>
          <div className="space-y-4">
            {appointmentRequests.map((req) => (
              <div
                key={req.name}
                className="rounded-xl border border-[#EEF0F6] p-4"
              >
                <div className="mb-3 flex items-start gap-3">
                  <Avatar name={req.name} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#1A1F36]">{req.name}</p>
                    <p className="mt-0.5 text-[12px] text-[#8F95B2]">{req.date}</p>
                    <p className="text-[12px] text-[#8F95B2]">{req.type}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="flex-1 rounded-lg border border-[#F5C6C0] bg-[#FFF8F6] py-1.5 text-[12px] font-semibold text-[#E2613B] transition-colors hover:bg-[#FFF0ED]"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    className="flex-1 rounded-lg border border-[#B8E4D3] bg-[#F4FBF8] py-1.5 text-[12px] font-semibold text-[#1DAB6B] transition-colors hover:bg-[#E9FAF3]"
                  >
                    Accept
                  </button>
                </div>
              </div>
            ))}
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
