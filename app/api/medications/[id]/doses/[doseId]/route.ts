import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string; doseId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id, doseId } = await ctx.params;

  const dose = await prisma.medicationDose.findUnique({
    where: { id: doseId },
    include: { medication: { select: { userId: true, id: true } } },
  });
  if (
    !dose ||
    dose.medicationId !== id ||
    dose.medication.userId !== session.user.id
  ) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await prisma.medicationDose.delete({ where: { id: doseId } });
  return NextResponse.json({ ok: true });
}
