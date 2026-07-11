import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const totalRes = await supabase.from("tickets").select("*", { count: "exact", head: true });
    const openRes = await supabase.from("tickets").select("*", { count: "exact", head: true }).eq("status", "open");
    const escalatedRes = await supabase.from("tickets").select("*", { count: "exact", head: true }).eq("status", "escalated");
    const resolvedTotalRes = await supabase.from("tickets").select("*", { count: "exact", head: true }).eq("status", "resolved");

    // Log any individual query failure -- Supabase returns { count: null, error }
    // on failure, it does NOT throw, so these were silently becoming zero before.
    for (const [label, res] of [
      ["total", totalRes], ["open", openRes], ["escalated", escalatedRes], ["resolvedTotal", resolvedTotalRes],
    ] as const) {
      if (res.error) {
        console.error(`[dashboard-stats] Query '${label}' failed:`, res.error.message, "-- check that supabase/schema.sql has actually been run in your Supabase SQL Editor");
      }
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const resolvedTodayRes = await supabase
      .from("tickets")
      .select("*", { count: "exact", head: true })
      .eq("status", "resolved")
      .gte("updated_at", startOfToday.toISOString());

    const ticketsRes = await supabase
      .from("tickets")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(8);
    if (ticketsRes.error) {
      console.error("[dashboard-stats] Fetching tickets failed:", ticketsRes.error.message);
    }

    const activityRes = await supabase
      .from("agent_activity")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(8);
    if (activityRes.error) {
      console.error("[dashboard-stats] Fetching activity failed:", activityRes.error.message);
    }

    const total = totalRes.count;
    const resolvedTotal = resolvedTotalRes.count;
    const resolutionRate = total && total > 0 ? Math.round(((resolvedTotal ?? 0) / total) * 100) : 0;

    return NextResponse.json({
      stats: {
        total: total ?? 0,
        open: openRes.count ?? 0,
        resolvedToday: resolvedTodayRes.count ?? 0,
        escalated: escalatedRes.count ?? 0,
        resolutionRate,
      },
      tickets: ticketsRes.data ?? [],
      activity: activityRes.data ?? [],
    });
  } catch (err) {
    console.error("[dashboard-stats] Unexpected error:", err);
    return NextResponse.json(
      { stats: { total: 0, open: 0, resolvedToday: 0, escalated: 0, resolutionRate: 0 }, tickets: [], activity: [], error: String(err) },
      { status: 500 }
    );
  }
}
