import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { issueVerifyToken } from "@/lib/auth/tokens";
import { sendVerifyEmail } from "@/lib/email/send";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true, emailVerified: true },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (user.emailVerified) {
    return NextResponse.json({ ok: true, alreadyVerified: true });
  }

  const t = await issueVerifyToken(user.email);
  const url = new URL(req.url);
  const verifyUrl = `${url.origin}/verify-email?token=${t}&email=${encodeURIComponent(user.email)}`;
  try {
    await sendVerifyEmail(user.email, verifyUrl);
  } catch (err) {
    console.error("sendVerifyEmail (resend) failed", err);
    return NextResponse.json(
      { error: "Could not send verification email." },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true });
}
