import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ROLES } from "@/lib/roles";

export default async function LabOnboardingPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  if (session.user.role !== ROLES.LAB_ADMIN) {
    redirect("/dashboard");
  }

  const doctors = await prisma.user.findMany({
    where: { role: ROLES.DOCTOR, practiceId: { not: null } },
    orderBy: [{ practice: { name: "asc" } }, { name: "asc" }],
    select: { id: true, email: true, name: true, practice: { select: { name: true } } },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1F36]">Clinics & doctors</h1>
        <p className="mt-1 text-[14px] text-[#8F95B2]">
          Invite doctors and lab staff with <span className="font-medium text-[#5A607F]">Add user</span> in the header. They get an email to set their password. Use{" "}
          <span className="font-medium text-[#5A607F]">+ Add Practice</span> in that flow when the clinic isn&apos;t listed yet. This table is everyone with a doctor login tied to a practice.
        </p>
      </div>

      <div className="rounded-2xl border border-[#E2E6EF] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="border-b border-[#EEF0F6] px-6 py-4">
          <h2 className="text-[15px] font-semibold text-[#1A1F36]">Doctor accounts</h2>
          <p className="mt-0.5 text-[13px] text-[#8F95B2]">Portal logins scoped to a practice.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#EEF0F6] text-[#8F95B2]">
                <th className="px-6 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Practice</th>
              </tr>
            </thead>
            <tbody>
              {doctors.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-[#8F95B2]">
                    No doctor accounts yet.
                  </td>
                </tr>
              ) : (
                doctors.map((d) => (
                  <tr key={d.id} className="border-b border-[#F5F6FA] last:border-0">
                    <td className="px-6 py-3 font-medium text-[#1A1F36]">{d.name}</td>
                    <td className="px-4 py-3 text-[#5A607F]">{d.email}</td>
                    <td className="px-4 py-3 text-[#3D4354]">{d.practice?.name ?? "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
