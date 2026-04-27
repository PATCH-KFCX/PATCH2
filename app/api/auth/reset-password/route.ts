import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { passwordResetConfirmInput } from "@/lib/validators/user";
import { consumeResetToken } from "@/lib/auth/tokens";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = passwordResetConfirmInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const email = await consumeResetToken(parsed.data.token);
  if (!email) {
    return NextResponse.json(
      { error: "Token is invalid or expired" },
      { status: 400 },
    );
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  await prisma.user.update({
    where: { email },
    data: { passwordHash, emailVerified: new Date() },
  });

  return NextResponse.json({ ok: true });
}
