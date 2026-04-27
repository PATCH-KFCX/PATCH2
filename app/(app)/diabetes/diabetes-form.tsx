"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { diabetesLogInput } from "@/lib/validators/diabetes";
import {
  CONTEXT_LABELS,
  CONTEXT_VALUES,
  type GlucoseContextValue,
} from "@/lib/diabetes/labels";

interface DiabetesFormValues {
  measuredAt: Date;
  glucoseMgDl: number;
  context: GlucoseContextValue;
  carbsGrams: number | null;
  insulinUnits: number | null;
  notes: string | null | undefined;
}

export interface DiabetesFormProps {
  mode: "create" | "edit";
  id?: string;
  defaultValues?: Partial<DiabetesFormValues>;
}

function toLocalInputValue(d: Date) {
  const tz = d.getTimezoneOffset();
  return new Date(d.getTime() - tz * 60_000).toISOString().slice(0, 16);
}

export function DiabetesForm({ mode, id, defaultValues }: DiabetesFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<DiabetesFormValues>({
    resolver: zodResolver(diabetesLogInput) as unknown as Resolver<DiabetesFormValues>,
    defaultValues: {
      measuredAt: defaultValues?.measuredAt ?? new Date(),
      glucoseMgDl: defaultValues?.glucoseMgDl ?? 100,
      context: defaultValues?.context ?? "FASTING",
      carbsGrams: defaultValues?.carbsGrams ?? null,
      insulinUnits: defaultValues?.insulinUnits ?? null,
      notes: defaultValues?.notes ?? "",
    },
  });

  async function onSubmit(values: DiabetesFormValues) {
    setServerError(null);
    const url = mode === "create" ? "/api/diabetes" : `/api/diabetes/${id}`;
    const method = mode === "create" ? "POST" : "PUT";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        measuredAt: values.measuredAt.toISOString(),
        notes: values.notes?.trim() ? values.notes.trim() : null,
        carbsGrams: values.carbsGrams === null ? null : Number(values.carbsGrams),
        insulinUnits:
          values.insulinUnits === null ? null : Number(values.insulinUnits),
      }),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setServerError(data.error ?? "Could not save the reading.");
      return;
    }
    toast.success(
      mode === "create" ? "Glucose reading saved." : "Reading updated.",
    );
    startTransition(() => {
      router.push("/diabetes");
      router.refresh();
    });
  }

  async function onDelete() {
    if (!id) return;
    if (!confirm("Delete this reading?")) return;
    const res = await fetch(`/api/diabetes/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Could not delete.");
      return;
    }
    toast.success("Reading deleted.");
    startTransition(() => {
      router.push("/diabetes");
      router.refresh();
    });
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="measuredAt">When</Label>
          <Controller
            name="measuredAt"
            control={control}
            render={({ field }) => (
              <Input
                id="measuredAt"
                type="datetime-local"
                value={field.value ? toLocalInputValue(field.value) : ""}
                onChange={(e) => field.onChange(new Date(e.target.value))}
              />
            )}
          />
          {errors.measuredAt && (
            <p className="text-xs text-destructive">{errors.measuredAt.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="context">Context</Label>
          <select
            id="context"
            className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
            {...register("context")}
          >
            {CONTEXT_VALUES.map((c) => (
              <option key={c} value={c}>
                {CONTEXT_LABELS[c]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="glucoseMgDl">Glucose (mg/dL)</Label>
          <Input
            id="glucoseMgDl"
            type="number"
            inputMode="numeric"
            min={20}
            max={800}
            {...register("glucoseMgDl", { valueAsNumber: true })}
            aria-invalid={!!errors.glucoseMgDl}
          />
          {errors.glucoseMgDl && (
            <p className="text-xs text-destructive">{errors.glucoseMgDl.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="carbsGrams">Carbs (g)</Label>
          <Input
            id="carbsGrams"
            type="number"
            inputMode="numeric"
            min={0}
            max={1000}
            placeholder="optional"
            {...register("carbsGrams", {
              setValueAs: (v) => (v === "" || v == null ? null : Number(v)),
            })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="insulinUnits">Insulin (u)</Label>
          <Input
            id="insulinUnits"
            type="number"
            inputMode="decimal"
            step="0.5"
            min={0}
            max={500}
            placeholder="optional"
            {...register("insulinUnits", {
              setValueAs: (v) => (v === "" || v == null ? null : Number(v)),
            })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          rows={3}
          placeholder="Anything else to flag for your doctor?"
          {...register("notes")}
        />
      </div>

      {serverError && (
        <Alert variant="destructive">
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between gap-2">
        <Button type="submit" disabled={isSubmitting || pending}>
          {isSubmitting || pending
            ? "Saving…"
            : mode === "create"
              ? "Save reading"
              : "Save changes"}
        </Button>
        {mode === "edit" && (
          <Button
            type="button"
            variant="destructive"
            onClick={onDelete}
            disabled={isSubmitting || pending}
          >
            Delete
          </Button>
        )}
      </div>
    </form>
  );
}
