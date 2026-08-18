# EDSXEL NGANI — React Edition

A Vite + React redesign of EDSXEL NGANI with 456 Excel functions.

## Visual system
The UI uses locally implemented React animation components inspired by the interaction patterns shown in React Bits:
- Aurora-style ambient background
- Spotlight cards
- Shiny text
- Magnet buttons
- Scroll reveal

This keeps the project self-contained while following the React Bits visual direction.

## Run locally

```bash
npm install
npm run dev
```

## Build for Vercel

```bash
npm run build
```

Vercel can detect the Vite project automatically.

## Preserved functionality
- 456 formula library
- search + autocomplete
- categories and difficulty filters
- favorites
- learned progress
- formula tutorials
- related formulas
- personal notes
- shareable `?formula=XLOOKUP` URLs
- Formula of the Day
- Popular formulas
- random formula
- Continue Learning
- learning paths
- light/dark mode
- responsive layout

Browser state is stored in localStorage.
