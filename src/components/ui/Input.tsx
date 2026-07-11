import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { label?: string; error?: string; icon?: React.ReactNode; }

export function Input({ label, error, icon, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-medium text-text-secondary mb-1.5">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">{icon}</div>}
        <input className={cn("input-field", icon && "pl-9", error && "border-rose/50 focus:border-rose/70", className)} {...props} />
      </div>
      {error && <p className="text-xs text-rose mt-1">{error}</p>}
    </div>
  );
}
