import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

export function ThemeToggle({ className }: { className?: string }) {
  // Start with light to avoid SSR/hydration mismatch; sync in effect.
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let initial: Theme = "light";
    try {
      const stored = localStorage.getItem("potential-theme") as Theme | null;
      if (stored === "light" || stored === "dark") {
        initial = stored;
      } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        initial = "dark";
      }
    } catch {
      /* ignore */
    }
    setTheme(initial);
    applyTheme(initial);
    setMounted(true);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    try {
      localStorage.setItem("potential-theme", next);
    } catch {
      /* ignore */
    }
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light theme" : "Dark theme"}
      className={cn(
        "group inline-flex h-8 w-8 items-center justify-center rounded-full border border-hairline/70 bg-card/70 text-muted-foreground shadow-[0_1px_2px_-1px_rgb(30_30_60/0.06)] transition-all duration-200 ease-out hover:-translate-y-[1px] hover:text-foreground hover:shadow-[0_2px_6px_-2px_rgb(80_70_160/0.24)]",
        className,
      )}
    >
      {mounted && isDark ? (
        <Sun strokeWidth={1.7} className="h-[15px] w-[15px] text-amber" />
      ) : (
        <Moon strokeWidth={1.7} className="h-[15px] w-[15px]" />
      )}
    </button>
  );
}
