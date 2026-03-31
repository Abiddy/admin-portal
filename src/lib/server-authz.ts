import { prisma } from "@/lib/prisma";
import { ROLES } from "@/lib/roles";

export type AuthzUser = { id: string; role: string; practiceId: string | null };

export async function loadAuthzUser(userId: string): Promise<AuthzUser | null> {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, practiceId: true },
  });
}

export function isLabAdminUser(u: AuthzUser | null): u is AuthzUser {
  return u !== null && u.role === ROLES.LAB_ADMIN;
}

export function isDoctorWithPractice(
  u: AuthzUser | null,
): u is AuthzUser & { practiceId: string } {
  return u !== null && u.role === ROLES.DOCTOR && u.practiceId !== null;
}
