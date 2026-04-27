"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function nowLocalIso() {
  const d = new Date();
  const tz = d.getTimezoneOffset();
  return new Date(d.getTime() - tz * 60_000).toISOString().slice(0, 16);
}

export function LogDoseForm({ medicationId }: { medicationId: string }) {
  const router = useRouter();
  const [takenAt, setTakenAt] = useState(nowLocalIso);
  const [skipped, setSkipped] = useState(false);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [, startTransition] = useTransition();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await fetch(`/api/medications/${medicationId}/doses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        takenAt: new Date(takenAt).toISOString(),
        skipped,
        notes: notes.trim() ? notes.trim() : null,
      }),
    });
    setBusy(false);
    if (!res.ok) {
      toast.error("Could not log dose.");
      return;
    }
    toast.success(skipped ? "Marked as skipped." : "Dose logged.");
    setTakenAt(nowLocalIso());
    setSkipped(false);
    setNotes("");
    startTransition(() => router.refresh());
  }

  return (
    <form className="space-y-3" onSubmit={submit}>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="space-y-1.5">
          <Label htmlFor="takenAt" className="text-xs">When</Label>
          <Input
            id="takenAt"
            type="datetime-local"
            value={takenAt}
            onChange={(e) => setTakenAt(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setTakenAt(nowLocalIso())}
          >
            Now
          </Button>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="notes" className="text-xs">Notes (optional)</Label>
        <Textarea
          id="notes"
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Late, with food, etc."
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          id="skipped"
          type="checkbox"
          className="h-4 w-4 rounded border-input"
          checked={skipped}
          onChange={(e) => setSkipped(e.target.checked)}
        />
        <Label htmlFor="skipped" className="text-sm">
          Mark as skipped (not taken)
        </Label>
      </div>
      <Button type="submit" disabled={busy}>
        {busy ? "Saving…" : skipped ? "Log skip" : "Log dose"}
      </Button>
    </form>
  );
}
