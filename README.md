# Buryat Traditional Clothes - Diploma Web Project

This repository contains the first production-ready foundation for a diploma project website focused on Buryat traditional clothing in Mongolia.

## Project Goals

1. Explain the cultural meaning of clothing elements.
2. Let buyers submit accurate measurements remotely.
3. Reduce in-person visits to tailors through clear, guided instructions.

## Current Scope (Implemented)

- Landing page with project value proposition.
- Cultural meaning page with categorized explanations.
- Measurement page with:
  - Step-by-step wizard
  - Visual tape-measure style instructions
  - Unit switch (cm / in)
  - Validation ranges and warnings
  - Progress bar
  - Auto-generated tailored-size suggestion (XS-XXL)
  - Printable summary

## Suggested Diploma-Grade Roadmap

### Phase 1: UX & content quality

- Professional photo set of each garment part.
- Native-language support (Buryat/Mongolian + English).
- Video snippets for difficult measurements.

### Phase 2: Tailor operations

- Customer account + saved profiles.
- Order form that binds selected garment + measurement profile.
- Tailor dashboard to review, request re-measurements, and approve.

### Phase 3: Accuracy & trust

- Measurement confidence score (based on consistency checks).
- Duplicate measurement pass (take each key measure twice).
- Device camera-assisted posture and tape placement checks.

### Phase 4: University defense extras

- Analytics: drop-off by step to prove UX improvements.
- A/B tested instruction variants.
- Report export (PDF) for both customer and tailor.

## Local Run

No build tools required.

1. Open `index.html` in a browser.
2. Navigate to the pages from the header.

## Structure

- `index.html` - landing and overview
- `meaning.html` - cultural explanation content
- `measurements.html` - guided measurement form
- `styles.css` - shared styling
- `script.js` - measurement logic and validation
