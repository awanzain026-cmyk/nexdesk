-- Seed data for NexDesk demo
-- Run in Supabase SQL Editor after schema.sql
-- Creates realistic demo tickets and activity

INSERT INTO tickets (ticket_number, customer_name, customer_email, subject, type, status, priority, agent_handled, order_id, created_at, updated_at) VALUES
  ('TKT-A3X9', 'Sarah Chen', 'sarah@email.com', 'iPhone 15 Pro screen flickering after 2 weeks', 'warranty', 'open', 'high', 'Replacement Agent', 'ORD-TV4821', now() - interval '12 minutes', now()),
  ('TKT-B7K2', 'Marcus Williams', 'marcus@email.com', 'Return request for MacBook Air M3 - Changed mind', 'return', 'in_progress', 'medium', 'Returns Agent', 'ORD-MB7321', now() - interval '35 minutes', now() - interval '10 minutes'),
  ('TKT-C1M5', 'Aisha Patel', 'aisha@email.com', 'Galaxy S24 Ultra order tracking not updating', 'tracking', 'resolved', 'low', 'Support Agent', 'ORD-GS5412', now() - interval '2 hours', now() - interval '1 hour'),
  ('TKT-D4R8', 'James O''Brien', 'james@email.com', 'Sony WH-1000XM5 won''t pair with new laptop', 'general', 'open', 'medium', 'Support Agent', NULL, now() - interval '4 hours', now() - interval '4 hours'),
  ('TKT-E9P3', 'Fatima Al-Rashid', 'fatima@email.com', 'AirPods Pro 2 warranty claim - crackling noise', 'warranty', 'escalated', 'urgent', 'Escalation Agent', 'ORD-AP2211', now() - interval '6 hours', now() - interval '3 hours'),
  ('TKT-F2X1', 'David Kim', 'david@email.com', 'What is the return policy for opened products?', 'general', 'resolved', 'low', 'Policy Agent', NULL, now() - interval '8 hours', now() - interval '7 hours'),
  ('TKT-G5K3', 'Luna Zhang', 'luna@email.com', 'Dell XPS 15 replacement - dead pixels on display', 'replacement', 'in_progress', 'high', 'Replacement Agent', 'ORD-DX7812', now() - interval '10 hours', now() - interval '2 hours'),
  ('TKT-H8R2', 'Omar Hassan', 'omar@email.com', 'Comparing iPhone 15 PM vs Samsung Galaxy S24 Ultra specs', 'general', 'closed', 'low', 'Catalog Agent', NULL, now() - interval '1 day', now() - interval '1 day')
ON CONFLICT (ticket_number) DO NOTHING;

INSERT INTO agent_activity (agent_name, action, ticket_number, created_at) VALUES
  ('Triage Orchestrator', 'New ticket opened: iPhone 15 Pro screen flickering after 2 weeks...', 'TKT-A3X9', now() - interval '12 minutes'),
  ('Replacement Agent', 'Responded to customer message', 'TKT-A3X9', now() - interval '10 minutes'),
  ('Returns Agent', 'Checking return eligibility for MacBook Air M3', 'TKT-B7K2', now() - interval '30 minutes'),
  ('Returns Agent', 'Approved return request - label sent', 'TKT-B7K2', now() - interval '25 minutes'),
  ('Support Agent', 'Marked ticket as resolved - tracking updated', 'TKT-C1M5', now() - interval '1 hour'),
  ('Support Agent', 'Guiding customer through Bluetooth pairing steps', 'TKT-D4R8', now() - interval '3 hours'),
  ('Escalation Agent', 'Escalated warranty claim - priority review initiated', 'TKT-E9P3', now() - interval '4 hours'),
  ('Escalation Agent', 'Offered goodwill discount: 10% off next purchase', 'TKT-E9P3', now() - interval '2 hours'),
  ('Policy Agent', 'Provided detailed return policy explanation', 'TKT-F2X1', now() - interval '7 hours'),
  ('Policy Agent', 'Policy clarifications sent via email', 'TKT-F2X1', now() - interval '6 hours'),
  ('Replacement Agent', 'Verified warranty status for Dell XPS 15', 'TKT-G5K3', now() - interval '9 hours'),
  ('Replacement Agent', 'Replacement approved - shipping in 2-3 days', 'TKT-G5K3', now() - interval '8 hours'),
  ('Catalog Agent', 'Provided detailed comparison of iPhone 15 Pro Max vs Galaxy S24 Ultra', 'TKT-H8R2', now() - interval '23 hours'),
  ('Catalog Agent', 'Sent spec sheet PDF to customer', 'TKT-H8R2', now() - interval '22 hours');
