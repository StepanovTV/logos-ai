# LOGOS AI – Synthetic Dialectic

## Project Overview

LOGOS AI is an analytical web application for configuring and visualizing structured debates between two autonomous AI agents (Agent Alpha and Agent Beta). The platform focuses on adversarial neural synthesis — resolving complex logical conflicts through dialectic exchange and joint consensus.

**Current state:** UI shell, PostgreSQL persistence, session initialization, and archive browsing are implemented. Real-time AI debate streaming is not yet wired up (Vercel AI SDK dependencies are installed but unused).

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 4, Framer Motion |
| Database | PostgreSQL 15 (Docker), Prisma 6 |
| AI (planned) | Vercel AI SDK (`ai`) + OpenRouter (`@openrouter/ai-sdk-provider`) |
| Icons | `lucide-react` |

---

## Commands

```bash
# App
npm install
npm run dev          # http://localhost:3000
npm run build
npm run lint

# Database (Docker + Prisma)
npm run db:setup     # start Postgres, migrate, seed
npm run db:start     # docker-compose up
npm run db:stop
npm run db:migrate   # prisma migrate dev
npm run db:seed      # prisma db seed
npm run db:studio    # Prisma Studio GUI
npm run db:reset     # destroy volume and restart
```

**Environment:** copy `.env.example` → `.env`. Variables:

```
DATABASE_URL="postgresql://logos:logos_pass@localhost:5432/logos_db?schema=public"
OPENROUTER_API_KEY=""   # optional until Phase 2 (AI debate streaming)
```

`DATABASE_URL` is required. `OPENROUTER_API_KEY` is validated only when AI routes are invoked — the app starts without it.

---

## Application Routes

| Route | Type | Data source | Description |
|-------|------|-------------|-------------|
| `/` | Server Component | `Model`, `AppSetting` | Command Center — debate configuration form |
| `/session/[id]` | Server Component | `DebateSession`, `DebateMessage` | Active or completed debate view |
| `/history` | Server Component | `ArchiveSession` | Battle history grid with search + status filter |
| `/models` | Server Component | `Model`, `AppSetting` | Model registry UI — toggle persisted via server action |

All data pages use `export const dynamic = "force-dynamic"`.

---

## Architecture

### Directory Layout

```
src/
├── app/                    # App Router pages
│   ├── page.tsx            # Command Center
│   ├── history/page.tsx
│   ├── models/page.tsx
│   ├── session/[id]/page.tsx
│   ├── layout.tsx
│   └── error.tsx
├── actions/
│   ├── debate.ts           # Server Action: initializeBreach
│   └── models.ts           # Server Action: toggleModelActive
├── components/
│   ├── brand/              # SpitballLogo
│   ├── errors/             # DatabaseErrorView, RouteErrorView
│   ├── features/           # CommandCenterForm, AgentConfigPanel
│   ├── history/            # HistoryView, ArchiveCard
│   ├── layout/             # Sidebar, PageShell, TopNav, PlaceholderPage
│   ├── models/             # ModelsView, ModelCard
│   ├── session/            # AgentStatusCard, DiscussionHistory, JointDecisionTerminal, MessageLog
│   └── ui/                 # GlassCard, NeonButton
├── constants/              # debateDefaults, models
├── lib/
│   ├── prisma.ts           # Prisma client singleton
│   ├── with-database.ts    # DB error wrapper
│   ├── db-errors.ts        # DatabaseConnectionError
│   └── mappers.ts          # Prisma → domain type mappers
├── fixtures/               # JSON seed sources for prisma/seed.ts
├── types/                  # debate.ts, history.ts, models.ts
prisma/
├── schema.prisma
├── seed.ts                 # Seeds from src/fixtures/*.json
└── migrations/
DB/
├── docker-compose.yml      # Postgres 15 container
└── package.json            # db:start / db:stop scripts
```

### Server vs Client

- **Server Components** — page data fetching via Prisma; wrap calls in `withDatabase()`.
- **Client Components** (`"use client"`) — forms, navigation, search/filter UI, model toggle state.
- **Server Actions** — `initializeBreach` creates sessions; `toggleModelActive` persists model registry toggles.

### AI Integration (not yet implemented)

Planned location: `src/app/api/debate/route.ts` using Vercel AI SDK streaming. Client hooks (`useChat` / `useCompletion`) will manage the live debate stream on the session page.

API key validation stub: `src/lib/ai/openrouter.ts` — `getOpenRouterApiKey()` throws `OpenRouterNotConfiguredError` when called without a key.

---

## Database Schema

PostgreSQL via Prisma. Docker container: `logos_postgres` on port `5432`.

```mermaid
erDiagram
    DebateSession ||--o{ DebateMessage : "has messages"
    DebateSession ||--o| ArchiveSession : "linked archive"

    AppSetting {
        string key PK
        json value
    }

    Model {
        string id PK
        string name
        string provider
        string icon
        boolean active
        string accent
        string paramCount
        string contextWindow
        string releaseDate
        string reasoningStyle
    }

    DebateSession {
        string sessionId PK
        string topic
        string status
        string alphaName
        string alphaFramework
        string alphaStatus
        string betaName
        string betaFramework
        string betaStatus
        string jointDecisionText
        int alphaAgreement
        int betaAgreement
        int iterations
        string initiator
        string alphaModelId
        string betaModelId
        int currentTurn
        datetime startedAt
        datetime completedAt
    }

    DebateMessage {
        string id PK
        string sessionId FK
        string agent
        string timestamp
        int confidence
        string text
        string[] evidence
    }

    ArchiveSession {
        string id PK
        string debateSessionId FK "unique, nullable"
        string status
        string category
        string date
        string title
        string agentAlpha
        string agentBeta
        string winner
        string resolution
        int nodes
        string cpu
        string error
    }
```

