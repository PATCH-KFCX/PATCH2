"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const PRESETS = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
] as const;

export function DashboardFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const current = params.get("range") ?? (params.get("from") || params.get("to") ? "custom" : "30d");

  function setRange(v: string) {
    const next = new URLSearchParams(params.toString());
    if (v === "30d") next.delete("range");
    else next.set("range", v);
    next.delete("from");
    next.delete("to");
    const qs = next.toString();
    startTransition(() => {
      router.push(qs ? `/dashboard?${qs}` : "/dashboard");
    });
  }

  return (
    <div className="inline-flex items-center rounded-md border bg-background p-1 text-sm">
      {PRESETS.map((p) => (
        <button
          key={p.value}
          type="button"
          onClick={() => setRange(p.value)}
          disabled={pending}
          className={cn(
            "px-3 py-1 rounded-sm transition-colors",
            current === p.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted",
          )}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
