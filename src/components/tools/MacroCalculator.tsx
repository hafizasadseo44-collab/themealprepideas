"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator, RotateCcw, Copy, Printer, Check, ChevronDown,
  Flame, Activity, Target, Droplets, Utensils, Info,
  TrendingDown, TrendingUp, RefreshCw, Scale, Wheat,
  Zap, ChevronRight, ChevronLeft, Download, Edit3,
  Award, Heart, Star, ArrowRight,
} from "lucide-react";
import Container from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import { generatePrintHTML } from "./generatePrintHTML";

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
  { value: "sedentary",   label: "Sedentary",         desc: "Little or no exercise",       emoji: "🛋️", multiplier: 1.2,   color: "#64748b" },
  { value: "lightly",    label: "Lightly Active",    desc: "1–3 days/week",               emoji: "🚶", multiplier: 1.375, color: "#0ea5e9" },
  { value: "moderately", label: "Moderately Active", desc: "3–5 days/week",               emoji: "🏃", multiplier: 1.55,  color: "#3fa34d" },
  { value: "very",       label: "Very Active",        desc: "6–7 days/week",               emoji: "🏋️", multiplier: 1.725, color: "#f59e0b" },
  { value: "extremely",  label: "Extreme",            desc: "Physical job or twice daily", emoji: "⚡", multiplier: 1.9,   color: "#ef4444" },
];

const GOAL_OPTIONS: { value: FitnessGoal; label: string; short: string; emoji: string; adjustment: number; color: string }[] = [
  { value: "lose",      label: "Lose Weight",  short: "−500 kcal",   emoji: "📉", adjustment: -500, color: "#ef4444" },
  { value: "fat_loss",  label: "Fat Loss",     short: "−300 kcal",   emoji: "🔥", adjustment: -300, color: "#f97316" },
  { value: "recomp",    label: "Body Recomp",  short: "Maintenance", emoji: "⚖️", adjustment:  0,  color: "#3b82f6" },
  { value: "maintain",  label: "Maintain",     short: "Maintenance", emoji: "✅", adjustment:  0,  color: "#3fa34d" },
  { value: "lean_bulk", label: "Lean Bulk",    short: "+200 kcal",   emoji: "📈", adjustment: 200, color: "#0d9488" },
  { value: "build",     label: "Build Muscle", short: "+300 kcal",   emoji: "💪", adjustment: 300, color: "#7c3aed" },
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
function bmiLabel(bmi: number): { label: string; color: string; bg: string } {
  if (bmi < 18.5) return { label: "Underweight", color: "#3b82f6", bg: "#eff6ff" };
  if (bmi < 25)   return { label: "Normal",       color: "#3fa34d", bg: "#f0fdf4" };
  if (bmi < 30)   return { label: "Overweight",   color: "#f59e0b", bg: "#fffbeb" };
  return                   { label: "Obese",        color: "#ef4444", bg: "#fef2f2" };
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

const defaultForm: FormData = {
  gender: "male", age: 25, unit: "metric",
  heightCm: 175, heightFt: 5, heightIn: 8,
  weightKg: 70, weightLbs: 155,
  bodyFatPct: null,
  activity: "moderately", goal: "maintain", diet: "balanced",
};

// ─── Animated Number ──────────────────────────────────────────────────────────
function LiveNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);
  useEffect(() => {
    if (value === prevRef.current) return;
    prevRef.current = value;
    const start = Date.now();
    const from = display;
    const to = value;
    const dur = 500;
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

// ─── Animated Macro Bar ───────────────────────────────────────────────────────
function MacroBar({ label, grams, kcal, pct, color, bgColor, icon }: {
  label: string; grams: number; kcal: number; pct: number;
  color: string; bgColor: string; icon: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-lg" style={{ backgroundColor: bgColor }}>
            <span style={{ color }}>{icon}</span>
          </div>
          <span className="text-sm font-bold text-gray-700">{label}</span>
        </div>
        <div className="text-right">
          <span className="text-sm font-black tabular-nums" style={{ color }}><LiveNumber value={grams} />g</span>
          <span className="ml-1.5 text-xs text-gray-400">{pct}%</span>
        </div>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: bgColor }}>
        <motion.div
          className="h-full rounded-full"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ backgroundColor: color }}
        />
      </div>
      <p className="text-right text-[11px] text-gray-400"><LiveNumber value={kcal} /> kcal</p>
    </div>
  );
}

