# Three memories — Act II return gate (W011 design freeze)

**Status: CANON at gamebook-design scope; not a live paragraph, completed route graph or locked print layout.** Source: DEC-0025–0028, owner W011 workshop approval, 2026-10-30.

## One story, twelve clues, three memories

The story has three separate occasions on the shared journey in which the player may receive a knowledge token. Each occasion offers four paths, one taken per playthrough, and reconverges afterwards. The player ends with **one letter, one number and one colour**, exactly three of twelve authored tokens. An optional small **Things to remember** notes section may hold them; no combat attributes, equipment, provisions or compulsory inventory.

| Occasion | Four literal clues | Recovery rule | Guaranteed digit |
| --- | --- | --- | --- |
| 1 — letter (first fork outside Citadel) | D · K · R · Y | Alphabet positions A=1…Z=26; subtract 7 repeatedly until 0–6 remains (remainder on division by 7) | **4** |
| 2 — number (later shared-Act-I occasion) | 7 · 16 · 25 · 34 | Add the digits of the remembered number | **7** |
| 3 — colour (later shared-Act-I occasion) | GREEN · AMBER · BLACK · WHITE | Count the letters in the colour's English name | **5** |

Letter positions are 4/11/18/25 and each leaves remainder 4 on division by 7; the other tokens all satisfy their invariant. **4 × 4 × 4 = 64** possible three-choice journeys, and **all 64 produce 475**. No polynomial interpolation, hidden mandatory gathering of all 12 pieces or separate answer per branch.

**Working calculated destination: paragraph 475** (not physical page 475). The novel's actual numbered-paragraph allocation has not been built or validated. Keep stable internal passage IDs, reader-visible paragraph numbers and physical book pages distinct. Existing W001/W010 references to draft *pages* 102/203/304/2 are legacy placeholders to reconcile during print editing, not proof of laid-out physical pages.

## Reader experience and instructions (approved direction)

The full owner-liked instructional wording is archived **privately**, outside the public manuscript source, pending a future Act-II paragraph. This public description is a mechanics synopsis, not a novel passage.

Begin with a light three-memories/riddle introduction, then be unambiguously helpful:
1. Convert the remembered letter to its alphabet position (A=1, B=2, …). Take away whole groups of seven, keeping the leftover. If the starting position is smaller than seven, it is already the remainder. An explicit worked example should explain **11 − 7 = 4**. Optional A–Z position strip for accessibility.
2. Add the digits of the remembered number; example **2 + 5 = 7** for 25.
3. Count the letters of the remembered colour; example **GREEN has 5 letters**.
4. Place the digits in order, giving **475**, and say **“Turn to paragraph 475.”**

The complete answer **may be shown** in examples. The puzzle is a friendly discovery, never a gotcha or assessment of intelligence; no maths expertise presumed. The player should remember the tokens, but needs no RPG-style scoring or equipment.

## End-of-Act-II return: three routes (DEC-0027)

- **Ordinary successful route:** combine the three memories and navigate to paragraph 475. Expected most-used return into Act III.
- **Rare secret route:** one **same alternative cheat-code destination** can be discovered within a hidden route in **each** of the three Act-II regions, regardless of opening mark. The discovery tells readers to disregard the three memories; an appreciable **narrative advantage** on entry into Act III follows. Exact code, secrecy design and advantage OPEN.
- **Guaranteed fallback:** a reader who missed clues or cannot solve the puzzle can still progress into Act III via an explicitly available alternative with a **narrative disadvantage**, not a dead end or shaming. Exact cost and paragraph OPEN.
- All three entrances eventually reconverge on the main Act-III story, retaining meaningful consequences. Every valid destination must be authored and protected from accidental shortcut access.

**Important separation:** The opening wrist mark determines the Act-II region. The 3-of-12 memory puzzle determines a return navigation method; it is independent of opening-mark selection. The rare cheat code is likewise reachable in each region. The grand nature-of-reality mystery is unaffected.

## First of the three clue occasions — post-gate fork (DEC-0025)

```text
P-0005 — Beyond the Citadel (approved body; graph unlinked)
       /                             \
  Road encounter                Footprints by wall
      /     \                         /      \
     D       K                       R        Y     [one letter token]
      \     /                         \      /
 Road local reconvergence       Wall local reconvergence
               \                 /
                shared Act I continues
                       |
      Later four-choice number gate; reconverge
                       |
      Later four-choice colour gate; reconverge
                       |
           Act II by original wrist mark
                       |
           Act II return puzzle / cheat / fallback
                       |
                    Act III
```

The D/K allocation to road and R/Y to wall is a **working assignment for W012 prose**, not yet a passage graph or an irreversible mapping. The first two encounters (road traveller and wall stranger), the maths-rooted caution about Citadel records and the outsider seeking return are *approved creative direction*, **not approved final character motives or complete prose**. The particular old sample descriptions (road intervals/altered table, mirrored knocks/missing stone) are *not locked clue mechanics*; letter tokens supersede them.

## Engineering/publication to do later

- Add actual private Studio nodes and edges for the first four endings, two local convergences, one shared convergence; do not pretend P-0005's single existing link to P-0006 has changed.
- Add two later 4-way clue occasions and preserve their reconvergence.
- Assign numbered **paragraph** destinations; validate 64 histories, invariant, secret/fallback access, no spoilers/bypasses or broken transitions, and feasible manuscript paragraph count.
- Write the puzzle-gate body only once there is an approved existing private passage node and the owner approves the exact prose. Use the private authoring bridge and D1 read-back for changes.

See [Story graph](STORY_GRAPH.md), [State model](STATE_MODEL.md), [W011 closeout](../workshops/W011_CLOSEOUT.md) and [W012 prose workshop](../workshops/W012_FOUR_FIRST_CLUE_BRANCHES.md).
