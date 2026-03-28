import { auth } from "@/auth";
import { getOrderForViewer } from "@/lib/order-queries";
import { buildRequisitionPdf } from "@/lib/requisition-pdf";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await context.params;
  const order = await getOrderForViewer(id, session.user.id);
  if (!order) {
    return new Response("Not found", { status: 404 });
  }

  const bytes = await buildRequisitionPdf({
    id: order.id,
    status: order.status,
    patientName: order.patientName,
    patientEmail: order.patientEmail,
    patientPhone: order.patientPhone,
    notes: order.notes,
    practiceName: order.practice.name,
    submittedByName: order.submittedBy.name,
    createdAt: order.createdAt,
  });

  const safeName = (order.patientName?.trim() || order.patientEmail?.trim() || order.id.slice(0, 8))
    .replace(/[^\w\-]+/g, "-")
    .slice(0, 40);

  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="bdl-requisition-${safeName}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
