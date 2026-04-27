import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { passwordResetRequestInput } from "@/lib/validators/user";
import { issueResetToken } from "@/lib/auth/tokens";
import { sendResetPasswordEmail } from "@/lib/email/send";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = passwordResetRequestInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const email = parsed.data.email.toLowerCase();

  const user = await prisma.user.findUnique({ where: { email } });
  // Always respond ok to avoid leaking existence.
  if (user) {
    const t = await issueResetToken(email);
    const url = new URL(req.url);
    const resetUrl = `${url.origin}/reset/${t}`;
    try {
      await sendResetPasswordEmail(email, resetUrl);
    } catch (err) {
      console.error("sendResetPasswordEmail failed", err);
    }
  }
  return NextResponse.json({ ok: true });
}
