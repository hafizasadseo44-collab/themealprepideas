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
  title: "75+ Easy Meal Prep Ideas | The Meal Prep Ideas",
  description:
    "Discover 75+ easy, healthy meal prep ideas — breakfast, lunch, dinner, high protein, keto, vegan and more. Simple recipes, real photos, and step-by-step guides.",
  metadataBase: new URL("https://themealprepideas.com"),
  openGraph: {
    title: "75+ Easy Meal Prep Ideas | The Meal Prep Ideas",
    description:
      "Discover 75+ easy, healthy meal prep ideas — breakfast, lunch, dinner, high protein, keto, vegan and more.",
    type: "website",
    siteName: "The Meal Prep Ideas",
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
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
