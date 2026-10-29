# ZETA W007 — Cloudflare deployment activation checkpoint

**Date:** 2026-10-29  
**Result:** **PARTIAL — owner reports a green Cloudflare deployment; no verified public URL or real durable manuscript save**.

## Verified / reported separately

| Item | State | Basis |
| --- | --- | --- |
| `main` baseline | **Verified** `b48db88d3a131ec54d6a97f18f79ffdff6774691` | GitHub default branch and commit |
| GitHub W006 CI | **Verified green** | [GitHub Actions run](https://github.com/jfairfaxball-348/ZETA-CYOD---leave-the-Citadel-/actions/runs/40903210180); local D1 and mock/API tests |
| Cloudflare Worker build | **Owner reports green** | Dashboard service `zeta-cyod---leave-the-citadel`; actual deployment details not read |
| Public production URL | **Unverified** | Need copied hostname from **Domains** tab |
| Worker naming | **Mismatch to reconcile** | Repo `studio/wrangler.jsonc` name `zeta-writing-studio` vs reported dashboard service `zeta-cyod---leave-the-citadel` |
| D1 database | **Not verified live** | Repository has all-zero UUID placeholder; owner could have configured Dashboard independently |
| D1 migrations | **Not verified remote** | Local SQL migration and HTTP tests passed; no remote read/write evidence |
| Owner token / Access | **Not verified live** | No account-level permission to inspect secrets or policies; no secrets entered in chat |
| Real draft save, recovery and backup | **Unverified** | Do not infer from CI or a successful deployment |

## Owner-facing next actions (minimal)

1. Open the existing Worker; click **Domains**, enable `workers.dev` if needed and copy **Visit** URL. A typical hostname consists of the Worker name plus the account subdomain, but only the live dashboard confirms the actual route.
2. Check Worker build root (`studio`), build (`npm run build`) and deployment command; align the real service name with the Wrangler `name` **before any subsequent deploy**. Check that the deployed assets are this repository's actual `index.html`, `app.js`, `cloud.js`, and `styles.css`.
3. In Workers → D1 create or select a Free `zeta-manuscript` database, connect it to the Worker as binding `DB`, and apply `studio/migrations/0001_manuscript.sql` to that remote database. Record the actual D1 UUID in the deployment configuration, not an all-zero placeholder. No paid plan required for the prototype; ask before upgrading.
4. Add a long random encrypted `STUDIO_OWNER_TOKEN` secret and enable owner-only Cloudflare Access for the entire Worker host; ensure preview routes are covered too. Never commit or paste credentials.
5. Validate unauthenticated `/api/manuscript` rejects access, then unlock Studio using the owner key. Save a **disposable** passage; refresh, reopen in another authorised browser, demonstrate stale-revision conflict, and restore history. Only claim **Saved** if server acknowledges.
6. Configure a separate private GitHub backup repository and optional Cloudflare Access service token for the daily backup workflow; test one actual snapshot and independent restore. Do not call the system durable until this passes.

## Current limitations and safety

No Cloudflare account mutation, D1 provisioning, remote migration, Access change or real manuscript write was performed by the assistant in W007. Connected GitHub read access does not confer Cloudflare account control. A green Worker build proves neither a served URL nor configured database. Continue manual **Export manuscript** JSON backups until these gates are proven; original W004 browser data must remain untouched.

## Next

[W007B — Live Cloudflare validation and writing-ready durability](W007B_LIVE_VALIDATION_PROMPT.md). No fiction or canon was changed.

## W007 follow-up: root cause found from owner-supplied Cloudflare build log

At 16:43 UTC, the Cloudflare preview build for PR #7 failed on **`npx wrangler preview`** with `Your Wrangler configuration is missing a previews block`. This is a branch Preview build, not a production deployment. Cloudflare's documented `npx wrangler preview` command requires `previews: {}` or a populated preview config. The log fetched `wrangler@4.155.0` via `npx` rather than installing the repo's devDependency, so the Worker build **may be running from repository root instead of `studio`**; this must be checked in the Cloudflare dashboard.

**Fix committed on W007 PR #7:** `studio/wrangler.jsonc` now has `previews: {}` and `name: zeta-cyod---leave-the-citadel`, which matches the existing service; `studio/package.json` requires a preview-capable Wrangler and runs a config regression test. This fixes the proven configuration omission **if Cloudflare is actually using the `studio` root**. It does not grant Cloudflare account access, attach a real D1 UUID, configure owner-only Access, or prove the PR preview or production build succeeds.

**Owner-side dashboard action:** **Worker → Settings → Build**: root directory `studio`; build `npm run build`; deploy `npx wrangler deploy` for `main`; preview `npx wrangler preview` for feature branches. Verify the PR preview check after Cloudflare rebuilds and resolve any further errors before merging. Never use `npx wrangler deploy` merely to make an untrusted PR preview pass. Preview must not receive the production manuscript DB or owner key.
