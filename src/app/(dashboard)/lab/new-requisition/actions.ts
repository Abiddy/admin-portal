"use server";

import { auth } from "@/auth";
import { notifyDoctorLabRequisition } from "@/lib/email/lab-requisition-notify";
import { prisma } from "@/lib/prisma";
import { isLabAdminUser, loadAuthzUser } from "@/lib/server-authz";
import { ORDER_STATUS, ROLES } from "@/lib/roles";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { FormState } from "../../orders/actions";

export async function createLabRequisitionAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be signed in." };
  }
  const authUser = await loadAuthzUser(session.user.id);
  if (!isLabAdminUser(authUser)) {
    return { error: "Only lab staff can create requisitions on behalf of a practice." };
  }

  const practiceId = (formData.get("practiceId") as string | null)?.trim();
  const submittedById = (formData.get("submittedById") as string | null)?.trim();
  const patientName = (formData.get("patientName") as string | null)?.trim() || "";
  const patientEmail = (formData.get("patientEmail") as string | null)?.trim() || "";
  const patientPhone = (formData.get("patientPhone") as string | null)?.trim() || "";
  const notes = (formData.get("notes") as string | null)?.trim() || "";

  if (!practiceId) {
    return { error: "Choose a practice." };
  }
  if (!submittedById) {
    return { error: "Choose a doctor." };
  }
  if (!patientName && !patientEmail) {
    return { error: "Enter at least a patient name or email." };
  }

  const doctor = await prisma.user.findFirst({
    where: {
      id: submittedById,
      practiceId,
      role: ROLES.DOCTOR,
    },
    select: { id: true, email: true, name: true, practice: { select: { name: true } } },
  });

  if (!doctor?.practice) {
    return { error: "That doctor is not part of the selected practice." };
  }

  const order = await prisma.$transaction(async (tx) => {
    const o = await tx.order.create({
      data: {
        practiceId,
        submittedById: doctor.id,
        status: ORDER_STATUS.SUBMITTED,
        patientName: patientName || null,
        patientEmail: patientEmail || null,
        patientPhone: patientPhone || null,
        notes: notes || null,
      },
    });
    await tx.orderStatusEvent.create({
      data: {
        orderId: o.id,
        status: ORDER_STATUS.SUBMITTED,
        actorUserId: session.user.id,
        note: "Requisition created by BDL on behalf of the practice",
      },
    });
    return o;
  });

  const patientLabel = patientName || patientEmail || "Patient";
  void notifyDoctorLabRequisition({
    to: doctor.email,
    doctorName: doctor.name,
    practiceName: doctor.practice.name,
    patientLabel,
    orderId: order.id,
  }).catch((err) => {
    console.error("[email] notifyDoctorLabRequisition failed:", err);
  });

  revalidatePath("/dashboard");
  revalidatePath("/orders");
  revalidatePath("/lab");
  redirect(`/orders/${order.id}`);
}
