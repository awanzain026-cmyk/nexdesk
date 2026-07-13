import { NextRequest, NextResponse } from "next/server";
import { processMessage } from "@/lib/agents";
import { createClient } from "@/lib/supabase/server";
import type { AgentName } from "@/types";

function generateTicketNumber(): string {
  return `TKT-${Math.random().toString(36).slice(2, 6).toUpperCase()}${Date.now().toString(36).slice(-2).toUpperCase()}`;
}

// Simple in-memory rate limit: 20 messages per 10 minutes per IP.
// Note: this resets on cold start and doesn't share state across
// serverless instances -- it's a real deterrent against casual abuse,
// not a hard guarantee. Good enough for a demo; a real production
// launch would want Upstash Redis or similar for a durable limit.
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (timestamps.length >= RATE_LIMIT) {
    requestLog.set(ip, timestamps);
    return true;
  }
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return false;
}

const AGENT_TO_TYPE: Record<AgentName, string> = {
  "Triage Orchestrator": "general",
  "Support Agent": "general",
  "Inventory Agent": "general",
  "Catalog Agent": "general",
  "Policy Agent": "general",
  "Returns Agent": "return",
  "Replacement Agent": "warranty",
  "Escalation Agent": "general",
  "Analytics Agent": "general",
};

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many messages. Please wait a few minutes and try again.", response: "You're sending messages a bit too quickly. Please wait a few minutes before continuing.", agentName: "Support Agent" },
        { status: 429 }
      );
    }

    const { message, history, offTopicCount, ticketId, customerName, customerEmail, currentAgent } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    const result = await processMessage(message, history ?? [], offTopicCount ?? 0, currentAgent);

    // Persist to Supabase -- if this fails, the chat still works for the
    // user, it just won't show up on the dashboard. Never block a real
    // customer conversation on a database hiccup.
    let realTicketId = ticketId;
    try {
      const supabase = await createClient();

      if (!realTicketId) {
        const ticketNumber = generateTicketNumber();
        const { data: newTicket, error: ticketErr } = await supabase
          .from("tickets")
          .insert({
            ticket_number: ticketNumber,
            subject: message.slice(0, 80),
            type: AGENT_TO_TYPE[result.agentName] ?? "general",
            status: "open",
            priority: "medium",
            agent_handled: result.agentName,
            off_topic_count: result.offTopicCount,
            customer_name: customerName ?? null,
            customer_email: customerEmail ?? null,
          })
          .select("id")
          .single();

        if (ticketErr) throw ticketErr;
        realTicketId = newTicket.id;

        await supabase.from("agent_activity").insert({
          agent_name: "Triage Orchestrator",
          action: `New ticket opened: ${message.slice(0, 40)}...`,
          ticket_number: ticketNumber,
        });
      } else {
        await supabase
          .from("tickets")
          .update({ agent_handled: result.agentName, updated_at: new Date().toISOString() })
          .eq("id", realTicketId);
      }

      await supabase.from("ticket_messages").insert([
        { ticket_id: realTicketId, role: "user", content: message },
        { ticket_id: realTicketId, role: "agent", agent_name: result.agentName, content: result.response },
      ]);

      await supabase.from("agent_activity").insert({
        agent_name: result.agentName,
        action: "Responded to customer message",
      });
    } catch (dbError) {
      console.error("[chat] Supabase persistence failed (chat still works, dashboard just won't reflect this):", dbError);
    }

    return NextResponse.json({
      response: result.response,
      agentName: result.agentName,
      offTopicCount: result.offTopicCount,
      ticketId: realTicketId ?? `local-${Date.now().toString(36)}`,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error", response: "Something went wrong. Please try again.", agentName: "Support Agent" },
      { status: 500 }
    );
  }
}
