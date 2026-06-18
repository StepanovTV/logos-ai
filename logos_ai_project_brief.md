# Project Brief: LOGOS AI – Synthetic Dialectic

> **Last updated:** 2026-06-18  
> **Detailed implementation plan:** [`logos_ai_implementation_plan.md`](./logos_ai_implementation_plan.md)

---

## 1. Executive Summary

**LOGOS AI** is an analytical web application designed to facilitate and visualize structured debates between two autonomous AI agents. Users configure distinct personalities, models, and objectives for each agent, triggering adversarial neural synthesis to resolve complex logical conflicts and reach joint consensus.

**Current state:** Foundation work is complete. The app has a polished UI shell, full debate configuration persistence, archive lifecycle statuses with History filtering, and model registry with persisted toggles. Database schema is consolidated into a single init migration. The core differentiator — **live multi-agent AI debate** — remains unimplemented; Vercel AI SDK packages are installed, and only an OpenRouter API key validation stub exists.

---

## 2. Core Objectives

- **Conflict Resolution** — Sandbox for testing how different AI models and personas interact under conflicting theses.
- **Visual Analytics** — High-fidelity visualization of the debate process: confidence metrics, iteration tracking, joint decision terminal.
- **Archival Research** — Detailed history of past debates to track how model pairings resolve specific problem categories (Ethics, Epistemology, Resource Allocation, etc.).

---

## 3. User Personas

- **AI Researchers** — Benchmark model reasoning and bias under pressure.
- **Product Managers** — Test edge cases for automated decision-making systems.
- **Enthusiasts** — Explore emergent behavior in multi-agent systems.

---

## 4. Functional Requirements

### 4.1 Command Center (Initialization) — `/`

| Requirement | Status |
|-------------|--------|
| Central thesis input (textarea) | ✅ Implemented |
| Model selection per agent (from DB) | ✅ Implemented — active `Model` records only |
| Persona definition (character + goals) | ✅ Implemented |
| Iteration limit slider (1–10) | ✅ Implemented — persisted as `DebateSession.iterations` |
| Turn initiation toggle (Alpha / Beta) | ✅ Implemented — persisted as `initiator`; sets `alphaStatus` / `betaStatus` |
| "Initialize Debate" CTA | ✅ Implemented — creates DB records, redirects to session |

**Implementation:** `CommandCenterForm` → `initializeBreach` → Prisma transaction → redirect.

**Archive on init:** `ArchiveSession.status = initialized`, `category = UNCLASSIFIED`, `winner = pending`.

**Known gap:** `AppSetting.defaultDebate` is queried but not applied — defaults from `constants/debateDefaults.ts`.

### 4.2 Active Session (Real-Time Debate) — `/session/[id]`

| Requirement | Status |
|-------------|--------|
| Agent identity cards (Alpha / Beta) | ⚠️ Partial — name + framework; `active`/`idle` not rendered |
| Discussion history (accordion log) | ✅ Implemented (reads from DB) |
| Joint decision terminal | ✅ Implemented (when `jointDecisionText` exists) |
| Session status indicator | ⚠️ Header always "ACTIVE DEBATE THREAD" |
| Real-time confidence metrics | ⚠️ Static from DB/seed |
| Live AI streaming | ❌ Not implemented |
| Auto-start debate on init | ❌ Not implemented |
| Log Consensus action | ❌ Button present; `finalizeArchiveForConsensus` stub ready |

**Implementation:** Server Component + Prisma. No client streaming yet.

### 4.3 Archives (Battle History) — `/history`

| Requirement | Status |
|-------------|--------|
| Session cards with topic, agents, resolution | ✅ Implemented |
| Archive lifecycle status badges | ✅ QUEUED, LIVE, RESOLVED, TIMEOUT, FAILED, ARCHIVED |
| Outcome badges (ALPHA WON / BETA WON / DRAW) | ✅ Implemented |
| Search by title / category | ✅ Client-side filter |
| Filter by status | ✅ Filter dropdown |
| Sort tabs (Recent / Impact / Duration) | ⚠️ UI only |
| Link to session detail | ✅ Via `debateSessionId` |
| Load more archives | ⚠️ Button placeholder, no pagination |

