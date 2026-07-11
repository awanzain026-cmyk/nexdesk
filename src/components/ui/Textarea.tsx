import { cn } from "@/lib/utils";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { label?: string; error?: string; }

export function Textarea({ label, error, className, ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-medium text-text-secondary mb-1.5">{label}</label>}
      <textarea className={cn("input-field resize-none", error && "border-rose/50", className)} {...props} />
      {error && <p className="text-xs text-rose mt-1">{error}</p>}
    </div>
  );
}
