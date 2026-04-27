import Link from "next/link";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SymptomsFilters } from "./symptoms-filters";
import { SeverityChart, pointsFromLogs } from "@/components/charts/severity-chart";
import { symptomLogQuery } from "@/lib/validators/symptom";

export const metadata = { title: "Symptoms — PATCH" };

const PAGE_SIZE = 20;

function severityClass(s: number) {
  if (s >= 8) return "bg-destructive/10 text-destructive border-destructive/30";
  if (s >= 5) return "bg-amber-500/10 text-amber-700 border-amber-500/30 dark:text-amber-300";
  return "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:text-emerald-300";
}

export default async function SymptomsPage({
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
  const parsed = symptomLogQuery.safeParse({
    ...flat,
    pageSize: String(PAGE_SIZE),
  });
  const { q, from, to, minSeverity, page } = parsed.success
    ? parsed.data
    : { q: undefined, from: undefined, to: undefined, minSeverity: undefined, page: 1 };

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
    ...(typeof minSeverity === "number"
      ? { severity: { gte: minSeverity } }
      : {}),
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

  const [total, items, chartLogs] = await Promise.all([
    prisma.symptomLog.count({ where }),
    prisma.symptomLog.findMany({
      where,
      orderBy: { occurredAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.symptomLog.findMany({
      where: { userId: session.user.id },
      orderBy: { occurredAt: "asc" },
      take: 200,
      select: { occurredAt: true, severity: true },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function pageHref(p: number) {
    const next = new URLSearchParams();
    for (const [k, v] of Object.entries(flat)) {
      if (k !== "page") next.set(k, v);
    }
    next.set("page", String(p));
    return `/symptoms?${next.toString()}`;
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Symptoms</h1>
          <p className="text-sm text-muted-foreground">
            {total} {total === 1 ? "entry" : "entries"} total.
          </p>
        </div>
        <Link href="/symptoms/new" className={buttonVariants()}>
          + Log a symptom
        </Link>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">
            Severity over time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SeverityChart data={pointsFromLogs(chartLogs)} />
        </CardContent>
      </Card>

      <Separator />

      <SymptomsFilters />

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            {total === 0
              ? "No symptom entries yet. Log your first one to start your timeline."
              : "No entries match these filters."}
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-2">
          {items.map((log) => (
            <li key={log.id}>
              <Link
                href={`/symptoms/${log.id}/edit`}
                className="block rounded-lg border bg-background p-4 hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex h-7 min-w-7 items-center justify-center rounded-md border px-2 text-sm font-medium ${severityClass(log.severity)}`}
                        aria-label={`Severity ${log.severity} of 10`}
                      >
                        {log.severity}
                      </span>
                      <span className="text-sm font-medium">
                        {format(log.occurredAt, "PPp")}
                      </span>
                    </div>
                    {(log.symptoms.length > 0 ||
                      log.painTypes.length > 0 ||
                      log.painLocations.length > 0) && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {log.symptoms.map((s) => (
                          <Badge key={`s-${s}`} variant="secondary">
                            {s}
                          </Badge>
                        ))}
                        {log.painTypes.map((s) => (
                          <Badge key={`t-${s}`} variant="outline">
                            {s}
                          </Badge>
                        ))}
                        {log.painLocations.map((s) => (
                          <Badge key={`l-${s}`} variant="outline">
                            @ {s}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {log.notes && (
                      <p className="text-sm text-muted-foreground line-clamp-2 pt-1">
                        {log.notes}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    Edit →
                  </span>
                </div>
              </Link>
            </li>
          ))}
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
