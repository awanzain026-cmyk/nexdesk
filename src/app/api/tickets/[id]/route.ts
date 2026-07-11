import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const ticketRes = await supabase.from("tickets").select("*").eq("id", id).single();
    if (ticketRes.error || !ticketRes.data) {
      return NextResponse.json({ error: "Ticket not found", details: ticketRes.error?.message }, { status: 404 });
    }

    const messagesRes = await supabase
      .from("ticket_messages")
      .select("*")
      .eq("ticket_id", id)
      .order("created_at", { ascending: true });

    return NextResponse.json({
      ticket: ticketRes.data,
      messages: messagesRes.data ?? [],
    });
  } catch (err) {
    console.error("[api/tickets/[id]] GET error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await req.json();
    const supabase = await createClient();

    const { error } = await supabase
      .from("tickets")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/tickets/[id]] PATCH error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
