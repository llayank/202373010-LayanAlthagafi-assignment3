# AI Usage Report

## 1. Tools Used & Use Cases

- **Tool:** Claude (Anthropic – Claude Opus 5.5)
- **Use Cases:**
  - **Development Assistance:** Getting help while implementing the Assignment 3 features.
  - **Code Review:** Reviewing my code for quality issues such as formatting and indentation.
  - **Debugging:** Identifying and fixing errors in my code.
  - **Code Cleanup:** Removing unused code and organizing the code to make it cleaner and easier to read.
  - **Documentation:** Helping write and organize the README, technical documentation, and this report.

## 2. Benefits & Challenges

**Benefits**
- **Faster code review:** AI quickly pointed out formatting problems in my previous code that I hadn't noticed, which matters because code quality is part of the grade.
- **Better error handling:** I saw how to handle different API failures (offline, timeout, rate limit, not found) separately instead of showing one generic error.
- **Clear structure:** The JavaScript was organized into small functions with section comments, which made it easier to read and to find each feature.
- **Documentation support:** AI helped me write clearer, more complete documentation.

**Challenges**
- **Generic suggestions:** Some initial suggestions were generic, so I customized the content and design to match my own portfolio.
- **Understanding the code:** I had to review the JavaScript code to understand how the buttons filter the projects.
- **Testing:** I manually tested the website to make sure the filter buttons, theme switcher, form validation, and animations worked correctly.
- **Avoiding unnecessary features:** Some suggested features were more advanced than required, so I kept the project focused on the assignment requirements.

## 3. Learning Outcomes

Through this assignment, I learned how to:

- Fetch data from an external API using `fetch` with `async/await`.
- Check `response.ok` and status codes, and show a different user-friendly message for each type of error.
- Cancel slow requests with `AbortController` to create a timeout.
- Cache API data in `sessionStorage` to avoid repeated requests.
- Combine several filters and sorting with `filter()` and `sort()`.
- Keep the page's state in one object and update the display from it.
- Save and restore user preferences with `localStorage`.
- Validate each form field separately and show errors next to the field.
- Improve performance with `defer`, lazy loading, and removing unused code.

## 4. Responsible Use & Modifications

AI was used as a development assistant, not as a replacement for my own work. I did not copy the output without checking it:

- I reviewed every file and studied the parts I didn't understand until I could explain them.
- I replaced the placeholder project dates and levels with my real project information.
- I tested the features in my own browser, including the API error messages using offline mode in DevTools.
- I compared the documentation against the assignment requirements and corrected the usage log format.
- I declared all AI use in this report and included the complete conversation in my evidence file.

## 5. AI Usage Log

| ID | Tool (model) | Date | Purpose | Files affected | What you changed and how you verified it |
|---|---|---|---|---|---|
| C01 | Claude Opus 5.5 | 2026-11-21 | Review GitHub API request and error handling | `js/script.js` | Replaced a basic `fetch` request with `fetchWithTimeout` and added separate handling for rate-limit errors (403/429), not-found errors (404), and other errors. Reviewed the response handling in the code snippets. |
| C02 | Claude Opus 5.5 | 2026-11-21 | Improve project filtering and sorting | `js/script.js` | Expanded the category-only filter to support both category and level filters, including the `"all"` option, and retained sorting through `SORTERS`. Reviewed the logic against the expected filter cases. |
| C03 | Claude Opus 5.5 | 2026-11-21 | Review form validation | `js/script.js` | Added a name validator with required-field and minimum-length checks and clearer error messages. Reviewed the validation behavior in the code. |
| A01 | Claude Opus 5.5 | 2026-11-21 | Correct dark/light theme toggle behavior | `js/script.js` | Changed a fixed `"dark"` theme assignment into a toggle that reads the current theme, applies the next theme, and saves it with `writeStorage`. Reviewed the code flow. |
| A02 | Claude Opus 5.5 | 2026-11-21 | Review performance and accessibility documentation | `docs/technical-documentation.md` | Clarified the descriptions of `defer`, `preconnect`, lazy API loading, `sessionStorage` caching, and `prefers-reduced-motion`. Reviewed the wording for accuracy. |

## 6. AI Usage Declaration

Student Name: Layan Althagafi
Student ID: 202373010
Date: 21 NOV 2026

I declare that this report and the attached evidence document all of my AI use in this assignment, with complete and unedited conversations, and that I understand and can explain all the code I submitted. I understand that undeclared AI use or a false declaration will be treated as plagiarism according to KFUPM regulations.