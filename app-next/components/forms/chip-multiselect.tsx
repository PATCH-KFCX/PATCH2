"use client";

import { useId, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface ChipMultiSelectProps {
  label?: string;
  description?: string;
  placeholder?: string;
  suggestions?: readonly string[];
  value: string[];
  onChange: (next: string[]) => void;
  maxItems?: number;
  className?: string;
}

export function ChipMultiSelect({
  label,
  description,
  placeholder = "Type and press Enter…",
  suggestions = [],
  value,
  onChange,
  maxItems = 50,
  className,
}: ChipMultiSelectProps) {
  const inputId = useId();
  const [draft, setDraft] = useState("");

  const lower = useMemo(
    () => new Set(value.map((v) => v.toLowerCase())),
    [value],
  );

  function add(raw: string) {
    const v = raw.trim();
    if (!v) return;
    if (lower.has(v.toLowerCase())) return;
    if (value.length >= maxItems) return;
    onChange([...value, v]);
    setDraft("");
  }

  function remove(item: string) {
    onChange(value.filter((v) => v !== item));
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(draft);
    } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
      remove(value[value.length - 1]);
    }
  }

  const visibleSuggestions = suggestions.filter(
    (s) => !lower.has(s.toLowerCase()),
  );

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <div className="flex flex-wrap gap-1.5">
        {value.map((item) => (
          <Badge key={item} variant="secondary" className="gap-1 py-1">
            {item}
            <button
              type="button"
              aria-label={`Remove ${item}`}
              className="ml-1 -mr-1 inline-flex h-4 w-4 items-center justify-center rounded-sm hover:bg-foreground/10"
              onClick={() => remove(item)}
            >
              ×
            </button>
          </Badge>
        ))}
      </div>
      <Input
        id={inputId}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => draft && add(draft)}
        placeholder={placeholder}
      />
      {visibleSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {visibleSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              className="text-xs rounded-full border border-dashed px-2 py-0.5 text-muted-foreground hover:bg-muted"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
