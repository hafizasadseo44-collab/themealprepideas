"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Switch({
  checked,
  onChange,
  disabled,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-300",
        checked ? "bg-brand-primary" : "bg-brand-border",
        disabled && "opacity-60"
      )}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className="size-5 rounded-full bg-white shadow-sm"
        style={{ marginLeft: checked ? "calc(100% - 22px)" : "2px" }}
      />
    </button>
  );
}
