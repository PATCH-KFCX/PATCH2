import Link from "next/link";
import { DiabetesForm } from "../diabetes-form";

export const metadata = { title: "Log a glucose reading — PATCH" };

export default function NewDiabetesPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">
          <Link href="/diabetes" className="hover:underline">
            ← Back to diabetes
          </Link>
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">
          Log a glucose reading
        </h1>
      </header>
      <DiabetesForm mode="create" />
    </div>
  );
}
