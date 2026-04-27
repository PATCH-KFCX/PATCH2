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

export interface ResetPasswordEmailProps {
  resetUrl: string;
}

export function ResetPasswordEmail({ resetUrl }: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your PATCH password</Preview>
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
            Reset your password
          </Heading>
          <Text>
            We received a request to reset your PATCH password. Click below to
            choose a new one.
          </Text>
          <Section style={{ margin: "24px 0" }}>
            <Button
              href={resetUrl}
              style={{
                backgroundColor: "#0f172a",
                color: "#ffffff",
                padding: "12px 20px",
                borderRadius: "6px",
                textDecoration: "none",
              }}
            >
              Reset password
            </Button>
          </Section>
          <Text style={{ color: "#64748b", fontSize: "13px" }}>
            Link expires in 1 hour. If you didn&apos;t request a reset, ignore
            this email — your password is unchanged.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
