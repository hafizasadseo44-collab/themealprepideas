"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator, RotateCcw, Copy, Printer, Check, ChevronDown,
  Flame, Activity, Target, Droplets, Utensils, Info,
  TrendingDown, TrendingUp, RefreshCw, Scale, Wheat,
  Zap, ChevronRight,
} from "lucide-react";
import Container from "@/components/ui/Container";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
type Gender = "male" | "female";
type UnitSystem = "metric" | "imperial";
type ActivityLevel = "sedentary" | "lightly" | "moderately" | "very" | "extremely";
type FitnessGoal = "lose" | "maintain" | "build" | "lean_bulk" | "fat_loss" | "recomp";
type DietaryPref = "balanced" | "high_protein" | "low_carb" | "keto" | "vegetarian" | "vegan";

interface FormData {
  gender: Gender; age: number; unit: UnitSystem;
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

// ─── Constants ────────────────────────────────────────────────────────────────
const ACTIVITY_OPTIONS: { value: ActivityLevel; label: string; desc: string; emoji: string; multiplier: number; color: string }[] = [
  { value: "sedentary",   label: "Sedentary",         desc: "Little or no exercise",          emoji: "🛋️", multiplier: 1.2,   color: "#64748b" },
  { value: "lightly",    label: "Lightly Active",    desc: "1–3 days/week",                  emoji: "🚶", multiplier: 1.375, color: "#0ea5e9" },
  { value: "moderately", label: "Moderately Active", desc: "3–5 days/week",                  emoji: "🏃", multiplier: 1.55,  color: "#3fa34d" },
  { value: "very",       label: "Very Active",        desc: "6–7 days/week",                  emoji: "🏋️", multiplier: 1.725, color: "#f59e0b" },
  { value: "extremely",  label: "Extreme",            desc: "Physical job or twice daily",    emoji: "⚡", multiplier: 1.9,   color: "#ef4444" },
];

const GOAL_OPTIONS: { value: FitnessGoal; label: string; short: string; emoji: string; adjustment: number; color: string }[] = [
  { value: "lose",      label: "Lose Weight",    short: "−500 kcal", emoji: "📉", adjustment: -500, color: "#ef4444" },
  { value: "fat_loss",  label: "Fat Loss",       short: "−300 kcal", emoji: "🔥", adjustment: -300, color: "#f97316" },
  { value: "recomp",    label: "Body Recomp",    short: "Maintenance",emoji: "⚖️", adjustment:  0,  color: "#3b82f6" },
  { value: "maintain",  label: "Maintain",       short: "Maintenance",emoji: "✅", adjustment:  0,  color: "#3fa34d" },
  { value: "lean_bulk", label: "Lean Bulk",      short: "+200 kcal",  emoji: "📈", adjustment: 200, color: "#0d9488" },
  { value: "build",     label: "Build Muscle",   short: "+300 kcal",  emoji: "💪", adjustment: 300, color: "#7c3aed" },
];

const DIET_OPTIONS: { value: DietaryPref; label: string; emoji: string; prot: number; carb: number; fat: number }[] = [
  { value: "balanced",    label: "Balanced",     emoji: "🥗", prot: 30, carb: 40, fat: 30 },
  { value: "high_protein",label: "High Protein", emoji: "🥩", prot: 40, carb: 35, fat: 25 },
  { value: "low_carb",    label: "Low Carb",     emoji: "🥦", prot: 35, carb: 25, fat: 40 },
  { value: "keto",        label: "Keto",         emoji: "🧈", prot: 25, carb:  5, fat: 70 },
  { value: "vegetarian",  label: "Vegetarian",   emoji: "🌱", prot: 25, carb: 50, fat: 25 },
  { value: "vegan",       label: "Vegan",        emoji: "🌿", prot: 20, carb: 55, fat: 25 },
];

const GOAL_TIPS: Record<FitnessGoal, string[]> = {
  lose:      ["Aim for 0.5–1 lb/week — faster cuts risk muscle loss.", "Prioritize protein to preserve lean mass during the deficit.", "Strength training 2–3×/week helps maintain metabolic rate."],
  fat_loss:  ["A moderate deficit reduces fat while protecting muscle.", "Distribute protein evenly across 3–5 meals for best retention.", "Track weight weekly — daily fluctuations are misleading."],
  recomp:    ["Body recomp takes longer but builds strength and aesthetics.", "Hit your protein target daily — the most critical macro.", "Progressive overload is essential for body recomp."],
  maintain:  ["Maintenance calories keep weight stable and support activity.", "Adjust by ±100–200 kcal if weight drifts over 2–3 weeks.", "Focus on food quality: whole foods, protein, vegetables."],
  lean_bulk: ["A ~200 kcal surplus minimizes fat gain while building muscle.", "Expect 0.5–1 lb of muscle per month — slow is normal.", "Track strength gains as the best measure of progress."],
  build:     ["300 kcal surplus is enough to maximize muscle protein synthesis.", "Carbohydrates fuel workouts and support recovery.", "Get 7–9 hours of sleep — growth hormone peaks during sleep."],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function bmiLabel(bmi: number): { label: string; color: string; bg: string; pct: number } {
  if (bmi < 18.5) return { label: "Underweight", color: "#3b82f6", bg: "#eff6ff", pct: 15 };
  if (bmi < 25)   return { label: "Normal",       color: "#3fa34d", bg: "#f0fdf4", pct: 50 };
  if (bmi < 30)   return { label: "Overweight",   color: "#f59e0b", bg: "#fffbeb", pct: 72 };
  return                   { label: "Obese",        color: "#ef4444", bg: "#fef2f2", pct: 90 };
}

function calculateMacros(form: FormData): MacroResults {
  const { gender, age, unit, bodyFatPct } = form;
  const weightKg = unit === "metric" ? form.weightKg : form.weightLbs * 0.453592;
  const heightCm = unit === "metric" ? form.heightCm : (form.heightFt * 12 + form.heightIn) * 2.54;

  let bmr: number;
  if (bodyFatPct !== null) {
    bmr = 370 + 21.6 * weightKg * (1 - bodyFatPct / 100);
  } else {
    bmr = gender === "male"
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }

  const actOpt  = ACTIVITY_OPTIONS.find(a => a.value === form.activity)!;
  const goalOpt = GOAL_OPTIONS.find(g => g.value === form.goal)!;
  const dietOpt = DIET_OPTIONS.find(d => d.value === form.diet)!;

  const tdee     = bmr * actOpt.multiplier;
  const calories = Math.round(tdee + goalOpt.adjustment);
  const { prot: proteinPct, carb: carbsPct, fat: fatPct } = dietOpt;

  const protein = Math.round((calories * proteinPct / 100) / 4);
  const carbs   = Math.round((calories * carbsPct  / 100) / 4);
  const fat     = Math.round((calories * fatPct    / 100) / 9);
  const fiber   = Math.round(calories / 1000 * 14);
  const water   = Math.round(weightKg * 35) / 1000;
  const bmi     = weightKg / Math.pow(heightCm / 100, 2);
  const { label: bmiStatus, color: bmiColor } = bmiLabel(bmi);

  const heightInches = heightCm / 2.54;
  const extraInches  = Math.max(0, heightInches - 60);
  const idealKg      = (gender === "male" ? 48 : 45.4) + (gender === "male" ? 2.7 : 2.26) * extraInches;
  const mult         = unit === "imperial" ? 2.20462 : 1;

  return {
    bmr: Math.round(bmr), tdee: Math.round(tdee), calories,
    protein, carbs, fat, fiber,
    proteinPct, carbsPct, fatPct,
    water, bmi: Math.round(bmi * 10) / 10,
    bmiStatus, bmiColor,
    idealWeightMin: Math.round(idealKg * 0.9 * mult),
    idealWeightMax: Math.round(idealKg * 1.1 * mult),
  };
}

// ─── Default form ─────────────────────────────────────────────────────────────
const defaultForm: FormData = {
  gender: "male", age: 25, unit: "metric",
  heightCm: 170, heightFt: 5, heightIn: 8,
  weightKg: 70, weightLbs: 155,
  bodyFatPct: null,
  activity: "moderately", goal: "maintain", diet: "balanced",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({ number, title, subtitle, children }: {
  number: number; title: string; subtitle?: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/[0.04] md:p-6">
      <div className="mb-5 flex items-start gap-3">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-primary text-xs font-black text-white">
          {number}
        </span>
        <div>
          <h3 className="text-base font-black text-gray-900">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function SliderField({ label, value, min, max, step = 1, unit, onChange }: {
  label: string; value: number; min: number; max: number;
  step?: number; unit: string; onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</label>
        <div className="flex items-baseline gap-1 rounded-lg bg-brand-primary/8 px-2.5 py-1">
          <span className="text-xl font-black tabular-nums text-brand-primary-dark">{value}</span>
          <span className="text-[11px] font-bold text-brand-primary/60">{unit}</span>
        </div>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="macro-slider w-full"
        style={{ "--fill": `${pct}%` } as React.CSSProperties}
      />
      <div className="flex justify-between text-[10px] font-semibold text-gray-300">
        <span>{min} {unit}</span><span>{max} {unit}</span>
      </div>
    </div>
  );
}

function LiveMacroBar({ label, grams, pct, color, bgColor }: {
  label: string; grams: number; pct: number; color: string; bgColor: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
          <span className="font-bold text-gray-700">{label}</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-black tabular-nums" style={{ color }}>{grams}g</span>
          <span className="text-xs text-gray-400">{pct}%</span>
        </div>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: bgColor }}>
        <motion.div
          className="h-full rounded-full"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function LiveNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);
  useEffect(() => {
    if (value === prevRef.current) return;
    prevRef.current = value;
    const start = Date.now();
    const from = display;
    const to = value;
    const dur = 400;
    const timer = setInterval(() => {
      const p = Math.min((Date.now() - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (p >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps
  return <>{display.toLocaleString()}</>;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MacroCalculator() {
  const [form, setForm]       = useState<FormData>(defaultForm);
  const [copied, setCopied]   = useState(false);
  const [showBF, setShowBF]   = useState(false);
  const [showAdjust, setShowAdjust] = useState(false);
  const [showTips, setShowTips]     = useState(false);
  const [customProt, setCustomProt] = useState<number | null>(null);
  const [customCarb, setCustomCarb] = useState<number | null>(null);
  const [customFat, setCustomFat]   = useState<number | null>(null);

  const results = useMemo(() => calculateMacros(form), [form]);

  const activeProt = customProt ?? results.proteinPct;
  const activeCarb = customCarb ?? results.carbsPct;
  const activeFat  = customFat  ?? results.fatPct;
  const adjProtein = Math.round((results.calories * activeProt / 100) / 4);
  const adjCarbs   = Math.round((results.calories * activeCarb / 100) / 4);
  const adjFat     = Math.round((results.calories * activeFat  / 100) / 9);

  const handleAdjSlider = (macro: "prot" | "carb" | "fat", value: number) => {
    const rem = 100 - value;
    if (macro === "prot") {
      const cb = customCarb ?? results.carbsPct, fb = customFat ?? results.fatPct, tot = cb + fb || 1;
      setCustomProt(value); setCustomCarb(Math.round((cb / tot) * rem)); setCustomFat(Math.round((fb / tot) * rem));
    } else if (macro === "carb") {
      const pb = customProt ?? results.proteinPct, fb = customFat ?? results.fatPct, tot = pb + fb || 1;
      setCustomCarb(value); setCustomProt(Math.round((pb / tot) * rem)); setCustomFat(Math.round((fb / tot) * rem));
    } else {
      const pb = customProt ?? results.proteinPct, cb = customCarb ?? results.carbsPct, tot = pb + cb || 1;
      setCustomFat(value); setCustomProt(Math.round((pb / tot) * rem)); setCustomCarb(Math.round((cb / tot) * rem));
    }
  };

  const handleReset = useCallback(() => {
    setForm(defaultForm);
    setCustomProt(null); setCustomCarb(null); setCustomFat(null);
    setShowBF(false); setShowAdjust(false); setShowTips(false);
  }, []);

  const handleCopy = useCallback(async () => {
    const goal = GOAL_OPTIONS.find(g => g.value === form.goal)?.label ?? "";
    const diet = DIET_OPTIONS.find(d => d.value === form.diet)?.label ?? "";
    const text = [
      "── Macro Results — TheMealPrepIdeas.com ──",
      `Goal: ${goal} | Diet: ${diet}`,
      ``, `BMR: ${results.bmr} kcal`, `TDEE: ${results.tdee} kcal`,
      `Daily Target: ${results.calories} kcal`, ``,
      `Protein: ${adjProtein}g (${activeProt}%)`,
      `Carbs:   ${adjCarbs}g (${activeCarb}%)`,
      `Fat:     ${adjFat}g (${activeFat}%)`,
      `Fiber:   ~${results.fiber}g`, ``,
      `Water: ~${results.water.toFixed(1)} L/day`,
      `BMI: ${results.bmi} (${results.bmiStatus})`,
    ].join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }, [results, form, adjProtein, adjCarbs, adjFat, activeProt, activeCarb, activeFat]);

  const goalOpt = GOAL_OPTIONS.find(g => g.value === form.goal)!;
  const bmiInfo = bmiLabel(results.bmi);
  const isMetric = form.unit === "metric";

  // ── Donut chart data ──
  const r = 54, cx = 60, cy = 60, circ = 2 * Math.PI * r;
  const donutSegments = [
    { pct: activeProt, color: "#3fa34d" },
    { pct: activeCarb, color: "#f59e0b" },
    { pct: activeFat,  color: "#8b5cf6" },
  ];
  let cumPct = 0;

  return (
    <>
      <style>{`
        .macro-slider {
          -webkit-appearance: none; appearance: none;
          height: 8px; border-radius: 999px; cursor: pointer; outline: none; width: 100%;
          background: linear-gradient(to right, #3fa34d 0%, #3fa34d var(--fill), #e9ecef var(--fill), #e9ecef 100%);
        }
        .macro-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 22px; height: 22px; border-radius: 50%;
          background: #fff; border: 3px solid #3fa34d;
          box-shadow: 0 0 0 3px rgba(63,163,77,0.15), 0 2px 6px rgba(0,0,0,0.1);
          cursor: pointer; transition: transform .15s, box-shadow .15s;
        }
        .macro-slider::-webkit-slider-thumb:hover { transform: scale(1.18); box-shadow: 0 0 0 5px rgba(63,163,77,0.22), 0 3px 10px rgba(63,163,77,0.3); }
        .macro-slider::-moz-range-thumb { width: 22px; height: 22px; border-radius: 50%; background: #fff; border: 3px solid #3fa34d; cursor: pointer; }
        .adj-slider { -webkit-appearance: none; appearance: none; height: 6px; border-radius: 999px; cursor: pointer; outline: none; width: 100%; }
        .adj-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: #fff; border: 3px solid currentColor; box-shadow: 0 1px 4px rgba(0,0,0,0.15); cursor: pointer; transition: transform .15s; }
        .adj-slider::-webkit-slider-thumb:hover { transform: scale(1.15); }
        .adj-slider::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: #fff; border: 3px solid currentColor; cursor: pointer; }
        .results-panel::-webkit-scrollbar { width: 4px; }
        .results-panel::-webkit-scrollbar-track { background: transparent; }
        .results-panel::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 999px; }
        @media print { header, footer, nav, .no-print { display: none !important; } body { background: white !important; } }
      `}</style>

      {/* ═══ HERO ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-10 md:py-14 no-print">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-20 left-[5%] h-[460px] w-[460px] rounded-full bg-gradient-to-br from-brand-primary/20 via-emerald-400/8 to-transparent blur-[80px] animate-[float-slow_22s_ease-in-out_infinite]" />
          <div className="absolute right-0 top-0 h-[320px] w-[320px] rounded-full bg-brand-orange/14 blur-[70px] animate-[float-slower_17s_ease-in-out_infinite]" />
        </div>
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-primary-dark shadow-sm backdrop-blur-sm">
                <Zap className="size-3.5" /> Free · Science-Based · Live Results
              </span>
              <h1 className="mt-4 font-display text-[38px] leading-[1.1] text-gray-900 sm:text-[52px] md:text-[60px]">
                Macro{" "}
                <span className="relative">
                  <span className="bg-gradient-to-r from-brand-primary to-emerald-600 bg-clip-text text-transparent">Calculator</span>
                  <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute -bottom-1 left-0 right-0 h-[3px] origin-left rounded-full bg-gradient-to-r from-brand-primary to-emerald-500" />
                </span>
              </h1>
              <p className="mt-4 text-base leading-relaxed text-gray-500 sm:text-lg">
                Adjust any value and watch your macros update instantly. Powered by the Mifflin-St Jeor equation.
              </p>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ═══ MAIN TWO-COLUMN LAYOUT ══════════════════════════════════════════════ */}
      <section className="pb-24 no-print">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_420px]">

            {/* ── LEFT: Form panels ───────────────────────────────────────────── */}
            <div className="space-y-5">

              {/* SECTION 1 — Personal Info */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <SectionCard number={1} title="Personal Info" subtitle="Your basic stats for the Mifflin-St Jeor equation">
                  <div className="space-y-6">
                    {/* Unit system */}
                    <div>
                      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">Unit System</p>
                      <div className="flex gap-2 rounded-xl bg-gray-100/80 p-1">
                        {(["metric", "imperial"] as UnitSystem[]).map(u => (
                          <button key={u} type="button" onClick={() => setForm(f => ({ ...f, unit: u }))}
                            className={cn("relative flex-1 rounded-lg py-2.5 text-sm font-bold transition-all duration-200",
                              form.unit === u ? "bg-white text-brand-primary-dark shadow-md" : "text-gray-500 hover:text-gray-700"
                            )}>
                            {u === "metric" ? "⚖️  Metric (kg / cm)" : "🇺🇸  Imperial (lbs / ft)"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Gender */}
                    <div>
                      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">Biological Sex</p>
                      <div className="grid grid-cols-2 gap-3">
                        {(["male", "female"] as Gender[]).map(g => (
                          <button key={g} type="button" onClick={() => setForm(f => ({ ...f, gender: g }))}
                            className={cn("relative flex items-center gap-3 rounded-xl border-2 px-4 py-3.5 font-bold transition-all",
                              form.gender === g
                                ? "border-brand-primary bg-brand-primary/8 text-brand-primary-dark shadow-sm"
                                : "border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200 hover:bg-white"
                            )}>
                            <span className="text-2xl">{g === "male" ? "👨" : "👩"}</span>
                            <span className="text-sm">{g === "male" ? "Male" : "Female"}</span>
                            {form.gender === g && (
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary">
                                <Check className="size-3 text-white stroke-[3]" />
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Age */}
                    <SliderField label="Age" value={form.age} min={10} max={80} unit="yrs"
                      onChange={v => setForm(f => ({ ...f, age: v }))} />

                    {/* Height */}
                    {isMetric ? (
                      <SliderField label="Height" value={form.heightCm} min={140} max={220} unit="cm"
                        onChange={v => setForm(f => ({ ...f, heightCm: v }))} />
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Height</p>
                          <div className="flex items-baseline gap-0.5 rounded-lg bg-brand-primary/8 px-2.5 py-1">
                            <span className="text-xl font-black tabular-nums text-brand-primary-dark">{form.heightFt}'{form.heightIn}"</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                          <SliderField label="Feet" value={form.heightFt} min={4} max={7} unit="ft"
                            onChange={v => setForm(f => ({ ...f, heightFt: v }))} />
                          <SliderField label="Inches" value={form.heightIn} min={0} max={11} unit="in"
                            onChange={v => setForm(f => ({ ...f, heightIn: v }))} />
                        </div>
                      </div>
                    )}

                    {/* Weight */}
                    {isMetric ? (
                      <SliderField label="Weight" value={form.weightKg} min={30} max={180} unit="kg"
                        onChange={v => setForm(f => ({ ...f, weightKg: v }))} />
                    ) : (
                      <SliderField label="Weight" value={form.weightLbs} min={65} max={400} unit="lbs"
                        onChange={v => setForm(f => ({ ...f, weightLbs: v }))} />
                    )}

                    {/* Body fat optional */}
                    <div className="rounded-xl border border-dashed border-gray-200 p-3.5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-gray-700">
                            Body Fat %
                            <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-400">OPTIONAL</span>
                          </p>
                          <p className="mt-0.5 text-[11px] text-gray-400">Enables Katch-McArdle formula</p>
                        </div>
                        <button type="button"
                          onClick={() => { setShowBF(v => !v); setForm(f => ({ ...f, bodyFatPct: !showBF ? 20 : null })); }}
                          className={cn("relative h-6 w-11 rounded-full transition-colors duration-250", showBF ? "bg-brand-primary" : "bg-gray-200")}
                        >
                          <motion.span animate={{ x: showBF ? 21 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow" />
                        </button>
                      </div>
                      <AnimatePresence>
                        {showBF && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                            <div className="mt-4">
                              <SliderField label="Body Fat" value={form.bodyFatPct ?? 20} min={5} max={50} unit="%"
                                onChange={v => setForm(f => ({ ...f, bodyFatPct: v }))} />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </SectionCard>
              </motion.div>

              {/* SECTION 2 — Activity Level */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
                <SectionCard number={2} title="Activity Level" subtitle="Your average weekly exercise intensity">
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {ACTIVITY_OPTIONS.map(opt => (
                      <button key={opt.value} type="button"
                        onClick={() => setForm(f => ({ ...f, activity: opt.value }))}
                        className={cn(
                          "group relative flex items-center gap-3 overflow-hidden rounded-xl border-2 p-3.5 text-left transition-all duration-200",
                          form.activity === opt.value
                            ? "border-brand-primary bg-brand-primary/6 shadow-sm"
                            : "border-gray-100 bg-gray-50/80 hover:border-gray-200 hover:bg-white"
                        )}
                      >
                        {/* left accent */}
                        {form.activity === opt.value && (
                          <span className="absolute inset-y-0 left-0 w-[3px] rounded-r-full bg-brand-primary" />
                        )}
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl text-xl"
                          style={{ backgroundColor: `${opt.color}18` }}>
                          {opt.emoji}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className={cn("text-sm font-black", form.activity === opt.value ? "text-brand-primary-dark" : "text-gray-800")}>
                            {opt.label}
                          </p>
                          <p className="text-[11px] text-gray-500">{opt.desc}</p>
                        </div>
                        <span className="shrink-0 rounded-lg px-2 py-1 text-[11px] font-black"
                          style={{ backgroundColor: `${opt.color}18`, color: opt.color }}>
                          ×{opt.multiplier}
                        </span>
                        {form.activity === opt.value && (
                          <span className="ml-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-primary">
                            <Check className="size-3 text-white stroke-[3]" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </SectionCard>
              </motion.div>

              {/* SECTION 3 — Fitness Goal */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
                <SectionCard number={3} title="Fitness Goal" subtitle="What are you trying to achieve?">
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                    {GOAL_OPTIONS.map(opt => (
                      <button key={opt.value} type="button"
                        onClick={() => setForm(f => ({ ...f, goal: opt.value }))}
                        className={cn(
                          "relative flex flex-col gap-2 rounded-xl border-2 p-3.5 text-left transition-all duration-200",
                          form.goal === opt.value
                            ? "border-brand-primary shadow-sm"
                            : "border-gray-100 bg-gray-50/80 hover:border-gray-200 hover:bg-white"
                        )}
                        style={form.goal === opt.value ? { background: `linear-gradient(135deg,${opt.color}0d,transparent)` } : {}}
                      >
                        <span className="flex size-10 items-center justify-center rounded-xl text-xl"
                          style={{ backgroundColor: `${opt.color}15` }}>
                          {opt.emoji}
                        </span>
                        <div>
                          <p className={cn("text-sm font-black", form.goal === opt.value ? "text-gray-900" : "text-gray-800")}>
                            {opt.label}
                          </p>
                          <p className="mt-0.5 text-[11px] font-bold" style={{ color: opt.color }}>{opt.short}</p>
                        </div>
                        {form.goal === opt.value && (
                          <span className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-brand-primary">
                            <Check className="size-3 text-white stroke-[3]" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </SectionCard>
              </motion.div>

              {/* SECTION 4 — Diet Style */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <SectionCard number={4} title="Diet Style" subtitle="Your preferred macronutrient distribution">
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                    {DIET_OPTIONS.map(opt => (
                      <button key={opt.value} type="button"
                        onClick={() => { setForm(f => ({ ...f, diet: opt.value })); setCustomProt(null); setCustomCarb(null); setCustomFat(null); }}
                        className={cn(
                          "relative flex flex-col items-center gap-2.5 rounded-xl border-2 p-3.5 text-center transition-all duration-200",
                          form.diet === opt.value
                            ? "border-brand-primary bg-brand-primary/6 shadow-sm"
                            : "border-gray-100 bg-gray-50/80 hover:border-gray-200 hover:bg-white"
                        )}
                      >
                        <span className="text-3xl">{opt.emoji}</span>
                        <span className={cn("text-sm font-black", form.diet === opt.value ? "text-brand-primary-dark" : "text-gray-800")}>
                          {opt.label}
                        </span>
                        {/* Mini bars */}
                        <div className="w-full space-y-1">
                          {[{ pct: opt.prot, c: "#3fa34d" }, { pct: opt.carb, c: "#f59e0b" }, { pct: opt.fat, c: "#8b5cf6" }].map(b => (
                            <div key={b.c} className="flex h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                              <div className="h-full rounded-full" style={{ width: `${b.pct}%`, backgroundColor: b.c }} />
                            </div>
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-gray-400">P{opt.prot}·C{opt.carb}·F{opt.fat}</span>
                        {form.diet === opt.value && (
                          <span className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-brand-primary">
                            <Check className="size-3 text-white stroke-[3]" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </SectionCard>
              </motion.div>

              {/* Reset button (mobile) */}
              <div className="flex justify-center lg:hidden">
                <button type="button" onClick={handleReset}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-500 shadow-sm transition-all hover:border-gray-300">
                  <RotateCcw className="size-4" /> Reset All
                </button>
              </div>
            </div>

            {/* ── RIGHT: Live Results Panel ────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
              className="results-panel lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto"
            >
              <div className="overflow-hidden rounded-3xl bg-white shadow-[0_12px_40px_-10px_rgba(0,0,0,0.13)] ring-1 ring-black/[0.04]">

                {/* Calorie header */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#3fa34d] via-emerald-600 to-[#2e7d32] p-6 text-white">
                  <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/[0.07]" />
                  <div className="pointer-events-none absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-white/[0.05]" />
                  <p className="relative z-10 text-[11px] font-black uppercase tracking-[0.15em] text-white/60">Daily Calorie Target</p>
                  <div className="relative z-10 mt-1 flex items-baseline gap-2">
                    <span className="text-[58px] font-black leading-none tabular-nums">
                      <LiveNumber value={results.calories} />
                    </span>
                    <span className="mb-1 text-lg font-semibold text-white/70">kcal</span>
                  </div>
                  <div className="relative z-10 mt-4 flex gap-2.5">
                    {[
                      { label: "BMR", value: results.bmr },
                      { label: "TDEE", value: results.tdee },
                    ].map(({ label, value }) => (
                      <div key={label} className="rounded-xl bg-white/15 px-3 py-2 backdrop-blur-sm">
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/55">{label}</p>
                        <p className="mt-0.5 text-lg font-black tabular-nums">
                          <LiveNumber value={value} />
                        </p>
                      </div>
                    ))}
                    <div className="rounded-xl bg-white/15 px-3 py-2 backdrop-blur-sm">
                      <p className="text-[9px] font-black uppercase tracking-widest text-white/55">Goal</p>
                      <p className="mt-0.5 text-sm font-black">{goalOpt.emoji} {goalOpt.label}</p>
                    </div>
                  </div>
                </div>

                {/* Macros section */}
                <div className="p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">Macronutrients</p>
                    {/* Mini donut */}
                    <svg viewBox="0 0 120 120" className="h-12 w-12" aria-hidden>
                      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={12} />
                      {donutSegments.map(({ pct, color }) => {
                        const dash = (pct / 100) * circ - 2;
                        const rot  = (cumPct / 100) * 360 - 90;
                        const el = (
                          <motion.circle key={color} cx={cx} cy={cy} r={r}
                            fill="none" stroke={color} strokeWidth={12}
                            animate={{ strokeDasharray: `${Math.max(0, dash)} ${circ}` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            transform={`rotate(${rot} ${cx} ${cy})`} strokeLinecap="round"
                            style={{ strokeDasharray: `0 ${circ}` }}
                          />
                        );
                        cumPct += pct;
                        return el;
                      })}
                    </svg>
                  </div>

                  <div className="space-y-3">
                    <LiveMacroBar label="Protein"       grams={adjProtein} pct={activeProt} color="#3fa34d" bgColor="#dcfce7" />
                    <LiveMacroBar label="Carbohydrates" grams={adjCarbs}   pct={activeCarb} color="#f59e0b" bgColor="#fef9c3" />
                    <LiveMacroBar label="Fat"           grams={adjFat}     pct={activeFat}  color="#8b5cf6" bgColor="#ede9fe" />
                  </div>

                  {/* Macro tiles */}
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {[
                      { label: "Protein", grams: adjProtein, pct: activeProt, cal: adjProtein * 4, color: "#3fa34d", bg: "#f0fdf4" },
                      { label: "Carbs",   grams: adjCarbs,   pct: activeCarb, cal: adjCarbs   * 4, color: "#f59e0b", bg: "#fffbeb" },
                      { label: "Fat",     grams: adjFat,     pct: activeFat,  cal: adjFat     * 9, color: "#8b5cf6", bg: "#faf5ff" },
                    ].map(({ label, grams, pct, cal, color, bg }) => (
                      <div key={label} className="rounded-xl p-3 text-center" style={{ backgroundColor: bg }}>
                        <motion.p animate={{ color }} className="text-xl font-black tabular-nums">
                          <LiveNumber value={grams} />g
                        </motion.p>
                        <p className="mt-0.5 text-[10px] font-bold text-gray-400">{pct}%</p>
                        <p className="mt-1 text-[11px] font-black text-gray-600">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Body stats */}
                <div className="border-t border-gray-100 p-5">
                  <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-gray-400">Body Stats</p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* BMI */}
                    <div className="rounded-xl p-3" style={{ backgroundColor: bmiInfo.bg }}>
                      <div className="flex items-center gap-1.5">
                        <Scale className="size-3.5" style={{ color: bmiInfo.color }} />
                        <p className="text-[10px] font-black uppercase tracking-wide" style={{ color: bmiInfo.color }}>BMI</p>
                      </div>
                      <p className="mt-1 text-xl font-black text-gray-900 tabular-nums">{results.bmi}</p>
                      <p className="text-[11px] font-semibold" style={{ color: bmiInfo.color }}>{results.bmiStatus}</p>
                    </div>
                    {/* Water */}
                    <div className="rounded-xl bg-sky-50 p-3">
                      <div className="flex items-center gap-1.5">
                        <Droplets className="size-3.5 text-sky-500" />
                        <p className="text-[10px] font-black uppercase tracking-wide text-sky-600">Water</p>
                      </div>
                      <p className="mt-1 text-xl font-black text-gray-900">{results.water.toFixed(1)} L</p>
                      <p className="text-[11px] text-sky-500">~{Math.round(results.water * 1000 / 237)} cups/day</p>
                    </div>
                    {/* Fiber */}
                    <div className="rounded-xl bg-amber-50 p-3">
                      <div className="flex items-center gap-1.5">
                        <Wheat className="size-3.5 text-amber-600" />
                        <p className="text-[10px] font-black uppercase tracking-wide text-amber-600">Fiber</p>
                      </div>
                      <p className="mt-1 text-xl font-black text-gray-900">~{results.fiber}g</p>
                      <p className="text-[11px] text-amber-600">per day</p>
                    </div>
                    {/* Ideal weight */}
                    <div className="rounded-xl bg-violet-50 p-3">
                      <div className="flex items-center gap-1.5">
                        <Target className="size-3.5 text-violet-600" />
                        <p className="text-[10px] font-black uppercase tracking-wide text-violet-600">Ideal Wt.</p>
                      </div>
                      <p className="mt-1 text-sm font-black text-gray-900">
                        {results.idealWeightMin}–{results.idealWeightMax}{isMetric ? "kg" : "lbs"}
                      </p>
                      <p className="text-[11px] text-violet-500">Hamwi ±10%</p>
                    </div>
                  </div>
                </div>

                {/* Meal distribution */}
                <div className="border-t border-gray-100 p-5">
                  <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-gray-400">Suggested Meal Split</p>
                  <div className="space-y-2">
                    {[
                      { name: "Breakfast", pct: 25, color: "#f97316" },
                      { name: "Lunch",     pct: 30, color: "#f59e0b" },
                      { name: "Dinner",    pct: 30, color: "#ef4444" },
                      { name: "Snacks",    pct: 15, color: "#a16207" },
                    ].map(({ name, pct, color }) => (
                      <div key={name} className="flex items-center gap-2.5">
                        <span className="w-16 text-xs font-semibold text-gray-500">{name}</span>
                        <div className="relative flex-1 h-2 overflow-hidden rounded-full bg-gray-100">
                          <motion.div className="absolute inset-y-0 left-0 rounded-full" style={{ backgroundColor: color }}
                            animate={{ width: `${(pct / 30) * 100}%` }} transition={{ duration: 0.5 }} />
                        </div>
                        <span className="w-16 text-right text-xs font-black" style={{ color }}>
                          ~{Math.round(results.calories * pct / 100)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customize macro split */}
                <div className="border-t border-gray-100">
                  <button type="button" onClick={() => setShowAdjust(v => !v)}
                    className="flex w-full items-center justify-between px-5 py-3.5 text-left">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="size-3.5 text-brand-primary-dark" />
                      <span className="text-xs font-black text-gray-700">Customize Macro Split</span>
                    </div>
                    <motion.div animate={{ rotate: showAdjust ? 180 : 0 }} transition={{ duration: 0.25 }}>
                      <ChevronDown className="size-4 text-gray-400" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {showAdjust && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                        <div className="space-y-4 border-t border-gray-100 px-5 pb-4 pt-4">
                          <p className="text-xs text-gray-500">Calories stay fixed at <strong className="text-gray-700">{results.calories.toLocaleString()}</strong> kcal.</p>
                          {[
                            { label: "Protein", key: "prot" as const, value: activeProt, color: "#3fa34d" },
                            { label: "Carbs",   key: "carb" as const, value: activeCarb, color: "#f59e0b" },
                            { label: "Fat",     key: "fat"  as const, value: activeFat,  color: "#8b5cf6" },
                          ].map(({ label, key, value, color }) => (
                            <div key={key} className="space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-gray-600">{label}</span>
                                <span className="font-black" style={{ color }}>{value}%</span>
                              </div>
                              <input type="range" min={5} max={80} value={value} className="adj-slider w-full"
                                onChange={e => handleAdjSlider(key, parseInt(e.target.value, 10))}
                                style={{ background: `linear-gradient(to right,${color} 0%,${color} ${((value - 5) / 75) * 100}%,#e9ecef ${((value - 5) / 75) * 100}%,#e9ecef 100%)`, color }}
                              />
                            </div>
                          ))}
                          <div className="rounded-xl bg-gray-50 p-3 text-xs text-gray-400">
                            <Info className="mb-0.5 mr-1 inline size-3" />
                            Total: {activeProt + activeCarb + activeFat}% · Rounding may cause ±1%.
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Goal tips */}
                <div className="border-t border-gray-100">
                  <button type="button" onClick={() => setShowTips(v => !v)}
                    className="flex w-full items-center justify-between px-5 py-3.5 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{goalOpt.emoji}</span>
                      <span className="text-xs font-black text-gray-700">Tips for {goalOpt.label}</span>
                    </div>
                    <motion.div animate={{ rotate: showTips ? 180 : 0 }} transition={{ duration: 0.25 }}>
                      <ChevronDown className="size-4 text-gray-400" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {showTips && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                        <div className="space-y-2.5 border-t border-gray-100 px-5 pb-5 pt-4">
                          {GOAL_TIPS[form.goal].map((tip, i) => (
                            <div key={i} className="flex gap-2.5">
                              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-primary text-[10px] font-black text-white">{i + 1}</span>
                              <p className="text-xs leading-relaxed text-gray-600">{tip}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 border-t border-gray-100 p-4">
                  <button type="button" onClick={handleCopy}
                    className={cn("flex flex-1 items-center justify-center gap-1.5 rounded-xl border-2 py-2.5 text-xs font-bold transition-all",
                      copied ? "border-brand-primary/30 bg-brand-primary/8 text-brand-primary-dark" : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                    )}>
                    {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <button type="button" onClick={() => window.print()}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border-2 border-gray-200 bg-gray-50 py-2.5 text-xs font-bold text-gray-600 transition-all hover:border-gray-300">
                    <Printer className="size-3.5" /> Print
                  </button>
                  <button type="button" onClick={handleReset}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border-2 border-gray-200 bg-gray-50 py-2.5 text-xs font-bold text-gray-600 transition-all hover:border-gray-300">
                    <RotateCcw className="size-3.5" /> Reset
                  </button>
                </div>

                {/* Methodology */}
                <div className="border-t border-gray-100 px-5 py-4 text-[11px] text-gray-400">
                  <Info className="mb-0.5 mr-1 inline size-3" />
                  Mifflin-St Jeor BMR · Activity multiplier · Goal adjustment · Hamwi ideal weight ±10%
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
    </>
  );
}
