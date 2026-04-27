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
import { medicationInput } from "@/lib/validators/medication";
import {
  ScheduleEditor,
  type ScheduleValue,
} from "@/components/forms/schedule-editor";

interface MedicationFormValues {
  name: string;
  dosage: string;
  form: string | null;
  active: boolean;
  notes: string | null | undefined;
  schedules: ScheduleValue[];
}

export interface MedicationFormProps {
  mode: "create" | "edit";
  id?: string;
  defaultValues?: Partial<MedicationFormValues>;
}

function defaultSchedule(): ScheduleValue {
  return {
    timesOfDay: ["08:00"],
    daysOfWeek: [],
    startsOn: new Date(new Date().setHours(0, 0, 0, 0)),
    endsOn: null,
  };
}

export function MedicationForm({ mode, id, defaultValues }: MedicationFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<MedicationFormValues>({
    resolver: zodResolver(medicationInput) as unknown as Resolver<MedicationFormValues>,
    defaultValues: {
      name: defaultValues?.name ?? "",
      dosage: defaultValues?.dosage ?? "",
      form: defaultValues?.form ?? null,
      active: defaultValues?.active ?? true,
      notes: defaultValues?.notes ?? "",
      schedules:
        defaultValues?.schedules && defaultValues.schedules.length > 0
          ? defaultValues.schedules
          : [defaultSchedule()],
    },
  });

  async function onSubmit(values: MedicationFormValues) {
    setServerError(null);
    const url = mode === "create" ? "/api/medications" : `/api/medications/${id}`;
    const method = mode === "create" ? "POST" : "PUT";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        notes: values.notes?.trim() ? values.notes.trim() : null,
        form: values.form?.trim() ? values.form.trim() : null,
        schedules: values.schedules.map((s) => ({
          ...s,
          startsOn: s.startsOn.toISOString(),
          endsOn: s.endsOn ? s.endsOn.toISOString() : null,
        })),
      }),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setServerError(data.error ?? "Could not save the medication.");
      return;
    }
    toast.success(
      mode === "create" ? "Medication added." : "Medication updated.",
    );
    startTransition(() => {
      router.push("/medications");
      router.refresh();
    });
  }

  async function onDelete() {
    if (!id) return;
    if (
      !confirm(
        "Delete this medication and all dose history? This cannot be undone.",
      )
    )
      return;
    const res = await fetch(`/api/medications/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Could not delete.");
      return;
    }
    toast.success("Medication deleted.");
    startTransition(() => {
      router.push("/medications");
      router.refresh();
    });
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="e.g. Metformin"
            {...register("name")}
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="dosage">Dosage</Label>
          <Input
            id="dosage"
            placeholder="e.g. 500 mg"
            {...register("dosage")}
            aria-invalid={!!errors.dosage}
          />
          {errors.dosage && (
            <p className="text-xs text-destructive">{errors.dosage.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="form">Form</Label>
          <Input
            id="form"
            placeholder="tablet, capsule, injection…"
            {...register("form")}
          />
        </div>
        <div className="flex items-center gap-2 pt-6">
          <input
            id="active"
            type="checkbox"
            className="h-4 w-4 rounded border-input"
            {...register("active")}
          />
          <Label htmlFor="active" className="text-sm">
            Active (counts toward adherence)
          </Label>
        </div>
      </div>

      <Controller
        name="schedules"
        control={control}
        render={({ field }) => (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Schedules</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => field.onChange([...field.value, defaultSchedule()])}
                disabled={field.value.length >= 8}
              >
                + Add schedule
              </Button>
            </div>
            {field.value.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No schedule — adherence won&apos;t be tracked. Add at least one
                if you want reminders.
              </p>
            )}
            {field.value.map((s, idx) => (
              <ScheduleEditor
                key={idx}
                index={idx}
                value={s}
                removable={field.value.length > 1}
                onChange={(next) => {
                  const arr = [...field.value];
                  arr[idx] = next;
                  field.onChange(arr);
                }}
                onRemove={() =>
                  field.onChange(field.value.filter((_, i) => i !== idx))
                }
              />
            ))}
          </div>
        )}
      />

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          rows={3}
          placeholder="Why prescribed, special instructions…"
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
              ? "Add medication"
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
