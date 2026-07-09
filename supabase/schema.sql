-- Run this once in Supabase's SQL Editor (Project → SQL Editor → New Query)
-- This creates the real tables that back the dashboard. Nothing here runs
-- automatically -- Supabase needs this pasted in and run manually.

create table if not exists tickets (
  id uuid primary key default gen_random_uuid(),
  ticket_number text unique not null,
  customer_name text,
  subject text not null,
  type text not null default 'general',
  status text not null default 'open',
  priority text not null default 'medium',
  agent_handled text not null,
  off_topic_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references tickets(id) on delete cascade,
  role text not null, -- 'user' | 'agent'
  agent_name text,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists agent_activity (
  id uuid primary key default gen_random_uuid(),
  agent_name text not null,
  action text not null,
  ticket_number text,
  created_at timestamptz not null default now()
);

-- Indexes for the dashboard's common queries
create index if not exists idx_tickets_created_at on tickets (created_at desc);
create index if not exists idx_activity_created_at on agent_activity (created_at desc);
create index if not exists idx_messages_ticket_id on ticket_messages (ticket_id);

-- Row Level Security: this is a public demo app with no auth, so allow
-- anonymous read/write. If real customer auth is added later, tighten this.
alter table tickets enable row level security;
alter table ticket_messages enable row level security;
alter table agent_activity enable row level security;

create policy "public read tickets" on tickets for select using (true);
create policy "public write tickets" on tickets for insert with check (true);
create policy "public update tickets" on tickets for update using (true);

create policy "public read messages" on ticket_messages for select using (true);
create policy "public write messages" on ticket_messages for insert with check (true);

create policy "public read activity" on agent_activity for select using (true);
create policy "public write activity" on agent_activity for insert with check (true);

-- Enable realtime so the dashboard's live feed reflects genuine new activity
alter publication supabase_realtime add table agent_activity;
