"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Zap, MessageSquare, BarChart3, Shield, ArrowRight, CheckCircle, Ticket, Package, Star, ChevronRight } from "lucide-react";

const FEATURES = [
  { icon: <MessageSquare className="h-5 w-5" />, title: "8 Specialized AI Agents", desc: "Triage, Support, Returns, Replacement, Policy, Inventory, Catalog & Escalation agents working in concert.", color: "text-cyan", bg: "bg-cyan/10 border-cyan/20" },
  { icon: <Zap className="h-5 w-5" />, title: "Instant Response", desc: "Average response time under 3 seconds. AI agents never sleep, never take breaks, never miss a ticket.", color: "text-violet", bg: "bg-violet/10 border-violet/20" },
  { icon: <BarChart3 className="h-5 w-5" />, title: "Real-time Analytics", desc: "Live dashboards tracking resolution rates, satisfaction scores, agent performance, and ticket trends.", color: "text-emerald", bg: "bg-emerald/10 border-emerald/20" },
  { icon: <Shield className="h-5 w-5" />, title: "Smart Guardrails", desc: "Agents only answer support-related questions. Off-topic queries are politely redirected every time.", color: "text-amber", bg: "bg-amber/10 border-amber/20" },
  { icon: <Ticket className="h-5 w-5" />, title: "Ticket Management", desc: "Automatic ticket creation, priority scoring, routing, and escalation without any human intervention.", color: "text-rose", bg: "bg-rose/10 border-rose/20" },
  { icon: <Package className="h-5 w-5" />, title: "Catalog Intelligence", desc: "Agents know your entire product catalog, stock levels, pricing, specs, and warranty details instantly.", color: "text-cyan", bg: "bg-cyan/10 border-cyan/20" },
];

const STATS = [
  { value: "< 3s", label: "Avg Response Time" },
  { value: "94%", label: "Resolution Rate" },
  { value: "4.8/5", label: "Satisfaction Score" },
  { value: "24/7", label: "Availability" },
];

