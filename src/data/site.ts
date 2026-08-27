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
  description: string;
  tag?: string;
  prepTime?: string;
  calories?: string;
  protein?: string;
  rating?: number;
};

export type CategorySection = {
  slug: string;
  heading: string;
  intro: string[];
  recipes: Recipe[];
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

export const categorySections: CategorySection[] = [
  {
    slug: "breakfast",
    heading: "Breakfast Meal Prep Ideas",
    intro: [
      "Breakfast is one of the easiest meals to skip when your morning is busy, but having something prepared ahead of time can make the whole day easier. These breakfast meal prep ideas include simple and filling options that you can make in advance and grab when you need them.",
      "If you want easy meal prep ideas for busy mornings, start with a few recipes you enjoy and prepare them ahead of time. Some work well in the refrigerator, while others can be frozen and reheated when needed, making breakfast one less thing to worry about during the week.",
    ],
    recipes: [
      { slug: "high-protein-egg-bites", title: "High-Protein Egg Bites", image: img("photo-1642463045543-55998f3174fc"), description: "These high-protein egg bites are a simple, filling option for busy mornings or easy meal prep. Made with protein-rich eggs and your favorite vegetables, they're easy to portion, store, and reheat for a quick breakfast throughout the week." },
      { slug: "peanut-butter-overnight-oats-with-yogurt", title: "Peanut Butter Overnight Oats With Yogurt", image: img("photo-1649118173382-dad295004282"), description: "These peanut butter overnight oats are an easy, filling breakfast you can prepare ahead of time. Creamy yogurt, oats, and peanut butter come together for a tasty meal prep option that's perfect for busy mornings and easy to grab from the fridge." },
      { slug: "meal-prep-breakfast-sandwiches", title: "Meal Prep Breakfast Sandwiches", image: img("photo-1525351484163-7529414344d8"), description: "These meal prep breakfast sandwiches are a quick and easy way to get breakfast ready for busy mornings. With eggs, cheese, and your favorite breakfast fillings, they're easy to make ahead, store, and reheat when you need a warm and filling meal." },
      { slug: "apple-pie-overnight-oats", title: "Apple Pie Overnight Oats", image: img("photo-1541809570-cce873416d94"), description: "These apple pie overnight oats are a simple way to have breakfast ready before your busy morning starts. Made with creamy oats, sweet apples, and warm cinnamon, they're easy to prepare the night before, store in the fridge, and enjoy cold or warmed up." },
      { slug: "easy-breakfast-burritos", title: "Easy Breakfast Burritos", image: img("photo-1635107420756-9f930ed6c97b"), description: "These easy breakfast burritos are a tasty and filling way to start your day. Packed with fluffy eggs, beans, cheese, and your favorite breakfast fillings, they're simple to make ahead, store, and reheat for a quick meal on busy mornings." },
      { slug: "homemade-granola", title: "Homemade Granola", image: img("photo-1724441980123-aca7911329d0"), description: "This homemade granola is a simple, crunchy option for easy breakfasts and snacks throughout the week. Made with oats, nuts, and a touch of sweetness, it's easy to prepare in a batch and enjoy with yogurt, milk, or fresh fruit." },
      { slug: "healthy-baked-oatmeal", title: "Healthy Baked Oatmeal", image: img("photo-1654171569419-68baf12fc6cd"), description: "This healthy baked oatmeal is a warm and satisfying breakfast that's easy to prepare ahead of time. Made with wholesome oats, milk, fruit, and simple ingredients, it can be baked in one dish and portioned out for easy breakfasts throughout the week." },
      { slug: "hard-boiled-eggs", title: "Hard-Boiled Eggs", image: img("photo-1680987398307-e1ae27a6ed67"), description: "These hard-boiled eggs are an easy meal prep staple for busy mornings, snacks, and quick meals. They're simple to cook in a batch, easy to store in the fridge, and pair well with salads, toast, vegetables, or other breakfast favorites." },
      { slug: "mini-baked-egg-cups", title: "Mini Baked Egg Cups", image: img("photo-1718307495601-5231e6290d8a"), description: "These mini baked egg cups are a convenient way to prep a protein-packed breakfast in advance. Filled with eggs, vegetables, cheese, and other favorite ingredients, they're easy to portion, store, and reheat for a quick breakfast on busy days." },
      { slug: "spinach-frittata", title: "Spinach Frittata", image: img("photo-1646579933415-92109f9805df"), description: "This spinach frittata is a flavorful and filling breakfast that works well for meal prep. Packed with eggs, fresh spinach, and simple seasonings, it's easy to bake ahead, slice into portions, and enjoy throughout the week." },
      { slug: "protein-overnight-oats", title: "Protein Overnight Oats", image: img("photo-1552842016-443bcee0667b"), description: "These protein overnight oats make breakfast easy when mornings are busy. Creamy oats are combined with yogurt and other protein-rich ingredients, then chilled overnight for a satisfying meal you can grab straight from the fridge." },
      { slug: "cottage-cheese-egg-bake", title: "Cottage Cheese Egg Bake", image: img("photo-1759216280664-0af82adcf592"), description: "This cottage cheese egg bake is a soft, savory breakfast that's easy to prepare for the week ahead. Eggs and creamy cottage cheese create a satisfying base, while vegetables and seasonings add extra flavor to every slice." },
      { slug: "sweet-potato-hash-with-sausage", title: "Sweet Potato Hash With Sausage", image: img("photo-1559394473-f5c8303a6d1f"), description: "This sweet potato hash with sausage is a hearty breakfast packed with savory flavor and simple ingredients. Soft sweet potatoes, sausage, and vegetables come together in one satisfying dish that's easy to portion out for breakfast meal prep." },
      { slug: "sausage-hashbrown-egg-muffins", title: "Sausage Hashbrown Egg Muffins", image: img("photo-1653169836575-f929203b99a1"), description: "These sausage hashbrown egg muffins combine crispy hashbrowns, savory sausage, and eggs in convenient individual portions. They're easy to bake ahead, store in the fridge, and reheat for a quick breakfast on busy mornings." },
      { slug: "high-protein-pancakes", title: "High-Protein Pancakes", image: img("photo-1544726982-b414d58fabaa"), description: "These high-protein pancakes are a delicious way to make breakfast more filling while keeping meal prep simple. They're fluffy, easy to make in a batch, and can be stored for quick breakfasts with fruit, yogurt, or your favorite toppings." },
      { slug: "banana-oatmeal-pancakes", title: "Banana Oatmeal Pancakes", image: img("photo-1528207776546-365bb710ee93"), description: "These banana oatmeal pancakes are a naturally sweet and comforting breakfast made with simple ingredients. Ripe bananas and hearty oats give them a soft texture, and they're easy to prepare ahead for quick weekday breakfasts." },
      { slug: "sheet-pan-pancakes", title: "Sheet Pan Pancakes", image: img("photo-1555813456-94a3dd418cd3"), description: "These sheet pan pancakes make breakfast prep simple with one easy-to-bake batch. Fluffy pancakes are baked in a single pan, then cut into portions and stored for quick breakfasts throughout the week." },
      { slug: "blueberry-baked-oatmeal", title: "Blueberry Baked Oatmeal", image: img("photo-1640767485112-02da9fd009c6"), description: "This blueberry baked oatmeal is a warm and comforting breakfast filled with juicy blueberries and hearty oats. Bake it ahead, slice it into portions, and enjoy an easy breakfast with yogurt, milk, or fresh fruit." },
      { slug: "make-ahead-breakfast-sandwiches", title: "Make-Ahead Breakfast Sandwiches", image: img("photo-1497581175344-8a5f1a0142a5"), description: "These make-ahead breakfast sandwiches are perfect when you want a satisfying meal without cooking in the morning. Fill them with eggs, cheese, and your favorite ingredients, then store and reheat them for an easy grab-and-go breakfast." },
      { slug: "banana-chocolate-chip-baked-oatmeal", title: "Banana Chocolate Chip Baked Oatmeal", image: img("photo-1598259298632-e785684cfa90"), description: "This banana chocolate chip baked oatmeal brings together sweet bananas, hearty oats, and chocolate chips in a soft, satisfying breakfast. It's easy to bake ahead and portion into individual servings for a tasty meal prep option." },
    ],
  },
  {
    slug: "lunch",
    heading: "Lunch Meal Prep Ideas",
    intro: [
      "Busy days can make it easy to skip lunch or grab something less nutritious, especially when you're working away from home.",
      "Here are 20 easy and delicious meal prep lunch ideas for work and anyone who wants a healthy meal ready to go. From simple meal prep food ideas to yummy make-ahead lunches, these recipes make busy weekdays easier.",
    ],
    recipes: [
      { slug: "homemade-lunchable", title: "Homemade Lunchable", image: img("photo-1714492919845-81374ddd5aec"), description: "This homemade lunchable is a fun and easy lunch option you can put together in just a few minutes. Add crackers, cheese, fresh fruit, vegetables, and your favorite protein for a balanced meal that's simple to pack and enjoy at work or on the go." },
      { slug: "turkey-avocado-wrap", title: "Turkey Avocado Wrap", image: img("photo-1752095809096-f09d22c466c5"), description: "This turkey avocado wrap is a fresh and filling lunch that comes together without much effort. Sliced turkey, creamy avocado, crisp vegetables, and a soft tortilla make a tasty combination that's easy to prepare ahead for busy weekdays." },
      { slug: "loaded-veggie-hummus-wraps", title: "Loaded Veggie Hummus Wraps", image: img("photo-1636044988130-d97aad86426c"), description: "These loaded veggie hummus wraps are packed with fresh vegetables and creamy hummus for a light but satisfying lunch. They're quick to assemble, easy to pack, and make a great meat-free option for work or meal prep." },
      { slug: "tuna-salad", title: "Tuna Salad", image: img("photo-1622756144420-6877b1b7476e"), description: "This easy tuna salad makes a quick, protein-rich lunch with simple ingredients and plenty of flavor. Enjoy it with crackers and sliced cucumbers, spoon it over greens, or make a sandwich for an easy meal prep lunch." },
      { slug: "peanut-chicken-wraps", title: "Peanut Chicken Wraps", image: img("photo-1752261355726-b723320edf2c"), description: "These peanut chicken wraps bring together soft chicken, crunchy vegetables, and a creamy peanut sauce in every bite. They're easy to gather ahead of time and make a flavorful lunch for work, school, or busy days." },
      { slug: "mediterranean-chopped-salad-with-chicken", title: "Mediterranean Chopped Salad With Chicken", image: img("photo-1786101821619-eeac3b3126e6"), description: "This Mediterranean chopped salad with chicken is a fresh and satisfying lunch packed with colorful vegetables and soft chicken. With crisp greens, simple Mediterranean flavors, and a tasty dressing, it's easy to prep ahead for a healthy work lunch." },
      { slug: "honey-mustard-chicken-salad", title: "Honey Mustard Chicken Salad", image: img("photo-1646487793655-bbf280273d2f"), description: "This honey mustard chicken salad is a sweet and salty lunch that's full of fresh flavor. Juicy chicken, crisp vegetables, and creamy honey mustard dressing make it a simple meal to prepare ahead and enjoy throughout the week." },
      { slug: "blt-chicken-salad", title: "BLT Chicken Salad", image: img("photo-1580147560429-d12fa086110c"), description: "This BLT chicken salad combines the classic flavors of bacon, lettuce, and tomato with soft chicken for a hearty lunch. It's a delicious way to enjoy a filling salad that can be prepared ahead for busy weekdays." },
      { slug: "pesto-chicken-pasta-salad", title: "Pesto Chicken Pasta Salad", image: img("photo-1473093295043-cdd812d0e601"), description: "This pesto chicken pasta salad is an easy make-ahead lunch with soft pasta, chicken, and flavorful pesto. Fresh vegetables add a little crunch, while the pesto brings everything together for a delicious meal that holds up well for meal prep." },
      { slug: "jennifer-aniston-salad", title: "Jennifer Aniston Salad", image: img("photo-1670867014068-220008de468d"), description: "This Jennifer Aniston salad is a fresh and filling combination of grains, vegetables, herbs, and protein-rich ingredients. It's easy to mix together in a large batch, making it an easy lunch for meal prep and busy weekdays." },
      { slug: "lentil-salad-with-roasted-vegetables", title: "Lentil Salad With Roasted Vegetables", image: img("photo-1541014489759-2dfbb495a81f"), description: "This lentil salad with roasted vegetables is a hearty, colorful lunch packed with plant-based goodness. Soft lentils and roasted veggies come together with a simple dressing for a flavorful meal that's easy to prepare ahead." },
      { slug: "curry-chicken-salad", title: "Curry Chicken Salad", image: img("photo-1580013759032-c96505e24c1f"), description: "This curry chicken salad adds warm spices and creamy texture to a classic lunch favorite. Soft chicken, crunchy vegetables, and a flavorful curry dressing make it an easy meal prep option for sandwiches, wraps, or salads." },
      { slug: "thai-peanut-quinoa-salad", title: "Thai Peanut Quinoa Salad", image: img("photo-1762631383588-7c9df7e91e64"), description: "This Thai peanut quinoa salad is a fresh and satisfying lunch with plenty of crunch and bold flavor. Fluffy quinoa, crisp vegetables, and a creamy peanut dressing come together in a meal that's easy to make ahead and pack for work." },
      { slug: "mediterranean-chickpea-salad", title: "Mediterranean Chickpea Salad", image: img("photo-1697155836261-f7afd5353e64"), description: "This Mediterranean chickpea salad is a quick, refreshing lunch made with chickpeas, crisp vegetables, herbs, and a simple dressing. It's easy to toss together, keeps well in the fridge, and works great for make-ahead lunches." },
      { slug: "healthy-fried-rice", title: "Healthy Fried Rice", image: img("photo-1584269600464-37b1b58a9fe7"), description: "This healthy fried rice is a simple way to turn everyday ingredients into a flavorful and filling lunch. Rice, vegetables, eggs, and savory seasonings come together in one easy dish that's perfect for cooking ahead and reheating during the week." },
      { slug: "high-protein-tuna-chickpea-salad", title: "High-Protein Tuna & Chickpea Salad", image: img("photo-1688807450144-9d10de5eb913"), description: "This high-protein tuna and chickpea salad is a quick, filling lunch made with simple ingredients. Soft chickpeas, flavorful tuna, fresh vegetables, and a light dressing come together for an easy meal that's perfect for work or meal prep." },
      { slug: "spicy-black-bean-tacos", title: "Spicy Black Bean Tacos", image: img("photo-1574782091246-c65ed4510300"), description: "These spicy black bean tacos are a flavorful meat-free lunch that's quick to prepare and easy to pack. Seasoned black beans, fresh toppings, and warm tortillas come together for a satisfying meal that works well for busy weekdays." },
      { slug: "pesto-pasta-with-chicken", title: "Pesto Pasta With Chicken", image: img("photo-1630492782892-74f99406dc59"), description: "This pesto pasta with chicken is a simple, satisfying lunch with soft chicken, pasta, and flavorful pesto. It comes together easily and can be portioned into meal prep containers for a delicious lunch ready whenever you need it." },
      { slug: "easy-meal-prep-salad-jars", title: "Easy Meal Prep Salad Jars", image: img("photo-1543352631-6b884eafab2f"), description: "These easy meal prep salad jars make it simple to prepare fresh lunches ahead of time. Layer crisp vegetables, greens, protein, and your favorite dressing in jars for a colorful, easy meal you can grab and take to work." },
      { slug: "couscous-salad-with-lime-basil-vinaigrette", title: "Couscous Salad With Lime Basil Vinaigrette", image: img("photo-1754652327512-3a4166c84cce"), description: "This couscous salad is a bright and refreshing lunch with fluffy couscous, fresh vegetables, and a zesty lime basil vinaigrette. It's easy to mix together in advance and makes a light yet satisfying meal for busy days." },
    ],
  },
  {
    slug: "dinner",
    heading: "Dinner Meal Prep Ideas",
    intro: [
      "Here are 20 easy meal prep dinner ideas for busy weeknights, with filling options you can prepare ahead and enjoy throughout the week. From rice meal prep ideas to chicken, beef, seafood, and more, these quick meal prep ideas make dinner simple and stress-free.",
    ],
    recipes: [
      { slug: "shredded-chicken-tacos", title: "Shredded Chicken Tacos", image: img("photo-1648437595587-e6a8b0cdf1f9"), description: "These shredded chicken tacos are an easy dinner when you want something flavorful without a lot of fuss. Soft seasoned chicken, warm tortillas, and fresh toppings make a satisfying meal that's also great for preparing ahead." },
      { slug: "oven-baked-chicken-breasts", title: "Oven-Baked Chicken Breasts", image: img("photo-1705775482755-586655a0aaf3"), description: "Keep dinner simple with these juicy oven-baked chicken breasts. They're seasoned with everyday spices and baked until soft, giving you an easy protein to pair with rice, roasted vegetables, salads, or other sides." },
      { slug: "greek-salmon-salad-bowl", title: "Greek Salmon Salad Bowl", image: img("photo-1508170754725-6e9a5cfbcabf"), description: "This Greek salmon salad bowl is a fresh dinner packed with flaky salmon, crisp vegetables, and bright Mediterranean flavors. It's easy to assemble into individual portions, making it a great choice for healthy meal prep during the week." },
      { slug: "flank-steak-fajitas", title: "Flank Steak Fajitas", image: img("photo-1756521973435-4e4e1d2884b7"), description: "These flank steak fajitas are loaded with soft steak, colorful peppers, and onions for a flavorful weeknight meal. Serve them in tortillas or over rice with your favorite toppings for an easy dinner that works well for meal prep." },
      { slug: "crockpot-pot-roast", title: "Crockpot Pot Roast", image: img("photo-1783684539282-cc34b91ed983"), description: "This crockpot pot roast is the kind of comforting dinner that's worth making in a big batch. Slow-cooked beef, soft vegetables, and rich savory flavors come together for a hearty meal you can portion out for the week." },
      { slug: "crockpot-shredded-chicken", title: "Crockpot Shredded Chicken", image: img("photo-1762631383846-6bead15b9796"), description: "This crockpot shredded chicken is an easy way to prepare soft, flavorful chicken with very little hands-on work. Once cooked, the chicken can be shredded and used in tacos, sandwiches, bowls, salads, or other meal prep dinners throughout the week." },
      { slug: "ground-turkey-tacos", title: "Ground Turkey Tacos", image: img("photo-1640983743761-4f0e0204bc58"), description: "These ground turkey tacos are a lighter take on a classic weeknight favorite. Seasoned ground turkey, warm tortillas, and fresh toppings come together quickly, making them a simple dinner to prepare ahead for the week." },
      { slug: "chipotle-beef-barbacoa", title: "Chipotle Beef Barbacoa", image: img("photo-1524412529635-a258ed66c010"), description: "This chipotle beef barbacoa is slow-cooked until the beef is soft and full of smoky, spicy flavor. Serve it in tacos, burrito bowls, or over rice for a versatile dinner that makes meal prep easy." },
      { slug: "italian-beef-sandwich", title: "Italian Beef Sandwich", image: img("photo-1699728088600-6d684acbeada"), description: "This Italian beef sandwich is loaded with soft, juicy beef and bold Italian flavors. Prepare the beef ahead and pile it onto a soft roll with peppers or your favorite toppings for a hearty meal that's perfect for busy days." },
      { slug: "spicy-chipotle-turkey-burrito", title: "Spicy Chipotle Turkey Burrito", image: img("photo-1722239313100-cacf7fca7bc5"), description: "This spicy chipotle turkey burrito is packed with seasoned turkey, hearty fillings, and smoky chipotle flavor. Wrap everything in a soft tortilla for a filling dinner that's easy to make ahead and reheat during the week." },
      { slug: "buffalo-chicken-bowls-with-cauliflower-rice", title: "Buffalo Chicken Bowls With Cauliflower Rice", image: img("photo-1784902540665-f6ab6dfef921"), description: "These buffalo chicken bowls are a spicy, satisfying dinner made with soft chicken and light cauliflower rice. Add fresh vegetables and your favorite toppings for a flavorful meal that's easy to portion and prep for the week." },
      { slug: "sheet-pan-chicken-and-sweet-potato", title: "Sheet Pan Chicken and Sweet Potato", image: img("photo-1757451628319-60463e4fede3"), description: "This sheet pan chicken and sweet potato recipe keeps dinner simple with everything cooked together on one pan. Juicy chicken, soft sweet potatoes, and flavorful seasonings make an easy meal that's perfect for busy weeknights and meal prep." },
      { slug: "sesame-noodle-bowls", title: "Sesame Noodle Bowls", image: img("photo-1634864572865-1cf8ff8bd23d"), description: "These sesame noodle bowls are a quick and flavorful dinner with soft noodles and a savory sesame sauce. Add your favorite vegetables and protein to make a balanced meal that stores well for easy lunches or dinners." },
      { slug: "air-fryer-chicken-breast", title: "Air Fryer Chicken Breast", image: img("photo-1617636423451-0db0119c14cd"), description: "This air fryer chicken breast is a simple way to make juicy, flavorful chicken with a lightly crisp outside. It cooks quickly and works well with rice, vegetables, salads, or other sides for an easy meal prep dinner." },
      { slug: "sheet-pan-chicken-pitas-with-tzatziki", title: "Sheet Pan Chicken Pitas With Tzatziki", image: img("photo-1763647818263-62a9256f097c"), description: "These sheet pan chicken pitas are filled with seasoned chicken, fresh vegetables, and creamy tzatziki. Everything comes together easily, making these pitas a flavorful dinner that's simple to prep ahead for busy weeknights." },
      { slug: "instant-pot-creole-chicken-and-sausage", title: "Instant Pot Creole Chicken and Sausage", image: img("photo-1691480241974-92481cef09ff"), description: "This Instant Pot Creole chicken and sausage is a hearty dinner packed with bold, savory flavor. Soft chicken, sausage, and flavorful spices come together quickly, making it a great make-ahead meal for busy weeknights." },
      { slug: "cilantro-lime-chicken-and-lentil-rice-bowls", title: "Cilantro Lime Chicken and Lentil Rice Bowls", image: img("photo-1762631383815-784c04533802"), description: "These cilantro lime chicken and lentil rice bowls are fresh, filling, and full of bright flavor. Soft chicken, hearty lentils, fluffy rice, and zesty cilantro lime seasoning make a balanced dinner that's easy to portion for meal prep." },
      { slug: "spicy-chicken-with-rice-and-beans", title: "Spicy Chicken With Rice and Beans", image: img("photo-1716392976013-66d90cac4411"), description: "This spicy chicken with rice and beans is a simple, satisfying dinner with plenty of bold flavor. Seasoned chicken, hearty beans, and fluffy rice come together for a filling meal that's easy to make ahead and reheat during the week." },
      { slug: "sheet-pan-honey-garlic-shrimp", title: "Sheet Pan Honey Garlic Shrimp", image: img("photo-1559742811-822873691df8"), description: "These sheet pan honey garlic shrimp are a quick dinner with sweet, savory flavor and minimal cleanup. Juicy shrimp cook alongside your favorite vegetables, making an easy meal to serve with rice or portion into containers for the week." },
      { slug: "chicken-and-chickpea-curry", title: "Chicken and Chickpea Curry", image: img("photo-1707448829764-9474458021ed"), description: "This chicken and chickpea curry is a warm, comforting dinner with soft chicken, hearty chickpeas, and flavorful spices. Serve it with rice or naan for a satisfying meal that tastes even better when prepared ahead." },
    ],
  },
  {
    slug: "family-meals",
    heading: "Family Meal Prep Ideas",
    intro: [
      "Here are 20 easy family meal prep ideas that make it simple to prepare larger batches of food for busy weeknights. From cheap meal prep ideas to slow cooker meal prep and other bulk meal prep ideas, these recipes are easy to portion, store, and serve to the whole family.",
    ],
    recipes: [
      { slug: "steak-stir-fry", title: "Steak Stir Fry", image: img("photo-1760504526069-ff0f8bf6e4ca"), description: "This steak stir fry is a quick and flavorful dinner loaded with soft beef and colorful vegetables. Everything cooks together in a savory sauce, making it an easy meal to prepare in a larger batch for the family." },
      { slug: "bbq-pulled-chicken", title: "BBQ Pulled Chicken", image: img("photo-1567529855370-57ecd066454c"), description: "This BBQ pulled chicken is soft, saucy, and easy to make in a big batch. Serve it on buns, over rice, or with your favorite sides for a family-friendly dinner that's great for meal prep." },
      { slug: "sesame-chicken", title: "Sesame Chicken", image: img("photo-1617651523904-8768096faf40"), description: "This sesame chicken brings soft pieces of chicken together with a sweet and salty sesame sauce. It pairs perfectly with rice and vegetables, making it a delicious family dinner that stores and reheats well." },
      { slug: "chicken-bacon-ranch-pasta", title: "Chicken Bacon Ranch Pasta", image: img("photo-1555949258-eb67b1ef0ceb"), description: "This chicken bacon ranch pasta is a creamy, comforting dinner packed with soft chicken, crispy bacon, and ranch flavor. It's easy to make in a large batch, making it a great choice for family dinners and leftovers." },
      { slug: "sloppy-joe-bowls", title: "Sloppy Joe Bowls", image: img("photo-1609183556292-f208be1a9644"), description: "These sloppy joe bowls turn a classic family favorite into an easy, filling meal prep option. Savory ground beef, tangy sauce, and hearty toppings are served over rice or your favorite base for a dinner everyone can enjoy." },
      { slug: "chicken-stir-fry", title: "Chicken Stir Fry", image: img("photo-1761314025701-34795be5f737"), description: "This chicken stir fry is a quick and colorful dinner made with soft chicken and fresh vegetables. Tossed in a savory sauce and served with rice, it's an easy meal to cook in a big batch for the family." },
      { slug: "taco-pasta-skillet", title: "Taco Pasta Skillet", image: img("photo-1650298251706-e9932da7152d"), description: "This taco pasta skillet combines cheesy pasta with seasoned ground beef and classic taco flavors. Everything cooks in one skillet, making it a simple, filling dinner that's easy to portion for family meal prep." },
      { slug: "sweet-and-sour-meatballs", title: "Sweet and Sour Meatballs", image: img("photo-1719784521220-5b0ca7caa32b"), description: "These sweet and sour meatballs are soft, flavorful, and coated in a tangy sauce the whole family will enjoy. Serve them with rice and vegetables for an easy dinner that can be made ahead and reheated during the week." },
      { slug: "thai-peanut-chicken-bowls", title: "Thai Peanut Chicken Bowls", image: img("photo-1610554675919-858d84c76d40"), description: "These Thai peanut chicken bowls are packed with soft chicken, fresh vegetables, and a creamy peanut sauce. Serve everything over rice for a satisfying family dinner that's easy to prepare in larger batches." },
      { slug: "teriyaki-salmon-bowls", title: "Teriyaki Salmon Bowls", image: img("photo-1771384552858-feb0574f958d"), description: "These teriyaki salmon bowls are a flavorful and satisfying family dinner that's easy to prepare ahead. Serve tender salmon with rice, vegetables, and a savory teriyaki sauce for a meal that's simple to portion and enjoy throughout the week." },
      { slug: "ground-beef-stir-fry", title: "Ground Beef Stir Fry", image: img("photo-1723531055852-744d14ac00b4"), description: "This ground beef stir fry is a quick, budget-friendly dinner packed with savory flavor. Ground beef and colorful vegetables cook together in a simple sauce, making it easy to prepare in a large batch for family meals." },
      { slug: "meal-prep-meatballs", title: "Meal Prep Meatballs", image: img("photo-1727403254476-06ce6f420f99"), description: "These meal prep meatballs are soft, flavorful, and easy to make in a big batch. Serve them with pasta, rice, vegetables, or in sandwiches for a versatile family meal that can be portioned and enjoyed throughout the week." },
      { slug: "sheet-pan-balsamic-chicken-and-vegetables", title: "Sheet Pan Balsamic Chicken and Vegetables", image: img("photo-1756652242315-a700af040e0e"), description: "This sheet pan balsamic chicken and vegetables makes a simple dinner with minimal cleanup. Soft chicken and roasted vegetables are coated in a flavorful balsamic sauce, making an easy meal to prepare for the whole family." },
      { slug: "stir-fry-noodles-with-chicken", title: "Stir Fry Noodles With Chicken", image: img("photo-1774717530911-2ceb99449f7a"), description: "These stir fry noodles with chicken are a tasty combination of soft chicken, noodles, and crisp vegetables tossed in a savory sauce. Everything comes together quickly, making this a convenient family dinner for busy nights." },
      { slug: "chicken-sweet-potato-bake", title: "Chicken Sweet Potato Bake", image: img("photo-1721076011480-0e6e3470eba8"), description: "This chicken sweet potato bake is a cozy, filling dinner made with soft chicken and naturally sweet roasted potatoes. Everything bakes together in one dish, making it easy to prepare in bulk for simple family meals during the week." },
      { slug: "sheet-pan-chipotle-chicken-thighs", title: "Sheet Pan Chipotle Chicken Thighs", image: img("photo-1610057099443-fde8c4d50f91"), description: "These sheet pan chipotle chicken thighs are juicy, smoky, and full of bold flavor. Chicken thighs roast alongside vegetables on one pan, making this an easy dinner to prepare in a larger batch for the week." },
      { slug: "ground-beef-taco-casserole", title: "Ground Beef Taco Casserole", image: img("photo-1643878194973-644ee5a1eac6"), description: "This ground beef taco casserole is a cheesy, comforting dinner packed with classic taco flavors. Seasoned beef, beans, and other simple ingredients bake together for an easy family meal that's great for leftovers." },
      { slug: "slow-cooker-thai-peanut-chicken", title: "Slow Cooker Thai Peanut Chicken", image: img("photo-1708782344490-9026aaa5eec7"), description: "This slow cooker Thai peanut chicken is soft, flavorful, and easy to let simmer while you handle other things. Chicken cooks in a creamy peanut sauce and makes a delicious dinner served with rice and fresh vegetables." },
      { slug: "sheet-pan-chicken-meal-prep", title: "Sheet Pan Chicken Meal Prep", image: img("photo-1627446605605-1f0385188cd5"), description: "This sheet pan chicken meal prep keeps cooking simple with juicy chicken and roasted vegetables prepared together on one pan. Portion everything with rice or another favorite side for easy, ready-to-go family meals throughout the week." },
      { slug: "slow-cooker-chicken-tacos", title: "Slow Cooker Chicken Tacos", image: img("photo-1768716575089-7ba787da9afb"), description: "These slow cooker chicken tacos are an easy family dinner with soft, seasoned chicken that cooks with little hands-on effort. Shred the chicken and serve it in tortillas with your favorite toppings for a meal everyone can enjoy." },
    ],
  },
  {
    slug: "soups",
    heading: "Meal Prep Soups and Chilis",
    intro: [
      "Soups and chilis are excellent for bulk meal prep because many can be stored in the refrigerator or frozen for later. These freezer meal prep ideas and slow cooker meal prep ideas make it easy to prepare healthy meal prep ideas for the week, so you always have something ready to enjoy.",
    ],
    recipes: [
      { slug: "vegetarian-chili", title: "Vegetarian Chili", image: img("photo-1638329389022-daef2efb71b3"), description: "This vegetarian chili is a hearty, comforting meal packed with beans, vegetables, and warm spices. It's easy to make in a big batch, portion for the week, and serve with rice, bread, or your favorite toppings." },
      { slug: "beef-chili", title: "Beef Chili", image: img("photo-1729450411383-1f089460ba42"), description: "This beef chili is a rich and satisfying dinner that's perfect for feeding the whole family. Ground beef, beans, tomatoes, and warming spices simmer together for a flavorful meal that stores and reheats well." },
      { slug: "white-chicken-chili", title: "White Chicken Chili", image: img("photo-1715733448307-9a5010aaafbb"), description: "This white chicken chili is creamy, cozy, and packed with soft chicken and hearty beans. It's a great make-ahead meal for busy nights and can be cooked in a large batch for easy family dinners throughout the week." },
      { slug: "easy-black-bean-chili", title: "Easy Black Bean Chili", image: img("photo-1602873520153-ec56ca3c205b"), description: "This easy black bean chili is a budget-friendly dinner that comes together with simple pantry ingredients. Hearty black beans, tomatoes, and flavorful spices make a comforting meal that's easy to cook in bulk and enjoy all week." },
      { slug: "red-lentil-soup-with-lemon", title: "Red Lentil Soup With Lemon", image: img("photo-1620791144170-8a443bf37a33"), description: "This red lentil soup with lemon is a warm, hearty meal with a bright citrus flavor. Red lentils cook into a comforting soup with simple seasonings, making it an easy option for batch cooking and family meal prep." },
      { slug: "blue-zones-soup", title: "Blue Zones Soup", image: img("photo-1725483990685-820291c0fca1"), description: "This Blue Zones soup is a hearty mix of vegetables, beans, and simple wholesome ingredients. It's easy to make in a large batch, making it a great option for healthy meal prep and easy lunches or dinners throughout the week." },
      { slug: "easy-lentil-soup", title: "Easy Lentil Soup", image: img("photo-1605909388460-74ec8b204127"), description: "This easy lentil soup is warm, comforting, and made with simple ingredients you likely already have. Lentils and vegetables make it a filling choice for batch cooking, and it stores well for quick meals during the week." },
      { slug: "black-bean-soup", title: "Black Bean Soup", image: img("photo-1647545401750-6dd5539879ac"), description: "This black bean soup is a simple, hearty meal packed with tender beans, vegetables, and savory spices. It's easy to cook in a big batch and makes a budget-friendly option for meal prep, lunches, or family dinners." },
      { slug: "healthy-minestrone-soup", title: "Healthy Minestrone Soup", image: img("photo-1643786661490-966f1877effa"), description: "This healthy minestrone soup is loaded with vegetables, beans, and tender pasta in a flavorful broth. Make a big pot ahead of time and portion it out for an easy, comforting meal whenever you need it." },
      { slug: "fiesta-quinoa-soup", title: "Fiesta Quinoa Soup", image: img("photo-1629978448078-c94a0ab6500f"), description: "This fiesta quinoa soup brings together quinoa, beans, vegetables, and bold Southwestern-inspired flavors. It's filling, easy to make in a large batch, and perfect for having a warm meal ready throughout the week." },
    ],
  },
  {
    slug: "snacks",
    heading: "Meal Prep Snacks and Extras",
    intro: [
      "These meal prep snack ideas include easy snacks, energy bites, bars, dips, and other simple foods you can prepare ahead for busy days. From fun meal prep ideas to yummy meal prep ideas, these easy meal prep ideas and quick meal prep ideas make it simple to have something ready when hunger hits.",
    ],
    recipes: [
      { slug: "peanut-butter-oat-energy-bites", title: "Peanut Butter Oat Energy Bites", image: img("photo-1766068581429-8499f1afdd50"), description: "These peanut butter oat energy bites are a simple snack made with hearty oats and creamy peanut butter. They're easy to mix, roll into bite-sized portions, and keep in the fridge for a quick snack whenever you need one." },
      { slug: "pb-and-j-energy-bites", title: "PB & J Energy Bites", image: img("photo-1716392916280-e17fb5a2c191"), description: "These PB & J energy bites bring the classic peanut butter and jelly combination into a convenient little snack. They're quick to make, easy to pack, and perfect for keeping a batch ready for busy days." },
      { slug: "mini-banana-muffins", title: "Mini Banana Muffins", image: img("photo-1700224643945-73e735da4609"), description: "These mini banana muffins are soft, naturally sweet, and just the right size for an easy snack. They're simple to bake in a batch and make a convenient grab-and-go option for breakfast boxes, lunch bags, or busy afternoons." },
      { slug: "no-bake-trail-mix-bars", title: "No-Bake Trail Mix Bars", image: img("photo-1633360821154-1935fb5671e6"), description: "These no-bake trail mix bars are an easy homemade snack packed with crunchy, chewy ingredients. There's no oven needed, and the bars can be prepared ahead and stored for a quick bite whenever hunger strikes." },
      { slug: "protein-cookies", title: "Protein Cookies", image: img("photo-1499636136210-6f4ee915583e"), description: "These protein cookies are a tasty way to make snack time more satisfying. They're easy to bake ahead and keep on hand for a convenient homemade treat between meals or after a busy day." },
      { slug: "peanut-butter-oatmeal-balls", title: "Peanut Butter Oatmeal Balls", image: img("photo-1682528565154-8e44ebd757e1"), description: "These peanut butter oatmeal balls are a quick and easy snack made with simple pantry staples. Chewy oats and creamy peanut butter come together in bite-sized portions that are easy to prepare ahead and enjoy throughout the week." },
      { slug: "monster-cookie-protein-balls", title: "Monster Cookie Protein Balls", image: img("photo-1723585137190-6ebb0afa1de6"), description: "These monster cookie protein balls are a fun, bite-sized snack with the flavors of a classic monster cookie. They're easy to mix together, pack for busy days, and keep ready in the fridge when you need a quick snack." },
      { slug: "peanut-butter-granola-bars", title: "Peanut Butter Granola Bars", image: img("photo-1782861826337-e136b28b98ea"), description: "These peanut butter granola bars are chewy, satisfying, and simple to make at home. They're great for preparing in advance and make an easy grab-and-go snack for work, school, or busy afternoons." },
      { slug: "five-ingredient-garlic-hummus", title: "5-Ingredient Garlic Hummus", image: img("photo-1673960854897-749f9d9ebafc"), description: "This 5-ingredient garlic hummus is a creamy dip that comes together with just a few simple ingredients. Serve it with fresh vegetables, crackers, or pita for an easy snack or light addition to your meal prep." },
      { slug: "chocolate-avocado-mousse", title: "Chocolate Avocado Mousse", image: img("photo-1644797591725-09b2f20177dd"), description: "This chocolate avocado mousse is a rich and creamy treat with a smooth chocolate flavor. It's easy to blend together ahead of time and makes a simple snack or dessert when you're craving something sweet." },
    ],
  },
  {
    slug: "bowls",
    heading: "Meal Prep Bowl Ideas",
    intro: [
      "These meal prep bowl ideas make it easy to build a balanced meal with protein, grains, vegetables, and flavorful sauces. From rice meal prep ideas to other healthy meal prep ideas, these meal prep food ideas are simple to prepare, portion, and enjoy throughout the week.",
    ],
    recipes: [
      { slug: "meal-prep-fajita-bowls", title: "Meal Prep Fajita Bowls", image: img("photo-1730924960594-aadb590302ff"), description: "These meal prep fajita bowls are packed with seasoned protein, colorful peppers, onions, and fluffy rice. Everything comes together for a flavorful, filling meal that's easy to portion and enjoy throughout the week." },
      { slug: "roasted-veggie-grain-bowls", title: "Roasted Veggie Grain Bowls", image: img("photo-1666819691822-29a09f0992e5"), description: "These roasted veggie grain bowls are a simple way to enjoy a colorful, satisfying meal. Roasted vegetables, hearty grains, and a flavorful sauce come together in one bowl that's easy to prepare ahead for busy days." },
      { slug: "easy-vegan-burrito-bowls", title: "Easy Vegan Burrito Bowls", image: img("photo-1602881916963-5daf2d97c06e"), description: "These easy vegan burrito bowls are full of hearty beans, rice, fresh vegetables, and tasty toppings. They're simple to assemble in meal prep containers and make a filling plant-based lunch or dinner for the week." },
      { slug: "thai-peanut-chicken-bowls", title: "Thai Peanut Chicken Bowls", image: img("photo-1610554675919-858d84c76d40"), description: "These Thai peanut chicken bowls combine tender chicken, fresh vegetables, and a creamy peanut sauce for a flavorful meal. Serve them over rice or grains and portion them ahead for an easy lunch or dinner." },
      { slug: "teriyaki-salmon-bowls", title: "Teriyaki Salmon Bowls", image: img("photo-1771384552858-feb0574f958d"), description: "These teriyaki salmon bowls bring flaky salmon, fluffy rice, crisp vegetables, and a sweet-savory teriyaki sauce together in one satisfying meal. They're easy to prepare ahead and make a delicious option for busy weekdays." },
    ],
  },
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
  { question: "How Long Does Meal Prep Last in the Fridge?", answer: "Most cooked meal prep food is best stored in the fridge for 3 to 4 days. Keep it in airtight containers and refrigerate it immediately after cooking." },
  { question: "What's the Best Day to Meal Prep?", answer: "Sunday is a popular choice for preparing meals for the week ahead. However, the best day is simply the one that fits your schedule." },
  { question: "How Do I Start Meal Prepping If I've Never Done It?", answer: "Start with a few easy meal prep ideas you already enjoy instead of preparing everything at once. Choose simple breakfasts, lunches, dinners, or snacks and make enough for a few days." },
  { question: "What Are the Best Containers for Meal Prep?", answer: "Use sturdy, airtight containers that are easy to store, clean, and reheat. Glass or food-safe plastic containers are both practical choices." },
  { question: "Can I Freeze Meal Prep?", answer: "Yes, many soups, chilis, casseroles, cooked meats, and rice dishes can be frozen for later. Use freezer-safe airtight containers and label them with the date." },
];
