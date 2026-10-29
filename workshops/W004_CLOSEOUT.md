# W004 — Writing workflow and Writing Studio proof of concept: CLOSEOUT

**Date:** 2026-10-29 · **Status:** CLOSED AT THE WORKFLOW + POC SCOPE ONLY · **Owner decisions:** iterative writing workflow and collapsible scene canvas. This file documents infrastructure/editorial process, **not new fictional canon**.

## Owner-approved practical authoring approach

1. Use **Workflow C — iterative scene/choice vertical slices** rather than exhaustively designing all nodes before prose, or writing the whole novel linearly first. Keep a short story spine as a guardrail, then grow one playable scene and set of choices at a time.
2. Make the **journey map itself the writing environment**, with the author able to open, write and connect passages inside a navigable visual graph.
3. Choose **B — one underlying story graph organised into collapsible scene groups** with broad Act I, II and III regions; no requirement to prepopulate every passage before writing.
4. After testing the initial POC, the owner explicitly asked for **far less cognitive load**. The accepted UI opens on three Act columns containing scene cards; clicking a scene opens its local passage graph; clicking a passage opens the focused prose editor. Secondary controls remain tucked away. This is the preferred POC presentation, not permission to turn the authoring experience into a heavyweight CMS.

## Implementation outcome

- The standalone no-build authoring app is at [studio/](../studio/); [studio README](../studio/README.md).
- Current capabilities: Act overview, scene drilldown, collapsible scene canvas, passage editing, scene/passage creation, links, browser-local autosave, import/export JSON, reader-mode play-through, minimal graph audit.
- The initial seed graph preserves the previously approved architecture (the three wrist-mark explanations join shared Act I; initial mark alone selects Act II). It is **illustrative and mostly placeholders**. No final passage IDs, printed numbering, in-world scenes, accusations or refutations have been approved.
- JavaScript syntax and automated smoke tests cover opening-to-Act-II routing for all three marks, scene drilldown, editor interaction and local saving. GitHub Actions workflow: `.github/workflows/studio-poc.yml`.
- Vercel project **zeta-writing-studio** is Git-linked with **studio/** as root directory. Production deployment is an **owner action**. Vercel build/deployment checks may be rate-limited independently of GitHub test results.

## Important current risk

The existing writing data **does not persist to a server**. It is saved in one browser's `localStorage`, which can be lost to storage cleanup, browser changes and device changes. The author should only experiment with the POC and use **••• → Export manuscript** for backups until W005's durability goals are implemented and independently verified.

## What remains deliberately uncompleted

- Cloud data persistence and authentication of write APIs
- Account/device synchronization, durable revision history, verified backups and restore
- Conflict handling and lossless recovery of existing local drafts
- Final printed page/paragraph addresses, narrative flags and richer graph verification
- Fiction writing itself, accusation/refutation design, new lore or additional canon

**Next session:** [W005 — Durable Authoring Infrastructure](W005_PROMPT.md), prepared but **not executed** by installation. The next session is primarily engineering, not a creative workshop. Nothing here relaxes W001–W003 constraints or overwrites the canon register.
