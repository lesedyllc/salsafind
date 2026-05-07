# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

SalsaFind — a mobile-first PWA hosted on GitHub Pages. No build step. Vanilla HTML/CSS/JS only. Deploy = push to `main` (or `gh-pages`) and GitHub Pages serves it.

## File structure

| File | Role |
|------|------|
| `index.html` | App shell — all HTML structure |
| `app.css` | All styles (mobile-first, CSS custom properties) |
| `data.js` | Default Philadelphia event data + filter/sort helpers |
| `api.js` | Eventbrite API call + social media deep-link generators |
| `app.js` | State, rendering, event listeners, modal logic |
| `manifest.json` | PWA manifest |
| `sw.js` | Service worker (cache-first shell, network-first API/images) |

## Architecture

- **State** lives in the `state` object in `app.js`. City, date, filter, allEvents, apiKey.
- **Data flow**: `loadEvents()` → tries Eventbrite API (if key set) → falls back to `getDefaultEventsForCity()` in `data.js` → `filterEventsByDate()` → `sortByRelevance()` → `renderEvents()` → `buildEventCard()`.
- **Routing**: hash-based (`#Philadelphia-PA/2026-05-08`). `updateHash()` writes it, `handleHash()` reads it.
- **Modals**: `openModal(id)` / `closeModal(id)` toggle `hidden` attr + CSS `.visible` class for the slide-up animation.
- **Image slider**: CSS `translateX` on `.images-track`, touch swipe detected per-card in `setupCardSlider()`.

## Adding a new default city

In `data.js`, add an array of events and register it in `CITY_DEFAULT_DATA`:

```js
const MY_CITY_EVENTS = [ /* ... */ ];
CITY_DEFAULT_DATA['new york, ny'] = MY_CITY_EVENTS;
CITY_DEFAULT_DATA['new york'] = MY_CITY_EVENTS;
```

Each event must have: `id`, `title`, `type` (`social`|`class`|`event`), `isRecurring`, `recurringDays` (array of 0-6) or `specificDates` (array of `YYYY-MM-DD`), `displayTime`, `venue`, `address`, `phone`, `cost`, `description`, `images` (2-element array), `relevanceScore` (0-100).

## Live data (Eventbrite)

User adds their private token in the Settings modal. It's saved to `localStorage` as `salsafind_eb_key`. `searchEventbrite()` in `api.js` makes the fetch call and `normalizeEventbriteEvent()` maps it to the internal event shape.

## Deploy to GitHub Pages

```bash
git init
git remote add origin https://github.com/USERNAME/salsafind.git
git add .
git commit -m "Initial release"
git push -u origin main
# Enable GitHub Pages in repo Settings → Pages → Source: main branch / root
```
