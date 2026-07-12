"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Ticket, Clock, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { Card, Input, EmptyState } from "@/components/ui";
import { cn, formatRelativeTime, getTicketStatusColor, getTicketPriorityColor, getTicketTypeLabel } from "@/lib/utils";
import type { TicketStatus, TicketPriority, TicketType } from "@/types";
import Link from "next/link";

interface RealTicket {
  id: string;
  ticket_number: string;
  customer_name: string | null;
  customer_email: string | null;
  subject: string;
  type: string;
  status: string;
  priority: string;
  agent_handled: string;
  created_at: string;
}

const STATUS_FILTERS = [
  { label: "All", value: "all" },
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in_progress" },
  { label: "Resolved", value: "resolved" },
  { label: "Escalated", value: "escalated" },
  { label: "Closed", value: "closed" },
];

export default function TicketsPage() {
  const [tickets, setTickets] = useState<RealTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tickets-list");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setTickets(data.tickets ?? []);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = tickets.filter(t => {
    const matchSearch = !search ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      (t.customer_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      t.ticket_number.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    open:       tickets.filter(t => t.status === "open").length,
    inProgress: tickets.filter(t => t.status === "in_progress").length,
    escalated:  tickets.filter(t => t.status === "escalated").length,
    resolved:   tickets.filter(t => t.status === "resolved").length,
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Tickets</h1>
          <p className="text-sm text-text-muted mt-0.5">
            {loading ? "Loading..." : error ? "Error loading" : `${tickets.length} total support requests`}
          </p>
        </div>
        <button onClick={load} className="btn-ghost text-xs gap-1.5 flex items-center">
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} /> Refresh
        </button>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Open",        value: counts.open,       icon: <Ticket className="h-4 w-4" />,        color: "text-cyan",    bg: "bg-cyan/10 border-cyan/20" },
          { label: "In Progress", value: counts.inProgress, icon: <Clock className="h-4 w-4" />,         color: "text-amber",   bg: "bg-amber/10 border-amber/20" },
          { label: "Escalated",   value: counts.escalated,  icon: <AlertTriangle className="h-4 w-4" />, color: "text-rose",    bg: "bg-rose/10 border-rose/20" },
          { label: "Resolved",    value: counts.resolved,   icon: <CheckCircle className="h-4 w-4" />,   color: "text-emerald", bg: "bg-emerald/10 border-emerald/20" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={cn("flex items-center gap-3 p-4 rounded-xl border", s.bg)}>
            <div className={s.color}>{s.icon}</div>
            <div>
              <p className="text-xl font-bold font-mono text-text-primary">{loading ? "—" : s.value}</p>
              <p className="text-[11px] text-text-muted">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <Card hover={false} className="p-0 overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-border">
          <Input placeholder="Search tickets..." icon={<Search className="h-4 w-4" />}
            value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs" />
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

        <div className="hidden lg:grid grid-cols-12 gap-4 px-5 py-3 border-b border-border bg-raised/30">
          {[["Ticket","col-span-1"],["Subject","col-span-3"],["Customer","col-span-2"],["Type","col-span-1"],["Priority","col-span-1"],["Status","col-span-1"],["Agent","col-span-2"],["Time","col-span-1"]].map((item) => (
            <div key={item[0]} className={cn("text-[11px] font-semibold uppercase tracking-wider text-text-muted", item[1])}>{item[0]}</div>
          ))}
        </div>

        <div>
          {loading ? (
            <div className="p-5 space-y-3">
              {[1,2,3,4,5].map(i => <div key={i} className="skeleton h-14 w-full" />)}
            </div>
          ) : error ? (
            <div className="p-10 text-center">
              <p className="text-sm text-rose mb-2">Failed to load tickets</p>
              <p className="text-xs text-text-muted mb-4 font-mono">{error}</p>
              <button onClick={load} className="btn-secondary text-xs">Retry</button>
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<Ticket className="h-6 w-6" />}
              title={tickets.length === 0 ? "No tickets yet" : "No tickets match your filter"}
              description={tickets.length === 0 ? "Start a chat to create your first ticket automatically." : "Try adjusting your search or filter."}
              action={tickets.length === 0 ? <Link href="/chat" className="btn-primary text-xs px-4 py-2">Open Chat</Link> : undefined}
            />
          ) : (
            filtered.map((ticket, i) => (
              <Link key={ticket.id} href={`/tickets/${ticket.id}`}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                  className="px-5 py-3.5 border-b border-border/50 last:border-0 hover:bg-raised/40 transition-colors cursor-pointer">
                  <div className="lg:hidden">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono text-text-muted">{ticket.ticket_number}</span>
                      <span className={cn("badge text-[10px]", getTicketPriorityColor(ticket.priority as TicketPriority))}>{ticket.priority}</span>
                      <span className={cn("badge text-[10px]", getTicketStatusColor(ticket.status as TicketStatus))}>{ticket.status.replace("_"," ")}</span>
                    </div>
                    <p className="text-sm text-text-primary truncate">{ticket.subject}</p>
                    <p className="text-xs text-text-muted mt-0.5">{ticket.customer_name ?? "Anonymous"} · {formatRelativeTime(ticket.created_at)}</p>
                  </div>
                  <div className="hidden lg:grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1"><span className="text-[10px] font-mono text-text-muted">{ticket.ticket_number}</span></div>
                    <div className="col-span-3"><p className="text-sm text-text-primary truncate">{ticket.subject}</p></div>
                    <div className="col-span-2">
                      <p className="text-xs text-text-secondary truncate">{ticket.customer_name ?? "Anonymous"}</p>
                      {ticket.customer_email && <p className="text-[10px] text-text-muted truncate">{ticket.customer_email}</p>}
                    </div>
                    <div className="col-span-1"><span className="badge badge-gray text-[10px]">{getTicketTypeLabel(ticket.type as TicketType)}</span></div>
                    <div className="col-span-1"><span className={cn("badge text-[10px]", getTicketPriorityColor(ticket.priority as TicketPriority))}>{ticket.priority}</span></div>
                    <div className="col-span-1"><span className={cn("badge text-[10px]", getTicketStatusColor(ticket.status as TicketStatus))}>{ticket.status.replace("_"," ")}</span></div>
                    <div className="col-span-2"><p className="text-[11px] text-text-muted truncate">{ticket.agent_handled}</p></div>
                    <div className="col-span-1"><p className="text-[10px] text-text-disabled">{formatRelativeTime(ticket.created_at)}</p></div>
                  </div>
                </motion.div>
              </Link>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
