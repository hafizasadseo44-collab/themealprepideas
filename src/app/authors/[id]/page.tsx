import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChefHat, BookOpen, UtensilsCrossed, ArrowLeft, Clock,
  Award, Star, Briefcase, Globe, ExternalLink,
} from "lucide-react";
import Container from "@/components/ui/Container";
import Newsletter from "@/components/home/Newsletter";
import { getAuthorById, getPublishedRecipesByAuthor } from "@/lib/recipes/queries";
import { getPublishedPostsByAuthor } from "@/lib/posts/queries";
import type { AuthorProfile } from "@/lib/recipes/queries";

export const dynamic = "force-dynamic";

const SITE_URL = "https://themealprepideas.com";

// ─── Social link helper ───────────────────────────────────────────────────────
type SocialLink = { label: string; url: string; color: string; icon: string };

function getSocialLinks(author: AuthorProfile): SocialLink[] {
  const links: SocialLink[] = [];
  if (author.website_url) links.push({ label: "Website", url: author.website_url, color: "text-brand-primary-dark", icon: "🌐" });
  if (author.instagram_url) links.push({ label: "Instagram", url: author.instagram_url, color: "text-[#E1306C]", icon: "📸" });
  if (author.pinterest_url) links.push({ label: "Pinterest", url: author.pinterest_url, color: "text-[#E60023]", icon: "📌" });
  if (author.youtube_url) links.push({ label: "YouTube", url: author.youtube_url, color: "text-[#FF0000]", icon: "▶️" });
  if (author.twitter_url) links.push({ label: "X / Twitter", url: author.twitter_url, color: "text-brand-heading", icon: "𝕏" });
  if (author.facebook_url) links.push({ label: "Facebook", url: author.facebook_url, color: "text-[#1877F2]", icon: "📘" });
  if (author.linkedin_url) links.push({ label: "LinkedIn", url: author.linkedin_url, color: "text-[#0A66C2]", icon: "💼" });
  return links;
}