**Implementation:** `HistoryView` — search + status filter. `ArchiveCard` — dual badges. Helpers in `src/lib/archive-lifecycle.ts`.

### 4.4 Model Registry — `/models`

| Requirement | Status |
|-------------|--------|
| Model cards with metadata | ✅ Implemented |
| Active/inactive toggle | ✅ Persisted via `toggleModelActive` |
| Max active nodes indicator | ✅ From `AppSetting.registry` |
| Load models from DB | ✅ Implemented |
| Optimistic UI on toggle | ✅ With rollback on error |

---

## 5. Design System: "Synthetic Dialectic"

Full token reference: `DESIGN.md`.

- **Theme:** Dark mode, high-contrast analytical aesthetic.
- **Colors:** Agent Alpha `#00f0ff`, Agent Beta `#e9b3ff`, Surface `#131316`.
- **Typography:** Sora (headings), Inter (body), JetBrains Mono (labels/data).
- **Visual Language:** Glass panels, neon accent borders, monospaced metadata.

---

## 6. Technical Architecture

### 6.1 Stack

```
Next.js 16 (App Router) + React 19 + TypeScript
Tailwind CSS 4 + Framer Motion
PostgreSQL 15 (Docker) + Prisma 6
pgAdmin 4 (Docker, port 5050)
Vercel AI SDK + OpenRouter (installed, stub only)
```

### 6.2 Project Structure

```
src/
├── app/                    # App Router (no api/ yet)
├── actions/                # debate.ts, models.ts
├── components/             # brand, errors, features, history, layout, models, session, ui
├── constants/              # debateDefaults, archiveStatus
├── fixtures/               # JSON seed sources
├── lib/
│   ├── ai/openrouter.ts    # API key validation stub
│   ├── archive-lifecycle.ts # Archive status transitions
│   ├── mappers.ts, prisma.ts, with-database.ts, ...
└── types/                  # debate, history, models
prisma/
├── schema.prisma
├── seed.ts
└── migrations/20260615173537_init/   # single consolidated migration
DB/                           # docker-compose (Postgres + pgAdmin)
```

### 6.3 Data Flow

```
User Form → Server Action → Prisma Transaction → Redirect
Page Load → Server Component → withDatabase(prisma.*) → Mapper → UI
```

### 6.4 Navigation

| Item | Route | Status |
|------|-------|--------|
| New Debate | `/` | ✅ |
| History | `/history` | ✅ |
| Models | `/models` | ✅ |
| Settings | `#` | Placeholder |
| Support | `#` | Placeholder |

### 6.5 Environment & Setup

```bash
cp .env.example .env
npm run db:setup    # Docker Postgres + migrate + seed
npm run dev
```

| Variable | Required | Notes |
|----------|----------|-------|
| `DATABASE_URL` | Yes | Postgres connection string |
| `OPENROUTER_API_KEY` | No (Phase 2+) | Validated on AI call via `src/lib/ai/openrouter.ts` |

**DB reset:** `npx prisma migrate reset --force` then `./node_modules/.bin/tsx prisma/seed.ts` (if auto-seed fails due to PATH).

### 6.6 Error Handling

- `withDatabase()` → `DatabaseConnectionError`
- `DatabaseErrorView`, `RouteErrorView`, `app/error.tsx`
- `normalizeArchiveStatus()` — fallback for legacy/missing status values
- `getArchiveStatusMeta()` — safe badge rendering on History cards

---

## 7. Database Schema

### 7.1 Entity Relationship

```mermaid
erDiagram
    DebateSession ||--o{ DebateMessage : messages
    DebateSession ||--o| ArchiveSession : archive

    DebateSession {
        text sessionId PK
        text topic
        text status
        int iterations
        text initiator
        text alphaModelId
        text betaModelId
        int currentTurn
        timestamp startedAt
        timestamp completedAt
    }

    ArchiveSession {
        text id PK
        text debateSessionId FK_UK
        text status
        text category
        text winner
        text resolution
    }
```

