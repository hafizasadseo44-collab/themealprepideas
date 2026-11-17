"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  ChevronDown,
  Sparkles,
  BookOpen,
  Scale,
  Activity,
  Flame,
  PieChart,
  Utensils,
  Droplets,
  HeartPulse,
  Apple,
  FileText,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  Calculator,
  Sliders,
  ExternalLink,
  Layers,
  Award,
  Clock,
  Printer,
  ChevronRight,
} from "lucide-react";
import Container from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import { FAQ_ITEMS } from "./macroCalculatorData";

export default function MacroCalculatorGuide() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <article className="mt-14 space-y-20 border-t border-brand-border/60 pt-16 text-brand-body">
      {/* ─── OVERVIEW CALLOUT BANNER ────────────────────────────────────────── */}
      <section aria-labelledby="overview-heading">
        <Container>
          <div className="relative overflow-hidden rounded-[28px] border border-brand-primary/20 bg-gradient-to-br from-brand-primary/[0.04] via-white to-emerald-50/50 p-7 sm:p-10 shadow-xs">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-brand-primary/10 px-3.5 py-1 text-xs font-bold text-brand-primary-dark">
                  <Sparkles className="size-3.5" />
                  Comprehensive Nutritional Planning
                </div>
                <h2 id="overview-heading" className="font-display text-2xl sm:text-3xl text-brand-heading">
                  About Our Free Macro Calculator
                </h2>
                <p className="text-sm sm:text-base leading-relaxed text-brand-body">
                  Our <strong>Macro Calculator</strong> estimates your daily calorie needs and provides a breakdown of protein, carbohydrates, and dietary fat in grams and percentages. It also displays your BMR, TDEE, estimated fiber and water intake, BMI, and suggested calorie distribution across meals.
                </p>
                <p className="text-sm sm:text-base leading-relaxed text-brand-body">
                  Choose your preferred measurement system, activity level, and fitness goal, then explore six diet styles, including Balanced, High Protein, Low Carb, Keto, Vegetarian, and Vegan. You can also customize your macro ratios, review your results, and print your personalized breakdown. It&apos;s free to use, with no account or sign-up required.
                </p>
              </div>

              {/* Quick Jump Links */}
              <div className="rounded-[22px] border border-brand-border/80 bg-white/90 p-5 shadow-xs md:w-80 shrink-0">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-heading">
                  Quick Navigation
                </p>
                <nav className="mt-3 space-y-2 text-xs font-medium text-brand-light">
                  <a href="#how-to-use" className="flex items-center justify-between rounded-lg p-2 hover:bg-brand-gray hover:text-brand-heading transition-colors">
                    <span>1. How to Use the Calculator</span>
                    <ChevronRight className="size-3.5" />
                  </a>
                  <a href="#how-it-works" className="flex items-center justify-between rounded-lg p-2 hover:bg-brand-gray hover:text-brand-heading transition-colors">
                    <span>2. Calculation Methodology</span>
                    <ChevronRight className="size-3.5" />
                  </a>
                  <a href="#understanding-results" className="flex items-center justify-between rounded-lg p-2 hover:bg-brand-gray hover:text-brand-heading transition-colors">
                    <span>3. Understanding Your Results</span>
                    <ChevronRight className="size-3.5" />
                  </a>
                  <a href="#fitness-goals" className="flex items-center justify-between rounded-lg p-2 hover:bg-brand-gray hover:text-brand-heading transition-colors">
                    <span>4. Tips for Your Fitness Goal</span>
                    <ChevronRight className="size-3.5" />
                  </a>
                  <a href="#meal-prep-tips" className="flex items-center justify-between rounded-lg p-2 hover:bg-brand-gray hover:text-brand-heading transition-colors">
                    <span>5. Meal Prep Application</span>
                    <ChevronRight className="size-3.5" />
                  </a>
                  <a href="#faqs" className="flex items-center justify-between rounded-lg p-2 hover:bg-brand-gray hover:text-brand-heading transition-colors">
                    <span>6. Frequently Asked Questions</span>
                    <ChevronRight className="size-3.5" />
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── SECTION 1: HOW TO USE ─────────────────────────────────────────── */}
      <section id="how-to-use" aria-labelledby="how-to-use-heading">
        <Container>
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-bold text-brand-primary-dark">
              <Sliders className="size-3.5" />
              Step-by-Step Guide
            </div>
            <h2 id="how-to-use-heading" className="font-display text-2xl sm:text-3xl md:text-4xl text-brand-heading">
              How to Use the Macro Calculator
            </h2>
            <p className="text-base text-brand-body leading-relaxed">
              Getting started is simple. Follow the steps below to enter your information and choose the settings that match your preferences.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Step 1 */}
            <div className="rounded-[22px] border border-brand-border/70 bg-white p-6 shadow-xs hover:border-brand-primary/40 transition-colors">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-xl bg-brand-primary/10 font-mono text-sm font-bold text-brand-primary-dark">
                  01
                </span>
                <h3 className="font-display text-lg text-brand-heading">Choose Your Unit System</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-brand-body">
                First, select the measurement format you normally use:
              </p>
              <ul className="mt-3 space-y-2 text-sm text-brand-body">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-brand-heading">• Metric:</span> Enter your weight in kilograms (kg) and height in centimeters (cm).
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-brand-heading">• Imperial:</span> Enter your weight in pounds (lb) and height in feet and inches (ft/in).
                </li>
              </ul>
              <p className="mt-3 text-xs text-brand-light">
                The calculator automatically works with your selected units, so there&apos;s no need to convert measurements manually.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-[22px] border border-brand-border/70 bg-white p-6 shadow-xs hover:border-brand-primary/40 transition-colors">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-xl bg-brand-primary/10 font-mono text-sm font-bold text-brand-primary-dark">
                  02
                </span>
                <h3 className="font-display text-lg text-brand-heading">Select Your Biological Sex</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-brand-body">
                Choose the appropriate option: <strong>Male</strong> or <strong>Female</strong>.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-brand-body">
                The scientifically validated Mifflin-St Jeor equation uses different constants for these two calculations (+5 for men, −161 for women), so this selection helps determine your estimated resting energy expenditure with metabolic precision.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-[22px] border border-brand-border/70 bg-white p-6 shadow-xs hover:border-brand-primary/40 transition-colors">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-xl bg-brand-primary/10 font-mono text-sm font-bold text-brand-primary-dark">
                  03
                </span>
                <h3 className="font-display text-lg text-brand-heading">Enter Your Age, Height, and Weight</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-brand-body">
                Use the interactive sliders or numeric fields to provide your current measurements:
              </p>
              <ul className="mt-2.5 space-y-1.5 text-sm text-brand-body">
                <li>• <strong>Age:</strong> Select your age in years.</li>
                <li>• <strong>Height:</strong> Adjust the slider using centimeters or feet and inches.</li>
                <li>• <strong>Weight:</strong> Enter your weight in kilograms or pounds.</li>
              </ul>
              <p className="mt-3 text-xs text-brand-light">
                These measurements are used to calculate Basal Metabolic Rate (BMR). For a more meaningful estimate, enter accurate measurements rather than guessing.
              </p>
            </div>

            {/* Step 4 */}
            <div className="rounded-[22px] border border-brand-border/70 bg-white p-6 shadow-xs hover:border-brand-primary/40 transition-colors">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-xl bg-brand-primary/10 font-mono text-sm font-bold text-brand-primary-dark">
                  04
                </span>
                <h3 className="font-display text-lg text-brand-heading">Optional Body Fat Percentage Setting</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-brand-body">
                If you know your body fat percentage, enable the <strong>Body Fat %</strong> toggle and adjust the slider. This unlocks the advanced <strong>Katch-McArdle formula</strong> instead of the default Mifflin-St Jeor equation.
              </p>
              <p className="mt-2 text-xs text-brand-light leading-relaxed">
                The Katch-McArdle method estimates resting energy expenditure using <em>lean body mass</em> (total weight minus fat mass). Don&apos;t have a reliable measurement? Simply leave it disabled — the calculator works seamlessly with Mifflin-St Jeor.
              </p>
            </div>

            {/* Step 5 */}
            <div className="rounded-[22px] border border-brand-border/70 bg-white p-6 shadow-xs hover:border-brand-primary/40 transition-colors md:col-span-2">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-xl bg-brand-primary/10 font-mono text-sm font-bold text-brand-primary-dark">
                  05
                </span>
                <h3 className="font-display text-lg text-brand-heading">Select Your Activity Level</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-brand-body">
                Choose the activity level that best reflects your usual daily routine. This setting helps estimate your Total Daily Energy Expenditure (TDEE) by multiplying your BMR by the corresponding PAL (Physical Activity Level) factor:
              </p>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {[
                  { title: "Sedentary", mult: "1.2×", desc: "Little or no planned exercise, mostly sitting." },
                  { title: "Lightly Active", mult: "1.375×", desc: "Light exercise or sports 1–3 days per week." },
                  { title: "Moderately Active", mult: "1.55×", desc: "Regular exercise 3–5 days per week." },
                  { title: "Very Active", mult: "1.725×", desc: "Frequent exercise 6–7 days per week." },
                  { title: "Extremely Active", mult: "1.9×", desc: "Demanding physical job or twice-daily workouts." },
                ].map((act) => (
                  <div key={act.title} className="rounded-[14px] bg-brand-gray/50 p-3.5 border border-brand-border/60">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-xs text-brand-heading">{act.title}</p>
                      <span className="rounded bg-brand-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-brand-primary-dark">
                        {act.mult}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-brand-light leading-snug">{act.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 6 */}
            <div className="rounded-[22px] border border-brand-border/70 bg-white p-6 shadow-xs hover:border-brand-primary/40 transition-colors">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-xl bg-brand-primary/10 font-mono text-sm font-bold text-brand-primary-dark">
                  06
                </span>
                <h3 className="font-display text-lg text-brand-heading">Choose Your Fitness Goal</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-brand-body">
                Select the target that matches your current health focus:
              </p>
              <div className="mt-3 space-y-2 text-xs sm:text-sm">
                <div className="flex items-baseline justify-between rounded-lg bg-brand-gray/40 p-2">
                  <span className="font-semibold text-brand-heading">• Lose Weight:</span>
                  <span className="text-brand-orange-deep font-semibold">−500 kcal/day (sustainable cut)</span>
                </div>
                <div className="flex items-baseline justify-between rounded-lg bg-brand-gray/40 p-2">
                  <span className="font-semibold text-brand-heading">• Fat Loss:</span>
                  <span className="text-brand-orange font-semibold">−300 kcal/day (moderate deficit)</span>
                </div>
                <div className="flex items-baseline justify-between rounded-lg bg-brand-gray/40 p-2">
                  <span className="font-semibold text-brand-heading">• Body Recomp / Maintain:</span>
                  <span className="text-emerald-700 font-semibold">Maintenance calories (energy balance)</span>
                </div>
                <div className="flex items-baseline justify-between rounded-lg bg-brand-gray/40 p-2">
                  <span className="font-semibold text-brand-heading">• Lean Bulk / Build:</span>
                  <span className="text-blue-700 font-semibold">+200 to +300 kcal/day (clean surplus)</span>
                </div>
              </div>
            </div>

            {/* Step 7 */}
            <div className="rounded-[22px] border border-brand-border/70 bg-white p-6 shadow-xs hover:border-brand-primary/40 transition-colors">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-xl bg-brand-primary/10 font-mono text-sm font-bold text-brand-primary-dark">
                  07
                </span>
                <h3 className="font-display text-lg text-brand-heading">Select Your Diet Style</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-brand-body">
                Choose from six established diet styles to see how daily protein, carbohydrates, and fat adjust:
              </p>
              <div className="mt-3 overflow-hidden rounded-[14px] border border-brand-border/60">
                <table className="w-full text-left text-xs">
                  <thead className="bg-brand-gray/80 text-brand-heading font-bold">
                    <tr>
                      <th className="p-2.5">Diet Style</th>
                      <th className="p-2.5">What It Means</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border/40 text-brand-body">
                    <tr>
                      <td className="p-2.5 font-semibold text-brand-heading">Balanced</td>
                      <td className="p-2.5">General distribution (30% Protein, 40% Carbs, 30% Fat).</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-brand-heading">High Protein</td>
                      <td className="p-2.5">Greater emphasis on protein (40% Protein, 35% Carbs, 25% Fat).</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-brand-heading">Low Carb</td>
                      <td className="p-2.5">Allocates a smaller proportion to carbs (35% P, 25% C, 40% F).</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-brand-heading">Keto</td>
                      <td className="p-2.5">High fat, very low carb distribution (25% P, 5% C, 70% F).</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-brand-heading">Vegetarian / Vegan</td>
                      <td className="p-2.5">Plant-forward distributions excluding meat or all animal products.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── SECTION 2: HOW IT WORKS & FORMULAS ────────────────────────────── */}
      <section id="how-it-works" aria-labelledby="how-it-works-heading">
        <Container>
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-bold text-brand-primary-dark">
              <Calculator className="size-3.5" />
              Scientific Principles
            </div>
            <h2 id="how-it-works-heading" className="font-display text-2xl sm:text-3xl md:text-4xl text-brand-heading">
              How Does the Macro Calculator Work?
            </h2>
            <p className="text-base text-brand-body leading-relaxed">
              The Macro Calculator uses your measurements, activity level, and selected preferences to estimate your daily energy needs and macronutrient distribution. It first estimates your resting energy expenditure, then uses your activity level and calculator settings to determine the calorie estimate used for your macro breakdown.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Mifflin-St Jeor Card */}
            <div className="rounded-[24px] border border-brand-border/70 bg-white p-7 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                  Default Equation
                </span>
                <span className="text-xs text-brand-light">AJCN, 1990</span>
              </div>
              <h3 className="mt-3 font-display text-xl text-brand-heading">Mifflin-St Jeor Equation</h3>
              <p className="mt-2 text-sm text-brand-body leading-relaxed">
                Published in the <em>American Journal of Clinical Nutrition</em> (1990), this equation was developed using data from 498 healthy adults and is considered the gold-standard clinical formula for resting energy expenditure (REE/BMR):
              </p>

              <div className="mt-5 space-y-3 font-mono text-xs">
                <div className="rounded-[14px] bg-brand-gray/70 p-4 border border-brand-border/60">
                  <span className="block text-[11px] font-bold text-brand-primary uppercase">Men:</span>
                  <p className="mt-1 font-semibold text-brand-heading">
                    REE = (10 × weight_kg) + (6.25 × height_cm) − (5 × age) + 5
                  </p>
                </div>
                <div className="rounded-[14px] bg-brand-gray/70 p-4 border border-brand-border/60">
                  <span className="block text-[11px] font-bold text-brand-primary uppercase">Women:</span>
                  <p className="mt-1 font-semibold text-brand-heading">
                    REE = (10 × weight_kg) + (6.25 × height_cm) − (5 × age) − 161
                  </p>
                </div>
              </div>

              <p className="mt-4 text-xs text-brand-light leading-relaxed">
                Inputs: weight in kilograms, height in centimeters, age in years. The output is your Basal Metabolic Rate (BMR) at rest.
              </p>
            </div>

            {/* Katch-McArdle Card */}
            <div className="rounded-[24px] border border-brand-border/70 bg-white p-7 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-800">
                  Body Fat % Mode
                </span>
                <span className="text-xs text-brand-light">Lean Mass Based</span>
              </div>
              <h3 className="mt-3 font-display text-xl text-brand-heading">Katch-McArdle Formula</h3>
              <p className="mt-2 text-sm text-brand-body leading-relaxed">
                When you input body fat percentage, the calculator switches to Katch-McArdle. This method calculates resting energy expenditure directly from <strong>Lean Body Mass (LBM)</strong> rather than total body weight:
              </p>

              <div className="mt-5 space-y-3 font-mono text-xs">
                <div className="rounded-[14px] bg-brand-gray/70 p-4 border border-brand-border/60">
                  <span className="block text-[11px] font-bold text-purple-700 uppercase">Formula:</span>
                  <p className="mt-1 font-semibold text-brand-heading">
                    REE = 370 + (21.6 × LBM_kg)
                  </p>
                  <p className="mt-1.5 text-[11px] text-brand-light">
                    where LBM = Weight × (1 − (Body Fat % / 100))
                  </p>
                </div>
              </div>

              <p className="mt-4 text-xs text-brand-light leading-relaxed">
                Because this formula relies heavily on body composition, it is especially valuable for muscular individuals, athletes, or anyone with measured body fat.
              </p>
            </div>
          </div>

          {/* TDEE & Macro Math Worked Example */}
          <div className="mt-8 rounded-[24px] border border-brand-border/70 bg-white p-7 shadow-xs">
            <h3 className="font-display text-xl text-brand-heading">
              From Resting Energy (BMR) to Daily Macro Allocations
            </h3>
            <p className="mt-2 text-sm text-brand-body leading-relaxed">
              Your Basal Metabolic Rate provides the baseline. To determine your total daily burn, the calculator applies your activity multiplier to estimate <strong>Total Daily Energy Expenditure (TDEE)</strong>:
            </p>

            <div className="mt-4 rounded-[16px] bg-brand-primary/[0.04] p-5 border border-brand-primary/20">
              <p className="font-mono text-sm font-bold text-brand-primary-dark">
                TDEE = BMR × Activity Multiplier
              </p>
              <p className="mt-2 text-xs sm:text-sm text-brand-body leading-relaxed">
                <strong>Worked Calculation Example:</strong> If your estimated BMR is 1,600 calories and your activity level is Moderately Active (1.375× multiplier):
                <br />
                <code className="mt-1 inline-block rounded bg-white px-2 py-0.5 font-mono text-xs font-bold text-brand-heading border border-brand-border">
                  1,600 × 1.375 = 2,200 calories per day
                </code>
              </p>
            </div>

            {/* 4-4-9 Macro Energy Density Table */}
            <div className="mt-6">
              <h4 className="font-display text-base text-brand-heading">
                How Protein, Carbohydrates, and Fat Grams Are Calculated
              </h4>
              <p className="mt-1.5 text-xs sm:text-sm text-brand-body">
                Each macronutrient provides a specific, standardized amount of physiological energy per gram:
              </p>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-[16px] border border-emerald-200 bg-emerald-50/50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-emerald-900">Protein</span>
                    <span className="rounded bg-emerald-200/60 px-2 py-0.5 text-xs font-black text-emerald-900">4 kcal/g</span>
                  </div>
                  <p className="mt-2 text-xs text-brand-body">
                    Conversion: <code>Allocated kcal ÷ 4</code>
                  </p>
                  <p className="mt-1 text-[11px] text-brand-light">
                    e.g., 600 kcal ÷ 4 = <strong>150g protein</strong>
                  </p>
                </div>

                <div className="rounded-[16px] border border-amber-200 bg-amber-50/50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-amber-900">Carbohydrates</span>
                    <span className="rounded bg-amber-200/60 px-2 py-0.5 text-xs font-black text-amber-900">4 kcal/g</span>
                  </div>
                  <p className="mt-2 text-xs text-brand-body">
                    Conversion: <code>Allocated kcal ÷ 4</code>
                  </p>
                  <p className="mt-1 text-[11px] text-brand-light">
                    e.g., 900 kcal ÷ 4 = <strong>225g carbs</strong>
                  </p>
                </div>

                <div className="rounded-[16px] border border-purple-200 bg-purple-50/50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-purple-900">Dietary Fat</span>
                    <span className="rounded bg-purple-200/60 px-2 py-0.5 text-xs font-black text-purple-900">9 kcal/g</span>
                  </div>
                  <p className="mt-2 text-xs text-brand-body">
                    Conversion: <code>Allocated kcal ÷ 9</code>
                  </p>
                  <p className="mt-1 text-[11px] text-brand-light">
                    e.g., 600 kcal ÷ 9 = <strong>67g fat</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── SECTION 3: UNDERSTANDING RESULTS ───────────────────────────────── */}
      <section id="understanding-results" aria-labelledby="results-heading">
        <Container>
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-bold text-brand-primary-dark">
              <PieChart className="size-3.5" />
              Metrics Breakdown
            </div>
            <h2 id="results-heading" className="font-display text-2xl sm:text-3xl md:text-4xl text-brand-heading">
              Understanding Your Macro Calculator Results
            </h2>
            <p className="text-base text-brand-body leading-relaxed">
              Once you complete the calculation, the results panel brings your estimated calorie needs and macronutrient breakdown together in one place. Each figure represents a different part of the calculation, so understanding what it means can help you interpret the results more clearly.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Calorie & BMR/TDEE */}
            <div className="rounded-[20px] border border-brand-border/70 bg-white p-6 shadow-xs">
              <div className="flex size-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <Flame className="size-5" />
              </div>
              <h3 className="mt-4 font-display text-lg text-brand-heading">Daily Calorie Target</h3>
              <p className="mt-2 text-xs sm:text-sm text-brand-body leading-relaxed">
                The main headline figure represents your estimated daily energy requirement based on resting needs, activity, and your fitness goal adjustment.
              </p>
              <div className="mt-3 rounded-xl bg-brand-gray/60 p-3 text-xs">
                <p><strong>BMR:</strong> Resting energy burn</p>
                <p className="mt-1"><strong>TDEE:</strong> Total burn including movement</p>
              </div>
            </div>

            {/* Protein, Carbs, Fat */}
            <div className="rounded-[20px] border border-brand-border/70 bg-white p-6 shadow-xs">
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <PieChart className="size-5" />
              </div>
              <h3 className="mt-4 font-display text-lg text-brand-heading">Grams &amp; Percentages</h3>
              <p className="mt-2 text-xs sm:text-sm text-brand-body leading-relaxed">
                Macronutrients are shown in both percentage split and daily grams:
              </p>
              <div className="mt-3 overflow-hidden rounded-xl border border-brand-border/60 text-xs">
                <div className="flex justify-between bg-emerald-50 px-3 py-1 font-semibold text-emerald-900">
                  <span>Protein (30%)</span>
                  <span>~184g</span>
                </div>
                <div className="flex justify-between bg-amber-50 px-3 py-1 font-semibold text-amber-900">
                  <span>Carbs (40%)</span>
                  <span>~245g</span>
                </div>
                <div className="flex justify-between bg-purple-50 px-3 py-1 font-semibold text-purple-900">
                  <span>Fat (30%)</span>
                  <span>~82g</span>
                </div>
              </div>
            </div>

            {/* Suggested Meal Split */}
            <div className="rounded-[20px] border border-brand-border/70 bg-white p-6 shadow-xs">
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Utensils className="size-5" />
              </div>
              <h3 className="mt-4 font-display text-lg text-brand-heading">Suggested Meal Split</h3>
              <p className="mt-2 text-xs sm:text-sm text-brand-body leading-relaxed">
                Divides your calories into practical meal prep portions:
              </p>
              <div className="mt-3 space-y-1.5 text-xs text-brand-heading font-medium">
                <div className="flex justify-between"><span>Breakfast</span><span>25%</span></div>
                <div className="flex justify-between"><span>Lunch</span><span>30%</span></div>
                <div className="flex justify-between"><span>Dinner</span><span>30%</span></div>
                <div className="flex justify-between"><span>Snacks</span><span>15%</span></div>
              </div>
            </div>

            {/* Hydration */}
            <div className="rounded-[20px] border border-brand-border/70 bg-white p-6 shadow-xs">
              <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600">
                <Droplets className="size-5" />
              </div>
              <h3 className="mt-4 font-display text-lg text-brand-heading">Water Intake Estimate</h3>
              <p className="mt-2 text-xs sm:text-sm text-brand-body leading-relaxed">
                Calculates daily fluid needs based on body mass (approximately 35ml per kg of body weight). Provides general hydration guidance in liters and cups.
              </p>
            </div>

            {/* Ideal Weight */}
            <div className="rounded-[20px] border border-brand-border/70 bg-white p-6 shadow-xs">
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <Scale className="size-5" />
              </div>
              <h3 className="mt-4 font-display text-lg text-brand-heading">Ideal Weight (Hamwi Formula)</h3>
              <p className="mt-2 text-xs sm:text-sm text-brand-body leading-relaxed">
                A height-based reference using the established Hamwi equation (±10% frame range). Useful for general context rather than a rigid prescription.
              </p>
            </div>

            {/* BMI & Fiber */}
            <div className="rounded-[20px] border border-brand-border/70 bg-white p-6 shadow-xs">
              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <Apple className="size-5" />
              </div>
              <h3 className="mt-4 font-display text-lg text-brand-heading">BMI &amp; Daily Fiber</h3>
              <p className="mt-2 text-xs sm:text-sm text-brand-body leading-relaxed">
                <strong>BMI:</strong> Weight (kg) ÷ Height (m)². General screening tool.
                <br />
                <strong>Fiber:</strong> ~14g per 1,000 kcal from beans, lentils, whole grains, fruits, vegetables, and seeds.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── SECTION 4: CUSTOM SPLIT & GOALS ───────────────────────────────── */}
      <section id="fitness-goals" aria-labelledby="goals-heading">
        <Container>
          <div className="rounded-[28px] border border-brand-border/70 bg-white p-8 sm:p-10 shadow-xs">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-bold text-brand-primary-dark">
                <Activity className="size-3.5" />
                Tailored Guidance
              </div>
              <h2 id="goals-heading" className="font-display text-2xl sm:text-3xl text-brand-heading">
                Customize Your Macro Split &amp; Fitness Goals
              </h2>
              <p className="text-sm sm:text-base text-brand-body leading-relaxed">
                Different individuals have different nutritional requirements. That&apos;s why our calculator includes a Custom Macro Split option where you can adjust protein, carbs, and fat sliders (ensuring they add up to 100%).
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-[18px] bg-brand-gray/50 p-5 border border-brand-border/60">
                <h3 className="font-semibold text-sm text-brand-heading">Lose Weight &amp; Fat Loss</h3>
                <p className="mt-2 text-xs text-brand-body leading-relaxed">
                  Lose Weight applies a −500 kcal deficit; Fat Loss uses a moderate −300 kcal deficit. Prioritize protein to preserve lean muscle tissue.
                </p>
              </div>

              <div className="rounded-[18px] bg-brand-gray/50 p-5 border border-brand-border/60">
                <h3 className="font-semibold text-sm text-brand-heading">Body Recomposition</h3>
                <p className="mt-2 text-xs text-brand-body leading-relaxed">
                  Aims to build muscle and trim fat simultaneously at maintenance calories with high protein (1.6–2.2g per kg) and progressive resistance training.
                </p>
              </div>

              <div className="rounded-[18px] bg-brand-gray/50 p-5 border border-brand-border/60">
                <h3 className="font-semibold text-sm text-brand-heading">Maintain Weight</h3>
                <p className="mt-2 text-xs text-brand-body leading-relaxed">
                  Matches energy intake with energy expenditure. Ideal for performance stability, diet breaks, and long-term metabolic health.
                </p>
              </div>

              <div className="rounded-[18px] bg-brand-gray/50 p-5 border border-brand-border/60">
                <h3 className="font-semibold text-sm text-brand-heading">Lean Bulk &amp; Build</h3>
                <p className="mt-2 text-xs text-brand-body leading-relaxed">
                  A controlled surplus (+200 to +300 kcal/day) optimizes muscle protein synthesis while minimizing unnecessary adipose storage.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── SECTION 5: MEAL PREP INTEGRATION ──────────────────────────────── */}
      <section id="meal-prep-tips" aria-labelledby="meal-prep-heading">
        <Container>
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-bold text-brand-primary-dark">
              <Utensils className="size-3.5" />
              Practical Kitchen Application
            </div>
            <h2 id="meal-prep-heading" className="font-display text-2xl sm:text-3xl text-brand-heading">
              How to Make the Most of Your Macro Calculator
            </h2>
            <p className="text-base text-brand-body leading-relaxed">
              The calculator brings several nutrition-related measurements together. Here are practical ways to apply its numbers to your weekly cooking routine:
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-[20px] border border-brand-border/70 bg-white p-6 shadow-xs">
              <span className="text-2xl">🥗</span>
              <h3 className="mt-3 font-semibold text-sm text-brand-heading">Compare Dietary Preferences</h3>
              <p className="mt-2 text-xs text-brand-body leading-relaxed">
                Toggle between Balanced, High Protein, Low Carb, Keto, Vegetarian, and Vegan to compare how ingredient choices change your macro totals.
              </p>
            </div>

            <div className="rounded-[20px] border border-brand-border/70 bg-white p-6 shadow-xs">
              <span className="text-2xl">🍗</span>
              <h3 className="mt-3 font-semibold text-sm text-brand-heading">Review Recipe Nutrition</h3>
              <p className="mt-2 text-xs text-brand-body leading-relaxed">
                When batch prepping chicken, lentils, brown rice, oats, and roasted greens, compare recipe cards against your daily targets.
              </p>
            </div>

            <div className="rounded-[20px] border border-brand-border/70 bg-white p-6 shadow-xs">
              <span className="text-2xl">📦</span>
              <h3 className="mt-3 font-semibold text-sm text-brand-heading">Organize Weekly Meal Prep</h3>
              <p className="mt-2 text-xs text-brand-body leading-relaxed">
                Use the Suggested Meal Split (25% Breakfast, 30% Lunch, 30% Dinner, 15% Snacks) to portion glass containers accurately for the work week.
              </p>
            </div>

            <div className="rounded-[20px] border border-brand-border/70 bg-white p-6 shadow-xs">
              <span className="text-2xl">🖨️</span>
              <h3 className="mt-3 font-semibold text-sm text-brand-heading">Print &amp; Save PDF</h3>
              <p className="mt-2 text-xs text-brand-body leading-relaxed">
                Click the Print button to save a branded one-page PDF sheet of your daily targets to tape onto your refrigerator or meal prep binder.
              </p>
            </div>
          </div>

          {/* Accuracy Note */}
          <div className="mt-8 rounded-[20px] border border-brand-border/70 bg-brand-gray/40 p-6">
            <div className="flex items-start gap-3">
              <HelpCircle className="size-5 text-brand-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-brand-heading">How Accurate Is a Macro Calculator?</h3>
                <p className="mt-1 text-xs text-brand-body leading-relaxed">
                  A macro calculator provides predicted values based on mathematical equations. It does not directly measure metabolism or individual gastrointestinal absorption. Factors like non-exercise activity thermogenesis (NEAT), sleep quality, fluid shifts, and tracking accuracy will cause day-to-day variance. Use these numbers as an educated starting baseline and adjust by ±100–150 kcal based on your 2–3 week weight trend.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── SECTION 6: FAQS (INTERACTIVE ACCORDION & AEO) ────────────────── */}
      <section id="faqs" aria-labelledby="faqs-heading">
        <Container>
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-bold text-brand-primary-dark">
              <HelpCircle className="size-3.5" />
              Frequently Asked Questions
            </div>
            <h2 id="faqs-heading" className="font-display text-2xl sm:text-3xl md:text-4xl text-brand-heading">
              Frequently Asked Questions About Macros &amp; Calories
            </h2>
            <p className="text-base text-brand-body leading-relaxed">
              Clear, scientifically grounded answers to the most common questions regarding macronutrient calculations, BMR, TDEE, and diet customization.
            </p>
          </div>

          <div className="mt-8 space-y-3 max-w-4xl">
            {FAQ_ITEMS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={cn(
                    "rounded-[18px] border transition-all duration-200",
                    isOpen
                      ? "border-brand-primary/40 bg-white shadow-xs"
                      : "border-brand-border/70 bg-white hover:border-brand-border"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="flex w-full items-center justify-between p-5 text-left transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="font-semibold text-sm sm:text-base text-brand-heading pr-4">
                      {faq.q}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0 text-brand-light"
                    >
                      <ChevronDown className="size-5" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-brand-border/40 px-5 pb-5 pt-3 text-xs sm:text-sm text-brand-body leading-relaxed">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ─── SECTION 7: SCIENTIFIC REFERENCES & DISCLAIMER ────────────────── */}
      <section aria-labelledby="references-heading">
        <Container>
          <div className="rounded-[24px] border border-brand-border/80 bg-white p-7 sm:p-9 shadow-xs">
            <div className="flex items-center gap-2">
              <BookOpen className="size-5 text-brand-primary" />
              <h2 id="references-heading" className="font-display text-xl text-brand-heading">
                Nutrition References and Calculation Methodology
              </h2>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-brand-body leading-relaxed">
              We believe nutrition information should be understandable and supported by reliable sources. The following references provide background for the calculation methods and nutrition concepts discussed on this page:
            </p>

            <ul className="mt-4 space-y-2 text-xs text-brand-body">
              <li className="flex items-start gap-2">
                <span className="font-bold text-brand-heading">• Mifflin-St Jeor Equation:</span>
                <span>Mifflin MD, St Jeor ST, Hill LA, Scott BJ, Daugherty SA, Koh YO. <em>A New Predictive Equation for Resting Energy Expenditure in Healthy Individuals.</em> American Journal of Clinical Nutrition, 1990; 51:241-247.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-brand-heading">• National Academies of Sciences, Engineering, and Medicine:</span>
                <span>Dietary Reference Intakes (DRIs) for Energy, Carbohydrate, Fiber, Fat, Fatty Acids, Cholesterol, Protein, and Amino Acids.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-brand-heading">• Centers for Disease Control and Prevention (CDC):</span>
                <span>Clinical Guidance about adult Body Mass Index (BMI) and its physiological interpretation and limitations.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-brand-heading">• USDA MyPlate:</span>
                <span>Dietary Guidelines for Americans and educational resources regarding whole-food meal planning.</span>
              </li>
            </ul>

            {/* Medical Disclaimer */}
            <div className="mt-6 flex items-start gap-3 rounded-[16px] bg-amber-50/70 p-4 border border-amber-200 text-amber-900 text-xs leading-relaxed">
              <ShieldAlert className="size-5 shrink-0 text-amber-700 mt-0.5" />
              <div>
                <strong className="block font-bold">Nutrition Disclaimer:</strong>
                This tool is intended for general educational purposes and is not a substitute for medical advice, diagnosis, or individualized nutrition care. Its estimates should not be treated as guaranteed health outcomes or personalized dietary prescriptions. Nutritional needs vary with age, health, activity, and other individual circumstances. People with medical conditions or specific nutrition concerns should consult a qualified healthcare professional or registered dietitian. Personalized calorie and weight-related calculations are intended for adults aged 18 and older.
              </div>
            </div>
          </div>
        </Container>
      </section>
    </article>
  );
}
