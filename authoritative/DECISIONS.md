# ZETA — Decision register

Only explicit owner decisions are entered as approvals. Every substantive entry has a permanent `DEC-####` ID, UTC date, precise scope, rationale, affected files and supersession history. The status describes the **specific claim**, not every possible elaboration.

| ID | Date (UTC) | Status | Owner-authorized decision | Rationale / scope | Affected references | Superseded by |
| --- | --- | --- | --- | --- | --- | --- |
| DEC-0001 | 2026-10-29 | CANON | **ZETA** is the name for the wider fictional world/universe. | Explicit founding designation; says nothing definitive about cosmology or physics. | [World Bible](../lore/WORLD_BIBLE.md), [Book One](../story/BOOK_ONE.md) | — |
| DEC-0002 | 2026-10-29 | CANON | **The Citadel** is a part of ZETA, not the whole universe. | Explicit spatial/narrative distinction; exact nature, size and internal contents remain subject to development. | [Geography](../lore/GEOGRAPHY.md), [World Bible](../lore/WORLD_BIBLE.md) | — |
| DEC-0003 | 2026-10-29 | CANON | The first planned ZETA work uses reader choices and branching narrative (CYOD). | Approved format direction, not approval of particular nodes, mechanics, choices or routes. | [Book One](../story/BOOK_ONE.md), [Story graph](../cyod/STORY_GRAPH.md) | — |

**Scope note:** S000 describes several broader ideas as *agreed in principle*. These are **PROVISIONAL design foundations**, not fully settled fictional detail. They are documented in their stream registers, not misrepresented as frozen canon. This register also does not equate an infrastructure decision with an immutable fictional world-law.

## Adding or changing a decision
1. Capture the owner's explicit authorization and the exact assertion.
2. Assign the next unused sequential ID; never recycle IDs.
3. Record YYYY-MM-DD (UTC), one of the [five statuses](CANON_POLICY.md), rationale, affected file links and any superseded ID.
4. Update dependent files without changing the meaning or silently broadening approval.
5. For a replacement, retain the earlier row and append `Superseded by DEC-...`; document the new interpretation.
6. Keep rejected proposals identifiable; do not delete their historical record.

See [canon policy](CANON_POLICY.md), [open questions](OPEN_QUESTIONS.md) and [state](STATE.md).
