import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type Props = {
  name?: string;
  url: string;
  siteName?: string;
};

const main = {
  backgroundColor: "#0a0a0a",
  color: "#fafafa",
  fontFamily: "system-ui, -apple-system, sans-serif",
};
const container = { padding: "40px 24px", maxWidth: 560, margin: "0 auto" };
const heading = {
  fontSize: 28,
  fontWeight: 600,
  lineHeight: 1.2,
  margin: "0 0 16px",
  letterSpacing: -0.5,
};
const text = {
  fontSize: 15,
  lineHeight: 1.55,
  color: "#a3a3a3",
  margin: "0 0 16px",
};
const button = {
  backgroundColor: "#6366f1",
  borderRadius: 8,
  color: "#fff",
  display: "inline-block",
  fontSize: 14,
  fontWeight: 500,
  padding: "12px 22px",
  textDecoration: "none",
};
const hr = { borderColor: "#262626", margin: "32px 0" };
const small = {
  fontSize: 12,
  color: "#525252",
  wordBreak: "break-all" as const,
};

export function VerificationEmail({ name, url, siteName = "Folio" }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Confirme ton email pour activer ton compte {siteName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Bienvenue{name ? ` ${name}` : ""} !</Heading>
          <Text style={text}>
            Pour activer ton compte sur {siteName}, confirme ton adresse email :
          </Text>
          <Section style={{ margin: "24px 0" }}>
            <Button href={url} style={button}>
              Confirmer mon email
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={small}>
            Ou copie-colle ce lien dans ton navigateur :
          </Text>
          <Text style={small}>{url}</Text>
        </Container>
      </Body>
    </Html>
  );
}

export function ResetPasswordEmail({ name, url, siteName = "Folio" }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Réinitialise ton mot de passe {siteName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Réinitialiser ton mot de passe</Heading>
          <Text style={text}>
            {name ? `Salut ${name}, ` : ""}clique sur le bouton ci-dessous pour
            choisir un nouveau mot de passe. Ce lien expire dans 1 heure.
          </Text>
          <Section style={{ margin: "24px 0" }}>
            <Button href={url} style={button}>
              Choisir un nouveau mot de passe
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={small}>
            Si tu n'es pas à l'origine de cette demande, ignore ce message.
          </Text>
          <Text style={small}>{url}</Text>
        </Container>
      </Body>
    </Html>
  );
}

export function MagicLinkEmail({ url, siteName = "Folio" }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Connecte-toi à {siteName} en un clic</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Ton lien de connexion</Heading>
          <Text style={text}>
            Clique sur le bouton ci-dessous pour te connecter sans mot de passe.
            Ce lien expire dans 5 minutes.
          </Text>
          <Section style={{ margin: "24px 0" }}>
            <Button href={url} style={button}>
              Me connecter
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={small}>
            Si tu n'es pas à l'origine de cette demande, ignore ce message —
            personne ne peut accéder à ton compte sans ce lien.
          </Text>
          <Text style={small}>{url}</Text>
        </Container>
      </Body>
    </Html>
  );
}
