import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import ReadingProgress from "@/components/blog/ReadingProgress";
import ArticleHeader from "@/components/blog/ArticleHeader";
import ArticleContent from "@/components/blog/ArticleContent";
import { DesktopTOC, MobileTOC } from "@/components/blog/ArticleTOC";
import AuthorCard from "@/components/blog/AuthorCard";
import RelatedArticles from "@/components/blog/RelatedArticles";
import Newsletter from "@/components/home/Newsletter";
import { getPostBySlug, getRelatedPosts, getPublishedPosts } from "@/lib/posts/queries";
import { getHeadings } from "@/lib/posts/types";

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article Not Found | The Meal Prep Ideas" };

  return {
    title: post.seo.title || `${post.title} | The Meal Prep Ideas`,
    description: post.seo.description || post.excerpt,
    alternates: post.seo.canonical ? { canonical: post.seo.canonical } : undefined,
    openGraph: {
      title: post.title,
      description: post.seo.description || post.excerpt,
      type: "article",
      siteName: "The Meal Prep Ideas",
      images: [{ url: post.seo.ogImage || post.image }],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const headings = getHeadings(post.content);
  const related = await getRelatedPosts(post.slug, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.date,
    author: { "@type": "Person", name: post.author.name },
    publisher: { "@type": "Organization", name: "The Meal Prep Ideas" },
    mainEntityOfPage: `https://themealprepideas.com/blog/${post.slug}`,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://themealprepideas.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://themealprepideas.com/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://themealprepideas.com/blog/${post.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <ReadingProgress />
      <ArticleHeader post={post} />

      <section className="pb-16 md:pb-20">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start lg:gap-12">
            <div className="mx-auto w-full max-w-[720px] lg:mx-0">
              <MobileTOC headings={headings} />
              <ArticleContent content={post.content} />
              <AuthorCard author={post.author} />
            </div>

            <DesktopTOC headings={headings} />
          </div>
        </Container>
      </section>

      <RelatedArticles posts={related} />
      <Newsletter />
    </>
  );
}
