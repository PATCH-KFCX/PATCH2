// Default suggestions shown in the multi-select chips. Users can add their own
// values too; these are seeds, not enums.

export const COMMON_SYMPTOMS = [
  "Fatigue",
  "Headache",
  "Nausea",
  "Dizziness",
  "Fever",
  "Chills",
  "Shortness of breath",
  "Chest pain",
  "Abdominal pain",
  "Joint pain",
  "Muscle ache",
  "Rash",
  "Anxiety",
  "Insomnia",
  "Low mood",
  "Loss of appetite",
  "Brain fog",
  "Tingling",
  "Numbness",
  "Blurred vision",
] as const;

export const COMMON_PAIN_TYPES = [
  "Sharp",
  "Dull",
  "Throbbing",
  "Burning",
  "Aching",
  "Cramping",
  "Stabbing",
  "Shooting",
  "Pressure",
] as const;

export const COMMON_PAIN_LOCATIONS = [
  "Head",
  "Neck",
  "Shoulder",
  "Upper back",
  "Lower back",
  "Chest",
  "Abdomen",
  "Arm",
  "Hand",
  "Hip",
  "Leg",
  "Knee",
  "Foot",
  "Jaw",
] as const;
