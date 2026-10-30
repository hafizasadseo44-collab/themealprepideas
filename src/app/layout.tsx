import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/layout/Header";
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
  // Site-wide noindex while the site is still in development — keeps every
  // page out of Google. Remove this `robots` block to allow indexing again.
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    title: "100+ Easy Meal Prep Ideas for Breakfast, Lunch & Dinner | The Meal Prep Ideas",
    description:
      "100+ easy meal prep ideas for breakfast, lunch, dinner, family meals, soups, snacks and bowls — simple, make-ahead, and ready when you need them.",
    type: "website",
    siteName: "The Meal Prep Ideas",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "The Meal Prep Ideas",
  url: "https://themealprepideas.com",
  logo: "https://themealprepideas.com/favicon.ico",
  sameAs: [],
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
