import { SITE_URL } from "@/lib/email/resend";

/**
 * Table-based, inline-styled HTML shell shared by every notification email.
 * Email clients (Outlook especially) don't support modern CSS — no flexbox,
 * no external stylesheets, gradients need a solid background-color fallback.
 */
export function renderEmailLayout({
  previewText,
  bodyHtml,
  unsubscribePath,
  footerNote,
}: {
  previewText: string;
  bodyHtml: string;
  /** Omit for transactional emails (contact form, etc.) that aren't a subscription. */
  unsubscribePath?: string;
  /** Overrides the default "you have an account" footer line. */
  footerNote?: string;
}) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>The Meal Prep Ideas</title>
  </head>
  <body style="margin:0;padding:0;background-color:#FBF6EE;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${previewText}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FBF6EE;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #ECE3D3;">
            <tr>
              <td style="background-color:#3fa34d;background-image:linear-gradient(135deg,#2f7d3b,#3fa34d 60%,#d97706);padding:26px 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-size:20px;font-weight:700;color:#ffffff;font-family:Georgia,'Times New Roman',serif;">
                      🍳 The Meal Prep Ideas
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 32px;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:22px 32px;background-color:#FBF6EE;border-top:1px solid #ECE3D3;">
                <p style="margin:0 0 ${unsubscribePath ? "8px" : "0"};font-size:12px;line-height:1.6;color:#8A8578;text-align:center;">
                  ${footerNote ?? `You're receiving this because you have an account at`}
                  ${footerNote ? "" : `<a href="${SITE_URL}" style="color:#2f7d3b;text-decoration:none;">themealprepideas.com</a>.`}
                </p>
                ${
                  unsubscribePath
                    ? `<p style="margin:0;font-size:12px;line-height:1.6;color:#8A8578;text-align:center;">
                  <a href="${SITE_URL}${unsubscribePath}" style="color:#2f7d3b;text-decoration:underline;">Manage email preferences</a>
                </p>`
                    : ""
                }
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function emailButton(label: string, href: string, color = "#3fa34d") {
  return `<table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="border-radius:12px;background-color:${color};">
    <a href="${href}" style="display:inline-block;padding:13px 26px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:12px;">${label}</a>
  </td></tr></table>`;
}
