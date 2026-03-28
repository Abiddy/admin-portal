import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { ROLES } from "@/lib/roles";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildResultsReadyHtml(params: {
  practiceName: string;
  patientLabel: string;
  orderUrl: string;
  resultsUrl: string;
}): string {
  const { practiceName, patientLabel, orderUrl, resultsUrl } = params;
  const p = escapeHtml(practiceName);
  const pat = escapeHtml(patientLabel);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Results ready</title>
</head>
<body style="margin:0;padding:24px;background:#f5f7fa;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:15px;line-height:1.5;color:#1a1f36;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;">
    <tr>
      <td style="background:#ffffff;border-radius:12px;padding:28px 24px;border:1px solid #e2e6ef;box-shadow:0 1px 3px rgba(0,0,0,0.04);">
        <p style="margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#8f95b2;">BDL+ Doctors Portal</p>
        <h1 style="margin:0 0 16px;font-size:20px;font-weight:700;color:#1a1f36;">Results are ready</h1>
        <p style="margin:0 0 12px;color:#3d4354;">The lab has released results for an order at <strong>${p}</strong>.</p>
        <p style="margin:0 0 20px;"><strong>Patient:</strong> ${pat}</p>
        <p style="margin:0 0 24px;">
          <a href="${orderUrl}" style="display:inline-block;background:#4c6fff;color:#ffffff;text-decoration:none;padding:10px 18px;border-radius:8px;font-weight:600;font-size:14px;">View order</a>
          <span style="display:inline-block;width:12px;"></span>
          <a href="${resultsUrl}" style="color:#4c6fff;font-weight:600;font-size:14px;">Open results library</a>
        </p>
        <p style="margin:0;font-size:12px;color:#8f95b2;">If you did not expect this message, you can ignore it or contact your lab administrator.</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Sends one notification when an order reaches RESULTS_READY (Phase 6).
 * Requires RESEND_API_KEY. Without it, logs and returns (dev-safe).
 */
export async function notifyPracticeResultsReady(orderId: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY is not set — skipping results-ready notification.");
    return;
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      patientName: true,
      patientEmail: true,
      practiceId: true,
      practice: { select: { name: true } },
    },
  });
  if (!order) {
    console.warn("[email] Order not found for notification:", orderId);
    return;
  }

  const patientLabel = order.patientName?.trim() || order.patientEmail?.trim() || "Patient";

  const override = process.env.RESULTS_NOTIFICATION_EMAIL?.trim();
  let to: string[];
  if (override) {
    to = override.split(/[,;]/).map((s) => s.trim()).filter(Boolean);
  } else {
    const users = await prisma.user.findMany({
      where: {
        practiceId: order.practiceId,
        role: { in: [ROLES.DOCTOR, ROLES.PRACTICE_ADMIN] },
      },
      select: { email: true },
    });
    to = [...new Set(users.map((u) => u.email))];
  }

  if (to.length === 0) {
    console.warn("[email] No recipients for results-ready (set RESULTS_NOTIFICATION_EMAIL or add practice users).");
    return;
  }

  const from =
    process.env.EMAIL_FROM?.trim() || "BDL+ Doctors Portal <onboarding@resend.dev>";
  const baseUrl = (process.env.NEXTAUTH_URL || "http://localhost:3000").replace(/\/$/, "");
  const orderUrl = `${baseUrl}/orders/${order.id}`;
  const resultsUrl = `${baseUrl}/results`;

  const html = buildResultsReadyHtml({
    practiceName: order.practice.name,
    patientLabel,
    orderUrl,
    resultsUrl,
  });

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    subject: `Results ready — ${patientLabel} (${order.practice.name})`,
    html,
  });

  if (error) {
    console.error("[email] Resend error:", error.message);
    throw new Error(error.message);
  }
}
