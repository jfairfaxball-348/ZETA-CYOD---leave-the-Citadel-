# ZETA — W009: AI-to-Cloudflare Writing Bridge (PROPOSED / NOT DEPLOYED)

## Goal
Let ChatGPT save author-approved *individual passage edits* in the existing D1-backed Writing Studio in cloud conversations. Never expose credentials or unpublished manuscript prose in this public repository.

## Current capability
The Studio's authenticated `GET /api/manuscript` and `POST /api/manuscript` use `expectedRevision` to reject stale overwrites. A separate-browser save/recovery has been demonstrated. The ChatGPT GitHub connector is already available, but there is no Cloudflare D1 plugin or remote AI writing bridge connected.

## Recommended path: private GitHub authoring repository
1. The owner creates a new **private** GitHub repository for manuscript drafts or proposed passage changes, and explicitly grants the connected GitHub plugin access.
2. ChatGPT writes an author-approved passage file or request there through GitHub tools. This does **not** automatically mean the live D1 changed.
3. A private-repository GitHub Action holds the Studio endpoint and an API token in **GitHub Actions Secrets**, not code or chat. It reads the current D1 document/revision, modifies only the specified passage, and POSTs with `expectedRevision`.
4. Fail safely on HTTP 409 if someone else saved meanwhile; do not override or overwrite an entire manuscript from a stale local snapshot. Log only metadata, not prose or tokens.
5. After server acknowledgement, verify the new revision and report the successful actual cloud save.

This requires one-time private repository and secret setup. The workflow is not installed yet. Never place manuscript text in public GitHub Actions inputs, public issues or commits.

## Alternative: remote MCP
A separate Cloudflare Worker can expose scoped `list_passages`, `read_passage`, `save_passage` tools behind OAuth, with limited agent write permission and revision conflict handling. ChatGPT's current custom MCP write availability depends on plan/workspace access (currently Business/Enterprise/Edu; see https://help.openai.com/en/articles/12584461-connecting-custom-mcp-servers-in-chatgpt ). A local `.env` file cannot automatically authorize this cloud connection.

## Immediate authoring now
ChatGPT drafts and the author pastes approved prose into the private Studio, waits for `✓ Saved`, and can periodically Export manuscript. Once a connected write bridge exists, ChatGPT can issue actual saves directly.
