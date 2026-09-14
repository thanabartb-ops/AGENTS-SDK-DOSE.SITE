# AGENTS SDK DOSE · Resource Pack v2

Static, dependency-free landing page optimized for clear desktop presentation while retaining a responsive mobile layout.

## Structure

- `index.html` — semantic page structure
- `assets/styles.css` — design tokens, responsive layouts and accessibility states
- `assets/app.js` — theme, font scaling, navigation and progressive enhancement
- `assets/icons/logo.svg` — scalable brand mark and favicon
- `manifest.webmanifest` — install metadata

## Preview

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Production wiring

This repository is the presentation layer only. Connect authentication, API calls and analytics through a reviewed backend integration; never place secrets in client-side files.
