import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email");
    if (!email || !email.includes("@")) {
      return NextResponse.json({ tickets: [] });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tickets")
      .select("id, ticket_number, subject, status, created_at")
      .eq("customer_email", email.toLowerCase().trim())
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      console.error("[customer-history]", error.message);
      return NextResponse.json({ tickets: [] });
    }

    return NextResponse.json({ tickets: data ?? [] });
  } catch (err) {
    console.error("[customer-history] fatal:", err);
    return NextResponse.json({ tickets: [] });
  }
}
