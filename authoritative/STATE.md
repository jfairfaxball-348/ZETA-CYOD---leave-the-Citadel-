# ZETA — Current project state

**As of:** 2026-10-30
**Latest executed:** W012 **CLOSED AT PROSE APPROVAL SCOPE**: road D/K and outer-wall R/Y encounter chunks approved; full wall prose now archived privately in seven verified segments, but not published to D1. Next: W013 two local convergence chunks. W011 design closed; W010 five opening chunks P-0001–P-0005 remain at verified D1 **revision 9**, with no new road nodes or D1 edits. W008 authoring and W009 private GitHub→D1 existing-body bridge remain available. Legacy checkpoints later in this file are historical.
**Repository lineage:** S000 → W001 → W002 → W003 → W004 simplified POC → W005 persistent-save protocol → W006 Cloudflare hosting implementation.
**Current stage:** [W012 closeout](../workshops/W012_CLOSEOUT.md) and [W013 next writing workshop](../workshops/W013_TWO_LOCAL_CONVERGENCES.md). [W008 writing](../workshops/W008_FIRST_WRITING_SESSION.md) remains active; [W009 private authoring bridge](../workshops/W009_AI_WRITING_BRIDGE.md) edits **existing passage bodies only**. New route nodes and edges still require the Studio UI. Earlier checkpoints below are archival.

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

## Cross-browser retrieval VERIFIED — 2026-10-29
The owner wrote and saved a disposable `TEST` passage in one browser. Opening ZETA Writing Studio in a different browser (Safari) with an initially blank local state and connecting to the same cloud manuscript successfully retrieved that test passage. This verifies cross-browser read-back of production D1 manuscript data independently of the original browser's local storage. Previous notes saying cross-browser recovery was unverified are historical. Still required before declaring W008 ready: verified history restore, owner-only Cloudflare Access and private independent offsite backup with recovery test. Do not commit manuscript text or credentials.

## W008 owner authorisation (29 October 2026)
Author explicitly ends the extra persistence-test gate and starts prose drafting. A live D1 document was retrieved in Safari from a blank state after saving in another browser. Manual JSON export remains a prudent backup, not a blocking prerequisite. Manuscript prose stays in the private Writing Studio, not the public code repository. A cloud ChatGPT-to-D1 writer is not yet connected; see W009.

## W009 bridge implementation checkpoint, 2026-10-29
The public [bridge-template](../bridge-template/README.md) and secret-free template-test CI were implemented. It uses a private-only repo guard, per-passage author approval, D1 revision and old-body-hash conditions, read-back verification and metadata-only receipts. There are no public unpublished manuscript texts or credentials. The separate private repo and GitHub Actions secret have not yet been installed; no remote authoring bridge save can be claimed. W008 browser writing continues. Older infrastructure checkpoints above are retained as historical evidence and superseded by later D1 milestones where contradictory.

