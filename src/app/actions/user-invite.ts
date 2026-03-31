"use server";

import { hash } from "bcryptjs";
import { auth } from "@/auth";
import { sendUserInviteEmail } from "@/lib/email/user-invite";
import { generateInviteRawToken, hashInviteToken } from "@/lib/invite-token";
import { prisma } from "@/lib/prisma";
import { ROLES } from "@/lib/roles";
import type { FormState } from "../(dashboard)/orders/actions";

const INVITE_TTL_MS = 72 * 60 * 60 * 1000;

export type InviteFormState = FormState | { success: true };

export async function createUserInviteAction(
  _prev: InviteFormState | null,
  formData: FormData,
): Promise<InviteFormState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "You must be signed in." };
  if (session.user.role !== ROLES.LAB_ADMIN) {
    return { error: "Only lab staff can invite users." };
  }

  const name = (formData.get("name") as string | null)?.trim();
  const email = (formData.get("email") as string | null)?.trim().toLowerCase();
  const role = (formData.get("role") as string | null)?.trim();
  const practiceIdRaw = (formData.get("practiceId") as string | null)?.trim();

  if (!name || name.length < 2) return { error: "Name is required." };
  if (!email || !email.includes("@")) return { error: "Valid email is required." };
  if (role !== ROLES.DOCTOR && role !== ROLES.LAB_ADMIN) {
    return { error: "Invalid role." };
  }

  let practiceId: string | null = null;
  if (role === ROLES.DOCTOR) {
    if (!practiceIdRaw) return { error: "Practice is required for doctor accounts." };
    const p = await prisma.practice.findUnique({ where: { id: practiceIdRaw }, select: { id: true } });
    if (!p) return { error: "Practice not found." };
    practiceId = p.id;
  }

  const existingUser = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (existingUser) {
    return { error: "An account with that email already exists." };
  }

  const actor = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true },
  });
  if (!actor) {
    return {
      error:
        "Your login session does not match this database (stale or migrated data). Sign out, then sign in again, and retry the invite.",
    };
  }

  await prisma.userInvite.deleteMany({
    where: { email, usedAt: null },
  });

  const rawToken = generateInviteRawToken();
  const tokenHash = hashInviteToken(rawToken);
  const expiresAt = new Date(Date.now() + INVITE_TTL_MS);

  const inviteId = await prisma.userInvite
    .create({
      data: {
        email,
        name,
        role,
        practiceId,
        tokenHash,
        expiresAt,
        createdById: actor.id,
      },
      select: { id: true },
    })
    .then((r) => r.id);

  try {
    await sendUserInviteEmail({ to: email, inviteeName: name, rawToken });
  } catch (e) {
    await prisma.userInvite.delete({ where: { id: inviteId } }).catch(() => {});
    const msg = e instanceof Error ? e.message : "Failed to send email.";
    return { error: msg };
  }

  return { success: true };
}

export type AcceptInviteState = FormState | { success: true };

export async function acceptUserInviteAction(
  _prev: AcceptInviteState | null,
  formData: FormData,
): Promise<AcceptInviteState> {
  const rawToken = (formData.get("token") as string | null)?.trim();
  const password = (formData.get("password") as string | null) ?? "";
  const passwordConfirm = (formData.get("passwordConfirm") as string | null) ?? "";

  if (!rawToken) return { error: "Invalid or expired invitation link." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  if (password !== passwordConfirm) return { error: "Passwords do not match." };

  const tokenHash = hashInviteToken(rawToken);

  const invite = await prisma.userInvite.findFirst({
    where: {
      tokenHash,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
  });

  if (!invite) {
    return { error: "This invitation is invalid or has expired. Ask your lab administrator for a new link." };
  }

  const emailTaken = await prisma.user.findUnique({ where: { email: invite.email }, select: { id: true } });
  if (emailTaken) {
    return { error: "An account with this email already exists. Sign in instead." };
  }

  const passwordHash = await hash(password, 10);

  try {
    await prisma.$transaction([
      prisma.user.create({
        data: {
          email: invite.email,
          name: invite.name,
          role: invite.role,
          practiceId: invite.practiceId,
          passwordHash,
        },
      }),
      prisma.userInvite.update({
        where: { id: invite.id },
        data: { usedAt: new Date() },
      }),
    ]);
  } catch {
    return { error: "Could not complete signup. Try again or request a new invite." };
  }

  return { success: true };
}
