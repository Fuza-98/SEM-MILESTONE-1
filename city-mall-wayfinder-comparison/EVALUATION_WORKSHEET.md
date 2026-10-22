# Blind Maintainability Evaluation Worksheet

Assess **Version A** and **Version B** separately, without declaring a winner first. Use the same task, time budget, and criteria for each; record objective examples and exact file/line references.

## Criteria (score each from 1 to 5)

| Criterion | What to examine | A | B | Evidence |
| --- | --- | --- | --- | --- |
| Readability | Is control flow understandable for a typical new contributor? | | | |
| Modularity / cohesion | Do files and functions have clear responsibilities? | | | |
| Coupling | How many other pieces must change for one feature? | | | |
| Changeability | How easy is an ordinary requested feature/change? | | | |
| Testability | Can route calculation and UI behavior be tested without complicated setup? | | | |
| Duplication | Is logic or markup repeated unnecessarily? | | | |
| Error handling | Are invalid inputs and inconsistent states handled consistently? | | | |
| Documentation / naming | Are assumptions and data structures discoverable? | | | |
| UI / behavior preservation | Did a change retain functional parity and expected interactions? | | | |

## Controlled change tasks

Try the same tasks on fresh copies of both codebases; track edited files, elapsed time, mistakes, test failures and final diff size.

- **Task 1:** Add a new sample shop on Level 1 and ensure search, floor map and routing all work.
- **Task 2:** Add a new category (e.g. `Services`) to browsing without breaking the existing categories.
- **Task 3:** Change approximate walking speed used in the route summary from 75 m/min to 65 m/min.
- **Task 4:** Add an optional 'Accessible route only' control and clearly define whether a lift is required.
- **Task 5:** Make selecting a location by keyboard comparable to selecting it with a mouse.

## Inspection prompts

Consider normal code smells on both versions: long methods, rendering and data concerns mixed in one area, DOM access patterns, control-flow branching, template-string rendering, primitive identifiers, duplicated text, assumptions about navigation graphs and lack of automated tests. **Do not infer the verdict from these prompts:** verify with concrete code evidence.

## Context and limitations

This is a fair comparison of independently written small prototypes with identical UI and target features. It is not an attempt to recreate official mall data or proprietary assets. The map has one simulated central corridor per floor and lift connections; route distance and walking time are illustrative. There is no real positioning, network request, backend, or live sensor feed.