const AGENTS = [
  { name: "Triage Orchestrator", role: "Routes & prioritizes", color: "text-cyan", bg: "bg-cyan/10 border-cyan/25" },
  { name: "Support Agent", role: "General inquiries", color: "text-violet", bg: "bg-violet/10 border-violet/25" },
  { name: "Returns Agent", role: "Return requests", color: "text-emerald", bg: "bg-emerald/10 border-emerald/25" },
  { name: "Replacement Agent", role: "Defect & damage", color: "text-amber", bg: "bg-amber/10 border-amber/25" },
  { name: "Policy Agent", role: "Rules & guidelines", color: "text-rose", bg: "bg-rose/10 border-rose/25" },
  { name: "Inventory Agent", role: "Stock & availability", color: "text-cyan", bg: "bg-cyan/10 border-cyan/25" },
  { name: "Catalog Agent", role: "Product knowledge", color: "text-violet", bg: "bg-violet/10 border-violet/25" },
  { name: "Escalation Agent", role: "Complex cases", color: "text-rose", bg: "bg-rose/10 border-rose/25" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan to-violet">
              <Zap className="h-3.5 w-3.5 text-void" />
            </div>
            <span className="font-bold text-text-primary tracking-tight">NexDesk</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm text-text-muted hover:text-text-primary transition-colors">Dashboard</Link>
            <Link href="/chat" className="btn-primary text-sm py-2 px-4">
              Try Live Chat <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Ambient orbs */}
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(circle, #00D4FF, transparent)" }} />
        <div className="absolute -top-20 -right-40 h-80 w-80 rounded-full opacity-15 blur-3xl" style={{ background: "radial-gradient(circle, #7B61FF, transparent)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full opacity-10 blur-3xl" style={{ background: "radial-gradient(circle, #00E5A0, transparent)" }} />

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 badge badge-cyan mb-8 text-xs">
            <span className="status-dot online" /> 8 AI Agents Active — Enterprise Support Platform
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-6">
            <span className="text-text-primary">AI Support That</span>
            <br />
            <span className="gradient-text-cyan">Never Sleeps</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            NexDesk deploys 8 specialized AI agents to handle every customer support scenario—
            returns, replacements, warranty claims, product questions—with enterprise precision.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/chat">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary text-base px-7 py-3.5">
                <MessageSquare className="h-5 w-5" /> Try Live Demo
              </motion.button>
            </Link>
            <Link href="/dashboard">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-secondary text-base px-7 py-3.5">
                View Dashboard <ChevronRight className="h-4 w-4" />
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Stats Bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="max-w-3xl mx-auto mt-20 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="card-static rounded-xl p-4 text-center">
              <p className="text-2xl font-bold font-mono gradient-text-cyan">{s.value}</p>
              <p className="text-xs text-text-muted mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Agents Section */}
      <section className="py-20 px-6 border-y border-border/50" style={{ background: "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(0,212,255,0.04) 0%, transparent 70%)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="badge badge-violet mb-4 text-xs">Agent Architecture</span>
            <h2 className="text-3xl font-bold text-text-primary">Meet Your AI Team</h2>
            <p className="text-text-secondary mt-3 max-w-xl mx-auto">8 specialized agents, each trained for a specific support domain. Working together seamlessly.</p>
          </div>
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {AGENTS.map((agent) => (
              <motion.div key={agent.name} variants={item}
                className={`rounded-xl border p-4 ${agent.bg} transition-all hover:scale-[1.02] cursor-default`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="status-dot online" />
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${agent.color}`}>Active</span>
                </div>
                <p className={`text-sm font-semibold leading-tight mb-1 ${agent.color}`}>{agent.name}</p>
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
            <h2 className="text-3xl font-bold text-text-primary">Everything You Need</h2>
            <p className="text-text-secondary mt-3">Built for enterprise customer support operations.</p>
          </div>
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <motion.div key={f.title} variants={item} className="card p-5">
                <div className={`inline-flex p-2.5 rounded-xl border mb-4 ${f.bg}`}>
                  <div className={f.color}>{f.icon}</div>
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
          <div className="card-static rounded-2xl p-12 text-center relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.05) 0%, rgba(123,97,255,0.05) 100%)", border: "1px solid rgba(0,212,255,0.15)" }}>
            <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(ellipse 80% 80% at 50% 0%, rgba(0,212,255,0.1) 0%, transparent 60%)" }} />
            <div className="relative">
              <div className="inline-flex items-center gap-2 mb-6 text-sm text-text-muted">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-4 w-4 fill-amber text-amber" />)}
                <span className="ml-2">4.8/5 from 200+ businesses</span>
              </div>
              <h2 className="text-3xl font-bold text-text-primary mb-4">Ready to Transform Your Support?</h2>
              <p className="text-text-secondary mb-8">See NexDesk in action with a live demo using real AI agents and the TechVault product catalog.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/chat">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary px-8 py-3.5 text-base">
                    <MessageSquare className="h-5 w-5" /> Start Free Demo
                  </motion.button>
                </Link>
                <Link href="/dashboard">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-secondary px-8 py-3.5 text-base">
                    <BarChart3 className="h-5 w-5" /> View Analytics
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-cyan to-violet">
              <Zap className="h-3 w-3 text-void" />
            </div>
            <span className="text-sm font-bold text-text-primary">NexDesk</span>
            <span className="text-xs text-text-muted">— AI Customer Support Platform</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-text-muted">
            <Link href="/dashboard" className="hover:text-text-primary transition-colors">Dashboard</Link>
            <Link href="/chat" className="hover:text-text-primary transition-colors">Live Chat</Link>
            <Link href="/analytics" className="hover:text-text-primary transition-colors">Analytics</Link>
            <span>© 2025 NexDesk</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
