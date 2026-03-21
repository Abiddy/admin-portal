import Link from "next/link";

const metricCards = [
  {
    label: "Total Patients",
    value: "41",
    subtitle: "Current Patients",
    icon: "patient",
    iconBg: "bg-[#EFF2F7]",
    iconColor: "text-[#6B7A99]",
    buttonLabel: "View All",
  },
  {
    label: "Consultation Requests",
    value: "2",
    subtitle: "New Requests",
    icon: "calendar",
    iconBg: "bg-[#FFF0ED]",
    iconColor: "text-[#E2613B]",
    buttonLabel: "View All",
  },
  {
    label: "Test Kit Orders",
    value: "4",
    subtitle: "Pending Orders",
    icon: "clinic",
    iconBg: "bg-[#FFF8ED]",
    iconColor: "text-[#E2963B]",
    buttonLabel: "Track Orders",
  },
  {
    label: "Test Results",
    value: "3",
    subtitle: "New Results",
    icon: "video",
    iconBg: "bg-[#EDFAF7]",
    iconColor: "text-[#2BBBA0]",
    buttonLabel: "View Results",
  },
];

const activities = [
  { description: "Sarah G.'s results are ready", time: "10/10/25 at 6:30 AM" },
  { description: "Sarah G.'s test kit processing", time: "10/10/25 at 6:30 AM" },
  { description: "Sarah G. test kit received", time: "10/10/25 at 6:30 AM" },
  { description: "Sarah G. mailed in her test kit", time: "10/10/25 at 6:30 AM" },
  { description: "Sarah G. ordered a test kit.", time: "10/10/25 at 6:30 AM" },
  { description: "Sarah G. requested a consult", time: "10/10/25 at 6:30 AM" },
];

const appointmentRequests = [
  { name: "Savannah Nguyen", date: "06 Feb, 11:00 am - 11:45 am", type: "Individual Counselling" },
  { name: "Jacob Jones", date: "08 Feb, 4:00 am - 5:00 pm", type: "Couple Counselling" },
  { name: "Marvin McKinney", date: "08 Feb, 8:00 pm - 9:00 pm", type: "Family Counselling" },
  { name: "Khalil Ahmed", date: "10 Feb, 11:00 am - 12:00 am", type: "Family Counselling" },
];

const datePicker = [
  { day: 13, dots: ["#4C6FFF", "#E2613B"], active: true },
  { day: 14, dots: ["#4C6FFF"] },
  { day: 15, dots: ["#E2963B"] },
  { day: 16, dots: [] },
  { day: 17, dots: ["#4C6FFF", "#E2613B"] },
  { day: 18, dots: ["#1DAB6B", "#4C6FFF"] },
  { day: 19, dots: ["#E2613B"] },
  { day: 20, dots: [] },
  { day: 21, dots: ["#1DAB6B"] },
  { day: 22, dots: [] },
  { day: 23, dots: ["#4C6FFF"] },
  { day: 24, dots: [] },
  { day: 25, dots: ["#E2963B"] },
];

const scheduleList = [
  { type: "Individual Counselling", color: "#4C6FFF", name: "Ibrahim Kadri", dateTime: "13 Feb, 11:00 am - 11:45 am", mode: "video" },
  { type: "Couple Counselling", color: "#E2613B", name: "Miqdad ibn Aswad", dateTime: "13 Feb, 12:00 pm - 12:45 pm", mode: "phone" },
  { type: "Teen Counselling", color: "#E2963B", name: "Sa'd ibn Abi Waqqas", dateTime: "13 Feb, 1:00 pm - 1:45 pm", mode: "video" },
  { type: "Individual Counselling", color: "#4C6FFF", name: "Abu Talha al-Ansari", dateTime: "13 Feb, 3:00 pm - 3:45 pm", mode: "phone" },
  { type: "Couple Counselling", color: "#E2613B", name: "Abdullah ibn Masud", dateTime: "13 Feb, 4:00 pm - 4:45 pm", mode: "phone" },
  { type: "Family Counselling", color: "#1DAB6B", name: "Zayd ibn Harithah", dateTime: "7 Feb, 7:00 pm - 7:45 pm", mode: "video" },
];

