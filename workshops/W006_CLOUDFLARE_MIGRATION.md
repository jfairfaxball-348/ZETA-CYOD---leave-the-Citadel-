# W006 — Migrate Writing Studio away from Vercel

**Date:** 2026-10-29
**Owner instruction:** “Do we have to use Vercel? If there is an alternative lets go with that”.
**Decision:** Cloudflare Workers + D1 is the active infrastructure target for ZETA's private Writing Studio, rather than Vercel. This is an engineering decision only, not story canon.

## Changes

- Cloudflare Worker serves the existing `/api/manuscript` protocol, with D1 transactional revisions, owner-key authentication, same-origin check, complete document validation and revision conflict detection.
- D1 schema/migrations and Wrangler deployment config prepared. The database UUID is an explicit all-zero placeholder until the owner provisions a D1 database.
- Only four client assets are included in the public deployment; the source, old Vercel API, database migrations and author secrets are excluded.
- The private GitHub backup workflow retrieves an authorized Cloudflare manuscript snapshot via HTTPS and refuses public destinations. It will skip safely until new credentials are supplied.
- Existing novel story graph, opening marks, three-Act interface and W001–W003 canon unchanged; pre-existing browser data remains available.
- Tests include existing UI/reader regressions, new Worker API integration-mock tests, a local D1 migration and Wrangler bundle dry-run.

## Limitations and operational gates

No Cloudflare connection was available through authorized tools. No Cloudflare account/database, secret, Worker or Access policy was provisioned, no deployment occurred, and no live persistence/backup tests have passed. Owner must connect/provision Cloudflare and verify Access, D1 saves, account sync, older revision restore and independent private backup **before** calling this production ready.

See [studio/README.md](../studio/README.md) for step-by-step activation; the next dedicated activation session is [W007](W007_CLOUDFLARE_ACTIVATION.md).
