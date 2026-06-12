# LOGOS AI – Synthetic Dialectic

## Project Overview
LOGOS AI is an analytical web application designed to facilitate and visualize structured, real-time debates between two autonomous AI agents (Agent Alpha and Agent Beta). It focuses on adversarial neural synthesis to resolve complex logical conflicts.

## Tech Stack
- **Framework:** Next.js (App Router) with React
- **Language:** TypeScript (Strict mode enabled)
- **Styling:** Tailwind CSS + Framer Motion (for animations)
- **AI Integration:** Vercel AI SDK (`ai`) + OpenRouter provider (`@ai-sdk/open-router`)
- **Icons:** `lucide-react`

## Commands
- **Install dependencies:** `npm install`
- **Run dev server:** `npm run dev`
- **Build for production:** `npm run build`

## Architecture & Conventions
- Use **App Router** (`src/app/`). Keep routing logic server-side where possible.
- Use **Client Components** (`"use client"`) only for interactive UI elements (forms, animations, real-time debate streams).
- Separate UI components into `src/components/ui/` and feature-specific components into `src/components/features/`.
- **AI Logic:** Place API routes for the Vercel AI SDK inside `src/app/api/debate/route.ts`. Use the `openai` compatibility layer via OpenRouter.

## Design System Rules (CRITICAL)
Always adhere to the "Synthetic Dialectic" visual language:
- **Theme:** Strict Dark Mode. No light mode support. High contrast, analytical aesthetic.
- **Colors:**
  - Background/Surface: `#131316` (Deep blacks/charcoal)
  - Agent Alpha (Primary): Electric Blue `#00f0ff`
  - Agent Beta (Secondary): Vibrant Purple `#e9b3ff`
  - Text: Main text `#e4e1e6`, Muted text `#849495`
- **Typography:**
  - `Sora` (sans-serif) for all Headings.
  - `Inter` for standard body text.
  - `JetBrains Mono` for labels, numbers, code, and terminal outputs.
- **Shapes & Corners:** Minimal rounding. Soft edges (4px for inputs/buttons, 8px for cards). No excessive pill shapes.
- **Glassmorphism:** Use Tailwind's `backdrop-blur` and `bg-opacity` extensively for overlay and depth. Standard cards should have a dark semi-transparent background with a subtle 1px border (20% white opacity).

## Component Guidelines
- **Buttons:** Ghost-style with high-saturation neon borders and subtle glowing hover states (`drop-shadow`). Text must be uppercase `JetBrains Mono`.
- **Discussion History:** Implement as an accordion-style chronological log. 
- **Agent Cards:** Alpha's UI elements should have left-side accent borders; Beta's UI elements should have right-side accent borders.

## State Management
- Use standard React Hooks (`useState`, `useRef`, `useReducer`) for local component state.
- Use Vercel AI SDK's `useChat` or `useCompletion` hooks for managing the streaming state of the debate.