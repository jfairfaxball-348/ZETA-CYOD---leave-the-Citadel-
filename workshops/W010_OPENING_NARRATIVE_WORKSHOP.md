# ZETA — W010: Opening Narrative Workshop

**State: INSTALLED — NEXT CREATIVE SESSION (not yet executed).**
**Book:** Leave the Citadel · **Mode:** Author-led brainstorming, scene design and approved prose drafting.
**Last verified private manuscript baseline:** D1 revision 4, 10 passages, 7 scenes, 3 acts (29 October 2026). The current revision must be re-read at the next session and before every save.

## Mission

Work together on what actually happens at the beginning of Book One, especially immediately after the right-wrist choice. Shape a compelling, emotionally grounded opening rather than an outline full of lore. The author makes the creative decisions; the assistant explores possibilities, writes draft passages after discussion, revises them with the author, and **at session close commits only author-approved final prose through the already operational PRIVATE W009 GitHub bridge into Cloudflare D1**. Do not merely leave approved work in chat.

This is **not** an infrastructure or illustration session. Images are deferred by the author's explicit choice; the opening's current artwork placeholders are acceptable until a future design session. Do not build an image pipeline, page compositor, new Studio UI, or a larger node editor.

## Read the authoritative context first

- Public source of truth for established canon: authoritative/DECISIONS.md; cyod/OPENING_MECHANISM.md; story/BOOK_ONE.md; workshops/W001_CLOSEOUT.md, W002_CLOSEOUT.md and W003_CLOSEOUT.md.
- Read the private manuscript's CURRENT snapshot/index.json and the existing target passage files using the connected GitHub app for the **private** jfairfaxball-348/ZETA-private-authoring repository. The index is a point-in-time snapshot, not necessarily today's remote D1 revision.
- W009 live private authoring bridge has been verified: opening passage P-0001 was author-approved and saved with receipt status applied, from revision 3 to revision **4**. Do not rewrite P-0001 unless the author explicitly approves changing it.
- Relevant existing passage IDs: **P-0001 The instruction** (approved opening); **P-0002 The digit**; **P-0003 The interlocking form**; **P-0004 The binomial mark**; **P-0005 Beyond the Citadel**; **P-0006 The deferred gateway**. Further plot nodes may be needed later but do not create them without agreement.
- Keep all unpublished manuscript text and all private snapshots OUT of the public code/lore repository. Only high-level approved design decisions, progress and redacted operational metadata belong there.

## Creative questions to work through together

These are discussion prompts, NOT predetermined story facts or a questionnaire to deliver all at once.

1. **The immediate situation:** Where is the protagonist standing when the instruction arrives? What can they see, hear, or lose? How can the reader feel the Citadel's authority without receiving an exposition lecture?
2. **Why the mark matters:** Is it evidence used by an institution, a signal, or something the protagonist does not yet understand? Why does noticing it demand a response? Do not settle underlying cosmic laws prematurely.
3. **Three distinct grounds for exile:** Develop one convincing, apparently rigorous but ultimately **invalid** Citadel judgement for the digit, interlocking shape and binomial symbol. Each should carry different human stakes and a different flaw that the corresponding Act II route can later expose. Avoid claiming any legitimate mathematical theorem is false. Keep each early explanation intelligible to a non-specialist reader.
4. **How departure happens:** What enforces the order? What does the protagonist try to do? Does someone help, refuse, follow, or mislead them? Identify a compelling moment of loss, danger or suspicion.
5. **Shared opening of Act I:** All three choices converge after their individual explanation into the SAME departure and shared outward journey. Look for one immediately meaningful reader choice with consequences that do not invalidate the delayed Act II route.

Do not attempt to solve all of these at once. Pick the next high-value uncertainty, offer two or three differentiated possibilities, debate and revise. Avoid a long questionnaire and overbuilt mechanics.

## Fixed creative guardrails

