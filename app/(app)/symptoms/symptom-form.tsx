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
import { ChipMultiSelect } from "@/components/forms/chip-multiselect";
import { SeveritySlider } from "@/components/forms/severity-slider";
import { symptomLogInput } from "@/lib/validators/symptom";
import {
  COMMON_PAIN_LOCATIONS,
  COMMON_PAIN_TYPES,
  COMMON_SYMPTOMS,
} from "@/lib/symptoms/presets";

interface SymptomFormValues {
  occurredAt: Date;
  severity: number;
  notes: string | null | undefined;
  symptoms: string[];
  painTypes: string[];
  painLocations: string[];
}

export interface SymptomFormProps {
  mode: "create" | "edit";
  id?: string;
  defaultValues?: Partial<SymptomFormValues>;
}

function toLocalInputValue(d: Date) {
  const tz = d.getTimezoneOffset();
  return new Date(d.getTime() - tz * 60_000).toISOString().slice(0, 16);
}

export function SymptomForm({ mode, id, defaultValues }: SymptomFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SymptomFormValues>({
    resolver: zodResolver(symptomLogInput) as unknown as Resolver<SymptomFormValues>,
    defaultValues: {
      occurredAt: defaultValues?.occurredAt ?? new Date(),
      severity: defaultValues?.severity ?? 5,
      notes: defaultValues?.notes ?? "",
      symptoms: defaultValues?.symptoms ?? [],
      painTypes: defaultValues?.painTypes ?? [],
      painLocations: defaultValues?.painLocations ?? [],
    },
  });

  async function onSubmit(values: SymptomFormValues) {
    setServerError(null);
    const url =
      mode === "create" ? "/api/symptoms" : `/api/symptoms/${id}`;
    const method = mode === "create" ? "POST" : "PUT";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        occurredAt: values.occurredAt.toISOString(),
        notes: values.notes?.trim() ? values.notes.trim() : null,
      }),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setServerError(data.error ?? "Could not save the entry.");
      return;
    }
    toast.success(mode === "create" ? "Symptom logged." : "Entry updated.");
    startTransition(() => {
      router.push("/symptoms");
      router.refresh();
    });
  }

  async function onDelete() {
    if (!id) return;
    if (!confirm("Delete this entry?")) return;
    const res = await fetch(`/api/symptoms/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Could not delete.");
      return;
    }
    toast.success("Entry deleted.");
    startTransition(() => {
      router.push("/symptoms");
      router.refresh();
    });
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="occurredAt">When</Label>
          <Controller
            name="occurredAt"
            control={control}
            render={({ field }) => (
              <Input
                id="occurredAt"
                type="datetime-local"
                value={field.value ? toLocalInputValue(field.value) : ""}
                onChange={(e) => field.onChange(new Date(e.target.value))}
              />
            )}
          />
          {errors.occurredAt && (
            <p className="text-xs text-destructive">
              {errors.occurredAt.message}
            </p>
          )}
        </div>

        <Controller
          name="severity"
          control={control}
          render={({ field }) => (
            <SeveritySlider value={field.value} onChange={field.onChange} />
          )}
        />
      </div>

      <Controller
        name="symptoms"
        control={control}
        render={({ field }) => (
          <ChipMultiSelect
            label="Symptoms"
            description="Tap a suggestion or type your own and press Enter."
            suggestions={COMMON_SYMPTOMS}
            value={field.value ?? []}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        name="painTypes"
        control={control}
        render={({ field }) => (
          <ChipMultiSelect
            label="Pain types"
            suggestions={COMMON_PAIN_TYPES}
            value={field.value ?? []}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        name="painLocations"
        control={control}
        render={({ field }) => (
          <ChipMultiSelect
            label="Pain locations"
            suggestions={COMMON_PAIN_LOCATIONS}
            value={field.value ?? []}
            onChange={field.onChange}
          />
        )}
      />

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          rows={4}
          placeholder="Anything else worth remembering for your doctor?"
          {...register("notes")}
        />
        {errors.notes && (
          <p className="text-xs text-destructive">{errors.notes.message}</p>
        )}
      </div>

      {serverError && (
        <Alert variant="destructive">
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between gap-2">
        <Button
          type="submit"
          disabled={isSubmitting || pending}
        >
          {isSubmitting || pending
            ? "Saving…"
            : mode === "create"
              ? "Save entry"
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
