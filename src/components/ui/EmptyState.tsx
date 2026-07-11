import { cn } from "@/lib/utils";

interface EmptyStateProps { icon: React.ReactNode; title: string; description?: string; action?: React.ReactNode; }

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="p-4 rounded-2xl bg-surface border border-border mb-4 text-text-muted">{icon}</div>
      <h3 className="text-sm font-semibold text-text-primary mb-1">{title}</h3>
      {description && <p className="text-xs text-text-muted max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
