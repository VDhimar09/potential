import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-hairline/70 bg-background/40 px-8 py-14 text-center backdrop-blur-xl",
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground/[0.05] text-muted-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 font-display text-[20px] text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
