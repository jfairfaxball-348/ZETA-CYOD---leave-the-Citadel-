# Leave the Citadel — Writing Studio (W005)

The writing experience is intentionally simple: **three Acts → scene → passage → write**. Nothing in this infrastructure session changes the fictional canon or creates new prose.

## Save status means exactly what it says

- **Local only — export backup**: changes are retained in this browser's recovery buffer, not remotely. Use **••• → Export manuscript** before trusting valuable drafts.
- **Saving…**: waiting for the database to confirm a revision. The editor also keeps a local recovery buffer.
- **✓ Saved**: the API confirmed a committed server revision. The revision is preserved in server history.
- **Offline / failed — local changes kept**: the server did not confirm the save. The browser copy remains but can be lost if site data is cleared; export JSON.
- **Conflict — local changes kept**: another session has a newer server revision. This tab will not silently overwrite it. Export the local manuscript, reconnect, and choose which version to keep. Automatic textual merge is deliberately excluded.

Your old W004 localStorage key `zeta-studio-w004-poc-v1` is read as a fallback but never deleted or overwritten by W005. New drafts are buffered under `zeta-studio-w005-recovery-v1`; older browser copies can be downloaded using **••• → Download local recovery**. Browser storage is **not** an independent backup.

## Provider and API architecture

- Main store: transactional external PostgreSQL (Neon-compatible), using `DATABASE_URL`. The Vercel serverless filesystem is **never** the manuscript store. Server tables are created on first authenticated use: one current manuscript and immutable version rows.
- All reads, exports, writes, restores and history queries require a 32+ character owner bearer key checked **server-side**. Vercel Deployment Protection remains an additional safeguard, not the API authorization mechanism. The key lives only in the unlocked browser tab's memory.
- Every write uses an expected revision. A stale tab/device receives HTTP 409 and retains its local draft. Restore writes a **new** head revision without deleting newer history. Save and revision creation occur in one database transaction.
- Server validates the whole graph, including scene/passage IDs and link destinations, without discarding prose or unrecognized editorial fields. 2 MB maximum payload.
- Owner-facing interface retains the W004 three-Act overview, scene drilldown and focused writing drawer. No framework or dashboard added.

## Activation before real writing

**No database, credentials, live deployment or remote backup has been provisioned by W005. Cloud persistence remains inactive until the owner completes these steps.**

1. Create a Neon-compatible PostgreSQL database in an account you control, reviewing any free-tier limits, charges, backups and terms before enabling services. No paid service has been authorized automatically.
2. In Vercel project `zeta-writing-studio`, Root Directory `studio/`, add protected server variables: `DATABASE_URL` (DB connection string) and `STUDIO_OWNER_TOKEN` (secure random 32+ character key). Generate a random secret locally with `openssl rand -base64 48`. Do **not** commit either secret, use a public-prefixed name, or send the key in chat.
3. Keep Vercel SSO Deployment Protection enabled. Deploy when the Vercel build quota permits. Open the private site, choose **••• → Connect cloud saves**, and enter the owner key.
4. Edit a disposable passage. Verify **✓ Saved** before refreshing. Reconnect in another authorized browser; test editing, conflicts, a historical restore and recovery export before entering unpublished manuscript prose.

If the API is not configured, it returns `NOT_CONFIGURED`; no draft is advertised as remotely saved.

## Independent remote backup — opt-in configuration required

The new `ZETA private manuscript backup` GitHub workflow is scheduled for **02:17 UTC daily**, and supports manual `workflow_dispatch`. Until secrets are configured it logs **SKIP** and creates **no backup**. For activation set GitHub Actions repository secrets:

- `ZETA_BACKUP_DATABASE_URL` — a PostgreSQL credential to read the manuscript (prefer read-only)
- `ZETA_BACKUP_GITHUB_TOKEN` — fine-grained GitHub token with Contents read/write for the *separate private backup repository only*
- `ZETA_BACKUP_GITHUB_REPO` — `owner/private-repository`

The script checks that the destination GitHub repository is **private**, then writes the current document as `revisions/revision-00000001.json`, with one path per unique revision. Existing snapshots are never overwritten. After configuring, use **Actions → ZETA private manuscript backup → Run workflow**. Verify the actual JSON appears in the private repo, manually download it, and test **Import manuscript** on a disposable revision. Do not regard history inside the primary DB as an independent backup.

The backup keeps copies until you remove them, so review retention, credentials, failures and storage use periodically. With a daily schedule, edits since the most recent successful backup remain exposed to a primary-storage catastrophe; export an additional copy for important milestones.

## Testing, limitations and recovery

Run `cd studio && npm install && npm test`; the CI suite covers scene navigation, reader marks, cache recovery, unauthorized API requests, invalid documents, stale writes, server version restore and a simulated second-browser session. **The backend and second-browser API tests use a mock database.** They are not proof of live provider, real browser, redeploy or independent backup behavior. Those require owner activation and an end-to-end test.

If cloud and local versions differ, the studio offers to archive/download the local manuscript before switching to the cloud version. If the server is unavailable, leave the browser open where possible, use **Export manuscript**, and reconnect after service recovers. A previously archived private JSON backup can be imported and saved as a fresh version once the server is operational.

## Development and deployment

Static client: `index.html`, `app.js`, `cloud.js`, `styles.css`. Server API: `api/manuscript.js`, `lib/`. Vercel project: **zeta-writing-studio**, Root Directory `studio/`, Framework Preset **Other**. Secrets are server-only. Build/deployment quota failures do not alter GitHub CI status.

This code is **prepared, not yet production-verified**. No manuscript graph or canon has been modified by infrastructure changes.
