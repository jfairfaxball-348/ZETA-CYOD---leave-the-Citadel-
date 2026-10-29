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
