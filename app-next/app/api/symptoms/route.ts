import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { symptomLogInput, symptomLogQuery } from "@/lib/validators/symptom";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const parsed = symptomLogQuery.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { q, from, to, minSeverity, page, pageSize } = parsed.data;

  const where: Prisma.SymptomLogWhereInput = {
    userId: session.user.id,
    ...(from || to
      ? {
          occurredAt: {
            ...(from ? { gte: from } : {}),
            ...(to ? { lte: to } : {}),
          },
        }
      : {}),
    ...(typeof minSeverity === "number" ? { severity: { gte: minSeverity } } : {}),
    ...(q
      ? {
          OR: [
            { notes: { contains: q, mode: "insensitive" } },
            { symptoms: { has: q } },
            { painTypes: { has: q } },
            { painLocations: { has: q } },
          ],
        }
      : {}),
  };

  const [total, items] = await Promise.all([
    prisma.symptomLog.count({ where }),
    prisma.symptomLog.findMany({
      where,
      orderBy: { occurredAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return NextResponse.json({ items, total, page, pageSize });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = symptomLogInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const log = await prisma.symptomLog.create({
    data: {
      userId: session.user.id,
      occurredAt: parsed.data.occurredAt,
      severity: parsed.data.severity,
      notes: parsed.data.notes ?? null,
      symptoms: parsed.data.symptoms,
      painTypes: parsed.data.painTypes,
      painLocations: parsed.data.painLocations,
    },
  });

  return NextResponse.json({ log }, { status: 201 });
}
