> **SUPERSEDED 2026-10-29:** The owner selected a Vercel alternative. Do not execute this prior provider plan. Use [W007 — Cloudflare activation](W007_CLOUDFLARE_ACTIVATION.md) instead. This file remains historical.

# ZETA — W005A: Activate and Verify Durable Writing (FUTURE / NOT EXECUTED)

**Status:** PREPARED, not an executed session. Requires the owner's explicit instruction. Follow W005 implementation record and studio README.

## Mission

Finish the still-open W005 durability objective by activating external PostgreSQL, private owner authentication and truly independent offsite backups for the existing simple Writing Studio. No new fiction or UI expansion.

## Pre-flight

1. Pin live main SHA, W005 PR merge status and CI; review `workshops/W005_PROGRESS.md`, `studio/README.md`, `studio/api/manuscript.js`, `studio/lib/`, `studio/cloud.js`, CI and Vercel project settings.
2. Inspect Vercel production/preview environments and any storage integrations. Do not assume the existing daily deployment limit is resolved. No source code pushes to circumvent a provider quota.
3. **Owner decision required** for external database account, potential charges, and creation of owner access key or private backup destination. Do not create paid resources, change billing or ask for passwords in conversation. Owner enters secrets directly into protected dashboard settings.

## Execution after owner activation

- Verify Vercel project variables `DATABASE_URL` and `STUDIO_OWNER_TOKEN` exist (never print their values). Confirm SSO Deployment Protection and auth-enforcement behavior with a negative unauthorized request.
- Deploy within Vercel limits. Test actual API GET initial empty revision, migration, POST save, refresh, different authenticated browser/device, prose and link changes, scene movement, add/delete, mark-routing, stale-revision rejection, failed-network retry and browser reconnection from existing W004 drafts.
- Test older revision restore creates a new revision and does not destroy newer history.
- Configure separate **private** GitHub backup repo and action secrets under owner control; verify a real backup, download its file, import a disposable copy and check it saves back to the DB without losing newer versions.
- Inspect backup failures, retention and provider costs. Record exact build/deployment URLs, commit SHAs, test evidence, blockers and reversion procedure. Do not claim W005 is done until real, not just mocked, persistence + backup/restore passes.
- Keep UI uncluttered and all W001–W003 fictional canon unchanged; close W005 only at its proven scope and install the next writing-oriented workshop if owner requests it.

If provider setup is not available, stop at concrete verified blockers while leaving the code safe and a manual JSON export path accessible.
