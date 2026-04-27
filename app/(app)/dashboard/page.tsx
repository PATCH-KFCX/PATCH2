import { redirect } from "next/navigation";
import { format } from "date-fns";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  SeverityChart,
} from "@/components/charts/severity-chart";
import { pointsFromLogs } from "@/lib/charts/transforms";
import {
  GlucoseChart,
} from "@/components/charts/glucose-chart";
import { pointsFromDiabetesLogs } from "@/lib/charts/transforms";
import { adherenceFor, summarizeSchedule } from "@/lib/medications/adherence";
import { diabetesStats } from "@/lib/diabetes/a1c";
import { parseRange } from "@/lib/dashboard/range";
import { DashboardFilters } from "./dashboard-filters";
import { QuickLogButtons } from "./quick-log-dialogs";
import { TodayMeds, type TodayMedRow } from "./today-meds";

export const metadata = { title: "Dashboard — PATCH" };

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const sp = await searchParams;
  const range = parseRange(sp);

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const [
    symptomCountInRange,
    lastSymptom,
    severityChartLogs,
    glucoseInRange,
    lastGlucose,
    glucoseChartLogs,
    activeMeds,
  ] = await Promise.all([
    prisma.symptomLog.count({
      where: {
        userId,
        occurredAt: { gte: range.from, lte: range.to },
      },
    }),
    prisma.symptomLog.findFirst({
      where: { userId },
      orderBy: { occurredAt: "desc" },
      select: { occurredAt: true, severity: true },
    }),
    prisma.symptomLog.findMany({
      where: { userId, occurredAt: { gte: range.from, lte: range.to } },
      orderBy: { occurredAt: "asc" },
      take: 500,
      select: { occurredAt: true, severity: true },
    }),
    prisma.diabetesLog.findMany({
      where: {
        userId,
        measuredAt: { gte: range.from, lte: range.to },
      },
      select: { glucoseMgDl: true },
    }),
    prisma.diabetesLog.findFirst({
      where: { userId },
      orderBy: { measuredAt: "desc" },
      select: { measuredAt: true, glucoseMgDl: true, context: true },
    }),
    prisma.diabetesLog.findMany({
      where: { userId, measuredAt: { gte: range.from, lte: range.to } },
      orderBy: { measuredAt: "asc" },
      take: 500,
      select: { measuredAt: true, glucoseMgDl: true, context: true },
    }),
    prisma.medication.findMany({
      where: { userId, active: true },
      orderBy: { name: "asc" },
      include: {
        schedules: true,
        doses: {
          where: { takenAt: { gte: startOfToday, lte: endOfToday } },
          select: { takenAt: true, skipped: true },
        },
      },
    }),
  ]);

  const glucoseStats = diabetesStats(glucoseInRange);

  // Adherence today (averaged across active meds with a schedule)
  const todayMeds: TodayMedRow[] = activeMeds.map((m) => {
    const adh = adherenceFor(
      m.schedules.map((s) => ({
        timesOfDay: s.timesOfDay,
        daysOfWeek: s.daysOfWeek,
        startsOn: s.startsOn,
        endsOn: s.endsOn,
      })),
      m.doses,
      startOfToday,
      endOfToday,
    );
    return {
      id: m.id,
      name: m.name,
      dosage: m.dosage,
      scheduleSummary:
        m.schedules.length === 0
          ? "No schedule"
          : m.schedules.map(summarizeSchedule).join(" · "),
      takenToday: adh.taken,
      expectedToday: adh.expected,
    };
  });
  const { taken, expected } = todayMeds.reduce(
    (acc, r) =>
      r.expectedToday > 0
        ? {
            taken: acc.taken + r.takenToday,
            expected: acc.expected + r.expectedToday,
          }
        : acc,
    { taken: 0, expected: 0 },
  );
  const adherenceTodayPct =
    expected === 0 ? null : Math.min(100, Math.round((taken / expected) * 100));

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {session.user.name ? `Hi, ${session.user.name.split(" ")[0]}.` : "Dashboard"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {format(range.from, "MMM d")} – {format(range.to, "MMM d, yyyy")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DashboardFilters />
          <QuickLogButtons />
        </div>
      </header>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Symptom entries</CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {symptomCountInRange}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {lastSymptom
              ? `Last: ${format(lastSymptom.occurredAt, "MMM d")} · severity ${lastSymptom.severity}/10`
              : "No entries yet."}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Average glucose</CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {glucoseStats.averageMgDl != null
                ? `${glucoseStats.averageMgDl}`
                : "—"}
              <span className="text-sm font-normal text-muted-foreground">
                {" "}
                mg/dL
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {glucoseStats.estA1c != null
              ? `Est. A1c ${glucoseStats.estA1c.toFixed(1)}% · ${glucoseStats.inRangePct}% in range`
              : "No readings in window."}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Last glucose</CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {lastGlucose ? lastGlucose.glucoseMgDl : "—"}
              <span className="text-sm font-normal text-muted-foreground">
                {lastGlucose ? " mg/dL" : ""}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {lastGlucose
              ? `${format(lastGlucose.measuredAt, "MMM d, p")}`
              : "Log a reading to see it here."}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Today&apos;s adherence</CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {adherenceTodayPct != null ? `${adherenceTodayPct}%` : "—"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {activeMeds.length === 0
              ? "No active medications."
              : `${activeMeds.length} active medication${activeMeds.length === 1 ? "" : "s"}.`}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Symptom severity
            </CardTitle>
            <CardDescription className="text-xs">
              Last {range.days} days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SeverityChart data={pointsFromLogs(severityChartLogs)} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Glucose</CardTitle>
            <CardDescription className="text-xs">
              Last {range.days} days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GlucoseChart data={pointsFromDiabetesLogs(glucoseChartLogs)} />
          </CardContent>
        </Card>
      </div>

      {/* Today's meds */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Today&apos;s medications</CardTitle>
          <CardDescription className="text-xs">
            {format(startOfToday, "PPP")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TodayMeds items={todayMeds} />
        </CardContent>
      </Card>
    </div>
  );
}
