import type { Metadata } from "next";
import { DM_Serif_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "100+ Easy Meal Prep Ideas for Breakfast, Lunch & Dinner | The Meal Prep Ideas",
  description:
    "100+ easy meal prep ideas for breakfast, lunch, dinner, family meals, soups, snacks and bowls. Simple make-ahead recipes with step-by-step instructions and real photos.",
  metadataBase: new URL("https://themealprepideas.com"),
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
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
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
