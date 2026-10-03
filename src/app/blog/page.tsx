import type { Metadata } from "next";
import BlogHero from "@/components/blog/BlogHero";
import FeaturedPost from "@/components/blog/FeaturedPost";
import BlogExplorer from "@/components/blog/BlogExplorer";
import Newsletter from "@/components/home/Newsletter";
import { getPublishedPosts, getCategories } from "@/lib/posts/queries";

export const metadata: Metadata = {
  title: "Meal Prep Blog: Tips, Guides & Advice | The Meal Prep Ideas",
  description:
    "Practical meal prep guides on planning, storage, nutrition, and gear — real advice for making healthy eating simple every week.",
  openGraph: {
    title: "Meal Prep Blog: Tips, Guides & Advice | The Meal Prep Ideas",
    description:
      "Practical meal prep guides on planning, storage, nutrition, and gear — real advice for making healthy eating simple every week.",
    type: "website",
    siteName: "The Meal Prep Ideas",
  },
};

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([getPublishedPosts(), getCategories()]);
  const featuredPost = posts.find((p) => p.featured) ?? posts[0] ?? null;
  const gridPosts = featuredPost ? posts.filter((p) => p.slug !== featuredPost.slug) : posts;
  const categoryNames = categories.map((c) => c.name);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://themealprepideas.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://themealprepideas.com/blog" },
    ],
  };

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "The Meal Prep Journal",
    url: "https://themealprepideas.com/blog",
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      image: post.image,
      datePublished: post.date,
      author: { "@type": "Person", name: post.author.name },
      url: `https://themealprepideas.com/blog/${post.slug}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />

      <BlogHero postCount={posts.length} categoryCount={categories.length} />
      {featuredPost && <FeaturedPost post={featuredPost} />}
      <BlogExplorer posts={gridPosts} categories={categoryNames} />
      <Newsletter />
    </>
  );
}
