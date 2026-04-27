import { describe, expect, it } from "vitest";
import {
  symptomLogInput,
  symptomLogQuery,
} from "@/lib/validators/symptom";

describe("symptomLogInput", () => {
  it("accepts a full payload", () => {
    const r = symptomLogInput.safeParse({
      occurredAt: "2026-04-01T08:00:00Z",
      severity: 7,
      notes: "Headache after running",
      symptoms: ["Headache", "Nausea"],
      painTypes: ["Throbbing"],
      painLocations: ["Head"],
    });
    expect(r.success).toBe(true);
  });

  it("rejects empty symptom strings", () => {
    const r = symptomLogInput.safeParse({
      occurredAt: new Date(),
      severity: 5,
      symptoms: [""],
    });
    expect(r.success).toBe(false);
  });

  it("rejects severity 0 and 11", () => {
    expect(
      symptomLogInput.safeParse({ occurredAt: new Date(), severity: 0 }).success,
    ).toBe(false);
    expect(
      symptomLogInput.safeParse({ occurredAt: new Date(), severity: 11 }).success,
    ).toBe(false);
  });
});

describe("symptomLogQuery", () => {
  it("coerces strings to numbers/dates and applies defaults", () => {
    const r = symptomLogQuery.safeParse({
      from: "2026-01-01",
      to: "2026-02-01",
      minSeverity: "7",
      page: "2",
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.minSeverity).toBe(7);
      expect(r.data.page).toBe(2);
      expect(r.data.pageSize).toBe(20);
      expect(r.data.from).toBeInstanceOf(Date);
    }
  });

  it("rejects pageSize > 100", () => {
    const r = symptomLogQuery.safeParse({ pageSize: "500" });
    expect(r.success).toBe(false);
  });
});
