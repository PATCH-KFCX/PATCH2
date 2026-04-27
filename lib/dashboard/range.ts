export type RangePreset = "7d" | "30d" | "90d" | "custom";

export interface DashboardRange {
  preset: RangePreset;
  from: Date;
  to: Date;
  days: number;
}

const DAY_MS = 86_400_000;

export function parseRange(
  sp: Record<string, string | string[] | undefined>,
): DashboardRange {
  const flatten = (k: string) => {
    const v = sp[k];
    return typeof v === "string" ? v : Array.isArray(v) ? v[0] : undefined;
  };
  const range = flatten("range");
  const fromStr = flatten("from");
  const toStr = flatten("to");

  const now = new Date();

  if (range === "custom" || fromStr || toStr) {
    const from = fromStr ? new Date(fromStr) : new Date(now.getTime() - 30 * DAY_MS);
    const to = toStr ? new Date(toStr) : now;
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
      return defaultRange(now);
    }
    return {
      preset: "custom",
      from,
      to,
      days: Math.max(1, Math.round((to.getTime() - from.getTime()) / DAY_MS)),
    };
  }

  if (range === "7d") return presetRange("7d", 7, now);
  if (range === "90d") return presetRange("90d", 90, now);
  return presetRange("30d", 30, now);
}

function presetRange(preset: RangePreset, days: number, now: Date): DashboardRange {
  return {
    preset,
    from: new Date(now.getTime() - days * DAY_MS),
    to: now,
    days,
  };
}

function defaultRange(now: Date): DashboardRange {
  return presetRange("30d", 30, now);
}
