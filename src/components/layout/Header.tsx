"use client";
import { usePathname } from "next/navigation";
import { Search, Bell, ChevronRight, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const BREADCRUMB_MAP: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/tickets":   "Tickets",
  "/chat":      "Live Chat",
  "/products":  "Products",
  "/analytics": "Analytics",
  "/settings":  "Settings",
};

export default function DashboardHeader() {
  const pathname  = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch]         = useState("");

  const pageTitle = BREADCRUMB_MAP[pathname] ?? "NexDesk";

  return (
    <div className="sticky top-0 z-30 glass border-b border-border/60 pl-16 pr-4 py-3 lg:px-6 lg:py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm min-w-0">
          <span className="text-text-muted hidden sm:inline">NexDesk</span>
          <ChevronRight className="h-3.5 w-3.5 text-text-disabled hidden sm:inline" />
          <span className="font-medium text-text-primary truncate">{pageTitle}</span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <motion.div
            animate={{ width: searchOpen ? 220 : 36 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setSearchOpen(v => !v)}
              className={cn(
                "absolute left-0 top-0 h-9 w-9 flex items-center justify-center rounded-lg transition-colors z-10 cursor-pointer",
                searchOpen ? "text-cyan" : "text-text-muted hover:text-text-primary hover:bg-raised",
              )}
            >
              <Search className="h-4 w-4" />
            </button>
            {searchOpen && (
              <input
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
                onBlur={() => { setSearchOpen(false); setSearch(""); }}
                placeholder="Search tickets, products..."
                className="w-full pl-9 pr-3 h-9 bg-raised border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-cyan/40"
              />
            )}
          </motion.div>

          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              className="h-9 w-9 flex items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-raised transition-colors cursor-pointer"
            >
              <Bell className="h-4 w-4" />
            </button>
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose border border-void" />
          </div>

          {/* Agents live */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald/8 border border-emerald/15">
            <span className="status-dot online" />
            <span className="text-[11px] font-medium text-emerald">8 Agents Live</span>
          </div>

          {/* Logout — always visible */}
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            title="Sign out"
            className="h-9 w-9 flex items-center justify-center rounded-lg text-text-muted hover:text-rose hover:bg-rose/10 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
