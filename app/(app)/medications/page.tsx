import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  adherenceFor,
  summarizeSchedule,
} from "@/lib/medications/adherence";
import {
  MedicationsList,
  type MedicationRow,
} from "./medications-list";

export const metadata = { title: "Medications — PATCH" };

export default async function MedicationsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const meds = await prisma.medication.findMany({
    where: { userId: session.user.id },
    orderBy: [{ active: "desc" }, { name: "asc" }],
    include: {
      schedules: true,
      doses: {
        where: { takenAt: { gte: thirtyDaysAgo, lte: now } },
        select: { takenAt: true, skipped: true },
      },
    },
  });

  const rows: MedicationRow[] = meds.map((m) => {
    const adh = adherenceFor(
      m.schedules.map((s) => ({
        timesOfDay: s.timesOfDay,
        daysOfWeek: s.daysOfWeek,
        startsOn: s.startsOn,
        endsOn: s.endsOn,
      })),
      m.doses,
      thirtyDaysAgo,
      now,
    );
    return {
      id: m.id,
      name: m.name,
      dosage: m.dosage,
      active: m.active,
      scheduleSummary:
        m.schedules.length === 0
          ? "No schedule"
          : m.schedules.map(summarizeSchedule).join(" · "),
      adherencePct: adh.pct,
      takenLast30: adh.taken,
      expectedLast30: adh.expected,
    };
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Medications</h1>
          <p className="text-sm text-muted-foreground">
            {rows.length} {rows.length === 1 ? "medication" : "medications"}.
          </p>
        </div>
        <Link href="/medications/new" className={buttonVariants()}>
          + Add medication
        </Link>
      </header>

      {rows.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No medications yet. Add one to start tracking adherence.
          </CardContent>
        </Card>
      ) : (
        <MedicationsList items={rows} />
      )}
    </div>
  );
}
