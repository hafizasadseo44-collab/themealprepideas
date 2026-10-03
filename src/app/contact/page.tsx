import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import ContactHero from "@/components/contact/ContactHero";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";

export const metadata: Metadata = {
  title: "Contact Us | The Meal Prep Ideas",
  description:
    "Have a question, recipe request, or feedback? Get in touch with The Meal Prep Ideas — we read and reply to every message.",
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <section className="pb-20 md:pb-28">
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_0.9fr] lg:gap-10">
            <ContactForm />
            <ContactInfo />
          </div>
        </Container>
      </section>
    </>
  );
}
