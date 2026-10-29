# CYOD — Technology-neutral node schema (v0 proposal)

**PROPOSAL — infrastructure specification, not fictional canon.** A node is an addressable segment of narrative that may offer a choice, a continuation, convergence or an ending. No actual story node has been allocated.

## Proposed stable identifiers
- Nodes: `N-0001`, `N-0002`, ...; once assigned, never reuse a retired ID.
- Choices: `C-0001`, ...; stable even when displayed text changes.
- Endings: use ordinary node IDs marked `kind: ending`; no fictional endings assumed.
- Character/revelation IDs, if required later, must be governed in their stream documents.

## Candidate node fields
| Field | Proposed meaning |
| --- | --- |
| `id` / `status` | Stable ID and CANON/PROVISIONAL/PROPOSAL/OPEN/REJECTED |
| `working_title` / `kind` | Human-facing label; scene/choice/convergence/ending |
| `scene_ref` | Link to prose or outline (when created) |
| `incoming` / `choices` | Explicit incoming node IDs; choice IDs and destination IDs |
| `preconditions` | Narrative or state requirements to enter or select |
| `consequences` | Changes in knowledge, relationships, inventory or world state, if used |
| `revelations` / `continuity_notes` | Disclosure rules, consistency and knowledge boundaries |
| `source_decision` | DEC-ID approving a substantive story commitment |
| `revision_notes` | Dated change and compatibility impacts |

All fields beyond `id` and a traceable destination are **candidates**, not a mandatory final implementation. Avoid coupling narrative design to a particular language, game engine, ebook format or print mechanism.

## Planned validation checks
1. Unique IDs and resolvable destination references.
2. A designated start node *once one is approved* and reachability from it.
3. No accidental unreachable scenes; all intended endings reachable.
4. Choice preconditions and consequences remain coherent along every allowed route.
5. Convergence does not contradict prior player knowledge or character state.
6. Revelation paths respect the [revelation budget](../story/REVELATION_BUDGET.md).

Currently there is **no actual graph** to validate. See [Story Graph](STORY_GRAPH.md), [State Model](STATE_MODEL.md), [Book One](../story/BOOK_ONE.md), and [Canon Policy](../authoritative/CANON_POLICY.md).
