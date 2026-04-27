"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";

export interface MedicationRow {
  id: string;
  name: string;
  dosage: string;
  active: boolean;
  scheduleSummary: string;
  adherencePct: number | null;
  takenLast30: number;
  expectedLast30: number;
}

function adherenceClass(pct: number | null) {
  if (pct == null) return "text-muted-foreground";
  if (pct >= 80) return "text-emerald-600 dark:text-emerald-400";
  if (pct >= 50) return "text-amber-600 dark:text-amber-400";
  return "text-destructive";
}

export function MedicationsList({ items }: { items: MedicationRow[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  async function quickLog(id: string) {
    const res = await fetch(`/api/medications/${id}/doses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ takenAt: new Date().toISOString(), skipped: false }),
    });
    if (!res.ok) {
      toast.error("Could not log dose.");
      return;
    }
    toast.success("Dose logged.");
    startTransition(() => router.refresh());
  }

  return (
    <ul className="space-y-2">
      {items.map((m) => (
        <li
          key={m.id}
          className="rounded-lg border bg-background p-4 hover:bg-muted/30 transition-colors"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <Link
                  href={`/medications/${m.id}/log`}
                  className="text-base font-medium hover:underline"
                >
                  {m.name}
                </Link>
                <span className="text-sm text-muted-foreground">{m.dosage}</span>
                {!m.active && <Badge variant="outline">Paused</Badge>}
              </div>
              <p className="text-xs text-muted-foreground">{m.scheduleSummary}</p>
              <p className="text-xs">
                <span className={`font-medium tabular-nums ${adherenceClass(m.adherencePct)}`}>
                  {m.adherencePct != null ? `${m.adherencePct}%` : "—"}
                </span>{" "}
                <span className="text-muted-foreground">
                  last 30 days · {m.takenLast30}/{m.expectedLast30 || "—"} doses
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={() => quickLog(m.id)}>
                Log now
              </Button>
              <Link
                href={`/medications/${m.id}/log`}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Log…
              </Link>
              <Link
                href={`/medications/${m.id}/edit`}
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Edit
              </Link>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
