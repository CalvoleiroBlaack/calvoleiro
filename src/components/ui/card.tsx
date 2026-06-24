import * as React from "react";
import { cn } from "@/lib/utils";

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "cl-glass rounded-lg text-fg relative overflow-hidden",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

export const CardHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "border-b border-border/60 px-5 py-3 flex items-center justify-between gap-3",
      className
    )}
    {...props}
  />
);

export const CardTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={cn(
      "text-[11px] font-semibold uppercase tracking-[0.14em] text-fg-2",
      className
    )}
    {...props}
  />
);

export const CardContent = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-5", className)} {...props} />
);

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?:
    | "default"
    | "neon"
    | "royal"
    | "success"
    | "warn"
    | "danger"
    | "muted"
    | "accent";
  className?: string;
}) {
  const styles: Record<string, string> = {
    default: "bg-surface-2 text-fg-2 border-border-2",
    neon: "bg-neon/10 text-neon border-neon/30",
    royal: "bg-royal/10 text-glow border-royal/30",
    success: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    warn: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    danger: "bg-rose-500/10 text-rose-300 border-rose-500/30",
    muted: "bg-surface text-muted border-border",
    accent: "bg-electric/10 text-electric border-electric/30",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] font-medium tracking-wide",
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md cl-fade-in p-4"
      onClick={onClose}
    >
      <div
        className={cn(
          "cl-glass-strong w-full max-h-[90vh] overflow-y-auto rounded-xl cl-scale-in",
          wide ? "max-w-3xl" : "max-w-lg"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-border/60 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-fg">{title}</h2>
            {subtitle && (
              <p className="text-xs text-muted mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-fg h-7 w-7 rounded-md hover:bg-surface flex items-center justify-center transition-colors"
            aria-label="Fechar"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
        {footer && (
          <div className="border-t border-border/60 px-6 py-3 flex justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
        {label}
      </span>
      {children}
      {hint && <span className="block text-[11px] text-dim">{hint}</span>}
    </label>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="cl-glass rounded-xl p-12 text-center">
      {icon && (
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-surface-2 border border-border-2 text-neon">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-fg">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-muted max-w-sm mx-auto">{description}</p>
      )}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

export function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className="cl-kbd">{children}</kbd>;
}
