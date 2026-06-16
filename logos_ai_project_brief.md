# Project Brief: LOGOS AI – Synthetic Dialectic

## 1. Executive Summary

**LOGOS AI** is an analytical web application designed to facilitate and visualize structured debates between two autonomous AI agents. Users configure distinct personalities, models, and objectives for each agent, triggering adversarial neural synthesis to resolve complex logical conflicts and reach joint consensus.

The application is built as a Next.js monolith with PostgreSQL persistence. The UI shell, database layer, session initialization, and archive browsing are in place. Real-time AI debate execution via the Vercel AI SDK is the next major milestone.

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
| Model selection per agent (from DB) | ✅ Implemented |
| Persona definition (character + goals) | ✅ Implemented |
| Iteration limit slider (1–10) | ✅ Implemented |
| Turn initiation toggle (Alpha / Beta) | ✅ Implemented |
| "Initialize Debate" CTA | ✅ Implemented — creates DB records, redirects to session |

**Implementation:** `CommandCenterForm` (client) → `initializeBreach` server action → Prisma transaction.

### 4.2 Active Session (Real-Time Debate) — `/session/[id]`

| Requirement | Status |
|-------------|--------|
| Agent identity cards (Alpha / Beta) | ✅ Implemented |
| Discussion history (accordion log) | ✅ Implemented (reads from DB) |
| Joint decision terminal | ✅ Implemented (shown when `jointDecisionText` exists) |
| Real-time confidence metrics | ⚠️ Static from seed data |
| Live AI streaming | ❌ Not implemented |
| Log Consensus action | ❌ Not implemented |

**Implementation:** Server Component loads `DebateSession` + `DebateMessage` via Prisma.

### 4.3 Archives (Battle History) — `/history`

| Requirement | Status |
|-------------|--------|
| Session cards with topic, agents, resolution | ✅ Implemented |
| Search by title / category | ✅ Implemented |
| Filter by topic, impact, duration | ⚠️ Sort tabs UI only |
| Link to session detail | ✅ Via `debateSessionId` on `ArchiveCard` |
| Load more archives | ⚠️ Button present, no pagination |

**Implementation:** Server Component loads `ArchiveSession` records ordered by date.

### 4.4 Model Registry — `/models`

| Requirement | Status |
|-------------|--------|
| Model cards with metadata | ✅ Implemented |
| Active/inactive toggle | ⚠️ Client state only — not persisted |
| Max active nodes indicator | ✅ Implemented (from mock) |
| Load models from DB | ❌ Page still uses `mocks/models` |

---

## 5. Design System: "Synthetic Dialectic"

Full token reference: `DESIGN.md`.

- **Theme:** Dark mode, high-contrast analytical aesthetic.
- **Color Palette:**
  - Primary (Agent Alpha): `#00f0ff` (Cyan)
  - Secondary (Agent Beta): `#e9b3ff` (Purple)
  - Surface: `#131316` with glassmorphism overlays
- **Typography:** Sora (headings), Inter (body), JetBrains Mono (labels/data).
- **Visual Language:** Glass panels, neon accent borders, grid layouts, monospaced metadata.
- **Layout:** Fixed 280px sidebar, fluid main content, collapsible mobile nav.

---

## 6. Technical Architecture

### 6.1 Stack

```
Next.js 16 (App Router) + React 19 + TypeScript
Tailwind CSS 4 + Framer Motion
PostgreSQL 15 (Docker) + Prisma 6
Vercel AI SDK + OpenRouter (installed, not wired)
```

### 6.2 Data Flow

```
User Form → Server Action → Prisma Transaction → Redirect
Page Load → Server Component → withDatabase(prisma.*) → Mapper → UI
```

### 6.3 Navigation

| Item | Route | Status |
|------|-------|--------|
| New Debate | `/` | ✅ |
| History | `/history` | ✅ |
| Models | `/models` | ✅ |
| Settings | `#` | Placeholder |
| Support | `#` | Placeholder |

### 6.4 Environment & Setup

```bash
cp .env.example .env
npm run db:setup    # Docker Postgres + migrate + seed
npm run dev
```

Docker Postgres credentials: `logos / logos_pass`, database `logos_db`, port `5432`.

---

## 7. Database Schema

### 7.1 Entity Relationship

```mermaid
erDiagram
    DebateSession ||--o{ DebateMessage : messages
    DebateSession ||--o| ArchiveSession : archive

    AppSetting {
        text key PK
        jsonb value
    }

    Model {
        text id PK
        text name
        text provider
        text icon
        boolean active
        text accent
        text paramCount
        text contextWindow
        text releaseDate
        text reasoningStyle
    }

    DebateSession {
        text sessionId PK
        text topic
        text status
        text alphaName
        text alphaFramework
        text alphaStatus
        text betaName
        text betaFramework
        text betaStatus
        text jointDecisionText
        int alphaAgreement
        int betaAgreement
    }

    DebateMessage {
        text id PK
        text sessionId FK
        text agent
        text timestamp
        int confidence
        text text
        text_array evidence
    }

    ArchiveSession {
        text id PK
        text debateSessionId FK_UK
        text category
        text date
        text title
        text agentAlpha
        text agentBeta
        text winner
        text resolution
        int nodes
        text cpu
        text error
    }
```

