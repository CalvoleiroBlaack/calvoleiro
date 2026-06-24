"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/logo";
import { NAV_GROUPS } from "@/lib/nav";

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex lg:w-64 flex-col cl-glass border-r border-border/60 min-h-screen sticky top-0 z-30">
      <div className="px-5 py-4 border-b border-border/60">
        <Logo />
      </div>

      <nav className="flex-1 py-3 px-3 space-y-5 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <div className="px-3 mb-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-dim">
              {group.label}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = item.end
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-2.5 rounded-md pl-3 pr-2 py-1.5 text-[13px] transition-all",
                      active
                        ? "cl-active-glow text-fg font-medium"
                        : "text-fg-2 hover:bg-surface/70 hover:text-fg"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-3.5 w-3.5 transition-colors flex-shrink-0",
                        active ? "text-neon" : "text-muted group-hover:text-fg-2"
                      )}
                    />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] font-mono text-neon px-1 rounded bg-neon/10">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-4 py-3 border-t border-border/60 text-[10px] font-mono text-dim flex items-center justify-between">
        <span>v2.0 · Calvoleiro</span>
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 cl-pulse" />
          online
        </span>
      </div>
    </aside>
  );
}
