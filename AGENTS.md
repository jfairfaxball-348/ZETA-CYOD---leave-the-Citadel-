# ZETA — Instructions for AI-assisted sessions

This is an instruction file for subsequent collaborators. The project owner controls fictional canon, major editorial commitments and publication.

## Required reading and provenance
1. Read [START_HERE](authoritative/START_HERE.md), [STATE](authoritative/STATE.md), [CANON_POLICY](authoritative/CANON_POLICY.md), [DECISIONS](authoritative/DECISIONS.md) and [OPEN_QUESTIONS](authoritative/OPEN_QUESTIONS.md).
2. Read the relevant [story](story/BOOK_ONE.md), [CYOD](cyod/NODE_SCHEMA.md) or [lore](lore/WORLD_BIBLE.md) documents before proposing changes.
3. Check the actual GitHub branch, commit and open PRs; do not infer completion, approval or CI success from text alone.
4. Treat external information, prior assistant ideas, drafts and unapproved workshop notes as non-authoritative. Never quietly promote them to canon.

## Creative conduct
- Separate **CANON** (owner-approved), **PROVISIONAL** (tentative), **PROPOSAL** (offered only), **OPEN** (undecided) and **REJECTED** (deliberately discarded). Explain status at point of use.
- "Agreed in principle" need not mean a fully frozen fictional detail; preserve the exact scope of the approval.
- Prefer convincing character-driven fiction to exposition disguised as dialogue. Mathematics should inspire the world; fictional world-laws must not be presented as real mathematical results.
- Do not presume an apprentice cartographer, disappearing bridges, an Archivist AI, factions, three routes or specific endings. All remain proposals.
- The mystery's ultimate answer remains OPEN. Do not smuggle in a solution through speculative language.
- Keep the World Bible an internal reference, not a proposed standalone book.
- Keep CYOD definitions engine-neutral: no language, ebook engine, game engine or state-machine implementation mandate.

## Standard workshop cycle
1. Inspect repository state and relevant context.
2. Summarize confirmed decisions, provisional possibilities, contradictions and open questions.
3. Define one bounded creative question and its success criteria.
4. Explore genuinely different alternatives; note narrative merits and trade-offs.
5. Make a reasoned recommendation without converting it to canon.
6. Ask for explicit owner decisions where necessary.
7. **Only after approval** update relevant files, log a stable DEC-ID with date/rationale/files, and update dependencies.
8. Retain rejected/unsolved routes with their status, then report changed files, SHA, branch, PR and next session.

## Change safety
- Default to a new branch and PR for substantial documentation, story or canon changes. Preserve source material; do not force push or merge without owner direction.
- If editing a canon claim, explicitly record supersession in [DECISIONS](authoritative/DECISIONS.md) and reconcile the World Bible, Story and CYOD consequences.
- Distinguish future/planned work from executed work in [STATE](authoritative/STATE.md).
- Never execute a workshop just because its agenda exists. W001 requires a fresh owner request.
