"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChipMultiSelect } from "@/components/forms/chip-multiselect";
import { SeveritySlider } from "@/components/forms/severity-slider";
import { COMMON_SYMPTOMS } from "@/lib/symptoms/presets";
import {
  CONTEXT_LABELS,
  CONTEXT_VALUES,
  type GlucoseContextValue,
} from "@/lib/diabetes/labels";

export function QuickLogButtons() {
  return (
    <div className="flex flex-wrap gap-2">
      <QuickSymptomDialog />
      <QuickGlucoseDialog />
    </div>
  );
}

function QuickSymptomDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState(5);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [, startTransition] = useTransition();

  function reset() {
    setSeverity(5);
    setSymptoms([]);
    setNotes("");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await fetch("/api/symptoms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        occurredAt: new Date().toISOString(),
        severity,
        symptoms,
        painTypes: [],
        painLocations: [],
        notes: notes.trim() ? notes.trim() : null,
      }),
    });
    setBusy(false);
    if (!res.ok) {
      toast.error("Could not log symptom.");
      return;
    }
    toast.success("Symptom logged.");
    setOpen(false);
    reset();
    startTransition(() => router.refresh());
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" />}>
        + Log symptom
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log a symptom</DialogTitle>
          <DialogDescription>Quick entry — full form is at /symptoms/new.</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={submit}>
          <SeveritySlider value={severity} onChange={setSeverity} />
          <ChipMultiSelect
            label="What's happening"
            suggestions={COMMON_SYMPTOMS}
            value={symptoms}
            onChange={setSymptoms}
          />
          <div className="space-y-2">
            <Label htmlFor="qs-notes">Notes</Label>
            <Textarea
              id="qs-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Saving…" : "Log now"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function QuickGlucoseDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [glucose, setGlucose] = useState<number>(100);
  const [context, setContext] = useState<GlucoseContextValue>("FASTING");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [, startTransition] = useTransition();

  function reset() {
    setGlucose(100);
    setContext("FASTING");
    setNotes("");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await fetch("/api/diabetes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        measuredAt: new Date().toISOString(),
        glucoseMgDl: glucose,
        context,
        notes: notes.trim() ? notes.trim() : null,
      }),
    });
    setBusy(false);
    if (!res.ok) {
      toast.error("Could not log reading.");
      return;
    }
    toast.success("Reading logged.");
    setOpen(false);
    reset();
    startTransition(() => router.refresh());
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" />}>
        + Log glucose
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log a glucose reading</DialogTitle>
          <DialogDescription>Quick entry — full form is at /diabetes/new.</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={submit}>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="qg-glucose">Glucose (mg/dL)</Label>
              <Input
                id="qg-glucose"
                type="number"
                inputMode="numeric"
                min={20}
                max={800}
                value={glucose}
                onChange={(e) => setGlucose(Number(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qg-context">Context</Label>
              <select
                id="qg-context"
                className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                value={context}
                onChange={(e) =>
                  setContext(e.target.value as GlucoseContextValue)
                }
              >
                {CONTEXT_VALUES.map((c) => (
                  <option key={c} value={c}>
                    {CONTEXT_LABELS[c]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="qg-notes">Notes</Label>
            <Textarea
              id="qg-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Saving…" : "Log now"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
