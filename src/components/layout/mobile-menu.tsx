"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { NAV_GROUPS } from "@/lib/nav";
import { Logo } from "@/components/brand/logo";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="h-9 w-9 rounded-md border border-border bg-surface/40 flex items-center justify-center text-fg-2"
        aria-label="Menu"
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md"
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute left-0 top-0 h-full w-72 cl-glass-strong border-r border-border/60 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-border/60">
              <Logo />
            </div>
            <nav className="p-3 space-y-4">
              {NAV_GROUPS.map((group) => (
                <div key={group.label}>
                  <div className="px-3 mb-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-dim">
                    {group.label}
                  </div>
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const active = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm",
                            active
                              ? "cl-active-glow text-fg"
                              : "text-fg-2"
                          )}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
