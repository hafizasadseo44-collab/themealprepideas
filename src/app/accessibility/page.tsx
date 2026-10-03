import type { Metadata } from "next";
import { Accessibility } from "lucide-react";
import LegalLayout, { type LegalSection } from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Accessibility | The Meal Prep Ideas",
  description: "Our commitment to making The Meal Prep Ideas usable for everyone, and how to report an accessibility issue.",
  alternates: { canonical: "https://themealprepideas.com/accessibility" },
};

const sections: LegalSection[] = [
  { id: "commitment", label: "Our Commitment" },
  { id: "standards", label: "Standards We Follow" },
  { id: "features", label: "Accessibility Features" },
  { id: "feedback", label: "Feedback & Contact" },
];

export default function AccessibilityPage() {
  return (
    <LegalLayout
      icon={<Accessibility className="size-6" />}
      title="Accessibility Statement"
      subtitle="We want everyone to be able to find, read, and cook from our recipes — regardless of ability."
      lastUpdated="September 18, 2026"
      sections={sections}
    >
      <section id="commitment" className="scroll-mt-28">
        <h2 className="font-display text-2xl text-brand-heading">Our Commitment</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-brand-body">
          The Meal Prep Ideas is committed to providing a website that is accessible to the widest possible
          audience, regardless of technology or ability. We&apos;re actively working to increase the
          accessibility and usability of our site and in doing so adhere to many available standards and
          guidelines.
        </p>
      </section>

      <section id="standards" className="scroll-mt-28">
        <h2 className="font-display text-2xl text-brand-heading">Standards We Follow</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-brand-body">
          We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA where practical. These
          guidelines explain how to make web content more accessible for people with disabilities and more
          user-friendly for everyone.
        </p>
      </section>

      <section id="features" className="scroll-mt-28">
        <h2 className="font-display text-2xl text-brand-heading">Accessibility Features</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-brand-body">
          <li>Semantic HTML and heading structure so screen readers can navigate the page logically.</li>
          <li>Descriptive alt text on recipe photos and other meaningful images.</li>
          <li>Keyboard-navigable menus, forms, and interactive elements.</li>
          <li>Sufficient color contrast between text and backgrounds across the site.</li>
          <li>Clear, consistent navigation and a searchable recipe library.</li>
        </ul>
      </section>

      <section id="feedback" className="scroll-mt-28">
        <h2 className="font-display text-2xl text-brand-heading">Feedback &amp; Contact</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-brand-body">
          Accessibility is an ongoing effort. If you encounter any barrier using this site — a page that
          doesn&apos;t work well with a screen reader, a color contrast issue, or anything else — please let
          us know at{" "}
          <a href="mailto:info@themealprepideas.com" className="text-brand-primary-dark hover:underline">
            info@themealprepideas.com
          </a>{" "}
          or through our <a href="/contact" className="text-brand-primary-dark hover:underline">Contact page</a>. Include
          the page and a brief description, and we&apos;ll do our best to address it promptly.
        </p>
      </section>
    </LegalLayout>
  );
}
