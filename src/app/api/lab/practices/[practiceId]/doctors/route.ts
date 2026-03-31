import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ROLES } from "@/lib/roles";

type Params = { params: Promise<{ practiceId: string }> };

export async function GET(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== ROLES.LAB_ADMIN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { practiceId } = await params;
  if (!practiceId?.trim()) {
    return NextResponse.json({ error: "Missing practice" }, { status: 400 });
  }

  const practice = await prisma.practice.findUnique({
    where: { id: practiceId },
    select: { id: true },
  });
  if (!practice) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const doctors = await prisma.user.findMany({
    where: { practiceId, role: ROLES.DOCTOR },
    orderBy: { name: "asc" },
    select: { id: true, name: true, email: true },
  });

  return NextResponse.json({ doctors });
}
