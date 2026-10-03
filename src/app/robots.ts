import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // Site-wide crawl block while the site is still in development — disallows
  // every path for every crawler so nothing gets indexed. To go live, restore
  // `allow: "/"` with the admin/account disallow list and re-add the sitemap
  // (`sitemap: "https://themealprepideas.com/sitemap.xml"`).
  return {
    rules: [
      {
        userAgent: "*",
        disallow: "/",
      },
    ],
  };
}
