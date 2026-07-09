"use client";
import { motion } from "framer-motion";
import { StatCard, Badge, Card } from "@/components/ui";
import { Ticket, CheckCircle, Clock, Star, TrendingUp, Zap, ArrowRight, MessageSquare } from "lucide-react";
import Link from "next/link";
import { cn, formatRelativeTime, getTicketStatusColor, getTicketPriorityColor } from "@/lib/utils";
import { useState, useEffect } from "react";
import type { AgentName } from "@/types";

const MOCK_STATS = { total: 142, open: 23, resolved: 11, satisfaction: 4.8, resolution: 94, delta_tickets: -12, delta_satisfaction: 5 };

const MOCK_TICKETS = [
  { id: "t1", ticket_number: "TKT-A3X9", customer_name: "Sarah Chen", subject: "iPhone 15 Pro screen flickering", type: "warranty" as const, status: "open" as const, priority: "high" as const, created_at: new Date(Date.now() - 12 * 60000).toISOString(), agent_handled: "Replacement Agent" as AgentName },
  { id: "t2", ticket_number: "TKT-B7K2", customer_name: "Marcus Williams", subject: "Return request for MacBook Air M3", type: "return" as const, status: "in_progress" as const, priority: "medium" as const, created_at: new Date(Date.now() - 35 * 60000).toISOString(), agent_handled: "Returns Agent" as AgentName },
  { id: "t3", ticket_number: "TKT-C1M5", customer_name: "Aisha Patel", subject: "Where is my Galaxy S24 Ultra order?", type: "tracking" as const, status: "resolved" as const, priority: "low" as const, created_at: new Date(Date.now() - 2 * 3600000).toISOString(), agent_handled: "Support Agent" as AgentName },
  { id: "t4", ticket_number: "TKT-D4R8", customer_name: "James O'Brien", subject: "Sony WH-1000XM5 not pairing", type: "general" as const, status: "open" as const, priority: "medium" as const, created_at: new Date(Date.now() - 4 * 3600000).toISOString(), agent_handled: "Support Agent" as AgentName },
  { id: "t5", ticket_number: "TKT-E9P3", customer_name: "Fatima Al-Rashid", subject: "Warranty claim - AirPods Pro 2", type: "warranty" as const, status: "escalated" as const, priority: "urgent" as const, created_at: new Date(Date.now() - 6 * 3600000).toISOString(), agent_handled: "Escalation Agent" as AgentName },
];

const AGENT_COLORS: Record<string, string> = {
  "Triage Orchestrator": "text-cyan",
  "Support Agent":       "text-violet",
  "Inventory Agent":     "text-amber",
  "Catalog Agent":       "text-emerald",
  "Policy Agent":        "text-rose",
  "Returns Agent":       "text-cyan",
  "Replacement Agent":   "text-violet",
  "Escalation Agent":    "text-rose",
};

interface AgentFeedItem { id: string; agent: AgentName; action: string; ticket: string; time: string; }

const INITIAL_FEED: AgentFeedItem[] = [
  { id: "f1", agent: "Triage Orchestrator", action: "Routed ticket to Returns Agent", ticket: "TKT-B7K2", time: "just now" },
  { id: "f2", agent: "Replacement Agent",   action: "Approved replacement request",  ticket: "TKT-A3X9", time: "2m ago" },
  { id: "f3", agent: "Support Agent",       action: "Resolved tracking inquiry",     ticket: "TKT-C1M5", time: "5m ago" },
  { id: "f4", agent: "Policy Agent",        action: "Explained return eligibility",  ticket: "TKT-F2X1", time: "8m ago" },
  { id: "f5", agent: "Escalation Agent",    action: "Escalated warranty complaint",  ticket: "TKT-E9P3", time: "12m ago" },
];

const NEW_FEED_ITEMS: AgentFeedItem[] = [
  { id: "f6", agent: "Inventory Agent",     action: "Checked stock for iPhone 15 PM", ticket: "TKT-G5K3", time: "just now" },
  { id: "f7", agent: "Catalog Agent",       action: "Compared MacBook vs ThinkPad",  ticket: "TKT-H8R2", time: "just now" },
  { id: "f8", agent: "Returns Agent",       action: "Initiated refund process",       ticket: "TKT-I1M7", time: "just now" },
];

