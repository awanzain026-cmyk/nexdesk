"use client";
import { motion, AnimatePresence } from "framer-motion";
import { StatCard, Card } from "@/components/ui";
import { Ticket, CheckCircle, Clock, AlertTriangle, TrendingUp, ArrowRight, MessageSquare, Radio } from "lucide-react";
import Link from "next/link";
import { cn, formatRelativeTime, getTicketStatusColor, getTicketPriorityColor } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface DashboardTicket {
  id: string;
  ticket_number: string;
  customer_name: string | null;
  subject: string;
  type: string;
  status: string;
  priority: string;
  agent_handled: string;
  created_at: string;
}

interface ActivityItem {
  id: string;
  agent_name: string;
  action: string;
  ticket_number: string | null;
  created_at: string;
}

interface DashboardStats {
  total: number;
  open: number;
  resolvedToday: number;
  escalated: number;
  resolutionRate: number;
}

const AGENT_COLORS: Record<string, string> = {
  "Triage Orchestrator": "text-cyan",
  "Support Agent":       "text-violet",
  "Inventory Agent":     "text-amber",
  "Catalog Agent":       "text-emerald",
  "Policy Agent":        "text-rose",
  "Returns Agent":       "text-cyan",
  "Replacement Agent":   "text-violet",
  "Escalation Agent":    "text-rose",
  "Analytics Agent":     "text-emerald",
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [tickets, setTickets] = useState<DashboardTicket[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newestActivityId, setNewestActivityId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard-stats");
      const data = await res.json();
      setStats(data.stats);
      setTickets(data.tickets ?? []);
      setActivity(data.activity ?? []);
    } catch (err) {
      console.error("[dashboard] failed to load real data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Genuine realtime feed -- subscribes to real inserts on agent_activity,
  // not a simulated setInterval. New rows appear the moment they're written.
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("agent_activity_feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "agent_activity" },
        (payload) => {
          const row = payload.new as ActivityItem;
          setActivity((prev) => [row, ...prev].slice(0, 8));
          setNewestActivityId(row.id);
          setTimeout(() => setNewestActivityId((cur) => (cur === row.id ? null : cur)), 2000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">Dashboard</h1>
          <p className="text-sm text-text-muted mt-0.5">TechVault AI Support — Real-time overview</p>
        </div>
        <Link href="/chat" className="self-start sm:self-auto">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary text-sm">
            <MessageSquare className="h-4 w-4" /> Open Chat
          </motion.button>
        </Link>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Tickets" value={loading ? "—" : stats?.total ?? 0} icon={<Ticket className="h-5 w-5" />} color="cyan" />
        <StatCard label="Open Tickets"  value={loading ? "—" : stats?.open ?? 0} icon={<Clock className="h-5 w-5" />} color="amber" />
        <StatCard label="Resolved Today" value={loading ? "—" : stats?.resolvedToday ?? 0} icon={<CheckCircle className="h-5 w-5" />} color="green" />
        <StatCard label="Escalated" value={loading ? "—" : stats?.escalated ?? 0} icon={<AlertTriangle className="h-5 w-5" />} color="rose" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tickets */}
        <div className="lg:col-span-2">
          <Card hover={false} className="p-0 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-text-primary">Recent Tickets</h2>
              <Link href="/tickets" className="text-xs text-cyan hover:text-cyan/80 flex items-center gap-1 transition-colors">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div>
              {loading ? (
                <div className="p-5 space-y-3">
                  {[1, 2, 3].map((i) => <div key={i} className="skeleton h-14 w-full" />)}
                </div>
              ) : tickets.length === 0 ? (
                <div className="p-10 text-center">
                  <p className="text-sm text-text-muted mb-3">No tickets yet</p>
                  <Link href="/chat" className="text-xs text-cyan hover:text-cyan/80">Try the live chat to create one →</Link>
                </div>
              ) : (
                tickets.map((ticket, i) => (
                  <motion.div key={ticket.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 px-5 py-3.5 border-b border-border/50 last:border-0 hover:bg-raised/50 transition-colors cursor-pointer group">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-text-muted">{ticket.ticket_number}</span>
                        <span className={cn("badge text-[10px]", getTicketPriorityColor(ticket.priority as "low" | "medium" | "high" | "urgent"))}>{ticket.priority}</span>
                      </div>
                      <p className="text-sm text-text-primary truncate group-hover:text-cyan transition-colors">{ticket.subject}</p>
                      <p className="text-xs text-text-muted mt-0.5">{ticket.customer_name ?? "Anonymous visitor"} · {formatRelativeTime(ticket.created_at)}</p>
                    </div>
                    <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
                      <span className={cn("badge text-[10px]", getTicketStatusColor(ticket.status as "open" | "in_progress" | "resolved" | "closed" | "escalated"))}>{ticket.status.replace("_", " ")}</span>
                      <span className={cn("text-[10px]", AGENT_COLORS[ticket.agent_handled] ?? "text-cyan")}>{ticket.agent_handled}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Live Agent Feed -- genuine Supabase realtime subscription */}
        <div>
          <Card hover={false} className="p-0 overflow-hidden h-full">
            <div className="flex items-center justify-between px-4 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-text-primary">Live Agent Feed</h2>
              <div className="flex items-center gap-1.5">
                <Radio className="h-3 w-3 text-emerald" />
                <span className="text-[10px] text-emerald font-medium">Live</span>
              </div>
            </div>
            <div className="p-3 space-y-2 overflow-y-auto max-h-[400px]">
              {loading ? (
                [1, 2, 3].map((i) => <div key={i} className="skeleton h-16 w-full" />)
              ) : activity.length === 0 ? (
                <p className="text-xs text-text-muted p-4 text-center">No agent activity yet — start a chat to see it here in real time.</p>
              ) : (
                <AnimatePresence initial={false}>
                  {activity.map((item) => (
                    <motion.div key={item.id} initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={cn("rounded-lg p-3 border transition-all duration-500", item.id === newestActivityId ? "bg-cyan/5 border-cyan/15" : "bg-raised/30 border-border/50")}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={cn("text-[10px] font-semibold", AGENT_COLORS[item.agent_name] ?? "text-cyan")}>{item.agent_name}</span>
                        <span className="text-[10px] text-text-muted">{formatRelativeTime(item.created_at)}</span>
                      </div>
                      <p className="text-xs text-text-secondary">{item.action}</p>
                      {item.ticket_number && <span className="text-[10px] font-mono text-text-muted mt-1 block">{item.ticket_number}</span>}
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Resolution Rate Bar -- real, computed from actual ticket counts */}
      <Card hover={false}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-cyan" />
            <h3 className="text-sm font-semibold text-text-primary">Resolution Rate</h3>
          </div>
          <span className="text-lg font-bold font-mono text-cyan">{loading ? "—" : `${stats?.resolutionRate ?? 0}%`}</span>
        </div>
        <div className="h-2 rounded-full bg-border overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${stats?.resolutionRate ?? 0}%` }} transition={{ duration: 1.2, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-cyan to-violet" />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[11px] text-text-muted">0%</span>
          <span className="text-[11px] text-text-muted">{stats?.total ? `${stats.total} total tickets` : "No tickets yet"}</span>
          <span className="text-[11px] text-text-muted">100%</span>
        </div>
      </Card>
    </div>
  );
}
