import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export interface VerifyEmailProps {
  verifyUrl: string;
}

export function VerifyEmail({ verifyUrl }: VerifyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your PATCH account</Preview>
      <Body
        style={{ backgroundColor: "#f6f6f6", fontFamily: "system-ui, sans-serif" }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            margin: "40px auto",
            padding: "32px",
            maxWidth: "480px",
            borderRadius: "8px",
          }}
        >
          <Heading style={{ fontSize: "20px", marginBottom: "16px" }}>
            Confirm your email
          </Heading>
          <Text>
            Welcome to PATCH. Click the button below to verify your email and
            activate your account.
          </Text>
          <Section style={{ margin: "24px 0" }}>
            <Button
              href={verifyUrl}
              style={{
                backgroundColor: "#0f172a",
                color: "#ffffff",
                padding: "12px 20px",
                borderRadius: "6px",
                textDecoration: "none",
              }}
            >
              Verify email
            </Button>
          </Section>
          <Text style={{ color: "#64748b", fontSize: "13px" }}>
            If the button doesn&apos;t work, paste this link into your browser:
            <br />
            {verifyUrl}
          </Text>
          <Text style={{ color: "#64748b", fontSize: "13px" }}>
            Link expires in 24 hours. If you didn&apos;t create a PATCH account,
            you can safely ignore this message.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
