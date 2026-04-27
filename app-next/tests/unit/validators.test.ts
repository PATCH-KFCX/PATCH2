import { describe, expect, it } from "vitest";
import { symptomLogInput } from "@/lib/validators/symptom";
import { diabetesLogInput } from "@/lib/validators/diabetes";
import { medicationInput } from "@/lib/validators/medication";
import { signupInput } from "@/lib/validators/user";

describe("validators", () => {
  it("symptomLogInput accepts a minimal valid payload", () => {
    const r = symptomLogInput.safeParse({
      occurredAt: "2026-04-01T08:00:00Z",
      severity: 6,
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.symptoms).toEqual([]);
      expect(r.data.painTypes).toEqual([]);
    }
  });

  it("symptomLogInput rejects severity out of range", () => {
    const r = symptomLogInput.safeParse({
      occurredAt: new Date(),
      severity: 11,
    });
    expect(r.success).toBe(false);
  });

  it("diabetesLogInput requires a valid context enum", () => {
    const ok = diabetesLogInput.safeParse({
      measuredAt: new Date(),
      glucoseMgDl: 110,
      context: "FASTING",
    });
    expect(ok.success).toBe(true);

    const bad = diabetesLogInput.safeParse({
      measuredAt: new Date(),
      glucoseMgDl: 110,
      context: "AFTER_LUNCH",
    });
    expect(bad.success).toBe(false);
  });

  it("medicationInput rejects invalid time-of-day strings", () => {
    const r = medicationInput.safeParse({
      name: "Metformin",
      dosage: "500 mg",
      schedules: [
        {
          timesOfDay: ["8am"],
          startsOn: new Date(),
        },
      ],
    });
    expect(r.success).toBe(false);
  });

  it("signupInput requires 8+ char password", () => {
    const ok = signupInput.safeParse({
      email: "a@b.com",
      password: "longenough1",
    });
    expect(ok.success).toBe(true);

    const bad = signupInput.safeParse({
      email: "a@b.com",
      password: "short",
    });
    expect(bad.success).toBe(false);
  });
});
