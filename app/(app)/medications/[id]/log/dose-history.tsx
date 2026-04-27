"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface DoseRow {
  id: string;
  takenAt: string;
  skipped: boolean;
  notes: string | null;
  takenAtLabel: string;
}

export function DoseHistory({
  medicationId,
  doses,
}: {
  medicationId: string;
  doses: DoseRow[];
}) {
  const router = useRouter();
  const [removing, setRemoving] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function remove(doseId: string) {
    if (!confirm("Remove this dose entry?")) return;
    setRemoving(doseId);
    const res = await fetch(
      `/api/medications/${medicationId}/doses/${doseId}`,
      { method: "DELETE" },
    );
    setRemoving(null);
    if (!res.ok) {
      toast.error("Could not remove.");
      return;
    }
    toast.success("Removed.");
    startTransition(() => router.refresh());
  }

  return (
    <ul className="divide-y">
      {doses.map((d) => (
        <li key={d.id} className="flex items-center gap-3 py-2.5">
          <Badge variant={d.skipped ? "outline" : "secondary"}>
            {d.skipped ? "Skipped" : "Taken"}
          </Badge>
          <span className="text-sm">{d.takenAtLabel}</span>
          {d.notes && (
            <span className="text-xs text-muted-foreground truncate">
              {d.notes}
            </span>
          )}
          <button
            type="button"
            onClick={() => remove(d.id)}
            disabled={removing === d.id}
            className="ml-auto text-xs text-muted-foreground hover:text-destructive disabled:opacity-50"
            aria-label="Remove dose"
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  );
}
