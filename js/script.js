/* Settings and data
   ========================================================================== */

const GITHUB_USERNAME = "llayank";
const REPO_LIMIT = 6;
const REPO_CACHE_KEY = "githubRepos";
const REPO_CACHE_MINUTES = 10;
const API_TIMEOUT_MS = 8000;

// Project data
const projects = [
  {
    title: "Campus Smart Parking Guide",
    description:
      "A web navigation tool designed to assist campus drivers with real-time zone availability, routing, and access control.",
    categories: ["html", "javascript"],
    tags: ["HTML/CSS", "JavaScript"],
    level: "advanced",
    date: "2026-03-01",
  },
  {
    title: "Skill Swap Platform",
    description:
      "A collaborative web application facilitating peer-to-peer knowledge exchange and session scheduling among students.",
    categories: ["full-stack"],
    tags: ["Full-Stack", "Web"],
    level: "advanced",
    date: "2026-05-01",
  },
  {
    title: "Personal Portfolio Website",
    description:
      "This responsive portfolio site, built across three assignments, includes theme switching, project filtering, and live GitHub data.",
    categories: ["html", "javascript"],
    tags: ["HTML/CSS", "JavaScript", "API"],
    level: "beginner",
    date: "2026-09-01",
  },
];

// Message for each level
const LEVEL_MESSAGES = {
  all: "",
  beginner: "Beginner projects: where I practised the fundamentals of HTML, CSS, and JavaScript.",
  advanced: "Advanced projects: larger builds with more logic, data, and moving parts.",
};

// Sorting rules
const SORTERS = {
  newest: (a, b) => b.date.localeCompare(a.date),
  oldest: (a, b) => a.date.localeCompare(b.date),
  name: (a, b) => a.title.localeCompare(b.title),
};

/* Storage helpers (safe if storage is blocked)
   ========================================================================== */

function readStorage(key, type = "localStorage") {
  try {
    return window[type].getItem(key);
  } catch (error) {
    return null;
  }
}

function writeStorage(key, value, type = "localStorage") {
  try {
    window[type].setItem(key, value);
  } catch (error) {
    // Storage unavailable
  }
}

function removeStorage(key, type = "localStorage") {
  try {
    window[type].removeItem(key);
  } catch (error) {
    // Storage unavailable
  }
}

function formatMonth(isoDate) {
  const date = new Date(`${isoDate.slice(0, 10)}T00:00:00`);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

/* Theme toggle
   ========================================================================== */

function initTheme() {
  const toggleBtn = document.getElementById("theme-toggle");
  const root = document.documentElement;

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    toggleBtn.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
    );
  }

  applyTheme(root.getAttribute("data-theme") || "light");

  toggleBtn.addEventListener("click", () => {
    const nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    writeStorage("theme", nextTheme);
  });
}

/* Greeting and visitor name
   ========================================================================== */

function getTimeGreeting(hour) {
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

function initGreeting() {
  const greetingEl = document.getElementById("greeting");
  const form = document.getElementById("visitor-form");
  const input = document.getElementById("visitor-name");
  const errorEl = document.getElementById("visitor-error");
  const savedBox = document.getElementById("visitor-saved");
  const resetBtn = document.getElementById("visitor-reset");

  // Show greeting and name form or saved name
  function render() {
    const name = readStorage("visitorName");
    const greeting = getTimeGreeting(new Date().getHours());

    greetingEl.textContent = name ? `${greeting}, ${name}!` : `${greeting}, Welcome!`;
    form.hidden = Boolean(name);
    savedBox.hidden = !name;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = input.value.trim();

    if (name.length < 2) {
      errorEl.textContent = "Please enter at least 2 characters.";
      input.focus();
      return;
    }

    errorEl.textContent = "";
    writeStorage("visitorName", name);
    input.value = "";
    render();
  });

  resetBtn.addEventListener("click", () => {
    removeStorage("visitorName");
    render();
    input.focus();
  });

  render();
}

/* Visit timer
   ========================================================================== */

function formatDuration(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
}

function initVisitTimer() {
  const timeEl = document.getElementById("visit-time");
  const startTime = Date.now();

  // Based on start time, so it stays accurate
  setInterval(() => {
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    timeEl.textContent = formatDuration(elapsedSeconds);
  }, 1000);
}

/* Projects: filter + level + sort
   ========================================================================== */

