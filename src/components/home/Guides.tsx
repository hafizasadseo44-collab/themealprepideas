import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import GuidesGrid from "@/components/home/GuidesGrid";
import { getPublishedPosts } from "@/lib/posts/queries";

export default async function Guides() {
  const posts = await getPublishedPosts();
  const latest = posts.slice(0, 3);

  if (latest.length === 0) return null;

  return (
    <section className="py-20 md:py-28">
      <Container>
        <SectionHeading eyebrow="Learn" title="Latest Meal Prep Guides" />

        <div className="mt-6 flex justify-center">
          <Button href="/blog" variant="ghost" icon={ArrowRight}>
            View All Guides
          </Button>
        </div>

        <div className="mt-8">
          <GuidesGrid posts={latest} />
        </div>
      </Container>
    </section>
  );
}
