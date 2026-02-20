# Pulse Quiz

A static quiz app (GitHub Pages ready) with JSON import, instant feedback, attempt history, failed-question practice mode, and WCAG-focused accessibility improvements.

## Current status

- Frontend-only project (no Flask/backend).
- Production entrypoint: `docs/index.html`.
- Refactored for maintainability: `docs/index.html` + `docs/style.css` + `docs/app.js`.
- Modular architecture in `docs/`: `app.js` (orchestrator), `i18n.js`, `quiz-engine.js`, `storage.js`, `exporters.js`, `ui.js`.
- Accessibility pass applied with WCAG 2.1 checklist and remediation report.
- GitHub Pages workflow configured in `.github/workflows/pages.yml`.

## Features

- Import quiz models from `.json` file.
- Validate schema before starting.
- Full quiz mode and failed-questions practice mode.
- Category-aware question bank with filter.
- Optional timer per question.
- Study mode (reinforced feedback with correct answer context).
- Attempt history, best score, and most-failed questions.
- Local persistence of history/metrics by quiz signature.
- Export results as JSON, CSV, and printable PDF.
- Downloadable JSON template.
- Accessibility controls:
  - Theme toggle.
  - Language toggle (English / Español).
  - Centralized UI strings in `docs/i18n.js`.
  - JSDoc annotations in modules for safer editor/type feedback.
  - Font scaling.
  - Reduced motion toggle.
  - High contrast toggle.
  - Reading mode toggle.
  - Skip link, focus visibility, and keyboard-friendly flow.
  - Accessible dialog-based confirmations (no browser `alert/confirm`).

## Run locally (static)

```bash
python -m http.server 8000 -d docs
```

Open `http://127.0.0.1:8000`.

## Quality tooling

- ESLint config: `eslint.config.js`
- Prettier config: `.prettierrc.json`
- EditorConfig: `.editorconfig`

Commands:

```bash
npm install
npm run lint
npm test
npm run coverage
npm run format
```

Coverage is generated at `coverage/lcov.info` and is consumed by SonarQube.

## SonarQube analysis

This repository includes:

- Scanner script: `sonar.bat`
- Project config: `sonar-project.properties`

### Run analysis locally

1. Ensure SonarQube is available at `http://localhost:9000`.
2. Generate coverage first:

```bash
npm run coverage
```

3. Run scanner:

```bash
sonar.bat
```

4. Open dashboard:

`http://localhost:9000/dashboard?id=Quiz`

> Note: `sonar.bat` currently uses `sonar.login`. SonarQube recommends `sonar.token`.

## GitHub Pages deployment

This project deploys the static `docs/` folder.

### Option A: Automatic deploy (recommended)

1. Push this repository to GitHub.
2. Ensure the default branch is `main`.
3. The workflow in `.github/workflows/pages.yml` deploys `docs/` automatically.
4. In repository settings, under **Pages**, select **GitHub Actions** as source.

### Option B: Manual Pages source

1. In repository settings, open **Pages**.
2. Choose source: **Deploy from a branch**.
3. Select branch `main` and folder `/docs`.

## Accessibility

- Audit report: `docs/wcag-aaa-report.md`
- Scope audited: `docs/index.html`
- Includes criterion-by-criterion checklist and remediation notes.

## Project structure

```text
docs/
  index.html
  app.js
  i18n.js
  quiz-engine.js
  storage.js
  exporters.js
  ui.js
  style.css
  .nojekyll
  wcag-aaa-report.md
tests/
  app.integration.test.js
  eslint-config.test.js
  exporters.test.js
  i18n.test.js
  quiz-engine.test.js
  setup.js
  storage.test.js
  ui.test.js
.github/
  workflows/
    pages.yml
vitest.config.js
sonar-project.properties
sonar.bat
README.md
```

## JSON schema

```json
[
  {
    "id": 1,
    "question": "Sample Question Text",
    "options": [
      {"text": "Option A", "correct": true, "explanation": "Why this is right"},
      {"text": "Option B", "correct": false, "explanation": "Why this is wrong"}
    ]
  }
]
```
