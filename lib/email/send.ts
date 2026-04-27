import { render } from "@react-email/components";
import { FROM_ADDRESS, resend } from "./client";
import { VerifyEmail } from "./templates/verify-email";
import { ResetPasswordEmail } from "./templates/reset-password";

export async function sendVerifyEmail(to: string, verifyUrl: string) {
  const html = await render(VerifyEmail({ verifyUrl }));
  await resend().emails.send({
    from: FROM_ADDRESS,
    to,
    subject: "Verify your PATCH account",
    html,
  });
}

export async function sendResetPasswordEmail(to: string, resetUrl: string) {
  const html = await render(ResetPasswordEmail({ resetUrl }));
  await resend().emails.send({
    from: FROM_ADDRESS,
    to,
    subject: "Reset your PATCH password",
    html,
  });
}
