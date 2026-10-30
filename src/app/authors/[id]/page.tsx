import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChefHat, BookOpen, UtensilsCrossed, ArrowLeft,
  Award, Star, Briefcase, ExternalLink,
} from "lucide-react";
import Container from "@/components/ui/Container";
import Newsletter from "@/components/home/Newsletter";
import { getAuthorById, getPublishedRecipesByAuthor, getAllAuthorIds } from "@/lib/recipes/queries";
import { getPublishedPostsByAuthor } from "@/lib/posts/queries";
import type { AuthorProfile } from "@/lib/recipes/queries";
import AuthorContent from "./AuthorContent";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const ids = await getAllAuthorIds();
  return ids.map((id) => ({ id }));
}

const SITE_URL = "https://themealprepideas.com";

function getSocialLinks(author: AuthorProfile) {
  const links = [];
  if (author.website_url)   links.push({ label: "Website",    url: author.website_url,   icon: "🌐", color: "text-brand-primary-dark" });
  if (author.instagram_url) links.push({ label: "Instagram",  url: author.instagram_url, icon: "📸", color: "text-[#E1306C]" });
  if (author.pinterest_url) links.push({ label: "Pinterest",  url: author.pinterest_url, icon: "📌", color: "text-[#E60023]" });
  if (author.youtube_url)   links.push({ label: "YouTube",    url: author.youtube_url,   icon: "▶️", color: "text-[#FF0000]" });
  if (author.twitter_url)   links.push({ label: "X / Twitter",url: author.twitter_url,   icon: "𝕏",  color: "text-brand-heading" });
  if (author.facebook_url)  links.push({ label: "Facebook",   url: author.facebook_url,  icon: "📘", color: "text-[#1877F2]" });
  if (author.linkedin_url)  links.push({ label: "LinkedIn",   url: author.linkedin_url,  icon: "💼", color: "text-[#0A66C2]" });
  return links;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const author = await getAuthorById(id);
  if (!author) return { title: "Author Not Found | The Meal Prep Ideas" };
  const name = author.full_name ?? "Author";
  const title = author.job_title
    ? `${name}, ${author.job_title} | The Meal Prep Ideas`
    : `${name} — Recipes & Articles | The Meal Prep Ideas`;
  return {
    title,
    description: author.bio ?? `Browse all recipes and articles by ${name} on The Meal Prep Ideas.`,
    openGraph: {
      title, type: "profile",
      url: `${SITE_URL}/authors/${id}`,
      siteName: "The Meal Prep Ideas",
      description: author.bio ?? `Recipes and articles by ${name}`,
      ...(author.avatar_url ? { images: [{ url: author.avatar_url, width: 400, height: 400, alt: name }] } : {}),
    },
  };
}

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

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    description: author.bio,
    url: `${SITE_URL}/authors/${id}`,
    ...(author.avatar_url ? { image: author.avatar_url } : {}),
    ...(author.job_title ? { jobTitle: author.job_title } : {}),
    worksFor: { "@type": "Organization", name: "The Meal Prep Ideas", url: SITE_URL },
    ...(author.expertise?.length ? { knowsAbout: author.expertise } : {}),
    ...(author.website_url ? {
      sameAs: [author.website_url, author.twitter_url, author.instagram_url, author.linkedin_url].filter(Boolean)
    } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#edf7ee] via-[#f7fbf7] to-white pb-0 pt-10">
        <div className="pointer-events-none absolute -left-40 -top-40 size-[500px] rounded-full bg-brand-primary/5 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 top-0 size-96 rounded-full bg-brand-orange/6 blur-3xl" />

        <Container>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-light transition-colors hover:text-brand-primary-dark">
            <ArrowLeft className="size-4" /> Back to Home
          </Link>

          <div className="mt-10 pb-12 flex flex-col items-center gap-8 text-center md:flex-row md:items-start md:text-left">
            {/* Avatar */}
            <div className="relative shrink-0">
              {author.avatar_url ? (
                <Image
                  src={author.avatar_url}
                  alt={name}
                  width={140}
                  height={140}
                  className="size-36 rounded-full object-cover ring-4 ring-white shadow-[0_24px_64px_-20px_rgba(63,163,77,0.5)]"
                  priority
                />
              ) : (
                <span className="flex size-36 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-primary-dark text-white text-4xl font-bold shadow-[0_24px_64px_-20px_rgba(63,163,77,0.55)]">
                  {initials || <ChefHat className="size-14" />}
                </span>
              )}
              <span className="absolute -bottom-1.5 -right-1.5 flex size-10 items-center justify-center rounded-full bg-brand-primary-dark ring-[3px] ring-white shadow-lg">
                <ChefHat className="size-5 text-white" />
              </span>
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-[38px] leading-tight text-brand-heading sm:text-[50px]">{name}</h1>

              {(author.job_title || author.credentials) && (
                <div className="mt-2 flex flex-wrap items-center justify-center gap-2 md:justify-start">
                  {author.job_title && (
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary-dark">
                      <Briefcase className="size-3.5" />{author.job_title}
                    </span>
                  )}
                  {author.job_title && author.credentials && <span className="text-brand-border">·</span>}
                  {author.credentials && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-brand-primary/20 bg-brand-primary/7 px-2.5 py-0.5 text-xs font-bold text-brand-primary-dark">
                      <Award className="size-3" />{author.credentials}
                    </span>
                  )}
                </div>
              )}

              {/* Stats pills */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 md:justify-start">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-4 py-1.5 text-sm font-semibold text-brand-primary-dark">
                  <UtensilsCrossed className="size-3.5" />{recipes.length} Recipe{recipes.length !== 1 ? "s" : ""}
                </span>
                {posts.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange/10 px-4 py-1.5 text-sm font-semibold text-brand-orange">
                    <BookOpen className="size-3.5" />{posts.length} Article{posts.length !== 1 ? "s" : ""}
                  </span>
                )}
                {author.years_experience && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-brand-border/60 px-4 py-1.5 text-sm font-semibold text-brand-body shadow-sm">
                    <Star className="size-3.5 text-brand-orange" />{author.years_experience}+ yrs experience
                  </span>
                )}
              </div>

              {author.bio && (
                <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-brand-body">{author.bio}</p>
              )}

              {/* Social links */}
              {socialLinks.length > 0 && (
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2 md:justify-start">
                  {socialLinks.map((link) => (
                    <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 rounded-full border border-brand-border/60 bg-white px-3.5 py-1.5 text-xs font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${link.color}`}>
                      <span>{link.icon}</span>{link.label}<ExternalLink className="size-3 opacity-50" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Expertise tags */}
          {author.expertise && author.expertise.length > 0 && (
            <div className="border-t border-brand-border/30 py-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-light">Expert In</span>
                {author.expertise.map((tag) => (
                  <span key={tag} className="rounded-full bg-white border border-brand-border/60 px-3 py-1 text-xs font-medium text-brand-body shadow-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* ── Animated content (recipes + posts) ── */}
      <AuthorContent recipes={recipes} posts={posts} authorName={name} />

      <Newsletter />
    </>
  );
}
