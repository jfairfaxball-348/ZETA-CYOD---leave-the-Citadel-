# CYOD — Reader state and consequences

**OPEN:** It is undecided whether Book One needs persistent reader state at all. No inventory system, counters, statistics, rules engine or state variables are approved.

## Technology-neutral options for later comparison
| Option | Status | Benefit / trade-off |
| --- | --- | --- |
| Stateless choices | PROPOSAL | Simple for print; fewer persistent consequences |
| Knowledge and relationship flags | PROPOSAL | Memory of discoveries/relationships; more continuity checks |
| Rich persistent state | PROPOSAL | Supports complex variation; raises authoring and validation costs |
| Hybrid route markers | PROPOSAL | Selective memory; requires disciplined definition of flags |

If introduced, each state variable should specify stable name, allowed values, initial condition, changing choices, guard conditions, visibility to reader, and narrative justification. Consider whether choices can be physical, ethical, emotional or epistemic without becoming numerical scores.

Any implemented precondition/consequence must be checked across convergence points and against the [revelation budget](../story/REVELATION_BUDGET.md). Avoid locking into software until publication and experience goals are discussed.

Related: [Node Schema](NODE_SCHEMA.md), [Story Graph](STORY_GRAPH.md), [Book One](../story/BOOK_ONE.md), [Open Questions](../authoritative/OPEN_QUESTIONS.md).
