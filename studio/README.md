# ZETA Writing Studio — Cloudflare deployment

**Authoritative hosting target: Cloudflare Workers + D1, not Vercel.**
The existing quiet overview → scene → passage editor is unchanged. The HTML/JS client still calls `/api/manuscript` with the W005 save protocol; the server implementation has moved to `src/worker.mjs` and Cloudflare D1.

## Why Cloudflare?

One platform serves the static writing UI and a persistent SQL database, without a separate paid Postgres provider. Cloudflare Workers Free offers 100,000 Worker requests/day. D1 Free includes 5 GB total storage across your databases, **500 MB per individual database**, 5m rows read/day, 100k rows written/day and seven days of native point-in-time recovery (check current plan before enabling). Free plan limits can interrupt saving; local recovery and manual JSON export remain important.

Cloudflare Access can require your email/sign-in to reach both preview and production Worker URLs. The writing API still independently requires its long random owner key. The key is held only in the unlocked tab memory; the server never serves it to the browser.

## W007: locate the green deployment (29 October 2026)

**Production website confirmed live:** [ZETA Writing Studio](https://zeta-cyod---leave-the-citadel.jfairfaxball.workers.dev/) — connected browser showed the real three-Act/scene/passage editor. Cloudflare's Deployments tab showed the existing Worker **`zeta-cyod---leave-the-citadel`** serving version **`d492231a`** at **100%** traffic. **Manuscript cloud saving and backup remain unverified.**

1. **Completed:** Production URL and static editor were opened successfully. Do not create another Worker or change the existing domain; use the confirmed [production URL](https://zeta-cyod---leave-the-citadel.jfairfaxball.workers.dev/).
2. In **Settings → Build**, set the **Root directory** to `studio`, **Build command** to `npm run build`, **Deploy command** to `npx wrangler deploy`, **Preview command** to `npx wrangler preview`, and production branch to `main`. A 2026-10-29 pull-request build ran `npx wrangler preview` without detecting the local Wrangler dependency, indicating that the root directory may not be `studio`. W007's branch aligns the Wrangler `name` with the existing Cloudflare service **`zeta-cyod---leave-the-citadel`**, adds the required empty `previews` block and updates Wrangler to a preview-capable version. After fixing the dashboard root setting, rerun the PR preview; **do not substitute `deploy` for `preview` on a PR branch**.
3. Once the owner has a real D1 database binding, applied remote migration, encrypted `STUDIO_OWNER_TOKEN`, and owner-only Cloudflare Access, verify the application at the actual URL. An unauthenticated API request should be denied (401 with backend configured; Access may intercept it earlier). A 503 `NOT_CONFIGURED` means persistence is not yet ready. Test a **disposable** passage through save, refresh, another browser and history restore before substantial writing.

**Do not paste tokens into chat or commit them.** Do not treat a Cloudflare green badge or Github CI run as a confirmed manuscript backup. Detailed activation status: [W007 progress](../workshops/W007_PROGRESS.md).

## First deployment — owner controls the Cloudflare account

The live Worker and static UI are **confirmed working**, but there is no authorised read of its full live D1/secret/Access configuration here. The D1 UUID in the committed configuration is still a placeholder; the real D1 binding, owner secret, Access policy and remote manuscript durability are **not yet verified**. No extra spend or manuscript import has been undertaken in this session.

1. Sign up for or sign into [Cloudflare Dashboard](https://dash.cloudflare.com/), and select the **Free** Workers plan; do not choose an upgrade unless you separately approve the cost.
2. For an existing Worker, **do not create another**: verify the GitHub repository `jfairfaxball-348/ZETA-CYOD---leave-the-Citadel-` is connected to that service, with **Root Directory: `studio`**, **Build command: `npm run build`**, and **Deploy command: `npx wrangler deploy`**. Reconcile the service name with `wrangler.jsonc` before deploying again. For a brand-new installation only, use **Workers & Pages → Create → Import Git repository**.
3. Create a D1 database named `zeta-manuscript` from the Cloudflare dashboard, preferably in Western Europe, or from a terminal after `npm install` with `npx wrangler d1 create zeta-manuscript --location weur`. Copy the issued UUID into `studio/wrangler.jsonc`, replacing the all-zero placeholder. **Do not deploy until the binding is a real D1 database**. The UUID is an identifier, not a secret.
4. Run `cd studio && npm install && npx wrangler d1 migrations apply zeta-manuscript --remote` to create the current manuscript and historical revision tables. Apply before first use. The migration never imports, replaces or deletes any W004 browser drafts.
5. Generate a unique owner secret locally, e.g. `openssl rand -base64 48`, then set it in Cloudflare Workers **Settings → Variables and Secrets** as an **encrypted secret** named `STUDIO_OWNER_TOKEN`. Or run `npx wrangler secret put STUDIO_OWNER_TOKEN` from an authenticated machine. Never paste secrets in GitHub, public source or chat.
6. Deploy through the Cloudflare Git integration or run `npm run cf:deploy` from the `studio` folder after account authentication. In **Workers & Pages → your Worker → Access**, enable **Cloudflare Access** for both production and preview endpoints, with a policy that permits only your email address. Protect the Worker itself so all its routes, including `workers.dev`, are covered. The server-side owner key remains required even with Access.
7. Open the protected URL, use **••• → Connect cloud saves** and enter the owner key. Create the first cloud revision only after reviewing the local manuscript. Confirm **✓ Saved**, refresh, reconnect on a second authenticated browser and check that the actual passage is present. Try an older history restore and offline reconnection before serious writing.

### Test locally

```sh
cd studio
npm install
npm test
npm run cf:local-migrate
npx wrangler dev
```

The dev Worker must have a local `.dev.vars` containing a generated `STUDIO_OWNER_TOKEN`; never commit that file. A placeholder D1 UUID can support local simulated D1, but remote deployment must use the actual Cloudflare-provisioned UUID.

`npm test` runs the original story-routing smoke tests, browser autosave simulations and the Cloudflare Worker contract tests. GitHub CI also applies a **local D1 SQL migration** and checks the Wrangler bundle (dry-run), but CI cannot prove real remote persistence until owner activation.

## Data protection and backups

- D1 stores the complete graph in one JSON document with every scene, passage, node ID, edge, note, status and position intact, and a separate **append-only revision history**. A server-verified save increments revision atomically. A stale tab fails with HTTP 409. Restoring an older revision creates a newer revision, leaving history intact.
- The old browser-local key `zeta-studio-w004-poc-v1` is **never deleted**; W005's `zeta-studio-w005-recovery-v1` is used until verified server save. Clicking **Export manuscript** gives you an independent local JSON copy.
- The GitHub Action **ZETA private manuscript backup** now fetches the latest manuscript from the authenticated Cloudflare API instead of reading a Neon database. It stores immutable JSON snapshots in a **separate private GitHub repository**. This is optional until provisioned; when any secrets are absent it **SKIPS** and does not create a backup.
- To enable private backups, set repository Action secrets `ZETA_BACKUP_STUDIO_URL` (Cloudflare studio HTTPS URL), `ZETA_BACKUP_OWNER_TOKEN` (owner API key), `ZETA_BACKUP_GITHUB_TOKEN` (fine-grained token with Contents write to private destination only), and `ZETA_BACKUP_GITHUB_REPO` (`owner/private-repository`). If Cloudflare Access is enabled, also authorize a service token and set `ZETA_BACKUP_CF_ACCESS_CLIENT_ID` and `ZETA_BACKUP_CF_ACCESS_CLIENT_SECRET`. Verify by manually running the backup workflow and restoring a disposable snapshot.
- For disaster recovery use private GitHub JSON or manually exported JSON to import a manuscript after rebuilding D1. D1-native 7-day time travel is useful but **not independent** from Cloudflare.
- Backups run daily at 02:17 UTC once configured. They store the **latest** revision at each run, not every transient autosave; export extra copies at important milestones. Review costs, retention, token expiry and failed Actions.

## Migration / rollback safety

The former Vercel API and Neon-oriented source files remain archived under `api/` and `lib/` for rollback but are **not bundled as public Cloudflare assets**. `npm run build` copies only `index.html`, `app.js`, `cloud.js` and `styles.css` to `dist/`. GitHub source and deployments do **not** contain unpublished manuscript text or server credentials. The old Vercel project is not required for the Cloudflare service; it may be disconnected later after successful live verification.

**Status (W007 checkpoint):** production URL, correct static UI and active Cloudflare production version are verified. D1 migration/secret/Access configuration, real cross-device persistence and independent offsite restore remain unverified. Browser banner is `Local only — export backup`. Do not write valuable prose without exporting JSON first.
