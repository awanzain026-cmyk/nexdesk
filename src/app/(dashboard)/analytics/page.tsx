"use client";
import { motion } from "framer-motion";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, StatCard } from "@/components/ui";
import { TrendingUp, BarChart3, Star, Clock } from "lucide-react";

const TICKET_TREND = [
  { date: "Jan", tickets: 89, resolved: 82 }, { date: "Feb", tickets: 112, resolved: 104 },
  { date: "Mar", tickets: 98, resolved: 91 }, { date: "Apr", tickets: 134, resolved: 128 },
  { date: "May", tickets: 121, resolved: 115 }, { date: "Jun", tickets: 156, resolved: 149 },
  { date: "Jul", tickets: 142, resolved: 134 },
];

const ISSUE_TYPES = [
  { name: "General",     value: 38, color: "#00D4FF" },
  { name: "Returns",     value: 24, color: "#7B61FF" },
  { name: "Warranty",    value: 18, color: "#00E5A0" },
  { name: "Replacement", value: 12, color: "#FFB547" },
  { name: "Tracking",    value: 8,  color: "#FF4D6A" },
];

const AGENT_PERFORMANCE = [
  { agent: "Support",     resolved: 234, avg_time: 2.1 },
  { agent: "Returns",     resolved: 189, avg_time: 4.8 },
  { agent: "Replacement", resolved: 143, avg_time: 6.2 },
  { agent: "Policy",      resolved: 98,  avg_time: 1.8 },
  { agent: "Escalation",  resolved: 67,  avg_time: 12.4 },
  { agent: "Inventory",   resolved: 112, avg_time: 1.2 },
  { agent: "Catalog",     resolved: 201, avg_time: 0.9 },
];

const SATISFACTION_TREND = [
  { week: "W1", score: 4.2 }, { week: "W2", score: 4.5 }, { week: "W3", score: 4.3 },
  { week: "W4", score: 4.7 }, { week: "W5", score: 4.6 }, { week: "W6", score: 4.8 },
  { week: "W7", score: 4.9 },
];

const TooltipStyle = { backgroundColor: "#0D1117", border: "1px solid #1E2736", borderRadius: "8px", fontSize: "12px", color: "#F1F5F9" };

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Analytics</h1>
        <p className="text-sm text-text-muted mt-0.5">Performance insights — Last 7 months</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Resolved" value="1,044" delta={12} icon={<TrendingUp className="h-5 w-5" />} color="green" />
        <StatCard label="Avg Response" value="3.2s" delta={-8} icon={<Clock className="h-5 w-5" />} color="cyan" />
        <StatCard label="Satisfaction" value="4.8/5" delta={5} icon={<Star className="h-5 w-5" />} color="violet" />
        <StatCard label="Resolution Rate" value="94%" delta={3} icon={<BarChart3 className="h-5 w-5" />} color="amber" />
      </div>

      {/* Ticket Trend */}
      <Card hover={false}>
        <h3 className="text-sm font-semibold text-text-primary mb-4">Ticket Volume & Resolution</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={TICKET_TREND} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="ticketsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="resolvedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7B61FF" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#7B61FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2736" />
            <XAxis dataKey="date" tick={{ fill: "#4A5568", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#4A5568", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TooltipStyle} />
            <Legend wrapperStyle={{ fontSize: "12px", color: "#94A3B8" }} />
            <Area type="monotone" dataKey="tickets"  stroke="#00D4FF" strokeWidth={2} fill="url(#ticketsGrad)"  name="Total Tickets" />
            <Area type="monotone" dataKey="resolved" stroke="#7B61FF" strokeWidth={2} fill="url(#resolvedGrad)" name="Resolved" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Two column charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issue Types Pie */}
        <Card hover={false}>
          <h3 className="text-sm font-semibold text-text-primary mb-4">Issue Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={ISSUE_TYPES} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                {ISSUE_TYPES.map((entry, i) => <Cell key={i} fill={entry.color} opacity={0.85} />)}
              </Pie>
              <Tooltip contentStyle={TooltipStyle} formatter={(v) => [`${v}%`, ""]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {ISSUE_TYPES.map(t => (
              <div key={t.name} className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: t.color }} />
                <span className="text-[11px] text-text-muted">{t.name}</span>
                <span className="text-[11px] font-mono text-text-secondary ml-auto">{t.value}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Satisfaction Trend */}
        <Card hover={false}>
          <h3 className="text-sm font-semibold text-text-primary mb-4">Customer Satisfaction Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={SATISFACTION_TREND} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="satGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00E5A0" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#00E5A0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2736" />
              <XAxis dataKey="week" tick={{ fill: "#4A5568", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[3.5, 5]} tick={{ fill: "#4A5568", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TooltipStyle} />
              <Area type="monotone" dataKey="score" stroke="#00E5A0" strokeWidth={2.5} fill="url(#satGrad)" name="Score" dot={{ fill: "#00E5A0", r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Agent Performance */}
      <Card hover={false}>
        <h3 className="text-sm font-semibold text-text-primary mb-4">Agent Performance — Tickets Resolved</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={AGENT_PERFORMANCE} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2736" vertical={false} />
            <XAxis dataKey="agent" tick={{ fill: "#4A5568", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#4A5568", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TooltipStyle} />
            <Bar dataKey="resolved" name="Resolved" radius={[4, 4, 0, 0]}>
              {AGENT_PERFORMANCE.map((_, i) => (
                <Cell key={i} fill={i % 2 === 0 ? "#00D4FF" : "#7B61FF"} opacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
