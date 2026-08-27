"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export default function Counter({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const stepMs = 20;
    const start = performance.now();
    const id = setInterval(() => {
      const progress = Math.min((performance.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress >= 1) clearInterval(id);
    }, stepMs);
    return () => clearInterval(id);
  }, [inView, target]);

  return <span ref={ref}>{value}</span>;
}
