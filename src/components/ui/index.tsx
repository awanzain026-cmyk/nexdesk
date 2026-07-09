"use client";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useState, useEffect, createContext, useContext } from "react";

// ─── Button ───────────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Button({ variant = "primary", size = "md", loading, icon, children, className, disabled, ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary:   "btn-primary",
    secondary: "btn-secondary",
    ghost:     "btn-ghost",
    danger:    "inline-flex items-center justify-center gap-2 px-4 py-2 bg-rose/10 text-rose border border-rose/20 rounded-[5px] hover:bg-rose/20 transition-all text-sm font-medium cursor-pointer",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };
  return (
    <button
      type={(props as React.ButtonHTMLAttributes<HTMLButtonElement>).type ?? "button"}
      onClick={(props as React.ButtonHTMLAttributes<HTMLButtonElement>).onClick}
      className={cn(base, variants[variant], variant !== "primary" && variant !== "danger" && sizes[size], className)}
      disabled={disabled || loading}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      {children}
    </button>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
interface BadgeProps { children: React.ReactNode; variant?: "cyan" | "violet" | "green" | "amber" | "rose" | "gray"; className?: string; dot?: boolean; }

export function Badge({ children, variant = "gray", className, dot }: BadgeProps) {
  const variants = { cyan: "badge-cyan", violet: "badge-violet", green: "badge-green", amber: "badge-amber", rose: "badge-rose", gray: "badge-gray" };
  return (
    <span className={cn("badge", variants[variant], className)}>
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", { "bg-cyan": variant === "cyan", "bg-violet": variant === "violet", "bg-emerald": variant === "green", "bg-amber": variant === "amber", "bg-rose": variant === "rose", "bg-text-muted": variant === "gray" })} />}
      {children}
    </span>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
interface CardProps { children: React.ReactNode; className?: string; hover?: boolean; glow?: "cyan" | "violet"; onClick?: () => void; }

export function Card({ children, className, hover = true, glow, onClick }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -2 } : undefined}
      onClick={onClick}
      className={cn("card-static rounded-2xl p-4", hover && "card", glow === "cyan" && "glow-cyan", glow === "violet" && "glow-violet", onClick && "cursor-pointer", className)}
    >
      {children}
    </motion.div>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
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

// ─── Textarea ─────────────────────────────────────────────────────────────────
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

// ─── Avatar ───────────────────────────────────────────────────────────────────
interface AvatarProps { name: string; size?: "sm" | "md" | "lg"; src?: string | null; }

export function Avatar({ name, size = "md", src }: AvatarProps) {
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const sizes = { sm: "h-6 w-6 text-[10px]", md: "h-8 w-8 text-xs", lg: "h-10 w-10 text-sm" };
  if (src) return <img src={src} alt={name} className={cn("rounded-full object-cover", sizes[size])} />;
  return (
    <div className={cn("rounded-full bg-gradient-to-br from-cyan/20 to-violet/20 border border-cyan/20 flex items-center justify-center font-semibold text-cyan flex-shrink-0", sizes[size])}>
      {initials}
    </div>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-8 w-8" };
  return <Loader2 className={cn("animate-spin text-cyan", sizes[size])} />;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} />;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps { label: string; value: string | number; delta?: number; icon: React.ReactNode; color?: "cyan" | "violet" | "green" | "amber" | "rose"; }

export function StatCard({ label, value, delta, icon, color = "cyan" }: StatCardProps) {
  const colors = {
    cyan:   { bg: "bg-cyan/10",   text: "text-cyan",   border: "border-cyan/20" },
    violet: { bg: "bg-violet/10", text: "text-violet",  border: "border-violet/20" },
    green:  { bg: "bg-emerald/10",text: "text-emerald", border: "border-emerald/20" },
    amber:  { bg: "bg-amber/10",  text: "text-amber",   border: "border-amber/20" },
    rose:   { bg: "bg-rose/10",   text: "text-rose",    border: "border-rose/20" },
  };
  const c = colors[color];
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">{label}</p>
          <p className="metric-value text-text-primary">{value}</p>
          {delta !== undefined && (
            <p className={cn("text-xs mt-1.5 font-medium", delta >= 0 ? "text-emerald" : "text-rose")}>
              {delta >= 0 ? "↑" : "↓"} {Math.abs(delta)}% vs last week
            </p>
          )}
        </div>
        <div className={cn("p-2.5 rounded-xl border", c.bg, c.border)}>
          <div className={c.text}>{icon}</div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Toast System ─────────────────────────────────────────────────────────────
interface Toast { id: string; message: string; type: "success" | "error" | "info"; }
interface ToastContextType { add: (message: string, type?: Toast["type"]) => void; }

const ToastContext = createContext<ToastContextType>({ add: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const add = (message: string, type: Toast["type"] = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  };

  return (
    <ToastContext.Provider value={{ add }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div key={t.id} initial={{ opacity: 0, x: 40, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 40, scale: 0.9 }}
              className="flex items-center gap-3 glass-raised rounded-xl px-4 py-3 shadow-dropdown min-w-[260px]">
              {t.type === "success" && <CheckCircle className="h-4 w-4 text-emerald flex-shrink-0" />}
              {t.type === "error" && <AlertCircle className="h-4 w-4 text-rose flex-shrink-0" />}
              {t.type === "info" && <Info className="h-4 w-4 text-cyan flex-shrink-0" />}
              <p className="text-sm text-text-primary">{t.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, description, action }: { icon: React.ReactNode; title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="p-4 rounded-2xl bg-surface border border-border mb-4 text-text-muted">{icon}</div>
      <h3 className="text-sm font-semibold text-text-primary mb-1">{title}</h3>
      {description && <p className="text-xs text-text-muted max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
