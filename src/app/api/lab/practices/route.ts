import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ROLES } from "@/lib/roles";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== ROLES.LAB_ADMIN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const practices = await prisma.practice.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return NextResponse.json({ practices });
}
