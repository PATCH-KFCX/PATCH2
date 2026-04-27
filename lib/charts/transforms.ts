// Pure helpers used by server components to shape DB rows into chart data.
// Lives outside the chart component files (which are "use client") so server
// pages can import them without crossing the client/server boundary.

import type { GlucoseContextValue } from "@/lib/diabetes/labels";

export interface SeverityPoint {
  occurredAt: string;
  severity: number;
}

export function pointsFromLogs(
  logs: Array<{ occurredAt: string | Date; severity: number }>,
): SeverityPoint[] {
  return logs.map((l) => ({
    occurredAt:
      typeof l.occurredAt === "string"
        ? l.occurredAt
        : l.occurredAt.toISOString(),
    severity: l.severity,
  }));
}

export interface GlucosePoint {
  measuredAt: string;
  glucoseMgDl: number;
  context: GlucoseContextValue;
}

export function pointsFromDiabetesLogs(
  logs: Array<{
    measuredAt: Date | string;
    glucoseMgDl: number;
    context: GlucoseContextValue;
  }>,
): GlucosePoint[] {
  return logs.map((l) => ({
    measuredAt:
      typeof l.measuredAt === "string"
        ? l.measuredAt
        : l.measuredAt.toISOString(),
    glucoseMgDl: l.glucoseMgDl,
    context: l.context,
  }));
}
