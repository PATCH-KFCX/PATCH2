// ADA estimated-A1c formula: eAG (mg/dL) = 28.7 × A1c − 46.7
// → A1c (%) = (eAG + 46.7) / 28.7

export interface DiabetesStats {
  count: number;
  averageMgDl: number | null;
  estA1c: number | null; // percent, 1 decimal
  inRangePct: number | null; // % of readings within [low, high]
  low: number;
  high: number;
}

export function diabetesStats(
  readings: { glucoseMgDl: number }[],
  range: { low: number; high: number } = { low: 70, high: 180 },
): DiabetesStats {
  if (readings.length === 0) {
    return {
      count: 0,
      averageMgDl: null,
      estA1c: null,
      inRangePct: null,
      low: range.low,
      high: range.high,
    };
  }

  const sum = readings.reduce((acc, r) => acc + r.glucoseMgDl, 0);
  const avg = sum / readings.length;
  const a1c = (avg + 46.7) / 28.7;
  const inRange = readings.filter(
    (r) => r.glucoseMgDl >= range.low && r.glucoseMgDl <= range.high,
  ).length;

  return {
    count: readings.length,
    averageMgDl: Math.round(avg),
    estA1c: Math.round(a1c * 10) / 10,
    inRangePct: Math.round((inRange / readings.length) * 100),
    low: range.low,
    high: range.high,
  };
}
