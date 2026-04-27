"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const LABELS: Record<number, string> = {
  1: "Barely noticeable",
  3: "Mild",
  5: "Moderate",
  7: "Severe",
  9: "Worst imaginable",
};

export function SeveritySlider({
  value,
  onChange,
  className,
}: {
  value: number;
  onChange: (next: number) => void;
  className?: string;
}) {
  const label =
    LABELS[value] ??
    (value <= 2
      ? "Barely noticeable"
      : value <= 4
        ? "Mild"
        : value <= 6
          ? "Moderate"
          : value <= 8
            ? "Severe"
            : "Worst imaginable");

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-baseline justify-between">
        <Label>Severity</Label>
        <span className="text-sm tabular-nums text-muted-foreground">
          <span className="font-medium text-foreground">{value}</span>/10 ·{" "}
          {label}
        </span>
      </div>
      <Slider
        min={1}
        max={10}
        step={1}
        value={[value]}
        onValueChange={(v) => onChange(Array.isArray(v) ? (v[0] ?? 1) : v)}
      />
    </div>
  );
}
