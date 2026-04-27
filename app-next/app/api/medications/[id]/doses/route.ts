import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { medicationDoseInput } from "@/lib/validators/medication";

async function ensureOwned(medId: string, userId: string) {
  const med = await prisma.medication.findUnique({
    where: { id: medId },
    select: { id: true, userId: true },
  });
  return !!med && med.userId === userId;
}

export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  if (!(await ensureOwned(id, session.user.id))) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const url = new URL(req.url);
  const limit = Math.min(
    100,
    Math.max(1, Number(url.searchParams.get("limit") ?? "50") || 50),
  );
  const items = await prisma.medicationDose.findMany({
    where: { medicationId: id },
    orderBy: { takenAt: "desc" },
    take: limit,
  });
  return NextResponse.json({ items });
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  if (!(await ensureOwned(id, session.user.id))) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = medicationDoseInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const dose = await prisma.medicationDose.create({
    data: {
      medicationId: id,
      takenAt: parsed.data.takenAt,
      skipped: parsed.data.skipped,
      notes: parsed.data.notes ?? null,
    },
  });
  return NextResponse.json({ dose }, { status: 201 });
}