// ─── Slider Field ─────────────────────────────────────────────────────────────
function SliderField({ label, value, min, max, step = 1, unit, onChange }: {
  label: string; value: number; min: number; max: number;
  step?: number; unit: string; onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-600">{label}</label>
        <div className="flex items-baseline gap-1 rounded-lg bg-brand-primary/8 px-3 py-1">
          <span className="text-lg font-black tabular-nums text-brand-primary-dark">{value}</span>
          <span className="text-xs font-bold text-brand-primary/60">{unit}</span>
        </div>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="macro-slider w-full"
        style={{ "--fill": `${pct}%` } as React.CSSProperties}
      />
      <div className="flex justify-between text-[10px] text-gray-300">
        <span>{min} {unit}</span><span>{max} {unit}</span>
      </div>
    </div>
  );
}

// ─── Step Indicator ───────────────────────────────────────────────────────────
const STEPS = [
  { label: "Your Info",       icon: "👤" },
  { label: "Activity",        icon: "🏃" },
  { label: "Your Goal",       icon: "🎯" },
  { label: "Diet Style",      icon: "🥗" },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="mb-7 flex items-center justify-between">
      {STEPS.map((step, i) => {
        const done    = i < current;
        const active  = i === current;
        return (
          <div key={i} className="flex flex-1 flex-col items-center">
            <div className="relative flex w-full items-center">
              {i > 0 && (
                <div className="absolute left-0 right-1/2 top-1/2 h-0.5 -translate-y-1/2">
                  <div className={cn("h-full rounded-full transition-all duration-500", done ? "bg-brand-primary" : "bg-gray-200")} />
                </div>
              )}
              {i < STEPS.length - 1 && (
                <div className="absolute left-1/2 right-0 top-1/2 h-0.5 -translate-y-1/2">
                  <div className={cn("h-full rounded-full transition-all duration-500", done ? "bg-brand-primary" : "bg-gray-200")} />
                </div>
              )}
              <div className="relative z-10 mx-auto flex size-9 items-center justify-center rounded-full border-2 transition-all duration-300"
                style={{
                  backgroundColor: done ? "#3fa34d" : active ? "#fff" : "#f8f9fa",
                  borderColor: done || active ? "#3fa34d" : "#e5e7eb",
                  boxShadow: active ? "0 0 0 4px rgba(63,163,77,0.15)" : "none",
                }}>
                {done
                  ? <Check className="size-4 text-white stroke-[3]" />
                  : <span className={cn("text-sm font-black", active ? "text-brand-primary-dark" : "text-gray-400")}>{i + 1}</span>
                }
              </div>
            </div>
            <span className={cn("mt-2 hidden text-[11px] font-semibold sm:block", active ? "text-brand-primary-dark" : done ? "text-gray-500" : "text-gray-300")}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MacroCalculator() {
  const [form, setForm]       = useState<FormData>(defaultForm);
  const [step, setStep]       = useState(0);
  const [copied, setCopied]   = useState(false);
  const [showBF, setShowBF]   = useState(false);
  const [showAdjust, setShowAdjust] = useState(false);
  const [showTips, setShowTips]     = useState(false);
  const [customProt, setCustomProt] = useState<number | null>(null);
  const [customCarb, setCustomCarb] = useState<number | null>(null);
  const [customFat, setCustomFat]   = useState<number | null>(null);
  const [direction, setDirection]   = useState<1 | -1>(1);

  const results    = useMemo(() => calculateMacros(form), [form]);
  const isMetric   = form.unit === "metric";

  const activeProt = customProt ?? results.proteinPct;
  const activeCarb = customCarb ?? results.carbsPct;
  const activeFat  = customFat  ?? results.fatPct;
  const adjProtein = Math.round((results.calories * activeProt / 100) / 4);
  const adjCarbs   = Math.round((results.calories * activeCarb / 100) / 4);
  const adjFat     = Math.round((results.calories * activeFat  / 100) / 9);

  const goalOpt = GOAL_OPTIONS.find(g => g.value === form.goal)!;
  const bmiInfo = bmiLabel(results.bmi);

  const handleNext = () => { setDirection(1); setStep(s => Math.min(s + 1, 3)); };
  const handleBack = () => { setDirection(-1); setStep(s => Math.max(s - 1, 0)); };

  const handleReset = useCallback(() => {
    setForm(defaultForm);
    setCustomProt(null); setCustomCarb(null); setCustomFat(null);
    setShowBF(false); setShowAdjust(false); setShowTips(false);
    setStep(0);
  }, []);

  const handlePrint = useCallback(() => {
    const html = generatePrintHTML({ form, results, adjProtein, adjCarbs, adjFat, activeProt, activeCarb, activeFat });
    const win = window.open("", "_blank");
    if (win) { win.document.write(html); win.document.close(); }
  }, [form, results, adjProtein, adjCarbs, adjFat, activeProt, activeCarb, activeFat]);

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

  // ── Donut chart ──
  const r = 68, cx = 80, cy = 80, circ = 2 * Math.PI * r;
  const donutData = [
    { pct: activeProt, color: "#3fa34d", label: "Protein"  },
    { pct: activeCarb, color: "#f59e0b", label: "Carbs"    },
    { pct: activeFat,  color: "#8b5cf6", label: "Fat"      },
  ];
  let cumPct = 0;

  const stepVariants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 48 : -48 }),
    center: { opacity: 1, x: 0 },
    exit:  (d: number) => ({ opacity: 0, x: d > 0 ? -48 : 48 }),
  };

  return (
    <>
      <style>{`
        .macro-slider {
          -webkit-appearance: none; appearance: none;
          height: 8px; border-radius: 999px; cursor: pointer; outline: none; width: 100%;
          background: linear-gradient(to right, #3fa34d 0%, #3fa34d var(--fill), #e5e7eb var(--fill), #e5e7eb 100%);
        }
        .macro-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 22px; height: 22px; border-radius: 50%;
          background: #fff; border: 3px solid #3fa34d;
          box-shadow: 0 0 0 3px rgba(63,163,77,0.18), 0 2px 8px rgba(0,0,0,0.12);
          cursor: pointer; transition: transform .15s, box-shadow .15s;
        }
        .macro-slider::-webkit-slider-thumb:hover { transform: scale(1.2); box-shadow: 0 0 0 6px rgba(63,163,77,0.22); }
        .macro-slider::-moz-range-thumb { width: 22px; height: 22px; border-radius: 50%; background: #fff; border: 3px solid #3fa34d; cursor: pointer; }
        .adj-slider { -webkit-appearance: none; appearance: none; height: 6px; border-radius: 999px; cursor: pointer; outline: none; width: 100%; }
        .adj-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: #fff; border: 3px solid currentColor; box-shadow: 0 1px 4px rgba(0,0,0,0.15); cursor: pointer; transition: transform .15s; }
        .adj-slider::-webkit-slider-thumb:hover { transform: scale(1.18); }
        .adj-slider::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: #fff; border: 3px solid currentColor; cursor: pointer; }
        .results-scroll::-webkit-scrollbar { width: 4px; }
        .results-scroll::-webkit-scrollbar-track { background: transparent; }
        .results-scroll::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 999px; }
        @keyframes float-y { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes float-x { 0%,100%{transform:translateX(0) rotate(0deg)} 50%{transform:translateX(8px) rotate(3deg)} }
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:.4} 100%{transform:scale(1.5);opacity:0} }
        .float-y { animation: float-y 6s ease-in-out infinite; }
        .float-x { animation: float-x 8s ease-in-out infinite; }
        .pulse-ring::after { content:''; position:absolute; inset:0; border-radius:50%; border:2px solid #3fa34d; animation: pulse-ring 2s ease-out infinite; }
      `}</style>

      {/* ═══ HERO ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f0fdf4] via-white to-white pt-10 pb-0 no-print">
        {/* BG blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-brand-primary/10 blur-[90px]" />
          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-brand-orange/10 blur-[70px]" />
          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-emerald-400/8 blur-[60px]" />
        </div>

        <Container className="relative">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
            {/* Left: Text */}
            <motion.div initial={{ opacity: 0, x: -32 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-primary/25 bg-white/90 px-4 py-1.5 text-xs font-bold tracking-widest text-brand-primary-dark shadow-sm backdrop-blur-sm">
                <Zap className="size-3.5 fill-current" />
                Smart Nutrition Tool
              </div>

              <h1 className="mt-5 font-display text-[42px] leading-[1.05] text-gray-900 sm:text-[52px] lg:text-[58px]">
                Macro{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-brand-primary to-emerald-500 bg-clip-text text-transparent">Calculator</span>
                  <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute -bottom-1 left-0 right-0 h-[3px] origin-left rounded-full bg-gradient-to-r from-brand-primary to-brand-orange" />
                </span>
              </h1>

              <p className="mt-4 max-w-md text-base leading-relaxed text-gray-500 sm:text-lg">
                Discover your daily calorie and macronutrient needs. Plan your meals, reach your goals — powered by science.
              </p>

              {/* Feature pills */}
              <div className="mt-7 flex flex-wrap gap-3">
                {[
                  { icon: <Target className="size-4" />, label: "Reach Your Fitness Goals",  color: "bg-orange-50 text-orange-600 border-orange-100" },
                  { icon: <Award  className="size-4" />, label: "Get Accurate Macros",        color: "bg-green-50 text-green-700 border-green-100" },
                  { icon: <Utensils className="size-4" />, label: "Plan Better Meals",         color: "bg-violet-50 text-violet-700 border-violet-100" },
                ].map(({ icon, label, color }) => (
                  <div key={label} className={cn("flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold", color)}>
                    {icon}{label}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Hero imagery */}
            <motion.div initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative hidden lg:flex lg:items-end lg:justify-center">
              {/* Background shape */}
              <div className="absolute inset-0 rounded-[48px] bg-gradient-to-br from-brand-primary/15 via-emerald-100/40 to-transparent" />

              {/* Floating food card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-4 top-6 z-20 rounded-2xl bg-white p-3 shadow-[0_8px_32px_-6px_rgba(0,0,0,0.18)]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="size-10 overflow-hidden rounded-xl">
                    <img
                      src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=80&q=80"
                      alt="healthy bowl"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Healthy Bowl</p>
                    <p className="text-[11px] text-gray-400">450 kcal · 35g protein</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating stat card */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute right-4 top-10 z-20 rounded-2xl bg-white p-3 shadow-[0_8px_32px_-6px_rgba(0,0,0,0.18)]"
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Daily Goal</p>
                <p className="mt-0.5 text-2xl font-black text-brand-primary-dark"><LiveNumber value={results.calories} /></p>
                <p className="text-xs text-gray-400">kcal/day</p>
              </motion.div>

              {/* Eat Smart badge */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-16 right-6 z-20 rounded-2xl bg-gradient-to-br from-brand-primary to-emerald-600 px-4 py-2.5 shadow-lg"
              >
                <p className="font-display text-sm italic leading-tight text-white">Eat Smart,<br />Live Better</p>
              </motion.div>

              {/* Main athlete image */}
              <div className="relative z-10 mx-auto h-[340px] w-[280px] overflow-hidden rounded-[40px] shadow-[0_24px_60px_-16px_rgba(63,163,77,0.35)]">
                <img
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=560&q=85"
                  alt="Fit woman with healthy smoothie"
                  className="h-full w-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/20 via-transparent to-transparent" />
              </div>

              {/* Food image */}
              <div className="absolute -bottom-4 left-8 z-20 h-28 w-28 overflow-hidden rounded-[24px] border-4 border-white shadow-[0_12px_30px_-8px_rgba(0,0,0,0.2)]">
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80"
                  alt="healthy food"
                  className="h-full w-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ═══ CALCULATOR ══════════════════════════════════════════════════════════ */}
      <section className="pb-20 pt-10 no-print">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1fr_460px] xl:grid-cols-[1fr_480px]">

            {/* ── LEFT: Step wizard ────────────────────────────────────────────── */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <div className="overflow-hidden rounded-3xl bg-white shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.04]">
                {/* Step header */}
                <div className="border-b border-gray-100 p-6 pb-5">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="flex size-8 items-center justify-center rounded-full bg-brand-primary text-sm font-black text-white">
                      {step + 1}
                    </span>
                    <h2 className="text-lg font-black text-gray-900">{STEPS[step].label}</h2>
                    <span className="ml-auto rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-500">
                      Step {step + 1} of {STEPS.length}
                    </span>
                  </div>
                  <StepIndicator current={step} />
                </div>

                {/* Step content */}
                <div className="overflow-hidden">
                  <AnimatePresence custom={direction} mode="wait">
                    <motion.div
                      key={step}
                      custom={direction}
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="p-6"
                    >
                      {/* ── STEP 0: Personal Info ── */}
                      {step === 0 && (
                        <div className="space-y-6">
                          {/* Unit */}
                          <div>
                            <p className="mb-2.5 text-sm font-semibold text-gray-600">Unit System</p>
                            <div className="flex gap-2 rounded-xl bg-gray-100/70 p-1">
                              {(["metric", "imperial"] as UnitSystem[]).map(u => (
                                <button key={u} type="button" onClick={() => setForm(f => ({ ...f, unit: u }))}
                                  className={cn("relative flex-1 rounded-lg py-2.5 text-sm font-bold transition-all duration-200",
                                    form.unit === u ? "bg-white text-brand-primary-dark shadow-md" : "text-gray-500 hover:text-gray-700"
                                  )}>
                                  {form.unit === u && (
                                    <motion.span layoutId="unit-pill" className="absolute inset-0 rounded-lg bg-white shadow-md" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                                  )}
                                  <span className="relative z-10">{u === "metric" ? "⚖️  Metric (kg / cm)" : "🇺🇸  Imperial (lbs / ft)"}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Gender */}
                          <div>
                            <p className="mb-2.5 text-sm font-semibold text-gray-600">Biological Sex</p>
                            <div className="grid grid-cols-2 gap-3">
                              {(["male", "female"] as Gender[]).map(g => (
                                <button key={g} type="button" onClick={() => setForm(f => ({ ...f, gender: g }))}
                                  className={cn("relative flex items-center gap-3 rounded-xl border-2 px-4 py-4 font-bold transition-all duration-200",
                                    form.gender === g
                                      ? "border-brand-primary bg-brand-primary/6 shadow-sm"
                                      : "border-gray-100 bg-gray-50 text-gray-600 hover:border-brand-primary/30 hover:bg-white"
                                  )}>
                                  <span className="text-2xl">{g === "male" ? "👨" : "👩"}</span>
                                  <span className={cn("text-sm", form.gender === g ? "text-brand-primary-dark" : "text-gray-700")}>{g === "male" ? "Male" : "Female"}</span>
                                  {form.gender === g && (
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 flex size-5 items-center justify-center rounded-full bg-brand-primary">
                                      <Check className="size-3 text-white stroke-[3]" />
                                    </span>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>

                          <SliderField label="Age" value={form.age} min={10} max={80} unit="yrs"
                            onChange={v => setForm(f => ({ ...f, age: v }))} />

                          {isMetric ? (
                            <SliderField label="Height" value={form.heightCm} min={140} max={220} unit="cm"
                              onChange={v => setForm(f => ({ ...f, heightCm: v }))} />
                          ) : (
                            <div className="grid grid-cols-2 gap-5">
                              <SliderField label="Feet" value={form.heightFt} min={4} max={7} unit="ft"
                                onChange={v => setForm(f => ({ ...f, heightFt: v }))} />
                              <SliderField label="Inches" value={form.heightIn} min={0} max={11} unit="in"
                                onChange={v => setForm(f => ({ ...f, heightIn: v }))} />
                            </div>
                          )}

                          {isMetric ? (
                            <SliderField label="Weight" value={form.weightKg} min={30} max={180} unit="kg"
                              onChange={v => setForm(f => ({ ...f, weightKg: v }))} />
                          ) : (
                            <SliderField label="Weight" value={form.weightLbs} min={65} max={400} unit="lbs"
                              onChange={v => setForm(f => ({ ...f, weightLbs: v }))} />
                          )}

                          {/* Optional body fat */}
                          <div className="rounded-xl border border-dashed border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-semibold text-gray-700">
                                  Body Fat %{" "}
                                  <span className="ml-1.5 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-400">OPTIONAL</span>
                                </p>
                                <p className="mt-0.5 text-xs text-gray-400">Enables Katch-McArdle formula</p>
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
                      )}

                      {/* ── STEP 1: Activity Level ── */}
                      {step === 1 && (
                        <div className="grid gap-2.5">
                          {ACTIVITY_OPTIONS.map(opt => (
                            <button key={opt.value} type="button"
                              onClick={() => setForm(f => ({ ...f, activity: opt.value }))}
                              className={cn(
                                "group relative flex items-center gap-4 overflow-hidden rounded-xl border-2 p-4 text-left transition-all duration-200",
                                form.activity === opt.value
                                  ? "border-brand-primary bg-brand-primary/5 shadow-sm"
                                  : "border-gray-100 bg-gray-50/80 hover:border-brand-primary/30 hover:bg-white"
                              )}>
                              {form.activity === opt.value && (
                                <span className="absolute inset-y-0 left-0 w-1 rounded-r-full bg-brand-primary" />
                              )}
                              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl text-2xl"
                                style={{ backgroundColor: `${opt.color}18` }}>
                                {opt.emoji}
                              </span>
                              <div className="flex-1">
                                <p className={cn("font-bold", form.activity === opt.value ? "text-brand-primary-dark" : "text-gray-800")}>
                                  {opt.label}
                                </p>
                                <p className="text-sm text-gray-500">{opt.desc}</p>
                              </div>
                              <span className="shrink-0 rounded-lg px-2.5 py-1 text-xs font-black"
                                style={{ backgroundColor: `${opt.color}18`, color: opt.color }}>
                                ×{opt.multiplier}
                              </span>
                              {form.activity === opt.value && (
                                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-primary">
                                  <Check className="size-3.5 text-white stroke-[3]" />
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* ── STEP 2: Fitness Goal ── */}
                      {step === 2 && (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                          {GOAL_OPTIONS.map(opt => (
                            <button key={opt.value} type="button"
                              onClick={() => setForm(f => ({ ...f, goal: opt.value }))}
                              className={cn(
                                "relative flex flex-col gap-2.5 rounded-xl border-2 p-4 text-left transition-all duration-200",
                                form.goal === opt.value ? "border-brand-primary shadow-sm" : "border-gray-100 bg-gray-50/80 hover:border-brand-primary/30 hover:bg-white"
                              )}
                              style={form.goal === opt.value ? { background: `linear-gradient(135deg,${opt.color}0d,white)` } : {}}>
                              <span className="flex size-11 items-center justify-center rounded-xl text-2xl"
                                style={{ backgroundColor: `${opt.color}15` }}>
                                {opt.emoji}
                              </span>
                              <div>
                                <p className="text-sm font-black text-gray-800">{opt.label}</p>
                                <p className="mt-0.5 text-xs font-bold" style={{ color: opt.color }}>{opt.short}</p>
                              </div>
                              {form.goal === opt.value && (
                                <span className="absolute right-2.5 top-2.5 flex size-5 items-center justify-center rounded-full bg-brand-primary">
                                  <Check className="size-3 text-white stroke-[3]" />
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* ── STEP 3: Diet Style ── */}
                      {step === 3 && (
                        <div className="space-y-5">
                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {DIET_OPTIONS.map(opt => (
                              <button key={opt.value} type="button"
                                onClick={() => { setForm(f => ({ ...f, diet: opt.value })); setCustomProt(null); setCustomCarb(null); setCustomFat(null); }}
                                className={cn(
                                  "relative flex flex-col items-center gap-2.5 rounded-xl border-2 p-4 text-center transition-all duration-200",
                                  form.diet === opt.value ? "border-brand-primary bg-brand-primary/5 shadow-sm" : "border-gray-100 bg-gray-50/80 hover:border-brand-primary/30 hover:bg-white"
                                )}>
                                <span className="text-3xl">{opt.emoji}</span>
                                <span className={cn("text-sm font-black", form.diet === opt.value ? "text-brand-primary-dark" : "text-gray-800")}>
                                  {opt.label}
                                </span>
                                <div className="w-full space-y-1">
                                  {[{ pct: opt.prot, c: "#3fa34d" }, { pct: opt.carb, c: "#f59e0b" }, { pct: opt.fat, c: "#8b5cf6" }].map(b => (
                                    <div key={b.c} className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                                      <div className="h-full rounded-full" style={{ width: `${b.pct}%`, backgroundColor: b.c }} />
                                    </div>
                                  ))}
                                </div>
                                <span className="text-[10px] font-semibold text-gray-400">P{opt.prot} · C{opt.carb} · F{opt.fat}</span>
                                {form.diet === opt.value && (
                                  <span className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-brand-primary">
                                    <Check className="size-3 text-white stroke-[3]" />
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>

                          {/* Success banner on step 3 */}
                          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-brand-primary/10 to-emerald-50 p-4 ring-1 ring-brand-primary/20">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white">
                              <Check className="size-5" />
                            </div>
                            <div>
                              <p className="font-black text-brand-primary-dark">Your plan is live on the right →</p>
                              <p className="text-sm text-gray-500">Results update in real-time as you change any value.</p>
                            </div>
                          </motion.div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Step navigation */}
                <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
                  <button type="button" onClick={handleReset}
                    className="flex items-center gap-1.5 text-sm font-semibold text-gray-400 transition-colors hover:text-gray-600">
                    <RotateCcw className="size-3.5" /> Reset
                  </button>
                  <div className="flex gap-2.5">
                    {step > 0 && (
                      <button type="button" onClick={handleBack}
                        className="flex items-center gap-1.5 rounded-xl border-2 border-gray-200 bg-gray-50 px-5 py-2.5 text-sm font-bold text-gray-600 transition-all hover:border-gray-300 hover:bg-white">
                        <ChevronLeft className="size-4" /> Back
                      </button>
                    )}
                    {step < STEPS.length - 1 ? (
                      <button type="button" onClick={handleNext}
                        className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-primary to-emerald-500 px-5 py-2.5 text-sm font-bold text-white shadow-[0_4px_16px_-4px_rgba(63,163,77,0.5)] transition-all hover:shadow-[0_6px_20px_-4px_rgba(63,163,77,0.6)] hover:scale-[1.02] active:scale-[0.99]">
                        Next Step <ChevronRight className="size-4" />
                      </button>
                    ) : (
                      <button type="button" onClick={() => setStep(0)}
                        className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-primary to-emerald-500 px-5 py-2.5 text-sm font-bold text-white shadow-[0_4px_16px_-4px_rgba(63,163,77,0.5)] transition-all hover:scale-[1.02]">
                        <Edit3 className="size-4" /> Edit Info
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── RIGHT: Live Results Panel ─────────────────────────────────────── */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="results-scroll lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto">
              <div className="overflow-hidden rounded-3xl bg-white shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.04]">

                {/* Plan ready header */}
                <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50/60 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white">
                      <Check className="size-5" />
                      <span className="absolute inset-0 rounded-full border-2 border-brand-primary opacity-40 animate-ping" style={{ animationDuration: "2.5s" }} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-brand-primary-dark">Your Personalized Macro Plan</p>
                      <p className="text-xs text-gray-500">Updates live as you change values</p>
                    </div>
                  </div>
                  <button type="button" onClick={handlePrint}
                    className="flex items-center gap-1.5 rounded-xl bg-brand-primary px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-brand-primary-dark hover:shadow-md">
                    <Download className="size-3.5" /> Save
                  </button>
                </div>

                {/* 3 stat cards */}
                <div className="grid grid-cols-3 gap-3 p-5 pb-0">
                  {[
                    { label: "Daily Calories", value: results.calories, sub: "kcal/day", icon: <Flame className="size-5" />, from: "#fdba74", to: "#f97316", bg: "#fff7ed" },
                    { label: "BMR",            value: results.bmr,      sub: "kcal/day", icon: <Activity className="size-5" />, from: "#93c5fd", to: "#3b82f6", bg: "#eff6ff" },
                    { label: "TDEE",           value: results.tdee,     sub: "kcal/day", icon: <Zap className="size-5" />,      from: "#c4b5fd", to: "#8b5cf6", bg: "#faf5ff" },
                  ].map(({ label, value, sub, icon, from, to, bg }) => (
                    <motion.div key={label} whileHover={{ y: -2 }} className="flex flex-col items-center rounded-2xl p-3.5 text-center" style={{ backgroundColor: bg }}>
                      <div className="flex size-10 items-center justify-center rounded-xl" style={{ background: `linear-gradient(135deg,${from},${to})` }}>
                        <span className="text-white">{icon}</span>
                      </div>
                      <p className="mt-2 text-[11px] font-semibold text-gray-500">{label}</p>
                      <p className="mt-0.5 text-xl font-black tabular-nums text-gray-900">
                        <LiveNumber value={value} />
                      </p>
                      <p className="text-[10px] text-gray-400">{sub}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Donut chart + breakdown */}
                <div className="p-5">
                  <div className="rounded-2xl bg-gray-50/70 p-4">
                    <p className="mb-4 text-xs font-black uppercase tracking-widest text-gray-400">Macronutrient Breakdown</p>
                    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
                      {/* Donut */}
                      <div className="relative shrink-0">
                        <svg viewBox="0 0 160 160" className="h-[140px] w-[140px]" aria-hidden>
                          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={16} />
                          {donutData.map(({ pct, color }) => {
                            const dash = (pct / 100) * circ - 2;
                            const rot  = (cumPct / 100) * 360 - 90;
                            const el = (
                              <motion.circle key={color} cx={cx} cy={cy} r={r}
                                fill="none" stroke={color} strokeWidth={16}
                                animate={{ strokeDasharray: `${Math.max(0, dash)} ${circ}` }}
                                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                                transform={`rotate(${rot} ${cx} ${cy})`} strokeLinecap="round"
                                style={{ strokeDasharray: `0 ${circ}` }}
                              />
                            );
                            cumPct += pct;
                            return el;
                          })}
                        </svg>
                        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl font-black tabular-nums text-gray-900">
                            <LiveNumber value={results.calories} />
                          </span>
                          <span className="text-xs font-semibold text-gray-400">kcal</span>
                        </div>
                      </div>

                      {/* Legend */}
                      <div className="flex-1 space-y-3 w-full">
                        {[
                          { label: "Protein", grams: adjProtein, pct: activeProt, kcal: adjProtein * 4, color: "#3fa34d", bg: "#dcfce7" },
                          { label: "Carbs",   grams: adjCarbs,   pct: activeCarb, kcal: adjCarbs   * 4, color: "#f59e0b", bg: "#fef9c3" },
                          { label: "Fats",    grams: adjFat,     pct: activeFat,  kcal: adjFat     * 9, color: "#8b5cf6", bg: "#ede9fe" },
                        ].map(({ label, grams, pct, kcal, color, bg }) => (
                          <div key={label} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                                <span className="font-semibold text-gray-700">{label}</span>
                              </div>
                              <div>
                                <span className="font-black tabular-nums" style={{ color }}><LiveNumber value={grams} />g</span>
                                <span className="ml-1 text-xs text-gray-400">≈{kcal} kcal</span>
                              </div>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: bg }}>
                              <motion.div className="h-full rounded-full" animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} style={{ backgroundColor: color }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Macro Progress (reference-style) */}
                <div className="border-t border-gray-100 p-5 pt-0">
                  <div className="rounded-2xl bg-white p-4 ring-1 ring-gray-100">
                    <p className="mb-4 text-xs font-black uppercase tracking-widest text-gray-400">Macro Progress</p>
                    <div className="space-y-4">
                      <MacroBar label="Protein" grams={adjProtein} kcal={adjProtein * 4} pct={activeProt} color="#3fa34d" bgColor="#dcfce7"
                        icon={<span className="text-sm">💪</span>} />
                      <MacroBar label="Carbs" grams={adjCarbs} kcal={adjCarbs * 4} pct={activeCarb} color="#f59e0b" bgColor="#fef9c3"
                        icon={<span className="text-sm">🌾</span>} />
                      <MacroBar label="Fats" grams={adjFat} kcal={adjFat * 9} pct={activeFat} color="#8b5cf6" bgColor="#ede9fe"
                        icon={<span className="text-sm">💧</span>} />
                    </div>
                  </div>
                </div>

                {/* 3-column info row */}
                <div className="grid grid-cols-3 gap-3 border-t border-gray-100 p-5">
                  {/* Water */}
                  <div className="rounded-xl bg-sky-50 p-3 text-center">
                    <div className="mx-auto flex size-8 items-center justify-center rounded-full bg-sky-100">
                      <Droplets className="size-4 text-sky-500" />
                    </div>
                    <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-sky-500">Water</p>
                    <p className="mt-1 text-base font-black text-gray-900">{results.water.toFixed(1)} L</p>
                    <p className="text-[10px] text-gray-400">per day</p>
                  </div>
                  {/* Meals */}
                  <div className="rounded-xl bg-amber-50 p-3 text-center">
                    <div className="mx-auto flex size-8 items-center justify-center rounded-full bg-amber-100">
                      <Utensils className="size-4 text-amber-600" />
                    </div>
                    <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-amber-600">Meals</p>
                    <p className="mt-1 text-base font-black text-gray-900">4–5</p>
                    <p className="text-[10px] text-gray-400">per day</p>
                  </div>
                  {/* BMI */}
                  <div className="rounded-xl p-3 text-center" style={{ backgroundColor: bmiInfo.bg }}>
                    <div className="mx-auto flex size-8 items-center justify-center rounded-full" style={{ backgroundColor: `${bmiInfo.color}22` }}>
                      <Scale className="size-4" style={{ color: bmiInfo.color }} />
                    </div>
                    <p className="mt-2 text-[10px] font-bold uppercase tracking-wide" style={{ color: bmiInfo.color }}>BMI</p>
                    <p className="mt-1 text-base font-black text-gray-900">{results.bmi}</p>
                    <p className="text-[10px]" style={{ color: bmiInfo.color }}>{results.bmiStatus}</p>
                  </div>
                </div>

                {/* Nutrition tips */}
                <div className="border-t border-gray-100 px-5 pb-5">
                  <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 p-4 ring-1 ring-orange-100/60">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="text-base">💡</span>
                      <p className="text-xs font-black text-orange-700">Nutrition Tips</p>
                    </div>
                    <ul className="space-y-2">
                      {["Choose lean protein sources", "Include plenty of vegetables", "Stay hydrated throughout the day"].map(tip => (
                        <li key={tip} className="flex items-center gap-2">
                          <div className="size-4 shrink-0 rounded-full bg-brand-primary/15 flex items-center justify-center">
                            <Check className="size-2.5 text-brand-primary" />
                          </div>
                          <span className="text-xs text-gray-600">{tip}</span>
                        </li>
                      ))}
                    </ul>
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
                <div className="grid grid-cols-2 gap-2.5 border-t border-gray-100 p-4 sm:grid-cols-4">
                  <button type="button" onClick={() => setStep(0)}
                    className="flex flex-col items-center gap-1.5 rounded-xl border-2 border-brand-primary/20 bg-brand-primary/5 py-3 text-xs font-bold text-brand-primary-dark transition-all hover:bg-brand-primary/10">
                    <Edit3 className="size-4" /> Edit Info
                  </button>
                  <button type="button" onClick={handleCopy}
                    className={cn("flex flex-col items-center gap-1.5 rounded-xl border-2 py-3 text-xs font-bold transition-all",
                      copied ? "border-brand-primary/30 bg-brand-primary/8 text-brand-primary-dark" : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                    )}>
                    {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <button type="button" onClick={handlePrint}
                    className="flex flex-col items-center gap-1.5 rounded-xl border-2 border-gray-200 bg-gray-50 py-3 text-xs font-bold text-gray-600 transition-all hover:border-gray-300">
                    <Printer className="size-4" /> Print
                  </button>
                  <button type="button" onClick={handlePrint}
                    className="flex flex-col items-center gap-1.5 rounded-xl border-2 border-gray-200 bg-gray-50 py-3 text-xs font-bold text-gray-600 transition-all hover:border-gray-300">
                    <Download className="size-4" /> PDF
                  </button>
                </div>

                {/* Methodology */}
                <div className="border-t border-gray-100 px-5 py-3.5 text-[11px] text-gray-400">
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
