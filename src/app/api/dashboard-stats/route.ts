import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createAdminClient();

    const [totalRes, openRes, escalatedRes, resolvedTotalRes] = await Promise.all([
      supabase.from("tickets").select("*", { count: "exact", head: true }),
      supabase.from("tickets").select("*", { count: "exact", head: true }).eq("status", "open"),
      supabase.from("tickets").select("*", { count: "exact", head: true }).eq("status", "escalated"),
      supabase.from("tickets").select("*", { count: "exact", head: true }).eq("status", "resolved"),
    ]);

    for (const [label, res] of [["total", totalRes], ["open", openRes], ["escalated", escalatedRes], ["resolved", resolvedTotalRes]] as const) {
      if (res.error) console.error(`[dashboard-stats] ${label}:`, res.error.message, res.error.code);
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [resolvedTodayRes, ticketsRes, activityRes] = await Promise.all([
      supabase.from("tickets").select("*", { count: "exact", head: true }).eq("status", "resolved").gte("updated_at", startOfToday.toISOString()),
      supabase.from("tickets").select("*").order("created_at", { ascending: false }).limit(8),
      supabase.from("agent_activity").select("*").order("created_at", { ascending: false }).limit(8),
    ]);

    if (ticketsRes.error)  console.error("[dashboard-stats] tickets:", ticketsRes.error.message);
    if (activityRes.error) console.error("[dashboard-stats] activity:", activityRes.error.message);

    const total = totalRes.count ?? 0;
    const resolvedTotal = resolvedTotalRes.count ?? 0;
    const resolutionRate = total > 0 ? Math.round((resolvedTotal / total) * 100) : 0;

    return NextResponse.json({
      stats: {
        total,
        open: openRes.count ?? 0,
        resolvedToday: resolvedTodayRes.count ?? 0,
        escalated: escalatedRes.count ?? 0,
        resolutionRate,
      },
      tickets: ticketsRes.data ?? [],
      activity: activityRes.data ?? [],
    });
  } catch (err) {
    console.error("[dashboard-stats] fatal:", err);
    return NextResponse.json(
      { stats: { total: 0, open: 0, resolvedToday: 0, escalated: 0, resolutionRate: 0 }, tickets: [], activity: [], error: String(err) },
      { status: 500 }
    );
  }
}
