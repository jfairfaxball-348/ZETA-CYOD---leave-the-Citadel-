# ZETA W007 — Cloudflare deployment activation checkpoint

**Date:** 2026-10-29  
**Result:** **PARTIAL — confirmed live Cloudflare Worker and Writing Studio UI; persistent manuscript saves remain unproven**.

## Verified / reported separately

| Item | State | Basis |
| --- | --- | --- |
| `main` baseline | **Verified** `b48db88d3a131ec54d6a97f18f79ffdff6774691` | GitHub default branch and commit |
| GitHub W006 CI | **Verified green** | [GitHub Actions run](https://github.com/jfairfaxball-348/ZETA-CYOD---leave-the-Citadel-/actions/runs/40903210180); local D1 and mock/API tests |
| Production Cloudflare deployment | **Verified Ready, active** | Connected Cloudflare dashboard tab showed version `d492231a`, 100% traffic, built from `main` |
| Production URL and Studio UI | **Verified** | [Writing Studio](https://zeta-cyod---leave-the-citadel.jfairfaxball.workers.dev/); connected browser showed three Acts, scenes, passage graph and Writing Desk |
| Worker naming | **Aligned in PR #7** | W007 branch `studio/wrangler.jsonc` now targets `zeta-cyod---leave-the-citadel`; not yet merged/deployed |
| D1 database | **Not verified live** | Repository has all-zero UUID placeholder; owner could have configured Dashboard independently |
| D1 migrations | **Not verified remote** | Local SQL migration and HTTP tests passed; no remote read/write evidence |
| Owner token / Access | **Not verified live** | No account-level permission to inspect secrets or policies; no secrets entered in chat |
| Real draft save, recovery and backup | **Unverified** | Do not infer from CI or a successful deployment |

## Owner-facing next actions (minimal)

1. **Completed:** Confirmed the existing production URL and correct static Writing Studio UI. No extra Worker needs creating. Production works despite the separate failing PR preview check.
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

## W007 verified live UI follow-up

At the owner's request on 2026-10-29, the browser showed the actual Studio at **https://zeta-cyod---leave-the-citadel.jfairfaxball.workers.dev/** with the proper ZETA title, three Acts and editor. The connected Cloudflare Deployments dashboard showed production version **d492231a**, **Ready**, **100%** traffic; this is independent of the failed W007 PR branch preview. The editor banner currently says **`Local only — export backup`** and its menu says **`Until connected, writing is local`**. This proves only that the browser has not connected cloud saving; it does **not** determine whether the Worker already has a D1 binding or owner secret.

**Still required:** confirm actual D1 binding and migrations, bearer key/Access, server-acknowledged save and cross-browser refresh/history/restore, plus independent private backup. No private draft was read, uploaded or changed during this verification. **Do not modify the existing production Worker just to fix the PR preview.** PR #7 remains open with GitHub tests green and Cloudflare PR-preview check failing; its separate preview configuration still requires investigation.