function initProjects() {
  const grid = document.getElementById("projects-grid");
  const template = document.getElementById("project-card-template");
  const filterGroup = document.getElementById("filter-buttons");
  const filterButtons = filterGroup.querySelectorAll(".filter-btn");
  const levelSelect = document.getElementById("level-select");
  const sortSelect = document.getElementById("sort-select");
  const levelMessage = document.getElementById("level-message");
  const resultsCount = document.getElementById("results-count");
  const emptyMessage = document.getElementById("empty-projects");
  const resetBtn = document.getElementById("reset-filters");

  const STORAGE_KEYS = { filter: "projectFilter", level: "projectLevel", sort: "projectSort" };
  const DEFAULTS = { filter: "all", level: "all", sort: "newest" };

  // Valid values for each control
  const allowed = {
    filter: Array.from(filterButtons, (btn) => btn.dataset.filter),
    level: Array.from(levelSelect.options, (option) => option.value),
    sort: Array.from(sortSelect.options, (option) => option.value),
  };

  // Restore saved choices
  const state = {};
  Object.keys(DEFAULTS).forEach((key) => {
    const saved = readStorage(STORAGE_KEYS[key]);
    state[key] = allowed[key].includes(saved) ? saved : DEFAULTS[key];
  });

  // Filter by technology, then level, then sort
  function getVisibleProjects() {
    return projects
      .filter((project) => state.filter === "all" || project.categories.includes(state.filter))
      .filter((project) => state.level === "all" || project.level === state.level)
      .sort(SORTERS[state.sort]);
  }

  function createProjectCard(project) {
    const card = template.content.firstElementChild.cloneNode(true);

    card.querySelector(".project-title").textContent = project.title;
    card.querySelector(".project-desc").textContent = project.description;

    const badge = card.querySelector(".level-badge");
    badge.textContent = project.level;
    badge.classList.add(`level-${project.level}`);

    const dateEl = card.querySelector(".project-date");
    dateEl.dateTime = project.date;
    dateEl.textContent = formatMonth(project.date);

    const tagsEl = card.querySelector(".tags");
    project.tags.forEach((tag) => {
      const span = document.createElement("span");
      span.className = "tag";
      span.textContent = tag;
      tagsEl.appendChild(span);
    });

    return card;
  }

  function render() {
    const visible = getVisibleProjects();

    // Insert all cards in one DOM update
    const fragment = document.createDocumentFragment();
    visible.forEach((project) => fragment.appendChild(createProjectCard(project)));
    grid.textContent = "";
    grid.appendChild(fragment);

    // Sync controls with state
    filterButtons.forEach((btn) => {
      const isActive = btn.dataset.filter === state.filter;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });
    levelSelect.value = state.level;
    sortSelect.value = state.sort;

    // Level message
    levelMessage.textContent = LEVEL_MESSAGES[state.level];
    levelMessage.hidden = !LEVEL_MESSAGES[state.level];

    resultsCount.textContent = `Showing ${visible.length} of ${projects.length} projects`;
    emptyMessage.hidden = visible.length > 0;
  }

  // Update, save, and re-render
  function setState(changes) {
    Object.entries(changes).forEach(([key, value]) => {
      state[key] = value;
      writeStorage(STORAGE_KEYS[key], value);
    });
    render();
  }

  // One listener for all filter buttons
  filterGroup.addEventListener("click", (event) => {
    const button = event.target.closest(".filter-btn");
    if (button) setState({ filter: button.dataset.filter });
  });

  levelSelect.addEventListener("change", () => setState({ level: levelSelect.value }));
  sortSelect.addEventListener("change", () => setState({ sort: sortSelect.value }));
  resetBtn.addEventListener("click", () => setState({ ...DEFAULTS }));

  render();
}

/* GitHub repositories (external API)
   ========================================================================== */

const REPO_ERRORS = {
  offline: "You appear to be offline. Connect to the internet and try again.",
  timeout: "GitHub took too long to respond. Please try again.",
  "rate-limit": "GitHub's request limit was reached. Please try again in a few minutes.",
  "not-found": "The GitHub profile could not be found.",
  default: "My GitHub projects couldn't be loaded right now.",
};

function readRepoCache() {
  try {
    const cached = JSON.parse(readStorage(REPO_CACHE_KEY, "sessionStorage"));
    const isFresh = cached && Date.now() - cached.savedAt < REPO_CACHE_MINUTES * 60 * 1000;
    return isFresh ? cached.repos : null;
  } catch (error) {
    return null; // Invalid cache
  }
}

