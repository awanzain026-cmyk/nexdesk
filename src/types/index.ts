// ─── Auth ────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: "admin" | "agent" | "customer";
  avatar_url: string | null;
  created_at: string;
}

// ─── Products ─────────────────────────────────────────────────────────────────
export type ProductCategory = "phones" | "laptops" | "headphones" | "smartwatches" | "accessories";

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number;
  stock: number;
  warranty_months: number;
  description: string;
  specs: Record<string, string>;
  image_url: string | null;
  sku: string;
  is_active: boolean;
  created_at: string;
}

// ─── Orders ───────────────────────────────────────────────────────────────────
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "returned";

export interface Order {
  id: string;
  order_number: string;
  customer_email: string;
  customer_name: string;
  product_id: string;
  product?: Product;
  quantity: number;
  total_amount: number;
  status: OrderStatus;
  shipping_address: string;
  tracking_number: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Tickets ──────────────────────────────────────────────────────────────────
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed" | "escalated";
export type TicketPriority = "low" | "medium" | "high" | "urgent";
export type TicketType = "return" | "replacement" | "warranty" | "tracking" | "general" | "complaint";

export interface Ticket {
  id: string;
  ticket_number: string;
  customer_email: string;
  customer_name: string;
  order_id: string | null;
  order?: Order;
  type: TicketType;
  status: TicketStatus;
  priority: TicketPriority;
  subject: string;
  agent_handled: AgentName | null;
  satisfaction_score: number | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
  messages?: Message[];
}

// ─── Messages ─────────────────────────────────────────────────────────────────
export type MessageRole = "user" | "agent" | "system";

export interface Message {
  id: string;
  ticket_id: string;
  role: MessageRole;
  content: string;
  agent_name: AgentName | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

// ─── Agents ───────────────────────────────────────────────────────────────────
export type AgentName =
  | "Triage Orchestrator"
  | "Support Agent"
  | "Inventory Agent"
  | "Catalog Agent"
  | "Policy Agent"
  | "Returns Agent"
  | "Replacement Agent"
  | "Escalation Agent"
  | "Analytics Agent";

export type AgentStatus = "idle" | "thinking" | "responding" | "error";

export interface Agent {
  name: AgentName;
  description: string;
  color: string;
  icon: string;
  status: AgentStatus;
  ticketsHandled: number;
}

// ─── Analytics ────────────────────────────────────────────────────────────────
export interface AnalyticsSnapshot {
  id: string;
  date: string;
  total_tickets: number;
  resolved_tickets: number;
  avg_response_time_minutes: number;
  satisfaction_score: number;
  top_issue_type: TicketType;
  tickets_by_type: Record<TicketType, number>;
  tickets_by_priority: Record<TicketPriority, number>;
}

export interface DashboardStats {
  total_tickets: number;
  open_tickets: number;
  resolved_today: number;
  avg_satisfaction: number;
  resolution_rate: number;
  tickets_delta: number;
  satisfaction_delta: number;
}

// ─── Returns ──────────────────────────────────────────────────────────────────
export type ReturnStatus = "pending" | "approved" | "rejected" | "completed";
export type ReturnReason = "defective" | "wrong_item" | "not_as_described" | "changed_mind" | "damaged_shipping" | "other";

export interface ReturnRequest {
  id: string;
  ticket_id: string;
  order_id: string;
  reason: ReturnReason;
  status: ReturnStatus;
  refund_amount: number | null;
  notes: string | null;
  approved_at: string | null;
  created_at: string;
}

// ─── Chat Session ─────────────────────────────────────────────────────────────
export interface ChatSession {
  ticketId: string | null;
  messages: ChatMessage[];
  isLoading: boolean;
  currentAgent: AgentName | null;
  offTopicCount: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  agentName?: AgentName;
  timestamp: string;
}
