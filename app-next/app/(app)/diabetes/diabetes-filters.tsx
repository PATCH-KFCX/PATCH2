"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CONTEXT_LABELS,
  CONTEXT_VALUES,
} from "@/lib/diabetes/labels";

export function DiabetesFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  function commit(next: URLSearchParams) {
    next.delete("page");
    const qs = next.toString();
    startTransition(() => {
      router.push(qs ? `/diabetes?${qs}` : "/diabetes");
    });
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const next = new URLSearchParams();
    for (const key of ["from", "to", "context"] as const) {
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
      className="grid gap-3 sm:grid-cols-[140px_140px_1fr_auto] items-end"
    >
      <div className="space-y-1.5">
        <Label htmlFor="from" className="text-xs">From</Label>
        <Input
          id="from"
          name="from"
          type="date"
          defaultValue={params.get("from") ?? ""}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="to" className="text-xs">To</Label>
        <Input
          id="to"
          name="to"
          type="date"
          defaultValue={params.get("to") ?? ""}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="context" className="text-xs">Context</Label>
        <select
          id="context"
          name="context"
          className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
          defaultValue={params.get("context") ?? ""}
        >
          <option value="">All</option>
          {CONTEXT_VALUES.map((c) => (
            <option key={c} value={c}>
              {CONTEXT_LABELS[c]}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={pending}>Apply</Button>
        <Button type="button" size="sm" variant="ghost" onClick={clear} disabled={pending}>
          Clear
        </Button>
      </div>
    </form>
  );
}
