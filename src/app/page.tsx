"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Zap, MessageSquare, BarChart3, Shield, ArrowRight, Ticket, Package, ChevronRight } from "lucide-react";

const FEATURES = [
  { icon: <MessageSquare className="h-5 w-5" />, title: "8 Specialized AI Agents", desc: "Triage, Support, Returns, Replacement, Policy, Inventory, Catalog & Escalation agents working in concert." },
  { icon: <Zap className="h-5 w-5" />, title: "Instant Response", desc: "Average response time under 3 seconds. AI agents never sleep, never take breaks, never miss a ticket." },
  { icon: <BarChart3 className="h-5 w-5" />, title: "Real-time Analytics", desc: "Live dashboards tracking resolution rates, satisfaction scores, agent performance, and ticket trends." },
  { icon: <Shield className="h-5 w-5" />, title: "Smart Guardrails", desc: "Agents only answer support-related questions. Off-topic queries are politely redirected every time." },
  { icon: <Ticket className="h-5 w-5" />, title: "Ticket Management", desc: "Automatic ticket creation, priority scoring, routing, and escalation without any human intervention." },
  { icon: <Package className="h-5 w-5" />, title: "Catalog Intelligence", desc: "Agents know your entire product catalog, stock levels, pricing, specs, and warranty details instantly." },
];

const STATS = [
  { value: "< 3s", label: "Target response time" },
  { value: "8", label: "Specialized agents" },
  { value: "24/7", label: "Always available" },
  { value: "0", label: "Human handoffs needed" },
];

const AGENTS = [
  { name: "Triage Orchestrator", role: "Routes & prioritizes" },
  { name: "Support Agent", role: "General inquiries" },
  { name: "Returns Agent", role: "Return requests" },
  { name: "Replacement Agent", role: "Defect & damage" },
  { name: "Policy Agent", role: "Rules & guidelines" },
  { name: "Inventory Agent", role: "Stock & availability" },
  { name: "Catalog Agent", role: "Product knowledge" },
  { name: "Escalation Agent", role: "Complex cases" },
];

