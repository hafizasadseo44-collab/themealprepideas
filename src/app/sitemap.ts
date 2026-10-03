import type { MetadataRoute } from "next";
import { getSitemapRecipes, getRecipePages } from "@/lib/recipes/queries";
import { getSitemapPosts } from "@/lib/posts/queries";

const SITE_URL = "https://themealprepideas.com";

// Rebuild the sitemap at most once an hour even without an explicit publish,
// so newly published recipes/blogs/pages become discoverable to search engines
// automatically. Publishing also revalidates "/sitemap.xml" on demand for
// near-instant pickup (see the content mutations).
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [recipes, posts, pages] = await Promise.all([getSitemapRecipes(), getSitemapPosts(), getRecipePages()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/recipes`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/categories`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/blog`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/privacy-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/accessibility`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const pageRoutes: MetadataRoute.Sitemap = pages
    .filter((page) => page.route !== "/") // "/" is already in staticRoutes above
    .map((page) => ({
      url: `${SITE_URL}${page.route}`,
      changeFrequency: "daily",
      priority: 0.85,
    }));

  const recipeRoutes: MetadataRoute.Sitemap = recipes.map((recipe) => ({
    url: `${SITE_URL}/recipes/${recipe.slug}`,
    lastModified: recipe.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...pageRoutes, ...recipeRoutes, ...postRoutes];
}
