import { z } from "zod";

export const symptomLogInput = z.object({
  occurredAt: z.coerce.date(),
  severity: z.number().int().min(1).max(10),
  notes: z.string().max(2000).nullish(),
  symptoms: z.array(z.string().min(1).max(80)).max(50).default([]),
  painTypes: z.array(z.string().min(1).max(80)).max(20).default([]),
  painLocations: z.array(z.string().min(1).max(80)).max(20).default([]),
});

export const symptomLogQuery = z.object({
  q: z.string().trim().max(200).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  minSeverity: z.coerce.number().int().min(1).max(10).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type SymptomLogInput = z.infer<typeof symptomLogInput>;
export type SymptomLogQuery = z.infer<typeof symptomLogQuery>;
