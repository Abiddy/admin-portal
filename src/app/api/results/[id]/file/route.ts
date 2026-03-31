import { readFile } from "fs/promises";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getResultForViewer } from "@/lib/order-queries";
import { createSignedResultDownloadUrl, isSupabaseResultStorageEnabled } from "@/lib/result-storage";
import { resolveSafeUploadPath } from "@/lib/uploads";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await context.params;
  const result = await getResultForViewer(id, session.user.id);
  if (!result || result.fileKey === "__pending__") {
    return new Response("Not found", { status: 404 });
  }

  if (isSupabaseResultStorageEnabled()) {
    const signed = await createSignedResultDownloadUrl(result.fileKey, 180);
    if (!signed) {
      return new Response("Not found", { status: 404 });
    }
    return NextResponse.redirect(signed, 302);
  }

  const absPath = resolveSafeUploadPath(result.fileKey);
  if (!absPath) {
    return new Response("Not found", { status: 404 });
  }

  let body: Buffer;
  try {
    body = await readFile(absPath);
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const safeName = result.fileName.replace(/[^\w.\-()\s]/g, "_").slice(0, 120) || "result.pdf";

  return new Response(new Uint8Array(body), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${safeName}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
