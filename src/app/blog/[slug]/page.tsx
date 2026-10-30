import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import ReadingProgress from "@/components/blog/ReadingProgress";
import ArticleHeader from "@/components/blog/ArticleHeader";
import ArticleContent from "@/components/blog/ArticleContent";
import { DesktopTOC, MobileTOC } from "@/components/blog/ArticleTOC";
import AuthorCard from "@/components/blog/AuthorCard";
import CoAuthors from "@/components/blog/CoAuthors";
import RelatedArticles from "@/components/blog/RelatedArticles";
import Newsletter from "@/components/home/Newsletter";
import { getPostBySlug, getRelatedPosts, getPublishedPosts, getPostCoAuthors } from "@/lib/posts/queries";
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

  const canonicalUrl = post.seo.canonical || `https://themealprepideas.com/blog/${post.slug}`;
  const description = post.seo.description || post.excerpt;
  const ogImage = post.seo.ogImage || post.image;

  return {
    title: post.seo.title || `${post.title} | The Meal Prep Ideas`,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: post.title,
      description,
      type: "article",
      siteName: "The Meal Prep Ideas",
      url: canonicalUrl,
      publishedTime: post.date,
      authors: [post.author.name],
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: post.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: ogImage ? [ogImage] : undefined,
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

  const canonicalUrl = post.seo?.canonical || `https://themealprepideas.com/blog/${post.slug}`;
  const headings = getHeadings(post.content);
  const [related, coAuthors] = await Promise.all([
    getRelatedPosts(post.slug, 3),
    getPostCoAuthors(post.id),
  ]);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.date,
    dateModified: post.date,
    url: canonicalUrl,
    mainEntityOfPage: canonicalUrl,
    author: {
      "@type": "Person",
      name: post.author.name,
      ...(post.authorId ? { url: `https://themealprepideas.com/authors/${post.authorId}` } : {}),
    },
    publisher: {
      "@type": "Organization",
      name: "The Meal Prep Ideas",
      url: "https://themealprepideas.com",
      logo: { "@type": "ImageObject", url: "https://themealprepideas.com/icon.svg", width: 512, height: 512 },
    },
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
              <AuthorCard author={post.author} authorId={post.authorId} />
              {coAuthors.length > 0 && <CoAuthors authors={coAuthors} />}
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
