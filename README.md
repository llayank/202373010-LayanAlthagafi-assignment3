# 202373010-LayanAlthagafi-assignment3

## Project Description

A responsive personal portfolio website that showcases my software engineering background and projects.
Assignment 3 builds on Assignments 1 and 2 by adding live data from an external API, more advanced
application logic, state that is remembered between visits, and performance improvements.

## Features

### API Integration – GitHub repositories
- Fetches my latest public repositories from the [GitHub REST API](https://docs.github.com/en/rest/repos/repos#list-repositories-for-a-user).
- Shows each repository's name, description, main language, stars, and last update.
- Shows a loading indicator while data loads.
- Shows a clear message and a **Try again** button if the request fails (offline, timeout, rate limit, or profile not found).
- Caches results for 10 minutes so page refreshes don't use up GitHub's hourly request limit.

### Complex Logic
- **Projects:** filter by technology, then by level (Beginner / Advanced), then sort (newest, oldest, or A–Z). The filters work together.
- **Level messages:** a different message appears depending on the chosen level.
- **Empty state:** if no project matches, a message and a **Reset filters** button appear.
- **Contact form:** checks every field (name length, email format, message length), shows an error under each invalid field, and allows submission only when everything is valid. It also includes a live character counter.
- **Visit timer:** shows how long the visitor has been on the site.

### State Management
| What is remembered | Where it is stored |
| --- | --- |
| Light / dark theme (defaults to the system setting) | `localStorage` |
| Visitor's name, used in the greeting | `localStorage` |
| Last selected filter, level, and sort | `localStorage` |
| GitHub API response (10-minute cache) | `sessionStorage` |

### Performance
- Script loaded with `defer`, plus a `preconnect` hint to the GitHub API.
- The GitHub request runs only when the section is about to scroll into view.
- Project cards are generated from one data array and one `<template>`, so no markup is repeated.
- Unused CSS from earlier assignments was removed.
- Animations respect the visitor's reduced-motion setting.
- No images or external libraries, so there is nothing heavy to download.

## Folder Structure

```
202373010-LayanAlthagafi-assignment3/
├── README.md
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── docs/
│   ├── ai-usage-report.md
│   └── technical-documentation.md
└── .gitignore
```

There is no `assets/` folder because the site does not use any images.

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/llayank/202373010-LayanAlthagafi-assignment3.git
   ```

2. Open the project folder.
3. Open `index.html` in a web browser.

No installation or libraries are needed. An internet connection is needed only for the GitHub section;
the rest of the site works offline.

### Deploying to GitHub Pages
1. Push the project to GitHub.
2. Go to **Settings → Pages**.
3. Under **Source**, choose the `main` branch and the `/ (root)` folder, then click **Save**.
4. After about a minute, the site will be live at `https://llayank.github.io/202373010-LayanAlthagafi-assignment3/`.

## Browser Support

Works in current versions of Chrome, Edge, Firefox, and Safari, on desktop and mobile.

## AI Usage Summary

I used Claude (Anthropic) as a development assistant throughout this assignment. I first used it to review the code quality of my Assignment 2 files, which helped me find formatting and indentation issues to fix. I then used it to help implement the Assignment 3 features, including the GitHub API integration with error handling, the combined project filtering and sorting, the visit timer, state management with localStorage, and the improved contact form validation.
AI also helped with debugging, cleaning up unused code, improving performance, and organizing the README and technical documentation.
I did not use the AI output without checking it. I reviewed the generated code to understand how it works, replaced placeholder content with my real project information, and tested every feature in the browser, including the API error messages in offline mode. All AI use is declared, and the complete conversation is included in my AI evidence file.
Full details are in [`docs/ai-usage-report.md`](docs/ai-usage-report.md).