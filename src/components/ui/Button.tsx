import Link from "next/link";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type ButtonProps = {
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "dark";
  size?: "md" | "lg";
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  className?: string;
  children: React.ReactNode;
  type?: "button" | "submit";
};

const variants = {
  primary:
    "bg-brand-primary text-white hover:bg-brand-primary-dark shadow-[0_8px_24px_-8px_rgba(63,163,77,0.55)]",
  secondary:
    "bg-white text-brand-primary-dark border border-brand-primary/30 hover:border-brand-primary hover:bg-brand-primary/5",
  ghost: "bg-transparent text-brand-primary-dark hover:bg-brand-primary/10",
  dark: "bg-brand-heading text-white hover:bg-black",
};

const sizes = {
  md: "h-12 px-6 text-[15px]",
  lg: "h-14 px-8 text-base",
};

export default function Button({
  href,
  onClick,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "right",
  className,
  children,
  type = "button",
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-[14px] font-semibold transition-all duration-300 ease-out active:scale-[0.97]",
    variants[variant],
    sizes[size],
    className
  );

  const content = (
    <>
      {Icon && iconPosition === "left" && <Icon className="size-4.5" />}
      {children}
      {Icon && iconPosition === "right" && <Icon className="size-4.5" />}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
