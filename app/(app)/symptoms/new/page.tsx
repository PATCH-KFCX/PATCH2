import Link from "next/link";
import { SymptomForm } from "../symptom-form";

export const metadata = { title: "Log a symptom — PATCH" };

export default function NewSymptomPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">
          <Link href="/symptoms" className="hover:underline">
            ← Back to symptoms
          </Link>
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">Log a symptom</h1>
      </header>
      <SymptomForm mode="create" />
    </div>
  );
}
