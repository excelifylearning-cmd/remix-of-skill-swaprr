

# Workspace Page Redesign — Sidebar + Separate Panels + Telemetry

## Problem
Currently the workspace is a flat 5-tab layout with all hardcoded mock data. Stages, escrow, deliverable submission, and dispute are all crammed into one "Progress" tab. No settings panel, no activity logging, no sidebar navigation.

## Architecture

```text
┌─────────────────────────────────────────────────┐
│  Header: Back, Gig title, partner, SP, status   │
├──────────┬──────────────────────────────────────┤
│ Sidebar  │  Main Content Area                    │
│ (icon    │                                       │
│  strip)  │  Active panel renders here            │
│          │                                       │
│ Chat     │                                       │
│ Board    │                                       │
│ Video    │                                       │
│ Files    │                                       │
│ ──────── │                                       │
│ Stages   │                                       │
│ Escrow   │                                       │
│ Submit   │                                       │
│ Dispute  │                                       │
│ ──────── │                                       │
│ Settings │                                       │
└──────────┴──────────────────────────────────────┘
```

## Changes

### 1. Database Migration — 6 new tables + storage bucket

Create tables: `workspace_messages`, `workspace_files`, `workspace_stages`, `escrow_contracts`, `workspace_disputes`, `workspace_deliverables` with proper RLS (participants only). Create `workspace-files` storage bucket. Enable realtime on `workspace_messages`.

### 2. Full Rewrite of WorkspacePage.tsx

**Layout**: Replace top-tab strip with a left icon sidebar (56px collapsed strip, icons + tooltips). Two groups separated by divider: Communication (Chat, Whiteboard, Video, Files) and Management (Stages, Escrow, Submit, Dispute, Settings).

**9 Panels (each its own component within the file)**:

- **ChatTab** — Keep existing UI but wire to `workspace_messages` table with realtime subscription. Log every message send.
- **WhiteboardTab** — Keep placeholder canvas as-is.
- **VideoTab** — Keep placeholder WebRTC UI as-is.
- **FilesTab** — Wire to `workspace_files` + `workspace-files` bucket. Upload, download, version display. Log uploads/downloads.
- **StagesTab** — Separate panel. Fetch from `workspace_stages`. Visual progress bar, mark complete button, SP allocation per stage. Log stage completions.
- **EscrowTab** — Separate panel. Fetch from `escrow_contracts`. Show total SP held, released per stage, terms, status. Visual SP flow breakdown. Log escrow events.
- **SubmitTab** — Separate panel. Form: title, description, file URLs. Creates rows in `workspace_deliverables`. Shows submission history with accept/revision/reject status. Log submissions.
- **DisputeTab** — Separate panel. Form: reason, evidence (text). Creates rows in `workspace_disputes`. Shows existing disputes + status timeline. Log dispute filings.
- **SettingsTab** — New panel. Workspace preferences: notification toggle, deadline display, partner info, workspace ID, leave/archive options.

### 3. Telemetry & Activity Logging

Import `logActivity`, `logInteraction`, `logPageView` from `activity-logger.ts` and call on:
- Page load (workspace opened)
- Tab switches
- Message sends
- File uploads/downloads
- Stage completions
- Escrow views
- Deliverable submissions
- Dispute filings
- Settings changes
- Video call start/end
- Whiteboard tool changes

### 4. Seed Data Update

Update `seed-test-data` edge function to populate demo workspace `demo-workspace-001` with:
- 5 stages with SP allocation
- 1 escrow contract (held, 30 SP)
- 10 chat messages
- 3 files
- 1 deliverable submission
- No disputes (clean state)

### Files Modified
- `src/features/workspace/WorkspacePage.tsx` — full rewrite (~900 lines)
- `supabase/functions/seed-test-data/index.ts` — add workspace seed data
- 1 database migration (6 tables + storage bucket + realtime + RLS)

