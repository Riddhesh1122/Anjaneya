# Merge notes — Anjaneya-feature-ai-module × radiant-dash-98-main

## What's in this folder

- **`anjaneya-dashboard/`** — the merged, working application. This is
  `radiant-dash-98-main` (Lovable's redesigned UI) with the two real
  functionality gaps closed. It is a complete, buildable Vite +
  TanStack Start project. Run it with:
  ```
  cd anjaneya-dashboard
  bun install   # or: npm install
  bun run dev   # or: npm run dev
  ```

- **`event-management-hackathon/`** — copied over **unchanged** from the
  original upload. This is a separate Express + MongoDB + static-HTML
  backend that is not called by, or wired into, either React frontend
  (no `fetch`/`axios` calls to it exist in `anjaneya-dashboard` in either
  the original or the redesigned project). It's included as-is so
  nothing from the original upload is lost, but it is **not part of the
  merged app** and needs its own integration work if you want the
  dashboard to talk to a real backend instead of the current
  AI-provider calls / local component state.

## What changed vs. the Lovable UI (`radiant-dash-98-main`)

Only two files were touched, both pure data-flow wiring — **no JSX,
Tailwind classes, layout, colors, typography, or component hierarchy
were changed anywhere**:

1. **`src/components/dashboard/EventWizard.tsx`** — `onSubmitted` used
   to report only the event title (`(title: string) => void`). It now
   reports the full form values (`(values: EventWizardValues) => void`)
   so the page can actually save what the user typed.

2. **`src/pages/DashboardPage.tsx`** — added `handleWizardSubmit`
   (mirrors the existing `handleSaveGeneratedEvent` pattern) and passed
   it as `EventWizard`'s `onSubmitted` prop. Previously, completing the
   3-step "Create an event" form showed a success screen but silently
   discarded the data — it never reached `createdEvents` state, so the
   event never appeared in the Events list. Now it does, consistent
   with how AI-generated events are already saved.

## What was verified as already correct (no change needed)

Audit against the original `Anjaneya-feature-ai-module/anjaneya-dashboard`
confirmed these were already fully and faithfully ported by Lovable,
so they were left untouched:

- `src/services/aiApi.ts` — real multi-provider LLM calls (Pollinations,
  OpenAI, Gemini, Groq, OpenRouter), unchanged logic.
- `src/contexts/AuthContext.tsx` — same (mock) login/logout logic as
  the source app.
- `src/components/ai/*` — all six AI components are byte-identical to
  the source app.
- `src/pages/LoginPage.tsx`, `Sidebar.tsx`, `TopNavbar.tsx`,
  `StatCard.tsx`, `ActivityTable.tsx`, `ChartSection.tsx` — redesigned
  markup, but all state, hooks, event handlers and props are equivalent
  or improved (e.g. TopNavbar's account-menu buttons, dead in the
  source app, are now wired to real navigation).
- `package.json` — no missing dependencies; everything the ported logic
  needs (`axios`, `framer-motion`, `lucide-react`) was already present.
- Routing — `radiant-dash-98-main` uses TanStack Start/Router (file-based,
  SSR-capable) rather than the source app's `react-router-dom`. This was
  intentionally preserved as-is per the instruction to treat the Lovable
  UI/architecture as source of truth; the login → dashboard gating
  behavior is equivalent, just implemented as a single-route app shell
  instead of separate `/login` and `/dashboard` URLs.

## Known limitation carried over (not introduced by this merge)

`TopNavbar`'s "Profile & Skills" style menu items still don't link to a
dedicated profile page (there isn't one in either project) — this was
also true of the original app and is outside the scope of this merge.

## Not verified in this environment

This sandbox has no network access, so `bun install` / `npm install`
and a full `vite build` could not be run here to confirm a clean build.
The two edited files were checked by hand (bracket/paren balance,
type-shape consistency with existing sibling code such as
`handleSaveGeneratedEvent`) but you should run a local build/typecheck
before deploying.
