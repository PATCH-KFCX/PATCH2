import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { DiabetesForm } from "../../diabetes-form";

export const metadata = { title: "Edit reading — PATCH" };

export default async function EditDiabetesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const { id } = await params;

  const log = await prisma.diabetesLog.findUnique({ where: { id } });
  if (!log || log.userId !== session.user.id) notFound();

  return (
    <div className="space-y-6 max-w-2xl">
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">
          <Link href="/diabetes" className="hover:underline">
            ← Back to diabetes
          </Link>
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">Edit reading</h1>
      </header>
      <DiabetesForm
        mode="edit"
        id={log.id}
        defaultValues={{
          measuredAt: log.measuredAt,
          glucoseMgDl: log.glucoseMgDl,
          context: log.context,
          carbsGrams: log.carbsGrams,
          insulinUnits: log.insulinUnits,
          notes: log.notes,
        }}
      />
    </div>
  );
}
