# EDSXEL NGANI — Full React Edition

This project uses the user's original full-feature EDSXEL NGANI HTML as the
functionality baseline and mounts it inside a React/Vite application.

The original EDS icon files are preserved exactly:
- `public/icon-192.png`
- `public/icon-512.png`

## React / React Bits design layer

React adds a non-destructive visual layer on top of the existing website:
- Aurora-style animated background
- Spotlight hover treatment
- Magnetic button interactions
- Shiny brand text
- Scroll-reveal transitions
- Click spark feedback

The effect choices follow the React Bits component categories and interaction
patterns, while remaining locally implemented so the project has no paid/pro
runtime dependency.

## Preserved features from the original full site

- Complete formula library and tutorials
- Search suggestions / autocomplete
- Formula comparison
- Practice mode
- Formula of the Day
- Copy variants
- Related formulas
- Use-case tags
- Beginner / Intermediate / Advanced progress
- Recently Viewed
- Recently Learned
- Favorites / bookmarks
- Personal formula notes
- Mini Excel playground
- Error Doctor
- Formula Builder
- Keyboard Shortcuts
- Cheat Sheet generator
- Shareable formula URLs
- Mobile bottom navigation
- English / Taglish mode
- Learning Paths
- Popular Formulas
- Random Formula / Teach Me Something
- Continue Learning
- About + privacy section
- Dark / light mode
- Back to Top
- PWA install support
- Offline service worker
- Original SEO / social metadata

The previously removed `Fix My File Request` feature remains removed.

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

For Vercel, import the GitHub repository and select Vite if it is not
auto-detected.

Framework: Vite
Build command: `npm run build`
Output directory: `dist`

## Important

The PWA/service worker requires HTTPS or localhost. It does not install when
opened directly as a `file://` page.
