# ZETA — W007B execution record (2026-10-29)

**Status: PARTIAL, ACCOUNT ACTION REQUIRED.** The Writing Studio is NOT yet certified writing-ready.

## Confirmed from GitHub and connected read-only Cloudflare tab
- Existing Worker: `zeta-cyod---leave-the-citadel`, URL: https://zeta-cyod---leave-the-citadel.jfairfaxball.workers.dev/ . Deployment version `d492231a` was the active production version shown in Cloudflare when inspected. The three-Act UI was previously confirmed on this host.
- PR #7 remains unmerged; it aligns Worker name and the `previews: {}` block. It still contains the all-zero D1 UUID, which is **not** a usable production ID. The failing Cloudflare preview check does not prove production is broken.
- PR #8 is stacked on #7; W007B code changes require GitHub Actions checks to pass and live validation before merging. Changes include strict transaction-rollback semantics for revision insert failures, CAS conflict handling, stricter save acknowledgement, and a fail-loud, byte-verified private backup workflow.
- The active production Worker has not been changed by W007B. No Cloudflare account-level D1 binding, migration, Worker secret, Access setting or remote manuscript write has been performed through this session.
- No novel prose or credentials have been committed to the public GitHub repository.

## Minimal owner-controlled activation sequence
1. In Cloudflare's **D1 SQLite Database** dashboard, create `zeta-manuscript` (Free if available). Record its **real UUID**. It is a public identifier, not a password. Tell the maintainer just that UUID, or update `studio/wrangler.jsonc` on the PR with it. The all-zero UUID must never be deployed to production.
2. Apply the SQL in `studio/migrations/0001_manuscript.sql` **once** in the database's SQL console, or from a Cloudflare-authenticated terminal with `cd studio && npx wrangler d1 migrations apply zeta-manuscript --remote`. Ensure it created both `zeta_manuscript` and `zeta_revision`. Do not delete any manuscript.
3. In existing Worker `zeta-cyod---leave-the-citadel` **Settings → Bindings**, attach D1 `zeta-manuscript` with binding name `DB`. In **Settings → Variables and Secrets**, add an encrypted secret `STUDIO_OWNER_TOKEN` with at least 32 random characters; never paste its value into chat or public code.
4. In Worker **Settings → Builds**, use root `studio`, build `npm run build`, production deploy `npx wrangler deploy`, preview deploy `npx wrangler preview`. Previews are isolated; never attach production `DB` or production key to them. Enable owner-only Cloudflare Access for the production and preview hosts.
5. After matching the real UUID in source and deployed binding, activate release from GitHub. Verify the protected `/api/manuscript` cannot be read anonymously. With a disposable paragraph, verify ACK → refresh → second authenticated browser → notes, links, new passage → conflict → restore. A successful save is not proven until remote D1 round-trip.
6. Create an **independent private** GitHub backup repository, and privately configure GitHub Actions secrets `ZETA_BACKUP_STUDIO_URL`, `ZETA_BACKUP_OWNER_TOKEN`, `ZETA_BACKUP_GITHUB_TOKEN`, `ZETA_BACKUP_GITHUB_REPO` (plus both `ZETA_BACKUP_CF_ACCESS_CLIENT_ID` and `ZETA_BACKUP_CF_ACCESS_CLIENT_SECRET` if Access requires service credentials). Trigger the existing private-backup workflow and verify the snapshot can be read/imported using only disposable content. No public manuscript backups.

## Release / writing gate
Do not merge while database ID is placeholder. Do not mark W007B closed until authenticated live D1 saving, revision restore and independent private backup recovery are *all* demonstrated. The [W008 first writing session](W008_FIRST_WRITING_SESSION.md) is prepared but locked pending these checks.

## W007B code verification closeout (same day)
- [PR #8](https://github.com/jfairfaxball-348/ZETA-CYOD---leave-the-Citadel-/pull/8) **merged into the W007 staging branch**, not main, as merge commit `bd12c98c0904141eda90771ac7b1512ac5358d9d`.
- GitHub smoke workflow succeeded on the W007B implementation: 13 Node tests passed; browser mock integration passed; local Wrangler D1 migration, dry-run bundle and **real local HTTP/D1 save, read, 409 conflict, historical restore** passed. This is not production proof.
- Cloudflare preview build still reports failure. Its actual build root/branch preview account configuration must be inspected and corrected in Cloudflare. The existing main production Worker was not redeployed.
- All-zero production D1 UUID, remote migration, owner secret, Access, live cross-browser saves, offsite backup and independent recovery are still outstanding.
**SAFE RELEASE DECISION:** Hold PR #7 open and keep main at `b48db88d3a131ec54d6a97f18f79ffdff6774691` until owner-only Cloudflare activation and live checks pass.
