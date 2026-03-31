import { Resend } from "resend";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHtml(params: {
  doctorName: string;
  practiceName: string;
  patientLabel: string;
  orderUrl: string;
}): string {
  const dn = escapeHtml(params.doctorName);
  const pn = escapeHtml(params.practiceName);
  const pat = escapeHtml(params.patientLabel);
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body style="margin:0;padding:24px;background:#f5f7fa;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:15px;line-height:1.5;color:#1a1f36;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;">
    <tr>
      <td style="background:#ffffff;border-radius:12px;padding:28px 24px;border:1px solid #e2e6ef;">
        <p style="margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#8f95b2;">BDL+ Doctors Portal</p>
        <h1 style="margin:0 0 16px;font-size:20px;font-weight:700;">New requisition for you</h1>
        <p style="margin:0 0 12px;color:#3d4354;">Hi ${dn},</p>
        <p style="margin:0 0 12px;color:#3d4354;">BDL created a test order on behalf of <strong>${pn}</strong>.</p>
        <p style="margin:0 0 20px;color:#3d4354;"><strong>Patient:</strong> ${pat}</p>
        <p style="margin:0 0 24px;">
          <a href="${params.orderUrl}" style="display:inline-block;background:#4c6fff;color:#ffffff;text-decoration:none;padding:10px 18px;border-radius:8px;font-weight:600;font-size:14px;">View order</a>
        </p>
        <p style="margin:0;font-size:12px;color:#8f95b2;">If you have questions, reply in the order thread or contact your lab representative.</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function notifyDoctorLabRequisition(params: {
  to: string;
  doctorName: string;
  practiceName: string;
  patientLabel: string;
  orderId: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY is not set — skipping lab requisition notification.");
    return;
  }

  const baseUrl = (process.env.NEXTAUTH_URL || "http://localhost:3000").replace(/\/$/, "");
  const orderUrl = `${baseUrl}/orders/${params.orderId}`;
  const from =
    process.env.EMAIL_FROM?.trim() || "BDL+ Doctors Portal <onboarding@resend.dev>";

  const html = buildHtml({
    doctorName: params.doctorName,
    practiceName: params.practiceName,
    patientLabel: params.patientLabel,
    orderUrl,
  });

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: params.to,
    subject: `New requisition — ${params.patientLabel} (${params.practiceName})`,
    html,
  });

  if (error) {
    console.error("[email] Lab requisition notify:", error.message);
    throw new Error(error.message);
  }
}
