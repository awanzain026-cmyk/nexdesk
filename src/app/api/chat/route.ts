import { NextRequest, NextResponse } from "next/server";
import { processMessage } from "@/lib/agents";

export async function POST(req: NextRequest) {
  try {
    const { message, history, offTopicCount, ticketId } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    const result = await processMessage(message, history ?? [], offTopicCount ?? 0);

    return NextResponse.json({
      response: result.response,
      agentName: result.agentName,
      offTopicCount: result.offTopicCount,
      ticketId: ticketId ?? `TKT-${Date.now().toString(36).toUpperCase()}`,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error", response: "Something went wrong. Please try again.", agentName: "Support Agent" },
      { status: 500 }
    );
  }
}
