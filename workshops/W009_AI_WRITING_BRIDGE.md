# ZETA — W009: Private AI Manuscript Authoring Bridge

**Status, 2026-10-29: IMPLEMENTED AND LOCALLY TESTED; PRIVATE INSTALLATION AND LIVE SAVE PENDING.** The author requested execution. The public template is in [bridge-template](../bridge-template/README.md); it contains no credentials or unpublished novel text.

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
