"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Zap, Sparkles, ArrowLeft, MessageSquare, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { ChatMessage, AgentName } from "@/types";

const AGENT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Triage Orchestrator": { bg: "bg-cyan/10",    text: "text-cyan",    border: "border-cyan/20" },
  "Support Agent":       { bg: "bg-violet/10",  text: "text-violet",  border: "border-violet/20" },
  "Inventory Agent":     { bg: "bg-amber/10",   text: "text-amber",   border: "border-amber/20" },
  "Catalog Agent":       { bg: "bg-emerald/10", text: "text-emerald", border: "border-emerald/20" },
  "Policy Agent":        { bg: "bg-rose/10",    text: "text-rose",    border: "border-rose/20" },
  "Returns Agent":       { bg: "bg-cyan/10",    text: "text-cyan",    border: "border-cyan/20" },
  "Replacement Agent":   { bg: "bg-violet/10",  text: "text-violet",  border: "border-violet/20" },
  "Escalation Agent":    { bg: "bg-rose/10",    text: "text-rose",    border: "border-rose/20" },
};

const QUICK_PROMPTS = [
  "I want to return a product",
  "My item arrived damaged",
  "Is the iPhone 15 Pro Max in stock?",
  "What is your return policy?",
  "Where is my order?",
  "Compare iPhone 15 vs Samsung Galaxy S24 Ultra",
];