function writeRepoCache(repos) {
  writeStorage(REPO_CACHE_KEY, JSON.stringify({ savedAt: Date.now(), repos }), "sessionStorage");
}

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchRepos() {
  const cached = readRepoCache();
  if (cached) return cached;

  if (!navigator.onLine) throw new Error("offline");

  const url = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30`;
  let response;

  try {
    response = await fetchWithTimeout(url, API_TIMEOUT_MS);
  } catch (error) {
    throw new Error(error.name === "AbortError" ? "timeout" : "default");
  }

  if (!response.ok) {
    if (response.status === 403 || response.status === 429) throw new Error("rate-limit");
    if (response.status === 404) throw new Error("not-found");
    throw new Error("default");
  }

  const data = await response.json();

  // Skip forks and keep needed fields
  const repos = data
    .filter((repo) => !repo.fork)
    .slice(0, REPO_LIMIT)
    .map((repo) => ({
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      language: repo.language,
      stars: repo.stargazers_count,
      updated: repo.updated_at,
    }));

  writeRepoCache(repos);
  return repos;
}

function initGitHubSection() {
  const section = document.getElementById("github");
  const statusEl = document.getElementById("repo-status");
  const listEl = document.getElementById("repo-list");
  const template = document.getElementById("repo-card-template");
  const profileUrl = `https://github.com/${GITHUB_USERNAME}`;

  function createRepoCard(repo) {
    const card = template.content.firstElementChild.cloneNode(true);
    const link = card.querySelector(".repo-name");
    link.href = repo.url;
    link.textContent = repo.name;

    card.querySelector(".repo-desc").textContent = repo.description || "No description provided.";

    const langEl = card.querySelector(".repo-lang");
    if (repo.language) {
      langEl.textContent = repo.language;
    } else {
      langEl.remove();
    }

    card.querySelector(".repo-stars").textContent = `★ ${repo.stars}`;
    card.querySelector(".repo-updated").textContent = `Updated ${formatMonth(repo.updated)}`;
    return card;
  }

  // Status message with optional button or link
  function showStatus(message, type, action) {
    statusEl.textContent = "";
    statusEl.className = `repo-status ${type}`;

    if (message) {
      const text = document.createElement("p");
      text.textContent = message;
      statusEl.appendChild(text);
    }

    if (action) statusEl.appendChild(action);
  }

  function createProfileLink() {
    const link = document.createElement("a");
    link.href = profileUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className = "link-btn";
    link.textContent = "Visit my GitHub profile →";
    return link;
  }

  async function loadRepos() {
    listEl.textContent = "";
    listEl.setAttribute("aria-busy", "true");
    showStatus("Loading repositories…", "loading");

    try {
      const repos = await fetchRepos();

      if (repos.length === 0) {
        showStatus("No public repositories yet.", "info", createProfileLink());
        return;
      }

      const fragment = document.createDocumentFragment();
      repos.forEach((repo) => fragment.appendChild(createRepoCard(repo)));
      listEl.appendChild(fragment);
      showStatus("", "done", createProfileLink());
    } catch (error) {
      const retryBtn = document.createElement("button");
      retryBtn.type = "button";
      retryBtn.className = "btn";
      retryBtn.textContent = "Try again";
      retryBtn.addEventListener("click", loadRepos);

      showStatus(REPO_ERRORS[error.message] || REPO_ERRORS.default, "error", retryBtn);
    } finally {
      listEl.removeAttribute("aria-busy");
    }
  }

  // Load only when the section is near the screen
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          loadRepos();
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(section);
  } else {
    loadRepos();
  }
}

/* Contact form validation
   ========================================================================== */

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 500;

// Validation rules
const VALIDATORS = {
  name(value) {
    if (!value) return "Please enter your name.";
    if (value.length < 2) return "Name must be at least 2 characters.";
    return "";
  },
  email(value) {
    if (!value) return "Please enter your email.";
    if (!EMAIL_PATTERN.test(value)) return "Please enter a valid email, for example: name@example.com";
    return "";
  },
  message(value) {
    if (!value) return "Please write a message.";
    if (value.length < MESSAGE_MIN) {
      return `Message must be at least ${MESSAGE_MIN} characters (${value.length}/${MESSAGE_MIN}).`;
    }
    return "";
  },
};

function initContactForm() {
  const form = document.getElementById("contact-form");
  const fields = ["name", "email", "message"].map((id) => document.getElementById(id));
  const submitBtn = document.getElementById("submit-btn");
  const statusEl = document.getElementById("form-status");
  const charCount = document.getElementById("char-count");
  const touched = new Set();
  let clearStatusTimer;

  function validateField(field) {
    const error = VALIDATORS[field.id](field.value.trim());
    document.getElementById(`${field.id}-error`).textContent = error;
    field.classList.toggle("invalid", Boolean(error));
    field.setAttribute("aria-invalid", String(Boolean(error)));
    return !error;
  }

  function updateCharCount() {
    const length = fields[2].value.length;
    charCount.textContent = `${length} / ${MESSAGE_MAX}`;
    charCount.classList.toggle("near-limit", length >= MESSAGE_MAX * 0.9);
  }

  function showStatus(message, type) {
    clearTimeout(clearStatusTimer);
    statusEl.textContent = message;
    statusEl.className = `status-msg ${type}`;
  }

  // Validate on blur, then on input
  fields.forEach((field) => {
    field.addEventListener("blur", () => {
      touched.add(field.id);
      validateField(field);
    });
    field.addEventListener("input", () => {
      if (touched.has(field.id)) validateField(field);
    });
  });

  fields[2].addEventListener("input", updateCharCount);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Validate all fields
    const results = fields.map(validateField);
    fields.forEach((field) => touched.add(field.id));
    const firstInvalid = fields.find((field, index) => !results[index]);

    if (firstInvalid) {
      showStatus("Please fix the highlighted fields.", "error");
      firstInvalid.focus();
      return;
    }
    // Simulate sending 
    const name = fields[0].value.trim();
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    setTimeout(() => {
      showStatus(`Thank you, ${name}! Your message has been received.`, "success");

      form.reset();
      touched.clear();
      fields.forEach((field) => {
        field.classList.remove("invalid");
        field.removeAttribute("aria-invalid");
      });
      updateCharCount();

      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";

      clearStatusTimer = setTimeout(() => showStatus("", ""), 5000);
    }, 800);
  });
}

/* Start-up
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initGreeting();
  initVisitTimer();
  initProjects();
  initGitHubSection();
  initContactForm();
});