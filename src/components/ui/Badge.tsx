import { cn } from "@/lib/utils";

interface BadgeProps { children: React.ReactNode; variant?: "cyan" | "violet" | "green" | "amber" | "rose" | "gray"; className?: string; dot?: boolean; }

export function Badge({ children, variant = "gray", className, dot }: BadgeProps) {
  const variants: Record<string, string> = {
    cyan: "badge-cyan", violet: "badge-violet", green: "badge-green",
    amber: "badge-amber", rose: "badge-rose", gray: "badge-gray",
  };
  const dotColor: Record<string, string> = {
    cyan: "bg-cyan", violet: "bg-violet", green: "bg-emerald",
    amber: "bg-amber", rose: "bg-rose", gray: "bg-text-muted",
  };
  return (
    <span className={cn("badge", variants[variant], className)}>
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", dotColor[variant])} />}
      {children}
    </span>
  );
}
