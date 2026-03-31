"use server";

import { auth } from "@/auth";
import { revertLabOrderStatus, transitionOrderStatus } from "@/lib/order-lifecycle";
import { getOrderForViewer } from "@/lib/order-queries";
import { prisma } from "@/lib/prisma";
import { isDoctorWithPractice, isLabAdminUser, loadAuthzUser } from "@/lib/server-authz";
import { ORDER_STATUS } from "@/lib/roles";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type FormState = { error?: string } | null;

export async function createRequisitionAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be signed in." };
  }

  const authUser = await loadAuthzUser(session.user.id);
  if (!isDoctorWithPractice(authUser)) {
    return { error: "Only practice users linked to a clinic can submit requisitions." };
  }

  const patientName = (formData.get("patientName") as string | null)?.trim() || "";
  const patientEmail = (formData.get("patientEmail") as string | null)?.trim() || "";
  const patientPhone = (formData.get("patientPhone") as string | null)?.trim() || "";
  const notes = (formData.get("notes") as string | null)?.trim() || "";

  if (!patientName && !patientEmail) {
    return { error: "Enter at least a patient name or email." };
  }

  const practiceId = authUser.practiceId;

  const order = await prisma.$transaction(async (tx) => {
    const o = await tx.order.create({
      data: {
        practiceId,
        submittedById: session.user.id,
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
        note: "Requisition submitted",
      },
    });
    return o;
  });

  revalidatePath("/dashboard");
  revalidatePath("/orders");
  revalidatePath("/lab");
  redirect(`/orders/${order.id}`);
}

export async function postOrderMessageAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be signed in." };
  }

  const orderId = (formData.get("orderId") as string | null)?.trim();
  const body = (formData.get("body") as string | null)?.trim() || "";
  if (!orderId) {
    return { error: "Missing order." };
  }
  if (!body) {
    return { error: "Write a message before posting." };
  }

  const order = await getOrderForViewer(orderId, session.user.id);
  if (!order) {
    return { error: "You cannot comment on this order." };
  }

  await prisma.orderMessage.create({
    data: {
      orderId,
      userId: session.user.id,
      body,
    },
  });

  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/dashboard");
  revalidatePath("/lab");
  return null;
}

export async function updateLabOrderStatusAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be signed in." };
  }
  const authUser = await loadAuthzUser(session.user.id);
  if (!isLabAdminUser(authUser)) {
    return { error: "Only lab staff can update pipeline status." };
  }

  const orderId = (formData.get("orderId") as string | null)?.trim();
  const nextStatus = (formData.get("nextStatus") as string | null)?.trim() || "";
  const note = (formData.get("note") as string | null)?.trim() || "";

  if (!orderId || !nextStatus) {
    return { error: "Choose a status to move to." };
  }

  const order = await getOrderForViewer(orderId, session.user.id);
  if (!order) {
    return { error: "Order not found." };
  }

  const result = await transitionOrderStatus({
    orderId,
    nextStatus,
    actorUserId: session.user.id,
    note: note || null,
  });

  if (!result.ok) {
    return { error: result.error };
  }

  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/orders");
  revalidatePath("/dashboard");
  revalidatePath("/lab");
  revalidatePath("/results");
  return null;
}

export async function revertLabOrderStatusAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be signed in." };
  }
  const authUser = await loadAuthzUser(session.user.id);
  if (!isLabAdminUser(authUser)) {
    return { error: "Only lab staff can revert pipeline status." };
  }

  const orderId = (formData.get("orderId") as string | null)?.trim();
  const targetStatus = (formData.get("revertToStatus") as string | null)?.trim() || "";
  const note = (formData.get("note") as string | null)?.trim() || "";

  if (!orderId || !targetStatus) {
    return { error: "Choose an earlier step to revert to." };
  }

  const order = await getOrderForViewer(orderId, session.user.id);
  if (!order) {
    return { error: "Order not found." };
  }

  const result = await revertLabOrderStatus({
    orderId,
    targetStatus,
    actorUserId: session.user.id,
    note: note || null,
  });

  if (!result.ok) {
    return { error: result.error };
  }

  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/orders");
  revalidatePath("/dashboard");
  revalidatePath("/lab");
  revalidatePath("/results");
  return null;
}
