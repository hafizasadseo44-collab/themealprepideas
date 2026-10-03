// ContentBlock/Heading and their helpers are now the canonical CMS types —
// re-exported here so existing imports of these from "@/data/blog" keep working.
import type { ContentBlock } from "@/lib/posts/types";
export type { ContentBlock, Heading } from "@/lib/posts/types";
export { slugifyHeading, getHeadings } from "@/lib/posts/types";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  readTime: string;
  minutes: number;
  date: string;
  author: { name: string; avatar: string };
  tags: string[];
  trending?: boolean;
  featured?: boolean;
  content: ContentBlock[];
};

const avatar = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=100&q=80`;

export const blogCategories = [
  "Getting Started",
  "Meal Prep Tips",
  "Storage & Food Safety",
  "Nutrition",
  "Gear & Containers",
  "Meal Planning",
];

export const authorBios: Record<string, string> = {
  "Sana Malik": "Sana writes about meal prep systems and kitchen workflows. She's been batch-cooking for her family of four for over eight years.",
  "Danny Cole": "Danny covers gear, nutrition math, and anything that can be tested and measured. He reviews containers the way other people review cars.",
  "Priya Nair": "Priya focuses on food storage and safety. She trained as a chef before moving into recipe development and kitchen writing.",
};

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-meal-prep",
    title: "How to Meal Prep: A Complete Guide",
    excerpt: "Everything you need to start meal prepping with confidence — from planning your week to storing your first batch of meals.",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80",
    category: "Getting Started",
    readTime: "8 min read",
    minutes: 8,
    date: "Aug 28, 2026",
    author: { name: "Sana Malik", avatar: avatar("photo-1517673132405-a56a62b18caf") },
    tags: ["Beginners", "Planning", "Basics"],
    trending: true,
    featured: true,
    content: [
      { type: "p", text: "Meal prep sounds simple until you try it — then it's suddenly a dozen containers, a sink full of dishes, and a fridge that still doesn't have anything easy to grab. This guide is the version we wish someone had handed us on day one: **four steps**, in order, with nothing skipped." },
      { type: "h2", text: "Why Meal Prep Actually Works" },
      { type: "p", text: "The whole point of meal prep is moving decisions out of your busy hours. When dinner is already cooked, the only choice left is *reheat or eat cold* — not what to cook, whether you have the ingredients, or how long it'll take. That's the entire benefit, and it's worth designing your whole system around it." },
      { type: "h2", text: "Step 1: Pick Your Meals" },
      { type: "p", text: "Start with recipes that already reheat well — braises, grain bowls, soups, and sheet-pan dinners hold up far better than anything meant to be served crisp. Pick 2-3 recipes for the week, not seven different ones." },
      { type: "ul", items: [
        "Choose recipes that share at least one ingredient or cooking method",
        "Pick one thing you can batch in the oven and one on the stovetop",
        "Avoid anything that's only good fresh — fried food, delicate fish, dressed salads",
      ] },
      { type: "h2", text: "Step 2: Shop With a List" },
      { type: "p", text: "Write the list by ingredient category (produce, protein, pantry) instead of by recipe — it's faster to shop and it's obvious when two recipes need the same thing, so you can buy in bulk once instead of twice." },
      { type: "h2", text: "Step 3: Cook in Batches" },
      { type: "p", text: "Cook proteins and grains separately from sauces and vegetables. This is the single biggest quality upgrade in meal prep — mixed-together meals go soft in the fridge, but components stored apart and combined at reheat time still taste freshly made." },
      { type: "callout", variant: "tip", title: "Work in parallel", text: "Start rice or grains first since they need the least attention, then move to the oven-roasted component, and finish with anything that needs active stovetop time. Everything should land around the same time." },
      { type: "h2", text: "Step 4: Store It Right" },
      { type: "p", text: "Let food cool for about 20-30 minutes before sealing containers — trapping steam speeds up spoilage and fogs up your fridge. Once cooled, here's roughly how long the basics hold up:" },
      { type: "table", headers: ["Food", "Fridge", "Freezer"], rows: [
        ["Cooked chicken or beef", "3–4 days", "2–3 months"],
        ["Cooked rice or grains", "4–5 days", "1–2 months"],
        ["Roasted vegetables", "3–4 days", "8–10 months"],
        ["Soups & stews", "3–4 days", "2–3 months"],
      ] },
      { type: "h3", text: "Labeling Tips" },
      { type: "ul", items: [
        "Write the date, not just the meal name — \"Tuesday\" means nothing three weeks later",
        "Freeze in flat, thin layers so meals thaw faster and stack better",
        "Keep a running list on the fridge of what's in the freezer so nothing gets forgotten",
      ] },
      { type: "quote", text: "The goal isn't a perfect system on week one. It's a system you still want to use on week six.", attribution: "Sana Malik" },
      { type: "h2", text: "Common First-Week Mistakes" },
      { type: "ol", items: [
        "Prepping five days of the exact same meal — you'll burn out fast",
        "Not leaving room in the freezer for the containers you're about to fill",
        "Skipping labels and forgetting what's actually in the container",
        "Prepping something you don't even like eating, just because it reheats well",
      ] },
      { type: "p", text: "None of this needs to be perfect right away. Pick one meal, prep it once, and build from there — the system gets easier every single week you keep it up." },
    ],
  },
  {
    slug: "meal-prep-for-beginners",
    title: "Meal Prep for Beginners",
    excerpt: "The simplest way to build your first week of prepped meals without feeling overwhelmed or buying anything fancy.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
    category: "Getting Started",
    readTime: "6 min read",
    minutes: 6,
    date: "Aug 14, 2026",
    author: { name: "Danny Cole", avatar: avatar("photo-1502685104226-ee32379fefbe") },
    tags: ["Beginners", "Basics"],
    content: [
      { type: "p", text: "Most people quit meal prep in the first two weeks — not because it doesn't work, but because they start too big. Here's a smaller, more realistic way in." },
      { type: "h2", text: "Start Smaller Than You Think" },
      { type: "p", text: "Prep **three lunches**, not five days of every meal. That's enough to feel the benefit — fewer decisions, less last-minute cooking — without the pressure of a perfect week or a fridge stuffed with containers you're dreading." },
      { type: "h2", text: "The 3-Ingredient Rule" },
      { type: "p", text: "Your first few recipes should need three main ingredients, max — one protein, one carb, one vegetable. It keeps shopping simple and makes it obvious when something's missing." },
      { type: "ul", items: [
        "Protein: rotisserie chicken, ground turkey, or canned beans",
        "Carb: rice, pasta, or roasted potatoes",
        "Vegetable: whatever's already on sale that week",
      ] },
      { type: "h2", text: "Your First Grocery List" },
      { type: "ul", items: [
        "1 protein (about 2 lbs)",
        "1 grain or starch (2 cups dry)",
        "2-3 vegetables that roast well",
        "1 sauce or dressing you already like",
        "3-4 containers with lids",
      ] },
      { type: "callout", variant: "tip", text: "Buy pre-cut vegetables for your first attempt. It costs a little more, but removing prep steps on week one is worth it — you can start chopping your own once the habit sticks." },
      { type: "h2", text: "What to Expect the First Week" },
      { type: "p", text: "It'll take longer than you think — plan for 60-90 minutes, not 20. It gets faster every time you repeat it, mostly because you stop second-guessing each step." },
      { type: "p", text: "By week three or four, the same session usually drops to about half the time. That's the point where meal prep stops feeling like a chore and starts feeling like a shortcut." },
    ],
  },
  {
    slug: "meal-prep-mistakes",
    title: "10 Meal Prep Mistakes to Avoid",
    excerpt: "Common pitfalls that ruin your prep — soggy containers, bland batches, and the timing mistakes that waste your Sunday.",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80",
    category: "Meal Prep Tips",
    readTime: "5 min read",
    minutes: 5,
    date: "Aug 5, 2026",
    author: { name: "Priya Nair", avatar: avatar("photo-1544005313-94ddf0286df2") },
    tags: ["Tips", "Troubleshooting"],
    trending: true,
    content: [
      { type: "p", text: "Almost every meal prep complaint traces back to one of the same handful of mistakes. Here are the ones worth fixing first." },
      { type: "h2", text: "Prepping Food You Don't Actually Like" },
      { type: "p", text: "\"Healthy\" and \"reheats well\" mean nothing if you dread eating it. Prep meals you'd order at a restaurant, just made ahead of time." },
      { type: "h2", text: "No Variety Plan" },
      { type: "p", text: "The same exact meal five days running is the fastest route to quitting. Cook one batch of a protein and a grain, then split it across two or three *different* meals using different sauces or sides." },
      { type: "h2", text: "Using the Wrong Containers" },
      { type: "p", text: "Thin, cheap containers warp in the microwave and leak in a bag. Glass with a tight seal costs more upfront but survives years of daily reheating." },
      { type: "callout", variant: "warning", title: "Watch for this", text: "Never seal a container while food is still steaming hot — trapped condensation is one of the fastest ways to make food spoil early." },
      { type: "h2", text: "Overcooking Delicate Ingredients" },
      { type: "p", text: "Rice, pasta, and fish keep cooking after you pull them off the heat and again when reheated. Undercook them slightly during prep so they finish perfectly the second time around." },
      { type: "ol", items: [
        "Cook pasta and rice about 1-2 minutes under package time",
        "Sear fish and leave the center slightly underdone",
        "Steam vegetables until just bright, not fully soft",
      ] },
      { type: "h2", text: "Skipping the Cooldown Step" },
      { type: "p", text: "Sealing hot containers and stacking them straight into the fridge slows cooling for everything nearby, not just that meal. Give food 20-30 minutes on the counter first." },
      { type: "p", text: "Fix even two or three of these and most of what people call \"meal prep doesn't work for me\" quietly disappears." },
    ],
  },
  {
    slug: "batch-cooking-basics",
    title: "The Beginner's Guide to Batch Cooking",
    excerpt: "Cook once, eat all week. Here's how to pick recipes that scale up cleanly and how to portion them without the guesswork.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80",
    category: "Meal Prep Tips",
    readTime: "7 min read",
    minutes: 7,
    date: "Jul 24, 2026",
    author: { name: "Sana Malik", avatar: avatar("photo-1517673132405-a56a62b18caf") },
    tags: ["Batch Cooking", "Tips"],
    content: [
      { type: "p", text: "Batch cooking and meal prep get used interchangeably, but they're not quite the same thing. Batch cooking is about the *cooking* — one big session that fuels several different meals. Here's how to do it well." },
      { type: "h2", text: "What Makes a Recipe 'Batch-Cook Friendly'" },
      { type: "ul", items: [
        "It scales up without changing much about the method",
        "It tastes as good (or better) the next day",
        "It can be split into at least two different final meals",
        "It doesn't rely on a texture that fades — like a crispy top or fresh crunch",
      ] },
      { type: "h2", text: "The One-Pot, One-Pan Rule" },
      { type: "p", text: "Pick one thing that cooks in a big pot — chili, soup, braised meat — and one thing that roasts on a sheet pan. Together they cover most of a week without needing your full attention at any point." },
      { type: "h2", text: "Portioning Without a Scale" },
      { type: "p", text: "A standard container is a decent enough guide on its own. Fill it roughly **half vegetables, a quarter protein, a quarter carb** and you'll land close to a balanced plate every time, no scale required." },
      { type: "callout", variant: "tip", text: "If you do want to be precise, weigh just one \"test\" portion the first time you make a recipe. After that, use the same scoop or ladle for every batch — consistency matters more than exact grams." },
      { type: "h2", text: "Batch Cooking Proteins vs. Bases" },
      { type: "table", headers: ["Component", "Best Method", "Batch Size"], rows: [
        ["Chicken thighs", "Sheet pan, 425°F", "2-3 lbs at once"],
        ["Ground beef/turkey", "Stovetop, large skillet", "2 lbs at once"],
        ["Rice or quinoa", "Rice cooker or Instant Pot", "3-4 cups dry"],
        ["Roasted vegetables", "Sheet pan, 425°F", "2 full pans"],
      ] },
      { type: "p", text: "Once you have two or three go-to proteins and bases down, batch cooking stops being a Sunday project and starts being a 45-minute habit." },
    ],
  },
  {
    slug: "best-meal-prep-containers",
    title: "Best Meal Prep Containers in 2026",
    excerpt: "Our tested picks for glass, plastic, and freezer-safe containers — what actually holds up to weekly reheating.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80",
    category: "Gear & Containers",
    readTime: "7 min read",
    minutes: 7,
    date: "Jul 16, 2026",
    author: { name: "Danny Cole", avatar: avatar("photo-1502685104226-ee32379fefbe") },
    tags: ["Gear", "Reviews"],
    content: [
      { type: "p", text: "We ran the same containers through 30 straight days of meal prep — daily microwave reheats, dishwasher cycles, and a few drops off the counter. Here's what actually held up." },
      { type: "h2", text: "Glass vs. Plastic" },
      { type: "table", headers: ["", "Glass", "Plastic"], rows: [
        ["Microwave safe", "Yes, always", "Only if labeled BPA-free"],
        ["Stains & odors", "Resists both", "Absorbs over time"],
        ["Weight", "Heavier", "Lighter, easier to pack"],
        ["Price", "Higher upfront", "Cheaper to replace"],
        ["Freezer safe", "Yes (leave headspace)", "Yes, most brands"],
      ] },
      { type: "h2", text: "What We Tested For" },
      { type: "ul", items: [
        "Leak resistance when carried on its side in a bag",
        "Whether the lid still sealed cleanly after 20+ washes",
        "Staining from tomato sauce and turmeric-heavy meals",
        "Warping after repeated microwave use",
      ] },
      { type: "h2", text: "Our Picks" },
      { type: "h3", text: "Best Overall: Glass, Divided" },
      { type: "p", text: "A divided glass container keeps sauces from soaking into rice overnight, and the compartments make portioning almost automatic." },
      { type: "h3", text: "Best Budget: BPA-Free Plastic Set" },
      { type: "p", text: "Not as durable long-term, but a full 10-pack for the price of two glass containers is hard to beat while you're still figuring out your system." },
      { type: "h3", text: "Best for Freezing: Wide-Mouth Glass Jars" },
      { type: "p", text: "Straight sides mean frozen food slides out easily once thawed, instead of getting stuck like it does in tapered containers." },
      { type: "callout", variant: "info", title: "A note on safety", text: "If you're reusing plastic containers, check for a \"BPA-free\" and \"microwave safe\" label — older or unlabeled plastic can leach chemicals when heated repeatedly." },
    ],
  },
  {
    slug: "meal-prep-storage-guide",
    title: "The Meal Prep Storage Guide",
    excerpt: "How long meals last in the fridge and freezer, by ingredient — plus the labeling system that keeps nothing going to waste.",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80",
    category: "Storage & Food Safety",
    readTime: "6 min read",
    minutes: 6,
    date: "Jul 9, 2026",
    author: { name: "Priya Nair", avatar: avatar("photo-1544005313-94ddf0286df2") },
    tags: ["Storage", "Food Safety"],
    content: [
      { type: "p", text: "\"Does this still look okay?\" is the wrong question — by the time food looks off, it's been unsafe for a while. Go by time and temperature instead." },
      { type: "h2", text: "Fridge Storage Times by Food Type" },
      { type: "table", headers: ["Food", "Fridge (40°F or below)"], rows: [
        ["Cooked poultry", "3-4 days"],
        ["Cooked beef or pork", "3-4 days"],
        ["Cooked fish", "3-4 days"],
        ["Cooked rice or pasta", "4-5 days"],
        ["Soups & stews", "3-4 days"],
        ["Cut fruits & vegetables", "3-5 days"],
      ] },
      { type: "h2", text: "Freezer Storage Times" },
      { type: "table", headers: ["Food", "Freezer (0°F)"], rows: [
        ["Cooked poultry", "2-6 months"],
        ["Cooked ground meat", "2-3 months"],
        ["Soups & stews", "2-3 months"],
        ["Cooked rice or grains", "1-2 months"],
        ["Roasted vegetables", "8-10 months"],
      ] },
      { type: "callout", variant: "warning", title: "The two-hour rule", text: "Food left at room temperature for more than two hours (or one hour above 90°F) should be thrown out, not stored — bacteria multiply fastest in that window." },
      { type: "h2", text: "A Labeling System That Works" },
      { type: "ul", items: [
        "Masking tape and a marker beats fancy labels — it's fast enough that you'll actually do it",
        "Write the date it was cooked, not the date you're planning to eat it",
        "Keep a small whiteboard or note on the freezer door listing what's inside",
        "Put newer containers at the back so older ones get used first",
      ] },
      { type: "p", text: "None of this needs to be complicated. A date, a rough time window, and a system for what's oldest is enough to stop food from quietly going to waste." },
    ],
  },
  {
    slug: "meal-prep-salads-fresh",
    title: "Can You Meal Prep Salads? Here's How to Keep Them Fresh",
    excerpt: "The layering trick that stops greens from wilting, and which dressings are safe to prep four days ahead.",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
    category: "Storage & Food Safety",
    readTime: "5 min read",
    minutes: 5,
    date: "Jun 30, 2026",
    author: { name: "Sana Malik", avatar: avatar("photo-1517673132405-a56a62b18caf") },
    tags: ["Salads", "Storage"],
    content: [
      { type: "p", text: "Salads *can* be meal prepped — the trick is keeping the dressing and the greens from ever touching until the moment you eat." },
      { type: "h2", text: "The Jar Layering Method" },
      { type: "p", text: "Layer ingredients from wettest to driest, bottom to top, in a wide-mouth jar. When you're ready to eat, shake or dump it into a bowl and everything combines at once — nothing has been sitting soggy for days." },
      { type: "ol", items: [
        "Dressing, at the very bottom",
        "Hardy vegetables — cucumber, carrots, bell pepper",
        "Protein and grains",
        "Cheese or nuts",
        "Greens, packed loosely on top",
      ] },
      { type: "h2", text: "Dressings That Hold Up" },
      { type: "ul", items: [
        "Oil-and-vinegar based dressings — stay stable for 5+ days",
        "Yogurt or tahini-based dressings — good for about 4 days",
        "Anything with fresh herbs stirred in — best used within 2-3 days",
      ] },
      { type: "callout", variant: "tip", text: "Avoid dressings with raw garlic or dairy that hasn't been cooked — they turn faster than the rest of the salad and are usually the first sign something's off." },
      { type: "h2", text: "What Not to Prep Ahead" },
      { type: "ul", items: [
        "Avocado — it browns within a day even with lemon juice",
        "Anything breaded or fried — it won't stay crisp",
        "Delicate herbs like basil — they wilt and blacken fast",
      ] },
      { type: "p", text: "Add those on the day you eat, not the day you prep, and the rest of the jar will still taste like it was made that morning." },
    ],
  },
  {
    slug: "how-many-calories-to-meal-prep",
    title: "How Many Calories Should You Meal Prep Per Day?",
    excerpt: "A simple way to figure out your target range and portion your containers, whether the goal is maintenance, loss, or muscle gain.",
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80",
    category: "Nutrition",
    readTime: "9 min read",
    minutes: 9,
    date: "Jun 18, 2026",
    author: { name: "Danny Cole", avatar: avatar("photo-1502685104226-ee32379fefbe") },
    tags: ["Nutrition", "Portioning"],
    trending: true,
    content: [
      { type: "p", text: "You don't need a perfect number to start meal prepping around calories — you need a *reasonable range* and a portioning habit that's easy to repeat." },
      { type: "h2", text: "Finding Your Starting Number" },
      { type: "p", text: "A quick estimate: multiply your goal body weight in pounds by 14-16 for a rough maintenance number. That's not exact, but it's a solid starting point to adjust from after a couple of weeks of tracking how you feel and whether the scale is moving." },
      { type: "h2", text: "Maintenance vs. Loss vs. Gain" },
      { type: "table", headers: ["Goal", "Adjustment", "Typical Weekly Change"], rows: [
        ["Maintenance", "Baseline estimate", "No change"],
        ["Fat loss", "-15% to -20%", "0.5-1 lb / week"],
        ["Muscle gain", "+10% to +15%", "0.25-0.5 lb / week"],
      ] },
      { type: "h2", text: "Portioning Without Weighing Everything" },
      { type: "ul", items: [
        "Protein: about the size and thickness of your palm",
        "Carbs: a closed fist worth, cooked",
        "Fats: roughly a thumb's length of oil, butter, or nut butter",
        "Vegetables: fill whatever space is left",
      ] },
      { type: "callout", variant: "info", text: "Hand portions won't be lab-accurate, but they're consistent enough to hit a range — and consistency matters far more than precision for almost everyone's goals." },
      { type: "p", text: "Set your containers up this way once, repeat it for two weeks, then adjust the portions up or down based on real results — not guesswork." },
    ],
  },
  {
    slug: "meal-prep-on-a-budget",
    title: "Meal Prep on a Budget: A 7-Day Plan",
    excerpt: "A full week of meals built around $35 of groceries — the exact list, the swaps, and where the savings actually come from.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80",
    category: "Meal Planning",
    readTime: "8 min read",
    minutes: 8,
    date: "Jun 5, 2026",
    author: { name: "Priya Nair", avatar: avatar("photo-1544005313-94ddf0286df2") },
    tags: ["Budget", "Planning"],
    content: [
      { type: "p", text: "Most of the savings in budget meal prep come from buying fewer, more repeated ingredients — not from any single cheap recipe. Here's a full week built that way." },
      { type: "h2", text: "The $35 Grocery List" },
      { type: "table", headers: ["Item", "Amount", "Approx. Cost"], rows: [
        ["Chicken thighs", "3 lbs", "$8"],
        ["Rice", "2 lb bag", "$3"],
        ["Dried beans or canned", "4 cans", "$4"],
        ["Frozen mixed vegetables", "3 bags", "$6"],
        ["Eggs", "1 dozen", "$3"],
        ["Onions & garlic", "bulk", "$3"],
        ["Pantry sauce/spices", "as needed", "$8"],
      ] },
      { type: "h2", text: "The 7-Day Plan" },
      { type: "ol", items: [
        "Sunday: Roast all the chicken thighs and cook the rice at once",
        "Monday: Chicken + rice + frozen vegetables, simple stir-fry sauce",
        "Tuesday: Chicken over rice with beans, taco-style seasoning",
        "Wednesday: Egg and bean scramble with rice on the side",
        "Thursday: Chicken and vegetable soup using the same base ingredients",
        "Friday: Leftover rice fried with egg and whatever vegetables remain",
        "Saturday: Repeat the best-received meal from the week",
      ] },
      { type: "callout", variant: "tip", text: "Buy dried beans and rice in bulk when you can — the per-meal cost drops even further, and both keep for months in the pantry without spoiling." },
      { type: "p", text: "The plan repeats the same core ingredients on purpose. Different sauces and spice blends carry the variety, so it never feels like you're eating the same meal twice." },
    ],
  },
];

export const featuredPost = blogPosts.find((p) => p.featured) ?? blogPosts[0];

export function getPostBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}

export function getRelatedPosts(slug: string, count = 3) {
  const current = getPostBySlug(slug);
  if (!current) return blogPosts.slice(0, count);
  const sameCategory = blogPosts.filter((p) => p.slug !== slug && p.category === current.category);
  const others = blogPosts.filter((p) => p.slug !== slug && p.category !== current.category);
  return [...sameCategory, ...others].slice(0, count);
}
