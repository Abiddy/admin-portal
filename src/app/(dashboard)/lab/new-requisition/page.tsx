import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ROLES } from "@/lib/roles";
import { LabRequisitionForm } from "./LabRequisitionForm";

export default async function LabNewRequisitionPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  if (session.user.role !== ROLES.LAB_ADMIN) {
    redirect("/dashboard");
  }

  const practices = await prisma.practice.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <Link href="/orders" className="text-[13px] font-medium text-[#4C6FFF] hover:underline">
          ← Orders
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-[#1A1F36]">New requisition (lab)</h1>
        <p className="mt-1 text-[14px] text-[#8F95B2]">
          Create an order on behalf of a practice and assign it to a doctor. They&apos;ll get an email with a link to the order.
        </p>
      </div>

      <div className="rounded-2xl border border-[#E2E6EF] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <LabRequisitionForm practices={practices} />
      </div>
    </div>
  );
}
