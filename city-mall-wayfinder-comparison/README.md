# City Mall Wayfinder: Maintainability Comparison

Two self-contained, independent vanilla HTML/CSS/JavaScript prototypes inspired by the general **indoor directory and point-to-point wayfinding** capabilities linked from the IOI City Mall directory-map page.

**Important:** The original mall page embeds an external map application. These codebases are **original proof-of-concept implementations**, not copies of the private mapping service. Every location, coordinate, distance and floor geometry in the demo is fictitious or illustrative. Do not use these maps to navigate the real mall. No libraries or map API keys are required to run either version. The optional Google font can fall back to system fonts when offline.

## How to run

From the folder containing this README, run:

```bash
python -m http.server 8000
```

Then open http://localhost:8000/ in your browser and choose Codebase A or Codebase B. To run without the landing page, open http://localhost:8000/version-a/ or http://localhost:8000/version-b/.

Windows: If `python` is unavailable, try `py -m http.server 8000`. Press Ctrl+C to stop the server. ES modules require HTTP hosting in many browsers, so do not double-click `index.html` using `file://`.

## Functional scope (identical intended behavior)

1. **Interactive floor map:** original SVG, click/keyboard-select a shop, drag/pan, wheel zoom, +/− zoom, reset.
2. **Point-to-point search:** location suggestions, source/destination selection, swap, validation, clear route.
3. **Location browsing:** free-text search, category filters, floor/location information, browsing actions.
4. **Choose from and to:** dropdown selection, browse-card buttons, map popup buttons.
5. **Interface:** responsive desktop/mobile design with a sidebar, floor selector, help dialog, route summary and instructions.
6. **Navigation:** a shortest-path route along simulated corridors, plus a shared lift for floor changes; routes drawn per floor with approximate distance/time.

## Codebase approaches

- **Version A (`version-a/`)**: function-oriented ES modules. `main.js` manages app state, `interface.js` handles panels and searches, `map.js` handles map drawing and gestures, `routing.js` builds and searches the path network, `geometry.js` defines the floor plan, and `data.js` supplies the location catalogue.
- **Version B (`version-b/`)**: cooperating classes. `WayfinderApp` coordinates state/actions, `Sidebar` manages interactive panels, `FloorMap` owns SVG rendering and gestures, `RoutePlanner` owns the corridor network, `Building` supplies geometry and `catalog.js` holds the same locations.

Each version has its **own** HTML, CSS and JavaScript and can be deployed independently. HTML and CSS were intentionally kept identical to make UI comparison fair. No changes were introduced just to manufacture a maintainability winner. Natural implementation choices, repetition and limitations remain in both.

## Suggested manual parity checks

1. Default source should be **West Entrance** on Ground Floor in both.
2. In the destination field type `Cinema`, choose **Cinema Hall**, and click **Find route**. Both should show a route, the same approximate distance/time, and show floor buttons.
3. Select Level 2 to inspect the destination-side route segment.
4. Swap locations, then calculate again; results should reverse correctly.
5. Browse > choose **Food**, search `Coffee`; use **Set as destination** on a result.
6. Click a visible room and select **Start here** / **Go here** from its popup.
7. Try entering one location in both fields and pressing **Find route** to confirm validation.
8. Drag the map, scroll to zoom, use reset. Repeat on a narrow/mobile browser.

## Fair maintainability review

See `EVALUATION_WORKSHEET.md`. Do not assume that more files, more classes, or fewer lines automatically mean more maintainable code. Both versions may contain code smells or design limitations that deserve evaluation **after** independent review.

## Automated routing parity check

Requires Node.js, but the **apps themselves do not require Node or npm**. From the comparison folder:

```bash
node tests/route-parity.mjs
```

This compares every ordered pair of distinct locations, the computed distance, estimated time, floor sequence and full node path in A vs B. UI interactions require a separate manual browser check.
