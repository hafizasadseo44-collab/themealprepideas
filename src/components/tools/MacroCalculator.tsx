"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator, RotateCcw, Copy, Printer, Check, ChevronDown,
  ChevronLeft, ChevronRight, Flame, Activity, Target,
  Droplets, Utensils, Info, TrendingDown, TrendingUp,
  RefreshCw, ArrowRight, Scale, Wheat, Zap, Sparkles,
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

const ACTIVITY_OPTIONS: { value: ActivityLevel; label: string; desc: string; emoji: string; multiplier: number; color: string }[] = [
  { value: "sedentary", label: "Sedentary", desc: "Desk job, little to no exercise", emoji: "🛋️", multiplier: 1.2, color: "#64748b" },
  { value: "lightly", label: "Lightly Active", desc: "Light exercise 1–3 days/week", emoji: "🚶", multiplier: 1.375, color: "#0ea5e9" },
  { value: "moderately", label: "Moderately Active", desc: "Moderate exercise 3–5 days/week", emoji: "🏃", multiplier: 1.55, color: "#3fa34d" },
  { value: "very", label: "Very Active", desc: "Hard exercise 6–7 days/week", emoji: "🏋️", multiplier: 1.725, color: "#f59e0b" },
  { value: "extremely", label: "Extremely Active", desc: "Intense daily training or physical job", emoji: "⚡", multiplier: 1.9, color: "#ef4444" },
];

const GOAL_OPTIONS: { value: FitnessGoal; label: string; desc: string; emoji: string; adjustment: number; color: string; bg: string }[] = [
  { value: "lose", label: "Lose Weight", desc: "Moderate deficit", emoji: "📉", adjustment: -500, color: "#ef4444", bg: "from-red-50 to-red-50/30" },
  { value: "fat_loss", label: "Fat Loss", desc: "Smaller deficit, preserve muscle", emoji: "🔥", adjustment: -300, color: "#f97316", bg: "from-orange-50 to-orange-50/30" },
  { value: "recomp", label: "Body Recomp", desc: "Lose fat & gain muscle", emoji: "⚖️", adjustment: 0, color: "#3b82f6", bg: "from-blue-50 to-blue-50/30" },
  { value: "maintain", label: "Maintain Weight", desc: "Sustain current weight", emoji: "✅", adjustment: 0, color: "#3fa34d", bg: "from-green-50 to-green-50/30" },
  { value: "lean_bulk", label: "Lean Bulk", desc: "Minimal fat gain surplus", emoji: "📈", adjustment: 200, color: "#0d9488", bg: "from-teal-50 to-teal-50/30" },
  { value: "build", label: "Build Muscle", desc: "Maximize muscle growth", emoji: "💪", adjustment: 300, color: "#7c3aed", bg: "from-violet-50 to-violet-50/30" },
];

