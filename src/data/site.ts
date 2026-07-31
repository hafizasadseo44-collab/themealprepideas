export type Collection = {
  slug: string;
  title: string;
  description: string;
  count: number;
  image: string;
};

export type Recipe = {
  slug: string;
  title: string;
  image: string;
  prepTime: string;
  calories: string;
  protein: string;
  rating: number;
};

export type TaxonomyItem = {
  label: string;
  slug: string;
};

export type Guide = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  readTime: string;
};

export type Faq = {
  question: string;
  answer: string;
};

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const heroPills = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "High Protein",
  "Chicken",
  "Weight Loss",
  "Vegan",
  "Keto",
];

export const trustBadges = [
  { title: "Easy to Follow", description: "Step-by-step instructions anyone can prep." },
  { title: "Beginner Friendly", description: "No fancy skills or equipment required." },
  { title: "Budget Friendly", description: "Simple ingredients that stretch further." },
  { title: "Family Friendly", description: "Recipes the whole household will eat." },
  { title: "High Protein Options", description: "Balanced macros for active lifestyles." },
  { title: "Freezer Friendly", description: "Batch it once, eat well all month." },
];

export const collections: Collection[] = [
  { slug: "healthy-meal-prep", title: "Healthy Meal Prep", description: "Balanced, whole-food recipes for every day.", count: 42, image: img("photo-1490645935967-10de6ba17061") },
  { slug: "easy-meal-prep", title: "Easy Meal Prep", description: "Minimal steps, maximum flavor.", count: 38, image: img("photo-1547592180-85f173990554") },
  { slug: "chicken-meal-prep", title: "Chicken Meal Prep", description: "Lean protein, endless variations.", count: 29, image: img("photo-1532550907401-a500c9a57435") },
  { slug: "high-protein-meal-prep", title: "High Protein", description: "Built for muscle and satiety.", count: 33, image: img("photo-1512621776951-a57141f2eefd") },
  { slug: "weight-loss-meal-prep", title: "Weight Loss", description: "Portioned meals to hit your goals.", count: 27, image: img("photo-1498837167922-ddd27525d352") },
  { slug: "breakfast-meal-prep", title: "Breakfast", description: "Grab-and-go mornings made easy.", count: 24, image: img("photo-1533089860892-a7c6f0a88666") },
  { slug: "lunch-meal-prep", title: "Lunch", description: "Midday meals that keep you fueled.", count: 31, image: img("photo-1546069901-ba9599a7e63c") },
  { slug: "dinner-meal-prep", title: "Dinner", description: "Wholesome dinners ready in minutes.", count: 26, image: img("photo-1490474418585-ba9bad8fd0ea") },
  { slug: "vegan-meal-prep", title: "Vegan", description: "Plant-powered and full of flavor.", count: 22, image: img("photo-1512058564366-18510be2db19") },
  { slug: "vegetarian-meal-prep", title: "Vegetarian", description: "Meatless meals that satisfy.", count: 20, image: img("photo-1540420773420-3366772f4999") },
  { slug: "keto-meal-prep", title: "Keto", description: "Low-carb, high-fat done right.", count: 18, image: img("photo-1544025162-d76694265947") },
  { slug: "low-carb-meal-prep", title: "Low Carb", description: "Lighter on carbs, big on taste.", count: 21, image: img("photo-1467003909585-2f8a72700288") },
];

