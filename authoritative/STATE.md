# ZETA — Current project state

**As of:** 2026-10-29
**Latest invoked workshop:** W007B — **production D1 manuscript revision 1 VERIFIED; cross-browser recovery, owner-only Access and private backup remain OPEN**. W007 confirmed the production URL and UI. Connected Cloudflare dashboard reports active version `d492231a` at 100% traffic; browser displays `Local only — export backup`. W006 GitHub main CI is green. D1 binding, Access, manuscript save/restore and independent backup remain unverified. W001–W003 fiction canon unchanged.
**Repository lineage:** S000 → W001 → W002 → W003 → W004 simplified POC → W005 persistent-save protocol → W006 Cloudflare hosting implementation.
**Next session:** Continue W007B until real Cloudflare D1, owner protection and independent backup are proven; [W008 first writing session](../workshops/W008_FIRST_WRITING_SESSION.md) is prepared but LOCKED until those checks pass. See [W007 checkpoint](../workshops/W007_PROGRESS.md).

## Approved creative architecture
- **W001 / DEC-0001–0010:** Vast mathematically inspired ZETA, Citadel inside wider number-theory territory (fantasy name OPEN), Topologia, Combinatorium. Minimal command “…leave The Citadel”, illustrated right-wrist choice (digit→draft page 102, knot/interlocking form→203, binomial mark→304); each different reason ends ONLY “Turn to page 2”; all join common Act I and mark persists as determinant of Act II destination without branching shared Act I. Three acts ~one third each; Act III returns to Citadel.
- **W002 / DEC-0011–0015:** Wrongful exile under three distinct, invalid judgements; regional Act II exploration discovers refutation for selected judgement; Act III return/confrontation/vindication with route-sensitive consequences. Authorities knowingly participate in deception; most believe they exercise free agency, some may suspect otherwise; one strange Act III incident suggests possible constraint without answering universe-level mystery.
- **W003 / DEC-0016–0020:** Blend **River** (Act I predominately forward branching), **Atlas** (Act II exploration/revisits) and **Living Book** (Act III layered printed-book interaction). Physical pages, ordered numbered passages and occasional calculated jumps coexist; all content and destinations are preauthored, with protected narrative gateway safety and testability. Keep novel voice free of explicit “maths”/“mathematics” terminology in reader-facing prose. No combat/roll-for-luck/equipment/provisions/stat/resource RPG; meaningful choice drives danger. Chance can support purposeful bounded navigation, not mandatory random progress.

## W004 completed: authoring workflow and prototype (not story canon)
- **Approved workflow:** Iterative scene-and-choice **vertical slices (C)**, and one underlying navigable graph with **collapsible scene groups (B)**. Broad story structure exists without requiring all passage nodes to be predetermined.
- **Approved UI direction:** Extremely light interface; start on an overview of three Acts and their scenes, drill into one local scene's passages, click a passage to write. Hide distracting infrastructure controls.
- **Built:** Standalone static no-build app in [studio/](../studio/), including local save, JSON export/import, reader routing, scene and passage creation, linking and smoke tests.
- **Critical limitation:** Manuscript is **not yet persisted remotely**. Save is `localStorage` tied to a browser; deleting site data, using a different device or a private window can lose writing. Until W005's durability/backup tests pass, export JSON manually. Do not claim server backups, account sync or revision history exist.
- **Vercel:** `zeta-writing-studio` linked to GitHub with root `studio/`; owner controls deployment. A GitHub Actions green test and a Vercel build-rate failure are different statuses.

## W005 executed at implementation scope (NOT live durability closeout)
- **Built:** transactional and authorized manuscript API; expected-revision conflict protection; version history/restore; quiet cloud autosave; browser recovery and non-destructive local-vs-cloud selection; private scheduled backup workflow. See [W005 record](../workshops/W005_PROGRESS.md) and [studio runbook](../studio/README.md).
- **Tests:** API security, revision and recovery protocol using a mock backend, plus second-browser jsdom simulation. GitHub CI does not prove the database, provider backup or Vercel deployment.
- **Not yet done:** no external PostgreSQL, Vercel env keys, backup repo/token or live deployment configured; no real cross-device/save/restore verification. Until W005A, manually export valuable prose.
- **Important:** Existing W004 browser data is preserved and the three-Act overview is unchanged. No story canon changes.