function MetricCard({
  label,
  value,
  subtitle,
  icon,
  iconBg,
  iconColor,
  buttonLabel,
}: {
  label: string;
  value: string;
  subtitle: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  buttonLabel: string;
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
      <div className="mb-3 flex items-start justify-between">
        <div className={`flex size-11 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}>
          {icons[icon]}
        </div>
        <Link href="#" className="text-[12px] font-medium text-[#4C6FFF] underline underline-offset-2 hover:text-[#3A5BE0]">
          {buttonLabel}
        </Link>
      </div>
      <p className="text-[13px] font-medium text-[#8F95B2]">{label}</p>
      <p className="mt-0.5 text-2xl font-bold leading-tight text-[#1A1F36]">{value}</p>
      <p className="mt-0.5 text-[11px] text-[#8F95B2]">{subtitle}</p>
    </div>
  );
}

function ActivityTable() {
  return (
    <div className="flex h-full flex-col rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="px-6 pt-5 pb-4">
        <h2 className="text-[15px] font-bold text-[#1A1F36]">Recent Activity</h2>
      </div>
      <div className="flex-1 px-6 pb-4">
        <table className="w-full">
          <thead>
            <tr>
              <th className="pb-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#1A1F36]">Activity</th>
              <th className="pb-3 text-right text-[11px] font-bold uppercase tracking-wider text-[#1A1F36]">Time</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity, i) => (
              <tr key={i} className="border-b border-[#F0F1F5] last:border-0">
                <td className="py-3 text-[13px] text-[#3D4354]">{activity.description}</td>
                <td className="py-3 text-right text-[13px] text-[#8F95B2]">{activity.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
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

        {/* Right: Activity Table */}
        <ActivityTable />
      </div>

      {/* Bottom section - 2/3 left + 1/3 right */}
      <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        {/* Left: Upcoming Appointments */}
        <div className="rounded-2xl bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          {/* Header */}
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#1A1F36]">Upcoming Appointments</h2>
            <select className="rounded-lg border border-[#E2E6EF] bg-white px-3 py-1.5 text-sm font-medium text-[#5A607F] outline-none">
              <option>February 2024</option>
            </select>
          </div>

          {/* Date Picker Carousel */}
          <div className="mb-6 flex items-center gap-1">
            <div className="flex flex-1 gap-1 overflow-hidden">
              {datePicker.map((d) => (
                <button
                  key={d.day}
                  type="button"
                  className={`flex flex-1 flex-col items-center gap-1.5 rounded-xl py-2 transition-colors ${
                    d.active
                      ? "border-2 border-[#4C6FFF] bg-white"
                      : "border border-[#EEF0F6] bg-white hover:border-[#D5DAE5]"
                  }`}
                >
                  <span className={`text-sm font-semibold ${d.active ? "text-[#4C6FFF]" : "text-[#1A1F36]"}`}>
                    {d.day}
                  </span>
                  <div className="flex gap-0.5">
                    {d.dots.map((color, i) => (
                      <span key={i} className="size-1.5 rounded-full" style={{ backgroundColor: color }} />
                    ))}
                    {d.dots.length === 0 && <span className="size-1.5" />}
                  </div>
                </button>
              ))}
            </div>
            <button type="button" className="ml-1 shrink-0 rounded-lg p-1 text-[#8F95B2] hover:bg-[#F5F7FA]" aria-label="Next">
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Schedule List Header */}
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-[#1A1F36]">Schedule List</h3>
            <div className="flex gap-2">
              <button type="button" className="flex items-center gap-1.5 rounded-lg border border-[#E2E6EF] px-3 py-1.5 text-[12px] font-medium text-[#5A607F] hover:bg-[#F5F7FA]">
                <svg className="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filter
              </button>
              <button type="button" className="flex items-center gap-1.5 rounded-lg bg-[#1A1F36] px-3 py-1.5 text-[12px] font-medium text-white hover:bg-[#2A2F46]">
                <svg className="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New
              </button>
            </div>
          </div>

          {/* Schedule Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#EEF0F6]">
                  <th className="pb-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#8F95B2]">Appoint for</th>
                  <th className="pb-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#8F95B2]">Name</th>
                  <th className="pb-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#8F95B2]">Date & Time</th>
                  <th className="pb-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#8F95B2]">Type</th>
                </tr>
              </thead>
              <tbody>
                {scheduleList.map((item, i) => (
                  <tr key={i} className="border-b border-[#F0F1F5] last:border-0">
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-[13px] font-medium text-[#1A1F36]">{item.type}</span>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={item.name} />
                        <span className="text-[13px] text-[#3D4354]">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-[13px] text-[#5A607F]">{item.dateTime}</td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        {item.mode === "video" ? (
                          <svg className="size-5 text-[#2BBBA0]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                          </svg>
                        ) : (
                          <svg className="size-5 text-[#E2963B]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
                          </svg>
                        )}
                        <button type="button" className="rounded p-0.5 text-[#8F95B2] hover:bg-[#F5F7FA]" aria-label="More">
                          <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="5" r="1.5" />
                            <circle cx="12" cy="12" r="1.5" />
                            <circle cx="12" cy="19" r="1.5" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

    </div>
  );
}
