"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MessageSquare, User, AlertTriangle, CheckCircle, Send, Loader2 } from "lucide-react";
import Link from "next/link";
import { Card, Button, Textarea, EmptyState } from "@/components/ui";
import { cn, formatRelativeTime, getTicketStatusColor, getTicketPriorityColor, getTicketTypeLabel } from "@/lib/utils";
import type { TicketStatus, TicketPriority, TicketType } from "@/types";

interface TicketMessage {
  id: string;
  role: "user" | "agent";
  agent_name: string | null;
  content: string;
  created_at: string;
}

interface Ticket {
  id: string;
  ticket_number: string;
  customer_name: string | null;
  customer_email: string | null;
  subject: string;
  type: TicketType;
  status: TicketStatus;
  priority: TicketPriority;
  agent_handled: string;
  order_id: string | null;
  created_at: string;
}

const AGENT_COLORS: Record<string, string> = {
  "Triage Orchestrator": "text-cyan",
  "Replacement Agent": "text-violet",
  "Returns Agent": "text-cyan",
  "Support Agent": "text-emerald",
  "Escalation Agent": "text-rose",
};

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const { id } = await params;
      setTicketId(id);
      const res = await fetch(`/api/tickets/${id}`);
      if (res.status === 404) {
        setNotFound(true);
        return;
      }
      const data = await res.json();
      setTicket(data.ticket);
      setMessages(data.messages ?? []);
    } catch (err) {
      console.error("[ticket detail] failed to load:", err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    load();
  }, [load]);

  const sendReply = async () => {
    if (!reply.trim() || sending || !ticketId) return;
    setSending(true);
    const content = reply.trim();
    setReply("");
    try {
      const res = await fetch(`/api/tickets/${ticketId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, role: "agent", agentName: "Support Agent" }),
      });
      const data = await res.json();
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
      }
    } catch (err) {
      console.error("[ticket detail] failed to send reply:", err);
    } finally {
      setSending(false);
    }
  };

  const updateStatus = async (status: TicketStatus) => {
    if (!ticket || !ticketId) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setTicket((prev) => (prev ? { ...prev, status } : prev));
      }
    } catch (err) {
      console.error("[ticket detail] failed to update status:", err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 text-cyan animate-spin" />
      </div>
    );
  }

  if (notFound || !ticket) {
    return (
      <div className="max-w-2xl mx-auto py-10">
        <EmptyState
          icon={<AlertTriangle className="h-6 w-6" />}
          title="Ticket not found"
          description="This ticket doesn't exist, or the database isn't connected. Try going back to the tickets list."
        />
        <div className="text-center mt-4">
          <Link href="/tickets" className="text-cyan text-sm hover:underline">Back to Tickets</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/tickets" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors mb-4">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Tickets
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-mono text-text-muted">{ticket.ticket_number}</span>
              <span className={cn("badge text-[10px]", getTicketStatusColor(ticket.status))}>{ticket.status.replace("_", " ")}</span>
              <span className={cn("badge text-[10px]", getTicketPriorityColor(ticket.priority))}>{ticket.priority}</span>
            </div>
            <h1 className="text-xl font-bold text-text-primary">{ticket.subject}</h1>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <Card hover={false} className="p-0 overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
              <MessageSquare className="h-4 w-4 text-cyan" />
              <h2 className="text-sm font-semibold text-text-primary">Conversation</h2>
              <span className="text-xs text-text-muted ml-auto">{messages.length} messages</span>
            </div>
            <div className="p-5 space-y-5 max-h-[480px] overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-sm text-text-muted text-center py-8">No messages yet on this ticket.</p>
              ) : (
                messages.map((msg, i) => (
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
                    <div className={cn("h-7 w-7 rounded-lg flex-shrink-0 flex items-center justify-center text-[10px] font-bold border",
                      msg.role === "user" ? "bg-violet/10 border-violet/20 text-violet" : "bg-cyan/10 border-cyan/20 text-cyan")}>
                      {msg.role === "user" ? "C" : "AI"}
                    </div>
                    <div className={cn("max-w-[80%] space-y-1", msg.role === "user" ? "items-end" : "items-start", "flex flex-col")}>
                      {msg.role === "agent" && msg.agent_name && (
                        <span className={cn("text-[10px] font-semibold ml-1", AGENT_COLORS[msg.agent_name] ?? "text-cyan")}>{msg.agent_name}</span>
                      )}
                      <div className={msg.role === "user" ? "chat-bubble-user" : "chat-bubble-agent"}>
                        <p className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      </div>
                      <span className="text-[10px] text-text-disabled ml-1">{formatRelativeTime(msg.created_at)}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
            <div className="px-5 py-4 border-t border-border">
              <Textarea value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Type a reply..." rows={3} />
              <div className="flex justify-end mt-3">
                <Button onClick={sendReply} loading={sending} disabled={!reply.trim()} icon={<Send className="h-4 w-4" />} size="sm">
                  Send Reply
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card hover={false} className="p-4">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
              <User className="h-3.5 w-3.5" /> Customer
            </h3>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-text-primary">{ticket.customer_name || "Anonymous visitor"}</p>
              <p className="text-xs text-text-muted">{ticket.customer_email || "No email captured (anonymous chat)"}</p>
            </div>
          </Card>

          <Card hover={false} className="p-4">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
              <AlertTriangle className="h-3.5 w-3.5" /> Details
            </h3>
            <div className="space-y-3">
              {[
                { label: "Type", value: getTicketTypeLabel(ticket.type) },
                { label: "Order", value: ticket.order_id || "Not linked" },
                { label: "Agent", value: ticket.agent_handled },
                { label: "Created", value: formatRelativeTime(ticket.created_at) },
              ].map((d) => (
                <div key={d.label} className="flex items-center justify-between">
                  <span className="text-xs text-text-muted">{d.label}</span>
                  <span className="text-xs font-medium text-text-primary">{d.value}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card hover={false} className="p-4">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
              <CheckCircle className="h-3.5 w-3.5" /> Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => updateStatus("resolved")}
                disabled={updatingStatus || ticket.status === "resolved"}
                className="w-full btn-secondary text-xs py-2 disabled:opacity-50"
              >
                {ticket.status === "resolved" ? "Already Resolved" : "Mark as Resolved"}
              </button>
              <button
                onClick={() => updateStatus("escalated")}
                disabled={updatingStatus || ticket.status === "escalated"}
                className="w-full btn-ghost text-xs py-2 text-rose hover:bg-rose/10 disabled:opacity-50"
              >
                {ticket.status === "escalated" ? "Already Escalated" : "Escalate Ticket"}
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
