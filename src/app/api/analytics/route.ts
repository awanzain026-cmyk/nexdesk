import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const [totalRes, resolvedRes, openRes, typeRes] = await Promise.all([
      supabase.from("tickets").select("*", { count: "exact", head: true }),
      supabase.from("tickets").select("*", { count: "exact", head: true }).eq("status", "resolved"),
      supabase.from("tickets").select("*", { count: "exact", head: true }).eq("status", "open"),
      supabase.from("tickets").select("type, agent_handled"),
    ]);

    const total = totalRes.count ?? 0;
    const resolved = resolvedRes.count ?? 0;
    const open = openRes.count ?? 0;
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    // Count by type
    const typeCount: Record<string, number> = {};
    const agentCount: Record<string, number> = {};
    for (const t of typeRes.data ?? []) {
      typeCount[t.type] = (typeCount[t.type] ?? 0) + 1;
      if (t.agent_handled) agentCount[t.agent_handled] = (agentCount[t.agent_handled] ?? 0) + 1;
    }

    return NextResponse.json({
      stats: { total, resolved, open, resolutionRate },
      typeDistribution: Object.entries(typeCount).map(([name, value]) => ({ name, value })),
      agentPerformance: Object.entries(agentCount).map(([agent, resolved]) => ({ agent: agent.replace(" Agent", "").replace(" Orchestrator", ""), resolved })),
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
