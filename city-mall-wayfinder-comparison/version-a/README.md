# City Mall Wayfinder — Codebase A

This self-contained sample uses vanilla HTML, CSS, JavaScript and **functional ES modules**. It is an original fictitious mall floor plan, not official mall data.

## Run it

From this folder:

```bash
python -m http.server 8000
```

Open http://localhost:8000/. On Windows, `py -m http.server 8000` is an alternative.

## Where to look

- `index.html`: same markup as Codebase B
- `styles.css`: same stylesheet as Codebase B
- `js/main.js`: state and action orchestration
- `js/interface.js`: browsing, suggestions, inputs and route panel
- `js/map.js`: SVG map drawing and gestures
- `js/routing.js`: shortest-path network
- `js/geometry.js`: spatial assumptions
- `js/data.js`: 33 illustrative locations

The running UI does not require npm, Node, a framework, or a map API key. JS modules do generally require an HTTP server rather than `file://`.