- Open with the already-authored instruction to leave the Citadel, right-wrist observation and **three mark choices**. Current draft destinations 102 / 203 / 304 are provisional print pointers, not internal passage IDs.
- The three corresponding early passages each have **one** continuation to the shared draft page 2 (P-0005 in the current Studio graph). The initial choice is remembered and determines **Act II** destination, not a second Act I split.
- Central story: wrongful exile -> investigation and discovery in one of three regions -> return and vindication. Those responsible knowingly perpetuate the unjustified decision; do not make them simply innocent mistaken officials.
- The deeper question of free will and the nature of reality remains unsettled. No simulation proof, predetermined cosmology, or grand reveal in the opening.
- Second-person writing is the current manuscript mode; do not force a fixed name, gender or backstory without approval. Show place, character and strange constraints through lived experiences.
- Reader-facing prose must not explicitly use the words "maths" or "mathematics". Maths can be discussed openly in the workshop analysis.
- No combat-stat RPG, inventory, provisions, luck tests, obligatory dice rolls or monster fights. Meaningful choices, curiosity and consequences drive the reader.
- Topologia and the Combinatorium are established regions; the fantasy name of the number-theory territory is not yet formally chosen. Do not canonise "Arithen" implicitly.
- No new illustrations this session; treat choice-image labels as placeholders, not prose that has to be forced into the finished story.

## Working rhythm — for every passage or story beat

1. **Discuss:** brainstorm a small set of distinct scene/story possibilities with their dramatic implications; invite the author's choice or alternative.
2. **Shape:** establish the causal and emotional beat, what the protagonist learns, and how it fits existing canon and outgoing branches.
3. **Draft:** write a concise, readable prose version **in the conversation** for the appropriate existing passage. Clearly mark it as DRAFT; no repository write yet.
4. **Revise:** respond to the author's feedback, make changes and show the revised prose in full. Only mark **AUTHOR-APPROVED** once the user explicitly confirms that exact version.
5. **Accumulate:** maintain a small running list of target passage IDs and the **full approved replacement body** for eventual publication. Do not silently add to canon or treat unapproved brainstorming as approved prose.

Prefer writing a meaningful small opening slice well over drafting an entire Act mechanically. Work beyond P-0002/3/4 only if it helps the narrative and the author chooses it.

## End-of-session private manuscript publishing (MANDATORY when approved prose exists)

The user authorised a session-end D1 update of prose they individually approve. Execute this in the same session via the **connected private GitHub repository**, not by publishing prose to the public ZETA repo or promising future work.

- Check private repository visibility again. Read its current snapshot/index.json and chosen passage files. Existing W009 bridge supports **one existing passage BODY per request only**. Do not change titles, notes, status, links, scenes or graph nodes through a passage-only request.
- For each approved passage **sequentially**: obtain a fresh private index/revision, target passage's current body hash, and confirm the replacement corresponds exactly to the author-approved text. If another edit has intervened, stop and reconcile rather than overwrite. If snapshot is stale relative to Studio, use the private workflow's read-only sync first.
- Create a unique requests/<id>.json in private jfairfaxball-348/ZETA-private-authoring with version: 1, requestId, passageId, expectedRevision, expectedBodySha256, newBody (the precise approved full passage), and approved: true. The request commit triggers the private authoring-bridge GitHub Action using its GitHub-secret-held owner key.
- Verify the Actions run succeeded, read private results/<id>.json and require status **applied** (or unchanged for a no-op). Verify private snapshot revision changed as expected, target body equals the approved text, and unrelated passages/choice edges remain unchanged. Only then proceed to the next passage (global D1 revisions advance on every write).
- If status is rejected or needs_review, if there is a 409 revision mismatch, or if the workflow has not run, **do not claim saving succeeded and do not auto-retry blindly**. Check actual remote state and report the precise blocker. Never paste secrets into chat or a commit.
- Report which passage IDs were actually saved, confirmed D1 revision(s), and what remains draft. If no passage was explicitly approved, save nothing.
- The private manuscript history/snapshot contains unpublished prose; the public workshop closeout may record approved *decisions and metadata only*. Any new canon must be explicitly owner-approved and added through the usual decision register process.

## Opening move for W010

Begin as a writing partner, not a systems engineer. First acknowledge that P-0001 has been committed. Then investigate **the protagonist's immediate situation after observing the wrist**: what kind of encounter makes the three apparent judgements feel inescapable, emotionally credible and intriguing? Offer a few substantially different approaches and invite the author to choose or adapt one. Do not rush to settle all three accusations before that dramatic setting feels right.

**Completion criterion:** The workshop results in one or more genuinely author-approved passages and, where possible, a verified private-bridge D1 save at its close; or records honestly that the discussion has not reached approved prose. Creativity and author control outweigh passage count.
