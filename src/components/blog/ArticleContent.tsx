"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Lightbulb, AlertTriangle, Info, Quote } from "lucide-react";
import { slugifyHeading, type ContentBlock } from "@/data/blog";

const calloutStyles = {
  tip: { icon: Lightbulb, bg: "bg-brand-primary/8", border: "border-brand-primary/25", text: "text-brand-primary-dark", iconBg: "bg-brand-primary/15" },
  warning: { icon: AlertTriangle, bg: "bg-brand-orange/8", border: "border-brand-orange/25", text: "text-brand-orange-deep", iconBg: "bg-brand-orange/15" },
  info: { icon: Info, bg: "bg-brand-info/8", border: "border-brand-info/25", text: "text-brand-info", iconBg: "bg-brand-info/15" },
} as const;

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" as const },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

function renderInline(text: string, keyPrefix: string) {
  const parts = text.split(/(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith("***") && part.endsWith("***")) {
      return (
        <strong key={`${keyPrefix}-${i}`} className="font-semibold italic text-brand-heading">
          {part.slice(3, -3)}
        </strong>
      );
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${keyPrefix}-${i}`} className="font-semibold text-brand-heading">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={`${keyPrefix}-${i}`}>{part.slice(1, -1)}</em>;
    }
    return <span key={`${keyPrefix}-${i}`}>{part}</span>;
  });
}

export default function ArticleContent({ content }: { content: ContentBlock[] }) {
  return (
    <div className="space-y-7">
      {content.map((block, i) => {
        switch (block.type) {
          case "p":
            return (
              <motion.p {...fadeUp} key={i} className="text-[17px] leading-[1.85] text-brand-body">
                {renderInline(block.text, `p-${i}`)}
              </motion.p>
            );

          case "h2": {
            const id = slugifyHeading(block.text);
            return (
              <motion.h2
                {...fadeUp}
                key={i}
                id={id}
                className="flex scroll-mt-28 items-center gap-3 pt-3 font-display text-[24px] leading-tight text-brand-heading sm:text-[28px]"
              >
                <>
                  <span className="h-6 w-1.5 shrink-0 rounded-full bg-gradient-to-b from-brand-primary to-brand-orange" />
                  {renderInline(block.text, `h2-${i}`)}
                </>
              </motion.h2>
            );
          }

          case "h3": {
            const id = slugifyHeading(block.text);
            return (
              <motion.h3
                {...fadeUp}
                key={i}
                id={id}
                className="scroll-mt-28 pt-1 font-display text-xl text-brand-heading"
              >
                {renderInline(block.text, `h3-${i}`)}
              </motion.h3>
            );
          }

          case "h4": {
            const id = slugifyHeading(block.text);
            return (
              <motion.h4 {...fadeUp} key={i} id={id} className="scroll-mt-28 pt-1 text-lg font-bold text-brand-heading">
                {renderInline(block.text, `h4-${i}`)}
              </motion.h4>
            );
          }

          case "h5": {
            const id = slugifyHeading(block.text);
            return (
              <motion.h5 {...fadeUp} key={i} id={id} className="scroll-mt-28 pt-1 text-base font-bold text-brand-heading">
                {renderInline(block.text, `h5-${i}`)}
              </motion.h5>
            );
          }

          case "h6": {
            const id = slugifyHeading(block.text);
            return (
              <motion.h6
                {...fadeUp}
                key={i}
                id={id}
                className="scroll-mt-28 pt-1 text-sm font-bold uppercase tracking-wide text-brand-light"
              >
                {renderInline(block.text, `h6-${i}`)}
              </motion.h6>
            );
          }

          case "ul":
            return (
              <motion.ul {...fadeUp} key={i} className="space-y-2.5">
                {block.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3 text-[17px] leading-relaxed text-brand-body">
                    <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand-primary" />
                    <span>{renderInline(item, `ul-${i}-${j}`)}</span>
                  </li>
                ))}
              </motion.ul>
            );

          case "ol":
            return (
              <motion.ol {...fadeUp} key={i} className="space-y-3">
                {block.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3.5 text-[17px] leading-relaxed text-brand-body">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-primary/12 text-xs font-bold text-brand-primary-dark">
                      {j + 1}
                    </span>
                    <span>{renderInline(item, `ol-${i}-${j}`)}</span>
                  </li>
                ))}
              </motion.ol>
            );

          case "quote":
            return (
              <motion.blockquote
                {...fadeUp}
                key={i}
                className="relative my-2 overflow-hidden rounded-[20px] border-l-4 border-brand-orange bg-brand-orange/6 py-6 pl-7 pr-6"
              >
                <>
                  <Quote className="absolute right-5 top-5 size-9 text-brand-orange/15" />
                  <p className="relative font-display text-xl italic leading-snug text-brand-heading sm:text-[22px]">
                    &ldquo;{block.text}&rdquo;
                  </p>
                  {block.attribution && (
                    <p className="relative mt-3 text-sm font-medium text-brand-light">— {block.attribution}</p>
                  )}
                </>
              </motion.blockquote>
            );

          case "callout": {
            const style = calloutStyles[block.variant];
            const Icon = style.icon;
            return (
              <motion.div
                {...fadeUp}
                key={i}
                className={`flex gap-4 rounded-[18px] border ${style.border} ${style.bg} p-5 md:p-6`}
              >
                <>
                  <span className={`flex size-9 shrink-0 items-center justify-center rounded-full ${style.iconBg} ${style.text}`}>
                    <Icon className="size-4.5" />
                  </span>
                  <div className="min-w-0">
                    {block.title && <p className={`font-semibold ${style.text}`}>{block.title}</p>}
                    <p className="mt-1 text-[15px] leading-relaxed text-brand-body">
                      {renderInline(block.text, `callout-${i}`)}
                    </p>
                  </div>
                </>
              </motion.div>
            );
          }

          case "table":
            return (
              <motion.div
                {...fadeUp}
                key={i}
                className="my-2 overflow-x-auto rounded-[18px] border border-brand-border/60"
              >
                <table className="w-full min-w-[480px] border-collapse text-left text-[15px]">
                  <thead>
                    <tr className="bg-brand-primary/8">
                      {block.headers.map((h, j) => (
                        <th key={j} className="whitespace-nowrap px-5 py-3.5 font-semibold text-brand-heading">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, ri) => (
                      <tr key={ri} className={ri % 2 === 1 ? "bg-brand-gray/60" : "bg-white"}>
                        {row.map((cell, ci) => (
                          <td key={ci} className="border-t border-brand-border/50 px-5 py-3.5 text-brand-body">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            );

          case "image":
            return (
              <motion.figure {...fadeUp} key={i} className="my-2">
                <div className="relative h-56 w-full overflow-hidden rounded-[18px] sm:h-72 md:h-80">
                  <Image src={block.src} alt={block.alt} fill sizes="720px" className="object-cover" />
                </div>
                {block.caption && (
                  <figcaption className="mt-2.5 text-center text-sm text-brand-light">{block.caption}</figcaption>
                )}
              </motion.figure>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