// ─── Metadata ────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const author = await getAuthorById(id);
  if (!author) return { title: "Author Not Found | The Meal Prep Ideas" };
  const name = author.full_name ?? "Author";
  const title = author.job_title ? `${name}, ${author.job_title} | The Meal Prep Ideas` : `${name} — Recipes & Articles | The Meal Prep Ideas`;
  return {
    title,
    description: author.bio ?? `Browse all recipes and articles by ${name} on The Meal Prep Ideas.`,
    openGraph: {
      title,
      description: author.bio ?? `Recipes and articles by ${name}`,
      type: "profile",
      url: `${SITE_URL}/authors/${id}`,
      siteName: "The Meal Prep Ideas",
      ...(author.avatar_url ? { images: [{ url: author.avatar_url, width: 400, height: 400, alt: name }] } : {}),
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function AuthorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [author, recipes, posts] = await Promise.all([
    getAuthorById(id),
    getPublishedRecipesByAuthor(id),
    getPublishedPostsByAuthor(id),
  ]);

  if (!author) notFound();

  const name = author.full_name ?? "The Meal Prep Ideas Team";
  const initials = name.split(" ").slice(0, 2).map((w: string) => w[0]?.toUpperCase()).join("");
  const socialLinks = getSocialLinks(author);

  // Person schema — key E-E-A-T signal for Google
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    description: author.bio,
    url: `${SITE_URL}/authors/${id}`,
    ...(author.avatar_url ? { image: author.avatar_url } : {}),
    ...(author.job_title ? { jobTitle: author.job_title } : {}),
    ...(author.website_url ? { sameAs: [author.website_url, ...[author.twitter_url, author.instagram_url, author.linkedin_url].filter(Boolean)] } : {}),
    worksFor: { "@type": "Organization", name: "The Meal Prep Ideas", url: SITE_URL },
    ...(author.expertise && author.expertise.length > 0 ? { knowsAbout: author.expertise } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f0faf1] via-brand-cream to-white pb-0 pt-10">
        {/* Blobs */}
        <div className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-brand-primary/6 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-0 size-80 rounded-full bg-brand-orange/8 blur-3xl" />

        <Container>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-light transition-colors hover:text-brand-primary-dark">
            <ArrowLeft className="size-4" /> Back to Home
          </Link>

          <div className="mt-10 pb-12 flex flex-col items-center gap-8 text-center sm:flex-row sm:items-start sm:text-left">

            {/* Avatar */}
            <div className="relative shrink-0">
              {author.avatar_url ? (
                <Image
                  src={author.avatar_url}
                  alt={name}
                  width={128}
                  height={128}
                  className="size-32 rounded-full object-cover ring-4 ring-white shadow-[0_20px_60px_-20px_rgba(63,163,77,0.45)]"
                  priority
                />
              ) : (
                <span className="flex size-32 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-primary-dark text-white text-4xl font-bold shadow-[0_20px_60px_-20px_rgba(63,163,77,0.5)]">
                  {initials || <ChefHat className="size-12" />}
                </span>
              )}
              <span className="absolute -bottom-1 -right-1 flex size-9 items-center justify-center rounded-full bg-brand-primary-dark ring-[3px] ring-white shadow">
                <ChefHat className="size-4.5 text-white" />
              </span>
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-[38px] leading-tight text-brand-heading sm:text-[48px]">
                {name}
              </h1>

              {/* Title + credentials */}
              {(author.job_title || author.credentials) && (
                <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  {author.job_title && (
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary-dark">
                      <Briefcase className="size-3.5" />
                      {author.job_title}
                    </span>
                  )}
                  {author.job_title && author.credentials && <span className="text-brand-border">·</span>}
                  {author.credentials && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-brand-primary/20 bg-brand-primary/6 px-2.5 py-0.5 text-xs font-bold text-brand-primary-dark">
                      <Award className="size-3" />
                      {author.credentials}
                    </span>
                  )}
                </div>
              )}

              {/* Stats row */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-3.5 py-1.5 text-sm font-semibold text-brand-primary-dark">
                  <UtensilsCrossed className="size-3.5" />
                  {recipes.length} Recipe{recipes.length !== 1 ? "s" : ""}
                </span>
                {posts.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange/12 px-3.5 py-1.5 text-sm font-semibold text-brand-orange">
                    <BookOpen className="size-3.5" />
                    {posts.length} Article{posts.length !== 1 ? "s" : ""}
                  </span>
                )}
                {author.years_experience && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-gray px-3.5 py-1.5 text-sm font-semibold text-brand-body">
                    <Star className="size-3.5 text-brand-orange" />
                    {author.years_experience}+ years experience
                  </span>
                )}
              </div>

              {/* Bio */}
              {author.bio && (
                <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-brand-body">{author.bio}</p>
              )}

              {/* Social links */}
              {socialLinks.length > 0 && (
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 rounded-full border border-brand-border/70 bg-white px-3.5 py-1.5 text-xs font-semibold transition-all hover:-translate-y-0.5 hover:shadow-sm ${link.color}`}
                    >
                      <span>{link.icon}</span>
                      {link.label}
                      <ExternalLink className="size-3 opacity-60" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Expertise tags bar */}
          {author.expertise && author.expertise.length > 0 && (
            <div className="border-t border-brand-border/40 py-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 text-xs font-bold uppercase tracking-widest text-brand-light">Expert In</span>
                {author.expertise.map((tag) => (
                  <span key={tag} className="rounded-full bg-white border border-brand-border/70 px-3 py-1 text-xs font-medium text-brand-body shadow-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* ── Recipes ── */}
      {recipes.length > 0 && (
        <section className="border-t border-brand-border/40 py-16">
          <Container>
            <div className="mb-10 flex items-end justify-between">
              <div>
                <h2 className="font-display text-[28px] text-brand-heading md:text-[34px]">
                  Recipes by {name}
                </h2>
                <p className="mt-1 text-sm text-brand-light">{recipes.length} published recipe{recipes.length !== 1 ? "s" : ""}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recipes.map((recipe) => (
                <Link
                  key={recipe.id}
                  href={`/recipes/${recipe.slug}`}
                  className="group flex flex-col overflow-hidden rounded-[20px] border border-brand-border/60 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-primary/30 hover:shadow-[0_20px_40px_-20px_rgba(17,24,39,0.18)]"
                >
                  {recipe.image && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={recipe.image}
                        alt={recipe.imageAlt}
                        fill
                        sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    {recipe.tag && (
                      <span className="mb-2 inline-flex w-fit rounded-full bg-brand-primary/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-primary-dark">
                        {recipe.tag}
                      </span>
                    )}
                    <h3 className="font-display text-[17px] leading-snug text-brand-heading transition-colors group-hover:text-brand-primary-dark">
                      {recipe.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-brand-light">
                      {recipe.description}
                    </p>
                    {recipe.prepTime && (
                      <span className="mt-auto pt-4 inline-flex items-center gap-1.5 text-xs text-brand-light">
                        <Clock className="size-3.5" />{recipe.prepTime}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ── Blog Posts ── */}
      {posts.length > 0 && (
        <section className="border-t border-brand-border/40 bg-brand-cream/40 py-16">
          <Container>
            <div className="mb-10">
              <h2 className="font-display text-[28px] text-brand-heading md:text-[34px]">
                Articles by {name}
              </h2>
              <p className="mt-1 text-sm text-brand-light">{posts.length} published article{posts.length !== 1 ? "s" : ""}</p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col overflow-hidden rounded-[20px] border border-brand-border/60 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-primary/30 hover:shadow-[0_20px_40px_-20px_rgba(17,24,39,0.18)]"
                >
                  {post.image && (
                    <div className="relative h-44 overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.imageAlt}
                        fill
                        sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    {post.category && (
                      <span className="mb-2 inline-flex w-fit rounded-full bg-brand-orange/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-orange">
                        {post.category}
                      </span>
                    )}
                    <h3 className="font-display text-[17px] leading-snug text-brand-heading transition-colors group-hover:text-brand-primary-dark">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-brand-light">{post.excerpt}</p>
                    <span className="mt-auto pt-4 inline-flex items-center gap-1.5 text-xs text-brand-light">
                      <Clock className="size-3.5" />{post.readTime}<span className="mx-1">·</span>{post.date}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {recipes.length === 0 && posts.length === 0 && (
        <section className="py-24 text-center">
          <Container>
            <p className="text-brand-light">No published content yet from this author.</p>
          </Container>
        </section>
      )}

      <Newsletter />
    </>
  );
}
