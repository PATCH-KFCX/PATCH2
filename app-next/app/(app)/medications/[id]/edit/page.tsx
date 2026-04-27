import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { MedicationForm } from "../../medication-form";

export const metadata = { title: "Edit medication — PATCH" };

export default async function EditMedicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const { id } = await params;

  const med = await prisma.medication.findUnique({
    where: { id },
    include: { schedules: true },
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
        <h1 className="text-2xl font-semibold tracking-tight">Edit medication</h1>
      </header>
      <MedicationForm
        mode="edit"
        id={med.id}
        defaultValues={{
          name: med.name,
          dosage: med.dosage,
          form: med.form,
          active: med.active,
          notes: med.notes,
          schedules: med.schedules.map((s) => ({
            timesOfDay: s.timesOfDay,
            daysOfWeek: s.daysOfWeek,
            startsOn: s.startsOn,
            endsOn: s.endsOn,
          })),
        }}
      />
    </div>
  );
}
