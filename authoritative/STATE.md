# ZETA — Current project state

**As of:** 2026-10-29
**Latest executed workshop:** W004 — workflow/authoring POC **CLOSED AT SPECIFIC SCOPE**; W001–W003 original creative architecture remains frozen.
**Repository lineage:** S000 → W001 → W002 → W003 → W004 simplified studio POC.
**Next session:** [W005 — Durable Authoring Infrastructure](../workshops/W005_PROMPT.md) (**prepared, NOT executed; fresh owner instruction required**).

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

## Status boundaries
- **CANON:** DEC-0001–0020 only at stated creative/design scope. W004 chose a process and authoring tool, **not** plot, actual passages, numbered print references, approved accusations, proof scenes, or a new world law.
- **PROPOSAL only:** Collatz/hailstone travel, random walks, modular computed jumps, chance mechanics, region-specific numeric rules or hidden patterns.
- **OPEN:** Final layout and real novel content; all plot scenes, antagonist/protagonist identities, exact motives and accusations/refutations, reader numbering, state flags, narrative gates, ending detail, print workflow, durable manuscript backend and backup policy.
- **OPEN COSMOLOGY:** Whether agency constraints exist; simulation is not fact; later π discovery is speculative.

## Next work and permissions
**W005** is a future infrastructure execution session: secure persistence, authorization, autosave confirmation, safe local-draft migration, revision history, backup/restore and verification without complicating the studio UI. Its installation is **not execution** and does not authorize paid provisioning. Keep the approved fiction untouched.

References: [W004 closeout](../workshops/W004_CLOSEOUT.md) · [W005 prompt](../workshops/W005_PROMPT.md) · [Decisions](DECISIONS.md) · [Open Questions](OPEN_QUESTIONS.md).
