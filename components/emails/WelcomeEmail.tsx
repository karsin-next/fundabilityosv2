import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  userName: string;
}

export const WelcomeEmail = ({
  userName,
}: WelcomeEmailProps) => {
  const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;

  return (
    <Html>
      <Head />
      <Preview>Welcome to FundabilityOS — Let's build your investor readiness.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>FUNDABILITYOS</Heading>
          
          <Section style={contentSection}>
            <Text style={h2}>Welcome aboard, {userName}!</Text>
            <Text style={text}>
              Thanks for joining FundabilityOS. Our mission is to help Southeast Asian founders bridge the gap between their vision and institutional investment.
            </Text>
            
            <Text style={text}>
              You now have access to our AI-driven diagnostic tools, gap analysis, and the 30-Day Growth Plan framework.
            </Text>
            
            <Section style={buttonContainer}>
              <Link href={loginUrl} style={button}>
                ACCESS YOUR DASHBOARD
              </Link>
            </Section>
            
            <Text style={text}>
              If you haven't already, your first step is to complete the **QuickAssess Diagnostic**. It takes less than 10 minutes and will give you an immediate score and high-level gap report.
            </Text>

            <Text style={footerText}>
              Built by NextBlaze Asia for Southeast Asian founders.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

const main = {
  backgroundColor: "#f4f6f8",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#022F42",
  margin: "40px auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  borderRadius: "8px",
  overflow: "hidden",
};

const h1 = {
  color: "#FACC15",
  fontSize: "20px",
  fontWeight: "800",
  letterSpacing: "0.5px",
  textAlign: "center" as const,
  padding: "30px 20px",
  margin: "0",
};

const contentSection = {
  backgroundColor: "#ffffff",
  padding: "40px",
  borderRadius: "8px 8px 0 0",
};

const h2 = {
  color: "#022F42",
  fontSize: "24px",
  fontWeight: "700",
  margin: "0 0 20px",
};

const text = {
  color: "#334155",
  fontSize: "16px",
  lineHeight: "24px",
  marginBottom: "24px",
};

const buttonContainer = {
  textAlign: "center" as const,
  marginTop: "32px",
  marginBottom: "32px",
};

const button = {
  backgroundColor: "#FACC15",
  borderRadius: "4px",
  color: "#022F42",
  fontSize: "15px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "16px 32px",
};

const footerText = {
  color: "#94a3b8",
  fontSize: "13px",
  lineHeight: "20px",
  textAlign: "center" as const,
  marginTop: "48px",
};
