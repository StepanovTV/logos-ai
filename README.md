# LOGOS AI — Synthetic Dialectic

Analytical web platform for structured debates between two autonomous AI agents (Agent Alpha and Agent Beta). Configure personas, models, and debate parameters, then visualize the dialectic exchange and joint consensus.

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** + **Framer Motion**
- **PostgreSQL 15** (Docker) + **Prisma 6**
- **Vercel AI SDK** + **OpenRouter** (planned for live debate streaming)

## Prerequisites

- Node.js 20+
- Docker (for local PostgreSQL)

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env

# 3. Start database, run migrations, seed data
npm run db:setup

# 4. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `OPENROUTER_API_KEY` | No (Phase 2+) | OpenRouter API key for live AI debate streaming |

Copy `.env.example` to `.env`. The app starts without `OPENROUTER_API_KEY`; it is validated only when AI routes are invoked.

## Database Commands

| Command | Description |
|---------|-------------|
| `npm run db:setup` | Start Postgres + migrate + seed |
| `npm run db:start` | Start Docker container |
| `npm run db:stop` | Stop Docker container |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed from `src/fixtures/*.json` |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:reset` | Destroy volume and restart |

Database connection: `postgresql://logos:logos_pass@localhost:5432/logos_db`

## Routes

| Route | Description |
|-------|-------------|
| `/` | Command Center — configure and start a debate |
| `/session/[id]` | Active or completed debate view |
| `/history` | Battle history with search |
| `/models` | Model registry |

## Project Structure

```
src/
├── app/              # Pages (App Router)
├── actions/          # Server Actions
├── components/       # UI components by feature
├── lib/              # Prisma client, mappers, DB helpers
├── fixtures/         # JSON seed data
├── types/            # Domain types
prisma/               # Schema, migrations, seed
DB/                   # Docker Compose for PostgreSQL
```

## Documentation

| File | Purpose |
|------|---------|
| `AGENTS.md` | AI agent guidelines, architecture, DB schema |
| `logos_ai_project_brief.md` | Product brief with implementation status |
| `logos_ai_implementation_plan.md` | Step-by-step implementation plan |
| `DESIGN.md` | Design system tokens and visual language |

## Scripts

```bash
npm run dev       # Development server
npm run build     # Production build
npm run start     # Production server
npm run lint      # ESLint
```
