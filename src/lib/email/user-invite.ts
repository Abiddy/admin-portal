import { Resend } from "resend";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildInviteHtml(params: { name: string; acceptUrl: string }): string {
  const n = escapeHtml(params.name);
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body style="margin:0;padding:24px;background:#f5f7fa;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:15px;line-height:1.5;color:#1a1f36;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;">
    <tr>
      <td style="background:#ffffff;border-radius:12px;padding:28px 24px;border:1px solid #e2e6ef;">
        <p style="margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#8f95b2;">BDL+ Doctors Portal</p>
        <h1 style="margin:0 0 16px;font-size:20px;font-weight:700;">You&apos;re invited</h1>
        <p style="margin:0 0 16px;color:#3d4354;">Hi ${n},</p>
        <p style="margin:0 0 20px;color:#3d4354;">BDL set up access for you. Use the button below to choose your password and activate your account. This link expires in 72 hours.</p>
        <p style="margin:0 0 24px;">
          <a href="${params.acceptUrl}" style="display:inline-block;background:#4c6fff;color:#ffffff;text-decoration:none;padding:10px 18px;border-radius:8px;font-weight:600;font-size:14px;">Activate account</a>
        </p>
        <p style="margin:0;font-size:12px;color:#8f95b2;">If you didn&apos;t expect this, you can ignore this email.</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendUserInviteEmail(params: {
  to: string;
  inviteeName: string;
  rawToken: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const baseUrl = (process.env.NEXTAUTH_URL || "http://localhost:3000").replace(/\/$/, "");
  const acceptUrl = `${baseUrl}/invite/accept?token=${encodeURIComponent(params.rawToken)}`;

  const from =
    process.env.EMAIL_FROM?.trim() || "BDL+ Doctors Portal <onboarding@resend.dev>";

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: params.to,
    subject: "Activate your BDL+ Doctors Portal account",
    html: buildInviteHtml({ name: params.inviteeName, acceptUrl }),
  });

  if (error) {
    throw new Error(error.message);
  }
}
