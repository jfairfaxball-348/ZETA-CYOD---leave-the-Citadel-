# ZETA — W009 private authoring bridge (installation template)

**Status: CODE TESTED; NOT LIVE UNTIL INSTALLED IN A PRIVATE REPOSITORY AND VERIFIED AGAINST CLOUDFLARE.**

This directory is an **inert template** in the public ZETA repo. Do not add unpublished manuscript text, real requests, or secrets here. GitHub only executes workflows in a repository's root .github/workflows/, not this nested template folder.

## What it does

1. In a **private** GitHub repository, an Action reads the existing Cloudflare Writing Studio API using a secret held in **GitHub Actions secrets**, never in chat or code.
2. Its **private snapshot** contains snapshot/index.json and snapshot/passages/<sha256-of-id>.json. After GitHub app access is granted, ChatGPT can read these, draft improvements and submit author-approved edits.
3. Each edit is a private requests/<id>.json file naming exactly one existing passage, a current D1 revision, original body SHA-256 digest, new body, and approved: true.
4. The Action re-reads D1, rejects stale/conflicting requests, changes **only that passage's body**, POSTs using optimistic revision checking and GETs again to verify persistence. It writes a safe metadata-only results/<id>.json receipt, then refreshes the private snapshot.
5. The Action refuses to start unless GitHub's authenticated API reports that the repository is precisely jfairfaxball-348/ZETA-private-authoring **and private**. It will not run from the public ZETA source repo.

It cannot create nodes, delete or move passages, edit links/notes, or change the wider manuscript structure. Use the existing Writing Studio UI for those tasks. No new Cloudflare services or databases are needed.

## One-time owner setup

1. Create **jfairfaxball-348/ZETA-private-authoring** on GitHub, choose **Private**, and initialize it with a README: https://github.com/new?owner=jfairfaxball-348&name=ZETA-private-authoring&visibility=private .
2. Give the connected ChatGPT GitHub app access to this new private repository through your GitHub installed-app settings. **Keep the existing ZETA fiction/code repository public.**
3. Copy all files from this bridge-template/ directory into the **root of the private repository**, not into a nested bridge-template folder. The essential private paths are .github/workflows/authoring-bridge.yml, scripts/bridge.cjs, requests/.gitkeep, results/.gitkeep, snapshot/passages/.gitkeep, and package.json. Keep the default branch named main.
4. In the private repository's **Settings → Secrets and variables → Actions → New repository secret**, create ZETA_STUDIO_OWNER_TOKEN. Use the same owner key currently used to connect cloud saves in the Writing Studio. **Never paste its value into ChatGPT, GitHub source, an issue, or a workflow input.** If it is lost, rotate the Worker secret and update the Studio connection instead of sharing it.
5. Only if Cloudflare Access blocks machine requests, also configure an allowed service token in Cloudflare Access and add both ZETA_CF_ACCESS_CLIENT_ID and ZETA_CF_ACCESS_CLIENT_SECRET as private GitHub Actions secrets. Otherwise leave both absent. Do not disable Access to make the bridge work.
6. Enable GitHub Actions, with the workflow's narrowly scoped contents: write permission for its GITHUB_TOKEN. Your GitHub account/organization might also require workflow write permission for protected branches.
7. Run the private repo's **Actions → ZETA private manuscript bridge → Run workflow → sync**. Confirm success; snapshot/index.json should show a real revision and passage list. Sync **reads only**, without creating any new D1 revisions.
8. Test one **explicitly approved disposable passage change**. Verify a result with status applied, a new D1 revision, a read-back in the Studio, then try a stale request and confirm rejection. Only after that can ChatGPT genuinely claim direct live saving.

## Editing protocol

Read the private snapshot/index.json for revision and the chosen passage's file, title, SHA-256 digest, and existing text. Draft a full replacement body with the author. **Do not create an edit request until the author approves that exact passage text.**

An approved request in the private requests/ directory must have the following shape:

```json
{
  "version": 1,
  "requestId": "edit-opening-001",
  "passageId": "ACTUAL_EXISTING_PASSAGE_ID",
  "expectedRevision": 7,
  "expectedBodySha256": "0000000000000000000000000000000000000000000000000000000000000000",
  "newBody": "The complete approved replacement passage goes here.",
  "approved": true
}
```

**All sample values above are placeholders, not live values.** Copy the actual passage ID, revision, and body digest from the fresh private snapshot. Each request ID must be unique and use lowercase letters, digits, hyphens and underscores. Real replacement text belongs ONLY in the private repository.

A push to requests/*.json runs the private Action. It processes requests with no previous receipt, saves metadata-only results/*.json, and refreshes snapshot/*.json. ChatGPT reads the result and snapshot to verify. Only status **applied** with an acknowledged revision and verified D1 read-back means a new cloud write. Status **unchanged** is a successful no-op. Status **rejected** means nothing was applied. Status **needs_review** means an ambiguous save or verification; inspect live D1 before a new request. A stale request must be re-authored against a fresh snapshot; no automatic overwrites or merges.

## Safety and limits

- **Private means private:** The new private repo's Git history contains unpublished text and prior snapshots. Do not make it public later; deleting the latest file does not erase history.
- **Actual secrets only in Actions secrets.** The Studio host is pinned to the known workers.dev address and redirects are refused.
- **One passage body only:** All other manuscript fields and passages are preserved byte-for-byte at the JSON-object level.
- **Concurrency:** exact manuscript revision AND original passage hash must match; the D1 server also enforces 409 on a stale revision.
- **No false success:** after POST, the action must confirm the precise revision and text by a second GET. Ambiguous saves are marked needs_review and are never replayed automatically.
- **Private repository snapshot is an additional backup**, not a verified independent recovery process. It is not an archive of every interim D1 autosave or the whole server's revision history. Keep occasional manual exports and check restoration as needed.
- **GitHub Actions minutes** on private repos may count against plan limits. The browser Studio remains usable if Actions is unavailable.
- The public repo includes only template code and mock tests; the live Worker/API need **no code changes**.

## Tests

```sh
node --check scripts/bridge.cjs
node --test tests/bridge.test.cjs
```

These tests use fake network responses and disposable words, never the live D1 manuscript. The public CI workflow separately checks this template, but it cannot substitute for the private Action's real sync/save verification.
