# ZETA — W007B: Confirm Cloudflare Route and Prove Manuscript Durability (PREPARED / NOT EXECUTED)

Act as a senior Cloudflare Workers/D1 reliability engineer, security reviewer and GitHub maintainer.

## Context

- Repository: https://github.com/jfairfaxball-348/ZETA-CYOD---leave-the-Citadel-
- Current main must be pinned fresh at execution.
- Owner reports green Worker `zeta-cyod---leave-the-citadel`, but no confirmed public URL.
- `studio/wrangler.jsonc` currently contains a different Worker name (`zeta-writing-studio`) and an all-zero D1 database ID.
- W006 local D1/CI green; W007 activation only partial. See [W007 progress](W007_PROGRESS.md).

## Execution mission

Make the **existing** Cloudflare deployment an owner-only writing studio with real, tested save/recovery. Do not create a second Worker, rewrite the editor UI, write fiction, alter canon, spend money without approval, or delete local drafts.

1. Read the owner-provided **Domains** hostname or connected browser's authorised Cloudflare dashboard page. Confirm the **actual** `workers.dev` URL. Do not guess. Verify that the production branch is `main`, root directory is `studio`, build command is `npm run build`, production deploy command is `npx wrangler deploy`, and branch preview command is `npx wrangler preview`. On 2026-10-29 a PR preview failed because the Wrangler configuration lacked `previews: {}` (fixed in W007 PR #7). Verify the preview does not inherit production D1 or owner secrets; use separate preview resources before testing the API. Reconcile the Wrangler `name` with the live Worker name (also fixed in W007 PR #7).
2. Have owner authorise or carry out Free D1 database provisioning; bind `DB` to a **real** D1 UUID and migrate `studio/migrations/0001_manuscript.sql` remotely. Retain empty/new database unless importing a deliberately reviewed draft. Do not paste tokens into chat.
3. Configure encrypted `STUDIO_OWNER_TOKEN` and owner-only Cloudflare Access for Worker production **and preview** hosts. Check an unauthenticated `/api/manuscript` request is denied; verify protection holds for URL variants.
4. In the browser, write a **disposable test passage**, confirm server-acknowledged save; refresh and reopen on a second browser; test revision conflict, offline buffer, history restoration and old local-draft preservation.
5. Configure separate private backup repo and credentials only with owner approval; manually execute an actual backup and test restoration of a disposable snapshot. Avoid reporting backups as live until this test is proven.
6. Run GitHub tests and CI; update authoritative state/workshop index with precise passes/failures. Make safe code changes on branch/PR and merge after checks. Only then install the first **actual passage writing** workshop.

## Completion gate

An actual URL is opened, the correct Studio UI and API respond, only the owner can read/write drafts, D1 holds revisions across reload/deploy, older snapshots can be restored, and an independent private backup is confirmed. If any account-only step remains blocked, report exactly that and keep W007B open. A green deployment on its own is not completion.
