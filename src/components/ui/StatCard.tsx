"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatCardProps { label: string; value: string | number; delta?: number; icon: React.ReactNode; color?: "cyan" | "violet" | "green" | "amber" | "rose"; }

export function StatCard({ label, value, delta, icon, color = "cyan" }: StatCardProps) {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    cyan: { bg: "bg-cyan/10", text: "text-cyan", border: "border-cyan/20" },
    violet: { bg: "bg-violet/10", text: "text-violet", border: "border-violet/20" },
    green: { bg: "bg-emerald/10", text: "text-emerald", border: "border-emerald/20" },
    amber: { bg: "bg-amber/10", text: "text-amber", border: "border-amber/20" },
    rose: { bg: "bg-rose/10", text: "text-rose", border: "border-rose/20" },
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
