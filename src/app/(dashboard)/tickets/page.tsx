"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Ticket, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { Badge, Card, Input, EmptyState } from "@/components/ui";
import { cn, formatRelativeTime, getTicketStatusColor, getTicketPriorityColor, getTicketTypeLabel } from "@/lib/utils";
import type { TicketStatus, TicketPriority, TicketType } from "@/types";

const MOCK_TICKETS = [
  { id: "t1", ticket_number: "TKT-A3X9", customer_name: "Sarah Chen", customer_email: "sarah@email.com", subject: "iPhone 15 Pro screen flickering after 2 weeks", type: "warranty" as TicketType, status: "open" as TicketStatus, priority: "high" as TicketPriority, agent_handled: "Replacement Agent", created_at: new Date(Date.now() - 12 * 60000).toISOString() },
  { id: "t2", ticket_number: "TKT-B7K2", customer_name: "Marcus Williams", customer_email: "marcus@email.com", subject: "Return request for MacBook Air M3 - Changed mind", type: "return" as TicketType, status: "in_progress" as TicketStatus, priority: "medium" as TicketPriority, agent_handled: "Returns Agent", created_at: new Date(Date.now() - 35 * 60000).toISOString() },
  { id: "t3", ticket_number: "TKT-C1M5", customer_name: "Aisha Patel", customer_email: "aisha@email.com", subject: "Galaxy S24 Ultra order tracking not updating", type: "tracking" as TicketType, status: "resolved" as TicketStatus, priority: "low" as TicketPriority, agent_handled: "Support Agent", created_at: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: "t4", ticket_number: "TKT-D4R8", customer_name: "James O'Brien", customer_email: "james@email.com", subject: "Sony WH-1000XM5 won't pair with new laptop", type: "general" as TicketType, status: "open" as TicketStatus, priority: "medium" as TicketPriority, agent_handled: "Support Agent", created_at: new Date(Date.now() - 4 * 3600000).toISOString() },
  { id: "t5", ticket_number: "TKT-E9P3", customer_name: "Fatima Al-Rashid", customer_email: "fatima@email.com", subject: "AirPods Pro 2 warranty claim - crackling noise", type: "warranty" as TicketType, status: "escalated" as TicketStatus, priority: "urgent" as TicketPriority, agent_handled: "Escalation Agent", created_at: new Date(Date.now() - 6 * 3600000).toISOString() },
  { id: "t6", ticket_number: "TKT-F2X1", customer_name: "David Kim", customer_email: "david@email.com", subject: "What is the return policy for opened products?", type: "general" as TicketType, status: "resolved" as TicketStatus, priority: "low" as TicketPriority, agent_handled: "Policy Agent", created_at: new Date(Date.now() - 8 * 3600000).toISOString() },
  { id: "t7", ticket_number: "TKT-G5K3", customer_name: "Luna Zhang", customer_email: "luna@email.com", subject: "Dell XPS 15 replacement - dead pixels on display", type: "replacement" as TicketType, status: "in_progress" as TicketStatus, priority: "high" as TicketPriority, agent_handled: "Replacement Agent", created_at: new Date(Date.now() - 10 * 3600000).toISOString() },
  { id: "t8", ticket_number: "TKT-H8R2", customer_name: "Omar Hassan", customer_email: "omar@email.com", subject: "Comparing iPhone 15 PM vs Galaxy S24 Ultra specs", type: "general" as TicketType, status: "closed" as TicketStatus, priority: "low" as TicketPriority, agent_handled: "Catalog Agent", created_at: new Date(Date.now() - 24 * 3600000).toISOString() },
];

const STATUS_FILTERS: { label: string; value: TicketStatus | "all" }[] = [
  { label: "All", value: "all" }, { label: "Open", value: "open" }, { label: "In Progress", value: "in_progress" },
  { label: "Resolved", value: "resolved" }, { label: "Escalated", value: "escalated" }, { label: "Closed", value: "closed" },
];

