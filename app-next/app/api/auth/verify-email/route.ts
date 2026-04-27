import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { consumeVerifyToken } from "@/lib/auth/tokens";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.toLowerCase() : "";
  const token = typeof body?.token === "string" ? body.token : "";
  if (!email || !token) {
    return NextResponse.json({ error: "Missing token or email" }, { status: 400 });
  }

  const ok = await consumeVerifyToken(email, token);
  if (!ok) {
    return NextResponse.json(
      { error: "Token is invalid or expired" },
      { status: 400 },
    );
  }

  await prisma.user.update({
    where: { email },
    data: { emailVerified: new Date() },
  });

  return NextResponse.json({ ok: true });
}