export default function DashboardPage() {
  const [feed, setFeed] = useState<AgentFeedItem[]>(INITIAL_FEED);
  const [activeIdx, setActiveIdx] = useState(0);

  // Simulate live agent feed
  useEffect(() => {
    const interval = setInterval(() => {
      const newItem = NEW_FEED_ITEMS[Math.floor(Math.random() * NEW_FEED_ITEMS.length)];
      setFeed(prev => [{ ...newItem, id: Math.random().toString(36).slice(2), time: "just now" }, ...prev].slice(0, 8));
      setActiveIdx(0);
      setTimeout(() => setActiveIdx(-1), 2000);
    }, 4000);
    return () => clearInterval(interval);
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
        <StatCard label="Total Tickets" value={MOCK_STATS.total} delta={MOCK_STATS.delta_tickets} icon={<Ticket className="h-5 w-5" />} color="cyan" />
        <StatCard label="Open Tickets"  value={MOCK_STATS.open}  icon={<Clock className="h-5 w-5" />} color="amber" />
        <StatCard label="Resolved Today" value={MOCK_STATS.resolved} icon={<CheckCircle className="h-5 w-5" />} color="green" />
        <StatCard label="Satisfaction"  value={`${MOCK_STATS.satisfaction}/5`} delta={MOCK_STATS.delta_satisfaction} icon={<Star className="h-5 w-5" />} color="violet" />
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
              {MOCK_TICKETS.map((ticket, i) => (
                <motion.div key={ticket.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 px-5 py-3.5 border-b border-border/50 last:border-0 hover:bg-raised/50 transition-colors cursor-pointer group">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono text-text-muted">{ticket.ticket_number}</span>
                      <Badge variant={ticket.priority === "urgent" ? "rose" : ticket.priority === "high" ? "amber" : "gray"} className="text-[10px]">{ticket.priority}</Badge>
                    </div>
                    <p className="text-sm font-medium text-text-primary truncate group-hover:text-cyan transition-colors">{ticket.subject}</p>
                    <p className="text-xs text-text-muted mt-0.5">{ticket.customer_name} · {formatRelativeTime(ticket.created_at)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <span className={cn("badge text-[10px]", getTicketStatusColor(ticket.status))}>{ticket.status.replace("_", " ")}</span>
                    {ticket.agent_handled && (
                      <span className={cn("text-[10px] font-medium", AGENT_COLORS[ticket.agent_handled] ?? "text-text-muted")}>{ticket.agent_handled}</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* Live Agent Feed */}
        <div>
          <Card hover={false} className="p-0 overflow-hidden h-full">
            <div className="flex items-center justify-between px-4 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-text-primary">Live Agent Feed</h2>
              <div className="flex items-center gap-1.5">
                <span className="status-dot online animate-pulse" />
                <span className="text-[10px] text-emerald font-medium">Live</span>
              </div>
            </div>
            <div className="p-3 space-y-2 overflow-y-auto max-h-[400px]">
              {feed.map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={cn("rounded-lg p-3 border transition-all duration-500", i === 0 && activeIdx === 0 ? "bg-cyan/5 border-cyan/15" : "bg-raised/30 border-border/50")}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn("text-[10px] font-semibold", AGENT_COLORS[item.agent] ?? "text-cyan")}>{item.agent}</span>
                    <span className="text-[10px] text-text-muted">{item.time}</span>
                  </div>
                  <p className="text-xs text-text-secondary">{item.action}</p>
                  <span className="text-[10px] font-mono text-text-muted mt-1 block">{item.ticket}</span>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Resolution Rate Bar */}
      <Card hover={false}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-cyan" />
            <h3 className="text-sm font-semibold text-text-primary">Resolution Rate</h3>
          </div>
          <span className="text-lg font-bold font-mono text-cyan">{MOCK_STATS.resolution}%</span>
        </div>
        <div className="h-2 rounded-full bg-border overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${MOCK_STATS.resolution}%` }} transition={{ duration: 1.2, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-cyan to-violet" />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[11px] text-text-muted">0%</span>
          <span className="text-[11px] text-text-muted">Industry avg: 78%</span>
          <span className="text-[11px] text-text-muted">100%</span>
        </div>
      </Card>
    </div>
  );
}
