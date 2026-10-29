> **Execution update (2026-10-29):** W005 has now been run at implementation/test scope. See [W005_PROGRESS](W005_PROGRESS.md). Live provider setup and verification remain open for W005A. The original prompt below is retained as the historical authorization brief.

# ZETA — W005: Durable Authoring Infrastructure (FUTURE / NOT EXECUTED)

**Status:** INSTALLED / PREPARED / NOT EXECUTED. The owner must explicitly instruct you to run W005. Installing this prompt is not permission to provision paid services, store unpublished prose in third-party systems, merge code, or edit fictional canon.

**Mission:** Turn the simplified **ZETA Writing Studio** into a reliably persistent, owner-only writing workspace. When the author types, adds passages, edits choices, moves scene cards or changes notes, the **complete manuscript graph and its revision history must survive a page refresh, browser switch, device change, software deployment or ordinary intermittent network failure**. The author should not need to understand the infrastructure.

Act as a senior full-stack engineer, reliability engineer, security architect, developer-experience designer, database migration engineer, quality-assurance lead and GitHub/Vercel repository maintainer. This is an **execution-oriented infrastructure session**: implement and test rather than just diagramming architecture, except where an unavoidable provider/cost/authentication choice needs explicit owner approval.

**Repository:** https://github.com/jfairfaxball-348/ZETA-CYOD---leave-the-Citadel-
**Studio:** `studio/`
**Vercel project:** `zeta-writing-studio` (linked to GitHub, root `studio/`; owner manages production deployment).
**Current flow:** overview → scene → passage writing. Keep it *visibly simple*. No fiction writing, worldbuilding, new canon or publication work in W005.

## Required entry: confirm what exists, do not assume

1. Pin live remote `main` SHA, PR statuses, and GitHub Actions/Vercel states. Read `AGENTS.md`, `authoritative/{START_HERE,STATE,CANON_POLICY,DECISIONS,OPEN_QUESTIONS}.md`, `workshops/{W004_CLOSEOUT,W005_PROMPT}.md`, `studio/{README.md,index.html,app.js,styles.css,package.json,tests/smoke.cjs}` and `.github/workflows/studio-poc.yml`. Observe the distinction between CI success and a possibly rate-limited Vercel deploy.
2. Confirm the browser storage key and JSON document shape before touching persistence. Current key is `zeta-studio-w004-poc-v1` and the data includes `acts`, `scenes`, `passages`, `start`, `sequence` and `edgeSequence`. Preserve IDs and all prose without lossy transforms.
3. Enumerate actual deployment, authentication, data-store and funding entitlements using real account context. **Do not assume Vercel serverless file storage is durable.** Never hardcode API keys, create surprise recurring charges, or weaken private-deployment protection.

## Owner-facing success criteria

- One authoritative server-side manuscript store that is **not** `localStorage`, a Vercel build asset, or an ephemeral function filesystem. Prefer a minimal, inexpensive managed persistent database with transactional writes, schema migrations, and an explicit restore path. Choose a provider that is available and appropriate to the account; seek owner approval before paid or irreversible provisioning.
- Owner authentication and **server-enforced** authorization for every read, write, restore and export endpoint; no anonymous writes or public drafts. Deployment password alone is not a substitute for safe API authorization and access checks. Secrets only in protected environment variables.
- Autosave with clear but quiet indication: **Saving… / Saved / Offline or failed — changes kept locally**. The UI must not claim saved until the **server confirms** a durable revision. Debounce edits; save on meaningful transitions (blur, scene switch, background/navigation when possible); handle retries and outages without silent loss. Browser cache can be a temporary **recovery buffer** but never falsely represented as a backup.
- Safe versioning: monotonic revision identifiers, timestamps, server-side immutable snapshots or equivalent history, ability to inspect and restore an earlier version *without destroying the newer versions*, and conflict detection/optimistic concurrency so stale tabs/devices cannot silently overwrite newer prose. Any merge UI should be minimal and safe by default.
- Backups beyond the live primary store, with a documented retention schedule and tested end-to-end export/restore. An optional private GitHub snapshot is acceptable as a **secondary backup**, not a substitute for authentication or a durable primary. No secrets or sensitive manuscript data in public repositories; check repository visibility before committing snapshots.
- Migration of all existing `localStorage` drafts with explicit author review and a **non-destructive**, idempotent import. Never overwrite an existing cloud manuscript automatically because the local copy happens to be newer or older. Keep the original local copy until verified server receipt, offer JSON export as an escape hatch, and distinguish current POC demo placeholders from real authored content.
- Preserve scene IDs, node IDs, edges, mark choices, notes, ordering, dimensions and editorial statuses; additions and deletion must persist. Preserve the existing opening-mark → shared Act I → gated Act II flow.
- Keep the **three-Act overview and quiet writing drawer**. At most a tiny save indicator and a tucked-away history/backup action; no new dashboard, server-state jargon, required manual sync button or feature creep.

