"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Zap, Sparkles, ArrowLeft, MessageSquare } from "lucide-react";
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
  "My item arrived damaged — I need a replacement",
  "Is the iPhone 15 Pro Max in stock?",
  "What is your return policy?",
  "Where is my order?",
  "Compare iPhone 15 vs Samsung Galaxy S24",
];

interface CustomerInfo { name: string; email: string; }

export default function SupportPage() {
  const [step, setStep] = useState<"intro" | "chat">("intro");
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({ name: "", email: "" });
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<AgentName | null>(null);
  const [offTopicCount, setOffTopicCount] = useState(0);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const startChat = () => {
    let valid = true;
    if (!nameInput.trim()) { setNameError("Please enter your name"); valid = false; }
    else setNameError("");
    if (!emailInput.trim() || !emailInput.includes("@")) { setEmailError("Please enter a valid email"); valid = false; }
    else setEmailError("");
    if (!valid) return;
    setCustomerInfo({ name: nameInput.trim(), email: emailInput.trim() });
    setStep("chat");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const sendMessage = async (text?: string) => {
    const content = text || input.trim();
    if (!content || isLoading) return;
    setInput("");

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).slice(2),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          history: messages,
          offTopicCount,
          ticketId,
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
        }),
      });
      const data = await res.json();
      const agentMsg: ChatMessage = {
        id: Math.random().toString(36).slice(2),
        role: "assistant",
        content: data.response,
        agentName: data.agentName,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, agentMsg]);
      setCurrentAgent(data.agentName);
      setOffTopicCount(data.offTopicCount ?? 0);
      if (data.ticketId) setTicketId(data.ticketId);
    } catch {
      setMessages(prev => [...prev, {
        id: Math.random().toString(36).slice(2),
        role: "assistant",
        content: "I'm having trouble connecting. Please try again in a moment.",
        agentName: "Support Agent",
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const agentColor = currentAgent ? AGENT_COLORS[currentAgent] : AGENT_COLORS["Support Agent"];

  // ── INTRO STEP ──────────────────────────────────────────────────────────────
  if (step === "intro") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Nav */}
        <div className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50 px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan to-violet">
              <Zap className="h-3.5 w-3.5 text-void" />
            </div>
            <span className="font-bold text-text-primary text-sm">TechVault Support</span>
          </Link>
          <Link href="/" className="btn-ghost text-xs gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to home
          </Link>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md mt-14">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan/20 to-violet/20 border border-cyan/20 mb-4">
              <MessageSquare className="h-7 w-7 text-cyan" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary">How can we help?</h1>
            <p className="text-sm text-text-muted mt-2">Our AI support team is ready. Tell us who you are to get started.</p>
          </div>

          {/* Form */}
          <div className="card-static rounded-2xl p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Your Name <span className="text-rose">*</span></label>
              <input
                type="text" value={nameInput}
                onChange={e => { setNameInput(e.target.value); setNameError(""); }}
                onKeyDown={e => { if (e.key === "Enter") startChat(); }}
                placeholder="Enter your full name"
                className={cn("input-field", nameError && "border-rose/50")}
                autoFocus
              />
              {nameError && <p className="text-xs text-rose mt-1">{nameError}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Email Address <span className="text-rose">*</span></label>
              <input
                type="email" value={emailInput}
                onChange={e => { setEmailInput(e.target.value); setEmailError(""); }}
                onKeyDown={e => { if (e.key === "Enter") startChat(); }}
                placeholder="your@email.com"
                className={cn("input-field", emailError && "border-rose/50")}
              />
              {emailError && <p className="text-xs text-rose mt-1">{emailError}</p>}
            </div>
            <button onClick={startChat} className="btn-primary w-full justify-center mt-2">
              Start Chat <Sparkles className="h-4 w-4" />
            </button>
          </div>

          {/* Agent badges */}
          <div className="mt-6 text-center">
            <p className="text-[11px] text-text-muted mb-3">8 specialized agents ready to help</p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {["Returns", "Replacement", "Warranty", "Tracking", "Product Info", "Policy", "Inventory", "Escalation"].map(a => (
                <span key={a} className="badge badge-gray text-[10px]">{a}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── CHAT STEP ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <div className="flex-shrink-0 glass border-b border-border/50 px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan to-violet">
            <Zap className="h-3.5 w-3.5 text-void" />
          </div>
          <span className="font-bold text-text-primary text-sm">TechVault Support</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="status-dot online" />
            <span className="text-[11px] text-emerald font-medium">
              {currentAgent ?? "8 Agents Ready"}
            </span>
          </div>
          {ticketId && (
            <span className="badge badge-cyan text-[10px] hidden sm:inline-flex">
              Ticket #{ticketId.slice(0, 8)}
            </span>
          )}
          <div className="text-right hidden sm:block">
            <p className="text-[11px] font-medium text-text-primary">{customerInfo.name}</p>
            <p className="text-[10px] text-text-muted">{customerInfo.email}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-3xl w-full mx-auto">
        <AnimatePresence initial={false}>
          {messages.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-16 text-center">
              <div className="p-4 rounded-2xl bg-cyan/10 border border-cyan/20 mb-5">
                <Sparkles className="h-8 w-8 text-cyan" />
              </div>
              <h2 className="text-lg font-bold text-text-primary mb-1">Hi {customerInfo.name}! 👋</h2>
              <p className="text-sm text-text-muted max-w-sm mb-8">
                How can we help you today? Choose a common issue or type your question below.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                {QUICK_PROMPTS.map((p) => (
                  <button key={p} onClick={() => sendMessage(p)}
                    className="text-left text-xs text-text-secondary bg-raised border border-border rounded-lg px-3 py-2.5 hover:border-cyan/30 hover:text-text-primary hover:bg-cyan/5 transition-all cursor-pointer">
                    {p}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {messages.map((msg) => {
            const isUser = msg.role === "user";
            const ac = msg.agentName ? AGENT_COLORS[msg.agentName] : AGENT_COLORS["Support Agent"];
            return (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
                {isUser ? (
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-violet/10 border border-violet/20 text-[10px] font-bold text-violet">
                    {customerInfo.name.slice(0, 2).toUpperCase()}
                  </div>
                ) : (
                  <div className={cn("flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border text-[10px] font-bold", ac.bg, ac.border, ac.text)}>
                    AI
                  </div>
                )}
                <div className={cn("max-w-[78%] flex flex-col space-y-1", isUser ? "items-end" : "items-start")}>
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

          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className={cn("flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border text-[10px] font-bold agent-active", agentColor.bg, agentColor.border, agentColor.text)}>
                AI
              </div>
              <div className="chat-bubble-agent flex items-center gap-2">
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <motion.div key={i} className="h-1.5 w-1.5 rounded-full bg-cyan"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} />
                  ))}
                </div>
                <span className="text-xs text-text-muted">{currentAgent ?? "Agent"} is typing...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 glass border-t border-border/50 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-end gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Enter to send)"
            rows={1}
            className="input-field flex-1 resize-none max-h-32 overflow-y-auto py-3"
            style={{ minHeight: "44px" }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className="btn-primary px-4 py-3 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="text-[10px] text-text-disabled text-center mt-2">
          Powered by TechVault AI · Your conversation is saved for follow-up
        </p>
      </div>
    </div>
  );
}
