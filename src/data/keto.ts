import type { CategorySection, Faq } from "./site";

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const ketoIntro = {
  paragraphs: [
    "Keto meal prep ideas make it easier to plan your meals, save time, and stay on track with a low-carb lifestyle. Instead of deciding what to eat every day, you can prepare a few meals ahead and have them ready when you need them.",
    "This guide includes easy ideas for breakfast, lunch, dinner, snacks, and desserts, along with options for different budgets and food preferences. The goal is not to eat the same meal every day — with a little planning, you can enjoy different flavors while keeping your meals simple and ready to go.",
  ],
};

export const ketoAboutPoints = [
  { label: "Protein First", icon: "drumstick" },
  { label: "Low-Carb Veggies", icon: "salad" },
  { label: "Healthy Fats", icon: "flame" },
  { label: "Batch Cooked", icon: "utensils" },
];

export const ketoTips = [
  {
    title: "Start With 2–3 Recipes",
    description:
      "Choose a few easy meals you already enjoy and make enough portions to cover several meals. You do not need to cook a week's worth of different meals in one session.",
  },
  {
    title: "Don't Prepare Seven Different Meals",
    description:
      "Cooking too many recipes at once can take hours and leave you with too many ingredients to manage. A small, realistic plan is easier to follow and build into a routine.",
  },
  {
    title: "Use Repeat Ingredients",
    description:
      "Use the same chicken, vegetables, eggs, or sauces in different meals. This saves time and money while still giving your week enough variety to stay interesting.",
  },
  {
    title: "Keep Emergency Keto Snacks Ready",
    description:
      "Store boiled eggs, nuts, cheese, or chopped vegetables where they are easy to grab when you are hungry and short on time.",
  },
  {
    title: "Label Containers",
    description:
      "Add the meal name and date so you know what is inside and which food should be eaten first, especially when you are preparing several meals at once.",
  },
  {
    title: "Freeze Extra Portions",
    description:
      "If you have more food than you can eat in a few days, freeze some portions instead of letting them sit in the fridge until they spoil.",
  },
  {
    title: "Prepare Sauces Separately",
    description:
      "Keep dressings, dips, and sauces in small containers so your main food does not become soggy by the time you are ready to eat it.",
  },
  {
    title: "Keep Your Plan Realistic",
    description:
      "Choose recipes that match your cooking time, budget, and daily routine. The best keto meal prep ideas are the ones you can actually keep making week after week.",
  },
];

export const ketoWeeklyPlan = [
  {
    day: "Monday",
    breakfast: { title: "Keto Egg Bites", slug: "keto-egg-bites" },
    lunch: { title: "Greek Chicken Salad Bowl", slug: "greek-chicken-salad-bowls" },
    dinner: { title: "Keto Chicken Parmesan", slug: "keto-chicken-parmesan" },
    snack: { title: "Roasted Spiced Nuts", slug: "roasted-spiced-nuts" },
  },
  {
    day: "Tuesday",
    breakfast: { title: "Keto Yogurt Parfait Bowl", slug: "keto-yogurt-parfait-bowl" },
    lunch: { title: "Shrimp Cauliflower Rice Bowl", slug: "shrimp-cauliflower-rice-bowls" },
    dinner: { title: "Keto Beef Stew", slug: "keto-beef-stew" },
    snack: { title: "Parmesan Crisps", slug: "parmesan-crisps" },
  },
  {
    day: "Wednesday",
    breakfast: { title: "Keto Cream Cheese Pancakes", slug: "keto-cream-cheese-pancakes" },
    lunch: { title: "Mediterranean Tuna Salad", slug: "mediterranean-tuna-salad" },
    dinner: { title: "Lemon-Brown Butter Salmon", slug: "lemon-brown-butter-salmon" },
    snack: { title: "Veggies with Keto Ranch", slug: "veggies-with-keto-ranch" },
  },
  {
    day: "Thursday",
    breakfast: { title: "High-Protein Chia Seed Pudding", slug: "high-protein-chia-seed-pudding" },
    lunch: { title: "Asian Turkey Lettuce Wraps", slug: "asian-turkey-lettuce-wraps" },
    dinner: { title: "Chicken Alfredo Zucchini Noodles", slug: "chicken-alfredo-zucchini-noodles" },
    snack: { title: "Low-Sugar Chocolate Pudding", slug: "low-sugar-chocolate-pudding" },
  },
  {
    day: "Friday",
    breakfast: { title: "Keto Breakfast Sandwich", slug: "keto-breakfast-sandwich" },
    lunch: { title: "Avocado Egg Salad", slug: "avocado-egg-salad" },
    dinner: { title: "Keto Taco Casserole", slug: "keto-taco-casserole" },
    snack: { title: "Curried Chicken Salad", slug: "curried-chicken-salad" },
  },
];

