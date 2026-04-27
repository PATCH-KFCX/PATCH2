// Adherence computation. A medication has zero or more schedules
// (timesOfDay × daysOfWeek). For a window, expected = sum over schedules of
// (days in window matching daysOfWeek, capped to schedule.startsOn..endsOn) ×
// |timesOfDay|. Taken = MedicationDose rows where takenAt is in window and
// skipped = false.

export interface ScheduleLike {
  timesOfDay: string[];
  daysOfWeek: number[]; // empty = daily
  startsOn: Date | string;
  endsOn: Date | string | null | undefined;
}

export interface DoseLike {
  takenAt: Date | string;
  skipped: boolean;
}

export interface AdherenceResult {
  expected: number;
  taken: number;
  skipped: number;
  pct: number | null; // null when expected = 0
}

function asDate(v: Date | string): Date {
  return v instanceof Date ? v : new Date(v);
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

function diffDaysInclusive(from: Date, to: Date): number {
  const a = startOfDay(from).getTime();
  const b = startOfDay(to).getTime();
  if (b < a) return 0;
  return Math.floor((b - a) / 86_400_000) + 1;
}

export function expectedDosesIn(
  schedule: ScheduleLike,
  windowFrom: Date,
  windowTo: Date,
): number {
  const startsOn = asDate(schedule.startsOn);
  const endsOn = schedule.endsOn ? asDate(schedule.endsOn) : null;
  const from = startOfDay(windowFrom > startsOn ? windowFrom : startsOn);
  const to = startOfDay(
    endsOn && endsOn < windowTo ? endsOn : windowTo,
  );
  if (to < from) return 0;

  const dayCount = diffDaysInclusive(from, to);
  const timesPerDay = schedule.timesOfDay.length;

  if (schedule.daysOfWeek.length === 0) {
    return dayCount * timesPerDay;
  }

  const allowedDays = new Set(schedule.daysOfWeek);
  let matchingDays = 0;
  for (let i = 0; i < dayCount; i++) {
    const d = new Date(from);
    d.setDate(d.getDate() + i);
    if (allowedDays.has(d.getDay())) matchingDays++;
  }
  return matchingDays * timesPerDay;
}

export function adherenceFor(
  schedules: ScheduleLike[],
  doses: DoseLike[],
  windowFrom: Date,
  windowTo: Date,
): AdherenceResult {
  const winStart = startOfDay(windowFrom);
  const winEnd = endOfDay(windowTo);
  const expected = schedules.reduce(
    (sum, s) => sum + expectedDosesIn(s, windowFrom, windowTo),
    0,
  );
  let taken = 0;
  let skipped = 0;
  for (const d of doses) {
    const t = asDate(d.takenAt);
    if (t < winStart || t > winEnd) continue;
    if (d.skipped) skipped++;
    else taken++;
  }
  const pct =
    expected === 0 ? null : Math.min(100, Math.round((taken / expected) * 100));
  return { expected, taken, skipped, pct };
}

export function summarizeSchedule(s: ScheduleLike): string {
  const days =
    s.daysOfWeek.length === 0 || s.daysOfWeek.length === 7
      ? "every day"
      : s.daysOfWeek
          .slice()
          .sort((a, b) => a - b)
          .map((d) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d])
          .join(", ");
  const times = s.timesOfDay.length === 0 ? "—" : s.timesOfDay.join(", ");
  return `${times} · ${days}`;
}
