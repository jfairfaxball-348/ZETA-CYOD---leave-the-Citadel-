# ZETA — W009: Private AI Manuscript Authoring Bridge

**Status, 2026-10-29: PRIVATE SYNC AND FIRST AUTHOR-APPROVED D1 WRITE VERIFIED.** The author requested execution. The public template is in [bridge-template](../bridge-template/README.md); it contains no credentials or unpublished novel text.

## Implemented

The bridge is designed to run in a new **private GitHub repository** named **jfairfaxball-348/ZETA-private-authoring**. It uses the existing Cloudflare Worker and D1 API without changing the Writing Studio.

- A private Action performs an authenticated **read-only sync** into a private passage index and per-passage snapshot files, which the connected GitHub app can read once granted access.
- After explicit author approval, ChatGPT can write a private single-passage request. The request must name an existing passage, the current D1 revision, original body SHA-256 digest and the full approved replacement body.
- A private Action validates GitHub repository visibility **before** any manuscript access. It refuses to run in a public or incorrectly named repository. The Studio owner key is stored only in private GitHub Actions secrets.
- Each request checks the current global revision and body digest, changes **only** one existing passage body, posts using the Cloudflare D1 expected-revision protocol, and GETs the document again to verify the exact new revision and content.
- The action emits metadata-only receipts indicating applied, unchanged, rejected, or needs_review. It never logs unpublished prose or tokens and never blindly retries ambiguous saves.
- Private snapshots and receipts are committed into private Git history, providing a secondary copy of writing. This is not a substitute for separately tested disaster recovery.

## Verification

Local Node tests use mocked Cloudflare APIs and disposable text to cover snapshot sync, approved edit, preservation of unrelated passages, no replay, stale version and digest, author approval, invalid request fields, ambiguous acknowledgements, missing secrets and public-repo refusal. The public [W009 template-test workflow](../.github/workflows/w009-bridge-tests.yml) runs only these tests. **No real ChatGPT-to-D1 write has occurred through the bridge.**

## Owner activation gate

1. [Create the private GitHub repository](https://github.com/new?owner=jfairfaxball-348&name=ZETA-private-authoring&visibility=private), explicitly selecting **Private**.
2. Grant the existing ChatGPT GitHub app access to that private repository.
3. Copy the [bridge template](../bridge-template/README.md) to its repository root. The maintainer can populate files using GitHub after connector access is granted.
4. Configure the private Actions secret **ZETA_STUDIO_OWNER_TOKEN** to the existing Writing Studio owner key. Never place its value in chat, repository source or workflow inputs.
5. Manually run the new private GitHub Action in **sync** mode; confirm that private snapshot files appear. Then test a disposable, explicitly approved existing-passage edit, verify Cloudflare read-back and rejection of a stale edit.
6. Only after live receipt verification should W009 be described as active. W008 browser-based writing remains active throughout.

Detailed schema, safety limits, and setup: [bridge-template README](../bridge-template/README.md). No additional Worker, Cloudflare database, broad graph editing, bulk overwrites or public manuscript publication is included.

## Private repository activation update — 2026-10-29
- The author created [ZETA-private-authoring](https://github.com/jfairfaxball-348/ZETA-private-authoring) and GitHub confirmed the repo is **private**. The existing ChatGPT GitHub connection has read/write access to it.
- Installed the W009 bridge code, Actions workflow and isolated safety-test workflow in **private** `main`, commit `46a6f5d35d51dc4a1382bb535b2db3419564ee02`. The transfer contained only template code and empty directory placeholders, **no actual manuscript data or owner key**.
- The private repo's Actions [safety test run 40942078327](https://github.com/jfairfaxball-348/ZETA-private-authoring/actions/runs/40942078327) **passed**. The bridge runner itself has not been executed against production D1.
- **Remaining owner action:** add secret `ZETA_STUDIO_OWNER_TOKEN` in the private repository's [Actions Secrets](https://github.com/jfairfaxball-348/ZETA-private-authoring/settings/secrets/actions) using the same existing key used in Writing Studio. Do not disclose key to chat or commits. After that, run [ZETA private manuscript bridge](https://github.com/jfairfaxball-348/ZETA-private-authoring/actions/workflows/authoring-bridge.yml) with mode `sync`. Verify snapshot files privately; no D1 write occurs on sync.
- Only then test an author-approved disposable existing-passage edit; confirm receipt `applied` and independent D1 read-back. Until that passes, ChatGPT-to-D1 writes remain **not live**.

## First verified production publishing — 2026-10-29
The owner explicitly approved an opening prose replacement for private manuscript passage P-0001. The private bridge [Actions run 40944095983](https://github.com/jfairfaxball-348/ZETA-private-authoring/actions/runs/40944095983) completed successfully. Private receipt `opening-first-draft-20261029` reported **applied**, advancing D1 revision **3 → 4** at **2026-10-29T19:53:26.584Z**. Independent connector fetch of the fresh private snapshot confirmed that P-0001's body exactly matched the approved private request, its three outgoing edges remained intact, and the other nine passage-body digests were unchanged. Only the passage was edited; no fiction or secrets were copied to the PUBLIC repository.

**Operational handoff:** W009 can now read and save approved bodies of EXISTING passages via the private connected GitHub repository. Each subsequent edit requires explicit approval of the exact text, a fresh revision/hash precondition, Action success, a private receipt, and independent snapshot verification. Do not claim any later revision until checked. The next creative workshop is [W010](W010_OPENING_NARRATIVE_WORKSHOP.md); illustrations remain deferred.
