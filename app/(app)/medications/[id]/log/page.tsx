import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { format } from "date-fns";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogDoseForm } from "./log-form";
import { DoseHistory } from "./dose-history";

export const metadata = { title: "Log dose — PATCH" };

export default async function LogDosePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const { id } = await params;

  const med = await prisma.medication.findUnique({
    where: { id },
    include: {
      schedules: true,
      doses: { orderBy: { takenAt: "desc" }, take: 30 },
    },
  });
  if (!med || med.userId !== session.user.id) notFound();

  return (
    <div className="space-y-6 max-w-2xl">
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">
          <Link href="/medications" className="hover:underline">
            ← Back to medications
          </Link>
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">{med.name}</h1>
        <p className="text-sm text-muted-foreground">{med.dosage}</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Log a dose</CardTitle>
        </CardHeader>
        <CardContent>
          <LogDoseForm medicationId={med.id} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Recent doses</CardTitle>
        </CardHeader>
        <CardContent>
          {med.doses.length === 0 ? (
            <p className="text-sm text-muted-foreground">No doses logged yet.</p>
          ) : (
            <DoseHistory
              medicationId={med.id}
              doses={med.doses.map((d) => ({
                id: d.id,
                takenAt: d.takenAt.toISOString(),
                skipped: d.skipped,
                notes: d.notes,
                takenAtLabel: format(d.takenAt, "PPp"),
              }))}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
