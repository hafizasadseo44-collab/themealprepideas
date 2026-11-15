// Separate .ts file so the large template literal does not live in a .tsx file,
// which prevents Turbopack from misidentifying HTML/CSS content as regexp literals.

type UnitSystem = "metric" | "imperial";
type ActivityLevel = "sedentary" | "lightly" | "moderately" | "very" | "extremely";
type FitnessGoal = "lose" | "maintain" | "build" | "lean_bulk" | "fat_loss" | "recomp";
type DietaryPref = "balanced" | "high_protein" | "low_carb" | "keto" | "vegetarian" | "vegan";

interface FormData {
  gender: string; age: number; unit: UnitSystem;
  heightCm: number; heightFt: number; heightIn: number;
  weightKg: number; weightLbs: number;
  bodyFatPct: number | null;
  activity: ActivityLevel; goal: FitnessGoal; diet: DietaryPref;
}

interface MacroResults {
  bmr: number; tdee: number; calories: number;
  protein: number; carbs: number; fat: number; fiber: number;
  proteinPct: number; carbsPct: number; fatPct: number;
  water: number; bmi: number; bmiStatus: string; bmiColor: string;
  idealWeightMin: number; idealWeightMax: number;
}

const ACTIVITY_OPTIONS = [
  { value: "sedentary",   label: "Sedentary",         emoji: "🛋️" },
  { value: "lightly",    label: "Lightly Active",    emoji: "🚶" },
  { value: "moderately", label: "Moderately Active", emoji: "🏃" },
  { value: "very",       label: "Very Active",        emoji: "🏋️" },
  { value: "extremely",  label: "Extreme",            emoji: "⚡" },
] as const;

const GOAL_OPTIONS = [
  { value: "lose",      label: "Lose Weight",    emoji: "📉", adjustment: -500 },
  { value: "fat_loss",  label: "Fat Loss",       emoji: "🔥", adjustment: -300 },
  { value: "recomp",    label: "Body Recomp",    emoji: "⚖️", adjustment:  0  },
  { value: "maintain",  label: "Maintain",       emoji: "✅", adjustment:  0  },
  { value: "lean_bulk", label: "Lean Bulk",      emoji: "📈", adjustment: 200  },
  { value: "build",     label: "Build Muscle",   emoji: "💪", adjustment: 300  },
] as const;

const DIET_OPTIONS = [
  { value: "balanced",    label: "Balanced",     emoji: "🥗" },
  { value: "high_protein",label: "High Protein", emoji: "🥩" },
  { value: "low_carb",    label: "Low Carb",     emoji: "🥦" },
  { value: "keto",        label: "Keto",         emoji: "🧈" },
  { value: "vegetarian",  label: "Vegetarian",   emoji: "🌱" },
  { value: "vegan",       label: "Vegan",        emoji: "🌿" },
] as const;

const GOAL_TIPS: Record<FitnessGoal, string[]> = {
  lose:      ["Aim for 0.5–1 lb/week — faster cuts risk muscle loss.", "Prioritize protein to preserve lean mass during the deficit.", "Strength training 2–3x/week helps maintain metabolic rate."],
  fat_loss:  ["A moderate deficit reduces fat while protecting muscle.", "Distribute protein evenly across 3–5 meals for best retention.", "Track weight weekly — daily fluctuations are misleading."],
  recomp:    ["Body recomp takes longer but builds strength and aesthetics.", "Hit your protein target daily — the most critical macro.", "Progressive overload is essential for body recomp."],
  maintain:  ["Maintenance calories keep weight stable and support activity.", "Adjust by +-100–200 kcal if weight drifts over 2–3 weeks.", "Focus on food quality: whole foods, protein, vegetables."],
  lean_bulk: ["A ~200 kcal surplus minimizes fat gain while building muscle.", "Expect 0.5–1 lb of muscle per month — slow is normal.", "Track strength gains as the best measure of progress."],
  build:     ["300 kcal surplus is enough to maximize muscle protein synthesis.", "Carbohydrates fuel workouts and support recovery.", "Get 7–9 hours of sleep — growth hormone peaks during sleep."],
};

export interface PrintParams {
  form: FormData;
  results: MacroResults;
  adjProtein: number; adjCarbs: number; adjFat: number;
  activeProt: number; activeCarb: number; activeFat: number;
}

