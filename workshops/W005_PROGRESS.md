# ZETA — W005 Implementation Record (2026-10-29)

**Status: IMPLEMENTED AND MOCK-TESTED; LIVE ACTIVATION BLOCKED. Not a full durability closeout.**

This execution was explicitly authorised by the owner's request to run the next session. It is entirely infrastructure work: no prose, approved fictional canon, printed page numbering or plot has been changed.

## Verified entry conditions

- Remote main at entry: `aa26e6560c2fdec56e3a8ce390587370ff1773a1`, W004 simplified POC merged.
- Vercel project `zeta-writing-studio`, Hobby team, Git-linked to this repository, root `studio/`.
- Vercel SSO Deployment Protection is enabled; project had no environment variables, no connector storage, and no successful deployment at entry. Owner reported the Vercel daily deployment quota exhausted.
- W004 browser key: `zeta-studio-w004-poc-v1` containing full `acts/scenes/passages/start/sequence/edgeSequence` graph. Its original value is not destroyed or overwritten.

## Implemented on W005 branch

- Protected API `/api/manuscript` with owner bearer authorization, same-origin restriction for browser requests, no-store responses, schema/payload checks, and generic server errors. Unconfigured APIs fail closed.
- Transactional PostgreSQL document update, immutable revision snapshots, expected-revision conflict detection, restoration as a new revision, history and version reads. The Neon driver uses per-request connection pools, not a serverless filesystem.
- Frontend: debounced autosave; server-confirmed 'Saved', explicit failure/conflict indicator; durable-intended local recovery buffer that survives reload on the same browser (subject to browser storage limits); safe original-W004 fallback; non-destructive local/cloud import decision and archived JSON export before switching; minimal history and restore menu.
- Fixed a real issue found by browser CI: opening a scene no longer writes a spurious manuscript revision.
- Private backup workflow: scheduled daily, writes immutable JSON snapshots to a **separate private GitHub repository**, refuses public destinations, and explicitly SKIPs until credentials are configured.
- Tests: original reader/mark smoke test, API validation/security/conflict/history test using injected mock, and jsdom simulated second-browser workflow including stale-editor conflict protection.
- Full author setup and recovery instructions in `studio/README.md`.

## Still unverified / not completed

- No external DB was created or authorised. No owner token was generated in a third-party account or stored in Vercel. No private backup repo/token was provisioned. No extra cost incurred.
- No live Vercel deployment (quota constraints); no tested real PostgreSQL migration, server-to-database transaction, cross-device browser session, real restore, actual scheduled backup or catastrophic-recovery rehearsal.
- A browser recovery buffer is **not** a substitute for backup; a successful mock test is **not** proof that live manuscript data survives a deploy.
- W005 owner-facing definition of done remains OPEN until W005A activation tests pass.

## Release and safety

The W005 changes are confined to `studio/`, CI, work-session documentation and governance navigation. PR: [W005](https://github.com/jfairfaxball-348/ZETA-CYOD---leave-the-Citadel-/pull/5). CI success applies to mocked tests only. When green, code may be merged into main without activating an unconfigured backend or overriding owner-managed Vercel deployment. The owner must explicitly approve/complete provider provisioning and private backup configuration before the app is treated as durable.

**Next prepared session:** [W005A — Activate, prove and recover](W005A_ACTIVATION_PROMPT.md), which requires a new explicit owner invocation.
