import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { medicationInput } from "@/lib/validators/medication";

async function findOwned(id: string, userId: string) {
  const med = await prisma.medication.findUnique({
    where: { id },
    include: { schedules: true },
  });
  if (!med || med.userId !== userId) return null;
  return med;
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
  const med = await findOwned(id, session.user.id);
  if (!med) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ medication: med });
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
  const parsed = medicationInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  // Replace schedules wholesale — simpler than diffing for now.
  const med = await prisma.$transaction(async (tx) => {
    await tx.medicationSchedule.deleteMany({ where: { medicationId: id } });
    return tx.medication.update({
      where: { id },
      data: {
        name: parsed.data.name,
        dosage: parsed.data.dosage,
        form: parsed.data.form ?? null,
        active: parsed.data.active,
        notes: parsed.data.notes ?? null,
        schedules: {
          create: parsed.data.schedules.map((s) => ({
            timesOfDay: s.timesOfDay,
            daysOfWeek: s.daysOfWeek,
            startsOn: s.startsOn,
            endsOn: s.endsOn ?? null,
          })),
        },
      },
      include: { schedules: true },
    });
  });

  return NextResponse.json({ medication: med });
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
  await prisma.medication.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
