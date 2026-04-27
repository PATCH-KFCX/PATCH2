export type GlucoseContextValue =
  | "FASTING"
  | "PRE_MEAL"
  | "POST_MEAL"
  | "BEDTIME"
  | "RANDOM";

export const CONTEXT_LABELS: Record<GlucoseContextValue, string> = {
  FASTING: "Fasting",
  PRE_MEAL: "Pre-meal",
  POST_MEAL: "Post-meal",
  BEDTIME: "Bedtime",
  RANDOM: "Random",
};

// Tailwind color tokens used in chart legend + badges.
export const CONTEXT_COLORS: Record<GlucoseContextValue, string> = {
  FASTING: "#2563eb", // blue-600
  PRE_MEAL: "#0d9488", // teal-600
  POST_MEAL: "#d97706", // amber-600
  BEDTIME: "#7c3aed", // violet-600
  RANDOM: "#6b7280", // gray-500
};

export const CONTEXT_VALUES: GlucoseContextValue[] = [
  "FASTING",
  "PRE_MEAL",
  "POST_MEAL",
  "BEDTIME",
  "RANDOM",
];
