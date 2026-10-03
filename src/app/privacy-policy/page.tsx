import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import LegalLayout, { type LegalSection } from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | The Meal Prep Ideas",
  description:
    "How The Meal Prep Ideas collects, uses, and protects your information — including account data, saved recipes, cookies, and your rights.",
  alternates: { canonical: "https://themealprepideas.com/privacy-policy" },
};

const sections: LegalSection[] = [
  { id: "overview", label: "Overview" },
  { id: "information-we-collect", label: "Information We Collect" },
  { id: "how-we-use-it", label: "How We Use It" },
  { id: "cookies", label: "Cookies & Tracking" },
  { id: "third-parties", label: "Third-Party Services" },
  { id: "your-rights", label: "Your Rights & Choices" },
  { id: "data-retention", label: "Data Retention" },
  { id: "children", label: "Children's Privacy" },
  { id: "changes", label: "Changes to This Policy" },
  { id: "contact", label: "Contact Us" },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      icon={<ShieldCheck className="size-6" />}
      title="Privacy Policy"
      subtitle="Your trust matters to us. Here's exactly what we collect, why, and how you stay in control of it."
      lastUpdated="September 18, 2026"
      sections={sections}
    >
      <section id="overview" className="scroll-mt-28">
        <h2 className="font-display text-2xl text-brand-heading">Overview</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-brand-body">
          This Privacy Policy explains how The Meal Prep Ideas (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or
          &ldquo;our&rdquo;) collects, uses, and protects your information when you visit
          themealprepideas.com, create an account, save recipes, leave a comment or rating, or contact us.
          By using the site, you agree to the practices described here.
        </p>
      </section>

      <section id="information-we-collect" className="scroll-mt-28">
        <h2 className="font-display text-2xl text-brand-heading">Information We Collect</h2>
        <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-brand-body">
          <p>
            <strong className="text-brand-heading">Account information.</strong> If you create a free
            account, we store your name, email address, and password (securely hashed — we never see or
            store it in plain text).
          </p>
          <p>
            <strong className="text-brand-heading">Saved recipes &amp; preferences.</strong> When you save a
            recipe or set your email notification preferences, we store that against your account so it
            appears in your dashboard.
          </p>
          <p>
            <strong className="text-brand-heading">Comments &amp; ratings.</strong> If you leave a comment
            or rating on a recipe, we store the name, rating, and text you submit. Comments are reviewed
            before they appear publicly.
          </p>
          <p>
            <strong className="text-brand-heading">Contact form submissions.</strong> If you message us
            through the Contact page, we store your name, email, and message so we can reply.
          </p>
          <p>
            <strong className="text-brand-heading">Automatically collected information.</strong> Like most
            websites, our hosting and analytics tools automatically log basic technical data — such as
            browser type, device type, and pages visited — to help us keep the site fast and reliable.
          </p>
        </div>
      </section>

      <section id="how-we-use-it" className="scroll-mt-28">
        <h2 className="font-display text-2xl text-brand-heading">How We Use It</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-brand-body">
          <li>To create and manage your account, and to show your saved recipes.</li>
          <li>To send you emails you&apos;ve opted into — new recipes and blog updates — which you can turn off anytime.</li>
          <li>To moderate and publish comments and ratings.</li>
          <li>To respond to messages sent through the Contact page.</li>
          <li>To understand how the site is used, so we can improve recipes, navigation, and performance.</li>
          <li>To keep the site secure and prevent abuse (for example, spam comment filtering).</li>
        </ul>
        <p className="mt-3 text-[15px] leading-relaxed text-brand-body">
          We do not sell your personal information to anyone.
        </p>
      </section>

      <section id="cookies" className="scroll-mt-28">
        <h2 className="font-display text-2xl text-brand-heading">Cookies &amp; Tracking</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-brand-body">
          We use essential cookies to keep you signed in and remember your session. We may also use
          privacy-respecting analytics to understand overall site traffic. You can control or disable
          cookies through your browser settings, though some features (like staying signed in) may not work
          properly without them.
        </p>
      </section>

      <section id="third-parties" className="scroll-mt-28">
        <h2 className="font-display text-2xl text-brand-heading">Third-Party Services</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-brand-body">
          We use trusted third-party services to run the site, and your information may pass through them
          strictly to provide their service to us:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-brand-body">
          <li><strong className="text-brand-heading">Supabase</strong> — hosts our database and handles account authentication.</li>
          <li><strong className="text-brand-heading">Resend</strong> — delivers transactional emails (account confirmations, recipe notifications, contact form replies).</li>
        </ul>
        <p className="mt-3 text-[15px] leading-relaxed text-brand-body">
          These providers only process your data on our behalf and are not permitted to use it for their own
          purposes.
        </p>
      </section>

      <section id="your-rights" className="scroll-mt-28">
        <h2 className="font-display text-2xl text-brand-heading">Your Rights &amp; Choices</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-brand-body">You&apos;re always in control of your data:</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-brand-body">
          <li>Update your name or password anytime from <em>My Account → Settings</em>.</li>
          <li>Turn email notifications on or off from the same Settings page.</li>
          <li>Delete your account entirely — including your saved recipes — with one click under <em>Settings → Danger Zone</em>. This is permanent and can&apos;t be undone.</li>
          <li>Email us at <a href="mailto:info@themealprepideas.com" className="text-brand-primary-dark hover:underline">info@themealprepideas.com</a> for any other request about your data.</li>
        </ul>
      </section>

      <section id="data-retention" className="scroll-mt-28">
        <h2 className="font-display text-2xl text-brand-heading">Data Retention</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-brand-body">
          We keep your account information for as long as your account is active. If you delete your
          account, your profile and saved recipes are removed immediately. Contact form messages are kept
          for as long as reasonably needed to resolve your inquiry and for our internal records.
        </p>
      </section>

      <section id="children" className="scroll-mt-28">
        <h2 className="font-display text-2xl text-brand-heading">Children&apos;s Privacy</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-brand-body">
          The Meal Prep Ideas is not directed at children under 13, and we do not knowingly collect personal
          information from children under 13. If you believe a child has provided us with personal
          information, please contact us and we&apos;ll remove it.
        </p>
      </section>

      <section id="changes" className="scroll-mt-28">
        <h2 className="font-display text-2xl text-brand-heading">Changes to This Policy</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-brand-body">
          We may update this Privacy Policy from time to time. If we make material changes, we&apos;ll update
          the &ldquo;Last updated&rdquo; date at the top of this page. Continued use of the site after
          changes means you accept the updated policy.
        </p>
      </section>

      <section id="contact" className="scroll-mt-28">
        <h2 className="font-display text-2xl text-brand-heading">Contact Us</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-brand-body">
          Questions about this policy or your data? Reach us at{" "}
          <a href="mailto:info@themealprepideas.com" className="text-brand-primary-dark hover:underline">
            info@themealprepideas.com
          </a>{" "}
          or through our <a href="/contact" className="text-brand-primary-dark hover:underline">Contact page</a>.
        </p>
      </section>
    </LegalLayout>
  );
}
