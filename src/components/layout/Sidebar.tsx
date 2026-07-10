"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Ticket, MessageSquare, Package,
  BarChart3, Settings, Zap, ChevronRight, LogOut, X, Menu
} from "lucide-react";
import { useState } from "react";
import { Avatar } from "@/components/ui";

const NAV_ITEMS = [
  { label: "General", items: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/tickets",   label: "Tickets",   icon: Ticket },
    { href: "/chat",      label: "Live Chat",  icon: MessageSquare },
  ]},
  { label: "Store", items: [
    { href: "/products",  label: "Products",  icon: Package },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
  ]},
  { label: "System", items: [
    { href: "/settings",  label: "Settings",  icon: Settings },
  ]},
];

interface SidebarProps { user?: { full_name: string | null; email: string } | null; }

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan to-violet shadow-glow-cyan">
          <Zap className="h-4 w-4 text-void" />
        </div>
        <div>
          <span className="font-bold text-text-primary tracking-tight">NexDesk</span>
          <span className="block text-[10px] text-text-muted leading-none mt-0.5">AI Support Platform</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {NAV_ITEMS.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-text-disabled">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                    className={cn("sidebar-link", isActive && "active")}>
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="flex-1">{label}</span>
                    {isActive && <ChevronRight className="h-3 w-3 opacity-60" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Agent Status Indicator */}
      <div className="px-3 py-3 border-t border-border">
        <div className="rounded-lg bg-cyan/5 border border-cyan/10 p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="status-dot online" />
            <span className="text-xs font-medium text-cyan">8 Agents Active</span>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {["T", "S", "I", "C", "P", "R", "Re", "E"].map((a, i) => (
              <div key={i} className={cn("h-6 rounded-md flex items-center justify-center text-[9px] font-bold", i < 6 ? "bg-cyan/10 text-cyan" : "bg-violet/10 text-violet")}>
                {a}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User */}
      {user && (
        <div className="px-3 pb-4 border-t border-border pt-3">
          <button
            onClick={async () => {
              const { createClient } = await import("@/lib/supabase/client");
              const supabase = createClient();
              await supabase.auth.signOut();
              window.location.href = "/login";
            }}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-raised transition-colors cursor-pointer group text-left"
          >
            <Avatar name={user.full_name || user.email} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-text-primary truncate">{user.full_name || "Admin"}</p>
              <p className="text-[10px] text-text-muted truncate">{user.email}</p>
            </div>
            <LogOut className="h-3.5 w-3.5 text-text-disabled group-hover:text-rose transition-colors" />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 flex-col h-screen sticky top-0 bg-surface border-r border-border flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Toggle */}
      <button onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-surface border border-border text-text-secondary hover:text-text-primary transition-colors">
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-void/80 backdrop-blur-sm" />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border">
              <button onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-raised transition-colors">
                <X className="h-4 w-4" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