## Implementation workstream

1. **Design within practical constraints:** select minimal persistence, auth and backup approach and write a short architecture decision record with costs/limitations/alternatives. Ask for one owner decision **only if** service entitlement, recurring spending, account security or credential provisioning requires it.
2. **Backend:** authenticated endpoints, typed/validated schema for whole graph, transactional revision records, autosave/write API, read by revision, backup/export, restore. Rate-limit or bound write size; enforce server validation, isolation and CSRF controls appropriate to architecture. Avoid exposing unpublished text through static assets, logs or error responses.
3. **Frontend:** replace optimistic “saved in this browser” messaging with server-acknowledged state; make persistence resilient to offline editing, tab closure, retries and conflicts. Never throw away unsent changes on a failed request or a new deploy. Retain client JSON export/import and make cloud import safe.
4. **Recovery and durability:** regular independent snapshot/backup, documented recovery procedure, restore dry-run; credentials rotation and safe migration. Do not destroy initial or existing author data while seeding or deploying.
5. **Testing:** automated test matrix: refresh, reopen, different browser/device, incremental paragraph typing, simultaneous edits/conflict, offline/online, server error/timeout/retry, partial write, outdated revision, data import, snapshot restore, passage add/delete, mark routing, deployment rollback. Mock unavailable external services for repeatable CI, plus one real provisioned end-to-end verification if authorised. Verify that unauthorized requests fail.
6. **Release:** use branch/PR, tests and ordinary review; commit and merge only after verification and owner's applicable permission. Confirm live GitHub HEAD and Vercel deployment state separately; do not claim a URL is live when a build quota blocks it. Provide owner with clean steps to access/write/verify persistence, including what “Saved” truly means.

## Boundaries / explicit exclusions

- **Do not** author new story prose, expand the narrative graph beyond tests, assign final printed page numbers, alter CANON, or add mechanics/puzzles.
- Do not deploy anonymous or unauthenticated manuscript APIs. Vercel SSO settings are necessary but may not be sufficient by themselves; verify actual protection and API behavior.
- Do not silently migrate or delete old browser data. No unbounded offline safety promises: report tested guarantees and failure modes accurately.
- Do not auto-create paid database projects/upgrades or change team billing without an explicit owner decision. If blocked, still deliver a complete testable implementation and identify the exact owner action required.
- Preserve current site simplicity and maintain existing tests.
- This session is **future work**. Merely reading this document does not execute W005.

## Definition of done

A new passage can be written, server-acknowledged as saved, reopened in another authenticated browser and recovered after a redeploy; two conflicting editors cannot silently discard each other's work; at least one older version can be restored; backups are independently retrievable; real security and failure tests pass. The owner can continue writing without managing any of these details.

**First user-visible instruction when W005 is invoked:** briefly recap current risk and immediately begin implementing a durable, low-friction save pipeline.
