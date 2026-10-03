/**
 * One-time migration: copies the 9 hardcoded posts from src/data/blog.ts
 * into the Supabase `posts` table so the CMS becomes the source of truth.
 *
 * Run once with: npx tsx scripts/seed-posts.ts
 *
 * Requires an admin account to already exist (sign in at /admin once and
 * promote your profile's role to 'admin' in SQL Editor) — seeded posts are
 * attributed to that admin account.
 */
import { readFileSync } from "fs";
import { join } from "path";
import { createClient } from "@supabase/supabase-js";
import { blogPosts } from "../src/data/blog";
import { blocksToTiptapJson } from "../src/lib/tiptap/blocks-to-json";

function loadEnvLocal() {
  try {
    const content = readFileSync(join(process.cwd(), ".env.local"), "utf-8");
    for (const line of content.split("\n")) {
      const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
    }
  } catch {
    // .env.local not found — assume env vars are already set another way
  }
}

async function main() {
  loadEnvLocal();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  const { data: adminProfile, error: adminError } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "admin")
    .limit(1)
    .maybeSingle();

  if (adminError || !adminProfile) {
    console.error("No admin profile found. Sign in at /admin once and set your role to 'admin' first.");
    process.exit(1);
  }

  const { data: categories } = await supabase.from("categories").select("id, name");
  const categoryByName = new Map((categories ?? []).map((c) => [c.name, c.id]));

  for (const post of blogPosts) {
    const categoryId = categoryByName.get(post.category) ?? null;
    const publishedAt = new Date(post.date).toISOString();

    const { error } = await supabase.from("posts").upsert(
      {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        cover_image_url: post.image,
        category_id: categoryId,
        author_id: adminProfile.id,
        status: "published",
        published_at: publishedAt,
        minutes: post.minutes,
        tags: post.tags,
        trending: post.trending ?? false,
        featured: post.featured ?? false,
        content: blocksToTiptapJson(post.content),
      },
      { onConflict: "slug" }
    );

    if (error) {
      console.error(`✗ ${post.slug}: ${error.message}`);
    } else {
      console.log(`✓ ${post.slug}`);
    }
  }

  console.log("\nDone. All posts are attributed to your admin account for now — edit them in /admin/posts to reassign authors or tweak anything.");
}

main();
