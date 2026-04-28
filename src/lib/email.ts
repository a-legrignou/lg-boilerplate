import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;
const from = process.env.EMAIL_FROM || "noreply@example.com";

type SendEmailArgs = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

/**
 * Sans RESEND_API_KEY → log au terminal (parfait pour dev local).
 * Avec → envoi réel via Resend.
 */
export async function sendEmail({ to, subject, html, text }: SendEmailArgs) {
  if (!resend) {
    console.log(`\n📧 [email-dev]`);
    console.log(`   to:      ${to}`);
    console.log(`   subject: ${subject}`);
    if (text) console.log(`   text:    ${text}`);
    else {
      const linkMatch = html.match(/href="([^"]+)"/);
      if (linkMatch) console.log(`   link:    ${linkMatch[1]}`);
    }
    console.log("");
    return { id: "dev-no-send" };
  }
  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
    text,
  });
  if (error) {
    console.error("[resend] send failed", error);
    throw new Error(error.message);
  }
  return data;
}
