import { cn } from "@/lib/utils";

export function Logo({
  size = "md",
  showWordmark = true,
  className,
}: {
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  className?: string;
}) {
  const sizes = {
    sm: { box: "h-7 w-7", text: "text-[11px]", word: "text-sm" },
    md: { box: "h-9 w-9", text: "text-sm", word: "text-base" },
    lg: { box: "h-12 w-12", text: "text-lg", word: "text-2xl" },
  }[size];

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative">
        <div
          className={cn(
            "relative rounded-lg cl-gradient-brand flex items-center justify-center cl-glow-soft",
            sizes.box
          )}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-1/2 w-1/2 text-white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 7L12 3L21 7M3 7V17L12 21M3 7L12 11M21 7V17L12 21M21 7L12 11M12 21V11"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div
          className={cn(
            "absolute inset-0 rounded-lg bg-royal/40 blur-xl opacity-60 -z-10"
          )}
        />
      </div>
      {showWordmark && (
        <div className="leading-tight">
          <div
            className={cn(
              "font-semibold tracking-tight text-fg cl-gradient-text",
              sizes.word
            )}
          >
            Calvoleiro
          </div>
          <div className="text-[9px] font-mono uppercase tracking-[0.22em] text-dim -mt-0.5">
            Second Brain OS
          </div>
        </div>
      )}
    </div>
  );
}
