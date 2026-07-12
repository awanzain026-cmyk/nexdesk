"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, StatCard, Skeleton } from "@/components/ui";
import { TrendingUp, BarChart3, Ticket, CheckCircle } from "lucide-react";

const COLORS = ["#00D4FF", "#7B61FF", "#00E5A0", "#FFB547", "#FF4D6A"];
const TooltipStyle = { backgroundColor: "#0D1117", border: "1px solid #1E2736", borderRadius: "8px", fontSize: "12px", color: "#F1F5F9" };

// Trend data is illustrative (requires time-series tracking to be real)
const TREND_DATA = [
  { date: "Week 1", tickets: 0, resolved: 0 },
  { date: "Week 2", tickets: 0, resolved: 0 },
  { date: "Week 3", tickets: 0, resolved: 0 },
  { date: "Week 4", tickets: 0, resolved: 0 },
];

interface AnalyticsData {
  stats: { total: number; resolved: number; open: number; resolutionRate: number };
  typeDistribution: { name: string; value: number }[];
  agentPerformance: { agent: string; resolved: number }[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const typeData = data?.typeDistribution?.length
    ? data.typeDistribution
    : [{ name: "No data yet", value: 1 }];

  const agentData = data?.agentPerformance?.length
    ? data.agentPerformance
    : [];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Analytics</h1>
        <p className="text-sm text-text-muted mt-0.5">Live performance data from your Supabase database</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          [1,2,3,4].map(i => <Skeleton key={i} className="h-28 rounded-[14px]" />)
        ) : (
          <>
            <StatCard label="Total Tickets"    value={data?.stats.total ?? 0}    icon={<Ticket className="h-5 w-5" />}      color="cyan" />
            <StatCard label="Resolved"         value={data?.stats.resolved ?? 0} icon={<CheckCircle className="h-5 w-5" />} color="green" />
            <StatCard label="Open"             value={data?.stats.open ?? 0}     icon={<TrendingUp className="h-5 w-5" />}  color="amber" />
            <StatCard label="Resolution Rate"  value={`${data?.stats.resolutionRate ?? 0}%`} icon={<BarChart3 className="h-5 w-5" />} color="violet" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issue Type Distribution */}
        <Card hover={false}>
          <h3 className="text-sm font-semibold text-text-primary mb-4">Issue Type Distribution</h3>
          {loading ? <Skeleton className="h-48" /> : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={typeData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                    {typeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={0.85} />)}
                  </Pie>
                  <Tooltip contentStyle={TooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-3">
                {typeData.map((t, i) => (
                  <div key={t.name} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-[11px] text-text-muted capitalize">{t.name}</span>
                    <span className="text-[11px] font-mono text-text-secondary ml-auto">{t.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>

        {/* Agent Performance */}
        <Card hover={false}>
          <h3 className="text-sm font-semibold text-text-primary mb-4">Tickets Handled per Agent</h3>
          {loading ? <Skeleton className="h-48" /> : agentData.length === 0 ? (
            <div className="h-48 flex items-center justify-center">
              <p className="text-sm text-text-muted">No agent activity yet — start a chat to see data here.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={agentData} margin={{ top: 5, right: 10, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2736" vertical={false} />
                <XAxis dataKey="agent" tick={{ fill: "#4A5568", fontSize: 10 }} axisLine={false} tickLine={false} angle={-30} textAnchor="end" />
                <YAxis tick={{ fill: "#4A5568", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={TooltipStyle} />
                <Bar dataKey="resolved" name="Tickets" radius={[4, 4, 0, 0]}>
                  {agentData.map((_, i) => <Cell key={i} fill={i % 2 === 0 ? "#00D4FF" : "#7B61FF"} opacity={0.8} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Resolution trend placeholder */}
      <Card hover={false}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-text-primary">Resolution Rate</h3>
          <span className="text-2xl font-bold font-mono text-cyan">{loading ? "—" : `${data?.stats.resolutionRate ?? 0}%`}</span>
        </div>
        <div className="h-2 rounded-full bg-border overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${data?.stats.resolutionRate ?? 0}%` }} transition={{ duration: 1.2, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-cyan to-violet" />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[11px] text-text-muted">0%</span>
          <span className="text-[11px] text-text-muted">{data?.stats.total ? `Based on ${data.stats.total} tickets` : "No tickets yet"}</span>
          <span className="text-[11px] text-text-muted">100%</span>
        </div>
        {!loading && data?.stats.total === 0 && (
          <p className="text-xs text-text-muted text-center mt-4">
            Start chats via <a href="/support" className="text-cyan hover:underline">/support</a> to see real analytics populate here.
          </p>
        )}
      </Card>
    </div>
  );
}
