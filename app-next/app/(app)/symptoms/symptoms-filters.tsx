"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SymptomsFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  function commit(next: URLSearchParams) {
    next.delete("page"); // reset pagination on filter change
    const qs = next.toString();
    startTransition(() => {
      router.push(qs ? `/symptoms?${qs}` : "/symptoms");
    });
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const next = new URLSearchParams();
    for (const key of ["q", "from", "to", "minSeverity"] as const) {
      const v = fd.get(key);
      if (typeof v === "string" && v.trim()) next.set(key, v.trim());
    }
    commit(next);
  }

  function clear() {
    commit(new URLSearchParams());
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-3 sm:grid-cols-[1fr_140px_140px_120px_auto] items-end"
    >
      <div className="space-y-1.5">
        <Label htmlFor="q" className="text-xs">
          Search
        </Label>
        <Input
          id="q"
          name="q"
          placeholder="Notes, symptom, location…"
          defaultValue={params.get("q") ?? ""}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="from" className="text-xs">
          From
        </Label>
        <Input
          id="from"
          name="from"
          type="date"
          defaultValue={params.get("from") ?? ""}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="to" className="text-xs">
          To
        </Label>
        <Input
          id="to"
          name="to"
          type="date"
          defaultValue={params.get("to") ?? ""}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="minSeverity" className="text-xs">
          Min severity
        </Label>
        <Input
          id="minSeverity"
          name="minSeverity"
          type="number"
          min={1}
          max={10}
          placeholder="1–10"
          defaultValue={params.get("minSeverity") ?? ""}
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={pending}>
          Apply
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={clear}
          disabled={pending}
        >
          Clear
        </Button>
      </div>
    </form>
  );
}