## W006 executed at Cloudflare migration-code scope, not live activation
- **Owner instruction:** Vercel is optional; owner chose an alternative. The target is now **Cloudflare Workers with D1 SQLite storage**, using one hosting provider. Source: [W006 record](../workshops/W006_CLOUDFLARE_MIGRATION.md) and [studio deployment guide](../studio/README.md).
- **Built:** Worker implementation of the existing authenticated manuscript API, D1 transactional revision history and restore, Wrangler configuration, SQL migration, safe client-only static bundle, remote-API private-backup workflow, tests and local migration/dry-run checks.
- **At W006 closeout:** No Cloudflare service, D1 UUID, secret, Access policy, offsite backup credentials or real-browser end-to-end test. **W007 update:** owner subsequently reported a green Cloudflare deployment of `zeta-cyod---leave-the-citadel`; live production URL and correct static editor have since been verified via the connected browser. Live D1 durability, Access protection and offsite backup remain unproven. The previous Vercel project and legacy code remain rollback-only.
- **Safe interim rule:** Export browser manuscript JSON before substantial prose. The cloud "Saved" indicator must not appear without a real server-confirmed revision.

## Status boundaries
- **CANON:** DEC-0001–0020 only at stated creative/design scope. W004 chose a process and authoring tool, **not** plot, actual passages, numbered print references, approved accusations, proof scenes, or a new world law.
- **PROPOSAL only:** Collatz/hailstone travel, random walks, modular computed jumps, chance mechanics, region-specific numeric rules or hidden patterns.
- **OPEN:** Final layout and real novel content; all plot scenes, antagonist/protagonist identities, exact motives and accusations/refutations, reader numbering, state flags, narrative gates, ending detail, print workflow, durable manuscript backend and backup policy.
- **OPEN COSMOLOGY:** Whether agency constraints exist; simulation is not fact; later π discovery is speculative.

## Next work and permissions
**W007B** resumes the incomplete Cloudflare activation: retain confirmed live domain, verify Worker build root, provision/verify D1 migration, Access and secret, then prove cross-device manuscript durability and independent backup. W005A's Vercel/Neon setup is superseded. A green deployment alone does not prove any of these gates; no paid resources without explicit approval.

References: [W004 closeout](../workshops/W004_CLOSEOUT.md) · [W005 prompt](../workshops/W005_PROMPT.md) · [Decisions](DECISIONS.md) · [Open Questions](OPEN_QUESTIONS.md).

## W007B execution checkpoint — 29 October 2026
- GitHub PR #7 (preview/name configuration) remains open and has not been deployed to production. Its staged `studio/wrangler.jsonc` now has owner-supplied D1 UUID `3ab9afed-9fe2-4c05-99e8-162c3d1cc5f2` (previously all zeroes), but remote migration, binding and manuscript read/write remain UNVERIFIED. Do not merge until live security and durability checks pass.
- GitHub PR #8 (transactional revision integrity and verifiable backup) merged into PR #7's staging branch only; GitHub CI passed on the implementation, including real *local* Wrangler/D1 HTTP save, read, stale conflict and restore. This is code hardening, **not a verified cloud save**. No public novel manuscript was added.
- The connected Cloudflare dashboard shows the existing production Worker is active; no credentials or account mutation capability is available to this session. Remote D1, authentication, production write/read, independent private GitHub backup, and cross-browser recovery all remain outstanding owner-side validation.
- W008 is not authorized for real prose until W007B's live durability and backup gates pass.

## 2026-10-29 D1 SQL activation update
The owner ran the existing migration SQL in Cloudflare's D1 Console for `zeta-manuscript` (`3ab9afed-9fe2-4c05-99e8-162c3d1cc5f2`); the connected Cloudflare console displays `This query successfully executed`. Schema SQL is therefore reported/accepted, but a direct read of both tables is pending. Wrangler remote migration tracking may not have been created because SQL was entered manually. **No live Worker DB binding, owner secret, production release, remote manuscript save or private backup has been verified**. See [W007B progress](../workshops/W007B_PROGRESS.md).

## Latest verified cloud persistence milestone — 29 October 2026
Live D1 `zeta-manuscript` returned `book-one` revision 1, last updated `2026-10-29T18:45:15.234Z`, document size 5159 bytes, with the Writing Studio showing Saved. W007 PR #7 has merged to main; production Cloudflare build succeeded. Older historical checkpoints above may predate this result. Do not declare W008 ready until recovery in a separate browser, revision restore, Access restriction and independent private backup are verified.
