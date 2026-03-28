"use server";

import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { auth } from "@/auth";
import { transitionOrderStatus } from "@/lib/order-lifecycle";
import { prisma } from "@/lib/prisma";
import { isLabRole, ORDER_STATUS } from "@/lib/roles";
import { UPLOAD_ROOT } from "@/lib/uploads";
import { revalidatePath } from "next/cache";
import type { FormState } from "../orders/actions";

const MAX_BYTES = 16 * 1024 * 1024;

function sanitizeFileName(name: string): string {
  const base = name.replace(/[^\w.\-()\s[\]]/g, "_").trim() || "report.pdf";
  return base.slice(0, 180);
}

export async function uploadLabResultAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be signed in." };
  }
  if (!isLabRole(session.user.role)) {
    return { error: "Only lab staff can upload results." };
  }

  const orderId = (formData.get("orderId") as string | null)?.trim();
  const file = formData.get("file");
  if (!orderId) {
    return { error: "Missing order." };
  }
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a PDF file." };
  }
  if (file.type !== "application/pdf") {
    return { error: "Only PDF uploads are allowed." };
  }
  if (file.size > MAX_BYTES) {
    return { error: "File is too large (max 16 MB)." };
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true, status: true },
  });
  if (!order) {
    return { error: "Order not found." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const clientName = sanitizeFileName(file.name);

  let createdId: string | null = null;
  let absPath: string | null = null;

  try {
    const created = await prisma.result.create({
      data: {
        orderId,
        fileName: clientName,
        fileKey: "__pending__",
        uploadedById: session.user.id,
      },
    });
    createdId = created.id;

    const relKey = `results/${created.id}.pdf`;
    const targetPath = path.join(UPLOAD_ROOT, relKey);
    await mkdir(path.dirname(targetPath), { recursive: true });
    await writeFile(targetPath, buffer);
    absPath = targetPath;

    await prisma.result.update({
      where: { id: created.id },
      data: { fileKey: relKey },
    });
  } catch {
    if (createdId) {
      await prisma.result.delete({ where: { id: createdId } }).catch(() => {});
    }
    if (absPath) {
      await unlink(absPath).catch(() => {});
    }
    return { error: "Could not save the file. Try again." };
  }

  const markReady = formData.get("markReady") === "1";
  if (markReady && order.status !== ORDER_STATUS.RESULTS_READY) {
    await transitionOrderStatus({
      orderId,
      nextStatus: ORDER_STATUS.RESULTS_READY,
      actorUserId: session.user.id,
      note: "Results PDF uploaded",
    });
  }

  revalidatePath("/lab");
  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/orders");
  revalidatePath("/dashboard");
  revalidatePath("/results");
  return null;
}
