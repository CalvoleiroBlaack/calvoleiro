import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg text-fg">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 cl-grid">
        <Topbar />
        <main className="flex-1 p-4 md:p-8 cl-fade-up">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
  badge,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  badge?: string;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {badge && (
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-neon mb-2">
            {badge}
          </div>
        )}
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-fg">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[13px] text-muted mt-1 max-w-2xl">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}
