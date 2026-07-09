import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { count: total } = await supabase.from("tickets").select("*", { count: "exact", head: true });
    const { count: open } = await supabase.from("tickets").select("*", { count: "exact", head: true }).eq("status", "open");
    const { count: escalated } = await supabase.from("tickets").select("*", { count: "exact", head: true }).eq("status", "escalated");
    const { count: resolvedTotal } = await supabase.from("tickets").select("*", { count: "exact", head: true }).eq("status", "resolved");

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const { count: resolvedToday } = await supabase
      .from("tickets")
      .select("*", { count: "exact", head: true })
      .eq("status", "resolved")
      .gte("updated_at", startOfToday.toISOString());

    const { data: tickets } = await supabase
      .from("tickets")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(8);

    const { data: activity } = await supabase
      .from("agent_activity")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(8);

    const resolutionRate = total && total > 0 ? Math.round(((resolvedTotal ?? 0) / total) * 100) : 0;

    return NextResponse.json({
      stats: {
        total: total ?? 0,
        open: open ?? 0,
        resolvedToday: resolvedToday ?? 0,
        escalated: escalated ?? 0,
        resolutionRate,
      },
      tickets: tickets ?? [],
      activity: activity ?? [],
    });
  } catch (err) {
    console.error("[dashboard-stats] error:", err);
    return NextResponse.json(
      { stats: { total: 0, open: 0, resolvedToday: 0, escalated: 0, resolutionRate: 0 }, tickets: [], activity: [], error: String(err) },
      { status: 500 }
    );
  }
}
