import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none cursor-pointer select-none cl-lift",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-b from-royal-2 to-royal text-white border border-royal-2 hover:from-royal hover:to-royal cl-glow-soft active:scale-[0.98]",
        neon:
          "bg-neon/10 text-neon border border-neon/30 hover:bg-neon/20 hover:border-neon/50",
        ghost:
          "border border-border bg-surface/40 text-fg-2 hover:bg-surface hover:border-border-2 hover:text-fg",
        outline:
          "border border-border text-fg-2 hover:bg-surface hover:text-fg",
        subtle:
          "text-muted hover:text-fg hover:bg-surface/60",
        danger:
          "border border-rose-500/40 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20",
        link: "text-neon hover:text-neon-2 underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4",
        lg: "h-11 px-6 text-base",
        icon: "h-9 w-9",
        "icon-sm": "h-7 w-7",
      },
    },
    defaultVariants: { variant: "ghost", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";
