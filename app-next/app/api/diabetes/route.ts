import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import {
  diabetesLogInput,
  diabetesLogQuery,
} from "@/lib/validators/diabetes";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const parsed = diabetesLogQuery.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { from, to, context, page, pageSize } = parsed.data;

  const where: Prisma.DiabetesLogWhereInput = {
    userId: session.user.id,
    ...(from || to
      ? {
          measuredAt: {
            ...(from ? { gte: from } : {}),
            ...(to ? { lte: to } : {}),
          },
        }
      : {}),
    ...(context ? { context } : {}),
  };

  const [total, items] = await Promise.all([
    prisma.diabetesLog.count({ where }),
    prisma.diabetesLog.findMany({
      where,
      orderBy: { measuredAt: "desc" },
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
  const parsed = diabetesLogInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const log = await prisma.diabetesLog.create({
    data: {
      userId: session.user.id,
      measuredAt: parsed.data.measuredAt,
      glucoseMgDl: parsed.data.glucoseMgDl,
      context: parsed.data.context,
      carbsGrams: parsed.data.carbsGrams ?? null,
      insulinUnits: parsed.data.insulinUnits ?? null,
      notes: parsed.data.notes ?? null,
    },
  });
  return NextResponse.json({ log }, { status: 201 });
}
