import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signupInput } from "@/lib/validators/user";
import { issueVerifyToken } from "@/lib/auth/tokens";
import { sendVerifyEmail } from "@/lib/email/send";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = signupInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const email = parsed.data.email.toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "An account with that email already exists" },
      { status: 409 },
    );
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  await prisma.user.create({
    data: {
      email,
      passwordHash,
      name: parsed.data.name ?? null,
    },
  });

  const t = await issueVerifyToken(email);
  const url = new URL(req.url);
  const verifyUrl = `${url.origin}/verify-email?token=${t}&email=${encodeURIComponent(email)}`;
  try {
    await sendVerifyEmail(email, verifyUrl);
  } catch (err) {
    console.error("sendVerifyEmail failed", err);
  }

  return NextResponse.json({ ok: true });
}
