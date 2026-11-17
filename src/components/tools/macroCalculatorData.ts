export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: "What Does a Macro Calculator Calculate?",
    a: "A macro calculator estimates the distribution of three main macronutrients: protein, carbohydrates, and dietary fat. Depending on its features, it can also display daily calorie estimates, BMR, TDEE, and other nutrition-related information.",
  },
  {
    q: "What Is the Difference Between BMR and TDEE?",
    a: "BMR (Basal Metabolic Rate) estimates the energy your body uses at rest to support essential functions like breathing, circulation, and cell production. TDEE (Total Daily Energy Expenditure) estimates total daily energy expenditure, including resting energy and physical activity. The two measurements are related but represent different parts of daily energy use.",
  },
  {
    q: "Does This Macro Calculator Use Mifflin-St Jeor or Katch-McArdle?",
    a: "The calculator uses Mifflin-St Jeor as its default calculation method. When you enable the optional Body Fat % setting, it switches to the Katch-McArdle formula, which uses estimated lean body mass for individuals who track body composition.",
  },
  {
    q: "What Is the Difference Between Balanced, High Protein, Low Carb, Keto, Vegetarian, and Vegan?",
    a: "These options represent different dietary preferences and macro-distribution settings. Balanced provides a general distribution, High Protein emphasizes protein, and Low Carb and Keto represent lower-carbohydrate approaches. Vegetarian and Vegan describe food preferences based on whether animal-derived foods are excluded.",
  },
  {
    q: "Can I Customize My Protein, Carbs, and Fat Percentages?",
    a: "Yes. The Custom Macro Split feature allows you to adjust the relative percentages assigned to protein, carbohydrates, and fat. The complete distribution should add up to 100%. The displayed gram amounts are then calculated from the selected distribution.",
  },
  {
    q: "What Is the Suggested Meal Split?",
    a: "The Suggested Meal Split divides the displayed daily calorie estimate across breakfast, lunch, dinner, and snacks. Your calculator initially uses a 25%, 30%, 30%, and 15% distribution, respectively. It is an organizational reference rather than a required meal schedule.",
  },
  {
    q: "Why Does the Calculator Show BMR and TDEE Separately?",
    a: "BMR represents estimated resting energy expenditure, whereas TDEE includes estimated energy use from daily activity. Displaying both helps explain how the calculator moves from a resting energy estimate to an overall daily energy estimate.",
  },
  {
    q: "Can I Use the Macro Calculator Without Creating an Account?",
    a: "Yes. The calculator is available 100% free without a sign-up requirement. You can enter the available information, view your calculated results, edit your inputs, and use the print option.",
  },
];
