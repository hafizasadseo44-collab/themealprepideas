const VULGAR: Record<string, number> = {
  "¼": 0.25, "½": 0.5, "¾": 0.75,
  "⅓": 1 / 3, "⅔": 2 / 3,
  "⅕": 0.2, "⅖": 0.4, "⅗": 0.6, "⅘": 0.8,
  "⅙": 1 / 6, "⅚": 5 / 6,
  "⅛": 0.125, "⅜": 0.375, "⅝": 0.625, "⅞": 0.875,
};
const VULGAR_CHARS = Object.keys(VULGAR).join("");

function parseLeadingQuantity(text: string): { qty: number; rest: string } | null {
  const trimmed = text.trim();

  let m = trimmed.match(new RegExp(`^(\\d+)\\s+([${VULGAR_CHARS}])([\\s\\S]*)$`));
  if (m) return { qty: Number(m[1]) + VULGAR[m[2]], rest: m[3] };

  m = trimmed.match(/^(\d+)\s+(\d+)\/(\d+)([\s\S]*)$/);
  if (m) return { qty: Number(m[1]) + Number(m[2]) / Number(m[3]), rest: m[4] };

  m = trimmed.match(/^(\d+)\/(\d+)([\s\S]*)$/);
  if (m) return { qty: Number(m[1]) / Number(m[2]), rest: m[3] };

  m = trimmed.match(new RegExp(`^([${VULGAR_CHARS}])([\\s\\S]*)$`));
  if (m) return { qty: VULGAR[m[1]], rest: m[2] };

  m = trimmed.match(/^(\d+(?:\.\d+)?)([\s\S]*)$/);
  if (m) return { qty: Number(m[1]), rest: m[2] };

  return null;
}

function formatQuantity(n: number): string {
  const whole = Math.floor(n + 1e-9);
  const frac = n - whole;
  if (Math.abs(frac) < 0.02) return String(whole);

  let nearestChar = "";
  let nearestDiff = Infinity;
  for (const [ch, v] of Object.entries(VULGAR)) {
    const diff = Math.abs(frac - v);
    if (diff < nearestDiff) {
      nearestDiff = diff;
      nearestChar = ch;
    }
  }
  if (nearestDiff < 0.02) return (whole > 0 ? whole + " " : "") + nearestChar;

  return String(Math.round(n * 100) / 100);
}

/** Scales the leading quantity in an ingredient line (e.g. "2 cups flour" -> "4 cups flour").
 *  Lines without a parseable leading number are returned unchanged. */
export function scaleIngredientText(text: string, multiplier: number): string {
  if (multiplier === 1) return text;
  const parsed = parseLeadingQuantity(text);
  if (!parsed) return text;
  return formatQuantity(parsed.qty * multiplier) + parsed.rest;
}
