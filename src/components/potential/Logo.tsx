import { cn } from "@/lib/utils";

export function Logo({ className, showWord = true }: { className?: string; showWord?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-soft">
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
          <path
            d="M6 20V4h6a5 5 0 0 1 0 10H9"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="17" cy="7" r="2" fill="var(--color-emerald)" />
        </svg>
      </div>
      {showWord && (
        <span className="text-[15px] font-semibold tracking-tight text-foreground">
          Potential
        </span>
      )}
    </div>
  );
}
