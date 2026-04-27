"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";

export interface TodayMedRow {
  id: string;
  name: string;
  dosage: string;
  scheduleSummary: string;
  takenToday: number;
  expectedToday: number;
}

export function TodayMeds({ items }: { items: TodayMedRow[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  async function logNow(id: string) {
    const res = await fetch(`/api/medications/${id}/doses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        takenAt: new Date().toISOString(),
        skipped: false,
      }),
    });
    if (!res.ok) {
      toast.error("Could not log dose.");
      return;
    }
    toast.success("Dose logged.");
    startTransition(() => router.refresh());
  }

  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No active medications scheduled today.{" "}
        <Link href="/medications/new" className="underline underline-offset-4">
          Add one
        </Link>
        .
      </p>
    );
  }

  return (
    <ul className="divide-y">
      {items.map((m) => {
        const done = m.expectedToday > 0 && m.takenToday >= m.expectedToday;
        return (
          <li key={m.id} className="flex items-center gap-3 py-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Link
                  href={`/medications/${m.id}/log`}
                  className="text-sm font-medium hover:underline"
                >
                  {m.name}
                </Link>
                <span className="text-xs text-muted-foreground">{m.dosage}</span>
                {done && <Badge variant="secondary">Done</Badge>}
              </div>
              <p className="text-xs text-muted-foreground">
                {m.scheduleSummary} ·{" "}
                <span
                  className={
                    done
                      ? "text-emerald-600 dark:text-emerald-400"
                      : m.takenToday > 0
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-muted-foreground"
                  }
                >
                  {m.takenToday}/{m.expectedToday || "—"} today
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={done ? "ghost" : "default"}
                onClick={() => logNow(m.id)}
              >
                {done ? "Log extra" : "Log dose"}
              </Button>
              <Link
                href={`/medications/${m.id}/log`}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Log…
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
