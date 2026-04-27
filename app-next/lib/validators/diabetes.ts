import { z } from "zod";

export const glucoseContext = z.enum([
  "FASTING",
  "PRE_MEAL",
  "POST_MEAL",
  "BEDTIME",
  "RANDOM",
]);

export const diabetesLogInput = z.object({
  measuredAt: z.coerce.date(),
  glucoseMgDl: z.number().int().min(20).max(800),
  context: glucoseContext,
  carbsGrams: z.number().int().min(0).max(1000).nullish(),
  insulinUnits: z.number().min(0).max(500).nullish(),
  notes: z.string().max(2000).nullish(),
});

export const diabetesLogQuery = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  context: glucoseContext.optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type DiabetesLogInput = z.infer<typeof diabetesLogInput>;
export type DiabetesLogQuery = z.infer<typeof diabetesLogQuery>;
