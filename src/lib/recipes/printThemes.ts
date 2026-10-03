export type PrintThemeKey = "brand" | "mono" | "kraft" | "orange";
export type PrintTextSize = "sm" | "md" | "lg";
export type PrintSectionKey = "ingredients" | "instructions" | "notes" | "nutrition" | "time" | "dietary";

export const PRINT_THEMES: Record<PrintThemeKey, { label: string; swatch: string; accent: string; accentSoft: string; heading: string; body: string; border: string; surface: string }> = {
  brand: {
    label: "Brand Green",
    swatch: "#3fa34d",
    accent: "#2f7d3b",
    accentSoft: "#eaf5ec",
    heading: "#1c1a16",
    body: "#4b473f",
    border: "#e4dcc9",
    surface: "#fffdf9",
  },
  mono: {
    label: "Classic B&W",
    swatch: "#111827",
    accent: "#111827",
    accentSoft: "#f1f1f1",
    heading: "#000000",
    body: "#262626",
    border: "#d6d6d6",
    surface: "#ffffff",
  },
  kraft: {
    label: "Warm Kraft",
    swatch: "#9a5b13",
    accent: "#9a5b13",
    accentSoft: "#f6ead9",
    heading: "#3a2410",
    body: "#5a442d",
    border: "#e3cfae",
    surface: "#fffaf1",
  },
  orange: {
    label: "Bold Orange",
    swatch: "#d97706",
    accent: "#d97706",
    accentSoft: "#fff1dc",
    heading: "#241505",
    body: "#4a3416",
    border: "#f0d9ad",
    surface: "#fffdf9",
  },
};

export const PRINT_TEXT_SIZES: Record<PrintTextSize, { label: string; basePx: number }> = {
  sm: { label: "Small", basePx: 13 },
  md: { label: "Medium", basePx: 15 },
  lg: { label: "Large", basePx: 17 },
};

export const PRINT_SECTION_LABELS: Record<PrintSectionKey, string> = {
  ingredients: "Ingredients",
  instructions: "Instructions",
  notes: "Notes",
  nutrition: "Nutrition",
  time: "Time",
  dietary: "Dietary",
};