export default function TicketsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");

  const filtered = MOCK_TICKETS.filter(t => {
    const matchesSearch = !search || t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.customer_name.toLowerCase().includes(search.toLowerCase()) || t.ticket_number.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    open: MOCK_TICKETS.filter(t => t.status === "open").length,
    inProgress: MOCK_TICKETS.filter(t => t.status === "in_progress").length,
    escalated: MOCK_TICKETS.filter(t => t.status === "escalated").length,
    resolved: MOCK_TICKETS.filter(t => t.status === "resolved").length,
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Tickets</h1>
          <p className="text-sm text-text-muted mt-0.5">{MOCK_TICKETS.length} total support requests</p>
        </div>
      </motion.div>

      {/* Mini Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Open", value: stats.open, icon: <Ticket className="h-4 w-4" />, color: "text-cyan", bg: "bg-cyan/10 border-cyan/20" },
          { label: "In Progress", value: stats.inProgress, icon: <Clock className="h-4 w-4" />, color: "text-amber", bg: "bg-amber/10 border-amber/20" },
          { label: "Escalated", value: stats.escalated, icon: <AlertTriangle className="h-4 w-4" />, color: "text-rose", bg: "bg-rose/10 border-rose/20" },
          { label: "Resolved", value: stats.resolved, icon: <CheckCircle className="h-4 w-4" />, color: "text-emerald", bg: "bg-emerald/10 border-emerald/20" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={cn("flex items-center gap-3 p-4 rounded-xl border", s.bg)}>
            <div className={s.color}>{s.icon}</div>
            <div>
              <p className="text-xl font-bold font-mono text-text-primary">{s.value}</p>
              <p className="text-[11px] text-text-muted">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <Card hover={false} className="p-0 overflow-hidden">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-border">
          <Input placeholder="Search tickets..." icon={<Search className="h-4 w-4" />} value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs" />
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {STATUS_FILTERS.map(f => (
              <button key={f.value} onClick={() => setStatusFilter(f.value)}
                className={cn("px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer",
                  statusFilter === f.value ? "bg-cyan/10 text-cyan border border-cyan/20" : "text-text-muted hover:text-text-primary hover:bg-raised")}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table Header -- desktop only */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-border bg-raised/30">
          {["Ticket", "Subject", "Customer", "Type", "Priority", "Status", "Agent", "Time"].map((h, i) => (
            <div key={h} className={cn("text-[11px] font-semibold uppercase tracking-wider text-text-muted", i === 0 ? "col-span-1" : i === 1 ? "col-span-3" : i === 2 ? "col-span-2" : "col-span-1")}>
              {h}
            </div>
          ))}
        </div>

        {/* Rows */}
        <div>
          {filtered.length === 0 ? (
            <EmptyState icon={<Ticket className="h-6 w-6" />} title="No tickets found" description="Try adjusting your search or filters" />
          ) : (
            filtered.map((ticket, i) => (
              <motion.div key={ticket.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="border-b border-border/50 last:border-0 hover:bg-raised/40 transition-colors cursor-pointer">

                {/* Desktop row */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3.5 items-center">
                  <div className="col-span-1">
                    <span className="text-[10px] font-mono text-text-muted">{ticket.ticket_number}</span>
                  </div>
                  <div className="col-span-3">
                    <p className="text-sm text-text-primary truncate">{ticket.subject}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-text-secondary truncate">{ticket.customer_name}</p>
                    <p className="text-[10px] text-text-muted truncate">{ticket.customer_email}</p>
                  </div>
                  <div className="col-span-1">
                    <span className="badge badge-gray text-[10px]">{getTicketTypeLabel(ticket.type)}</span>
                  </div>
                  <div className="col-span-1">
                    <span className={cn("badge text-[10px]", getTicketPriorityColor(ticket.priority))}>{ticket.priority}</span>
                  </div>
                  <div className="col-span-1">
                    <span className={cn("badge text-[10px]", getTicketStatusColor(ticket.status))}>{ticket.status.replace("_", " ")}</span>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[11px] text-text-muted truncate">{ticket.agent_handled}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="text-[10px] text-text-disabled whitespace-nowrap">{formatRelativeTime(ticket.created_at)}</p>
                  </div>
                </div>

                {/* Mobile card */}
                <div className="md:hidden px-4 py-3.5 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono text-text-muted">{ticket.ticket_number}</span>
                    <span className="text-[10px] text-text-disabled whitespace-nowrap">{formatRelativeTime(ticket.created_at)}</span>
                  </div>
                  <p className="text-sm text-text-primary leading-snug">{ticket.subject}</p>
                  <p className="text-xs text-text-secondary">{ticket.customer_name} <span className="text-text-muted">· {ticket.customer_email}</span></p>
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="badge badge-gray text-[10px]">{getTicketTypeLabel(ticket.type)}</span>
                    <span className={cn("badge text-[10px]", getTicketPriorityColor(ticket.priority))}>{ticket.priority}</span>
                    <span className={cn("badge text-[10px]", getTicketStatusColor(ticket.status))}>{ticket.status.replace("_", " ")}</span>
                  </div>
                  <p className="text-[11px] text-text-muted">Handled by {ticket.agent_handled}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
