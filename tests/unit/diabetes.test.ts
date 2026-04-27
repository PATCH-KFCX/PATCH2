import { describe, expect, it } from "vitest";
import {
  diabetesLogInput,
  diabetesLogQuery,
} from "@/lib/validators/diabetes";
import { diabetesStats } from "@/lib/diabetes/a1c";

describe("diabetesLogInput", () => {
  it("accepts a valid fasting reading", () => {
    const r = diabetesLogInput.safeParse({
      measuredAt: "2026-04-01T08:00:00Z",
      glucoseMgDl: 95,
      context: "FASTING",
    });
    expect(r.success).toBe(true);
  });

  it("rejects glucose < 20 or > 800", () => {
    expect(
      diabetesLogInput.safeParse({
        measuredAt: new Date(),
        glucoseMgDl: 10,
        context: "FASTING",
      }).success,
    ).toBe(false);
    expect(
      diabetesLogInput.safeParse({
        measuredAt: new Date(),
        glucoseMgDl: 900,
        context: "FASTING",
      }).success,
    ).toBe(false);
  });

  it("rejects unknown context value", () => {
    const r = diabetesLogInput.safeParse({
      measuredAt: new Date(),
      glucoseMgDl: 100,
      context: "AFTER_LUNCH",
    });
    expect(r.success).toBe(false);
  });
});

describe("diabetesLogQuery", () => {
  it("coerces and applies defaults", () => {
    const r = diabetesLogQuery.safeParse({
      from: "2026-01-01",
      context: "POST_MEAL",
      page: "3",
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.context).toBe("POST_MEAL");
      expect(r.data.page).toBe(3);
      expect(r.data.pageSize).toBe(20);
    }
  });
});

describe("diabetesStats", () => {
  it("returns nulls for empty readings", () => {
    const s = diabetesStats([]);
    expect(s.count).toBe(0);
    expect(s.averageMgDl).toBeNull();
    expect(s.estA1c).toBeNull();
    expect(s.inRangePct).toBeNull();
  });

  it("computes average + A1c via ADA formula", () => {
    // Average = 154 → A1c = (154 + 46.7) / 28.7 ≈ 6.99 → rounds to 7.0
    const s = diabetesStats([
      { glucoseMgDl: 100 },
      { glucoseMgDl: 150 },
      { glucoseMgDl: 212 },
    ]);
    expect(s.count).toBe(3);
    expect(s.averageMgDl).toBe(154);
    expect(s.estA1c).toBe(7.0);
  });

  it("computes time-in-range percentage", () => {
    // 3 of 4 in default 70-180 range
    const s = diabetesStats([
      { glucoseMgDl: 90 },
      { glucoseMgDl: 110 },
      { glucoseMgDl: 200 },
      { glucoseMgDl: 130 },
    ]);
    expect(s.inRangePct).toBe(75);
  });

  it("respects custom range", () => {
    const s = diabetesStats(
      [{ glucoseMgDl: 80 }, { glucoseMgDl: 130 }, { glucoseMgDl: 250 }],
      { low: 100, high: 200 },
    );
    expect(s.inRangePct).toBe(33); // only 130 in range; 1/3 = 33%
  });
});