const DIET_OPTIONS: { value: DietaryPref; label: string; emoji: string; prot: number; carb: number; fat: number }[] = [
  { value: "balanced", label: "Balanced", emoji: "🥗", prot: 30, carb: 40, fat: 30 },
  { value: "high_protein", label: "High Protein", emoji: "🥩", prot: 40, carb: 35, fat: 25 },
  { value: "low_carb", label: "Low Carb", emoji: "🥦", prot: 35, carb: 25, fat: 40 },
  { value: "keto", label: "Keto", emoji: "🧈", prot: 25, carb: 5, fat: 70 },
  { value: "vegetarian", label: "Vegetarian", emoji: "🌱", prot: 25, carb: 50, fat: 25 },
  { value: "vegan", label: "Vegan", emoji: "🌿", prot: 20, carb: 55, fat: 25 },
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
function bmiLabel(bmi: number): { label: string; color: string; bg: string } {
  if (bmi < 18.5) return { label: "Underweight", color: "#3b82f6", bg: "#eff6ff" };
  if (bmi < 25) return { label: "Normal weight", color: "#3fa34d", bg: "#f0fdf4" };
  if (bmi < 30) return { label: "Overweight", color: "#f59e0b", bg: "#fffbeb" };
  return { label: "Obese", color: "#ef4444", bg: "#fef2f2" };
}

function calculateMacros(form: FormData): MacroResults {
  const { gender, age, unit, bodyFatPct } = form;
  let weightKg = unit === "metric" ? form.weightKg : form.weightLbs * 0.453592;
  let heightCm = unit === "metric" ? form.heightCm : (form.heightFt * 12 + form.heightIn) * 2.54;

  let bmr: number;
  if (bodyFatPct !== null) {
    const lbm = weightKg * (1 - bodyFatPct / 100);
    bmr = 370 + 21.6 * lbm;
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
  const fiber = Math.round(calories / 1000 * 14);
  const water = Math.round(weightKg * 35) / 1000;
  const bmi = weightKg / Math.pow(heightCm / 100, 2);
  const { label: bmiStatus, color: bmiColor } = bmiLabel(bmi);

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
    bmiStatus, bmiColor,
    idealWeightMin, idealWeightMax,
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepIndicator({ step, total, labels }: { step: number; total: number; labels: string[] }) {
  return (
    <div className="flex items-center justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <motion.div
              animate={{
                scale: i === step ? 1.1 : 1,
                boxShadow: i === step ? "0 0 0 5px rgba(63,163,77,0.18)" : "0 0 0 0px transparent",
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full text-sm font-black transition-colors duration-300",
                i < step ? "bg-brand-primary text-white" :
                i === step ? "bg-brand-primary text-white" :
                "bg-gray-100 text-gray-400"
              )}
            >
              {i < step ? <Check className="size-4 stroke-[3]" /> : <span>{i + 1}</span>}
            </motion.div>
            <span className={cn("hidden text-[10px] font-semibold uppercase tracking-wide sm:block",
              i === step ? "text-brand-primary-dark" : i < step ? "text-brand-primary/70" : "text-gray-400"
            )}>{labels[i]}</span>
          </div>
          {i < total - 1 && (
            <div className="relative mx-2 mb-5 h-0.5 w-6 overflow-hidden rounded-full bg-gray-200 sm:w-10">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-brand-primary"
                animate={{ width: i < step ? "100%" : "0%" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ValueSlider({ label, value, min, max, step = 1, unit, onChange, className }: {
  label: string; value: number; min: number; max: number;
  step?: number; unit: string; onChange: (v: number) => void; className?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className={cn("space-y-2.5", className)}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</label>
        <div className="flex items-baseline gap-1 rounded-xl bg-brand-primary/8 px-3 py-1.5">
          <span className="text-2xl font-black tabular-nums text-brand-primary-dark">{value}</span>
          <span className="text-xs font-bold text-brand-primary/60">{unit}</span>
        </div>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="macro-slider w-full"
        style={{ "--fill": `${pct}%` } as React.CSSProperties}
      />
      <div className="flex justify-between text-[11px] font-semibold text-gray-300">
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>
    </div>
  );
}

function AnimatedDonut({ proteinPct, carbsPct, fatPct }: { proteinPct: number; carbsPct: number; fatPct: number }) {
  const r = 68; const cx = 90; const cy = 90; const circ = 2 * Math.PI * r;
  const segments = [
    { pct: proteinPct, color: "#3fa34d" },
    { pct: carbsPct, color: "#f59e0b" },
    { pct: fatPct, color: "#8b5cf6" },
  ];
  let cum = 0;
  return (
    <svg viewBox="0 0 180 180" className="w-full max-w-[200px]" aria-hidden="true">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={24} />
      {segments.map(({ pct, color }, i) => {
        const dash = (pct / 100) * circ - 4;
        const rot = (cum / 100) * 360 - 90;
        cum += pct;
        return (
          <motion.circle
            key={color} cx={cx} cy={cy} r={r}
            fill="none" stroke={color} strokeWidth={24}
            initial={{ strokeDasharray: `0 ${circ}` }}
            animate={{ strokeDasharray: `${Math.max(0, dash)} ${circ}` }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: i * 0.18 }}
            transform={`rotate(${rot} ${cx} ${cy})`}
            strokeLinecap="round"
          />
        );
      })}
      <circle cx={cx} cy={cy} r={46} fill="white" />
      <text x={cx} y={cy - 7} textAnchor="middle" fontSize="9.5" fill="#94a3b8" fontWeight="700" fontFamily="inherit" letterSpacing="1.5">SPLIT</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="20" fontWeight="800" fill="#0f172a" fontFamily="inherit">P/C/F</text>
    </svg>
  );
}

function MacroBar({ label, grams, pct, color, bgColor, glowColor }: {
  label: string; grams: number; pct: number; color: string; bgColor: string; glowColor: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-sm font-bold text-gray-700">{label}</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-black tabular-nums" style={{ color }}>{grams}g</span>
          <span className="text-xs font-semibold text-gray-400">{pct}%</span>
        </div>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full" style={{ backgroundColor: bgColor }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 10px ${glowColor}` }}
        />
      </div>
    </div>
  );
}

function CountUp({ target, duration = 1300 }: { target: number; duration?: number }) {
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
  enter: (dir: number) => ({ x: dir * 48, opacity: 0, scale: 0.98 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir * -48, opacity: 0, scale: 0.98 }),
};

const childVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.055, duration: 0.42, ease: [0.22, 1, 0.36, 1] } }),
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
  const isMetric = form.unit === "metric";

  return (
    <>
      <style>{`
        .macro-slider {
          -webkit-appearance: none; appearance: none;
          height: 10px; border-radius: 999px;
          background: linear-gradient(to right, #3fa34d 0%, #3fa34d var(--fill), #e9ecef var(--fill), #e9ecef 100%);
          cursor: pointer; outline: none; width: 100%;
        }
        .macro-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 26px; height: 26px; border-radius: 50%;
          background: white; border: 3px solid #3fa34d;
          box-shadow: 0 0 0 4px rgba(63,163,77,0.15), 0 2px 8px rgba(0,0,0,0.12);
          cursor: pointer; transition: transform 0.15s, box-shadow 0.15s;
        }
        .macro-slider::-webkit-slider-thumb:hover {
          transform: scale(1.18);
          box-shadow: 0 0 0 6px rgba(63,163,77,0.22), 0 4px 16px rgba(63,163,77,0.3);
        }
        .macro-slider::-moz-range-thumb {
          width: 26px; height: 26px; border-radius: 50%;
          background: white; border: 3px solid #3fa34d;
          box-shadow: 0 0 0 4px rgba(63,163,77,0.15); cursor: pointer;
        }
        .adj-slider {
          -webkit-appearance: none; appearance: none;
          height: 7px; border-radius: 999px; cursor: pointer; outline: none; width: 100%;
        }
        .adj-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px; height: 20px; border-radius: 50%;
          background: white; border: 3px solid currentColor;
          box-shadow: 0 1px 6px rgba(0,0,0,0.18); cursor: pointer;
          transition: transform 0.15s;
        }
        .adj-slider::-webkit-slider-thumb:hover { transform: scale(1.15); }
        .adj-slider::-moz-range-thumb {
          width: 20px; height: 20px; border-radius: 50%;
          background: white; border: 3px solid currentColor;
        }
        @media print {
          header, footer, nav, .no-print { display: none !important; }
          .print-section { break-inside: avoid; }
          body { background: white !important; }
        }
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(24px, -18px) scale(1.04); }
          66% { transform: translate(-16px, 14px) scale(0.97); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-28px, 20px) scale(1.06); }
        }
        .orb-1 { animation: float-slow 20s ease-in-out infinite; }
        .orb-2 { animation: float-slower 16s ease-in-out infinite; }
        .orb-3 { animation: float-slow 24s ease-in-out infinite reverse; }
      `}</style>

      {/* ═══ HERO ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pb-6 pt-10 md:pb-8 md:pt-16 no-print">
        {/* Mesh gradient orbs */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="orb-1 absolute -top-24 left-[5%] h-[500px] w-[500px] rounded-full bg-gradient-to-br from-brand-primary/22 via-emerald-400/10 to-transparent blur-[80px]" />
          <div className="orb-2 absolute right-[-5%] top-[20%] h-[380px] w-[380px] rounded-full bg-gradient-to-bl from-brand-orange/18 via-amber-300/8 to-transparent blur-[70px]" />
          <div className="orb-3 absolute bottom-[-10%] left-[35%] h-[280px] w-[280px] rounded-full bg-gradient-to-t from-emerald-500/12 to-transparent blur-[60px]" />
        </div>

        <Container>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-2xl text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-widest text-brand-primary-dark shadow-sm backdrop-blur-sm"
            >
              <Sparkles className="size-3.5 text-brand-primary" />
              Free Nutrition Tool · Science-Based · 2 Minutes
            </motion.div>

            {/* Headline */}
            <h1 className="font-display text-[40px] leading-[1.1] text-brand-heading sm:text-[54px] md:text-[62px]">
              Macro{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-brand-primary to-emerald-600 bg-clip-text text-transparent">
                  Calculator
                </span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute -bottom-1 left-0 right-0 h-[3px] origin-left rounded-full bg-gradient-to-r from-brand-primary to-emerald-500"
                />
              </span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-brand-body sm:text-lg">
              Get your personalized daily calorie & macro targets — based on your body,
              activity level, and fitness goal.
            </p>

            {/* Feature pills */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {["Mifflin-St Jeor BMR", "TDEE Calculation", "6 Fitness Goals", "Macro Split Charts", "BMI & Ideal Weight"].map(f => (
                <span key={f} className="rounded-full bg-white/70 px-3 py-1.5 text-xs font-semibold text-brand-body shadow-sm backdrop-blur-sm border border-white/80">
                  {f}
                </span>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ═══ WIZARD ══════════════════════════════════════════════════════════════ */}
      <section className="pb-10 no-print">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="mx-auto max-w-2xl"
          >
            {/* Step indicator */}
            <div className="mb-7">
              <StepIndicator step={step} total={STEPS.length} labels={STEPS} />
            </div>

            {/* Card */}
            <div className="relative overflow-hidden rounded-3xl bg-white shadow-[0_24px_64px_-16px_rgba(0,0,0,0.13)] ring-1 ring-black/[0.04]">
              {/* Green top accent */}
              <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-brand-primary via-emerald-400 to-brand-primary-dark" />

              {/* Step label */}
              <div className="flex items-center justify-between border-b border-gray-100 px-7 py-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                    Step {step + 1} of {STEPS.length}
                  </p>
                  <p className="mt-0.5 text-lg font-black text-gray-900">{STEPS[step]}</p>
                </div>
                {/* Mini progress bar */}
                <div className="flex h-1.5 w-24 overflow-hidden rounded-full bg-gray-100">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-brand-primary to-emerald-500"
                    animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>

              {/* Animated step content */}
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={stepVariants}
                  initial="enter" animate="center" exit="exit"
                  transition={{ type: "spring", stiffness: 380, damping: 36 }}
                  className="p-6 md:p-8"
                >

                  {/* ── STEP 0: About You ──────────────────────────────────── */}
                  {step === 0 && (
                    <div className="space-y-7">
                      {/* Unit toggle */}
                      <motion.div custom={0} variants={childVariants} initial="hidden" animate="visible" className="space-y-2.5">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Unit System</p>
                        <div className="flex gap-2 rounded-2xl bg-gray-100 p-1.5">
                          {(["metric", "imperial"] as UnitSystem[]).map(u => (
                            <button key={u} type="button"
                              onClick={() => setForm(f => ({ ...f, unit: u }))}
                              className={cn(
                                "relative flex-1 rounded-xl py-2.5 text-sm font-bold transition-all duration-300",
                                form.unit === u
                                  ? "bg-white text-brand-primary-dark shadow-md"
                                  : "text-gray-500 hover:text-gray-700"
                              )}
                            >
                              {form.unit === u && (
                                <motion.span layoutId="unit-bg" className="absolute inset-0 rounded-xl bg-white shadow-md" style={{ zIndex: 0 }} />
                              )}
                              <span className="relative z-10">
                                {u === "metric" ? "⚖️ Metric (kg / cm)" : "🇺🇸 Imperial (lbs / ft)"}
                              </span>
                            </button>
                          ))}
                        </div>
                      </motion.div>

                      {/* Gender */}
                      <motion.div custom={1} variants={childVariants} initial="hidden" animate="visible" className="space-y-2.5">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Biological Sex</p>
                        <div className="grid grid-cols-2 gap-3">
                          {(["male", "female"] as Gender[]).map((g, gi) => (
                            <motion.button
                              key={g} type="button"
                              onClick={() => setForm(f => ({ ...f, gender: g }))}
                              whileTap={{ scale: 0.97 }}
                              className={cn(
                                "relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border-2 py-6 font-bold transition-all duration-300",
                                form.gender === g
                                  ? "border-brand-primary bg-gradient-to-b from-brand-primary/8 to-transparent text-brand-primary-dark shadow-[0_4px_20px_-6px_rgba(63,163,77,0.35)]"
                                  : "border-gray-100 bg-gray-50/60 text-gray-500 hover:border-gray-200 hover:bg-white hover:shadow-sm"
                              )}
                            >
                              <span className="text-5xl leading-none">{g === "male" ? "👨" : "👩"}</span>
                              <span className="text-base">{g === "male" ? "Male" : "Female"}</span>
                              {form.gender === g && (
                                <motion.div
                                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                                  className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary"
                                >
                                  <Check className="size-3.5 text-white stroke-[3]" />
                                </motion.div>
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>

                      {/* Age */}
                      <motion.div custom={2} variants={childVariants} initial="hidden" animate="visible">
                        <ValueSlider label="Age" value={form.age} min={10} max={80} unit="yrs"
                          onChange={v => setForm(f => ({ ...f, age: v }))} />
                      </motion.div>

                      {/* Height */}
                      <motion.div custom={3} variants={childVariants} initial="hidden" animate="visible">
                        {isMetric ? (
                          <ValueSlider label="Height" value={form.heightCm} min={140} max={220} unit="cm"
                            onChange={v => setForm(f => ({ ...f, heightCm: v }))} />
                        ) : (
                          <div className="space-y-2.5">
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Height</p>
                            <div className="mb-1 flex items-baseline gap-1 rounded-xl bg-brand-primary/8 px-3 py-1.5 w-fit">
                              <span className="text-2xl font-black tabular-nums text-brand-primary-dark">{form.heightFt}'{form.heightIn}"</span>
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                              <ValueSlider label="Feet" value={form.heightFt} min={4} max={7} unit="ft"
                                onChange={v => setForm(f => ({ ...f, heightFt: v }))} />
                              <ValueSlider label="Inches" value={form.heightIn} min={0} max={11} unit="in"
                                onChange={v => setForm(f => ({ ...f, heightIn: v }))} />
                            </div>
                          </div>
                        )}
                      </motion.div>

                      {/* Weight */}
                      <motion.div custom={4} variants={childVariants} initial="hidden" animate="visible">
                        {isMetric ? (
                          <ValueSlider label="Weight" value={form.weightKg} min={30} max={180} unit="kg"
                            onChange={v => setForm(f => ({ ...f, weightKg: v }))} />
                        ) : (
                          <ValueSlider label="Weight" value={form.weightLbs} min={65} max={400} unit="lbs"
                            onChange={v => setForm(f => ({ ...f, weightLbs: v }))} />
                        )}
                      </motion.div>

                      {/* Body fat optional */}
                      <motion.div custom={5} variants={childVariants} initial="hidden" animate="visible"
                        className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-gray-700">Body Fat %</span>
                              <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-500">Optional</span>
                            </div>
                            <p className="mt-0.5 text-xs text-gray-400">Enables Katch-McArdle formula for extra accuracy</p>
                          </div>
                          <button type="button"
                            onClick={() => { setShowBF(v => !v); setForm(f => ({ ...f, bodyFatPct: !showBF ? 20 : null })); }}
                            className={cn("relative h-7 w-12 rounded-full transition-colors duration-300", showBF ? "bg-brand-primary" : "bg-gray-200")}
                          >
                            <motion.span
                              animate={{ x: showBF ? 22 : 2 }}
                              transition={{ type: "spring", stiffness: 500, damping: 32 }}
                              className="absolute top-1 h-5 w-5 rounded-full bg-white shadow-md"
                            />
                          </button>
                        </div>
                        <AnimatePresence>
                          {showBF && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                              <div className="mt-5">
                                <ValueSlider label="Body Fat" value={form.bodyFatPct ?? 20} min={5} max={50} unit="%"
                                  onChange={v => setForm(f => ({ ...f, bodyFatPct: v }))} />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </div>
                  )}

                  {/* ── STEP 1: Activity ───────────────────────────────────── */}
                  {step === 1 && (
                    <div className="space-y-3">
                      {ACTIVITY_OPTIONS.map((opt, i) => (
                        <motion.button
                          key={opt.value} type="button"
                          custom={i} variants={childVariants} initial="hidden" animate="visible"
                          onClick={() => setForm(f => ({ ...f, activity: opt.value }))}
                          whileTap={{ scale: 0.985 }}
                          className={cn(
                            "group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border-2 p-4 text-left transition-all duration-250",
                            form.activity === opt.value
                              ? "border-brand-primary bg-gradient-to-r from-brand-primary/8 to-transparent shadow-[0_4px_20px_-6px_rgba(63,163,77,0.3)]"
                              : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50/60 hover:shadow-sm"
                          )}
                        >
                          {/* Colored left accent */}
                          <motion.div
                            animate={{ opacity: form.activity === opt.value ? 1 : 0 }}
                            className="absolute inset-y-0 left-0 w-1 rounded-r-full bg-brand-primary"
                          />
                          {/* Icon */}
                          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl text-2xl"
                            style={{ backgroundColor: `${opt.color}15` }}>
                            {opt.emoji}
                          </div>
                          {/* Text */}
                          <div className="min-w-0 flex-1">
                            <div className={cn("text-base font-black", form.activity === opt.value ? "text-brand-primary-dark" : "text-gray-800")}>
                              {opt.label}
                            </div>
                            <div className="mt-0.5 text-sm text-gray-500">{opt.desc}</div>
                          </div>
                          {/* Multiplier badge */}
                          <div className="shrink-0">
                            <div className="rounded-xl px-3 py-1.5 text-xs font-black"
                              style={{ backgroundColor: `${opt.color}15`, color: opt.color }}>
                              ×{opt.multiplier}
                            </div>
                          </div>
                          {/* Check */}
                          {form.activity === opt.value && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 28 }}
                              className="ml-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-primary shadow-[0_2px_8px_rgba(63,163,77,0.4)]"
                            >
                              <Check className="size-3.5 text-white stroke-[3]" />
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {/* ── STEP 2: Goal ────────────────────────────────────────── */}
                  {step === 2 && (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {GOAL_OPTIONS.map((opt, i) => (
                        <motion.button
                          key={opt.value} type="button"
                          custom={i} variants={childVariants} initial="hidden" animate="visible"
                          onClick={() => setForm(f => ({ ...f, goal: opt.value }))}
                          whileTap={{ scale: 0.96 }}
                          className={cn(
                            "relative flex flex-col items-start gap-3 overflow-hidden rounded-2xl border-2 p-5 text-left transition-all duration-250",
                            form.goal === opt.value
                              ? "border-brand-primary shadow-[0_4px_20px_-6px_rgba(63,163,77,0.32)]"
                              : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
                          )}
                          style={form.goal === opt.value ? { background: `linear-gradient(135deg, ${opt.color}0d 0%, transparent 100%)` } : {}}
                        >
                          {/* Emoji circle */}
                          <div className="flex size-12 items-center justify-center rounded-2xl text-2xl"
                            style={{ backgroundColor: `${opt.color}15` }}>
                            {opt.emoji}
                          </div>
                          <div className="w-full">
                            <div className={cn("text-base font-black", form.goal === opt.value ? "text-gray-900" : "text-gray-800")}>
                              {opt.label}
                            </div>
                            <div className="mt-0.5 text-xs text-gray-500">{opt.desc}</div>
                          </div>
                          {/* Calorie delta badge */}
                          <div className="rounded-xl px-3 py-1 text-xs font-black"
                            style={{ backgroundColor: `${opt.color}18`, color: opt.color }}>
                            {opt.adjustment === 0 ? "Maintenance" : `${opt.adjustment > 0 ? "+" : ""}${opt.adjustment} kcal/day`}
                          </div>
                          {/* Check */}
                          {form.goal === opt.value && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 28 }}
                              className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-full bg-brand-primary shadow-[0_2px_8px_rgba(63,163,77,0.4)]"
                            >
                              <Check className="size-3.5 text-white stroke-[3]" />
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {/* ── STEP 3: Diet ─────────────────────────────────────────── */}
                  {step === 3 && (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {DIET_OPTIONS.map((opt, i) => {
                        const bars = [
                          { pct: opt.prot, color: "#3fa34d" },
                          { pct: opt.carb, color: "#f59e0b" },
                          { pct: opt.fat, color: "#8b5cf6" },
                        ];
                        return (
                          <motion.button
                            key={opt.value} type="button"
                            custom={i} variants={childVariants} initial="hidden" animate="visible"
                            onClick={() => setForm(f => ({ ...f, diet: opt.value }))}
                            whileTap={{ scale: 0.96 }}
                            className={cn(
                              "relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border-2 p-4 text-center transition-all duration-250",
                              form.diet === opt.value
                                ? "border-brand-primary bg-gradient-to-b from-brand-primary/8 to-transparent shadow-[0_4px_20px_-6px_rgba(63,163,77,0.3)]"
                                : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50/60 hover:shadow-sm"
                            )}
                          >
                            <span className="text-4xl">{opt.emoji}</span>
                            <span className={cn("text-sm font-black", form.diet === opt.value ? "text-brand-primary-dark" : "text-gray-800")}>
                              {opt.label}
                            </span>
                            {/* Mini macro bars */}
                            <div className="w-full space-y-1">
                              {bars.map(b => (
                                <div key={b.color} className="flex h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                                  <div className="h-full rounded-full" style={{ width: `${b.pct}%`, backgroundColor: b.color }} />
                                </div>
                              ))}
                            </div>
                            <span className="text-[10px] font-bold text-gray-400">
                              P{opt.prot} · C{opt.carb} · F{opt.fat}
                            </span>
                            {form.diet === opt.value && (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 500, damping: 28 }}
                                className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-brand-primary"
                              >
                                <Check className="size-3 text-white stroke-[3]" />
                              </motion.div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Nav footer */}
              <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/60 px-6 py-4">
                <motion.button
                  type="button" onClick={goBack}
                  whileTap={{ scale: 0.96 }}
                  className={cn(
                    "flex h-11 items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-5 text-sm font-bold text-gray-600 transition-all hover:border-gray-300 hover:shadow-sm",
                    step === 0 && "invisible"
                  )}
                >
                  <ChevronLeft className="size-4" /> Back
                </motion.button>

                {step < STEPS.length - 1 ? (
                  <motion.button
                    type="button" onClick={goNext}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    className="flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-brand-primary to-emerald-600 px-7 text-sm font-black text-white shadow-[0_6px_20px_-4px_rgba(63,163,77,0.55)] transition-shadow hover:shadow-[0_8px_28px_-4px_rgba(63,163,77,0.65)]"
                  >
                    Next <ChevronRight className="size-4" />
                  </motion.button>
                ) : (
                  <motion.button
                    type="button" onClick={handleCalculate}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    className="flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-brand-primary to-emerald-600 px-7 text-sm font-black text-white shadow-[0_6px_20px_-4px_rgba(63,163,77,0.55)] transition-shadow hover:shadow-[0_8px_28px_-4px_rgba(63,163,77,0.65)]"
                  >
                    <Zap className="size-4" /> Calculate My Macros <ArrowRight className="size-4" />
                  </motion.button>
                )}
              </div>
            </div>

            {/* Summary chips */}
            {step > 0 && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex flex-wrap gap-2 px-1">
                {[
                  { label: `${form.gender === "male" ? "👨" : "👩"} ${form.gender === "male" ? "Male" : "Female"}`, s: 0 },
                  { label: `🎂 ${form.age} yrs`, s: 0 },
                  { label: isMetric ? `📏 ${form.heightCm} cm` : `📏 ${form.heightFt}'${form.heightIn}"`, s: 0 },
                  { label: isMetric ? `⚖️ ${form.weightKg} kg` : `⚖️ ${form.weightLbs} lbs`, s: 0 },
                  ...(step > 1 ? [{ label: `${ACTIVITY_OPTIONS.find(a => a.value === form.activity)?.emoji} ${ACTIVITY_OPTIONS.find(a => a.value === form.activity)?.label}`, s: 1 }] : []),
                  ...(step > 2 ? [{ label: `${GOAL_OPTIONS.find(g => g.value === form.goal)?.emoji} ${GOAL_OPTIONS.find(g => g.value === form.goal)?.label}`, s: 2 }] : []),
                ].map(chip => (
                  <button key={chip.label} type="button"
                    onClick={() => { setDirection(-1); setStep(chip.s); }}
                    className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-600 shadow-sm transition-all hover:border-brand-primary/30 hover:bg-brand-primary/5 hover:text-brand-primary-dark"
                  >
                    {chip.label}
                  </button>
                ))}
              </motion.div>
            )}
          </motion.div>
        </Container>
      </section>

      {/* ═══ RESULTS ══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {results && (
          <motion.section
            ref={resultsRef}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="pb-28 pt-2 print-section"
          >
            <Container>
              <div className="mx-auto max-w-4xl space-y-5">

                {/* ── Top actions bar ─────────────────────────────────────── */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between no-print"
                >
                  <div>
                    <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">
                      Your Daily Macro Results
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {goalOption?.label} · {DIET_OPTIONS.find(d => d.value === form.diet)?.label} · {form.gender === "male" ? "Male" : "Female"}, {form.age} years
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { icon: copied ? Check : Copy, label: copied ? "Copied!" : "Copy", onClick: handleCopy, active: copied },
                      { icon: Printer, label: "Print / PDF", onClick: () => window.print() },
                      { icon: RotateCcw, label: "Recalculate", onClick: handleReset },
                    ].map(({ icon: Icon, label, onClick, active }) => (
                      <button key={label} type="button" onClick={onClick}
                        className={cn(
                          "flex h-9 items-center gap-2 rounded-xl border-2 px-4 text-xs font-bold transition-all",
                          active
                            ? "border-brand-primary/30 bg-brand-primary/8 text-brand-primary-dark"
                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:shadow-sm"
                        )}
                      >
                        <Icon className="size-3.5" /> {label}
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* ── Hero calorie banner ─────────────────────────────────── */}
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-primary via-emerald-600 to-[#2e7d32] p-7 text-white shadow-[0_20px_60px_-15px_rgba(63,163,77,0.55)] print-section"
                >
                  {/* Background decorations */}
                  <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/[0.07]" />
                  <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/[0.05]" />
                  <div className="pointer-events-none absolute right-24 bottom-0 h-32 w-32 rounded-full bg-white/[0.04]" />

                  <p className="relative z-10 text-sm font-bold uppercase tracking-widest text-white/70">Daily Calorie Target</p>
                  <div className="relative z-10 mt-1.5 flex items-baseline gap-3">
                    <span className="text-[64px] font-black leading-none tabular-nums sm:text-[76px]">
                      <CountUp target={results.calories} />
                    </span>
                    <span className="text-xl font-semibold text-white/80">kcal/day</span>
                  </div>

                  {/* BMR + TDEE row */}
                  <div className="relative z-10 mt-5 flex flex-wrap gap-4">
                    {[
                      { label: "Basal Metabolic Rate", value: results.bmr },
                      { label: "Total Daily Expenditure", value: results.tdee },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex flex-col rounded-2xl bg-white/15 backdrop-blur-sm px-4 py-3">
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-white/60">{label}</span>
                        <span className="mt-0.5 text-2xl font-black tabular-nums">
                          <CountUp target={value} />
                          <span className="ml-1 text-sm font-semibold text-white/70">kcal</span>
                        </span>
                      </div>
                    ))}
                    {/* Goal tag */}
                    <div className="flex items-end">
                      <div className="flex items-center gap-2 rounded-2xl bg-white/15 backdrop-blur-sm px-4 py-3">
                        <span className="text-lg">{goalOption?.emoji}</span>
                        <div>
                          <span className="text-[11px] font-semibold uppercase tracking-wide text-white/60">Goal</span>
                          <p className="text-sm font-black">{goalOption?.label}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* ── Macro breakdown ─────────────────────────────────────── */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.6 }}
                  className="rounded-3xl bg-white p-6 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1)] ring-1 ring-black/[0.04] print-section"
                >
                  <h3 className="mb-5 text-lg font-black text-gray-900">Macronutrient Breakdown</h3>
                  <div className="flex flex-col gap-7 md:flex-row md:items-center">
                    {/* Donut */}
                    <div className="flex flex-col items-center gap-4 md:w-52 md:shrink-0">
                      <AnimatedDonut
                        proteinPct={customProt ?? results.proteinPct}
                        carbsPct={customCarb ?? results.carbsPct}
                        fatPct={customFat ?? results.fatPct}
                      />
                      <div className="flex flex-wrap justify-center gap-3">
                        {[
                          { label: "Protein", color: "#3fa34d" },
                          { label: "Carbs", color: "#f59e0b" },
                          { label: "Fat", color: "#8b5cf6" },
                        ].map(({ label, color }) => (
                          <span key={label} className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bars */}
                    <div className="flex-1 space-y-5">
                      <MacroBar label="Protein" grams={adjProtein} pct={customProt ?? results.proteinPct}
                        color="#3fa34d" bgColor="#dcfce7" glowColor="rgba(63,163,77,0.35)" />
                      <MacroBar label="Carbohydrates" grams={adjCarbs} pct={customCarb ?? results.carbsPct}
                        color="#f59e0b" bgColor="#fef9c3" glowColor="rgba(245,158,11,0.35)" />
                      <MacroBar label="Fat" grams={adjFat} pct={customFat ?? results.fatPct}
                        color="#8b5cf6" bgColor="#ede9fe" glowColor="rgba(139,92,246,0.35)" />
                    </div>
                  </div>

                  {/* Macro tiles */}
                  <div className="mt-6 grid grid-cols-3 gap-3 border-t border-gray-100 pt-5">
                    {[
                      { label: "Protein", grams: adjProtein, pct: customProt ?? results.proteinPct, cal: adjProtein * 4, color: "#3fa34d", bg: "#f0fdf4" },
                      { label: "Carbs", grams: adjCarbs, pct: customCarb ?? results.carbsPct, cal: adjCarbs * 4, color: "#f59e0b", bg: "#fffbeb" },
                      { label: "Fat", grams: adjFat, pct: customFat ?? results.fatPct, cal: adjFat * 9, color: "#8b5cf6", bg: "#faf5ff" },
                    ].map(({ label, grams, pct, cal, color, bg }) => (
                      <div key={label} className="rounded-2xl p-4 text-center" style={{ backgroundColor: bg }}>
                        <div className="text-3xl font-black tabular-nums" style={{ color }}>
                          <CountUp target={grams} />g
                        </div>
                        <div className="mt-0.5 text-[11px] font-bold text-gray-400">{pct}% · {cal} kcal</div>
                        <div className="mt-1.5 text-sm font-black text-gray-700">{label}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* ── Health metrics grid ─────────────────────────────────── */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.6 }}
                  className="grid grid-cols-2 gap-4 sm:grid-cols-4 print-section"
                >
                  {[
                    {
                      icon: Scale, iconColor: "#3b82f6", iconBg: "#eff6ff",
                      label: "BMI Score", value: `${results.bmi}`,
                      sub: results.bmiStatus, subColor: results.bmiColor,
                    },
                    {
                      icon: Droplets, iconColor: "#0ea5e9", iconBg: "#e0f2fe",
                      label: "Daily Water", value: `${results.water.toFixed(1)} L`,
                      sub: `~${Math.round(results.water * 1000 / 237)} cups`, subColor: "#0ea5e9",
                    },
                    {
                      icon: Wheat, iconColor: "#d97706", iconBg: "#fef3c7",
                      label: "Fiber Target", value: `~${results.fiber}g`,
                      sub: "per day", subColor: "#d97706",
                    },
                    {
                      icon: Target, iconColor: "#3fa34d", iconBg: "#f0fdf4",
                      label: "Ideal Weight",
                      value: isMetric ? `${results.idealWeightMin}–${results.idealWeightMax}kg` : `${results.idealWeightMin}–${results.idealWeightMax}lbs`,
                      sub: "Hamwi formula", subColor: "#3fa34d",
                    },
                  ].map(({ icon: Icon, iconColor, iconBg, label, value, sub, subColor }, i) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, y: 16, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.35 + i * 0.08, duration: 0.5 }}
                      className="rounded-2xl bg-white p-5 ring-1 ring-black/[0.04] shadow-sm"
                    >
                      <div className="mb-3 inline-flex size-11 items-center justify-center rounded-2xl" style={{ backgroundColor: iconBg }}>
                        <Icon className="size-5" style={{ color: iconColor }} />
                      </div>
                      <div className="text-2xl font-black tabular-nums text-gray-900">{value}</div>
                      <div className="mt-0.5 text-xs font-bold" style={{ color: subColor }}>{sub}</div>
                      <div className="mt-2 text-xs font-bold uppercase tracking-wide text-gray-400">{label}</div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* ── Customize macro split ───────────────────────────────── */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.42, duration: 0.6 }}
                  className="rounded-3xl bg-white ring-1 ring-black/[0.04] shadow-sm print-section no-print"
                >
                  <button type="button" onClick={() => setShowAdjust(v => !v)}
                    className="flex w-full items-center justify-between p-6 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-2xl bg-brand-primary/10">
                        <RefreshCw className="size-4.5 text-brand-primary-dark" />
                      </div>
                      <div>
                        <span className="text-base font-black text-gray-900">Customize Macro Split</span>
                        <span className="ml-2 rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-500">Optional</span>
                      </div>
                    </div>
                    <motion.div animate={{ rotate: showAdjust ? 180 : 0 }} transition={{ duration: 0.3 }}>
                      <ChevronDown className="size-5 text-gray-400" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {showAdjust && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                        <div className="space-y-5 border-t border-gray-100 px-6 pb-6 pt-5">
                          <p className="text-sm text-gray-500">
                            Adjust your split. Total calories stay at <strong className="text-gray-800">{results.calories.toLocaleString()} kcal</strong>.
                          </p>
                          {[
                            { label: "Protein", key: "prot" as const, value: customProt ?? results.proteinPct, color: "#3fa34d" },
                            { label: "Carbohydrates", key: "carb" as const, value: customCarb ?? results.carbsPct, color: "#f59e0b" },
                            { label: "Fat", key: "fat" as const, value: customFat ?? results.fatPct, color: "#8b5cf6" },
                          ].map(({ label, key, value, color }) => (
                            <div key={key} className="space-y-2.5">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-gray-700">{label}</span>
                                <span className="rounded-xl px-3 py-1 text-sm font-black" style={{ backgroundColor: `${color}18`, color }}>{value}%</span>
                              </div>
                              <input type="range" min={5} max={80} value={value}
                                className="adj-slider w-full"
                                onChange={e => handleAdjSlider(key, parseInt(e.target.value, 10))}
                                style={{
                                  background: `linear-gradient(to right, ${color} 0%, ${color} ${((value - 5) / 75) * 100}%, #e9ecef ${((value - 5) / 75) * 100}%, #e9ecef 100%)`,
                                  color
                                }}
                              />
                            </div>
                          ))}
                          <div className="flex items-center gap-2 rounded-2xl bg-gray-50 p-3.5 text-sm text-gray-500">
                            <Info className="size-4 shrink-0 text-gray-400" />
                            Total: {(customProt ?? results.proteinPct) + (customCarb ?? results.carbsPct) + (customFat ?? results.fatPct)}% · Small rounding differences are normal.
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* ── Water + Meal distribution ───────────────────────────── */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.48, duration: 0.6 }}
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2 print-section"
                >
                  {/* Water */}
                  <div className="rounded-3xl bg-gradient-to-br from-sky-50 to-cyan-50 p-6 ring-1 ring-sky-100">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-sky-100">
                        <Droplets className="size-5 text-sky-500" />
                      </div>
                      <div>
                        <div className="font-black text-gray-900">Daily Water Intake</div>
                        <div className="text-xs text-gray-500">Recommended estimate</div>
                      </div>
                    </div>
                    <div className="text-5xl font-black text-sky-600">{results.water.toFixed(1)}<span className="ml-1 text-2xl">L</span></div>
                    <p className="mt-3 text-xs font-medium text-gray-500">
                      ≈ {Math.round(results.water * 1000 / 237)} cups (8 oz) · Increase during exercise or hot weather. Individual needs vary.
                    </p>
                  </div>

                  {/* Meal timing */}
                  <div className="rounded-3xl bg-gradient-to-br from-orange-50 to-amber-50 p-6 ring-1 ring-orange-100">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-orange-100">
                        <Utensils className="size-5 text-orange-500" />
                      </div>
                      <div>
                        <div className="font-black text-gray-900">Suggested Meal Split</div>
                        <div className="text-xs text-gray-500">3 meals + 2 snacks</div>
                      </div>
                    </div>
                    <div className="space-y-2.5">
                      {[
                        { name: "Breakfast", pct: 25, color: "#f97316" },
                        { name: "Lunch", pct: 30, color: "#f59e0b" },
                        { name: "Dinner", pct: 30, color: "#ef4444" },
                        { name: "Snacks (×2)", pct: 15, color: "#a16207" },
                      ].map(({ name, pct, color }) => (
                        <div key={name} className="flex items-center justify-between gap-3">
                          <span className="min-w-[90px] text-sm font-semibold text-gray-700">{name}</span>
                          <div className="relative flex-1 h-2 overflow-hidden rounded-full bg-orange-100">
                            <motion.div
                              initial={{ width: 0 }} animate={{ width: `${pct / 30 * 100}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="absolute inset-y-0 left-0 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                          </div>
                          <span className="min-w-[70px] text-right text-sm font-black" style={{ color }}>
                            ~{Math.round(results.calories * pct / 100)} kcal
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* ── Goal tips ────────────────────────────────────────────── */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.54, duration: 0.6 }}
                  className="rounded-3xl border-2 border-brand-primary/15 bg-gradient-to-br from-brand-primary/6 via-white to-white p-6 print-section"
                >
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-brand-primary/15">
                      {goalOption && goalOption.adjustment < 0
                        ? <TrendingDown className="size-5 text-brand-primary-dark" />
                        : goalOption && goalOption.adjustment > 0
                        ? <TrendingUp className="size-5 text-brand-primary-dark" />
                        : <Target className="size-5 text-brand-primary-dark" />}
                    </div>
                    <h3 className="text-lg font-black text-gray-900">Tips for {goalOption?.label}</h3>
                  </div>
                  <div className="space-y-3">
                    {goalTips.map((tip, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.1, duration: 0.45 }}
                        className="flex gap-3.5 rounded-2xl bg-white/70 p-3.5"
                      >
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-primary text-[11px] font-black text-white">
                          {i + 1}
                        </span>
                        <p className="text-sm leading-relaxed text-gray-700">{tip}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* ── Methodology note ────────────────────────────────────── */}
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.65 }}
                  className="flex gap-3 rounded-2xl bg-gray-50 p-4 text-sm text-gray-500 print-section"
                >
                  <Info className="mt-0.5 size-4 shrink-0 text-gray-400" />
                  <p>
                    <strong className="text-gray-700">Methodology:</strong> BMR uses Mifflin-St Jeor (or Katch-McArdle when body fat % is provided).
                    TDEE = BMR × activity multiplier. Calorie target = TDEE + goal adjustment. Macros split per dietary preference.
                    Water: 35 ml/kg. Ideal weight: Hamwi formula ±10%. These are starting points — adjust based on results over 2–4 weeks.
                  </p>
                </motion.div>

              </div>
            </Container>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ═══ PRE-RESULTS INFO CARDS ═══════════════════════════════════════════════ */}
      {!results && (
        <section className="pb-24 no-print">
          <Container>
            <div className="mx-auto max-w-2xl">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { emoji: "🧪", title: "Science-Based", desc: "Mifflin-St Jeor + Katch-McArdle equations — the gold standard for calorie estimation.", color: "#3b82f6", bg: "#eff6ff" },
                  { emoji: "🎯", title: "Goal-Specific", desc: "Calorie and macro targets precisely tailored to your exact fitness goal.", color: "#3fa34d", bg: "#f0fdf4" },
                  { emoji: "📊", title: "Visual & Clear", desc: "Animated charts, counters, BMI, fiber, water intake, and meal timing all in one.", color: "#8b5cf6", bg: "#faf5ff" },
                ].map(({ emoji, title, desc, color, bg }, i) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                    className="rounded-2xl p-5 ring-1 ring-black/[0.04] shadow-sm"
                    style={{ backgroundColor: bg }}
                  >
                    <div className="mb-3 text-4xl">{emoji}</div>
                    <div className="text-base font-black" style={{ color }}>{title}</div>
                    <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
