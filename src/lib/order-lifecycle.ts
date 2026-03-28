import { notifyPracticeResultsReady } from "@/lib/email/results-ready";
import { formatOrderStatus } from "@/lib/order-format";
import { prisma } from "@/lib/prisma";
import { ORDER_STATUS } from "@/lib/roles";

export const STATUS_PIPELINE = [
  ORDER_STATUS.SUBMITTED,
  ORDER_STATUS.KIT_RECEIVED,
  ORDER_STATUS.PROCESSING,
  ORDER_STATUS.RESULTS_READY,
] as const;

export function isForwardTransition(from: string, to: string): boolean {
  const i = STATUS_PIPELINE.indexOf(from as (typeof STATUS_PIPELINE)[number]);
  const j = STATUS_PIPELINE.indexOf(to as (typeof STATUS_PIPELINE)[number]);
  if (i < 0 || j < 0) return false;
  return j > i;
}

export function forwardStatusOptions(current: string): string[] {
  const i = STATUS_PIPELINE.indexOf(current as (typeof STATUS_PIPELINE)[number]);
  if (i < 0) return [];
  return [...STATUS_PIPELINE.slice(i + 1)];
}

export function isBackwardTransition(from: string, to: string): boolean {
  const i = STATUS_PIPELINE.indexOf(from as (typeof STATUS_PIPELINE)[number]);
  const j = STATUS_PIPELINE.indexOf(to as (typeof STATUS_PIPELINE)[number]);
  if (i < 0 || j < 0) return false;
  return j < i;
}

/** Earlier pipeline steps, most recent first (e.g. Results ready → Processing, Kit received, Submitted). */
export function earlierStatusOptions(current: string): string[] {
  const i = STATUS_PIPELINE.indexOf(current as (typeof STATUS_PIPELINE)[number]);
  if (i <= 0) return [];
  return [...STATUS_PIPELINE.slice(0, i)].reverse() as string[];
}

export async function revertLabOrderStatus(params: {
  orderId: string;
  targetStatus: string;
  actorUserId: string;
  note?: string | null;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const { orderId, targetStatus, actorUserId, note } = params;
  try {
    return await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id: orderId } });
      if (!order) return { ok: false as const, error: "Order not found" };
      if (!isBackwardTransition(order.status, targetStatus)) {
        return { ok: false as const, error: "That is not a valid earlier step for this order." };
      }
      await tx.order.update({
        where: { id: orderId },
        data: { status: targetStatus },
      });
      const trimmed = note?.trim();
      await tx.orderStatusEvent.create({
        data: {
          orderId,
          status: targetStatus,
          actorUserId,
          note:
            trimmed ||
            `Reverted from ${formatOrderStatus(order.status)} to ${formatOrderStatus(targetStatus)}`,
        },
      });
      return { ok: true as const };
    });
  } catch {
    return { ok: false, error: "Could not revert status." };
  }
}

export async function transitionOrderStatus(params: {
  orderId: string;
  nextStatus: string;
  actorUserId: string;
  note?: string | null;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const { orderId, nextStatus, actorUserId, note } = params;
  try {
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id: orderId } });
      if (!order) return { ok: false as const, error: "Order not found" };
      if (!isForwardTransition(order.status, nextStatus)) {
        return { ok: false as const, error: "Invalid status change for the current step." };
      }
      await tx.order.update({
        where: { id: orderId },
        data: { status: nextStatus },
      });
      await tx.orderStatusEvent.create({
        data: {
          orderId,
          status: nextStatus,
          actorUserId,
          note: note?.trim() || null,
        },
      });
      return { ok: true as const };
    });

    if (result.ok && nextStatus === ORDER_STATUS.RESULTS_READY) {
      void notifyPracticeResultsReady(orderId).catch((err) => {
        console.error("[email] notifyPracticeResultsReady failed:", err);
      });
    }

    return result;
  } catch {
    return { ok: false, error: "Could not update status." };
  }
}
