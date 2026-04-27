import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { medicationInput } from "@/lib/validators/medication";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const items = await prisma.medication.findMany({
    where: { userId: session.user.id },
    orderBy: [{ active: "desc" }, { name: "asc" }],
    include: { schedules: true },
  });
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const parsed = medicationInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const med = await prisma.medication.create({
    data: {
      userId: session.user.id,
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
  return NextResponse.json({ medication: med }, { status: 201 });
}
