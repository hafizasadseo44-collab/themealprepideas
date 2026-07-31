import Link from "next/link";
import { ChefHat, Camera, ThumbsUp, PlayCircle } from "lucide-react";
import Container from "@/components/ui/Container";
import { byDiet, byMealType } from "@/data/site";

const footerNav = [
  { label: "Recipes", href: "/recipes" },
  { label: "Collections", href: "/categories" },
  { label: "Guides", href: "/guides" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const legal = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Accessibility", href: "/accessibility" },
];

export default function Footer() {
  return (
    <footer className="border-t border-brand-border/60 bg-white">
      <Container className="py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex size-10 items-center justify-center rounded-[12px] bg-brand-primary text-white">
                <ChefHat className="size-5" />
              </span>
              <span className="font-display text-xl text-brand-heading">
                The Meal Prep <span className="text-brand-primary-dark">Ideas</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-light">
              Premium, easy meal prep ideas and recipes for every goal, diet, and
              schedule — built to make healthy eating simple.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[Camera, ThumbsUp, PlayCircle].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="flex size-10 items-center justify-center rounded-full border border-brand-border/70 text-brand-body transition-colors hover:border-brand-primary/50 hover:text-brand-primary-dark"
                >
                  <Icon className="size-4.5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold text-brand-heading">Navigate</p>
            <ul className="space-y-2.5">
              {footerNav.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-brand-light transition-colors hover:text-brand-primary-dark"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold text-brand-heading">By Diet</p>
            <ul className="space-y-2.5">
              {byDiet.slice(0, 5).map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/diet/${item.slug}`}
                    className="text-sm text-brand-light transition-colors hover:text-brand-primary-dark"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold text-brand-heading">By Meal Type</p>
            <ul className="space-y-2.5">
              {byMealType.slice(0, 5).map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/meal-type/${item.slug}`}
                    className="text-sm text-brand-light transition-colors hover:text-brand-primary-dark"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-brand-border/60 pt-8 sm:flex-row">
          <p className="text-sm text-brand-light">
            © {new Date().getFullYear()} The Meal Prep Ideas. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {legal.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm text-brand-light transition-colors hover:text-brand-primary-dark"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
