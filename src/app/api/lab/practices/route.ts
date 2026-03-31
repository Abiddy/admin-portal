import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isLabAdminUser, loadAuthzUser } from "@/lib/server-authz";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const authUser = await loadAuthzUser(session.user.id);
  if (!isLabAdminUser(authUser)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const practices = await prisma.practice.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return NextResponse.json({ practices });
}
