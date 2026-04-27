import Link from "next/link";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DiabetesFilters } from "./diabetes-filters";
import {
  GlucoseChart,
} from "@/components/charts/glucose-chart";
import { pointsFromDiabetesLogs } from "@/lib/charts/transforms";
import { diabetesLogQuery } from "@/lib/validators/diabetes";
import {
  CONTEXT_COLORS,
  CONTEXT_LABELS,
  type GlucoseContextValue,
} from "@/lib/diabetes/labels";
import { diabetesStats } from "@/lib/diabetes/a1c";

export const metadata = { title: "Diabetes — PATCH" };

const PAGE_SIZE = 20;

function readingClass(mg: number, low: number, high: number) {
  if (mg < low) return "text-blue-700 dark:text-blue-300";
  if (mg > high) return "text-amber-700 dark:text-amber-300";
  return "text-emerald-700 dark:text-emerald-300";
}

export default async function DiabetesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const sp = await searchParams;
  const flat: Record<string, string> = {};
  for (const [k, v] of Object.entries(sp)) {
    if (typeof v === "string") flat[k] = v;
    else if (Array.isArray(v) && v[0]) flat[k] = v[0];
  }
  const parsed = diabetesLogQuery.safeParse({
    ...flat,
    pageSize: String(PAGE_SIZE),
  });
  const { from, to, context, page } = parsed.success
    ? parsed.data
    : { from: undefined, to: undefined, context: undefined, page: 1 };

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

  // eslint-disable-next-line react-hooks/purity -- async server component, runs per request
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

  const [total, items, chartLogs, recent90] = await Promise.all([
    prisma.diabetesLog.count({ where }),
    prisma.diabetesLog.findMany({
      where,
      orderBy: { measuredAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.diabetesLog.findMany({
      where: { userId: session.user.id },
      orderBy: { measuredAt: "asc" },
      take: 500,
      select: { measuredAt: true, glucoseMgDl: true, context: true },
    }),
    prisma.diabetesLog.findMany({
      where: { userId: session.user.id, measuredAt: { gte: ninetyDaysAgo } },
      select: { glucoseMgDl: true },
    }),
  ]);

  const stats = diabetesStats(recent90);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function pageHref(p: number) {
    const next = new URLSearchParams();
    for (const [k, v] of Object.entries(flat)) {
      if (k !== "page") next.set(k, v);
    }
    next.set("page", String(p));
    return `/diabetes?${next.toString()}`;
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Diabetes</h1>
          <p className="text-sm text-muted-foreground">
            {total} {total === 1 ? "reading" : "readings"} matching filters.
          </p>
        </div>
        <Link href="/diabetes/new" className={buttonVariants()}>
          + Log a reading
        </Link>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Last 90 days
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tabular-nums">
            {stats.count}
            <span className="text-sm font-normal text-muted-foreground">
              {" "}
              readings
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Average glucose
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tabular-nums">
            {stats.averageMgDl != null ? `${stats.averageMgDl}` : "—"}
            <span className="text-sm font-normal text-muted-foreground">
              {" "}
              mg/dL
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Estimated A1c
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tabular-nums">
            {stats.estA1c != null ? stats.estA1c.toFixed(1) : "—"}
            <span className="text-sm font-normal text-muted-foreground"> %</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              In range ({stats.low}–{stats.high})
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tabular-nums">
            {stats.inRangePct != null ? `${stats.inRangePct}` : "—"}
            <span className="text-sm font-normal text-muted-foreground"> %</span>
          </CardContent>
        </Card>
      </div>
      <p className="text-xs text-muted-foreground -mt-3">
        A1c estimate uses the ADA eAG formula (A1c = (avg + 46.7) / 28.7) over
        the last 90 days. It&apos;s a directional indicator, not a clinical
        replacement for a lab test.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">
            Glucose by context
          </CardTitle>
        </CardHeader>
        <CardContent>
          <GlucoseChart data={pointsFromDiabetesLogs(chartLogs)} />
        </CardContent>
      </Card>

      <Separator />

      <DiabetesFilters />

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            {total === 0
              ? "No glucose readings yet. Log your first one to start your trend."
              : "No readings match these filters."}
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-2">
          {items.map((log) => {
            const ctx = log.context as GlucoseContextValue;
            return (
              <li key={log.id}>
                <Link
                  href={`/diabetes/${log.id}/edit`}
                  className="block rounded-lg border bg-background p-4 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xl font-semibold tabular-nums ${readingClass(log.glucoseMgDl, 70, 180)}`}
                        >
                          {log.glucoseMgDl}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          mg/dL
                        </span>
                        <Badge
                          variant="outline"
                          className="ml-1"
                          style={{
                            borderColor: CONTEXT_COLORS[ctx],
                            color: CONTEXT_COLORS[ctx],
                          }}
                        >
                          {CONTEXT_LABELS[ctx]}
                        </Badge>
                        <span className="text-sm text-muted-foreground ml-auto">
                          {format(log.measuredAt, "PPp")}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        {log.carbsGrams != null && (
                          <span>{log.carbsGrams} g carbs</span>
                        )}
                        {log.insulinUnits != null && (
                          <span>{log.insulinUnits} u insulin</span>
                        )}
                      </div>
                      {log.notes && (
                        <p className="text-sm text-muted-foreground line-clamp-2 pt-1">
                          {log.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {totalPages > 1 && (
        <nav className="flex items-center justify-between pt-2">
          {page > 1 ? (
            <Link
              href={pageHref(page - 1)}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              ← Previous
            </Link>
          ) : (
            <span />
          )}
          <p className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          {page < totalPages ? (
            <Link
              href={pageHref(page + 1)}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Next →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </div>
  );
}
