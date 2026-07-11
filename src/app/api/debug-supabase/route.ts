import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Visit this URL directly in a browser to get an exact diagnosis of
// what's wrong with the Supabase connection -- no Vercel log-digging
// required. Safe to leave in a demo project; remove before a real
// production launch since it reveals infrastructure details.
export async function GET() {
  const report: Record<string, unknown> = {};

  report.env_vars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL
      ? `present (${process.env.NEXT_PUBLIC_SUPABASE_URL.slice(0, 30)}...)`
      : "MISSING",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ? `present (${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length} chars)`
      : "MISSING",
  };

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    report.diagnosis = "STOP HERE: env vars are missing at runtime. Go to Vercel -> Settings -> Environment Variables, confirm both exist with the Production checkbox ticked, then redeploy.";
    return NextResponse.json(report, { status: 200 });
  }

  try {
    const supabase = await createClient();

    // Step 1: can we even reach Supabase and does the 'tickets' table exist?
    const readTest = await supabase.from("tickets").select("id", { count: "exact", head: true });
    report.step1_read_tickets_table = readTest.error
      ? { ok: false, error: readTest.error.message, code: readTest.error.code, hint: readTest.error.hint }
      : { ok: true, existing_row_count: readTest.count };

    // Step 2: can we actually write to it? (inserts then deletes a throwaway row)
    const testTicketNumber = `DEBUG-${Date.now()}`;
    const writeTest = await supabase
      .from("tickets")
      .insert({
        ticket_number: testTicketNumber,
        subject: "Diagnostic test row -- safe to ignore",
        type: "general",
        status: "open",
        priority: "low",
        agent_handled: "Support Agent",
      })
      .select("id")
      .single();

    report.step2_write_test_ticket = writeTest.error
      ? { ok: false, error: writeTest.error.message, code: writeTest.error.code, hint: writeTest.error.hint }
      : { ok: true, inserted_id: writeTest.data?.id };

    // Clean up the test row if it was created
    if (writeTest.data?.id) {
      await supabase.from("tickets").delete().eq("id", writeTest.data.id);
      report.step3_cleanup = "test row deleted";
    }

    // Step 3: does agent_activity table exist too?
    const activityTest = await supabase.from("agent_activity").select("id", { count: "exact", head: true });
    report.step4_read_activity_table = activityTest.error
      ? { ok: false, error: activityTest.error.message, code: activityTest.error.code }
      : { ok: true, existing_row_count: activityTest.count };

    // Final diagnosis
    if (readTest.error || writeTest.error) {
      const err = readTest.error || writeTest.error;
      if (err?.code === "42P01") {
        report.diagnosis = "TABLE DOES NOT EXIST. You need to run supabase/schema.sql in your Supabase project's SQL Editor -- it has not been run yet. This is almost certainly the entire cause of the zero-data issue.";
      } else if (err?.code === "42501" || err?.message?.toLowerCase().includes("policy")) {
        report.diagnosis = "ROW LEVEL SECURITY is blocking this. The RLS policies from schema.sql may not have been applied, or were modified. Re-check the 'create policy' statements at the bottom of schema.sql were run.";
      } else {
        report.diagnosis = `Something else is wrong -- see the exact error message above (code: ${err?.code}).`;
      }
    } else {
      report.diagnosis = "Everything works. Reading and writing to Supabase both succeeded. If the dashboard still shows zero, the issue is in how the dashboard displays data, not the database connection -- come back and report this exact result.";
    }

    return NextResponse.json(report, { status: 200 });
  } catch (err) {
    report.fatal_error = String(err);
    report.diagnosis = "Unexpected crash while testing the connection -- see fatal_error above.";
    return NextResponse.json(report, { status: 200 });
  }
}
