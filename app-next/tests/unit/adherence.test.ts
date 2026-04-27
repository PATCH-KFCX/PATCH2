import { describe, expect, it } from "vitest";
import {
  adherenceFor,
  expectedDosesIn,
  summarizeSchedule,
} from "@/lib/medications/adherence";

// Always parse as local time so windowFrom/windowTo and takenAt are in the
// same frame (Date("2026-04-01") would otherwise be UTC midnight = previous
// evening in west-of-UTC zones, which throws off boundary tests).
const D = (s: string) => new Date(s.includes("T") ? s : `${s}T00:00:00`);

describe("expectedDosesIn", () => {
  it("daily schedule, 1 time, 7-day window = 7", () => {
    const s = {
      timesOfDay: ["08:00"],
      daysOfWeek: [],
      startsOn: D("2026-01-01"),
      endsOn: null,
    };
    expect(expectedDosesIn(s, D("2026-04-01"), D("2026-04-07"))).toBe(7);
  });

  it("twice-daily schedule, 7-day window = 14", () => {
    const s = {
      timesOfDay: ["08:00", "20:00"],
      daysOfWeek: [],
      startsOn: D("2026-01-01"),
      endsOn: null,
    };
    expect(expectedDosesIn(s, D("2026-04-01"), D("2026-04-07"))).toBe(14);
  });

  it("weekday-only (Mon-Fri), 7-day window starting Sunday = 5", () => {
    const s = {
      timesOfDay: ["08:00"],
      daysOfWeek: [1, 2, 3, 4, 5],
      startsOn: D("2026-01-01"),
      endsOn: null,
    };
    // 2026-04-26 is a Sunday
    expect(expectedDosesIn(s, D("2026-04-26"), D("2026-05-02"))).toBe(5);
  });

  it("startsOn after window start clips correctly", () => {
    const s = {
      timesOfDay: ["08:00"],
      daysOfWeek: [],
      startsOn: D("2026-04-04"),
      endsOn: null,
    };
    // window 04-01..04-07, schedule starts 04-04 → 4 days × 1 = 4
    expect(expectedDosesIn(s, D("2026-04-01"), D("2026-04-07"))).toBe(4);
  });

  it("endsOn before window end clips correctly", () => {
    const s = {
      timesOfDay: ["08:00"],
      daysOfWeek: [],
      startsOn: D("2026-01-01"),
      endsOn: D("2026-04-03"),
    };
    // window 04-01..04-07, schedule ends 04-03 → 3 days
    expect(expectedDosesIn(s, D("2026-04-01"), D("2026-04-07"))).toBe(3);
  });

  it("returns 0 if window ends before schedule starts", () => {
    const s = {
      timesOfDay: ["08:00"],
      daysOfWeek: [],
      startsOn: D("2026-06-01"),
      endsOn: null,
    };
    expect(expectedDosesIn(s, D("2026-04-01"), D("2026-04-07"))).toBe(0);
  });
});

describe("adherenceFor", () => {
  const dailySchedule = {
    timesOfDay: ["08:00"],
    daysOfWeek: [],
    startsOn: D("2026-04-01"),
    endsOn: null,
  };

  it("100% when every expected dose is taken", () => {
    const doses = Array.from({ length: 7 }).map((_, i) => ({
      takenAt: D(`2026-04-0${i + 1}T08:30:00`),
      skipped: false,
    }));
    const adh = adherenceFor(
      [dailySchedule],
      doses,
      D("2026-04-01"),
      D("2026-04-07"),
    );
    expect(adh.expected).toBe(7);
    expect(adh.taken).toBe(7);
    expect(adh.skipped).toBe(0);
    expect(adh.pct).toBe(100);
  });

  it("skipped doses don't count toward taken", () => {
    const doses = [
      { takenAt: D("2026-04-01T08:30"), skipped: false },
      { takenAt: D("2026-04-02T08:30"), skipped: true },
      { takenAt: D("2026-04-03T08:30"), skipped: false },
    ];
    const adh = adherenceFor(
      [dailySchedule],
      doses,
      D("2026-04-01"),
      D("2026-04-07"),
    );
    expect(adh.expected).toBe(7);
    expect(adh.taken).toBe(2);
    expect(adh.skipped).toBe(1);
    expect(adh.pct).toBe(29); // 2/7 = 28.57 → 29
  });

  it("doses outside the window are ignored", () => {
    const doses = [
      { takenAt: D("2026-03-30T08:30"), skipped: false },
      { takenAt: D("2026-04-08T08:30"), skipped: false },
    ];
    const adh = adherenceFor(
      [dailySchedule],
      doses,
      D("2026-04-01"),
      D("2026-04-07"),
    );
    expect(adh.taken).toBe(0);
  });

  it("no schedules → expected 0, pct null", () => {
    const adh = adherenceFor(
      [],
      [{ takenAt: D("2026-04-01T08:30"), skipped: false }],
      D("2026-04-01"),
      D("2026-04-07"),
    );
    expect(adh.expected).toBe(0);
    expect(adh.pct).toBeNull();
  });

  it("over-100% caps at 100", () => {
    const doses = Array.from({ length: 14 }).map((_, i) => ({
      takenAt: D(
        `2026-04-0${(i % 7) + 1}T${i < 7 ? "08" : "20"}:00:00`,
      ),
      skipped: false,
    }));
    const adh = adherenceFor(
      [dailySchedule],
      doses,
      D("2026-04-01"),
      D("2026-04-07"),
    );
    expect(adh.taken).toBe(14);
    expect(adh.expected).toBe(7);
    expect(adh.pct).toBe(100);
  });
});

describe("summarizeSchedule", () => {
  it("daily schedule reads as 'every day'", () => {
    expect(
      summarizeSchedule({
        timesOfDay: ["08:00", "20:00"],
        daysOfWeek: [],
        startsOn: D("2026-04-01"),
        endsOn: null,
      }),
    ).toBe("08:00, 20:00 · every day");
  });

  it("weekday subset is summarized", () => {
    expect(
      summarizeSchedule({
        timesOfDay: ["09:00"],
        daysOfWeek: [1, 3, 5],
        startsOn: D("2026-04-01"),
        endsOn: null,
      }),
    ).toBe("09:00 · Mon, Wed, Fri");
  });
});
