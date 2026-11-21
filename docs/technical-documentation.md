# Technical Documentation

## 1. Project Architecture

The site keeps structure, style, and behaviour in separate files:

| File | Responsibility |
| --- | --- |
| `index.html` | Semantic structure (`header`, `nav`, `main`, `section`, `article`, `footer`) and two `<template>` elements for project and repository cards |
| `css/styles.css` | Theme variables, layout (Grid and Flexbox), components, animations, and responsive rules |
| `js/script.js` | All behaviour, split into small `init…()` functions that are started on `DOMContentLoaded` |

`script.js` sections:

1. Settings and data (project array, level messages, sorting rules)
2. Storage helpers
3. Theme toggle
4. Greeting and visitor name
5. Visit timer
6. Projects: filter, level, and sort
7. GitHub repositories (API)
8. Contact form validation
9. Start-up

## 2. API Integration

**Endpoint:** `GET https://api.github.com/users/llayank/repos?sort=updated&per_page=30`

**Flow:**

1. An `IntersectionObserver` waits until the GitHub section is within 300px of the screen, then calls `loadRepos()`. Visitors who never scroll there don't send any request.
2. `fetchRepos()` checks the `sessionStorage` cache first. Results younger than 10 minutes are reused.
3. If the browser is offline, it stops with an `offline` error.
4. `fetchWithTimeout()` uses an `AbortController` to cancel the request after 8 seconds.
5. The response is checked (`response.ok`). Forked repositories are removed, the list is limited to 6, and only the needed fields are kept.
6. The result is cached and rendered with the `repo-card-template`.

**Error handling:**

| Situation | Message shown |
| --- | --- |
| No internet | "You appear to be offline…" |
| Request takes over 8 seconds | "GitHub took too long to respond…" |
| HTTP 403 / 429 (rate limit) | "GitHub's request limit was reached…" |
| HTTP 404 | "The GitHub profile could not be found." |
| Anything else | "My GitHub projects couldn't be loaded right now." |
| Request succeeds but there are no repositories | "No public repositories yet." plus a profile link |

Every error message comes with a **Try again** button that calls `loadRepos()` again.
GitHub allows 60 requests per hour for visitors who aren't logged in. The cache keeps normal browsing well below that.

## 3. Complex Logic

### Project filtering and sorting
Projects are stored in a `projects` array (title, description, categories, tags, level, date).
`getVisibleProjects()` runs three steps in order:

1. **Technology filter:** keep projects whose `categories` include the selected filter (or all).
2. **Level filter:** keep projects whose `level` matches (or all).
3. **Sort:** apply the selected rule from `SORTERS` (newest, oldest, or name). Dates use ISO format (`YYYY-MM-DD`), so comparing them as text gives the correct order.

All choices are kept in one `state` object. Every change goes through `setState()`, which updates the state, saves it, and calls `render()` once.
`render()` rebuilds the cards and updates the buttons (`active` class and `aria-pressed`), the selects, the level message, the results count, and the empty-state message.

### Contact form
- `novalidate` turns off the browser's built-in popups, so JavaScript can show the same messages in every browser.
- `VALIDATORS` holds one rule function per field, and each returns an error message or `""`.
- A field is checked when the user leaves it (`blur`), then checked live (`input`) while they correct it.
- On submit, all fields are validated at once. If any field is invalid, focus moves to the first one and submission stops.
- If everything is valid, the button is disabled, a short send is simulated (there is no backend), a confirmation appears, and the form resets.

### Visit timer
The timer stores the start time and calculates `Date.now() - startTime` every second. It doesn't add 1 per tick,
because browsers slow down timers in background tabs and a tick counter would drift.

## 4. State Management

| Key | Storage | Purpose |
| --- | --- | --- |
| `theme` | localStorage | `light` / `dark`. If nothing is saved, the system preference is used. |
| `visitorName` | localStorage | Name shown in the greeting |
| `projectFilter`, `projectLevel`, `projectSort` | localStorage | Last project choices |
| `githubRepos` | sessionStorage | `{ savedAt, repos }` API cache |

- Every storage access goes through `readStorage` / `writeStorage` / `removeStorage`, which use `try/catch`. If storage is blocked (for example in some private modes), the site still works; it just won't remember choices.
- Restored project choices are checked against the options on the page, so an old or invalid saved value falls back to the default.
- A small inline script in `<head>` applies the theme before the page is drawn, so dark-mode visitors never see a white flash.

## 5. Performance

- `defer` on `script.js` downloads it while the HTML is parsed.
- `preconnect` to `api.github.com` starts the connection early.
- The API is called only when needed (IntersectionObserver), and responses are cached.
- Cards are built in a `DocumentFragment` and inserted in one DOM update.
- Event delegation: one listener on the filter group instead of one per button.
- Unused CSS (Interests and Languages sections from Assignment 2) was removed.
- `prefers-reduced-motion` turns off animations for visitors who request it.
- No images, fonts, or libraries to download.

## 6. Security and Accessibility

- All user and API text is inserted with `textContent`, never `innerHTML`, so it can't inject HTML.
- External links use `rel="noopener noreferrer"`.
- Form fields are linked to their error messages with `aria-describedby` and marked with `aria-invalid`.
- Status messages use `aria-live` / `role="status"` so screen readers announce them.
- A "Skip to content" link, visible focus outlines, and good colour contrast in both themes (dark mode uses dark text on the purple accent).

## 7. Responsive Design

- **CSS Grid** (`repeat(auto-fit, minmax(280px, 1fr))`) for the project and repository cards.
- **Flexbox** for the navigation, controls, tags, and forms.
- **Media query** at `640px`: the navigation moves to its own row, padding is reduced, and cards use one column.

## 8. Compatibility

Uses standard features supported by all current major browsers (Chrome, Edge, Firefox, Safari):
`fetch`, `AbortController`, `IntersectionObserver` (with a fallback that loads immediately), `<template>`, and CSS custom properties.