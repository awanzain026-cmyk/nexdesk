"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Zap, RefreshCw, ChevronDown, Sparkles } from "lucide-react";
import { Button, Avatar, Spinner, Badge } from "@/components/ui";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { ChatMessage, AgentName } from "@/types";

const AGENT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Triage Orchestrator": { bg: "bg-cyan/10",   text: "text-cyan",   border: "border-cyan/20" },
  "Support Agent":       { bg: "bg-violet/10", text: "text-violet",  border: "border-violet/20" },
  "Inventory Agent":     { bg: "bg-amber/10",  text: "text-amber",   border: "border-amber/20" },
  "Catalog Agent":       { bg: "bg-emerald/10",text: "text-emerald", border: "border-emerald/20" },
  "Policy Agent":        { bg: "bg-rose/10",   text: "text-rose",    border: "border-rose/20" },
  "Returns Agent":       { bg: "bg-cyan/10",   text: "text-cyan",    border: "border-cyan/20" },
  "Replacement Agent":   { bg: "bg-violet/10", text: "text-violet",  border: "border-violet/20" },
  "Escalation Agent":    { bg: "bg-rose/10",   text: "text-rose",    border: "border-rose/20" },
};

const QUICK_PROMPTS = [
  "I want to return my iPhone 15 Pro Max",
  "Is the Sony WH-1000XM5 in stock?",
  "My MacBook Air M3 has a defect, I need a replacement",
  "What's the warranty on the Apple Watch Series 9?",
  "Where is my order? Tracking number not working",
  "Compare iPhone 15 Pro Max vs Samsung Galaxy S24 Ultra",
];

export default function ChatPage() {
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
      const errMsg: ChatMessage = {
        id: Math.random().toString(36).slice(2),
        role: "assistant",
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        agentName: "Support Agent",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setMessages([]);
    setCurrentAgent(null);
    setOffTopicCount(0);
    setTicketId(null);
    setInput("");
  };

  const agentColor = currentAgent ? AGENT_COLORS[currentAgent] : AGENT_COLORS["Support Agent"];

  return (
    <div className="flex h-[calc(100vh-6rem)] gap-4">
      {/* Chat Area */}
      <div className="flex flex-col flex-1 card-static rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-5 py-3 sm:py-4 border-b border-border bg-surface/50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-cyan/10 border border-cyan/20">
              <Zap className="h-4 w-4 text-cyan" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-text-primary">NexDesk AI</span>
                <span className="status-dot online flex-shrink-0" />
              </div>
              {currentAgent ? (
                <span className={cn("text-[11px] font-medium truncate block", agentColor.text)}>{currentAgent}</span>
              ) : (
                <span className="text-[11px] text-text-muted">8 agents ready</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {ticketId && (
              <Badge variant="cyan" dot className="text-[10px] hidden sm:inline-flex">Ticket #{ticketId.slice(0, 8)}</Badge>
            )}
            <button onClick={resetChat} className="btn-ghost text-xs gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" /> New Chat
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <AnimatePresence initial={false}>
            {messages.length === 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="p-5 rounded-2xl bg-cyan/10 border border-cyan/20 mb-6">
                  <Sparkles className="h-10 w-10 text-cyan" />
                </div>
                <h2 className="text-xl font-bold text-text-primary mb-2">TechVault AI Support</h2>
                <p className="text-sm text-text-muted max-w-sm mb-8">
                  Our 8 specialized AI agents are ready to help with returns, replacements, product questions, and more.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-xl">
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
                    <Avatar name="You" size="sm" />
                  ) : (
                    <div className={cn("flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border text-[10px] font-bold", ac.bg, ac.border, ac.text)}>
                      AI
                    </div>
                  )}
                  <div className={cn("max-w-[75%] space-y-1", isUser ? "items-end" : "items-start", "flex flex-col")}>
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
                <div className="chat-bubble-agent">
                  <div className="flex items-center gap-2">
                    <Spinner size="sm" />
                    <span className="text-xs text-text-muted">
                      {currentAgent ?? "Triage Orchestrator"} is thinking...
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-4 border-t border-border bg-surface/50">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your issue... (Enter to send, Shift+Enter for new line)"
                rows={1}
                className="input-field resize-none max-h-32 overflow-y-auto py-3 pr-4"
                style={{ minHeight: "44px" }}
              />
            </div>
            <Button onClick={() => sendMessage()} loading={isLoading} disabled={!input.trim()} icon={<Send className="h-4 w-4" />} size="md">
              Send
            </Button>
          </div>
          <p className="text-[10px] text-text-disabled mt-2 text-center">
            Powered by 8 specialized AI agents · TechVault Support Platform
          </p>
        </div>
      </div>

      {/* Agent Panel */}
      <div className="hidden xl:flex w-56 flex-col gap-3">
        <div className="card-static rounded-2xl p-4">
          <h3 className="text-xs font-semibold text-text-primary mb-3 flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-cyan" /> Active Agents
          </h3>
          <div className="space-y-2">
            {Object.entries(AGENT_COLORS).map(([name, colors]) => (
              <div key={name}
                className={cn("flex items-center gap-2 p-2 rounded-lg border transition-all duration-300",
                  currentAgent === name ? cn(colors.bg, colors.border) : "bg-transparent border-transparent")}>
                <span className={cn("status-dot flex-shrink-0", currentAgent === name ? "online" : "offline")} />
                <span className={cn("text-[11px] font-medium leading-tight", currentAgent === name ? colors.text : "text-text-muted")}>{name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card-static rounded-2xl p-4">
          <h3 className="text-xs font-semibold text-text-primary mb-3">Quick Stats</h3>
          <div className="space-y-3">
            {[{ label: "Avg Response", value: "< 3s" }, { label: "Session", value: `${messages.length} msgs` }, { label: "Off-topic", value: `${offTopicCount}/3` }].map(s => (
              <div key={s.label} className="flex items-center justify-between">
                <span className="text-[11px] text-text-muted">{s.label}</span>
                <span className="text-[11px] font-mono font-semibold text-text-primary">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
