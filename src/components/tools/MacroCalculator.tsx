"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator, RotateCcw, Copy, Check, ChevronDown,
  Activity, Target, Droplets, Utensils, Info,
  RefreshCw, Scale, Wheat, Zap, Download, Edit3,
  ChevronRight, Printer,
} from "lucide-react";
import Container from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import { generatePrintHTML } from "./generatePrintHTML";

// ─── Types ────────────────────────────────────────────────────────────────────
type Gender        = "male" | "female";
type UnitSystem    = "metric" | "imperial";
type ActivityLevel = "sedentary" | "lightly" | "moderately" | "very" | "extremely";
type FitnessGoal   = "lose" | "fat_loss" | "recomp" | "maintain" | "lean_bulk" | "build";
type DietaryPref   = "balanced" | "high_protein" | "low_carb" | "keto" | "vegetarian" | "vegan";

interface FormData {
  gender: Gender; age: number; unit: UnitSystem;
  heightCm: number; heightFt: number; heightIn: number;
  weightKg: number; weightLbs: number; bodyFatPct: number | null;
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
const ACTIVITY_OPTIONS = [
  { value: "sedentary"   as ActivityLevel, label: "Sedentary",          desc: "Little or no exercise",       emoji: "🛋️", multiplier: 1.2 },
  { value: "lightly"    as ActivityLevel, label: "Lightly Active",     desc: "1–3 days/week",               emoji: "🚶", multiplier: 1.375 },
  { value: "moderately" as ActivityLevel, label: "Moderately Active",  desc: "3–5 days/week",               emoji: "🏃", multiplier: 1.55 },
  { value: "very"       as ActivityLevel, label: "Very Active",         desc: "6–7 days/week",               emoji: "🏋️", multiplier: 1.725 },
  { value: "extremely"  as ActivityLevel, label: "Extremely Active",    desc: "Physical job / 2× daily",     emoji: "⚡", multiplier: 1.9 },
];
const GOAL_OPTIONS = [
  { value: "lose"      as FitnessGoal, label: "Lose Weight",   desc: "−500 kcal/day",    emoji: "📉", adjustment: -500 },
  { value: "fat_loss"  as FitnessGoal, label: "Fat Loss",      desc: "−300 kcal/day",    emoji: "🔥", adjustment: -300 },
  { value: "recomp"    as FitnessGoal, label: "Body Recomp",   desc: "Maintenance cals", emoji: "⚖️",  adjustment:  0 },
  { value: "maintain"  as FitnessGoal, label: "Maintain",      desc: "Maintenance cals", emoji: "✅",  adjustment:  0 },
  { value: "lean_bulk" as FitnessGoal, label: "Lean Bulk",     desc: "+200 kcal/day",    emoji: "📈", adjustment: 200 },
  { value: "build"     as FitnessGoal, label: "Build Muscle",  desc: "+300 kcal/day",    emoji: "💪", adjustment: 300 },
];
const DIET_OPTIONS = [
  { value: "balanced"     as DietaryPref, label: "Balanced",      emoji: "🥗", prot: 30, carb: 40, fat: 30 },
  { value: "high_protein" as DietaryPref, label: "High Protein",  emoji: "🥩", prot: 40, carb: 35, fat: 25 },
  { value: "low_carb"     as DietaryPref, label: "Low Carb",      emoji: "🥦", prot: 35, carb: 25, fat: 40 },
  { value: "keto"         as DietaryPref, label: "Keto",          emoji: "🧈", prot: 25, carb:  5, fat: 70 },
  { value: "vegetarian"   as DietaryPref, label: "Vegetarian",    emoji: "🌱", prot: 25, carb: 50, fat: 25 },
  { value: "vegan"        as DietaryPref, label: "Vegan",         emoji: "🌿", prot: 20, carb: 55, fat: 25 },
];
const GOAL_TIPS: Record<FitnessGoal, string[]> = {
  lose:      ["Aim for 0.5–1 lb/week — faster cuts risk muscle loss.", "Prioritize protein to preserve lean mass during the deficit.", "Strength training 2–3×/week helps maintain metabolic rate."],
  fat_loss:  ["A moderate deficit reduces fat while protecting muscle.", "Distribute protein evenly across 3–5 meals for best retention.", "Track weight weekly — daily fluctuations are misleading."],
  recomp:    ["Body recomp takes longer but builds strength and aesthetics.", "Hit your protein target daily — the most critical macro.", "Progressive overload is essential for body recomp."],
  maintain:  ["Maintenance calories keep weight stable and support activity.", "Adjust by ±100–200 kcal if weight drifts over 2–3 weeks.", "Focus on food quality: whole foods, protein, vegetables."],
  lean_bulk: ["A ~200 kcal surplus minimizes fat gain while building muscle.", "Expect 0.5–1 lb of muscle per month — slow is normal.", "Track strength gains as the best measure of progress."],
  build:     ["300 kcal surplus is enough to maximize muscle protein synthesis.", "Carbohydrates fuel workouts and support recovery.", "Get 7–9 hours of sleep — growth hormone peaks during sleep."],
};

function bmiLabel(bmi: number) {
  if (bmi < 18.5) return { label: "Underweight", color: "#3b82f6" };
  if (bmi < 25)   return { label: "Normal",       color: "#16a34a" };
  if (bmi < 30)   return { label: "Overweight",   color: "#d97706" };
  return               { label: "Obese",        color: "#dc2626" };
}

function calculateMacros(form: FormData): MacroResults {
  const weightKg = form.unit === "metric" ? form.weightKg : form.weightLbs * 0.453592;
  const heightCm = form.unit === "metric" ? form.heightCm : (form.heightFt * 12 + form.heightIn) * 2.54;
  let bmr = form.bodyFatPct !== null
    ? 370 + 21.6 * weightKg * (1 - form.bodyFatPct / 100)
    : form.gender === "male"
      ? 10 * weightKg + 6.25 * heightCm - 5 * form.age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * form.age - 161;
  const actOpt  = ACTIVITY_OPTIONS.find(a => a.value === form.activity)!;
  const goalOpt = GOAL_OPTIONS.find(g => g.value === form.goal)!;
  const dietOpt = DIET_OPTIONS.find(d => d.value === form.diet)!;
  const tdee     = bmr * actOpt.multiplier;
  const calories = Math.round(tdee + goalOpt.adjustment);
  const { prot: proteinPct, carb: carbsPct, fat: fatPct } = dietOpt;
  const protein  = Math.round((calories * proteinPct / 100) / 4);
  const carbs    = Math.round((calories * carbsPct  / 100) / 4);
  const fat      = Math.round((calories * fatPct    / 100) / 9);
  const fiber    = Math.round(calories / 1000 * 14);
  const water    = Math.round(weightKg * 35) / 1000;
  const bmi      = weightKg / Math.pow(heightCm / 100, 2);
  const { label: bmiStatus, color: bmiColor } = bmiLabel(bmi);
  const heightInches = heightCm / 2.54;
  const extraInches  = Math.max(0, heightInches - 60);
  const idealKg      = (form.gender === "male" ? 48 : 45.4) + (form.gender === "male" ? 2.7 : 2.26) * extraInches;
  const mult         = form.unit === "imperial" ? 2.20462 : 1;
  return {
    bmr: Math.round(bmr), tdee: Math.round(tdee), calories,
    protein, carbs, fat, fiber, proteinPct, carbsPct, fatPct,
    water, bmi: Math.round(bmi * 10) / 10, bmiStatus, bmiColor,
    idealWeightMin: Math.round(idealKg * 0.9 * mult),
    idealWeightMax: Math.round(idealKg * 1.1 * mult),
  };
}

const DEFAULT: FormData = {
  gender: "male", age: 25, unit: "metric",
  heightCm: 175, heightFt: 5, heightIn: 8,
  weightKg: 70, weightLbs: 155, bodyFatPct: null,
  activity: "moderately", goal: "maintain", diet: "balanced",
};

// ── LiveNumber ─────────────────────────────────────────────────────────────────
function LiveNumber({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const [d, setD] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    if (value === prev.current) return;
    const from = prev.current, to = value;
    prev.current = value;
    const start = Date.now(), dur = 600;
    const t = setInterval(() => {
      const p = Math.min((Date.now() - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setD(decimals ? Math.round((from + (to - from) * e) * 10 ** decimals) / 10 ** decimals : Math.round(from + (to - from) * e));
      if (p >= 1) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [value]); // eslint-disable-line
  return <>{decimals ? d.toFixed(decimals) : d.toLocaleString()}</>;
}

// ── Slider ─────────────────────────────────────────────────────────────────────
function Slider({ label, value, min, max, step = 1, unit, onChange }: {
  label: string; value: number; min: number; max: number;
  step?: number; unit: string; onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        <div className="flex items-baseline gap-1 rounded-xl bg-brand-primary/10 px-3 py-1 ring-1 ring-brand-primary/20">
          <span className="text-lg font-black tabular-nums text-brand-primary-dark">{value}</span>
          <span className="text-xs font-bold text-brand-primary/60">{unit}</span>
        </div>
      </div>
      <div className="relative h-7 flex items-center">
        <div className="absolute inset-x-0 h-2 rounded-full bg-gray-200">
          <div className="h-full rounded-full bg-gradient-to-r from-brand-primary to-emerald-500 transition-all duration-100" style={{ width: `${pct}%` }} />
        </div>
        <motion.div className="absolute size-6 rounded-full border-[3px] border-brand-primary bg-white shadow-lg shadow-brand-primary/30 cursor-grab"
          animate={{ left: `calc(${pct}% - 12px)` }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full cursor-pointer opacity-0"
        />
      </div>
      <div className="flex justify-between text-[10px] font-medium text-gray-300">
        <span>{min}{unit}</span><span>{max}{unit}</span>
      </div>
    </div>
  );
}

// ── Dropdown ───────────────────────────────────────────────────────────────────
function Dropdown<T extends string>({ label, icon, value, options, onChange }: {
  label: string; icon: React.ReactNode; value: T;
  options: { value: T; label: string; desc?: string; emoji?: string }[];
  onChange: (v: T) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find(o => o.value === value)!;

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  return (
    <div ref={ref} className="relative">
      <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-400">{label}</label>
      <button type="button" onClick={() => setOpen(v => !v)}
        className={cn(
          "group flex w-full items-center gap-3 rounded-2xl border-2 bg-white/60 px-4 py-3.5 text-left backdrop-blur-sm transition-all duration-200",
          open
            ? "border-brand-primary bg-white shadow-[0_0_0_4px_rgba(63,163,77,0.12)] shadow-brand-primary/20"
            : "border-gray-200/80 hover:border-brand-primary/50 hover:bg-white/90 hover:shadow-md"
        )}>
        <span className={cn("shrink-0 transition-colors duration-200", open ? "text-brand-primary" : "text-gray-400 group-hover:text-brand-primary")}>
          {icon}
        </span>
        <div className="flex-1 min-w-0 flex items-center gap-2">
          {selected.emoji && <span className="text-xl leading-none">{selected.emoji}</span>}
          <div className="min-w-0">
            <p className="truncate font-black text-gray-900 text-sm">{selected.label}</p>
            {selected.desc && <p className="truncate text-[11px] text-gray-400">{selected.desc}</p>}
          </div>
        </div>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2, ease: "easeInOut" }} className="shrink-0">
          <ChevronDown className={cn("size-4 transition-colors", open ? "text-brand-primary" : "text-gray-300")} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 right-0 top-full z-[200] mt-2 rounded-2xl border border-gray-200/80 bg-white/95 backdrop-blur-xl shadow-[0_24px_64px_-12px_rgba(0,0,0,0.22),0_0_0_1px_rgba(0,0,0,0.04)]"
          >
            <div className="p-1.5">
              {options.map((opt, i) => (
                <motion.button key={opt.value} type="button"
                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.14, delay: i * 0.025 }}
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150",
                    opt.value === value
                      ? "bg-gradient-to-r from-brand-primary/10 to-emerald-50 text-brand-primary-dark"
                      : "hover:bg-gray-50 text-gray-700"
                  )}>
                  {opt.emoji && <span className="text-xl leading-none">{opt.emoji}</span>}
                  <div className="flex-1">
                    <p className={cn("text-sm font-bold", opt.value === value ? "text-brand-primary-dark" : "text-gray-800")}>{opt.label}</p>
                    {opt.desc && <p className="text-[11px] text-gray-400 mt-0.5">{opt.desc}</p>}
                  </div>
                  <AnimatePresence>
                    {opt.value === value && (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-primary shadow-sm">
                        <Check className="size-3 text-white stroke-[3]" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── MacroBar ───────────────────────────────────────────────────────────────────
function MacroBar({ label, grams, pct, kcal, color, bg, gradFrom, gradTo, icon, tip }: {
  label: string; grams: number; pct: number; kcal: number;
  color: string; bg: string; gradFrom: string; gradTo: string; icon: string; tip: string;
}) {
  return (
    <motion.div whileHover={{ y: -4, boxShadow: `0 20px 40px -12px ${color}30` }}
      transition={{ duration: 0.2 }}
      className="relative overflow-hidden rounded-3xl p-5 shadow-sm ring-1 ring-black/[0.04]"
      style={{ background: bg }}>
      <div className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full opacity-30"
        style={{ background: `radial-gradient(circle, ${gradTo}, transparent)` }} />
      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl text-xl" style={{ background: `${color}15` }}>
              {icon}
            </div>
            <span className="font-black text-gray-800">{label}</span>
          </div>
          <span className="rounded-full px-2.5 py-0.5 text-xs font-black" style={{ background: `${color}18`, color }}>{pct}%</span>
        </div>
        <div className="mb-1 flex items-baseline gap-1.5">
          <span className="text-4xl font-black tabular-nums" style={{ color }}>
            <LiveNumber value={grams} />
          </span>
          <span className="text-base font-bold text-gray-500">g</span>
        </div>
        <p className="mb-3 text-xs font-semibold text-gray-400"><LiveNumber value={kcal} /> kcal · {tip}</p>
        <div className="h-2 overflow-hidden rounded-full bg-black/[0.07]">
          <motion.div className="h-full rounded-full"
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ background: `linear-gradient(90deg, ${gradFrom}, ${gradTo})` }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ── Toggle ─────────────────────────────────────────────────────────────────────
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={value} onClick={() => onChange(!value)}
      className={cn(
        "relative inline-flex h-7 w-[52px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
        value ? "bg-brand-primary shadow-[0_2px_8px_rgba(63,163,77,0.4)]" : "bg-gray-200"
      )}>
      <motion.span
        animate={{ translateX: value ? 25 : 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className="inline-block size-5 rounded-full bg-white shadow-md"
      />
    </button>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────
export default function MacroCalculator() {
  const [form, setForm]       = useState<FormData>(DEFAULT);
  const [copied, setCopied]   = useState(false);
  const [showBF, setShowBF]   = useState(false);
  const [showAdjust, setShowAdjust] = useState(false);
  const [showTips, setShowTips]     = useState(false);
  const [customProt, setCustomProt] = useState<number | null>(null);
  const [customCarb, setCustomCarb] = useState<number | null>(null);
  const [customFat, setCustomFat]   = useState<number | null>(null);
  const [calculated, setCalculated] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const results    = useMemo(() => calculateMacros(form), [form]);
  const isMetric   = form.unit === "metric";
  const activeProt = customProt ?? results.proteinPct;
  const activeCarb = customCarb ?? results.carbsPct;
  const activeFat  = customFat  ?? results.fatPct;
  const adjProtein = Math.round((results.calories * activeProt / 100) / 4);
  const adjCarbs   = Math.round((results.calories * activeCarb / 100) / 4);
  const adjFat     = Math.round((results.calories * activeFat  / 100) / 9);
  const goalOpt    = GOAL_OPTIONS.find(g => g.value === form.goal)!;
  const bmiInfo    = bmiLabel(results.bmi);

  const handleCalculate = useCallback(() => {
    setCalculated(true);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }, []);

  const handleReset = useCallback(() => {
    setForm(DEFAULT);
    setCustomProt(null); setCustomCarb(null); setCustomFat(null);
    setShowBF(false); setShowAdjust(false); setShowTips(false);
    setCalculated(false);
  }, []);

  const handlePrint = useCallback(() => {
    const html = generatePrintHTML({ form, results, adjProtein, adjCarbs, adjFat, activeProt, activeCarb, activeFat });
    const w = window.open("", "_blank");
    if (w) { w.document.write(html); w.document.close(); }
  }, [form, results, adjProtein, adjCarbs, adjFat, activeProt, activeCarb, activeFat]);

  const handleCopy = useCallback(async () => {
    const goal = GOAL_OPTIONS.find(g => g.value === form.goal)?.label ?? "";
    await navigator.clipboard.writeText(
      `── Macros — TheMealPrepIdeas.com ──\nGoal: ${goal}\n\nTarget: ${results.calories} kcal\nBMR: ${results.bmr} · TDEE: ${results.tdee}\n\nProtein: ${adjProtein}g (${activeProt}%)\nCarbs: ${adjCarbs}g (${activeCarb}%)\nFat: ${adjFat}g (${activeFat}%)\nFiber: ~${results.fiber}g\nWater: ~${results.water.toFixed(1)}L\nBMI: ${results.bmi} (${results.bmiStatus})`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }, [results, form, adjProtein, adjCarbs, adjFat, activeProt, activeCarb, activeFat]);

  const handleAdjSlider = (macro: "prot" | "carb" | "fat", val: number) => {
    const rem = 100 - val;
    if (macro === "prot") {
      const cb = customCarb ?? results.carbsPct, fb = customFat ?? results.fatPct, tot = cb + fb || 1;
      setCustomProt(val); setCustomCarb(Math.round((cb / tot) * rem)); setCustomFat(Math.round((fb / tot) * rem));
    } else if (macro === "carb") {
      const pb = customProt ?? results.proteinPct, fb = customFat ?? results.fatPct, tot = pb + fb || 1;
      setCustomCarb(val); setCustomProt(Math.round((pb / tot) * rem)); setCustomFat(Math.round((fb / tot) * rem));
    } else {
      const pb = customProt ?? results.proteinPct, cb = customCarb ?? results.carbsPct, tot = pb + cb || 1;
      setCustomFat(val); setCustomProt(Math.round((pb / tot) * rem)); setCustomCarb(Math.round((cb / tot) * rem));
    }
  };

  const r = 72, cx = 84, cy = 84, circ = 2 * Math.PI * r;
  const donutData = [
    { pct: activeProt, color: "#16a34a", label: "Protein", grams: adjProtein },
    { pct: activeCarb, color: "#f59e0b", label: "Carbs",   grams: adjCarbs   },
    { pct: activeFat,  color: "#8b5cf6", label: "Fats",    grams: adjFat     },
  ];
  let cumPct = 0;

  return (
    <>
      <style>{`
        @keyframes blob { 0%,100%{border-radius:60% 40% 70% 30%/60% 30% 70% 40%} 50%{border-radius:30% 60% 40% 70%/50% 60% 30% 60%} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes shimmer { 0%{background-position:200% 50%} 100%{background-position:-200% 50%} }
        .gradient-heading { background:linear-gradient(135deg,#1a5c24 0%,#3fa34d 45%,#059669 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .animated-gradient { background:linear-gradient(270deg,#3fa34d,#059669,#0d9488,#3fa34d); background-size:300% 100%; animation:shimmer 4s linear infinite; }
        .glass { background:rgba(255,255,255,0.72); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); }
        .glass-dark { background:rgba(255,255,255,0.55); backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px); }
        .adj-range { -webkit-appearance:none; appearance:none; height:5px; border-radius:999px; cursor:pointer; outline:none; }
        .adj-range::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; border-radius:50%; background:#fff; border:3px solid currentColor; box-shadow:0 1px 5px rgba(0,0,0,.18); cursor:pointer; transition:transform .15s; }
        .adj-range::-webkit-slider-thumb:hover { transform:scale(1.25); }
        .adj-range::-moz-range-thumb { width:18px; height:18px; border-radius:50%; background:#fff; border:3px solid currentColor; cursor:pointer; }
      `}</style>

      {/* ═══ HERO ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#ebfbee] via-[#f4fff5] to-transparent pt-14 pb-10 no-print">
        {/* Animated blobs */}
        <div className="pointer-events-none absolute inset-0 select-none overflow-hidden">
          <div style={{ animation: "blob 8s ease-in-out infinite, float 6s ease-in-out infinite" }}
            className="absolute left-[8%] top-6 h-72 w-72 bg-gradient-to-br from-brand-primary/20 to-emerald-300/15 blur-3xl" />
          <div style={{ animation: "blob 10s ease-in-out infinite 2s, float 7s ease-in-out infinite 1s" }}
            className="absolute right-[6%] top-20 h-56 w-56 bg-brand-orange/12 blur-3xl" />
          <div style={{ animation: "blob 12s ease-in-out infinite 4s" }}
            className="absolute bottom-0 left-1/2 h-40 w-80 -translate-x-1/2 bg-emerald-400/10 blur-2xl" />
        </div>

        <Container className="relative text-center">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            {/* Badge */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.4 }}
              className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-brand-primary/25 bg-white/80 px-5 py-2 text-xs font-black uppercase tracking-widest text-brand-primary-dark shadow-lg backdrop-blur-md">
              <span className="flex size-4 items-center justify-center rounded-full bg-brand-primary text-white">
                <Zap className="size-2.5" />
              </span>
              Free · Science-Based · Instant Results
            </motion.div>

            {/* Headline */}
            <h1 className="font-display text-[52px] font-black leading-none sm:text-[72px] md:text-[88px] text-gray-900">
              Macro{" "}
              <span className="relative inline-block gradient-heading">
                Calculator
                <motion.svg initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 1.1, ease: "easeOut" }}
                  className="absolute -bottom-2 left-0 w-full overflow-visible" viewBox="0 0 500 10" fill="none">
                  <motion.path d="M2 5 Q125 1 250 5 Q375 9 498 5"
                    stroke="url(#lineGrad)" strokeWidth="3.5" strokeLinecap="round" fill="none"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 1.1 }} />
                  <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3fa34d" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                </motion.svg>
              </span>
            </h1>

            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.5 }}
              className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-gray-500">
              Enter your stats for a fully personalized daily macro plan — calories, protein, carbs & fat — powered by the{" "}
              <span className="font-bold text-gray-700">Mifflin-St Jeor</span> equation.
            </motion.p>

            {/* Feature pills */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5 }}
              className="mt-8 flex flex-wrap justify-center gap-2.5">
              {[
                { icon: "🎯", text: "Personalized plan" },
                { icon: "⚡", text: "Live calculations" },
                { icon: "🔬", text: "Science-backed" },
                { icon: "📱", text: "Mobile friendly" },
                { icon: "🖨️", text: "Export to PDF" },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2 rounded-full border border-gray-200/80 bg-white/70 px-4 py-2 text-sm font-semibold text-gray-600 shadow-sm backdrop-blur-sm">
                  {icon} {text}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* ═══ FORM ════════════════════════════════════════════════════════════════ */}
      <section className="pb-10 no-print">
        <Container>
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-3xl">
            {/* Card — NO overflow-hidden so dropdowns escape */}
            <div className="rounded-[32px] bg-white shadow-[0_16px_64px_-16px_rgba(0,0,0,0.14),0_0_0_1px_rgba(0,0,0,0.04)]">

              {/* Card header */}
              <div className="flex items-center gap-4 border-b border-gray-100/80 px-8 py-5">
                <motion.div whileHover={{ rotate: 10, scale: 1.05 }} className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary to-emerald-600 shadow-[0_4px_16px_-4px_rgba(63,163,77,0.5)] text-white">
                  <Calculator className="size-5" />
                </motion.div>
                <div className="flex-1">
                  <h2 className="text-lg font-black text-gray-900">Your Personal Stats</h2>
                  <p className="text-sm text-gray-400">Fill in your details for a precise macro plan</p>
                </div>
                <div className="hidden items-center gap-2 rounded-full bg-brand-primary/8 px-3 py-1.5 sm:flex">
                  <span className="size-1.5 animate-pulse rounded-full bg-brand-primary" />
                  <span className="text-xs font-bold text-brand-primary-dark">Live calc</span>
                </div>
              </div>

              <div className="space-y-8 p-8">
                {/* Unit + Gender */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-400">Unit System</label>
                    <div className="relative grid grid-cols-2 gap-1 rounded-2xl bg-gray-100/80 p-1">
                      {(["metric", "imperial"] as UnitSystem[]).map(u => (
                        <button key={u} type="button" onClick={() => setForm(f => ({ ...f, unit: u }))}
                          className="relative z-10 flex items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-bold transition-colors duration-200">
                          {form.unit === u && (
                            <motion.span layoutId="unit-pill"
                              className="absolute inset-0 rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
                              transition={{ type: "spring", stiffness: 500, damping: 32 }} />
                          )}
                          <span className="relative z-10">{u === "metric" ? "⚖️" : "🇺🇸"}</span>
                          <span className={cn("relative z-10 transition-colors duration-200", form.unit === u ? "text-brand-primary-dark" : "text-gray-400")}>
                            {u === "metric" ? "Metric" : "Imperial"}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-400">Biological Sex</label>
                    <div className="grid grid-cols-2 gap-3">
                      {(["male", "female"] as Gender[]).map(g => (
                        <button key={g} type="button" onClick={() => setForm(f => ({ ...f, gender: g }))}
                          className={cn(
                            "relative flex items-center justify-center gap-2.5 rounded-2xl border-2 py-3.5 text-sm font-black transition-all duration-200",
                            form.gender === g
                              ? "border-brand-primary bg-gradient-to-br from-brand-primary/8 to-emerald-50 text-brand-primary-dark shadow-[0_2px_12px_rgba(63,163,77,0.15)]"
                              : "border-gray-200 bg-gray-50/50 text-gray-500 hover:border-brand-primary/40 hover:bg-white"
                          )}>
                          <span className="text-2xl">{g === "male" ? "👨" : "👩"}</span>
                          <span>{g === "male" ? "Male" : "Female"}</span>
                          <AnimatePresence>
                            {form.gender === g && (
                              <motion.span initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }}
                                className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-brand-primary shadow-sm">
                                <Check className="size-3 text-white stroke-[3]" />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sliders */}
                <div className="grid gap-6 sm:grid-cols-3">
                  <Slider label="Age" value={form.age} min={10} max={80} unit="yrs" onChange={v => setForm(f => ({ ...f, age: v }))} />
                  {isMetric
                    ? <Slider label="Height" value={form.heightCm} min={140} max={220} unit="cm" onChange={v => setForm(f => ({ ...f, heightCm: v }))} />
                    : <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Height</label>
                        <div className="grid grid-cols-2 gap-3">
                          <Slider label="" value={form.heightFt} min={4} max={7} unit="ft" onChange={v => setForm(f => ({ ...f, heightFt: v }))} />
                          <Slider label="" value={form.heightIn} min={0} max={11} unit="in" onChange={v => setForm(f => ({ ...f, heightIn: v }))} />
                        </div>
                      </div>
                  }
                  {isMetric
                    ? <Slider label="Weight" value={form.weightKg} min={30} max={180} unit="kg" onChange={v => setForm(f => ({ ...f, weightKg: v }))} />
                    : <Slider label="Weight" value={form.weightLbs} min={65} max={400} unit="lbs" onChange={v => setForm(f => ({ ...f, weightLbs: v }))} />
                  }
                </div>

                {/* Body Fat (optional) */}
                <div className="rounded-2xl border-2 border-dashed border-gray-200 p-4 transition-colors duration-300 hover:border-brand-primary/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="flex items-center gap-2 text-sm font-black text-gray-700">
                        Body Fat %
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-gray-400">Optional</span>
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400">Enables Katch-McArdle formula for more accurate BMR</p>
                    </div>
                    <Toggle value={showBF} onChange={v => { setShowBF(v); setForm(f => ({ ...f, bodyFatPct: v ? 20 : null })); }} />
                  </div>
                  <AnimatePresence>
                    {showBF && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                        <div className="mt-5">
                          <Slider label="Body Fat Percentage" value={form.bodyFatPct ?? 20} min={5} max={50} unit="%" onChange={v => setForm(f => ({ ...f, bodyFatPct: v }))} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Dropdowns — z-[200] ensures they escape */}
                <div className="grid gap-5 sm:grid-cols-3">
                  <Dropdown label="Activity Level" icon={<Activity className="size-4" />} value={form.activity}
                    options={ACTIVITY_OPTIONS.map(o => ({ value: o.value, label: o.label, desc: o.desc, emoji: o.emoji }))}
                    onChange={v => setForm(f => ({ ...f, activity: v }))} />
                  <Dropdown label="Fitness Goal" icon={<Target className="size-4" />} value={form.goal}
                    options={GOAL_OPTIONS.map(o => ({ value: o.value, label: o.label, desc: o.desc, emoji: o.emoji }))}
                    onChange={v => setForm(f => ({ ...f, goal: v }))} />
                  <Dropdown label="Diet Style" icon={<Utensils className="size-4" />} value={form.diet}
                    options={DIET_OPTIONS.map(o => ({ value: o.value, label: o.label, emoji: o.emoji }))}
                    onChange={(v: DietaryPref) => { setForm(f => ({ ...f, diet: v })); setCustomProt(null); setCustomCarb(null); setCustomFat(null); }} />
                </div>

                {/* CTA button */}
                <div className="pt-2">
                  <motion.button type="button" onClick={handleCalculate} whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.01 }}
                    className="group relative w-full overflow-hidden rounded-2xl py-5 text-base font-black text-white shadow-[0_8px_32px_-6px_rgba(63,163,77,0.55)] transition-shadow hover:shadow-[0_12px_40px_-6px_rgba(63,163,77,0.65)]">
                    <div className="animated-gradient absolute inset-0" />
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      <Calculator className="size-5" />
                      Calculate My Personalized Macros
                      <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}>
                        <ChevronRight className="size-5" />
                      </motion.span>
                    </span>
                  </motion.button>
                  <p className="mt-2.5 text-center text-xs text-gray-400">100% free · No sign-up · Mifflin-St Jeor equation</p>
                </div>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ═══ RESULTS ════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
      {calculated && (
        <motion.section ref={resultsRef}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="pb-24 no-print">
          <Container>
            <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto max-w-5xl space-y-5">

              {/* Results header bar */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-emerald-600 text-white shadow-lg shadow-brand-primary/30">
                    <Check className="size-4" />
                  </motion.div>
                  <div>
                    <h2 className="font-black text-gray-900">Your Personalized Macro Plan</h2>
                    <p className="text-sm text-gray-400">{goalOpt.emoji} {goalOpt.label} · Mifflin-St Jeor BMR</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleCopy}
                    className={cn("flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-bold transition-all", copied ? "bg-brand-primary text-white" : "border border-gray-200 bg-white text-gray-600 shadow-sm hover:border-brand-primary/40")}>
                    {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <button onClick={handlePrint} className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-bold text-gray-600 shadow-sm hover:border-brand-primary/40 transition-colors">
                    <Download className="size-3.5" /> PDF
                  </button>
                  <button onClick={handleReset} className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-bold text-gray-600 shadow-sm hover:border-gray-300 transition-colors">
                    <RotateCcw className="size-3.5" /> Reset
                  </button>
                </div>
              </div>

              {/* ── Calorie Hero ── */}
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
                className="relative overflow-hidden rounded-3xl p-7 text-white shadow-[0_20px_60px_-12px_rgba(26,122,42,0.45)]">
                <div className="absolute inset-0 animated-gradient" />
                <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-white/[0.08]" />
                <div className="pointer-events-none absolute -bottom-10 -left-10 size-48 rounded-full bg-black/[0.07]" />
                <div className="pointer-events-none absolute right-24 bottom-0 size-32 rounded-full bg-white/[0.06]" />

                <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-white/60">Daily Calorie Target</p>
                    <div className="mt-2 flex items-baseline gap-3">
                      <span className="text-[72px] font-black leading-none tabular-nums drop-shadow-lg">
                        <LiveNumber value={results.calories} />
                      </span>
                      <div>
                        <p className="text-xl font-semibold text-white/70">kcal</p>
                        <p className="text-sm text-white/40">per day</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white/18 px-3 py-1.5 text-xs font-bold backdrop-blur-sm">Goal: {goalOpt.emoji} {goalOpt.label}</span>
                      <span className="rounded-full bg-white/18 px-3 py-1.5 text-xs font-bold backdrop-blur-sm">Mifflin-St Jeor</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5 md:w-44 md:grid-cols-1">
                    {[
                      { l: "BMR",   v: results.bmr,   e: "🫀", s: "Basal rate" },
                      { l: "TDEE",  v: results.tdee,  e: "⚡", s: "With activity" },
                      { l: "Fiber", v: results.fiber, e: "🌾", s: "g/day" },
                    ].map(({ l, v, e, s }) => (
                      <div key={l} className="rounded-2xl bg-white/15 px-3 py-2.5 backdrop-blur-sm">
                        <p className="text-[11px] font-semibold text-white/60">{e} {l}</p>
                        <p className="mt-0.5 text-lg font-black tabular-nums"><LiveNumber value={v} /></p>
                        <p className="text-[10px] text-white/40">{s}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* ── 3 Macro Cards ── */}
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Protein",  grams: adjProtein, pct: activeProt, kcal: adjProtein*4, color:"#16a34a", bg:"linear-gradient(135deg,#f0fdf4,#dcfce7)", gradFrom:"#86efac", gradTo:"#16a34a", icon:"💪", tip:"Builds & repairs muscle" },
                  { label: "Carbs",    grams: adjCarbs,   pct: activeCarb, kcal: adjCarbs*4,   color:"#d97706", bg:"linear-gradient(135deg,#fffbeb,#fef3c7)", gradFrom:"#fde68a", gradTo:"#d97706", icon:"⚡", tip:"Primary energy source" },
                  { label: "Fats",     grams: adjFat,     pct: activeFat,  kcal: adjFat*9,     color:"#7c3aed", bg:"linear-gradient(135deg,#faf5ff,#ede9fe)", gradFrom:"#c4b5fd", gradTo:"#7c3aed", icon:"🫒", tip:"Hormones & brain health" },
                ].map((m, i) => (
                  <motion.div key={m.label} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + i * 0.08 }}>
                    <MacroBar {...m} />
                  </motion.div>
                ))}
              </div>

              {/* ── Donut + Meal Split ── */}
              <div className="grid gap-4 md:grid-cols-2">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.28 }}
                  className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/[0.04]">
                  <p className="mb-5 text-[11px] font-black uppercase tracking-widest text-gray-400">Macro Distribution</p>
                  <div className="flex items-center gap-6">
                    <div className="relative shrink-0">
                      <svg viewBox="0 0 168 168" className="h-36 w-36">
                        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={20} />
                        {donutData.map(({ pct, color }) => {
                          const dash = (pct / 100) * circ - 4;
                          const rot  = (cumPct / 100) * 360 - 90;
                          const el = (
                            <motion.circle key={color} cx={cx} cy={cy} r={r}
                              fill="none" stroke={color} strokeWidth={20} strokeLinecap="round"
                              animate={{ strokeDasharray: `${Math.max(0, dash)} ${circ}` }}
                              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                              transform={`rotate(${rot} ${cx} ${cy})`}
                              style={{ strokeDasharray: `0 ${circ}` }}
                            />
                          );
                          cumPct += pct;
                          return el;
                        })}
                      </svg>
                      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-gray-900"><LiveNumber value={results.calories} /></span>
                        <span className="text-[10px] text-gray-400 font-semibold">kcal/day</span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-3">
                      {donutData.map(({ label, color, grams, pct }) => (
                        <div key={label}>
                          <div className="mb-1 flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <span className="size-2.5 rounded-full" style={{ background: color }} />
                              <span className="font-semibold text-gray-600">{label}</span>
                            </div>
                            <span className="font-black tabular-nums" style={{ color }}><LiveNumber value={grams} />g</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                            <motion.div className="h-full rounded-full" animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} style={{ background: color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.32 }}
                  className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/[0.04]">
                  <p className="mb-5 text-[11px] font-black uppercase tracking-widest text-gray-400">Suggested Meal Split</p>
                  <div className="space-y-4">
                    {[
                      { name: "Breakfast", emoji: "🌅", pct: 25, color: "#f97316", bg: "#fff7ed" },
                      { name: "Lunch",     emoji: "☀️",  pct: 30, color: "#f59e0b", bg: "#fffbeb" },
                      { name: "Dinner",    emoji: "🌙", pct: 30, color: "#ef4444", bg: "#fef2f2" },
                      { name: "Snacks",    emoji: "🍎", pct: 15, color: "#8b5cf6", bg: "#faf5ff" },
                    ].map(({ name, emoji, pct, color, bg }) => (
                      <div key={name} className="flex items-center gap-3">
                        <span className="text-lg">{emoji}</span>
                        <div className="flex-1">
                          <div className="mb-1.5 flex justify-between text-sm">
                            <span className="font-bold text-gray-700">{name}</span>
                            <span className="font-black tabular-nums" style={{ color }}>~<LiveNumber value={Math.round(results.calories * pct / 100)} /> kcal</span>
                          </div>
                          <div className="h-2.5 overflow-hidden rounded-full" style={{ background: bg }}>
                            <motion.div className="h-full rounded-full" animate={{ width: `${(pct / 30) * 100}%` }}
                              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} style={{ background: color }} />
                          </div>
                        </div>
                        <span className="w-9 text-right text-xs font-bold text-gray-400">{pct}%</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* ── Stats Grid ── */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }}
                className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { label: "Water Intake", val: `${results.water.toFixed(1)}L`, sub: `~${Math.round(results.water * 1000 / 237)} cups/day`, icon: <Droplets className="size-5" />, iconBg: "#eff6ff", iconColor: "#0284c7" },
                  { label: "Ideal Weight",  val: `${results.idealWeightMin}–${results.idealWeightMax}${isMetric?"kg":"lbs"}`, sub: "Hamwi ±10%", icon: <Scale className="size-5" />, iconBg: "#f0fdf4", iconColor: "#16a34a" },
                  { label: "BMI Score",     val: results.bmi.toString(), sub: results.bmiStatus, icon: <Activity className="size-5" />, iconBg: "#f9fafb", iconColor: bmiInfo.color },
                  { label: "Daily Fiber",   val: `~${results.fiber}g`, sub: "Recommended", icon: <Wheat className="size-5" />, iconBg: "#fffbeb", iconColor: "#ca8a04" },
                ].map(({ label, val, sub, icon, iconBg, iconColor }) => (
                  <motion.div key={label} whileHover={{ y: -3 }}
                    className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/[0.04] transition-shadow hover:shadow-md">
                    <div className="flex size-10 items-center justify-center rounded-xl" style={{ background: iconBg }}>
                      <span style={{ color: iconColor }}>{icon}</span>
                    </div>
                    <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</p>
                    <p className="mt-1 text-xl font-black text-gray-900">{val}</p>
                    <p className="mt-0.5 text-xs text-gray-400">{sub}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* ── Customize + Tips ── */}
              <div className="grid gap-4 md:grid-cols-2">
                {/* Customize */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                  className="rounded-3xl bg-white shadow-sm ring-1 ring-black/[0.04]">
                  <button type="button" onClick={() => setShowAdjust(v => !v)} className="flex w-full items-center gap-3 p-5 text-left">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-brand-primary/10">
                      <RefreshCw className="size-4 text-brand-primary-dark" />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-gray-800">Customize Macro Split</p>
                      <p className="text-xs text-gray-400">Adjust protein, carbs & fat ratios</p>
                    </div>
                    <motion.div animate={{ rotate: showAdjust ? 180 : 0 }} transition={{ duration: 0.25 }}>
                      <ChevronDown className="size-5 text-gray-400" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {showAdjust && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                        <div className="space-y-5 border-t border-gray-100 px-5 pb-5 pt-4">
                          <p className="text-xs text-gray-400">Calories stay at <strong className="text-gray-700">{results.calories.toLocaleString()} kcal</strong></p>
                          {[
                            { label: "Protein", key: "prot" as const, value: activeProt, color: "#16a34a" },
                            { label: "Carbs",   key: "carb" as const, value: activeCarb, color: "#d97706" },
                            { label: "Fat",     key: "fat"  as const, value: activeFat,  color: "#7c3aed" },
                          ].map(({ label, key, value, color }) => (
                            <div key={key} className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm font-bold text-gray-600">{label}</span>
                                <span className="text-sm font-black" style={{ color }}>{value}%</span>
                              </div>
                              <input type="range" min={5} max={80} value={value} className="adj-range w-full"
                                onChange={e => handleAdjSlider(key, parseInt(e.target.value, 10))}
                                style={{ background: `linear-gradient(to right,${color} 0%,${color} ${((value-5)/75)*100}%,#e5e7eb ${((value-5)/75)*100}%,#e5e7eb 100%)`, color }}
                              />
                            </div>
                          ))}
                          <p className="text-[11px] text-gray-400"><Info className="mb-0.5 mr-1 inline size-3" />Total: {activeProt + activeCarb + activeFat}%</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Tips */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.44 }}
                  className="rounded-3xl bg-white shadow-sm ring-1 ring-black/[0.04]">
                  <button type="button" onClick={() => setShowTips(v => !v)} className="flex w-full items-center gap-3 p-5 text-left">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-amber-100 text-xl">{goalOpt.emoji}</div>
                    <div className="flex-1">
                      <p className="font-black text-gray-800">Tips for {goalOpt.label}</p>
                      <p className="text-xs text-gray-400">Expert guidance for your goal</p>
                    </div>
                    <motion.div animate={{ rotate: showTips ? 180 : 0 }} transition={{ duration: 0.25 }}>
                      <ChevronDown className="size-5 text-gray-400" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {showTips && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                        <div className="space-y-3 border-t border-gray-100 px-5 pb-5 pt-4">
                          {GOAL_TIPS[form.goal].map((tip, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.08 }} className="flex gap-3">
                              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-emerald-600 text-[11px] font-black text-white">
                                {i + 1}
                              </span>
                              <p className="text-sm leading-relaxed text-gray-600">{tip}</p>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* ── Footer action bar ── */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gray-50/80 p-4 ring-1 ring-gray-200/60">
                <p className="text-xs text-gray-400">
                  <Info className="mb-0.5 mr-1 inline size-3.5" />
                  Mifflin-St Jeor BMR · Activity multiplier · Goal calorie adjustment · Hamwi ideal weight ±10%
                </p>
                <div className="flex gap-2.5">
                  <button onClick={() => { setCalculated(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-primary to-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-[0_4px_16px_-4px_rgba(63,163,77,0.5)] transition-all hover:shadow-[0_6px_20px_-4px_rgba(63,163,77,0.6)]">
                    <Edit3 className="size-4" /> Edit & Recalculate
                  </button>
                  <button onClick={handlePrint} className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-600 shadow-sm hover:border-brand-primary/40 transition-colors">
                    <Printer className="size-4" /> Print
                  </button>
                </div>
              </motion.div>

            </motion.div>
          </Container>
        </motion.section>
      )}
      </AnimatePresence>
    </>
  );
}
