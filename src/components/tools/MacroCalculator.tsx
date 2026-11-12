"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator, RotateCcw, Copy, Printer, Check, ChevronDown,
  ChevronLeft, ChevronRight, Flame, Activity, Target,
  Droplets, Utensils, Info, TrendingDown, TrendingUp,
  RefreshCw, ArrowRight, Scale, Wheat,
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
  gender: Gender;
  age: number;
  unit: UnitSystem;
  heightCm: number;
  heightFt: number;
  heightIn: number;
  weightKg: number;
  weightLbs: number;
  bodyFatPct: number | null;
  activity: ActivityLevel;
  goal: FitnessGoal;
  diet: DietaryPref;
}

interface MacroResults {
  bmr: number;
  tdee: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  proteinPct: number;
  carbsPct: number;
  fatPct: number;
  water: number;
  bmi: number;
  bmiStatus: string;
  bmiColor: string;
  idealWeightMin: number;
  idealWeightMax: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const STEPS = ["About You", "Activity Level", "Fitness Goal", "Diet Style"];

const ACTIVITY_OPTIONS: { value: ActivityLevel; label: string; desc: string; emoji: string; multiplier: number }[] = [
  { value: "sedentary", label: "Sedentary", desc: "Desk job, little to no exercise", emoji: "🛋️", multiplier: 1.2 },
  { value: "lightly", label: "Lightly Active", desc: "Light exercise 1–3 days/week", emoji: "🚶", multiplier: 1.375 },
  { value: "moderately", label: "Moderately Active", desc: "Moderate exercise 3–5 days/week", emoji: "🏃", multiplier: 1.55 },
  { value: "very", label: "Very Active", desc: "Hard exercise 6–7 days/week", emoji: "🏋️", multiplier: 1.725 },
  { value: "extremely", label: "Extremely Active", desc: "Intense daily training or physical job", emoji: "⚡", multiplier: 1.9 },
];

const GOAL_OPTIONS: { value: FitnessGoal; label: string; desc: string; emoji: string; adjustment: number; tagColor: string }[] = [
  { value: "lose", label: "Lose Weight", desc: "Moderate deficit", emoji: "⬇️", adjustment: -500, tagColor: "text-red-600 bg-red-50" },
  { value: "fat_loss", label: "Fat Loss", desc: "Smaller deficit, preserve muscle", emoji: "🔥", adjustment: -300, tagColor: "text-orange-600 bg-orange-50" },
  { value: "recomp", label: "Body Recomp", desc: "Lose fat & gain muscle", emoji: "⚖️", adjustment: 0, tagColor: "text-blue-600 bg-blue-50" },
  { value: "maintain", label: "Maintain Weight", desc: "Sustain current weight", emoji: "✅", adjustment: 0, tagColor: "text-green-700 bg-green-50" },
  { value: "lean_bulk", label: "Lean Bulk", desc: "Minimal fat gain surplus", emoji: "📈", adjustment: 200, tagColor: "text-teal-600 bg-teal-50" },
  { value: "build", label: "Build Muscle", desc: "Maximize muscle growth", emoji: "💪", adjustment: 300, tagColor: "text-brand-primary-dark bg-brand-primary/10" },
];

const DIET_OPTIONS: { value: DietaryPref; label: string; desc: string; emoji: string; prot: number; carb: number; fat: number }[] = [
  { value: "balanced", label: "Balanced", desc: "30/40/30", emoji: "🥗", prot: 30, carb: 40, fat: 30 },
  { value: "high_protein", label: "High Protein", desc: "40/35/25", emoji: "🥩", prot: 40, carb: 35, fat: 25 },
  { value: "low_carb", label: "Low Carb", desc: "35/25/40", emoji: "🥦", prot: 35, carb: 25, fat: 40 },
  { value: "keto", label: "Keto", desc: "25/5/70", emoji: "🧈", prot: 25, carb: 5, fat: 70 },
  { value: "vegetarian", label: "Vegetarian", desc: "25/50/25", emoji: "🌱", prot: 25, carb: 50, fat: 25 },
  { value: "vegan", label: "Vegan", desc: "20/55/25", emoji: "🌿", prot: 20, carb: 55, fat: 25 },
];

const GOAL_TIPS: Record<FitnessGoal, string[]> = {
  lose: ["Aim for 0.5–1 lb/week loss — faster cuts risk muscle loss.", "Prioritize protein to preserve lean mass during the deficit.", "Strength training 2–3×/week helps maintain metabolic rate."],
  fat_loss: ["A moderate deficit reduces fat while protecting muscle better.", "Distribute protein evenly across 3–5 meals for best retention.", "Track weight weekly — daily fluctuations are misleading."],
  recomp: ["Body recomp takes longer but builds strength and aesthetics.", "Hit your protein target every day — the most critical macro.", "Progressive overload in the gym is essential for recomp."],
  maintain: ["Maintenance calories keep weight stable and support activity.", "Adjust by ±100–200 kcal if weight drifts over 2–3 weeks.", "Focus on food quality: whole foods, protein, vegetables."],
  lean_bulk: ["A ~200 kcal surplus minimizes fat gain while building muscle.", "Expect 0.5–1 lb of muscle per month — slow is normal.", "Track strength gains as the best measure of progress."],
  build: ["300 kcal surplus is enough to maximize muscle protein synthesis.", "Carbohydrates fuel workouts and support recovery.", "Get 7–9 hours of sleep — growth hormone peaks during deep sleep."],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function bmiStatus(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: "Underweight", color: "text-blue-600" };
  if (bmi < 25) return { label: "Normal weight", color: "text-brand-primary-dark" };
  if (bmi < 30) return { label: "Overweight", color: "text-amber-600" };
  return { label: "Obese", color: "text-red-600" };
}

function calculateMacros(form: FormData): MacroResults {
  const { gender, age, unit, bodyFatPct } = form;

  let weightKg = unit === "metric" ? form.weightKg : form.weightLbs * 0.453592;
  let heightCm = unit === "metric" ? form.heightCm : (form.heightFt * 12 + form.heightIn) * 2.54;

  // BMR — Mifflin-St Jeor (or Katch-McArdle if body fat provided)
  let bmr: number;
  if (bodyFatPct !== null) {
    const lbm = weightKg * (1 - bodyFatPct / 100);
    bmr = 370 + 21.6 * lbm; // Katch-McArdle
  } else {
    bmr = gender === "male"
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }

  const actOpt = ACTIVITY_OPTIONS.find(a => a.value === form.activity)!;
  const tdee = bmr * actOpt.multiplier;

  const goalOpt = GOAL_OPTIONS.find(g => g.value === form.goal)!;
  const calories = Math.round(tdee + goalOpt.adjustment);

  const dietOpt = DIET_OPTIONS.find(d => d.value === form.diet)!;
  const { prot: proteinPct, carb: carbsPct, fat: fatPct } = dietOpt;

  const protein = Math.round((calories * proteinPct / 100) / 4);
  const carbs = Math.round((calories * carbsPct / 100) / 4);
  const fat = Math.round((calories * fatPct / 100) / 9);
  const fiber = Math.round(calories / 1000 * 14); // 14g per 1000 kcal

  const water = Math.round(weightKg * 35) / 1000;

  const bmi = weightKg / Math.pow(heightCm / 100, 2);
  const { label: bmiLabel, color: bmiColor } = bmiStatus(bmi);

  // Ideal weight (Hamwi formula)
  const heightInches = heightCm / 2.54;
  const extraInches = Math.max(0, heightInches - 60);
  const idealBase = gender === "male" ? 48 : 45.4;
  const idealStep = gender === "male" ? 2.7 : 2.26;
  const idealKg = idealBase + idealStep * extraInches;
  const idealWeightMin = Math.round(idealKg * 0.9 * (unit === "imperial" ? 2.20462 : 1));
  const idealWeightMax = Math.round(idealKg * 1.1 * (unit === "imperial" ? 2.20462 : 1));

  return {
    bmr: Math.round(bmr), tdee: Math.round(tdee), calories,
    protein, carbs, fat, fiber,
    proteinPct, carbsPct, fatPct,
    water, bmi: Math.round(bmi * 10) / 10,
    bmiStatus: bmiLabel, bmiColor,
    idealWeightMin, idealWeightMax,
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ValueSlider({ label, value, min, max, step = 1, unit, onChange, className }: {
  label: string; value: number; min: number; max: number;
  step?: number; unit: string; onChange: (v: number) => void; className?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-semibold text-brand-heading">{label}</label>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-brand-primary-dark tabular-nums">{value}</span>
          <span className="text-sm font-medium text-brand-light">{unit}</span>
        </div>
      </div>
      <div className="relative py-1">
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          className="macro-slider w-full"
          style={{ "--fill": `${pct}%` } as React.CSSProperties}
        />
      </div>
      <div className="flex justify-between text-xs text-brand-light">
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>
    </div>
  );
}

function DonutChartFinal({ proteinPct, carbsPct, fatPct }: { proteinPct: number; carbsPct: number; fatPct: number }) {
  const r = 70; const cx = 90; const cy = 90; const circ = 2 * Math.PI * r;
  const segments = [
    { pct: proteinPct, color: "#3fa34d" },
    { pct: carbsPct, color: "#f59e0b" },
    { pct: fatPct, color: "#8b5cf6" },
  ];
  let cum = 0;
  return (
    <svg viewBox="0 0 180 180" className="w-full max-w-[160px]" aria-hidden="true">
      {segments.map(({ pct, color }) => {
        const dash = (pct / 100) * circ - 2;
        const rot = (cum / 100) * 360 - 90;
        cum += pct;
        return (
          <circle key={color} cx={cx} cy={cy} r={r} fill="none" stroke={color}
            strokeWidth={22} strokeDasharray={`${Math.max(0, dash)} ${circ}`}
            transform={`rotate(${rot} ${cx} ${cy})`} strokeLinecap="round" />
        );
      })}
      <text x={cx} y={cy - 5} textAnchor="middle" fontSize="11" fill="#6b7280" fontFamily="inherit">split</text>
      <text x={cx} y={cy + 13} textAnchor="middle" fontSize="18" fontWeight="700" fill="#111827" fontFamily="inherit">
        P/C/F
      </text>
    </svg>
  );
}

function MacroBar({ label, grams, pct, color, bgColor }: {
  label: string; grams: number; pct: number; color: string; bgColor: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-brand-heading">{label}</span>
        <span className="text-brand-light">{grams}g · {pct}%</span>
      </div>
      <div className={cn("h-2.5 w-full rounded-full", bgColor)}>
        <motion.div
          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className={cn("h-full rounded-full", color)}
        />
      </div>
    </div>
  );
}

function CountUp({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!target) return;
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * target));
      if (p >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <>{count.toLocaleString()}</>;
}

// ─── Default form ─────────────────────────────────────────────────────────────
const defaultForm: FormData = {
  gender: "male", age: 25, unit: "metric",
  heightCm: 170, heightFt: 5, heightIn: 8,
  weightKg: 70, weightLbs: 155,
  bodyFatPct: null,
  activity: "moderately", goal: "maintain", diet: "balanced",
};

const stepVariants = {
  enter: (dir: number) => ({ x: dir * 50, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -50, opacity: 0 }),
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MacroCalculator() {
  const [form, setForm] = useState<FormData>(defaultForm);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [results, setResults] = useState<MacroResults | null>(null);
  const [copied, setCopied] = useState(false);
  const [customProt, setCustomProt] = useState<number | null>(null);
  const [customCarb, setCustomCarb] = useState<number | null>(null);
  const [customFat, setCustomFat] = useState<number | null>(null);
  const [showAdjust, setShowAdjust] = useState(false);
  const [showBF, setShowBF] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const goNext = useCallback(() => {
    if (step < STEPS.length - 1) { setDirection(1); setStep(s => s + 1); }
  }, [step]);

  const goBack = useCallback(() => {
    if (step > 0) { setDirection(-1); setStep(s => s - 1); }
  }, [step]);

  const handleCalculate = useCallback(() => {
    const res = calculateMacros(form);
    setResults(res);
    setCustomProt(null); setCustomCarb(null); setCustomFat(null);
    setShowAdjust(false);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
  }, [form]);

  const handleReset = useCallback(() => {
    setForm(defaultForm); setResults(null);
    setStep(0); setDirection(1);
    setCustomProt(null); setCustomCarb(null); setCustomFat(null);
    setShowAdjust(false); setShowBF(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleCopy = useCallback(async () => {
    if (!results) return;
    const goal = GOAL_OPTIONS.find(g => g.value === form.goal)?.label ?? "";
    const diet = DIET_OPTIONS.find(d => d.value === form.diet)?.label ?? "";
    const text = [
      "── Macro Results — TheMealPrepIdeas.com ──",
      `Goal: ${goal} | Diet: ${diet}`,
      "", `BMR:  ${results.bmr} kcal`, `TDEE: ${results.tdee} kcal`,
      `Daily Target: ${results.calories} kcal`, "",
      `Protein: ${results.protein}g (${results.proteinPct}%)`,
      `Carbs:   ${results.carbs}g (${results.carbsPct}%)`,
      `Fat:     ${results.fat}g (${results.fatPct}%)`,
      `Fiber:   ~${results.fiber}g`, "",
      `Water: ~${results.water.toFixed(1)} L/day`,
      `BMI: ${results.bmi} (${results.bmiStatus})`,
    ].join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }, [results, form]);

  // Adjusted macros
  const activeProt = customProt ?? results?.proteinPct ?? 30;
  const activeCarb = customCarb ?? results?.carbsPct ?? 40;
  const activeFat = customFat ?? results?.fatPct ?? 30;
  const totalCal = results?.calories ?? 0;
  const adjProtein = Math.round((totalCal * activeProt / 100) / 4);
  const adjCarbs = Math.round((totalCal * activeCarb / 100) / 4);
  const adjFat = Math.round((totalCal * activeFat / 100) / 9);

  const handleAdjSlider = (macro: "prot" | "carb" | "fat", value: number) => {
    const rem = 100 - value;
    if (macro === "prot") {
      const cb = customCarb ?? results?.carbsPct ?? 40;
      const fb = customFat ?? results?.fatPct ?? 30;
      const tot = cb + fb || 1;
      setCustomProt(value); setCustomCarb(Math.round((cb / tot) * rem)); setCustomFat(Math.round((fb / tot) * rem));
    } else if (macro === "carb") {
      const pb = customProt ?? results?.proteinPct ?? 30;
      const fb = customFat ?? results?.fatPct ?? 30;
      const tot = pb + fb || 1;
      setCustomCarb(value); setCustomProt(Math.round((pb / tot) * rem)); setCustomFat(Math.round((fb / tot) * rem));
    } else {
      const pb = customProt ?? results?.proteinPct ?? 30;
      const cb = customCarb ?? results?.carbsPct ?? 40;
      const tot = pb + cb || 1;
      setCustomFat(value); setCustomProt(Math.round((pb / tot) * rem)); setCustomCarb(Math.round((cb / tot) * rem));
    }
  };

  const goalOption = GOAL_OPTIONS.find(g => g.value === form.goal);
  const goalTips = results ? GOAL_TIPS[form.goal] : [];
  const unitLabel = form.unit === "metric";

  return (
    <>
      <style>{`
        .macro-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 8px;
          border-radius: 999px;
          background: linear-gradient(to right, #3fa34d 0%, #3fa34d var(--fill), #e5e7eb var(--fill), #e5e7eb 100%);
          cursor: pointer;
          outline: none;
          transition: background 0.1s;
        }
        .macro-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 22px; height: 22px;
          border-radius: 50%;
          background: white;
          border: 3px solid #3fa34d;
          box-shadow: 0 2px 10px rgba(63,163,77,0.35);
          cursor: pointer;
          transition: box-shadow 0.15s, transform 0.15s;
        }
        .macro-slider::-webkit-slider-thumb:hover {
          box-shadow: 0 2px 16px rgba(63,163,77,0.55);
          transform: scale(1.1);
        }
        .macro-slider::-moz-range-thumb {
          width: 22px; height: 22px;
          border-radius: 50%;
          background: white;
          border: 3px solid #3fa34d;
          box-shadow: 0 2px 10px rgba(63,163,77,0.35);
          cursor: pointer;
        }
        .adj-slider { -webkit-appearance: none; appearance: none; height: 6px; border-radius: 999px; cursor: pointer; outline: none; }
        .adj-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: white; border: 3px solid currentColor; box-shadow: 0 1px 6px rgba(0,0,0,0.2); cursor: pointer; }
        .adj-slider::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: white; border: 3px solid currentColor; cursor: pointer; }
        @media print {
          header, footer, nav, .no-print { display: none !important; }
          .print-section { break-inside: avoid; }
          body { background: white !important; }
        }
      `}</style>

      {/* Hero */}
      <section className="relative overflow-hidden pb-8 pt-10 md:pb-10 md:pt-14 no-print">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <motion.div animate={{ x: [0,28,0], y: [0,-20,0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-32 left-[8%] h-[420px] w-[420px] rounded-full bg-gradient-to-br from-brand-primary/18 via-brand-orange/8 to-transparent blur-3xl" />
          <motion.div animate={{ x: [0,-24,0], y: [0,22,0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute right-[-80px] top-[80px] h-[300px] w-[300px] rounded-full bg-brand-orange/12 blur-3xl" />
        </div>
        <Container>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}
            className="mx-auto max-w-2xl text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-white/70 px-4 py-1.5 text-sm font-medium text-brand-primary-dark shadow-sm backdrop-blur">
              <Calculator className="size-4" />
              Free Nutrition Tool
            </div>
            <h1 className="mt-5 text-balance font-display text-[36px] leading-[1.12] text-brand-heading sm:text-[48px]">
              Macro <span className="text-brand-primary-dark">Calculator</span>
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-brand-body">
              Get your personalized daily calorie & macro targets — based on your body, activity, and fitness goal. Powered by the Mifflin-St Jeor equation.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Wizard Form */}
      <section className="pb-8 no-print">
        <Container>
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="mx-auto max-w-2xl">

            {/* Step Header */}
            <div className="mb-5 flex items-center justify-between px-1">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-brand-primary-dark">
                  Step {step + 1} of {STEPS.length}
                </div>
                <div className="mt-0.5 text-lg font-bold text-brand-heading">{STEPS[step]}</div>
              </div>
              <div className="flex gap-1.5">
                {STEPS.map((_, i) => (
                  <div key={i} className={cn("h-2 rounded-full transition-all duration-500",
                    i === step ? "w-8 bg-brand-primary" : i < step ? "w-4 bg-brand-primary/50" : "w-4 bg-brand-border"
                  )} />
                ))}
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-6 h-1 w-full overflow-hidden rounded-full bg-brand-border">
              <motion.div
                className="h-full rounded-full bg-brand-primary"
                animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>

            {/* Card */}
            <div className="overflow-hidden rounded-[20px] border border-brand-border bg-white shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div key={step} custom={direction}
                  variants={stepVariants} initial="enter" animate="center" exit="exit"
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="p-6 md:p-8"
                >
                  {/* ── STEP 0: About You ── */}
                  {step === 0 && (
                    <div className="space-y-7">
                      {/* Unit toggle */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-brand-heading">Units</span>
                        <div className="flex rounded-xl border border-brand-border bg-brand-gray p-1">
                          {(["metric", "imperial"] as UnitSystem[]).map(u => (
                            <button key={u} type="button"
                              onClick={() => setForm(f => ({ ...f, unit: u }))}
                              className={cn("rounded-lg px-5 py-1.5 text-sm font-semibold transition-all duration-200",
                                form.unit === u ? "bg-white text-brand-primary-dark shadow-sm" : "text-brand-light hover:text-brand-body"
                              )}>
                              {u === "metric" ? "Metric (kg/cm)" : "Imperial (lbs/ft)"}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Gender */}
                      <div className="space-y-3">
                        <span className="block text-sm font-semibold text-brand-heading">Gender</span>
                        <div className="grid grid-cols-2 gap-3">
                          {(["male", "female"] as Gender[]).map(g => (
                            <button key={g} type="button"
                              onClick={() => setForm(f => ({ ...f, gender: g }))}
                              className={cn("flex h-14 items-center justify-center gap-3 rounded-[14px] border text-sm font-semibold transition-all duration-200",
                                form.gender === g
                                  ? "border-brand-primary bg-brand-primary text-white shadow-[0_4px_16px_-4px_rgba(63,163,77,0.45)]"
                                  : "border-brand-border bg-brand-gray text-brand-body hover:border-brand-primary/40 hover:bg-white"
                              )}>
                              <span className="text-xl">{g === "male" ? "👨" : "👩"}</span>
                              {g === "male" ? "Male" : "Female"}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Age slider */}
                      <ValueSlider label="Age" value={form.age} min={10} max={80} unit="years"
                        onChange={v => setForm(f => ({ ...f, age: v }))} />

                      {/* Height */}
                      {unitLabel ? (
                        <ValueSlider label="Height" value={form.heightCm} min={140} max={220} unit="cm"
                          onChange={v => setForm(f => ({ ...f, heightCm: v }))} />
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-baseline justify-between">
                            <span className="text-sm font-semibold text-brand-heading">Height</span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-bold text-brand-primary-dark tabular-nums">{form.heightFt}'{form.heightIn}"</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <ValueSlider label="Feet" value={form.heightFt} min={4} max={7} unit="ft"
                              onChange={v => setForm(f => ({ ...f, heightFt: v }))} />
                            <ValueSlider label="Inches" value={form.heightIn} min={0} max={11} unit="in"
                              onChange={v => setForm(f => ({ ...f, heightIn: v }))} />
                          </div>
                        </div>
                      )}

                      {/* Weight */}
                      {unitLabel ? (
                        <ValueSlider label="Weight" value={form.weightKg} min={30} max={180} unit="kg"
                          onChange={v => setForm(f => ({ ...f, weightKg: v }))} />
                      ) : (
                        <ValueSlider label="Weight" value={form.weightLbs} min={65} max={400} unit="lbs"
                          onChange={v => setForm(f => ({ ...f, weightLbs: v }))} />
                      )}

                      {/* Body fat (optional) */}
                      <div className="rounded-[14px] border border-brand-border bg-brand-gray p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-semibold text-brand-heading">Body Fat % <span className="ml-1.5 rounded-full bg-brand-border px-2 py-0.5 text-xs font-normal text-brand-light">Optional</span></div>
                            <div className="mt-0.5 text-xs text-brand-light">Uses Katch-McArdle formula for more accuracy</div>
                          </div>
                          <button type="button" onClick={() => { setShowBF(v => !v); setForm(f => ({ ...f, bodyFatPct: !showBF ? 20 : null })); }}
                            className={cn("relative h-6 w-11 rounded-full transition-all duration-300", showBF ? "bg-brand-primary" : "bg-brand-border")}>
                            <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-300", showBF ? "left-[22px]" : "left-0.5")} />
                          </button>
                        </div>
                        <AnimatePresence>
                          {showBF && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                              <div className="mt-4">
                                <ValueSlider label="Body Fat" value={form.bodyFatPct ?? 20} min={5} max={50} unit="%"
                                  onChange={v => setForm(f => ({ ...f, bodyFatPct: v }))} />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}

                  {/* ── STEP 1: Activity ── */}
                  {step === 1 && (
                    <div className="space-y-3">
                      {ACTIVITY_OPTIONS.map(opt => {
                        const kcalEst = Math.round(1800 * opt.multiplier);
                        return (
                          <button key={opt.value} type="button"
                            onClick={() => setForm(f => ({ ...f, activity: opt.value }))}
                            className={cn("flex w-full items-center gap-4 rounded-[14px] border p-4 text-left transition-all duration-200",
                              form.activity === opt.value
                                ? "border-brand-primary bg-brand-primary/6 shadow-[0_2px_16px_-4px_rgba(63,163,77,0.3)]"
                                : "border-brand-border bg-white hover:border-brand-primary/30 hover:bg-brand-primary/3"
                            )}>
                            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-gray text-2xl">{opt.emoji}</span>
                            <div className="min-w-0 flex-1">
                              <div className={cn("font-semibold", form.activity === opt.value ? "text-brand-primary-dark" : "text-brand-heading")}>
                                {opt.label}
                              </div>
                              <div className="text-sm text-brand-light">{opt.desc}</div>
                            </div>
                            <div className="shrink-0 text-right">
                              <div className={cn("text-xs font-semibold", form.activity === opt.value ? "text-brand-primary-dark" : "text-brand-light")}>
                                ×{opt.multiplier}
                              </div>
                            </div>
                            {form.activity === opt.value && (
                              <div className="shrink-0">
                                <div className="flex size-6 items-center justify-center rounded-full bg-brand-primary text-white">
                                  <Check className="size-3.5" />
                                </div>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* ── STEP 2: Goal ── */}
                  {step === 2 && (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {GOAL_OPTIONS.map(opt => (
                        <button key={opt.value} type="button"
                          onClick={() => setForm(f => ({ ...f, goal: opt.value }))}
                          className={cn("flex flex-col items-start gap-2 rounded-[14px] border p-4 text-left transition-all duration-200",
                            form.goal === opt.value
                              ? "border-brand-primary bg-brand-primary/6 shadow-[0_2px_16px_-4px_rgba(63,163,77,0.3)]"
                              : "border-brand-border bg-white hover:border-brand-primary/30 hover:bg-brand-primary/3"
                          )}>
                          <div className="flex w-full items-center justify-between">
                            <span className="text-2xl">{opt.emoji}</span>
                            {form.goal === opt.value && (
                              <div className="flex size-5 items-center justify-center rounded-full bg-brand-primary text-white">
                                <Check className="size-3" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className={cn("font-semibold", form.goal === opt.value ? "text-brand-primary-dark" : "text-brand-heading")}>
                              {opt.label}
                            </div>
                            <div className="mt-0.5 text-xs text-brand-light">{opt.desc}</div>
                          </div>
                          <div className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", opt.tagColor)}>
                            {opt.adjustment === 0 ? "No adjustment" : `${opt.adjustment > 0 ? "+" : ""}${opt.adjustment} kcal/day`}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* ── STEP 3: Diet ── */}
                  {step === 3 && (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {DIET_OPTIONS.map(opt => (
                        <button key={opt.value} type="button"
                          onClick={() => setForm(f => ({ ...f, diet: opt.value }))}
                          className={cn("flex flex-col items-center gap-2 rounded-[14px] border p-4 text-center transition-all duration-200",
                            form.diet === opt.value
                              ? "border-brand-primary bg-brand-primary/6 shadow-[0_2px_16px_-4px_rgba(63,163,77,0.3)]"
                              : "border-brand-border bg-white hover:border-brand-primary/30 hover:bg-brand-primary/3"
                          )}>
                          <span className="text-3xl">{opt.emoji}</span>
                          <div className={cn("text-sm font-semibold", form.diet === opt.value ? "text-brand-primary-dark" : "text-brand-heading")}>
                            {opt.label}
                          </div>
                          <div className="rounded-full bg-brand-gray px-2 py-0.5 text-[11px] font-medium text-brand-light">
                            {opt.desc}
                          </div>
                          {form.diet === opt.value && (
                            <div className="flex size-5 items-center justify-center rounded-full bg-brand-primary text-white">
                              <Check className="size-3" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Nav footer */}
              <div className="flex items-center justify-between border-t border-brand-border bg-brand-gray/50 px-6 py-4">
                <button type="button" onClick={goBack}
                  className={cn("flex h-11 items-center gap-2 rounded-[12px] border border-brand-border bg-white px-5 text-sm font-semibold text-brand-body transition-all hover:border-brand-primary/30",
                    step === 0 && "invisible"
                  )}>
                  <ChevronLeft className="size-4" />
                  Back
                </button>

                {step < STEPS.length - 1 ? (
                  <button type="button" onClick={goNext}
                    className="flex h-11 items-center gap-2 rounded-[12px] bg-brand-primary px-6 text-sm font-semibold text-white shadow-[0_4px_16px_-4px_rgba(63,163,77,0.5)] transition-all hover:bg-brand-primary-dark active:scale-[0.97]">
                    Next
                    <ChevronRight className="size-4" />
                  </button>
                ) : (
                  <button type="button" onClick={handleCalculate}
                    className="flex h-11 items-center gap-2 rounded-[12px] bg-brand-primary px-6 text-sm font-semibold text-white shadow-[0_4px_16px_-4px_rgba(63,163,77,0.5)] transition-all hover:bg-brand-primary-dark active:scale-[0.97]">
                    <Calculator className="size-4" />
                    Calculate
                    <ArrowRight className="size-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Summary chips (after step 0) */}
            {step > 0 && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3 flex flex-wrap gap-2 px-1">
                {[
                  { label: `${form.gender === "male" ? "👨" : "👩"} ${form.gender === "male" ? "Male" : "Female"}`, step: 0 },
                  { label: `🎂 Age ${form.age}`, step: 0 },
                  { label: unitLabel ? `📏 ${form.heightCm}cm` : `📏 ${form.heightFt}'${form.heightIn}"`, step: 0 },
                  { label: unitLabel ? `⚖️ ${form.weightKg}kg` : `⚖️ ${form.weightLbs}lbs`, step: 0 },
                  ...(step > 1 ? [{ label: `${ACTIVITY_OPTIONS.find(a => a.value === form.activity)?.emoji} ${ACTIVITY_OPTIONS.find(a => a.value === form.activity)?.label}`, step: 1 }] : []),
                  ...(step > 2 ? [{ label: `${GOAL_OPTIONS.find(g => g.value === form.goal)?.emoji} ${GOAL_OPTIONS.find(g => g.value === form.goal)?.label}`, step: 2 }] : []),
                ].map(chip => (
                  <button key={chip.label} type="button" onClick={() => { setDirection(-1); setStep(chip.step); }}
                    className="rounded-full border border-brand-border bg-white px-3 py-1 text-xs font-medium text-brand-body shadow-sm hover:border-brand-primary/30 hover:bg-brand-primary/5 transition-all">
                    {chip.label}
                  </button>
                ))}
              </motion.div>
            )}
          </motion.div>
        </Container>
      </section>

      {/* Results */}
      <AnimatePresence>
        {results && (
          <motion.section ref={resultsRef}
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="pb-24 pt-2 print-section"
          >
            <Container>
              <div className="mx-auto max-w-4xl space-y-5">

                {/* Results heading */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between no-print">
                  <div>
                    <h2 className="font-display text-[26px] text-brand-heading">Your Daily Macro Results</h2>
                    <p className="text-sm text-brand-light">
                      {goalOption?.label} · {DIET_OPTIONS.find(d => d.value === form.diet)?.label} · {form.gender === "male" ? "Male" : "Female"}, {form.age}y
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={handleCopy}
                      className="flex h-9 items-center gap-2 rounded-[10px] border border-brand-border bg-white px-4 text-sm font-medium text-brand-body transition-all hover:border-brand-primary/30 hover:text-brand-primary-dark">
                      {copied ? <Check className="size-4 text-brand-primary" /> : <Copy className="size-4" />}
                      {copied ? "Copied!" : "Copy"}
                    </button>
                    <button type="button" onClick={() => window.print()}
                      className="flex h-9 items-center gap-2 rounded-[10px] border border-brand-border bg-white px-4 text-sm font-medium text-brand-body transition-all hover:border-brand-primary/30 hover:text-brand-primary-dark">
                      <Printer className="size-4" />
                      Print / PDF
                    </button>
                    <button type="button" onClick={handleReset}
                      className="flex h-9 items-center gap-2 rounded-[10px] border border-brand-border bg-white px-4 text-sm font-medium text-brand-body transition-all hover:border-brand-primary/30 hover:text-brand-primary-dark">
                      <RotateCcw className="size-4" />
                      Recalculate
                    </button>
                  </div>
                </div>

                {/* Top 3 stat cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 print-section">
                  {[
                    { label: "Basal Metabolic Rate", sub: "Calories at complete rest", value: results.bmr, icon: Activity, iconBg: "bg-blue-50", iconColor: "text-blue-600" },
                    { label: "Total Daily Expenditure", sub: "With activity level", value: results.tdee, icon: Flame, iconBg: "bg-orange-50", iconColor: "text-orange-500" },
                    { label: "Daily Calorie Target", sub: goalOption?.label ?? "", value: results.calories, icon: Target, iconBg: "bg-green-50", iconColor: "text-brand-primary-dark", featured: true },
                  ].map(({ label, sub, value, icon: Icon, iconBg, iconColor, featured }) => (
                    <div key={label} className={cn("relative overflow-hidden rounded-[20px] border p-5",
                      featured ? "border-brand-primary/25 bg-gradient-to-br from-brand-primary/8 to-white shadow-[0_4px_24px_-8px_rgba(63,163,77,0.3)]" : "border-brand-border bg-white"
                    )}>
                      {featured && <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-brand-primary/8" />}
                      <div className={cn("mb-3 inline-flex size-11 items-center justify-center rounded-xl", iconBg)}>
                        <Icon className={cn("size-5", iconColor)} />
                      </div>
                      <div className={cn("text-3xl font-bold tabular-nums", featured ? "text-brand-primary-dark" : "text-brand-heading")}>
                        <CountUp target={value} />
                      </div>
                      <div className="mt-0.5 text-xs font-medium text-brand-light">kcal / day</div>
                      <div className="mt-2 text-sm font-semibold text-brand-heading">{label}</div>
                      <div className="text-xs text-brand-light">{sub}</div>
                    </div>
                  ))}
                </div>

                {/* Macro breakdown + pie */}
                <div className="rounded-[20px] border border-brand-border bg-white p-6 shadow-sm print-section">
                  <h3 className="mb-5 font-semibold text-brand-heading">Macronutrient Breakdown</h3>
                  <div className="flex flex-col gap-8 md:flex-row md:items-center">
                    {/* Pie chart */}
                    <div className="mx-auto flex flex-col items-center gap-3 md:mx-0 md:w-48 md:shrink-0">
                      <DonutChartFinal
                        proteinPct={customProt ?? results.proteinPct}
                        carbsPct={customCarb ?? results.carbsPct}
                        fatPct={customFat ?? results.fatPct}
                      />
                      <div className="flex flex-wrap justify-center gap-3 text-xs font-medium">
                        <span className="flex items-center gap-1.5"><span className="inline-block size-2.5 rounded-full bg-brand-primary" />Protein</span>
                        <span className="flex items-center gap-1.5"><span className="inline-block size-2.5 rounded-full bg-brand-orange" />Carbs</span>
                        <span className="flex items-center gap-1.5"><span className="inline-block size-2.5 rounded-full bg-violet-500" />Fat</span>
                      </div>
                    </div>

                    {/* Bars */}
                    <div className="flex-1 space-y-5">
                      {[
                        { label: "Protein", grams: adjProtein, pct: customProt ?? results.proteinPct, color: "bg-brand-primary", bgColor: "bg-brand-primary/15" },
                        { label: "Carbohydrates", grams: adjCarbs, pct: customCarb ?? results.carbsPct, color: "bg-brand-orange", bgColor: "bg-orange-100" },
                        { label: "Fat", grams: adjFat, pct: customFat ?? results.fatPct, color: "bg-violet-500", bgColor: "bg-violet-100" },
                      ].map(m => <MacroBar key={m.label} {...m} />)}
                    </div>
                  </div>

                  {/* Macro summary numbers */}
                  <div className="mt-6 grid grid-cols-3 gap-3 border-t border-brand-border pt-5">
                    {[
                      { label: "Protein", grams: adjProtein, pct: customProt ?? results.proteinPct, cal: adjProtein * 4, color: "text-brand-primary-dark" },
                      { label: "Carbs", grams: adjCarbs, pct: customCarb ?? results.carbsPct, cal: adjCarbs * 4, color: "text-amber-600" },
                      { label: "Fat", grams: adjFat, pct: customFat ?? results.fatPct, cal: adjFat * 9, color: "text-violet-600" },
                    ].map(({ label, grams, pct, cal, color }) => (
                      <div key={label} className="rounded-[14px] bg-brand-gray p-3 text-center">
                        <div className={cn("text-2xl font-bold tabular-nums", color)}><CountUp target={grams} />g</div>
                        <div className="mt-0.5 text-xs font-medium text-brand-light">{pct}% · {cal} kcal</div>
                        <div className="mt-1 text-sm font-semibold text-brand-heading">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Extra stats row */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 print-section">
                  {[
                    { icon: Scale, iconBg: "bg-blue-50", iconColor: "text-blue-600", label: "BMI", value: `${results.bmi}`, sub: results.bmiStatus, subColor: results.bmiColor },
                    { icon: Droplets, iconBg: "bg-cyan-50", iconColor: "text-cyan-600", label: "Daily Water", value: `${results.water.toFixed(1)}L`, sub: "General estimate" },
                    { icon: Wheat, iconBg: "bg-amber-50", iconColor: "text-amber-600", label: "Fiber Target", value: `~${results.fiber}g`, sub: "Per day" },
                    {
                      icon: Target, iconBg: "bg-green-50", iconColor: "text-brand-primary-dark", label: "Ideal Weight",
                      value: unitLabel ? `${results.idealWeightMin}–${results.idealWeightMax}kg` : `${results.idealWeightMin}–${results.idealWeightMax}lbs`,
                      sub: "Hamwi formula"
                    },
                  ].map(({ icon: Icon, iconBg, iconColor, label, value, sub, subColor }) => (
                    <div key={label} className="rounded-[16px] border border-brand-border bg-white p-4">
                      <div className={cn("mb-2 inline-flex size-9 items-center justify-center rounded-xl", iconBg)}>
                        <Icon className={cn("size-4", iconColor)} />
                      </div>
                      <div className="text-xl font-bold text-brand-heading tabular-nums">{value}</div>
                      <div className={cn("text-xs font-medium", subColor ?? "text-brand-light")}>{sub}</div>
                      <div className="mt-1 text-sm font-semibold text-brand-heading">{label}</div>
                    </div>
                  ))}
                </div>

                {/* Customize macro split */}
                <div className="rounded-[20px] border border-brand-border bg-white print-section no-print">
                  <button type="button" onClick={() => setShowAdjust(v => !v)}
                    className="flex w-full items-center justify-between p-5 text-left">
                    <div className="flex items-center gap-2.5">
                      <RefreshCw className="size-4.5 text-brand-primary-dark" />
                      <span className="font-semibold text-brand-heading">Customize Macro Split</span>
                      <span className="rounded-full bg-brand-primary/10 px-2.5 py-0.5 text-xs font-medium text-brand-primary-dark">Optional</span>
                    </div>
                    <ChevronDown className={cn("size-4 text-brand-light transition-transform", showAdjust && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {showAdjust && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                        <div className="space-y-5 border-t border-brand-border px-5 pb-5 pt-4">
                          <p className="text-sm text-brand-light">
                            Adjust your macro split. Total calories stay fixed at <strong className="text-brand-heading">{results.calories.toLocaleString()} kcal</strong>.
                          </p>
                          {[
                            { label: "Protein", key: "prot" as const, value: customProt ?? results.proteinPct, color: "#3fa34d", bgColor: "bg-brand-primary/15" },
                            { label: "Carbohydrates", key: "carb" as const, value: customCarb ?? results.carbsPct, color: "#f59e0b", bgColor: "bg-orange-100" },
                            { label: "Fat", key: "fat" as const, value: customFat ?? results.fatPct, color: "#8b5cf6", bgColor: "bg-violet-100" },
                          ].map(({ label, key, value, color, bgColor }) => (
                            <div key={key} className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-semibold text-brand-heading">{label}</span>
                                <span className="font-bold" style={{ color }}>{value}%</span>
                              </div>
                              <input type="range" min={5} max={80} value={value} className="adj-slider w-full"
                                onChange={e => handleAdjSlider(key, parseInt(e.target.value, 10))}
                                style={{ background: `linear-gradient(to right, ${color} 0%, ${color} ${((value - 5) / 75) * 100}%, #e5e7eb ${((value - 5) / 75) * 100}%, #e5e7eb 100%)`, color }}
                              />
                            </div>
                          ))}
                          <div className="rounded-[12px] bg-brand-gray p-3 text-sm text-brand-light">
                            <Info className="mb-0.5 mr-1.5 inline size-3.5" />
                            Total: {(customProt ?? results.proteinPct) + (customCarb ?? results.carbsPct) + (customFat ?? results.fatPct)}% · Small rounding differences are normal.
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Water + Meal distribution */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 print-section">
                  <div className="rounded-[20px] border border-brand-border bg-white p-5">
                    <div className="mb-3 flex items-center gap-2.5">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50"><Droplets className="size-5 text-blue-500" /></div>
                      <div><div className="font-semibold text-brand-heading">Daily Water Intake</div><div className="text-xs text-brand-light">General estimate</div></div>
                    </div>
                    <div className="text-3xl font-bold text-blue-600">{results.water.toFixed(1)} L</div>
                    <p className="mt-2 text-xs text-brand-light">
                      ≈ {Math.round(results.water * 1000 / 237)} cups (8 oz). Increase during exercise or hot weather. This is a general guideline — individual needs vary.
                    </p>
                  </div>
                  <div className="rounded-[20px] border border-brand-border bg-white p-5">
                    <div className="mb-3 flex items-center gap-2.5">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-orange-50"><Utensils className="size-5 text-orange-500" /></div>
                      <div><div className="font-semibold text-brand-heading">Suggested Meal Split</div><div className="text-xs text-brand-light">3 meals + 2 snacks</div></div>
                    </div>
                    <div className="space-y-2">
                      {[{ name: "Breakfast", pct: 25 }, { name: "Lunch", pct: 30 }, { name: "Dinner", pct: 30 }, { name: "Snacks (×2)", pct: 15 }].map(({ name, pct }) => (
                        <div key={name} className="flex items-center justify-between text-sm">
                          <span className="text-brand-body">{name}</span>
                          <span className="font-semibold text-brand-heading">~{Math.round(results.calories * pct / 100)} kcal</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Goal tips */}
                <div className="rounded-[20px] border border-brand-primary/20 bg-gradient-to-br from-brand-primary/6 via-white to-white p-6 print-section">
                  <div className="mb-4 flex items-center gap-2.5">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-brand-primary/15">
                      {goalOption && goalOption.adjustment < 0 ? <TrendingDown className="size-5 text-brand-primary-dark" /> : goalOption && goalOption.adjustment > 0 ? <TrendingUp className="size-5 text-brand-primary-dark" /> : <Target className="size-5 text-brand-primary-dark" />}
                    </div>
                    <h3 className="font-semibold text-brand-heading">Tips for {goalOption?.label}</h3>
                  </div>
                  <ul className="space-y-3">
                    {goalTips.map((tip, i) => (
                      <li key={i} className="flex gap-3 text-sm text-brand-body">
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-primary/15 text-xs font-bold text-brand-primary-dark">{i + 1}</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Methodology */}
                <div className="rounded-[16px] bg-brand-gray px-5 py-4 text-sm text-brand-light print-section">
                  <Info className="mr-1.5 inline size-3.5" />
                  <strong className="text-brand-body">Methodology:</strong> BMR uses Mifflin-St Jeor (or Katch-McArdle when body fat % is provided). TDEE = BMR × activity multiplier. Calorie target = TDEE + goal adjustment. Macros split per dietary preference. Water: 35 ml/kg. Ideal weight: Hamwi formula ±10%. These are starting points — adjust based on results over 2–4 weeks.
                </div>

              </div>
            </Container>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Info cards (no results yet) */}
      {!results && (
        <section className="pb-20 no-print">
          <Container>
            <div className="mx-auto max-w-2xl">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { emoji: "🧪", title: "Science-Based", desc: "Mifflin-St Jeor + Katch-McArdle equations — the gold standard." },
                  { emoji: "🎯", title: "Goal-Specific", desc: "Calorie and macro targets tailored to your exact fitness goal." },
                  { emoji: "📊", title: "Visual & Clear", desc: "Charts, animated counters, BMI, fiber, water, and meal timing." },
                ].map(({ emoji, title, desc }) => (
                  <div key={title} className="rounded-[20px] border border-brand-border bg-white p-5">
                    <div className="mb-3 text-3xl">{emoji}</div>
                    <div className="font-semibold text-brand-heading">{title}</div>
                    <p className="mt-1 text-sm text-brand-light">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