export function generatePrintHTML({ form, results, adjProtein, adjCarbs, adjFat, activeProt, activeCarb, activeFat }: PrintParams): string {
  const goal     = GOAL_OPTIONS.find(g => g.value === form.goal)!;
  const activity = ACTIVITY_OPTIONS.find(a => a.value === form.activity)!;
  const diet     = DIET_OPTIONS.find(d => d.value === form.diet)!;
  const tips     = GOAL_TIPS[form.goal];
  const metric   = form.unit === "metric";
  const weightLabel = metric ? (form.weightKg + " kg") : (form.weightLbs + " lbs");
  const heightLabel = metric ? (form.heightCm + " cm") : (form.heightFt + "'" + form.heightIn + '"');
  const idealWtUnit = metric ? "kg" : "lbs";

  const mealCals = [
    { name: "Breakfast", pct: 25 },
    { name: "Lunch",     pct: 30 },
    { name: "Dinner",    pct: 30 },
    { name: "Snacks",    pct: 15 },
  ];

  const makePieSlice = (startPct: number, pct: number, color: string) => {
    const r = 70, cx = 80, cy = 80;
    const toRad = (p: number) => (p / 100) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(toRad(startPct));
    const y1 = cy + r * Math.sin(toRad(startPct));
    const x2 = cx + r * Math.cos(toRad(startPct + pct));
    const y2 = cy + r * Math.sin(toRad(startPct + pct));
    const large = pct > 50 ? 1 : 0;
    return '<path d="M' + cx + ',' + cy + ' L' + x1 + ',' + y1 + ' A' + r + ',' + r + ' 0 ' + large + ',1 ' + x2 + ',' + y2 + ' Z" fill="' + color + '" />';
  };
  let cumPct = 0;
  const slices = [
    { pct: activeProt, color: "#3fa34d" },
    { pct: activeCarb, color: "#f59e0b" },
    { pct: activeFat,  color: "#7c3aed" },
  ].map(s => {
    const slice = makePieSlice(cumPct, s.pct, s.color);
    cumPct += s.pct;
    return slice;
  }).join("");

  const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const mealRowsHtml = mealCals.map(m =>
    '<div class="meal-row">' +
      '<div class="meal-name">' + m.name + '</div>' +
      '<div class="meal-bar-wrap"><div class="meal-bar" style="width:' + m.pct + '%"></div></div>' +
      '<div class="meal-cals">' + Math.round(results.calories * m.pct / 100) + ' kcal</div>' +
    '</div>'
  ).join("");

  const tipsHtml = tips.map((tip, i) =>
    '<li><div class="tip-num">' + (i + 1) + '</div><div class="tip-text">' + tip + '</div></li>'
  ).join("");

  const goalAdj = (goal.adjustment >= 0 ? "+" : "") + goal.adjustment;

  return (
    "<!DOCTYPE html>" +
    '<html lang="en">' +
    "<head>" +
    '<meta charset="UTF-8" />' +
    '<meta name="viewport" content="width=device-width, initial-scale=1" />' +
    "<title>Macro Report — TheMealPrepIdeas.com</title>" +
    '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />' +
    "<style>" +
    "*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }" +
    "body { font-family: 'Inter', sans-serif; background: #f8faf8; color: #1a1a1a; -webkit-print-color-adjust: exact; print-color-adjust: exact; }" +
    ".page { max-width: 820px; margin: 0 auto; padding: 32px 24px 48px; }" +
    ".header { display: flex; align-items: center; justify-content: space-between; padding: 20px 28px; background: linear-gradient(135deg, #1a2e1a 0%, #2d5a30 60%, #3fa34d 100%); border-radius: 20px; margin-bottom: 28px; }" +
    ".brand { display: flex; align-items: center; gap: 14px; }" +
    ".brand-icon { width: 48px; height: 48px; background: rgba(255,255,255,0.15); border-radius: 14px; display: flex; align-items: center; justify-content: center; }" +
    ".brand-name { color: #fff; font-size: 20px; font-weight: 900; letter-spacing: -0.5px; line-height: 1.1; }" +
    ".brand-tagline { color: rgba(255,255,255,0.65); font-size: 11px; font-weight: 500; margin-top: 1px; }" +
    ".header-right { text-align: right; }" +
    ".report-label { color: rgba(255,255,255,0.55); font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; }" +
    ".report-title { color: #fff; font-size: 15px; font-weight: 800; margin-top: 2px; }" +
    ".report-date { color: rgba(255,255,255,0.5); font-size: 10px; margin-top: 2px; }" +
    ".calorie-hero { background: linear-gradient(135deg, #3fa34d 0%, #2d8a3d 100%); border-radius: 20px; padding: 28px 32px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; }" +
    ".cal-label { color: rgba(255,255,255,0.7); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; }" +
    ".cal-number { font-size: 72px; font-weight: 900; color: #fff; line-height: 1; letter-spacing: -3px; margin: 4px 0 6px; }" +
    ".cal-unit { color: rgba(255,255,255,0.75); font-size: 16px; font-weight: 700; }" +
    ".cal-meta { color: rgba(255,255,255,0.65); font-size: 12px; margin-top: 4px; }" +
    ".cal-right { text-align: center; }" +
    ".macro-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin-bottom: 20px; }" +
    ".macro-card { border-radius: 16px; padding: 18px 20px; }" +
    ".macro-card-prot { background: #f0fdf4; border: 2px solid #bbf7d0; }" +
    ".macro-card-carb { background: #fffbeb; border: 2px solid #fde68a; }" +
    ".macro-card-fat { background: #f5f3ff; border: 2px solid #ddd6fe; }" +
    ".macro-pill { display: inline-flex; align-items: center; gap: 5px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 3px 10px; border-radius: 999px; margin-bottom: 8px; }" +
    ".macro-pill-prot { background: #dcfce7; color: #15803d; }" +
    ".macro-pill-carb { background: #fef9c3; color: #92400e; }" +
    ".macro-pill-fat { background: #ede9fe; color: #6d28d9; }" +
    ".macro-g { font-size: 36px; font-weight: 900; letter-spacing: -1.5px; margin-right: 6px; }" +
    ".macro-g-prot { color: #15803d; }" +
    ".macro-g-carb { color: #d97706; }" +
    ".macro-g-fat { color: #7c3aed; }" +
    ".macro-pct { font-size: 13px; font-weight: 700; color: #9ca3af; vertical-align: middle; }" +
    ".macro-cals { font-size: 11px; color: #9ca3af; margin: 4px 0 10px; }" +
    ".macro-bar-wrap { height: 6px; background: #e5e7eb; border-radius: 999px; overflow: hidden; }" +
    ".macro-bar { height: 100%; border-radius: 999px; }" +
    ".two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; }" +
    ".full-card { margin-bottom: 20px; }" +
    ".card { background: #fff; border-radius: 16px; padding: 18px 20px; border: 1px solid #e5e7eb; }" +
    ".card-title { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: #9ca3af; margin-bottom: 14px; }" +
    ".stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }" +
    ".stat-item { background: #f9fafb; border-radius: 10px; padding: 10px 12px; }" +
    ".stat-label { font-size: 10px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2px; }" +
    ".stat-val { font-size: 20px; font-weight: 900; letter-spacing: -0.5px; }" +
    ".stat-sub { font-size: 10px; color: #9ca3af; margin-top: 1px; }" +
    ".meta-row { display: flex; justify-content: space-between; align-items: center; padding: 7px 0; border-bottom: 1px solid #f3f4f6; }" +
    ".meta-row:last-child { border-bottom: none; }" +
    ".meta-label { font-size: 11px; color: #6b7280; }" +
    ".meta-val { font-size: 11px; font-weight: 700; color: #1a1a1a; }" +
    ".meal-row { display: flex; align-items: center; gap: 10px; padding: 6px 0; }" +
    ".meal-name { font-size: 11px; font-weight: 600; color: #374151; width: 70px; flex-shrink: 0; }" +
    ".meal-bar-wrap { flex: 1; height: 8px; background: #f3f4f6; border-radius: 999px; overflow: hidden; }" +
    ".meal-bar { height: 100%; background: linear-gradient(to right, #3fa34d, #2d8a3d); border-radius: 999px; }" +
    ".meal-cals { font-size: 11px; font-weight: 700; color: #374151; width: 65px; text-align: right; flex-shrink: 0; }" +
    ".tips-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }" +
    ".tips-list li { display: flex; gap: 8px; align-items: flex-start; }" +
    ".tip-num { width: 18px; height: 18px; background: #3fa34d; color: #fff; border-radius: 50%; font-size: 9px; font-weight: 900; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }" +
    ".tip-text { font-size: 11px; color: #374151; line-height: 1.5; }" +
    ".profile-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }" +
    ".profile-item { background: #f9fafb; border-radius: 10px; padding: 10px 14px; }" +
    ".profile-key { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #9ca3af; margin-bottom: 3px; }" +
    ".profile-val { font-size: 14px; font-weight: 800; color: #1a1a1a; }" +
    ".footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 32px; padding-top: 20px; border-top: 1px solid #e5e7eb; }" +
    ".footer-brand { font-size: 13px; font-weight: 900; color: #1a1a1a; margin-bottom: 2px; }" +
    ".footer-url { font-size: 10px; color: #3fa34d; font-weight: 600; }" +
    ".footer-note { font-size: 9px; color: #9ca3af; text-align: right; line-height: 1.6; }" +
    ".print-btn { position: fixed; bottom: 24px; right: 24px; background: #3fa34d; color: #fff; border: none; border-radius: 14px; padding: 12px 24px; font-size: 14px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 20px rgba(63,163,77,0.4); font-family: 'Inter', sans-serif; }" +
    ".print-btn:hover { background: #2d8a3d; }" +
    "@media print { .print-btn { display: none; } }" +
    "</style></head><body>" +
    '<div class="page">' +
    '<div class="header">' +
      '<div class="brand">' +
        '<div class="brand-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.95)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" y1="17" x2="18" y2="17"/><line x1="6" y1="13" x2="18" y2="13"/></svg></div>' +
        "<div>" +
          '<div class="brand-name">The Meal Prep Ideas</div>' +
          '<div class="brand-tagline">themealprepideas.com</div>' +
        "</div>" +
      "</div>" +
      '<div class="header-right">' +
        '<div class="report-label">Macro Report</div>' +
        '<div class="report-title">Personalized Nutrition Plan</div>' +
        '<div class="report-date">' + dateStr + "</div>" +
      "</div>" +
    "</div>" +
    '<div class="calorie-hero">' +
      '<div class="cal-left">' +
        '<div class="cal-label">Daily Calorie Target</div>' +
        '<div class="cal-number">' + results.calories.toLocaleString() + "</div>" +
        '<div class="cal-unit">kcal / day</div>' +
        '<div class="cal-meta">BMR ' + results.bmr + " kcal · TDEE " + results.tdee + " kcal · " + goal.emoji + " " + goal.label + "</div>" +
      "</div>" +
      '<div class="cal-right">' +
        '<svg width="160" height="160" viewBox="0 0 160 160">' +
          '<circle cx="80" cy="80" r="70" fill="rgba(255,255,255,0.08)" />' +
          slices +
          '<circle cx="80" cy="80" r="44" fill="rgba(255,255,255,0.15)" />' +
          '<text x="80" y="74" text-anchor="middle" font-family="Inter,sans-serif" font-size="11" font-weight="800" fill="rgba(255,255,255,0.9)">MACROS</text>' +
          '<text x="80" y="90" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" font-weight="600" fill="rgba(255,255,255,0.65)">P·C·F</text>' +
        "</svg>" +
      "</div>" +
    "</div>" +
    '<div class="macro-row">' +
      '<div class="macro-card macro-card-prot"><div class="macro-pill macro-pill-prot">🥩 Protein</div><div><span class="macro-g macro-g-prot">' + adjProtein + '</span><span class="macro-pct">' + activeProt + '%</span></div><div class="macro-cals">' + Math.round(adjProtein * 4) + ' kcal · 4 kcal/g</div><div class="macro-bar-wrap"><div class="macro-bar" style="width:' + activeProt + '%; background:#3fa34d;"></div></div></div>' +
      '<div class="macro-card macro-card-carb"><div class="macro-pill macro-pill-carb">🌾 Carbs</div><div><span class="macro-g macro-g-carb">' + adjCarbs + '</span><span class="macro-pct">' + activeCarb + '%</span></div><div class="macro-cals">' + Math.round(adjCarbs * 4) + ' kcal · 4 kcal/g</div><div class="macro-bar-wrap"><div class="macro-bar" style="width:' + activeCarb + '%; background:#f59e0b;"></div></div></div>' +
      '<div class="macro-card macro-card-fat"><div class="macro-pill macro-pill-fat">🫒 Fat</div><div><span class="macro-g macro-g-fat">' + adjFat + '</span><span class="macro-pct">' + activeFat + '%</span></div><div class="macro-cals">' + Math.round(adjFat * 9) + ' kcal · 9 kcal/g</div><div class="macro-bar-wrap"><div class="macro-bar" style="width:' + activeFat + '%; background:#7c3aed;"></div></div></div>' +
    "</div>" +
    '<div class="two-col">' +
      '<div class="card"><div class="card-title">Body Stats</div><div class="stats-grid">' +
        '<div class="stat-item"><div class="stat-label">BMI</div><div class="stat-val" style="color:' + results.bmiColor + '">' + results.bmi + '</div><div class="stat-sub">' + results.bmiStatus + "</div></div>" +
        '<div class="stat-item"><div class="stat-label">Water</div><div class="stat-val" style="color:#0ea5e9">' + results.water.toFixed(1) + ' L</div><div class="stat-sub">~' + Math.round(results.water * 4.23) + " cups/day</div></div>" +
        '<div class="stat-item"><div class="stat-label">Fiber</div><div class="stat-val" style="color:#f59e0b">~' + results.fiber + 'g</div><div class="stat-sub">per day</div></div>' +
        '<div class="stat-item"><div class="stat-label">Ideal Weight</div><div class="stat-val" style="color:#7c3aed;font-size:15px">' + results.idealWeightMin + "–" + results.idealWeightMax + '</div><div class="stat-sub">' + idealWtUnit + " ±10%</div></div>" +
      "</div></div>" +
      '<div class="card"><div class="card-title">Metabolism</div>' +
        '<div class="meta-row"><span class="meta-label">Basal Metabolic Rate (BMR)</span><span class="meta-val">' + results.bmr.toLocaleString() + " kcal</span></div>" +
        '<div class="meta-row"><span class="meta-label">Total Daily Energy (TDEE)</span><span class="meta-val">' + results.tdee.toLocaleString() + " kcal</span></div>" +
        '<div class="meta-row"><span class="meta-label">Activity Level</span><span class="meta-val">' + activity.emoji + " " + activity.label + "</span></div>" +
        '<div class="meta-row"><span class="meta-label">Goal Adjustment</span><span class="meta-val">' + goalAdj + " kcal</span></div>" +
        '<div class="meta-row"><span class="meta-label">Diet Style</span><span class="meta-val">' + diet.emoji + " " + diet.label + "</span></div>" +
      "</div>" +
    "</div>" +
    '<div class="two-col">' +
      '<div class="card"><div class="card-title">Suggested Meal Split</div>' + mealRowsHtml + "</div>" +
      '<div class="card"><div class="card-title">Goal Tips · ' + goal.emoji + " " + goal.label + '</div><ul class="tips-list">' + tipsHtml + "</ul></div>" +
    "</div>" +
    '<div class="full-card card"><div class="card-title">Your Profile</div><div class="profile-grid">' +
      '<div class="profile-item"><div class="profile-key">Gender</div><div class="profile-val" style="text-transform:capitalize">' + form.gender + "</div></div>" +
      '<div class="profile-item"><div class="profile-key">Age</div><div class="profile-val">' + form.age + " yrs</div></div>" +
      '<div class="profile-item"><div class="profile-key">Height</div><div class="profile-val">' + heightLabel + "</div></div>" +
      '<div class="profile-item"><div class="profile-key">Weight</div><div class="profile-val">' + weightLabel + "</div></div>" +
      '<div class="profile-item"><div class="profile-key">Goal</div><div class="profile-val">' + goal.emoji + " " + goal.label + "</div></div>" +
      '<div class="profile-item"><div class="profile-key">Diet Style</div><div class="profile-val">' + diet.emoji + " " + diet.label + "</div></div>" +
    "</div></div>" +
    '<div class="footer">' +
      "<div>" +
        '<div class="footer-brand"><img src="https://themealprepideas.com/icon.svg" width="14" height="14" style="display:inline;vertical-align:middle;margin-right:5px;" />The Meal Prep Ideas</div>' +
        '<div class="footer-url">themealprepideas.com/macro-calculator</div>' +
      "</div>" +
      '<div class="footer-note">Calculations use Mifflin-St Jeor BMR formula with Hamwi ideal weight ±10%.<br/>This report is for informational purposes. Consult a registered dietitian for<br/>personalized medical nutrition advice.</div>' +
    "</div>" +
    "</div>" +
    '<button class="print-btn" onclick="window.print()">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>' +
      "Save as PDF / Print" +
    "</button>" +
    "</body></html>"
  );
}
