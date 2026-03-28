import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { formatOrderStatus } from "@/lib/order-format";

function wrapLines(text: string, maxLen: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (next.length <= maxLen) {
      line = next;
    } else {
      if (line) lines.push(line);
      line = w.length > maxLen ? `${w.slice(0, maxLen - 1)}…` : w;
    }
  }
  if (line) lines.push(line);
  return lines;
}

type OrderPdfInput = {
  id: string;
  status: string;
  patientName: string | null;
  patientEmail: string | null;
  patientPhone: string | null;
  notes: string | null;
  practiceName: string;
  submittedByName: string;
  createdAt: Date;
};

export async function buildRequisitionPdf(order: OrderPdfInput): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([612, 792]);
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  let y = 750;
  const x = 50;
  const gap = (n: number) => {
    y -= n;
  };

  const write = (text: string, size: number, font = regular, color = rgb(0.15, 0.18, 0.26)) => {
    page.drawText(text, { x, y, size, font, color, maxWidth: 512 });
    y -= size + 8;
  };

  write("BDL+ — Requisition summary", 16, bold);
  gap(6);
  write(`Order ID: ${order.id}`, 10, regular, rgb(0.45, 0.48, 0.58));
  gap(4);
  write(`Generated ${new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeStyle: "short" }).format(new Date())}`, 9, regular, rgb(0.45, 0.48, 0.58));
  gap(16);

  write("Practice", 11, bold);
  write(order.practiceName, 11);
  gap(12);

  write("Patient", 11, bold);
  write(order.patientName?.trim() || "—", 11);
  if (order.patientEmail?.trim()) write(`Email: ${order.patientEmail.trim()}`, 10);
  if (order.patientPhone?.trim()) write(`Phone: ${order.patientPhone.trim()}`, 10);
  gap(12);

  write("Clinical / admin notes", 11, bold);
  const notes = order.notes?.trim();
  if (notes) {
    for (const line of wrapLines(notes, 92)) {
      write(line, 10);
    }
  } else {
    write("—", 10);
  }
  gap(12);

  write("Workflow", 11, bold);
  write(`Current status: ${formatOrderStatus(order.status)}`, 10);
  write(`Submitted by: ${order.submittedByName}`, 10);
  write(
    `Created: ${new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(order.createdAt)}`,
    10,
  );
  gap(24);
  write("This document is a system-generated summary for your records.", 9, regular, rgb(0.45, 0.48, 0.58));

  return doc.save();
}
