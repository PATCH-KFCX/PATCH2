import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { SymptomForm } from "../../symptom-form";

export const metadata = { title: "Edit symptom — PATCH" };

export default async function EditSymptomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const { id } = await params;

  const log = await prisma.symptomLog.findUnique({ where: { id } });
  if (!log || log.userId !== session.user.id) notFound();

  return (
    <div className="space-y-6 max-w-2xl">
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">
          <Link href="/symptoms" className="hover:underline">
            ← Back to symptoms
          </Link>
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">Edit symptom</h1>
      </header>
      <SymptomForm
        mode="edit"
        id={log.id}
        defaultValues={{
          occurredAt: log.occurredAt,
          severity: log.severity,
          notes: log.notes,
          symptoms: log.symptoms,
          painTypes: log.painTypes,
          painLocations: log.painLocations,
        }}
      />
    </div>
  );
}