export const featuredRecipes: Recipe[] = [
  { slug: "chicken-teriyaki-bowls", title: "Chicken Teriyaki Rice Bowls", image: img("photo-1543353071-873f17a7a088"), prepTime: "25 min", calories: "480 kcal", protein: "38g", rating: 4.9 },
  { slug: "overnight-oats-berries", title: "Overnight Oats with Berries", image: img("photo-1517673132405-a56a62b18caf"), prepTime: "10 min", calories: "320 kcal", protein: "14g", rating: 4.8 },
  { slug: "turkey-taco-bowls", title: "Ground Turkey Taco Bowls", image: img("photo-1550507992-eb63ffee0847"), prepTime: "30 min", calories: "410 kcal", protein: "32g", rating: 4.7 },
  { slug: "salmon-veggie-bowls", title: "Salmon & Roasted Veggie Bowls", image: img("photo-1467003909585-2f8a72700288"), prepTime: "35 min", calories: "460 kcal", protein: "36g", rating: 4.9 },
  { slug: "mediterranean-chickpea-salad", title: "Mediterranean Chickpea Salad", image: img("photo-1512621776951-a57141f2eefd"), prepTime: "20 min", calories: "350 kcal", protein: "16g", rating: 4.6 },
  { slug: "beef-stir-fry", title: "Beef & Broccoli Stir Fry", image: img("photo-1546069901-ba9599a7e63c"), prepTime: "28 min", calories: "440 kcal", protein: "34g", rating: 4.8 },
  { slug: "egg-veggie-muffins", title: "Egg & Veggie Breakfast Muffins", image: img("photo-1482049016688-2d3e1b311543"), prepTime: "22 min", calories: "220 kcal", protein: "18g", rating: 4.7 },
  { slug: "shrimp-fried-rice", title: "Shrimp Fried Rice Bowls", image: img("photo-1490645935967-10de6ba17061"), prepTime: "25 min", calories: "400 kcal", protein: "28g", rating: 4.8 },
];

export const byGoal: TaxonomyItem[] = [
  { label: "Weight Loss", slug: "weight-loss" },
  { label: "Muscle Gain", slug: "muscle-gain" },
  { label: "Bulking", slug: "bulking" },
  { label: "Budget", slug: "budget" },
  { label: "Busy Professionals", slug: "busy-professionals" },
  { label: "Family", slug: "family" },
  { label: "College", slug: "college" },
  { label: "Seniors", slug: "seniors" },
  { label: "Toddlers", slug: "toddlers" },
  { label: "Picky Eaters", slug: "picky-eaters" },
  { label: "Postpartum", slug: "postpartum" },
];

export const byDiet: TaxonomyItem[] = [
  { label: "Vegan", slug: "vegan" },
  { label: "Vegetarian", slug: "vegetarian" },
  { label: "Keto", slug: "keto" },
  { label: "Paleo", slug: "paleo" },
  { label: "Mediterranean", slug: "mediterranean" },
  { label: "Carnivore", slug: "carnivore" },
  { label: "Gluten Free", slug: "gluten-free" },
  { label: "Low Carb", slug: "low-carb" },
  { label: "Pescatarian", slug: "pescatarian" },
  { label: "Diabetic", slug: "diabetic" },
];

export const byProtein: TaxonomyItem[] = [
  { label: "Chicken", slug: "chicken" },
  { label: "Ground Beef", slug: "ground-beef" },
  { label: "Ground Turkey", slug: "ground-turkey" },
  { label: "Salmon", slug: "salmon" },
  { label: "Fish", slug: "fish" },
  { label: "Shrimp", slug: "shrimp" },
  { label: "Steak", slug: "steak" },
  { label: "Tofu", slug: "tofu" },
  { label: "Eggs", slug: "eggs" },
];

export const byMealType: TaxonomyItem[] = [
  { label: "Breakfast", slug: "breakfast" },
  { label: "Lunch", slug: "lunch" },
  { label: "Dinner", slug: "dinner" },
  { label: "Snacks", slug: "snacks" },
  { label: "Salads", slug: "salads" },
  { label: "Pasta", slug: "pasta" },
  { label: "Bowls", slug: "bowls" },
  { label: "Freezer Meals", slug: "freezer-meals" },
  { label: "Air Fryer", slug: "air-fryer" },
  { label: "Slow Cooker", slug: "slow-cooker" },
];

export const seasonal: Collection[] = [
  { slug: "summer-meal-prep", title: "Summer Meal Prep", description: "Light, fresh, and hydrating recipes.", count: 16, image: img("photo-1498837167922-ddd27525d352") },
  { slug: "winter-meal-prep", title: "Winter Meal Prep", description: "Cozy, warming, freezer-ready meals.", count: 14, image: img("photo-1547592180-85f173990554") },
];

