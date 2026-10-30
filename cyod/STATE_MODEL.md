# CYOD — Reader state and consequences

**CANON (design) — DEC-0007/0008:** Book One has **one obligatory persistent discriminant**: the *opening right-wrist choice* determining the Act II region. W003 additionally rules out combat stats, equipment/provisions management and RPG-style resource/luck systems. No additional persistent narrative flags are yet approved.

## Minimal logical model (specification only; not code)
- Conceptual state key: `opening_mark` (field name PROPOSAL).
- Allowed values: `number`, `topological_form`, `binomial_symbol` (internal labels PROPOSAL).
- Set by first choice only; remembered through all of common Act I.
- Read at start of Act II; route to number-theory region, Topologia or the Combinatorium respectively.
- Act I content and route do **not** branch on this choice.
- Act III must preserve genuine route-conditioned consequences.
- The protagonist can potentially meet people, acquire things and make other decisions in Act I, but whether these need additional persistent variables is **OPEN**.

## W003 reader-state constraint
A reader must remember the opening mark, with possible lightweight markers for consequential decisions if later approved. This is *story state*, not combat, equipment or consumable resource bookkeeping. The risk of too many flags and accidental inaccessible endings should be minimised and reviewed in W004. Any approved numeric jump must be bounded and prevented from reaching protected narrative destinations.

## Publication design OPEN
How to retain the choice on paper (visible wrist mark, a modest reader note or other device); whether it is a tattoo, brand or other reality; what state is necessary for later discoveries, inventory and relationships; whether other conditions create different endings.

Never equate draft page numbers 102/203/304/2 with actual node IDs or final pagination. Keep the design engine neutral; validate convergence, branch reachability and revelation consistency once prose/graph exists.

Related: [Opening mechanism](OPENING_MECHANISM.md), [Story graph](STORY_GRAPH.md), [Book One](../story/BOOK_ONE.md).


## W011 approved additional knowledge-only memory (DEC-0025–0028)

Three additional non-RPG memory values, one **letter** from D/K/R/Y, one **number** from 7/16/25/34, and one **colour** from GREEN/AMBER/BLACK/WHITE, are acquired at three separate four-way narrative gates. They never depend on the **opening mark**, which still controls Act-II regional selection. In each group every possible token reduces to the same digit (4, 7, 5), so all 64 three-clue paths independently reveal paragraph **475** using the published easy instructions. Player note-taking is permitted, not an equipment or attribute system.

At Act-II end, **normal** puzzle route, **rare same-region-independent cheat-code route** with story advantage, and **visible fallback** with story disadvantage all advance to Act III. Any implementation should preserve whether a cheat/fallback route was used only insofar as needed for its consequent scene; no scores, physical inventory, penalties that halt the book, or memory of twelve unavailable clues. All actual implementation flags and reader-facing paragraph labels require later validation. See [return puzzle](THREE_MEMORY_RETURN_PUZZLE.md).
