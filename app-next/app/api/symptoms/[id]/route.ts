import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { symptomLogInput } from "@/lib/validators/symptom";

async function findOwned(id: string, userId: string) {
  const log = await prisma.symptomLog.findUnique({ where: { id } });
  if (!log || log.userId !== userId) return null;
  return log;
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const log = await findOwned(id, session.user.id);
  if (!log) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ log });
}

export async function PUT(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const existing = await findOwned(id, session.user.id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = symptomLogInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const log = await prisma.symptomLog.update({
    where: { id },
    data: {
      occurredAt: parsed.data.occurredAt,
      severity: parsed.data.severity,
      notes: parsed.data.notes ?? null,
      symptoms: parsed.data.symptoms,
      painTypes: parsed.data.painTypes,
      painLocations: parsed.data.painLocations,
    },
  });
  return NextResponse.json({ log });
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const existing = await findOwned(id, session.user.id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await prisma.symptomLog.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