export const cuisines: Collection[] = [
  { slug: "mexican-meal-prep", title: "Mexican", description: "Bold spices, bright flavors.", count: 15, image: img("photo-1550507992-eb63ffee0847") },
  { slug: "asian-meal-prep", title: "Asian", description: "Umami-rich bowls and stir fries.", count: 19, image: img("photo-1543353071-873f17a7a088") },
  { slug: "indian-meal-prep", title: "Indian", description: "Warming spice blends made simple.", count: 12, image: img("photo-1546069901-ba9599a7e63c") },
];

export const tips = [
  { title: "Plan First", description: "Choose your recipes and build a shopping list before you start." },
  { title: "Batch Cook", description: "Cook proteins, grains, and veggies in bulk to save time." },
  { title: "Store Correctly", description: "Use airtight containers to keep meals fresh longer." },
  { title: "Freeze Extras", description: "Portion and freeze anything you won't eat within 4 days." },
  { title: "Label Containers", description: "Note the meal and date so nothing goes to waste." },
];

export const containerTypes = [
  { title: "Glass Containers", description: "Durable, microwave-safe, and stain resistant.", image: img("photo-1543353071-873f17a7a088") },
  { title: "Plastic Containers", description: "Lightweight and budget-friendly for everyday prep.", image: img("photo-1517673132405-a56a62b18caf") },
  { title: "BPA Free", description: "Safe for food storage and repeated reheating.", image: img("photo-1550507992-eb63ffee0847") },
  { title: "Freezer Safe", description: "Built to handle batch cooking and long-term storage.", image: img("photo-1482049016688-2d3e1b311543") },
];

export const guides: Guide[] = [
  { slug: "how-to-meal-prep", title: "How to Meal Prep: A Complete Guide", excerpt: "Everything you need to start meal prepping with confidence.", image: img("photo-1490645935967-10de6ba17061"), readTime: "8 min read" },
  { slug: "meal-prep-for-beginners", title: "Meal Prep for Beginners", excerpt: "The simplest way to build your first week of prepped meals.", image: img("photo-1512621776951-a57141f2eefd"), readTime: "6 min read" },
  { slug: "meal-prep-mistakes", title: "10 Meal Prep Mistakes to Avoid", excerpt: "Common pitfalls that ruin your prep — and how to fix them.", image: img("photo-1467003909585-2f8a72700288"), readTime: "5 min read" },
  { slug: "best-meal-prep-containers", title: "Best Meal Prep Containers in 2026", excerpt: "Our tested picks for glass, plastic, and freezer-safe containers.", image: img("photo-1546069901-ba9599a7e63c"), readTime: "7 min read" },
  { slug: "meal-prep-storage-guide", title: "The Meal Prep Storage Guide", excerpt: "How long meals last in the fridge and freezer, by ingredient.", image: img("photo-1540420773420-3366772f4999"), readTime: "6 min read" },
];

export const faqs: Faq[] = [
  { question: "What are meal prep ideas?", answer: "Meal prep ideas are recipes and strategies for preparing meals in advance — usually in batches — so you have healthy food ready to eat throughout the week." },
  { question: "How many days does meal prep usually last?", answer: "Most prepped meals stay fresh in the refrigerator for 3–5 days. Freezer-friendly recipes can last up to 3 months." },
  { question: "Do I need special containers for meal prep?", answer: "No, but airtight, microwave-safe containers (glass or BPA-free plastic) make storage and reheating much easier." },
  { question: "Is meal prep good for weight loss?", answer: "Yes. Prepping portioned meals in advance helps control calories and reduces impulsive food choices." },
  { question: "How long does meal prepping take each week?", answer: "Most people spend 1–2 hours per week prepping 4–5 meals, depending on the recipes chosen." },
  { question: "Can I meal prep on a budget?", answer: "Absolutely. Buying seasonal produce, proteins in bulk, and reusing ingredients across recipes keeps costs low." },
  { question: "What's the best way to reheat meal prep?", answer: "Microwave in 1-2 minute intervals, or reheat in a skillet/oven for the best texture on proteins and grains." },
  { question: "Can meal prep meals be frozen?", answer: "Many can — soups, stews, casseroles, and cooked grains freeze especially well. Avoid freezing fresh salads or dairy-heavy sauces." },
];
