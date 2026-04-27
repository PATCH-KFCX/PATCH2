"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const DAYS = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
];

export interface ScheduleValue {
  timesOfDay: string[];
  daysOfWeek: number[];
  startsOn: Date;
  endsOn: Date | null;
}

function toIsoDate(d: Date | null): string {
  if (!d) return "";
  const tz = d.getTimezoneOffset();
  return new Date(d.getTime() - tz * 60_000).toISOString().slice(0, 10);
}

export function ScheduleEditor({
  value,
  onChange,
  onRemove,
  index,
  removable,
}: {
  value: ScheduleValue;
  onChange: (next: ScheduleValue) => void;
  onRemove?: () => void;
  index: number;
  removable: boolean;
}) {
  function update(patch: Partial<ScheduleValue>) {
    onChange({ ...value, ...patch });
  }

  function setTime(i: number, t: string) {
    const next = [...value.timesOfDay];
    next[i] = t;
    update({ timesOfDay: next });
  }

  function addTime() {
    update({ timesOfDay: [...value.timesOfDay, "08:00"] });
  }

  function removeTime(i: number) {
    update({ timesOfDay: value.timesOfDay.filter((_, idx) => idx !== i) });
  }

  function toggleDay(d: number) {
    const has = value.daysOfWeek.includes(d);
    const next = has
      ? value.daysOfWeek.filter((x) => x !== d)
      : [...value.daysOfWeek, d];
    update({ daysOfWeek: next });
  }

  const everyDay = value.daysOfWeek.length === 0;

  return (
    <div className="space-y-4 rounded-lg border p-4 bg-muted/20">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Schedule {index + 1}</p>
        {removable && onRemove && (
          <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
            Remove
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Times of day</Label>
        <div className="flex flex-wrap gap-2">
          {value.timesOfDay.map((t, i) => (
            <div key={i} className="flex items-center gap-1">
              <Input
                type="time"
                value={t}
                onChange={(e) => setTime(i, e.target.value)}
                className="w-28"
              />
              {value.timesOfDay.length > 1 && (
                <button
                  type="button"
                  aria-label="Remove time"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted text-muted-foreground"
                  onClick={() => removeTime(i)}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addTime}
            disabled={value.timesOfDay.length >= 12}
          >
            + Add time
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Days</Label>
          <button
            type="button"
            className="text-xs text-muted-foreground hover:underline"
            onClick={() => update({ daysOfWeek: everyDay ? [1, 2, 3, 4, 5] : [] })}
          >
            {everyDay ? "Pick specific days" : "Every day"}
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {DAYS.map((d) => {
            const active = everyDay || value.daysOfWeek.includes(d.value);
            return (
              <button
                key={d.value}
                type="button"
                onClick={() => toggleDay(d.value)}
                className={cn(
                  "h-9 min-w-12 rounded-md border px-2 text-sm transition-colors",
                  active
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-input text-muted-foreground hover:bg-muted",
                )}
              >
                {d.label}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          {everyDay
            ? "Runs every day of the week."
            : `Runs on ${value.daysOfWeek.length} day${value.daysOfWeek.length === 1 ? "" : "s"} per week.`}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor={`startsOn-${index}`} className="text-xs">
            Starts
          </Label>
          <Input
            id={`startsOn-${index}`}
            type="date"
            value={toIsoDate(value.startsOn)}
            onChange={(e) =>
              update({
                startsOn: e.target.value
                  ? new Date(e.target.value)
                  : new Date(),
              })
            }
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`endsOn-${index}`} className="text-xs">
            Ends (optional)
          </Label>
          <Input
            id={`endsOn-${index}`}
            type="date"
            value={toIsoDate(value.endsOn)}
            onChange={(e) =>
              update({
                endsOn: e.target.value ? new Date(e.target.value) : null,
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