const SAMPLE_CONVO = [
  { from: "user", text: "My laptop charger arrived broken, can I get a replacement?" },
  { from: "agent", agent: "Replacement Agent", text: "I'm sorry about that. I can see your order #TV-4821 — a replacement charger ships free, arriving in 2-3 days." },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Floating pill nav */}
      <nav className="fixed top-4 left-0 right-0 z-50 px-6 flex justify-center">
        <div className="nav-pill w-full max-w-2xl h-14 px-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5 pl-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan">
              <Zap className="h-3.5 w-3.5 text-void" />
            </div>
            <span className="font-medium text-text-primary tracking-tight">NexDesk</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-text-muted hover:text-text-primary transition-colors px-2">Dashboard</Link>
            <Link href="/support" className="btn-primary text-sm py-2 px-4">
              Try Live Chat <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 badge badge-cyan mb-8 text-xs">
              <span className="status-dot online" /> 8 AI agents, one support desk
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
              className="font-[family-name:var(--font-display)] text-5xl sm:text-6xl font-normal tracking-tight leading-[1.1] mb-6">
              <span className="text-text-primary">AI support that</span>
              <br />
              <span className="text-cyan">never sleeps</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
              className="text-lg text-text-secondary max-w-lg mb-10 leading-relaxed">
              NexDesk deploys 8 specialized AI agents to handle every customer support scenario—
              returns, replacements, warranty claims, product questions—with enterprise precision.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3">
              <Link href="/support">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }} className="btn-primary text-base px-7 py-3.5">
                  <MessageSquare className="h-5 w-5" /> Chat with Support
                </motion.button>
              </Link>
              <Link href="/dashboard">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }} className="btn-secondary text-base px-7 py-3.5">
                  View Dashboard <ChevronRight className="h-4 w-4" />
                </motion.button>
              </Link>
            </motion.div>
          </div>

          {/* Product mockup panel -- real agent names, real sample interaction, smooth entrance + gentle float */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.7, ease: "easeOut" }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="card-static rounded-2xl overflow-hidden"
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-raised">
                <span className="h-2.5 w-2.5 rounded-full bg-rose/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-cyan/60" />
                <span className="ml-3 text-xs text-text-muted">NexDesk — Live Chat</span>
              </div>
              <div className="p-5 space-y-3">
                {SAMPLE_CONVO.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: m.from === "user" ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.4, duration: 0.5 }}
                    className={m.from === "user" ? "flex justify-end" : "flex justify-start"}
                  >
                    <div className={m.from === "user" ? "chat-bubble-user max-w-[85%]" : "chat-bubble-agent max-w-[85%]"}>
                      {m.from === "agent" && (
                        <p className="text-[10px] font-semibold text-cyan mb-1">{m.agent}</p>
                      )}
                      <p className="text-sm text-text-primary leading-snug">{m.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats Bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="max-w-3xl mx-auto mt-20">
          <p className="text-center text-xs text-text-muted mb-4 uppercase tracking-wider">Demo scenario benchmarks</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="card-static rounded-xl p-4 text-center">
                <p className="text-2xl font-medium font-mono text-cyan">{s.value}</p>
                <p className="text-xs text-text-muted mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Agents Section */}
      <section className="py-20 px-6 border-y border-border/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="badge badge-cyan mb-4 text-xs">Agent Architecture</span>
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-normal text-text-primary">Meet your AI team</h2>
            <p className="text-text-secondary mt-3 max-w-xl mx-auto">8 specialized agents, each trained for a specific support domain. Working together seamlessly.</p>
          </div>
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {AGENTS.map((agent) => (
              <motion.div key={agent.name} variants={item}
                className="rounded-xl border border-border bg-surface p-4 transition-all hover:border-cyan/30 hover:-translate-y-0.5 cursor-default">
                <div className="flex items-center gap-2 mb-2">
                  <span className="status-dot online" />
                  <span className="text-[10px] font-medium uppercase tracking-wider text-cyan">Active</span>
                </div>
                <p className="text-sm font-semibold leading-tight mb-1 text-text-primary">{agent.name}</p>
                <p className="text-[11px] text-text-muted">{agent.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="badge badge-cyan mb-4 text-xs">Platform Features</span>
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-normal text-text-primary">Everything you need</h2>
            <p className="text-text-secondary mt-3">Built for enterprise customer support operations.</p>
          </div>
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <motion.div key={f.title} variants={item} className="card p-5">
                <div className="inline-flex p-2.5 rounded-xl border border-cyan/20 bg-cyan/10 mb-4">
                  <div className="text-cyan">{f.icon}</div>
                </div>
                <h3 className="text-sm font-semibold text-text-primary mb-2">{f.title}</h3>
                <p className="text-xs text-text-muted leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="card-static rounded-2xl p-12 text-center border border-cyan/15 bg-cyan/[0.03]">
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-normal text-text-primary mb-4">See it handle a real ticket</h2>
            <p className="text-text-secondary mb-8">Live demo, real AI agents, the actual TechVault product catalog — not a script.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/support">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }} className="btn-primary px-8 py-3.5 text-base">
                  <MessageSquare className="h-5 w-5" /> Chat with Support Agent
                </motion.button>
              </Link>
              <Link href="/dashboard">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }} className="btn-secondary px-8 py-3.5 text-base">
                  <BarChart3 className="h-5 w-5" /> View Analytics
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan">
                <Zap className="h-3 w-3 text-void" />
              </div>
              <span className="text-sm font-medium text-text-primary">NexDesk</span>
              <span className="text-xs text-text-muted">— AI Customer Support Platform</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-text-muted">
              <Link href="/dashboard" className="hover:text-text-primary transition-colors">Dashboard</Link>
              <Link href="/support" className="hover:text-text-primary transition-colors">Live Chat</Link>
              <Link href="/analytics" className="hover:text-text-primary transition-colors">Analytics</Link>
              <a href="mailto:zainmalik.622aa@gmail.com" className="hover:text-text-primary transition-colors">Contact</a>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border/50 text-[11px] text-text-muted">
            <span>© 2026 NexDesk. Demo project — no real payments processed.</span>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-text-primary transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-text-primary transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
