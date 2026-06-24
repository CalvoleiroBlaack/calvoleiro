import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uid(prefix = "") {
  return (
    prefix +
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 10)
  );
}

export function formatNumber(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return "0";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(Math.round(n));
}

export function formatPercent(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return "0%";
  return n.toFixed(1) + "%";
}

export function formatDate(d: Date | string | null | undefined): string {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function gradeFromCtr(ctr: number): "excellent" | "good" | "weak" | "bad" {
  if (ctr >= 10) return "excellent";
  if (ctr >= 6) return "good";
  if (ctr >= 3) return "weak";
  return "bad";
}
