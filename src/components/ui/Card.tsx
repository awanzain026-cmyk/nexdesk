"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
