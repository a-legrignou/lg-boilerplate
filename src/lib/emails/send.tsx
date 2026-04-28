import { render } from "@react-email/render";
import { sendEmail } from "../email";
import {
  VerificationEmail,
  ResetPasswordEmail,
  MagicLinkEmail,
} from "./Welcome";

const SITE_NAME = "Folio";

export async function sendVerificationEmail({
  to,
  name,
  url,
}: {
  to: string;
  name?: string;
  url: string;
}) {
  const html = await render(
    <VerificationEmail name={name} url={url} siteName={SITE_NAME} />,
  );
  const text = await render(
    <VerificationEmail name={name} url={url} siteName={SITE_NAME} />,
    { plainText: true },
  );
  await sendEmail({
    to,
    subject: `Confirme ton email — ${SITE_NAME}`,
    html,
    text,
  });
}

export async function sendResetPasswordEmail({
  to,
  name,
  url,
}: {
  to: string;
  name?: string;
  url: string;
}) {
  const html = await render(
    <ResetPasswordEmail name={name} url={url} siteName={SITE_NAME} />,
  );
  const text = await render(
    <ResetPasswordEmail name={name} url={url} siteName={SITE_NAME} />,
    { plainText: true },
  );
  await sendEmail({
    to,
    subject: `Réinitialiser ton mot de passe — ${SITE_NAME}`,
    html,
    text,
  });
}

export async function sendMagicLinkEmail({
  to,
  url,
}: {
  to: string;
  url: string;
}) {
  const html = await render(<MagicLinkEmail url={url} siteName={SITE_NAME} />);
  const text = await render(<MagicLinkEmail url={url} siteName={SITE_NAME} />, {
    plainText: true,
  });
  await sendEmail({
    to,
    subject: `Ton lien de connexion — ${SITE_NAME}`,
    html,
    text,
  });
}
