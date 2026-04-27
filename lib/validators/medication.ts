import { z } from "zod";

const timeOfDay = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "expected HH:mm");

export const medicationScheduleInput = z.object({
  timesOfDay: z.array(timeOfDay).min(1).max(12),
  daysOfWeek: z.array(z.number().int().min(0).max(6)).max(7).default([]),
  startsOn: z.coerce.date(),
  endsOn: z.coerce.date().nullish(),
});

export const medicationInput = z.object({
  name: z.string().min(1).max(120),
  dosage: z.string().min(1).max(60),
  form: z.string().max(60).nullish(),
  active: z.boolean().default(true),
  notes: z.string().max(2000).nullish(),
  schedules: z.array(medicationScheduleInput).max(8).default([]),
});

export const medicationDoseInput = z.object({
  takenAt: z.coerce.date(),
  skipped: z.boolean().default(false),
  notes: z.string().max(500).nullish(),
});

export type MedicationInput = z.infer<typeof medicationInput>;
export type MedicationScheduleInput = z.infer<typeof medicationScheduleInput>;
export type MedicationDoseInput = z.infer<typeof medicationDoseInput>;
