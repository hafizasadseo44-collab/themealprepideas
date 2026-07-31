import Hero from "@/components/home/Hero";
import QuickAnswer from "@/components/home/QuickAnswer";
import TrustBadges from "@/components/home/TrustBadges";
import Collections from "@/components/home/Collections";
import FeaturedRecipes from "@/components/home/FeaturedRecipes";
import BrowseSections from "@/components/home/BrowseSections";
import SeasonalCuisine from "@/components/home/SeasonalCuisine";
import Tips from "@/components/home/Tips";
import Containers from "@/components/home/Containers";
import Guides from "@/components/home/Guides";
import Faq from "@/components/home/Faq";
import Newsletter from "@/components/home/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />
      <QuickAnswer />
      <TrustBadges />
      <Collections />
      <FeaturedRecipes />
      <BrowseSections />
      <SeasonalCuisine />
      <Tips />
      <Containers />
      <Guides />
      <Faq />
      <Newsletter />
    </>
  );
}
