import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/layout/Header";
import { SITE_SOCIALS } from "@/data/site";
import Footer from "@/components/layout/Footer";
import WelcomePopup from "@/components/layout/WelcomePopup";
import { SavedRecipesProvider } from "@/components/account/SavedRecipesProvider";
import { getCurrentCustomer } from "@/lib/customers/session";
import { getSavedRecipeSlugs } from "@/lib/recipes/queries";
import { getHeaderMenu } from "@/lib/menu/queries";

const dmSerif = localFont({
  src: "./fonts/dm-serif-display.woff2",
  variable: "--font-dm-serif",
  display: "swap",
  weight: "400",
});

const jakarta = localFont({
  src: [
    { path: "./fonts/plus-jakarta-sans.woff2", weight: "400" },
    { path: "./fonts/plus-jakarta-sans.woff2", weight: "500" },
    { path: "./fonts/plus-jakarta-sans.woff2", weight: "600" },
    { path: "./fonts/plus-jakarta-sans.woff2", weight: "700" },
    { path: "./fonts/plus-jakarta-sans.woff2", weight: "800" },
  ],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "100+ Easy Meal Prep Ideas for Breakfast, Lunch & Dinner | The Meal Prep Ideas",
  description:
    "100+ easy meal prep ideas for breakfast, lunch, dinner, family meals, soups, snacks and bowls. Simple make-ahead recipes with step-by-step instructions and real photos.",
  metadataBase: new URL("https://themealprepideas.com"),
  alternates: { canonical: "https://themealprepideas.com" },
  openGraph: {
    title: "100+ Easy Meal Prep Ideas for Breakfast, Lunch & Dinner | The Meal Prep Ideas",
    description:
      "100+ easy meal prep ideas for breakfast, lunch, dinner, family meals, soups, snacks and bowls — simple, make-ahead, and ready when you need them.",
    type: "website",
    siteName: "The Meal Prep Ideas",
    url: "https://themealprepideas.com",
    images: [{ url: "https://themealprepideas.com/og-home.webp", width: 1734, height: 907, alt: "The Meal Prep Ideas — 100+ Easy Meal Prep Recipes" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "100+ Easy Meal Prep Ideas | The Meal Prep Ideas",
    description: "100+ easy meal prep ideas for breakfast, lunch, dinner and more. Simple, make-ahead recipes with real photos.",
    images: ["https://themealprepideas.com/og-home.webp"],
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "The Meal Prep Ideas",
  url: "https://themealprepideas.com",
  logo: {
    "@type": "ImageObject",
    url: "https://themealprepideas.com/icon.svg",
    width: 512,
    height: 512,
  },
  sameAs: Object.values(SITE_SOCIALS),
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "The Meal Prep Ideas",
  url: "https://themealprepideas.com",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://themealprepideas.com/recipes?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [customer, menuGroups] = await Promise.all([getCurrentCustomer(), getHeaderMenu()]);
  const savedSlugs = customer ? await getSavedRecipeSlugs(customer.id) : new Set<string>();

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${dmSerif.variable} ${jakarta.variable} h-full antialiased`}
    >
      <head>
          <Script
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5587923767051472"
            strategy="beforeInteractive"
            crossOrigin="anonymous"
          />
          <Script
            src="https://www.googletagmanager.com/gtm.js?id=GTM-NBSLLG29"
            strategy="beforeInteractive"
          />
          <Script id="gtm-init" strategy="beforeInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
            `}
          </Script>
        </head>
      <body className="min-h-full flex flex-col bg-brand-cream text-brand-body font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <SavedRecipesProvider initialSlugs={[...savedSlugs]} isLoggedIn={Boolean(customer)}>
          <Header customer={customer} menuGroups={menuGroups} />
          <main className="flex-1">{children}</main>
          <Footer />
          <WelcomePopup />
        </SavedRecipesProvider>
      </body>
    </html>
  );
}
