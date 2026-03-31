"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ROLES } from "@/lib/roles";
import { revalidatePath } from "next/cache";

export type CreatePracticeQuickResult =
  | { ok: true; practice: { id: string; name: string } }
  | { ok: false; error: string };

export async function createPracticeQuickAction(rawName: string): Promise<CreatePracticeQuickResult> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "You must be signed in." };
  if (session.user.role !== ROLES.LAB_ADMIN) {
    return { ok: false, error: "Only lab staff can add practices." };
  }

  const name = rawName.trim();
  if (name.length < 2) {
    return { ok: false, error: "Practice name must be at least 2 characters." };
  }

  const practice = await prisma.practice.create({
    data: { name },
    select: { id: true, name: true },
  });

  revalidatePath("/lab/onboarding");
  return { ok: true, practice };
}