export const ketoWeightLossPicks = [
  { title: "Lemon Herb Grilled Chicken with Zucchini Noodles", slug: "lemon-herb-grilled-chicken-zucchini-noodles" },
  { title: "Salmon on a Lemon-Kale Salad", slug: "salmon-lemon-kale-salad" },
  { title: "Ground Beef and Broccoli Stir-Fry", slug: "ground-beef-broccoli-stir-fry" },
  { title: "Shrimp Avocado Salad", slug: "shrimp-avocado-salad" },
  { title: "Cauliflower Fried Rice", slug: "cauliflower-fried-rice" },
];

export const ketoSections: CategorySection[] = [
  {
    slug: "keto-breakfast",
    heading: "Keto Breakfast Meal Prep Ideas",
    intro: [
      "Breakfast is often the hardest meal to manage when you are busy. These keto breakfast recipes can be prepared ahead, stored in the fridge, and reheated or enjoyed cold when you need a quick meal.",
    ],
    recipes: [
      { slug: "keto-egg-bites", title: "Keto Egg Bites", image: img("photo-1642463045543-55998f3174fc"), description: "Small, protein-rich breakfasts made by mixing eggs with cheese, spinach, bacon, or your favorite low-carb vegetables, then baking in a muffin pan. Store in the fridge and reheat when needed." },
      { slug: "keto-breakfast-sandwich", title: "Keto Breakfast Sandwich", image: img("photo-1708782342368-fd224d1c0262"), description: "Low-carb bread filled with eggs, cheese, and sausage or bacon instead of a regular bun. Prepare the filling ahead and assemble the sandwich when you are ready to eat." },
      { slug: "sheet-pan-sausage-and-eggs", title: "Sheet Pan Sausage and Eggs", image: img("photo-1693422662923-6e3373212c52"), description: "Sausage, eggs, and low-carb vegetables cooked together on one sheet pan for several servings at once. Divide the finished meal into containers for easy breakfasts during the week." },
      { slug: "keto-egg-muffins", title: "Keto Egg Muffins", image: img("photo-1718307495601-5231e6290d8a"), description: "Eggs, cheese, cooked meat, and vegetables baked in a muffin pan until set. Small, filling, and easy to pack for work or school." },
      { slug: "keto-blueberry-muffins", title: "Keto Blueberry Muffins", image: img("photo-1767634480773-37e4b962fa1d"), description: "A sweet breakfast option made without traditional wheat flour and added sugar. Make a batch ahead and keep them in an airtight container for a quick breakfast or snack." },
      { slug: "keto-cream-cheese-pancakes", title: "Keto Cream Cheese Pancakes", image: img("photo-1710533820700-dd6f6623cc97"), description: "Soft, simple pancakes that are easy to prepare in batches. Refrigerate extras and reheat in a pan or microwave with a keto-friendly topping." },
      { slug: "classic-keto-chaffle", title: "Classic Keto Chaffle", image: img("photo-1768846265087-78395cc1c441"), description: "A simple waffle made mainly with cheese and eggs. Prepare ahead and store in the fridge or freezer, then enjoy on its own or as a low-carb base for eggs and bacon." },
      { slug: "keto-yogurt-parfait-bowl", title: "Keto Yogurt Parfait Bowl", image: img("photo-1649118173382-dad295004282"), description: "Unsweetened keto-friendly yogurt layered with berries, chia seeds, nuts, or coconut. Assemble individual portions ahead and keep crunchy toppings separate until serving." },
      { slug: "high-protein-chia-seed-pudding", title: "High-Protein Chia Seed Pudding", image: img("photo-1651256785597-4efe48fd71f9"), description: "One of the easiest breakfasts to prepare the night before. Mix chia seeds with unsweetened low-carb milk and a protein-rich ingredient, then refrigerate until thick." },
      { slug: "keto-chocolate-avocado-smoothie", title: "Keto Chocolate Avocado Smoothie", image: img("photo-1642102903914-dca6cd38361e"), description: "Avocado blended with unsweetened cocoa, low-carb milk, and a keto-friendly sweetener for a creamy breakfast. Freeze ingredients in portions and blend fresh when needed." },
      { slug: "keto-breakfast-burrito-bowl", title: "Keto Breakfast Burrito Bowl", image: img("photo-1650330151304-5db3ca9b3b6c"), description: "The flavors of a breakfast burrito without the high-carb tortilla. Combine scrambled eggs, sausage or bacon, avocado, cheese, and low-carb vegetables in separate containers." },
      { slug: "shakshuka-egg-cups", title: "Shakshuka Egg Cups", image: img("photo-1682622110419-b671026a4536"), description: "A convenient meal-prep version of the classic egg dish — eggs baked with tomatoes, peppers, and spices in small portions. Store in the fridge and reheat for a quick breakfast." },
    ],
  },
  {
    slug: "keto-chicken",
    heading: "Keto Chicken Meal Prep Ideas",
    intro: [
      "Chicken is one of the easiest proteins to use for meal prep because it is filling, easy to cook in batches, and works with many different flavors.",
    ],
    recipes: [
      { slug: "cheesy-bacon-ranch-chicken", title: "Cheesy Bacon Ranch Chicken", image: img("photo-1753775290395-09e3cb0b6f70"), description: "Tender chicken combined with cheese, crispy bacon, and ranch seasoning. Cook several portions at once and add steamed broccoli or another low-carb vegetable for a complete meal." },
      { slug: "keto-chicken-parmesan", title: "Keto Chicken Parmesan", image: img("photo-1762631383362-bad467f94a8d"), description: "A low-carb coating replaces traditional breadcrumbs, topped with marinara sauce and melted cheese, then baked until golden and bubbly." },
      { slug: "garlic-parmesan-keto-chicken", title: "Garlic Parmesan Keto Chicken", image: img("photo-1598103442097-8b74394b95c6"), description: "Chicken cooked in a creamy, buttery garlic-Parmesan sauce. Pair with broccoli, cauliflower, or zucchini for a filling low-carb meal." },
      { slug: "garlicky-greek-chicken", title: "Garlicky Greek Chicken", image: img("photo-1680098021573-b9402ee336ec"), description: "Chicken seasoned with garlic, lemon, herbs, and olive oil for fresh Mediterranean-style flavor. Serve with a Greek-style salad or roasted low-carb vegetables." },
      { slug: "keto-bacon-chicken-thighs", title: "Keto Bacon Chicken Thighs", image: img("photo-1742185045671-04a8b018451a"), description: "Chicken thighs stay juicy after reheating, making them useful for meal prep. Add bacon and a creamy garlic sauce for a rich dinner." },
      { slug: "almond-crusted-chicken-parmesan", title: "Almond Crusted Chicken Parmesan", image: img("photo-1784203665171-f772f0b9bb74"), description: "A crunchy, low-carb coating made from almond flour replaces regular breadcrumbs. Bake, add sauce and cheese, then portion for the week." },
      { slug: "coconut-curry-chicken-thighs", title: "Coconut Curry Chicken Thighs", image: img("photo-1764304733301-3a9f335f0c67"), description: "Coconut milk, curry spices, and chicken thighs create a rich, flavorful meal. Serve with cauliflower rice or steamed vegetables instead of regular rice." },
      { slug: "buffalo-chicken-stuffed-bell-peppers", title: "Buffalo Chicken Stuffed Bell Peppers", image: img("photo-1673646960062-9aeb2188335f"), description: "Bell peppers filled with cooked chicken, buffalo sauce, and cheese, then baked until tender. Store in the fridge and reheat for lunch or dinner." },
      { slug: "chicken-pesto-bake", title: "Chicken Pesto Bake", image: img("photo-1786082271424-10450164ebb6"), description: "Chicken, pesto, cheese, and low-carb vegetables combined in one baking dish. A good choice when you want a meal that requires little cleanup." },
      { slug: "lemon-herb-grilled-chicken-zucchini-noodles", title: "Lemon Herb Grilled Chicken with Zucchini Noodles", image: img("photo-1773756606644-bbbb1bd16b87"), description: "Grilled chicken with lemon and herbs paired with fresh zucchini noodles. Keep the noodles separate for better texture when reheating." },
    ],
  },
  {
    slug: "keto-beef",
    heading: "Keto Beef Meal Prep Ideas",
    intro: [
      "Beef is another great choice for meal prep because many beef dishes stay flavorful after reheating. Pair them with low-carb vegetables, salads, or cauliflower rice for a complete meal.",
    ],
    recipes: [
      { slug: "keto-beef-stew", title: "Keto Beef Stew", image: img("photo-1766065886536-3b73b5c60139"), description: "Tender beef with low-carb vegetables such as cauliflower, mushrooms, celery, or zucchini. Make a large pot and divide it into containers for easy lunches or dinners." },
      { slug: "keto-beef-stroganoff", title: "Keto Beef Stroganoff", image: img("photo-1644592219048-5c070fd3c91c"), description: "A keto-friendly version of the classic comfort meal — tender beef with mushrooms in a creamy sauce, served over cauliflower rice or zucchini noodles." },
      { slug: "cowboy-butter-steak", title: "Cowboy Butter Steak", image: img("photo-1726677730666-fdc08a8da464"), description: "Garlic, herbs, and a rich buttery sauce give steak plenty of flavor. Cook ahead and keep the butter sauce separate until serving." },
      { slug: "ground-beef-broccoli-stir-fry", title: "Ground Beef and Broccoli Stir-Fry", image: img("photo-1783375175952-705a0600e05c"), description: "Ground beef and broccoli cooked with garlic and a low-carb stir-fry sauce, portioned with cauliflower rice. Reheats well for both lunch and dinner." },
      { slug: "keto-ground-beef-casserole", title: "Keto Ground Beef Casserole", image: img("photo-1643878194973-644ee5a1eac6"), description: "Seasoned beef combined with cheese and low-carb vegetables, baked until hot and bubbly. Cut into portions for quick meals throughout the week." },
      { slug: "french-onion-pot-roast", title: "French Onion Pot Roast", image: img("photo-1743148601298-655e3d10303e"), description: "Slow-cooked beef becomes tender and flavorful with onions, herbs, and a savory sauce. Serve with mashed cauliflower instead of potatoes." },
      { slug: "keto-burger", title: "Keto Burger", image: img("photo-1764018601476-e5fac1f27893"), description: "A burger without the high-carb bun. Prepare patties ahead and serve with cheese, lettuce, tomato, and a keto-friendly sauce, or as a burger bowl." },
      { slug: "keto-taco-casserole", title: "Keto Taco Casserole", image: img("photo-1673960929363-74fd3898fe1b"), description: "Seasoned ground beef, cheese, and taco flavors combined in one easy dish. Bake, divide into portions, and add avocado or salsa when serving." },
      { slug: "beef-taco-salad-bowls", title: "Beef Taco Salad Bowls", image: img("photo-1707080019893-bf8fc3d55f08"), description: "Seasoned ground beef over lettuce, topped with avocado, cheese, salsa, and a low-carb dressing. Keep toppings separate if prepping several days ahead." },
      { slug: "korean-beef-lettuce-wraps", title: "Korean Beef Lettuce Wraps", image: img("photo-1777598405371-e657109ddd50"), description: "Seasoned ground beef with fresh lettuce and simple toppings. Store the beef separately from the lettuce and assemble just before eating." },
    ],
  },
  {
    slug: "keto-fish-seafood",
    heading: "Keto Fish & Seafood Meal Prep Ideas",
    intro: [
      "Fish and seafood are useful for meal prep when you want lighter meals with plenty of protein. For the best texture, store sauces and fresh salad ingredients separately when possible.",
    ],
    recipes: [
      { slug: "lemon-brown-butter-salmon", title: "Lemon-Brown Butter Salmon", image: img("photo-1748712831461-9fbf45338e13"), description: "Lemon and brown butter give salmon a rich flavor with very little effort. Cook several fillets at once and serve with roasted asparagus, broccoli, or cauliflower." },
      { slug: "feta-herb-crusted-salmon", title: "Feta & Herb-Crusted Salmon", image: img("photo-1570645314284-8b28f8fac62e"), description: "Salmon topped with crumbled feta and fresh herbs before baking. The feta adds a creamy, salty flavor while the herbs keep the dish fresh." },
      { slug: "salmon-lemon-kale-salad", title: "Salmon on a Lemon-Kale Salad", image: img("photo-1784571246476-ae530d147e2e"), description: "Cooked salmon with kale and a bright lemon dressing. Keep the dressing separate until ready to eat to prevent the salad from becoming soggy." },
      { slug: "salmon-salad-with-avocado", title: "Salmon Salad with Avocado", image: img("photo-1785099739776-927d3d4981ca"), description: "Flaked salmon and creamy avocado with leafy greens, cucumber, and a light lemon or olive oil dressing." },
      { slug: "salmon-cakes", title: "Salmon Cakes", image: img("photo-1706167754833-4f87ff5f3397"), description: "Cooked or canned salmon mixed with eggs, seasonings, and a low-carb binder, then cooked until golden. Serve with a fresh salad or steamed vegetables." },
      { slug: "low-carb-salmon-patties-chimichurri", title: "Low-Carb Salmon Patties with Chimichurri", image: img("photo-1616077491816-b3b00377a78f"), description: "Salmon patties served with fresh chimichurri made from herbs, garlic, olive oil, and lemon juice. Store the patties and sauce separately." },
      { slug: "shrimp-avocado-salad", title: "Shrimp Avocado Salad", image: img("photo-1722261046975-113154ce11f1"), description: "Shrimp and avocado with cucumber, leafy greens, and lemon juice for a quick, fresh lunch. Keep the dressing separate until serving." },
      { slug: "lemon-garlic-shrimp-asparagus", title: "Lemon Garlic Shrimp with Asparagus", image: img("photo-1674655491456-37cc7adeb2b0"), description: "Shrimp cooked with garlic and lemon alongside roasted or sautéed asparagus — a fast option when you're short on prep time." },
      { slug: "southwestern-baked-tilapia", title: "Southwestern Baked Tilapia", image: img("photo-1765265432611-17d3f2da2d5d"), description: "Mild tilapia seasoned with chili, cumin, garlic, and other spices, then baked until flaky. Serve with cauliflower rice, avocado, or a low-carb salad." },
      { slug: "mediterranean-tuna-salad", title: "Mediterranean Tuna Salad", image: img("photo-1769481614068-47cfb4d1f125"), description: "Tuna mixed with cucumber, olives, leafy greens, herbs, and a simple olive oil and lemon dressing. Keep the dressing separate to stay crisp." },
    ],
  },
  {
    slug: "keto-lunch",
    heading: "Easy Keto Lunch Meal Prep Ideas",
    intro: [
      "Lunch is often the easiest meal to prepare ahead because most foods can be packed into individual containers and taken to work, school, or anywhere else.",
    ],
    recipes: [
      { slug: "greek-chicken-salad-bowls", title: "Greek Chicken Salad Bowls", image: img("photo-1787087090329-63d501db683c"), description: "Cooked chicken with cucumber, tomatoes, olives, feta cheese, and leafy greens. Add a lemon and olive oil dressing just before eating." },
      { slug: "shrimp-cauliflower-rice-bowls", title: "Shrimp Cauliflower Rice Bowls", image: img("photo-1636044990623-074abdf6e994"), description: "Cooked shrimp with cauliflower rice, avocado, and low-carb vegetables. Prepare several portions and add your favorite sauce just before eating." },
      { slug: "keto-sandwich-low-carb-bread", title: "Keto Sandwich with Low-Carb Bread", image: img("photo-1691775755286-139f5ac07dde"), description: "Low-carb bread with chicken, turkey, cheese, lettuce, and avocado. Prepare the fillings ahead and assemble when ready to eat." },
      { slug: "asian-turkey-lettuce-wraps", title: "Asian Turkey Lettuce Wraps", image: img("photo-1676976198608-4f655fb6db99"), description: "Seasoned ground turkey as a flavorful filling for crisp lettuce leaves, with cucumber, herbs, or a low-carb sauce added when serving." },
      { slug: "avocado-egg-salad", title: "Avocado Egg Salad", image: img("photo-1544378828-5a7e2e02c2fd"), description: "Boiled eggs and creamy avocado with lemon juice, herbs, and seasonings. Serve with lettuce leaves or low-carb vegetables." },
    ],
  },
  {
    slug: "keto-dinner",
    heading: "Easy Keto Dinner Meal Prep Ideas",
    intro: [
      "Dinner is a great time to prepare larger meals that give you leftovers the next day. These recipes use simple low-carb swaps to keep familiar comfort foods keto-friendly.",
    ],
    recipes: [
      { slug: "cauliflower-fried-rice", title: "Cauliflower Fried Rice", image: img("photo-1644131448316-887558f9882b"), description: "A simple low-carb alternative to traditional fried rice — cauliflower rice cooked with eggs, vegetables, and chicken, shrimp, or beef." },
      { slug: "cheesy-broccoli-cheddar-spaghetti-squash", title: "Cheesy Broccoli Cheddar Spaghetti Squash", image: img("photo-1723861113025-405ecc9fb361"), description: "Cooked spaghetti squash mixed with broccoli and cheddar cheese, then baked until warm and bubbly." },
      { slug: "keto-mac-and-cheese", title: "Keto Mac and Cheese", image: img("photo-1701484185547-a71576b65e1a"), description: "Cauliflower or another low-carb vegetable stands in for pasta, coated in a creamy cheese sauce and baked until golden." },
      { slug: "spaghetti-squash-carbonara", title: "Spaghetti Squash Carbonara", image: img("photo-1633337474564-1d9478ca4e2e"), description: "Spaghetti squash tossed with eggs, Parmesan, and crispy bacon for a creamy, lighter, low-carb version of the classic dish." },
      { slug: "chicken-alfredo-zucchini-noodles", title: "Chicken Alfredo Zucchini Noodles", image: img("photo-1748012199673-d990c72aaa57"), description: "Zucchini noodles with cooked chicken and a creamy Alfredo sauce. Store the noodles separately from the sauce for better texture." },
      { slug: "cauliflower-pizza-crust", title: "Cauliflower Pizza Crust", image: img("photo-1603073387112-0d690a9624a5"), description: "A low-carb pizza crust you can top with cheese, vegetables, and your favorite keto-friendly toppings. Prepared crusts also freeze well." },
      { slug: "bbq-chicken-pizza-cauliflower-crust", title: "BBQ Chicken Pizza with Cauliflower Crust", image: img("photo-1649148114662-b4ff72d61bd8"), description: "Cauliflower crust topped with cooked chicken, a little low-carb BBQ sauce, cheese, and toppings for a quick weeknight pizza." },
      { slug: "creamy-keto-broccoli-casserole", title: "Creamy Keto Broccoli Casserole", image: img("photo-1768204039572-9e62db7b39fd"), description: "Broccoli in a creamy, cheesy sauce, baked and divided into portions after it cools. Add chicken for a more complete meal." },
      { slug: "garlic-butter-steak-bites-broccoli", title: "Garlic Butter Steak Bites with Broccoli", image: img("photo-1641239735567-34a3662f0002"), description: "Steak cut into small pieces and cooked with garlic and butter until browned, served with roasted or steamed broccoli." },
      { slug: "instant-pot-beef-stew", title: "Instant Pot Beef Stew", image: img("photo-1689860892307-7db54ab276ba"), description: "An Instant Pot makes tender beef stew much faster than slow cooking, using beef with cauliflower, celery, mushrooms, or zucchini." },
    ],
  },
  {
    slug: "keto-affordable",
    heading: "Affordable Keto Meal Prep Ideas",
    intro: [
      "Eating keto does not have to mean buying expensive ingredients. Simple foods like eggs, chicken thighs, ground beef, canned tuna, cabbage, and cauliflower can work in several recipes at once.",
    ],
    recipes: [
      { slug: "cabbage-stir-fry-ground-turkey", title: "Cabbage Stir-Fry with Ground Turkey", image: img("photo-1680461659647-8c0501b1f7c6"), description: "Ground turkey cooked with shredded cabbage, garlic, and a few basic spices — a simple, affordable combination for easy lunches or dinners." },
      { slug: "greek-egg-salad-lettuce-wraps", title: "Greek Egg Salad Lettuce Wraps", image: img("photo-1710432104535-38c7da06ca6d"), description: "Chopped boiled eggs with a little mayonnaise or Greek yogurt, cucumber, herbs, and seasonings, served in lettuce leaves." },
      { slug: "cheesy-broccoli-chicken-bake", title: "Cheesy Broccoli and Chicken Bake", image: img("photo-1778909355098-8ee6b26263a5"), description: "Budget-friendly chicken thighs combined with broccoli and a moderate amount of cheese, baked until hot and golden." },
      { slug: "egg-roll-in-a-bowl", title: "Egg Roll in a Bowl", image: img("photo-1652690528294-6e551fc286c7"), description: "Ground meat, cabbage, garlic, and seasonings give you the flavors of an egg roll without the wrapper, and without many carbs." },
      { slug: "cauliflower-fried-rice-affordable", title: "Cauliflower Fried Rice", image: img("photo-1644131448316-887558f9882b"), description: "An easy way to stretch a small amount of protein across several meals with cauliflower rice, eggs, and frozen vegetables." },
    ],
  },
  {
    slug: "keto-freezer",
    heading: "Keto Freezer Meal Prep Ideas",
    intro: [
      "Freezer meal prep is useful when you want to cook less often and keep extra meals ready for busy days. Casseroles, cooked meats, and stews generally freeze the best.",
    ],
    recipes: [
      { slug: "beef-cauliflower-rice-casserole", title: "Beef and Cauliflower Rice Casserole", image: img("photo-1692296979427-8dd6b7427cc5"), description: "Seasoned beef, cauliflower rice, and cheese in one filling meal. Let it cool completely before dividing into freezer-safe containers." },
      { slug: "chicken-pesto-bake-freezer", title: "Chicken Pesto Bake", image: img("photo-1786082271424-10450164ebb6"), description: "Chicken pesto bake freezes well when stored in airtight containers. Add fresh greens after reheating for a more complete meal." },
      { slug: "keto-egg-muffin-cups-freezer", title: "Keto Egg Muffin Cups", image: img("photo-1718307495601-5231e6290d8a"), description: "Convenient for breakfast and easy to freeze in individual portions. Reheat a few at a time when you need a quick meal." },
      { slug: "keto-beef-stew-freezer", title: "Keto Beef Stew", image: img("photo-1766065886536-3b73b5c60139"), description: "One of the better freezer-friendly keto meal prep ideas. Cook the beef tender, cool completely, then store with room to expand." },
      { slug: "keto-taco-casserole-freezer", title: "Keto Taco Casserole", image: img("photo-1673960929363-74fd3898fe1b"), description: "Seasoned beef, cheese, and low-carb ingredients that freeze well after cooling. Add fresh toppings once reheated." },
    ],
  },
  {
    slug: "keto-vegetarian",
    heading: "Vegetarian Keto Meal Prep Ideas",
    intro: [
      "Vegetarian keto meals can be simple, filling, and easy to prepare ahead using low-carb vegetables, eggs, cheese, and healthy fats.",
    ],
    recipes: [
      { slug: "greek-zucchini-fritters", title: "Greek Zucchini Fritters", image: img("photo-1741791415742-61aa540b4d86"), description: "Grated zucchini mixed with eggs, cheese, and herbs, then cooked until golden. Make several at once for quick lunches or dinners." },
      { slug: "cauliflower-spinach-curry", title: "Cauliflower and Spinach Curry", image: img("photo-1767114915936-745dd372f1d8"), description: "Cauliflower and spinach cooked with coconut milk and simple curry spices for a flavorful, meat-free meal-prep option." },
      { slug: "cheesy-broccoli-mushroom-casserole", title: "Cheesy Broccoli and Mushroom Casserole", image: img("photo-1738060871401-523a4b38f4d9"), description: "Broccoli and mushrooms in a creamy cheese sauce, baked until hot and golden. Works as a light meal or a side dish." },
      { slug: "keto-mac-and-cheese-veg", title: "Keto Mac and Cheese", image: img("photo-1701484185547-a71576b65e1a"), description: "Cauliflower stands in for pasta in a creamy cheese sauce, baked until bubbly and portioned for the week." },
      { slug: "avocado-egg-salad-veg", title: "Avocado Egg Salad", image: img("photo-1544378828-5a7e2e02c2fd"), description: "Boiled eggs with creamy avocado, herbs, lemon juice, and seasonings — a fast, protein-rich vegetarian option." },
    ],
  },
  {
    slug: "keto-vegan",
    heading: "Vegan Keto Meal Prep Ideas",
    intro: [
      "Vegan keto meal prep can be more challenging since you avoid both animal products and most high-carb plant foods, but simple meals can still be built around low-carb vegetables, avocado, tofu, coconut, nuts, and seeds.",
    ],
    recipes: [
      { slug: "thai-coconut-curry-cauliflower-bowls", title: "Thai Coconut Curry Cauliflower Bowls", image: img("photo-1755090154755-006e02ea26b9"), description: "Cauliflower cooked with coconut milk, herbs, and Thai-inspired spices. Add fresh herbs or lime juice after reheating for extra flavor." },
      { slug: "mediterranean-avocado-tofu-salad", title: "Mediterranean Avocado and Tofu Salad", image: img("photo-1763000215238-38350d3e41ac"), description: "Tofu with avocado, cucumber, leafy greens, olives, and a lemon and olive oil dressing. A quick lunch that needs no reheating." },
      { slug: "almond-butter-chia-pudding", title: "Almond Butter Chia Pudding", image: img("photo-1642423453088-69ad302f0d3c"), description: "Chia seeds and almond butter mixed with unsweetened low-carb plant milk and thickened in the fridge — a simple plant-based breakfast." },
    ],
  },
  {
    slug: "keto-snacks-desserts",
    heading: "Keto Snacks & Desserts for Meal Prep",
    intro: [
      "Having keto-friendly snacks ready can make busy days easier and help you avoid reaching for high-carb foods between meals.",
    ],
    recipes: [
      { slug: "low-sugar-chocolate-pudding", title: "Low-Sugar Chocolate Pudding", image: img("photo-1673551494277-92204546b504"), description: "A creamy chocolate dessert made with unsweetened cocoa and a keto-friendly sweetener. Prepare small portions and keep chilled." },
      { slug: "matcha-fat-bombs", title: "Matcha Fat Bombs", image: img("photo-1765946024682-0098eacb2432"), description: "Matcha combined with coconut oil or nut butter into small, rich snacks. A little goes a long way — make a batch and keep chilled." },
      { slug: "roasted-spiced-nuts", title: "Roasted Spiced Nuts", image: img("photo-1742859052143-a83e9d471301"), description: "Almonds, walnuts, or other keto-friendly nuts tossed with spices and roasted until lightly toasted. Divide into small portions." },
      { slug: "parmesan-crisps", title: "Parmesan Crisps", image: img("photo-1615294209152-571969a7fbfe"), description: "A crunchy alternative to chips — small piles of grated Parmesan baked until crisp and golden, then stored airtight." },
      { slug: "crispy-parmesan-keto-brussels-sprouts", title: "Crispy Parmesan Keto Brussels Sprouts", image: img("photo-1771285119403-6b86b7e643be"), description: "Brussels sprouts roasted with Parmesan until the edges turn crispy and golden. Reheat in an oven or air fryer to bring back the crunch." },
      { slug: "keto-mug-cake", title: "Keto Mug Cake", image: img("photo-1550502385-569f695037c5"), description: "A quick single-cup dessert made with almond flour, cocoa, egg, and a keto-friendly sweetener. Best eaten fresh." },
      { slug: "keto-creamy-hot-chocolate", title: "Keto-Friendly Creamy Hot Chocolate", image: img("photo-1637572815755-c4b80092dce1"), description: "Unsweetened cocoa, low-carb milk, and a keto-friendly sweetener. Mix the dry ingredients ahead and add milk when ready to drink." },
      { slug: "veggies-with-keto-ranch", title: "Veggies with Keto Ranch", image: img("photo-1635078996156-5904b9bf077f"), description: "Cucumber, celery, and bell peppers cut into grab-and-go portions, paired with a homemade keto ranch dip stored separately." },
      { slug: "avocado-egg-salad-snack", title: "Avocado Egg Salad", image: img("photo-1544378828-5a7e2e02c2fd"), description: "A filling snack made with boiled eggs, avocado, lemon juice, and seasonings. Serve with cucumber slices or lettuce leaves." },
      { slug: "curried-chicken-salad", title: "Curried Chicken Salad", image: img("photo-1778449588437-97bd47f88276"), description: "Cooked chicken with curry spices and a creamy dressing, plus celery for crunch. Enjoy with lettuce leaves or low-carb crackers." },
    ],
  },
];