## W009 private deployment checkpoint (2026-10-29)
Private repository `jfairfaxball-348/ZETA-private-authoring` was confirmed `visibility=private` with GitHub connection read/write access. Private `main` commit `46a6f5d35d51dc4a1382bb535b2db3419564ee02` installed the script, workflow, tests and empty manuscript directories. Private GitHub Actions safety tests [passed](https://github.com/jfairfaxball-348/ZETA-private-authoring/actions/runs/40942078327). No manuscript data or owner key was copied. Owner must set private Actions secret `ZETA_STUDIO_OWNER_TOKEN`, run read-only `sync` and confirm subsequent approved disposable save against D1. **W009 is not live yet**; no direct manuscript mutation claimed. See [W009 record](../workshops/W009_AI_WRITING_BRIDGE.md).

## W010 installation / W009 publishing milestone — 2026-10-29
W009's first real ChatGPT-to-D1 approved edit succeeded for **P-0001**, advancing manuscript revision **3 → 4** with a positive private receipt and read-back from the resulting private snapshot. The other nine passage-body hashes and the opening three outgoing edges were unchanged. Private sync and writes are now verified; the owner key remains private. No unpublished prose belongs in this public repository.

**W010 has been installed but not executed.** The next session is a collaborative opening narrative workshop: explore immediate stakes, the three distinct apparent grounds for unjust exile, their reconvergence at draft page 2, and the first shared Act I moments; draft prose interactively and obtain explicit author approval. At session end, the assistant must publish each approved complete existing passage body sequentially through the private W009 GitHub Action, check receipt and fresh D1 snapshot, and report actual revision(s). Defer image work and unsolicited graph/UI changes. See [W010 workshop](../workshops/W010_OPENING_NARRATIVE_WORKSHOP.md).

## W010 live creative checkpoint — 29 October 2026
- Owner approved DEC-0021–0023: second-person brisk gamebook voice; apprentice player approximately age 25, with mentor Chapter Elder Luiz; opening words remembered rather than spoken in the present; lone player at Citadel outer gate, interior door closed and exterior door open.
- The three mathematical exile accusations and their eventual disproofs remain PROPOSAL/OPEN. Do not commit speculative judgements as canon or unpublished draft prose into this public repository. No W010 passage-body publishing has occurred on this checkpoint.
- Owner approved DEC-0024: the apprentice **discovered** an anomaly during their work (option B); this challenged the Citadel's accepted understanding and prompted knowingly unjustified expulsion. Three specific judgements, discoveries and Act II refutations remain open; no new private D1 passage has been approved or saved in this continuation.


## W011 design closeout and W012 installation — 2026-10-30
Owner approved the 2→4→2→1 post-gate first clue structure; three four-choice occasions; literal letter D/K/R/Y, number 7/16/25/34, colour GREEN/AMBER/BLACK/WHITE; invariant 475 for all 64 journeys; helpful worked riddle/instructions; **numbered paragraph** rather than page navigation; common secret cheat-code advantage and always-available fallback disadvantage at Act-II return. Approved decisions DEC-0025–0028. Mechanics: [three-memory puzzle](../cyod/THREE_MEMORY_RETURN_PUZZLE.md). No new full narrative prose was owner-approved in W011; **no D1 edit, cloud revision change, link/node addition or publication deployment occurred**. Next: [W012 four-branch prose](../workshops/W012_FOUR_FIRST_CLUE_BRANCHES.md).

## W012 approved road prose checkpoint — 2026-10-30
Owner approved the first road encounter (delivery records: nine observed, eight official), the disclosure-vs-investigation choice, the D/K outcomes, story-grounded Citadel letter seals and a separate CYOD Journal recording instruction (DEC-0029). Exact prose was committed to **PRIVATE** `jfairfaxball-348/ZETA-private-authoring/approved/w012-road-letter-branches.md`. The alleged letter request at a gate is a character report, **not an established magical law**. Journal page number remains open. This archive is **not a live D1 write**: no new passage nodes or edges were created, P-0005's prior edge to P-0006 remains, and the last verified D1 revision stays **9**. Next W012 activity is drafting the footsteps/wall **R/Y** branches for explicit owner approval.


## W012 completed prose scope and W013 installed — 2026-10-30
- Owner explicitly approved the existing road traveller/D-K outcomes AND all outer-wall former-surveyor/R-Y outcomes (DEC-0029/0030), including in-story seal-letter discoveries and separate Journal recording instructions.
- Private GitHub holds full approved road copy, wall-approval metadata and initial wall excerpt files. Tool restrictions prevented verifying a **complete** wall-body private archive. Do not infer that all wall text has been uploaded from metadata alone. The complete wall draft is approved in the immediately preceding conversation.
- **No live Studio graph changes or D1 publication verified.** Last known D1 revision **9**, with P-0005 still linked to P-0006 (deferred gateway). The private W009 bridge is body-only and cannot create the six new passages. Public repository contains decisions only, not unpublished prose.
- W013 installed to write exactly two local joins: road after D/K and outer wall after R/Y; then eventual shared Act I. Follow [W012 closeout](../workshops/W012_CLOSEOUT.md) and [W013 prompt](../workshops/W013_TWO_LOCAL_CONVERGENCES.md).


## W012 full prose approval — 2026-10-30
Road D/K and outer-wall R/Y encounters and outcomes are OWNER-APPROVED (DEC-0029, DEC-0030). Separate story-grounded letter seals and Journal instructions are approved; gate magic is not proven. Private GitHub contains full road prose, a wall approval record and portions of the wall scene; full wall prose is preserved in seven private approved segment files; cloud D1 publication remains blocked. No Studio nodes or edges were created; last verified D1 revision is 9, P-0005 still points to P-0006. The W009 private bridge handles existing bodies only. Next: W013 local road and wall convergence writing. See [W012 closeout](../workshops/W012_CLOSEOUT.md).
