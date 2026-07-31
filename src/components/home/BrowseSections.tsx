import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import BrowseTaxonomy from "@/components/home/BrowseTaxonomy";
import { byGoal, byDiet, byProtein, byMealType } from "@/data/site";

export default function BrowseSections() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <SectionHeading
          eyebrow="Find Your Fit"
          title="Browse by Goal, Diet, Protein & Meal Type"
          description="However you like to search, we've organized every recipe to get you there in one click."
        />

        <div className="mt-14 grid gap-6">
          <BrowseTaxonomy eyebrow="By Goal" title="Browse by Goal" items={byGoal} basePath="/goal" />
          <BrowseTaxonomy eyebrow="By Diet" title="Browse by Diet" items={byDiet} basePath="/diet" tinted />
          <BrowseTaxonomy eyebrow="By Protein" title="Browse by Protein" items={byProtein} basePath="/protein" />
          <BrowseTaxonomy eyebrow="By Meal Type" title="Browse by Meal Type" items={byMealType} basePath="/meal-type" tinted />
        </div>
      </Container>
    </section>
  );
}
