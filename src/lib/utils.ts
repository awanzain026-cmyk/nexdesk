import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { TicketStatus, TicketPriority, TicketType, OrderStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
}

export function formatRelativeTime(date: string): string {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

export function generateTicketNumber(): string {
  return `TKT-${Date.now().toString(36).toUpperCase()}`;
}

export function generateOrderNumber(): string {
  return `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

export function getTicketStatusColor(status: TicketStatus): string {
  const map: Record<TicketStatus, string> = {
    open:        "badge-cyan",
    in_progress: "badge-violet",
    resolved:    "badge-green",
    closed:      "badge-gray",
    escalated:   "badge-rose",
  };
  return map[status] ?? "badge-gray";
}

export function getTicketPriorityColor(priority: TicketPriority): string {
  const map: Record<TicketPriority, string> = {
    low:    "badge-gray",
    medium: "badge-amber",
    high:   "badge-rose",
    urgent: "badge-rose",
  };
  return map[priority] ?? "badge-gray";
}

export function getOrderStatusColor(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    pending:    "badge-gray",
    processing: "badge-amber",
    shipped:    "badge-violet",
    delivered:  "badge-green",
    cancelled:  "badge-rose",
    returned:   "badge-cyan",
  };
  return map[status] ?? "badge-gray";
}

export function getTicketTypeLabel(type: TicketType): string {
  const map: Record<TicketType, string> = {
    return:      "Return",
    replacement: "Replacement",
    warranty:    "Warranty",
    tracking:    "Tracking",
    general:     "General",
    complaint:   "Complaint",
  };
  return map[type] ?? type;
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + "…" : str;
}

export function getInitials(name: string): string {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}
