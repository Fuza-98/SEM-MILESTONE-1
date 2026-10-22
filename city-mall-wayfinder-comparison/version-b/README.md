# City Mall Wayfinder — Codebase B

This self-contained sample uses vanilla HTML, CSS, JavaScript and **classes cooperating as small components**. It is an original fictitious mall floor plan, not official mall data.

## Run it

From this folder:

```bash
python -m http.server 8000
```

Open http://localhost:8000/. On Windows, `py -m http.server 8000` is an alternative.

## Where to look

- `index.html`: same markup as Codebase A
- `styles.css`: same stylesheet as Codebase A
- `js/main.js`: WayfinderApp state and action coordination
- `js/sidebar.js`: Sidebar UI panel class
- `js/floorMap.js`: FloorMap rendering and gestures class
- `js/navigation.js`: RoutePlanner shortest-path class
- `js/building.js`: Building geometry class
- `js/catalog.js`: 33 illustrative locations

The running UI does not require npm, Node, a framework, or a map API key. JS modules do generally require an HTTP server rather than `file://`.
