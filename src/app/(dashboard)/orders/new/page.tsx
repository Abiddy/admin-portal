import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ROLES } from "@/lib/roles";
import { RequisitionForm } from "../_components/RequisitionForm";

export default async function NewRequisitionPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { practiceId: true, role: true },
  });

  if (user?.role !== ROLES.DOCTOR || !user.practiceId) {
    redirect("/orders");
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <Link href="/orders" className="text-[13px] font-medium text-[#4C6FFF] hover:underline">
          ← Back to orders
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-[#1A1F36]">New requisition</h1>
        <p className="mt-1 text-[14px] text-[#8F95B2]">Submit a test kit order for your practice. The lab will pick it up from the queue.</p>
      </div>

      <div className="rounded-2xl border border-[#E2E6EF] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <RequisitionForm />
      </div>
    </div>
  );
}
