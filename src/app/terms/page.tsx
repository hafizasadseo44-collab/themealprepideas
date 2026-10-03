import type { Metadata } from "next";
import { ScrollText } from "lucide-react";
import LegalLayout, { type LegalSection } from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Terms of Service | The Meal Prep Ideas",
  description: "The terms and conditions for using The Meal Prep Ideas, our recipes, accounts, and comments.",
  alternates: { canonical: "https://themealprepideas.com/terms" },
};

const sections: LegalSection[] = [
  { id: "agreement", label: "Agreement to Terms" },
  { id: "accounts", label: "Accounts & Saved Recipes" },
  { id: "user-content", label: "Comments & Ratings" },
  { id: "recipe-disclaimer", label: "Recipe Disclaimer" },
  { id: "intellectual-property", label: "Intellectual Property" },
  { id: "prohibited-uses", label: "Prohibited Uses" },
  { id: "termination", label: "Termination" },
  { id: "disclaimer", label: "Disclaimer & Liability" },
  { id: "changes", label: "Changes to These Terms" },
  { id: "contact", label: "Contact Us" },
];

export default function TermsPage() {
  return (
    <LegalLayout
      icon={<ScrollText className="size-6" />}
      title="Terms of Service"
      subtitle="The ground rules for using The Meal Prep Ideas — plain and straightforward."
      lastUpdated="September 18, 2026"
      sections={sections}
    >
      <section id="agreement" className="scroll-mt-28">
        <h2 className="font-display text-2xl text-brand-heading">Agreement to Terms</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-brand-body">
          By accessing or using themealprepideas.com (the &ldquo;Site&rdquo;), you agree to be bound by these
          Terms of Service. If you don&apos;t agree with any part of these terms, please don&apos;t use the
          Site.
        </p>
      </section>

      <section id="accounts" className="scroll-mt-28">
        <h2 className="font-display text-2xl text-brand-heading">Accounts &amp; Saved Recipes</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-brand-body">
          <li>You must provide accurate information when creating an account and keep your password secure.</li>
          <li>You&apos;re responsible for all activity that happens under your account.</li>
          <li>Accounts are free and intended for personal, non-commercial use.</li>
          <li>You can delete your account at any time from your dashboard settings — this permanently removes your saved recipes.</li>
        </ul>
      </section>

      <section id="user-content" className="scroll-mt-28">
        <h2 className="font-display text-2xl text-brand-heading">Comments &amp; Ratings</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-brand-body">
          When you submit a comment or rating, you grant us permission to display it publicly on the
          relevant recipe page. We review comments before publishing and may edit, reject, or remove any
          submission — including links, spam, or content we consider inappropriate — at our discretion. Please
          keep your comments honest, relevant, and respectful.
        </p>
      </section>

      <section id="recipe-disclaimer" className="scroll-mt-28">
        <h2 className="font-display text-2xl text-brand-heading">Recipe Disclaimer</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-brand-body">
          Recipes, prep times, and nutritional information on this Site are provided for general
          informational purposes only. Actual results, cook times, and nutritional values can vary based on
          ingredients, equipment, and technique. If you have food allergies, dietary restrictions, or medical
          conditions, please verify ingredients yourself and consult a qualified professional before making
          dietary changes. We are not responsible for any adverse reaction resulting from a recipe on this
          Site.
        </p>
      </section>

      <section id="intellectual-property" className="scroll-mt-28">
        <h2 className="font-display text-2xl text-brand-heading">Intellectual Property</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-brand-body">
          All original recipes, photos, articles, graphics, and branding on this Site are owned by The Meal
          Prep Ideas unless otherwise noted. You&apos;re welcome to link to our pages or share short excerpts
          with credit and a link back — but please don&apos;t republish, scrape, or redistribute our content
          in full without our written permission.
        </p>
      </section>

      <section id="prohibited-uses" className="scroll-mt-28">
        <h2 className="font-display text-2xl text-brand-heading">Prohibited Uses</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-brand-body">
          <li>Attempting to disrupt, overload, or gain unauthorized access to the Site or its systems.</li>
          <li>Posting spam, malicious links, or content that impersonates someone else.</li>
          <li>Scraping or bulk-copying content without permission.</li>
          <li>Using the Site for any unlawful purpose.</li>
        </ul>
      </section>

      <section id="termination" className="scroll-mt-28">
        <h2 className="font-display text-2xl text-brand-heading">Termination</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-brand-body">
          We may suspend or terminate access to your account if we reasonably believe you&apos;ve violated
          these Terms. You may stop using the Site and delete your account at any time.
        </p>
      </section>

      <section id="disclaimer" className="scroll-mt-28">
        <h2 className="font-display text-2xl text-brand-heading">Disclaimer &amp; Limitation of Liability</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-brand-body">
          The Site and its content are provided &ldquo;as is&rdquo; without warranties of any kind, express
          or implied. To the fullest extent permitted by law, The Meal Prep Ideas is not liable for any
          indirect, incidental, or consequential damages arising from your use of the Site or any recipe
          found on it.
        </p>
      </section>

      <section id="changes" className="scroll-mt-28">
        <h2 className="font-display text-2xl text-brand-heading">Changes to These Terms</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-brand-body">
          We may revise these Terms from time to time. The &ldquo;Last updated&rdquo; date above reflects the
          most recent changes. Continuing to use the Site after an update means you accept the revised
          Terms.
        </p>
      </section>

      <section id="contact" className="scroll-mt-28">
        <h2 className="font-display text-2xl text-brand-heading">Contact Us</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-brand-body">
          Questions about these Terms? Reach us at{" "}
          <a href="mailto:info@themealprepideas.com" className="text-brand-primary-dark hover:underline">
            info@themealprepideas.com
          </a>{" "}
          or through our <a href="/contact" className="text-brand-primary-dark hover:underline">Contact page</a>.
        </p>
      </section>
    </LegalLayout>
  );
}