export default function SupportPage() {
  // Step: "intro" | "chat"
  const [step, setStep] = useState<"intro" | "chat">("intro");

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [emailErr, setEmailErr] = useState("");

  // Past tickets for returning customers
  const [pastTickets, setPastTickets] = useState<{id:string;ticket_number:string;subject:string;status:string}[]>([]);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<AgentName | null>(null);
  const [offTopicCount, setOffTopicCount] = useState(0);
  const [ticketId, setTicketId] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const emailTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Debounced email history check - does NOT affect button click
  const onEmailChange = useCallback((val: string) => {
    setEmail(val);
    setEmailErr("");
    if (emailTimerRef.current) clearTimeout(emailTimerRef.current);
    if (!val.includes("@")) return;
    emailTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/customer-history?email=${encodeURIComponent(val)}`);
        if (res.ok) {
          const data = await res.json();
          setPastTickets(data.tickets ?? []);
        }
      } catch {}
    }, 800);
  }, []);

  // Button handler - completely synchronous validation then switch step
  const handleStartChat = useCallback(() => {
    let ok = true;
    if (!name.trim()) { setNameErr("Please enter your name"); ok = false; }
    else setNameErr("");
    if (!email.trim() || !email.includes("@")) { setEmailErr("Please enter a valid email"); ok = false; }
    else setEmailErr("");
    if (!ok) return;
    // Switch immediately - no async, no awaiting
    setStep("chat");
  }, [name, email]);

  const sendMessage = useCallback(async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    if (!text) setInput("");

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).slice(2),
      role: "user", content,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          history: messages,
          offTopicCount,
          ticketId,
          currentAgent,
          customerName: name,
          customerEmail: email,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMessages(prev => [...prev, {
        id: Math.random().toString(36).slice(2),
        role: "assistant",
        content: data.response,
        agentName: data.agentName,
        timestamp: new Date().toISOString(),
      }]);
      setCurrentAgent(data.agentName ?? null);
      setOffTopicCount(data.offTopicCount ?? 0);
      if (data.ticketId) setTicketId(data.ticketId);
    } catch {
      setMessages(prev => [...prev, {
        id: Math.random().toString(36).slice(2),
        role: "assistant",
        content: "I am having trouble connecting. Please try again in a moment.",
        agentName: "Support Agent" as AgentName,
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [input, loading, messages, offTopicCount, ticketId, currentAgent, name, email]);

  const agentColor = currentAgent ? (AGENT_COLORS[currentAgent] ?? AGENT_COLORS["Support Agent"]) : AGENT_COLORS["Support Agent"];

  // ─── INTRO ──────────────────────────────────────────────────────────────────
  if (step === "intro") {
    return (
      <div style={{ minHeight: "100dvh" }} className="flex flex-col bg-void">
        <nav className="flex-shrink-0 glass border-b border-border/50 px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-cyan to-violet flex items-center justify-center">
              <Zap className="h-3.5 w-3.5 text-void" />
            </div>
            <span className="font-bold text-text-primary text-sm">TechVault Support</span>
          </div>
          <Link href="/" className="flex items-center gap-1 text-xs text-text-muted hover:text-text-primary transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </Link>
        </nav>

        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan/20 to-violet/20 border border-cyan/20 mb-4">
                <MessageSquare className="h-7 w-7 text-cyan" />
              </div>
              <h1 className="text-2xl font-bold text-text-primary">How can we help?</h1>
              <p className="text-sm text-text-muted mt-2">AI support team — responds instantly, 24/7</p>
            </div>

            <div className="card-static rounded-2xl p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">
                  Your Name <span className="text-rose">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => { setName(e.target.value); setNameErr(""); }}
                  onKeyDown={e => { if (e.key === "Enter") handleStartChat(); }}
                  placeholder="Enter your full name"
                  autoFocus
                  className={cn("input-field", nameErr && "border-rose/50")}
                />
                {nameErr && <p className="text-xs text-rose mt-1">{nameErr}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">
                  Email Address <span className="text-rose">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => onEmailChange(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") handleStartChat(); }}
                  placeholder="your@email.com"
                  className={cn("input-field", emailErr && "border-rose/50")}
                />
                {emailErr && <p className="text-xs text-rose mt-1">{emailErr}</p>}

                {/* Past tickets */}
                {pastTickets.length > 0 && (
                  <div className="mt-3 p-3 rounded-lg bg-cyan/5 border border-cyan/15">
                    <p className="text-[11px] font-semibold text-cyan mb-2 flex items-center gap-1.5">
                      <Clock className="h-3 w-3" /> Welcome back! Your recent tickets:
                    </p>
                    {pastTickets.slice(0, 3).map(t => (
                      <div key={t.id} className="flex items-center gap-2 text-[11px] py-0.5">
                        <span className="font-mono text-text-muted shrink-0">{t.ticket_number}</span>
                        <span className="text-text-secondary truncate flex-1">{t.subject}</span>
                        <span className={cn("badge text-[9px] shrink-0",
                          t.status === "resolved" ? "badge-green" : t.status === "open" ? "badge-cyan" : "badge-amber")}>
                          {t.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Button - type="button" explicitly, no form wrapper issues */}
              <button
                type="button"
                onClick={handleStartChat}
                className="btn-primary w-full justify-center"
              >
                Chat with Support Agent <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 text-center">
              <p className="text-[11px] text-text-muted mb-2">8 specialized AI agents available</p>
              <div className="flex flex-wrap justify-center gap-1.5">
                {["Returns","Replacement","Warranty","Tracking","Product Info","Policy","Inventory","Escalation"].map(a => (
                  <span key={a} className="badge badge-gray text-[10px]">{a}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ─── CHAT ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ height: "100dvh" }} className="flex flex-col bg-void overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 glass border-b border-border/50 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-cyan to-violet flex items-center justify-center">
            <Zap className="h-3.5 w-3.5 text-void" />
          </div>
          <div>
            <span className="font-bold text-text-primary text-sm block">NexDesk AI</span>
            <span className={cn("text-[10px] font-medium", agentColor.text)}>
              {currentAgent ?? "Support Agent"} · Online
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {ticketId && (
            <span className="hidden sm:inline badge badge-cyan text-[10px]">#{ticketId.slice(0,8)}</span>
          )}
          <button
            type="button"
            onClick={() => { setMessages([]); setCurrentAgent(null); setTicketId(null); setOffTopicCount(0); setInput(""); }}
            className="btn-ghost text-xs"
          >
            New Chat
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        <AnimatePresence initial={false}>
          {messages.length === 0 && (
            <motion.div key="empty" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-10 text-center">
              <div className="p-4 rounded-2xl bg-cyan/10 border border-cyan/20 mb-4">
                <Sparkles className="h-8 w-8 text-cyan" />
              </div>
              <h2 className="text-lg font-bold text-text-primary mb-1">Hi {name}!</h2>
              <p className="text-sm text-text-muted max-w-xs mb-6">
                What can we help you with? Our agents handle returns, replacements, warranties and more.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                {QUICK_PROMPTS.map(p => (
                  <button key={p} type="button" onClick={() => sendMessage(p)}
                    className="text-left text-xs text-text-secondary bg-raised border border-border rounded-lg px-3 py-2.5 hover:border-cyan/30 hover:bg-cyan/5 transition-all cursor-pointer">
                    {p}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {messages.map(msg => {
            const isUser = msg.role === "user";
            const ac = msg.agentName ? (AGENT_COLORS[msg.agentName] ?? AGENT_COLORS["Support Agent"]) : AGENT_COLORS["Support Agent"];
            return (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
                <div className={cn("h-7 w-7 flex-shrink-0 rounded-lg flex items-center justify-center text-[10px] font-bold border",
                  isUser ? "bg-violet/10 border-violet/20 text-violet" : cn(ac.bg, ac.border, ac.text))}>
                  {isUser ? name.slice(0,2).toUpperCase() : "AI"}
                </div>
                <div className={cn("max-w-[78%] flex flex-col gap-1", isUser ? "items-end" : "items-start")}>
                  {!isUser && msg.agentName && (
                    <span className={cn("text-[10px] font-semibold ml-1", ac.text)}>{msg.agentName}</span>
                  )}
                  <div className={isUser ? "chat-bubble-user" : "chat-bubble-agent"}>
                    <p className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                  <span className="text-[10px] text-text-disabled ml-1">{formatRelativeTime(msg.timestamp)}</span>
                </div>
              </motion.div>
            );
          })}

          {loading && (
            <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className={cn("h-7 w-7 flex-shrink-0 rounded-lg flex items-center justify-center text-[10px] font-bold border", agentColor.bg, agentColor.border, agentColor.text)}>AI</div>
              <div className="chat-bubble-agent flex items-center gap-2">
                {[0,1,2].map(i => (
                  <motion.div key={i} className="h-1.5 w-1.5 rounded-full bg-cyan"
                    animate={{ opacity: [0.3,1,0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} />
                ))}
                <span className="text-xs text-text-muted ml-1">{currentAgent ?? "Agent"} is typing…</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 glass border-t border-border/50 px-4 py-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Type your message… (Enter to send)"
            rows={1}
            className="input-field flex-1 resize-none max-h-28 overflow-y-auto py-2.5"
            style={{ minHeight: "42px" }}
          />
          <button type="button" onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="btn-primary px-4 py-2.5 flex-shrink-0 flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed">
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="text-[10px] text-text-disabled text-center mt-1.5">
          Powered by 8 AI agents · TechVault Support
        </p>
      </div>
    </div>
  );
}