Full schema: `prisma/schema.prisma`. **Single migration:** `20260615173537_init`.

### 7.2 Archive Lifecycle Status

| Status | UI Label | When |
|--------|----------|------|
| `initialized` | QUEUED | Created, debate not started |
| `active` | LIVE | AI debate in progress (Phase 2) |
| `consensus_reached` | RESOLVED | Joint decision generated |
| `timeout` | TIMEOUT | Iteration limit / timeout |
| `failed` | FAILED | API / infrastructure error |
| `archived` | ARCHIVED | Finalized via Log Consensus (Phase 4) |

`winner` remains separate — outcome (`alpha` / `beta` / `draw` / `pending`).

### 7.3 Debate Config Fields (`DebateSession`)

| Field | Source | Purpose |
|-------|--------|---------|
| `iterations` | Slider | Max debate loop limit |
| `initiator` | Turn toggle | First speaker |
| `alphaModelId` / `betaModelId` | Model dropdowns | AI model selection |
| `currentTurn` | System | Turn counter (0 at init) |
| `startedAt` / `completedAt` | System | Debate timing |

### 7.4 Session Initialization Flow

```
initializeBreach(config)
  │
  ├─ validate thesis
  ├─ generate IDs: arch-{timestamp}, sys-{timestamp}
  │
  └─ prisma.$transaction
       ├─ create ArchiveSession (status: initialized, category: UNCLASSIFIED, winner: pending)
       ├─ create DebateSession (status: initialized, full config)
       └─ link ArchiveSession.debateSessionId
  │
  └─ redirect → /session/sys-{timestamp}
```

### 7.5 Seed Data

| Fixture | Seeds |
|---------|-------|
| `models.json` | 4 models + `AppSetting.registry` |
| `historyData.json` | 4 archives (status: archived/timeout) + linked debates |
| `debateSession.json` | Demo `sys-req-892` with full history |

---

## 8. Implementation Status Summary

### Done ✅

- UI shell, Command Center, full debate config persistence
- Single init Prisma migration (consolidated schema)
- Archive lifecycle status + History status filter + outcome badges
- `archive-lifecycle.ts`, `archiveStatus.ts`, `normalizeArchiveStatus()`
- OpenRouter API key validation stub
- Model registry with persisted toggles
- Session page (read-only SSR), History search
- DB error boundary, domain mappers, ESLint

### Partial ⚠️

- Session page — no streaming, static header, agent status not shown
- History — sort tabs UI only, no pagination
- Joint decision — "Log Consensus" non-functional (stub ready)
- `AppSetting.defaultDebate` — not applied

### Not Started ❌

- `/api/debate` + AI streaming (Phase 2–3)
- `logConsensus` server action (Phase 4)
- Settings / Support pages (Phase 6)
- Tests, custom `not-found.tsx` (Phase 7)

---

## 9. Roadmap Overview

See [`logos_ai_implementation_plan.md`](./logos_ai_implementation_plan.md).

| Phase | Focus | Status |
|-------|-------|--------|
| **1** | Schema extensions, env, debate config | ✅ Done |
| **—** | Archive Session Status + History filter | ✅ Done |
| **2** | AI integration — OpenRouter, `/api/debate`, prompts | ❌ Next |
| **3** | Live session UI — streaming, debate loop | ❌ |
| **4** | Log Consensus, archive finalization | ❌ (stub ready) |
| **5** | History sort + pagination | ⚠️ status filter done |
| **6** | Settings, Support, defaults | ❌ |
| **7** | Tests, polish, loading states | ❌ |
| **8** | Human intervention, export, 3D arena | ❌ Future |

---

## 10. Related Documents

| Document | Purpose |
|----------|---------|
| [`AGENTS.md`](./AGENTS.md) | Developer guidelines, architecture |
| [`DESIGN.md`](./DESIGN.md) | Design system tokens |
| [`logos_ai_implementation_plan.md`](./logos_ai_implementation_plan.md) | Step-by-step plan |
| [`README.md`](./README.md) | Quick start |
