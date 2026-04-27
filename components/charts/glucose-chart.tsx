"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import {
  CartesianGrid,
  ReferenceArea,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  CONTEXT_COLORS,
  CONTEXT_LABELS,
  CONTEXT_VALUES,
  type GlucoseContextValue,
} from "@/lib/diabetes/labels";
import type { GlucosePoint } from "@/lib/charts/transforms";

export type { GlucosePoint };

export function GlucoseChart({
  data,
  range = { low: 70, high: 180 },
}: {
  data: GlucosePoint[];
  range?: { low: number; high: number };
}) {
  const series = useMemo(() => {
    const buckets: Record<GlucoseContextValue, { ts: number; glucoseMgDl: number; measuredAt: string }[]> =
      {
        FASTING: [],
        PRE_MEAL: [],
        POST_MEAL: [],
        BEDTIME: [],
        RANDOM: [],
      };
    for (const p of data) {
      buckets[p.context].push({
        ts: new Date(p.measuredAt).getTime(),
        glucoseMgDl: p.glucoseMgDl,
        measuredAt: p.measuredAt,
      });
    }
    return buckets;
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
        No glucose readings yet — log one to start your trend.
      </div>
    );
  }

  const yMax = Math.max(300, ...data.map((d) => d.glucoseMgDl) , range.high + 20);

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="ts"
            type="number"
            domain={["dataMin", "dataMax"]}
            scale="time"
            tickFormatter={(t) => format(t, "MMM d")}
            tick={{ fontSize: 12 }}
            stroke="currentColor"
            className="text-muted-foreground"
          />
          <YAxis
            type="number"
            domain={[0, yMax]}
            tick={{ fontSize: 12 }}
            stroke="currentColor"
            className="text-muted-foreground"
            label={{
              value: "mg/dL",
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 11, fill: "currentColor" },
            }}
          />
          <ReferenceArea
            y1={range.low}
            y2={range.high}
            fill="var(--primary)"
            fillOpacity={0.06}
            stroke="none"
          />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            contentStyle={{
              fontSize: "12px",
              borderRadius: "6px",
              border: "1px solid var(--border)",
              background: "var(--popover)",
              color: "var(--popover-foreground)",
            }}
            labelFormatter={(t) => format(t as number, "PP p")}
            formatter={(value, name) => [`${value} mg/dL`, name as string]}
          />
          <Legend
            wrapperStyle={{ fontSize: 12 }}
            formatter={(v) => CONTEXT_LABELS[v as GlucoseContextValue] ?? v}
          />
          {CONTEXT_VALUES.map((ctx) =>
            series[ctx].length > 0 ? (
              <Scatter
                key={ctx}
                name={ctx}
                data={series[ctx]}
                fill={CONTEXT_COLORS[ctx]}
                line={false}
              />
            ) : null,
          )}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

