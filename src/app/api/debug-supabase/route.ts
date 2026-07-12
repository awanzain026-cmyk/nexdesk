import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  const report: Record<string, unknown> = {};

  report.env_vars = {
    NEXT_PUBLIC_SUPABASE_URL:      process.env.NEXT_PUBLIC_SUPABASE_URL      ? "present" : "MISSING",
    SUPABASE_URL:                  process.env.SUPABASE_URL                  ? "present" : "MISSING",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "present" : "MISSING",
    SUPABASE_ANON_KEY:             process.env.SUPABASE_ANON_KEY             ? "present" : "MISSING",
    SUPABASE_SERVICE_ROLE_KEY:     process.env.SUPABASE_SERVICE_ROLE_KEY     ? "present" : "MISSING",
    AUTH_SECRET:                   process.env.AUTH_SECRET                   ? "present" : "MISSING (using fallback)",
    resolved_url: (process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "NONE").slice(0, 50),
    key_used: process.env.SUPABASE_SERVICE_ROLE_KEY ? "service_role" : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "anon" : "NONE",
  };

  try {
    const supabase = createAdminClient();

    const [ticketsTest, activityTest, messagesTest] = await Promise.all([
      supabase.from("tickets").select("id", { count: "exact", head: true }),
      supabase.from("agent_activity").select("id", { count: "exact", head: true }),
      supabase.from("ticket_messages").select("id", { count: "exact", head: true }),
    ]);

    report.tables = {
      tickets:         ticketsTest.error  ? { ok: false, error: ticketsTest.error.message,  code: ticketsTest.error.code  } : { ok: true, rows: ticketsTest.count },
      agent_activity:  activityTest.error ? { ok: false, error: activityTest.error.message, code: activityTest.error.code } : { ok: true, rows: activityTest.count },
      ticket_messages: messagesTest.error ? { ok: false, error: messagesTest.error.message, code: messagesTest.error.code } : { ok: true, rows: messagesTest.count },
    };

    const allOk = !ticketsTest.error && !activityTest.error && !messagesTest.error;

    if (allOk) {
      report.diagnosis = "ALL OK — Supabase connected, all tables accessible. Dashboard should load.";
    } else {
      const codes = [ticketsTest.error?.code, activityTest.error?.code].filter(Boolean);
      if (codes.includes("42P01")) report.diagnosis = "TABLE MISSING — Re-run supabase/schema.sql in Supabase SQL Editor.";
      else if (codes.includes("42501")) report.diagnosis = "RLS BLOCKING — Service role key should bypass RLS. Check SUPABASE_SERVICE_ROLE_KEY is set.";
      else report.diagnosis = "Query error — see tables object above for details.";
    }
  } catch (err) {
    report.fatal = String(err);
    report.diagnosis = "Cannot connect to Supabase. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel env vars.";
  }

  return Response.json(report);
}
