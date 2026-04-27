import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { profileUpdateInput } from "@/lib/validators/user";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      bio: true,
      avatarUrl: true,
      timezone: true,
      emailVerified: true,
      createdAt: true,
    },
  });
  return NextResponse.json({ user });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const parsed = profileUpdateInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: parsed.data.name ?? null,
      bio: parsed.data.bio ?? null,
      ...(parsed.data.timezone ? { timezone: parsed.data.timezone } : {}),
    },
    select: {
      id: true,
      email: true,
      name: true,
      bio: true,
      avatarUrl: true,
      timezone: true,
    },
  });
  return NextResponse.json({ user });
}