export const ketoStorage = [
  {
    title: "How Long Do Keto Meals Last in the Fridge?",
    description:
      "Most cooked meals are best used within 3 to 4 days when stored properly in a refrigerator at 40°F (4°C) or below. If you won't eat a meal within that time, freeze it instead.",
  },
  {
    title: "Which Keto Meals Can You Freeze?",
    description:
      "Beef stew, chicken casseroles, taco casserole, cooked chicken and beef, egg muffins, and cauliflower rice dishes all freeze well. Fresh salads, avocado, and creamy sauces are better added fresh after thawing.",
  },
  {
    title: "How to Reheat Keto Meal Prep",
    description:
      "Thaw frozen meals in the refrigerator when possible, then reheat in a microwave, oven, or stovetop. Add a little water, broth, or sauce if a meal looks dry, and reheat until hot throughout.",
  },
  {
    title: "How to Keep Salads and Sauces Fresh",
    description:
      "Keep salad ingredients and dressings separate until ready to eat. Store leafy greens in airtight containers and add dressing just before eating to keep everything crisp.",
  },
];

export const ketoFaqs: Faq[] = [
  { question: "What Are the Best Keto Meal Prep Ideas?", answer: "The best keto meal prep ideas are meals that are low in carbohydrates, filling, easy to store, and simple to reheat. Good options include chicken bowls, beef stew, salmon with vegetables, egg bites, casseroles, and cauliflower rice dishes." },
  { question: "What Are Some Easy Keto Meal Prep Ideas?", answer: "Easy options include egg muffins, chia pudding, chicken salads, tuna salad, cauliflower fried rice, and simple baked chicken. Choose recipes that use a few ingredients and can be prepared in batches." },
  { question: "What Can I Meal Prep for a Keto Diet?", answer: "You can meal prep breakfasts, lunches, dinners, and snacks using eggs, chicken, beef, fish, leafy greens, cauliflower, zucchini, avocado, cheese, nuts, and other low-carb ingredients." },
  { question: "Can Keto Meal Prep Help With Weight Loss?", answer: "Keto meal prep can make weight loss easier by helping you plan portions, avoid last-minute high-carb foods, and control what you eat. However, keto itself does not guarantee weight loss — your overall calorie intake and eating habits still matter." },
  { question: "How Long Do Keto Meal Prep Meals Last?", answer: "Most cooked meal-prep foods can stay in the refrigerator for 3 to 4 days when stored properly at 40°F (4°C) or below. Freeze meals that you will not eat within that time to keep them for longer." },
];

export const ketoRecipeCount = ketoSections.reduce((sum, section) => sum + section.recipes.length, 0);
