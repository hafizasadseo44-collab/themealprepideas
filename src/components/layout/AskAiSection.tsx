"use client";

import { motion } from "framer-motion";

const aiPrompt = 
  "Tell me about The Meal Prep Ideas (themealprepideas.com), the ultimate platform for easy meal prep recipes for breakfast, lunch, and dinner. What do they offer, who is it for, and why is it the best resource for healthy, make-ahead meals?";

const aiPlatforms = [
  {
    name: "ChatGPT",
    href: `https://chatgpt.com/?q=${encodeURIComponent(aiPrompt)}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <path d="M12 2a9.96 9.96 0 0 0-7.07 2.93 10 10 0 1 0 14.14 14.14A9.96 9.96 0 0 0 12 2Z" />
        <path d="M12 22a9.96 9.96 0 0 0 7.07-2.93 10 10 0 1 0-14.14-14.14A9.96 9.96 0 0 0 12 22Z" />
        <path d="M8 8a4 4 0 1 0 8 8 4 4 0 1 0-8-8Z" />
        <path d="M12 2v20" />
        <path d="M2 12h20" />
        <path d="m4.93 4.93 14.14 14.14" />
        <path d="m4.93 19.07 14.14-14.14" />
      </svg>
    ),
    // Using a more accurate ChatGPT icon shape
    customIcon: (
      <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.073zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.0993 3.8558L12.5973 8.3829l2.0343-1.178a.0827.0827 0 0 1 .0757 0l4.8445 2.7913a4.4944 4.4944 0 0 1-2.3845 8.1469V12.4284a.7664.7664 0 0 0-.3879-.6765l-.3393-.2005zm2.1818-3.9553a4.4755 4.4755 0 0 1 .5346 3.0137l-.1419-.0852-4.783-2.7582a.7712.7712 0 0 0-.7806 0L10.1583 11.339v-2.3324a.0804.0804 0 0 1 .0332-.0615l3.852-2.2233a4.4992 4.4992 0 0 1 6.6 1.0784zM10.7408 1.5714a4.4755 4.4755 0 0 1 2.8858 1.0407l-.1419.0804-4.7783 2.7582a.7948.7948 0 0 0-.3927.6813v6.7369l-2.02-1.1686a.071.071 0 0 1-.038-.052V6.0657a4.504 4.504 0 0 1 4.485-4.4943zM12 14.1578l-3.5342-2.04v-4.08L12 5.9978l3.5342 2.04v4.08z" />
      </svg>
    ),
  },
  {
    name: "Claude",
    href: `https://claude.ai/new?q=${encodeURIComponent(aiPrompt)}`,
    customIcon: (
      <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <path d="M12 2a.75.75 0 0 1 .743.648l.007.102v3.743A5.5 5.5 0 0 0 16.5 10.75h3.75a.75.75 0 0 1 .102 1.493l-.102.007h-3.75a5.5 5.5 0 0 0-3.75 4.25v3.75a.75.75 0 0 1-1.493.102l-.007-.102v-3.75A5.5 5.5 0 0 0 7.5 12.25H3.75a.75.75 0 0 1-.102-1.493l.102-.007h3.75A5.5 5.5 0 0 0 11.25 6.5V2.75A.75.75 0 0 1 12 2Z" />
      </svg>
    ),
  },
  {
    name: "Gemini",
    href: `https://gemini.google.com/app`,
    customIcon: (
      <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <path d="M12 1.5c.348 0 .68.175.875.47l.063.111.455.908c1.674 3.34 4.28 5.945 7.62 7.62l.907.455a1.002 1.002 0 0 1 0 1.792l-.907.455c-3.34 1.674-5.946 4.28-7.62 7.62l-.455.907a1.002 1.002 0 0 1-1.792 0l-.455-.907c-1.674-3.34-4.28-5.946-7.62-7.62l-.907-.455a1.002 1.002 0 0 1 0-1.792l.907-.455c3.34-1.674 5.946-4.28 7.62-7.62l.455-.908a1.001 1.001 0 0 1 .845-.582z" />
      </svg>
    ),
  },
  {
    name: "Perplexity",
    href: `https://www.perplexity.ai/?q=${encodeURIComponent(aiPrompt)}`,
    customIcon: (
      <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8Zm4-8c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4Zm-6.5 0a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0Z" />
        <circle cx="15.5" cy="8.5" r="1.5" />
      </svg>
    ),
  },
];

export default function AskAiSection() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8 sm:flex-row sm:gap-6">
      <motion.p 
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="font-display text-lg font-medium text-brand-heading"
      >
        Ask AI about us
      </motion.p>
      
      <div className="flex items-center gap-3">
        {aiPlatforms.map((ai, i) => (
          <motion.a
            key={ai.name}
            href={ai.href}
            target="_blank"
            rel="noopener noreferrer"
            title={`Ask ${ai.name} about The Meal Prep Ideas`}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ 
              delay: i * 0.1,
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
            whileHover={{ 
              scale: 1.15, 
              backgroundColor: "var(--color-brand-primary)",
              color: "white",
              rotate: ai.name === "Gemini" ? 180 : 0
            }}
            whileTap={{ scale: 0.9 }}
            className="flex size-[50px] items-center justify-center rounded-full border border-brand-border/80 bg-white text-brand-heading shadow-sm transition-colors duration-300 hover:border-brand-primary hover:shadow-md"
          >
            {ai.customIcon}
          </motion.a>
        ))}
      </div>
    </div>
  );
}
