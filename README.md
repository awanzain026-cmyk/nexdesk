# NexDesk — AI Customer Support Platform

Enterprise-grade multi-agent AI customer support platform built for TechVault electronics store. 8 specialized AI agents handle every support scenario with precision, speed, and guardrails.

## Live Demo
Deploy to Vercel and visit `/chat` to interact with all 8 agents.

## Features

- **8 AI Agents** — Triage, Support, Inventory, Catalog, Policy, Returns, Replacement & Escalation
- **Smart Guardrails** — Agents only answer support-related questions
- **Real-time Analytics** — Live dashboards with Recharts visualizations
- **Ticket Management** — Priority scoring, routing, and status tracking
- **Product Catalog** — 18 TechVault electronics products with full specs
- **Premium UI** — Void black design with cyan/violet accents, Framer Motion animations

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Framework  | Next.js 16 (App Router)           |
| Styling    | Tailwind CSS v4 + Custom Design System |
| Animation  | Framer Motion                     |
| Charts     | Recharts                          |
| Database   | Supabase (PostgreSQL)             |
| AI Backend | Sodeom API (Free, GPT-4o)         |
| Fonts      | Geist Sans + Geist Mono           |
| Icons      | Lucide React                      |

## Setup

### 1. Clone & Install
```bash
git clone https://github.com/awanzain026-cmyk/nexdesk
cd nexdesk
npm install
```

### 2. Environment Variables
```bash
cp .env.local.example .env.local
```
Fill in your Supabase URL and anon key from [supabase.com](https://supabase.com).

`SODEOM_API_KEY` is already set to `free` — no API key needed for Sodeom.

### 3. Run Locally
```bash
npm run dev
```
Visit `http://localhost:3000`

## Deployment (Vercel)

1. Push to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SODEOM_API_KEY` = `free`
4. Deploy

## Project Structure

```
src/
├── app/
│   ├── (auth)/          — Login & signup pages
│   ├── (dashboard)/     — Protected dashboard routes
│   │   ├── dashboard/   — Main overview
│   │   ├── tickets/     — Ticket management
│   │   ├── chat/        — AI chat interface
│   │   ├── products/    — Product catalog
│   │   ├── analytics/   — Analytics dashboard
│   │   └── settings/    — Platform settings
│   ├── api/chat/        — Multi-agent AI endpoint
│   └── page.tsx         — Landing page
├── components/
│   ├── ui/              — Design system components
│   └── layout/          — Sidebar navigation
├── lib/
│   ├── agents/          — 8 AI agent system
│   ├── data/            — Product catalog & policies
│   └── supabase/        — Database client
└── types/               — TypeScript definitions
```

## AI Agents

| Agent | Specialty |
|-------|-----------|
| Triage Orchestrator | Routes tickets to correct agent |
| Support Agent | General inquiries |
| Inventory Agent | Stock & availability |
| Catalog Agent | Product specs & comparisons |
| Policy Agent | Returns, warranty & shipping rules |
| Returns Agent | Return request processing |
| Replacement Agent | Defect & damage replacements |
| Escalation Agent | Complex unresolved cases |

---

Built by Zain Awan · NexDesk v1.0
