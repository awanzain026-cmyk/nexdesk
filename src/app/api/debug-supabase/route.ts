import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const report: Record<string, unknown> = {};

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

  report.env_vars = {
    NEXT_PUBLIC_SUPABASE_URL:     process.env.NEXT_PUBLIC_SUPABASE_URL    ? "present" : "MISSING",
    SUPABASE_URL:                 process.env.SUPABASE_URL                ? "present" : "MISSING",
    NEXT_PUBLIC_SUPABASE_ANON_KEY:process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "present" : "MISSING",
    SUPABASE_ANON_KEY:            process.env.SUPABASE_ANON_KEY           ? "present" : "MISSING",
    SUPABASE_SERVICE_ROLE_KEY:    process.env.SUPABASE_SERVICE_ROLE_KEY   ? "present" : "MISSING",
    AUTH_SECRET:                  process.env.AUTH_SECRET                 ? "present" : "MISSING (using fallback)",
    resolved_url:                 url ? url.slice(0, 40) + "..." : "NONE FOUND",
    resolved_key_length:          key ? key.length : 0,
  };

  if (!url || !key) {
    report.diagnosis = "STOP: No Supabase URL or key found in any variable. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to Vercel environment variables.";
    return NextResponse.json(report);
  }

  try {
    const supabase = await createClient();

    const readTest = await supabase.from("tickets").select("id", { count: "exact", head: true });
    report.tickets_table = readTest.error
      ? { ok: false, error: readTest.error.message, code: readTest.error.code }
      : { ok: true, row_count: readTest.count };

    const activityTest = await supabase.from("agent_activity").select("id", { count: "exact", head: true });
    report.activity_table = activityTest.error
      ? { ok: false, error: activityTest.error.message, code: activityTest.error.code }
      : { ok: true, row_count: activityTest.count };

    const errors = [readTest.error, activityTest.error].filter(Boolean);
    if (errors.length === 0) {
      report.diagnosis = "ALL OK — Supabase connection works. Dashboard should load data.";
    } else {
      const code = errors[0]?.code;
      if (code === "42P01") report.diagnosis = "TABLE MISSING — Run supabase/schema.sql in Supabase SQL Editor.";
      else if (code === "42501") report.diagnosis = "RLS BLOCKING — Re-run the policy statements in schema.sql.";
      else report.diagnosis = `Error code: ${code} — see table results above.`;
    }
  } catch (err) {
    report.fatal_error = String(err);
    report.diagnosis = "Crash while connecting to Supabase.";
  }

  return NextResponse.json(report);
}
