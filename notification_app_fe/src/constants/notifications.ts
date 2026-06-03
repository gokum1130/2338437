export const TOP_N_OPTIONS = [5, 10, 15, 20] as const;

export type TopNOption = (typeof TOP_N_OPTIONS)[number];

export const NOTIFICATION_TYPE_OPTIONS = [
  { value: "all", label: "All types" },
  { value: "placement", label: "Placement" },
  { value: "result", label: "Result" },
  { value: "event", label: "Event" },
] as const;
