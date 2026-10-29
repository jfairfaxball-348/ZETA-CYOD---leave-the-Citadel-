> **2026-10-29 checkpoint:** Owner invoked W007 and reports a green Cloudflare service `zeta-cyod---leave-the-citadel`. The live URL and durability checks remain unverified. See [W007_PROGRESS](W007_PROGRESS.md) and [W007B next prompt](W007B_LIVE_VALIDATION_PROMPT.md). The original checklist below is preserved for provenance.

# ZETA W007 — Activate and Prove Cloudflare Writing Studio (FUTURE / NOT EXECUTED)

**Mission:** Finish the owner-approved migration from Vercel to Cloudflare Workers + D1. No fiction-writing or worldbuilding work, no new costs without explicit owner approval.

1. Pin main SHA, inspect W006 merge and CI status, `studio/README.md`, `wrangler.jsonc`, `src/worker.mjs`, D1 migration, backup workflow and Cloudflare service status.
2. Ask owner to establish Cloudflare account access (no secrets in chat), create a Free D1 database, and bind its real UUID to the Worker. Confirm current plan/limits and whether Access protection is enabled.
3. Apply remote D1 migrations; configure encrypted `STUDIO_OWNER_TOKEN` and Worker-wide Cloudflare Access for the owner only. Never deploy a public manuscript API without independent bearer auth. Verify tests before deploying.
4. Deploy from the linked GitHub project (root `studio`), confirm actual URL/Deployment status, unauthorized 401 and permitted read/write; verify local W004 draft preservation, autosave acknowledgement, refresh, second device, offline recovery, stale-tab conflict, history and restoration.
5. Configure separate private GitHub backup repo and service credentials only with owner approval, run a real backup and a disposable restore rehearsal. Reconcile Access service token policy and check backup failures and retention.
6. If all checks pass, mark W005+W006 live-durability gates closed, remove/deactivate obsolete Vercel linkage carefully, and install the first actual writing session. Otherwise record the precise blocker. No claims of live status based solely on GitHub CI.
