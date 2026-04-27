import Link from "next/link";
import { MedicationForm } from "../medication-form";

export const metadata = { title: "Add medication — PATCH" };

export default function NewMedicationPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">
          <Link href="/medications" className="hover:underline">
            ← Back to medications
          </Link>
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">Add medication</h1>
      </header>
      <MedicationForm mode="create" />
    </div>
  );
}