### Model Descriptions

| Model | Purpose |
|-------|---------|
| `AppSetting` | Key-value JSON store (`registry` → maxActiveNodes; `defaultDebate` planned) |
| `Model` | LLM registry — metadata for agent model selection on Command Center |
| `DebateSession` | Core debate record — topic, agent configs, status, debate config (`iterations`, `initiator`, model IDs, turn tracking), joint decision |
| `DebateMessage` | Individual exchange in a debate (cascade delete with session) |
| `ArchiveSession` | History card summary — lifecycle `status`, outcome `winner`, links to `DebateSession` |

### Session Lifecycle

1. User submits Command Center form → `initializeBreach` server action.
2. Transaction creates `ArchiveSession` (`status: initialized`, `category: UNCLASSIFIED`, winner `pending`) and `DebateSession` (`status: initialized`).
3. `ArchiveSession.debateSessionId` is set to link both records.
4. Redirect to `/session/{sessionId}`.
5. On completion (planned): update status, messages, joint decision, archive winner/resolution.

### Seed Data

`prisma/seed.ts` populates from `src/fixtures/*.json`:
- `models.json` → `Model` + `AppSetting.registry`
- `historyData.json` → `ArchiveSession` + linked `DebateSession` + `DebateMessage`
- `debateSession.json` → sample active session with full message history

---

## Design System Rules (CRITICAL)

Always adhere to the "Synthetic Dialectic" visual language. Full token reference: `DESIGN.md`.

- **Theme:** Strict dark mode. No light mode.
- **Colors:**
  - Background/Surface: `#131316`
  - Agent Alpha: Electric Blue `#00f0ff`
  - Agent Beta: Vibrant Purple `#e9b3ff`
  - Text: `#e4e1e6` / Muted `#849495`
- **Typography:**
  - `Sora` (`font-heading`) — headings
  - `Inter` (`font-body`) — body
  - `JetBrains Mono` (`font-mono`) — labels, metadata, terminal output
- **Shapes:** Minimal rounding (4px inputs/buttons, 8px cards). No pill shapes except status badges.
- **Glassmorphism:** `backdrop-blur` + semi-transparent backgrounds + 1px `border-white/10`.

### Component Guidelines

- **Buttons:** Ghost-style, neon borders, uppercase `font-mono`. See `NeonButton`.
- **Cards:** `GlassCard` with glass effect. Alpha = left accent border; Beta = right accent border.
- **Discussion History:** Accordion-style chronological log (`DiscussionHistory`).

---

## State Management

| Context | Approach |
|---------|----------|
| Page data | Server Components + Prisma |
| Form state | `useState` in client forms |
| Debate init | Server Action + `useTransition` |
| Model toggles | Server Action `toggleModelActive` + optimistic UI |
| Live debate (planned) | Vercel AI SDK `useChat` / `useCompletion` |

Use standard React hooks (`useState`, `useRef`, `useMemo`) for local UI state. No global store.

---

## Error Handling

- `withDatabase()` wraps Prisma calls and maps connection errors to `DatabaseConnectionError`.
- `DatabaseErrorView` — retry UI shown when DB is unreachable (Command Center).
- `RouteErrorView` + `app/error.tsx` — global error boundary.
- `notFound()` on missing session IDs.

---

## Implementation Status

| Feature | Status |
|---------|--------|
| Command Center UI + form | ✅ Done |
| Session initialization (DB) | ✅ Done |
| Debate config persistence (iterations, initiator, model IDs) | ✅ Done |
| Session detail page (read-only) | ✅ Done |
| History / Archives (DB) | ✅ Done |
| History search | ✅ Done |
| History status filter | ✅ Done |
| History sort tabs | ⚠️ UI only — no sorting logic |
| Model registry page | ✅ Done (DB + persisted toggle) |
| Models from DB on Command Center | ✅ Done |
| OpenRouter API key validation stub | ✅ Done (`src/lib/ai/openrouter.ts`) |
| Real-time AI debate streaming | ❌ Not implemented |
| Log Consensus action | ❌ Not implemented |
| Settings / Support nav | ❌ Placeholder links |
| Human intervention | ❌ Roadmap |
| 3D Arena / Export | ❌ Roadmap |

---

## Conventions

- Use **App Router** (`src/app/`). Prefer Server Components for data fetching.
- Place feature components in `src/components/{feature}/`, shared UI in `src/components/ui/`.
- Map Prisma records to domain types in `src/lib/mappers.ts` — do not pass raw Prisma types to components.
- Domain types live in `src/types/`.
- Fixture JSON in `src/fixtures/` is the source of truth for seed data.
- Remove all `console.log` before committing.