### 7.2 Tables

#### `AppSetting`

Key-value JSON configuration store.

| Column | Type | Notes |
|--------|------|-------|
| `key` | `TEXT` PK | e.g. `registry`, `defaultDebate` |
| `value` | `JSONB` | Arbitrary JSON payload |

#### `Model`

LLM registry for agent model selection.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `TEXT` PK | e.g. `gpt-4o`, `claude-3.5-sonnet` |
| `name` | `TEXT` | Display name |
| `provider` | `TEXT` | e.g. OpenAI, Anthropic |
| `icon` | `TEXT` | Icon identifier |
| `active` | `BOOLEAN` | Available for deployment |
| `accent` | `TEXT?` | Optional accent color |
| `paramCount` | `TEXT` | e.g. `1.8T` |
| `contextWindow` | `TEXT` | e.g. `128k` |
| `releaseDate` | `TEXT` | e.g. `2024.05` |
| `reasoningStyle` | `TEXT` | e.g. `Analytical` |

#### `DebateSession`

Core debate record.

| Column | Type | Notes |
|--------|------|-------|
| `sessionId` | `TEXT` PK | e.g. `sys-1718553600000` |
| `topic` | `TEXT` | Central thesis |
| `status` | `TEXT` | `initialized`, `consensus_reached`, `timeout` |
| `alphaName` | `TEXT` | e.g. `Agent Alpha · gpt-4o` |
| `alphaFramework` | `TEXT` | Character + goals |
| `alphaStatus` | `TEXT` | `active`, `idle` |
| `betaName` | `TEXT` | |
| `betaFramework` | `TEXT` | |
| `betaStatus` | `TEXT` | |
| `jointDecisionText` | `TEXT?` | Consensus output |
| `alphaAgreement` | `INT?` | 0–100 |
| `betaAgreement` | `INT?` | 0–100 |

#### `DebateMessage`

Individual exchange within a debate. Cascade-deleted with parent session.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `TEXT` PK | |
| `sessionId` | `TEXT` FK → `DebateSession` | |
| `agent` | `TEXT` | `alpha` or `beta` |
| `timestamp` | `TEXT` | Display timestamp e.g. `00:08` |
| `confidence` | `INT` | 0–100 |
| `text` | `TEXT` | Message content |
| `evidence` | `TEXT[]` | Evidence tags |

#### `ArchiveSession`

History summary card. Optionally linked to a `DebateSession`.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `TEXT` PK | e.g. `arch-1718553600000` |
| `debateSessionId` | `TEXT?` FK UK → `DebateSession` | Nullable, unique |
| `category` | `TEXT` | e.g. `ETHICS`, `ACTIVE` |
| `date` | `TEXT` | e.g. `2024.06.16` |
| `title` | `TEXT` | Debate topic |
| `agentAlpha` | `TEXT` | Agent display name |
| `agentBeta` | `TEXT` | |
| `winner` | `TEXT` | `alpha`, `beta`, `draw`, `pending` |
| `resolution` | `TEXT` | Resolution summary |
| `nodes` | `INT?` | Resource usage |
| `cpu` | `TEXT?` | e.g. `12.4s` |
| `error` | `TEXT?` | Error message if failed |

### 7.3 Session Initialization Flow

```
initializeBreach(config)
  │
  ├─ validate thesis
  ├─ generate IDs: arch-{timestamp}, sys-{timestamp}
  │
  └─ prisma.$transaction
       ├─ create ArchiveSession (ACTIVE, pending)
       ├─ create DebateSession (initialized)
       └─ update ArchiveSession.debateSessionId
  │
  └─ redirect → /session/sys-{timestamp}
```

---

## 8. Implementation Status Summary

### Done

- Full UI shell with sidebar navigation and responsive layout
- Command Center form with all configuration fields
- PostgreSQL + Prisma schema with migrations
- Docker-based local database (`DB/docker-compose.yml`)
- Seed pipeline from JSON mocks
- Server Action for debate initialization
- Session detail page (read-only)
- History page with search
- Error handling for DB connection failures
- Design system tokens in `DESIGN.md`

### In Progress / Partial

- Model registry page (UI done, DB integration pending)
- History sort/filter tabs (UI only)
- Archive pagination (button placeholder)

### Not Started

- AI debate streaming (`/api/debate` route + `useChat`)
- Persist model active/inactive toggles
- Log Consensus server action
- Settings and Support pages
- Real-time confidence updates during live debate

---

## 9. Future Roadmap

- **AI Streaming** — Wire Vercel AI SDK + OpenRouter for live multi-turn debate.
- **Log Consensus** — Finalize session, update archive winner/resolution/metrics.
- **Model Registry DB** — Connect `/models` page to Prisma `Model` table.
- **Human Intervention** — Mid-debate user prompt injection.
- **3D Visualization** — WebGL/Three.js Arena view.
- **Export** — Consensus reports as Markdown or PDF.
- **History Enhancements** — Working sort tabs, pagination, category filters.
