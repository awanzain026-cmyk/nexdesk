"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MessageSquare, Clock, User, Package, AlertTriangle, CheckCircle, Send } from "lucide-react";
import Link from "next/link";
import { Badge, Card, Button, Textarea } from "@/components/ui";
import { cn, formatRelativeTime, getTicketStatusColor, getTicketPriorityColor } from "@/lib/utils";

const MOCK_TICKET = {
  id: "t1", ticket_number: "TKT-A3X9",
  customer_name: "Sarah Chen", customer_email: "sarah.chen@email.com",
  subject: "iPhone 15 Pro screen flickering after 2 weeks of use",
  type: "warranty" as const, status: "open" as const, priority: "high" as const,
  agent_handled: "Replacement Agent",
  created_at: new Date(Date.now() - 12 * 60000).toISOString(),
  order_id: "ORD-X9K2M1",
  messages: [
    { id: "m1", role: "user" as const, content: "Hi, I purchased an iPhone 15 Pro Max about 2 weeks ago and the screen has started flickering randomly. It happens about 3-4 times a day and lasts for a few seconds each time. I haven't dropped it or exposed it to water. Order #ORD-X9K2M1.", agent_name: null, created_at: new Date(Date.now() - 12 * 60000).toISOString() },
    { id: "m2", role: "agent" as const, content: "Hello Sarah! I'm sorry to hear about the screen flickering issue with your iPhone 15 Pro Max. This is definitely not normal behavior and I want to get this resolved for you quickly.\n\nBased on your description, this appears to be a manufacturing defect covered under Apple's 1-year warranty. I'm escalating this to our Replacement Agent who will process a replacement for you.\n\nCould you please confirm: Is the flickering affecting the entire screen or just a portion of it?", agent_name: "Triage Orchestrator", created_at: new Date(Date.now() - 11 * 60000).toISOString() },
    { id: "m3", role: "user" as const, content: "It's the entire screen. It goes completely white for about 2-3 seconds then comes back to normal. It's very disruptive especially when I'm working.", agent_name: null, created_at: new Date(Date.now() - 10 * 60000).toISOString() },
    { id: "m4", role: "agent" as const, content: "Thank you for the details, Sarah. A full-screen white flash is a known hardware defect and is absolutely covered under warranty.\n\n✅ I've approved a replacement iPhone 15 Pro Max for you.\n📦 Reference: REP-1234567890\n🚚 Your replacement will ship within 2-3 business days\n📬 We'll send a prepaid return label for the defective unit\n\nYou don't need to worry about anything — just use your phone normally until the replacement arrives. Is there anything else I can help you with?", agent_name: "Replacement Agent", created_at: new Date(Date.now() - 8 * 60000).toISOString() },
  ],
};

const AGENT_COLORS: Record<string, string> = {
  "Triage Orchestrator": "text-cyan",
  "Replacement Agent":   "text-violet",
  "Returns Agent":       "text-cyan",
  "Support Agent":       "text-emerald",
  "Escalation Agent":    "text-rose",
};

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const [reply, setReply] = useState("");
  const [messages, setMessages] = useState(MOCK_TICKET.messages);

  const sendReply = () => {
    if (!reply.trim()) return;
    setMessages(prev => [...prev, {
      id: `m${Date.now()}`, role: "user" as const, content: reply,
      agent_name: null, created_at: new Date().toISOString(),
    }]);
    setReply("");
  };

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Back + Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/tickets" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors mb-4">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Tickets
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono text-text-muted">{MOCK_TICKET.ticket_number}</span>
              <span className={cn("badge text-[10px]", getTicketStatusColor(MOCK_TICKET.status))}>{MOCK_TICKET.status}</span>
              <span className={cn("badge text-[10px]", getTicketPriorityColor(MOCK_TICKET.priority))}>{MOCK_TICKET.priority}</span>
            </div>
            <h1 className="text-xl font-bold text-text-primary">{MOCK_TICKET.subject}</h1>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Messages */}
        <div className="lg:col-span-2 space-y-4">
          <Card hover={false} className="p-0 overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
              <MessageSquare className="h-4 w-4 text-cyan" />
              <h2 className="text-sm font-semibold text-text-primary">Conversation</h2>
              <span className="text-xs text-text-muted ml-auto">{messages.length} messages</span>
            </div>
            <div className="p-5 space-y-5 max-h-[480px] overflow-y-auto">
              {messages.map((msg, i) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
                  <div className={cn("h-7 w-7 rounded-lg flex-shrink-0 flex items-center justify-center text-[10px] font-bold border",
                    msg.role === "user" ? "bg-violet/10 border-violet/20 text-violet" : "bg-cyan/10 border-cyan/20 text-cyan")}>
                    {msg.role === "user" ? "SC" : "AI"}
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
              ))}
            </div>
            {/* Reply */}
            <div className="px-5 py-4 border-t border-border">
              <Textarea value={reply} onChange={e => setReply(e.target.value)} placeholder="Type a reply..." rows={3} />
              <div className="flex justify-end mt-3">
                <Button onClick={sendReply} disabled={!reply.trim()} icon={<Send className="h-4 w-4" />} size="sm">
                  Send Reply
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Details */}
        <div className="space-y-4">
          {/* Customer */}
          <Card hover={false} className="p-4">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
              <User className="h-3.5 w-3.5" /> Customer
            </h3>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-text-primary">{MOCK_TICKET.customer_name}</p>
              <p className="text-xs text-text-muted">{MOCK_TICKET.customer_email}</p>
            </div>
          </Card>

          {/* Ticket Info */}
          <Card hover={false} className="p-4">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
              <AlertTriangle className="h-3.5 w-3.5" /> Details
            </h3>
            <div className="space-y-3">
              {[
                { label: "Type", value: MOCK_TICKET.type },
                { label: "Order", value: MOCK_TICKET.order_id },
                { label: "Agent", value: MOCK_TICKET.agent_handled },
                { label: "Created", value: formatRelativeTime(MOCK_TICKET.created_at) },
              ].map(d => (
                <div key={d.label} className="flex items-center justify-between">
                  <span className="text-xs text-text-muted">{d.label}</span>
                  <span className="text-xs font-medium text-text-primary">{d.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Actions */}
          <Card hover={false} className="p-4">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
              <CheckCircle className="h-3.5 w-3.5" /> Actions
            </h3>
            <div className="space-y-2">
              <button className="w-full btn-secondary text-xs py-2">Mark as Resolved</button>
              <button className="w-full btn-ghost text-xs py-2 text-rose hover:bg-rose/10">Escalate Ticket</button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
