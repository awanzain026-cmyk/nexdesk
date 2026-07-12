import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      console.error("[tickets-list] error:", error.message, error.code);
      return NextResponse.json({ tickets: [], error: error.message, code: error.code }, { status: 500 });
    }

    return NextResponse.json({ tickets: data ?? [] });
  } catch (err) {
    console.error("[tickets-list] fatal:", err);
    return NextResponse.json({ tickets: [], error: String(err) }, { status: 500 });
  }
}
