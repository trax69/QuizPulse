# Pulse Quiz

A static, accessibility-focused quiz app (GitHub Pages ready) with JSON import, instant feedback, history tracking, and practice mode for failed questions.

## What is published in this repository

Due to the current `.gitignore` policy, only these items are tracked and pushed:

- `docs/` (the app itself)
- `README.md`
- `.gitignore`

Everything else is intentionally kept local.

## Features

- Import quiz models from `.json` files.
- Validate schema before starting the quiz.
- Full quiz mode and failed-questions practice mode.
- Optional timer per question.
- Study mode with reinforced feedback.
- Attempt history and local progress persistence.
- Export results as JSON, CSV, and printable PDF.
- Accessibility controls: theme, language, contrast, reduced motion, reading mode, font scaling, keyboard-friendly flow.

## Run locally

```bash
python -m http.server 8000 -d docs
```

Open: `http://127.0.0.1:8000`

## GitHub Pages

Deploy from branch `main`, folder `/docs`.

## Accessibility

- Report: `docs/wcag-aaa-report.md`
- Audited scope: `docs/index.html`

## Published structure

```text
docs/
  .nojekyll
  app.js
  exporters.js
  i18n.js
  index.html
  quiz-engine.js
  storage.js
  style.css
  ui.js
  vendor/
  wcag-aaa-report.md
README.md
.gitignore
```

## JSON schema

```json
[
  {
    "id": 1,
    "question": "Sample Question Text",
    "options": [
      { "text": "Option A", "correct": true, "explanation": "Why this is right" },
      { "text": "Option B", "correct": false, "explanation": "Why this is wrong" }
    ]
  }
]
```
