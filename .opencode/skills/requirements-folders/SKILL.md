---
name: Requirements to React Project
description: Turn user requirements into a responsive React website with checked branding, playable features, automated Playwright tests, CI, and continuously updated evidence.
---

# Requirements-to-React project automation

Use this skill when a user wants a website or app built from requirements and wants its project setup, tests, and evidence automated. Keep the path-derived skill ID `requirements-folders` stable.

## Workflow

1. Gather missing requirements from the user with focused questions about audience, content, actions, edge cases, design, and constraints. Honor user-provided safety/content limits. When the user explicitly asks you to choose, state reasonable assumptions and proceed instead of blocking on minor details.
2. Summarize the confirmed scope and resolve consequential ambiguity before implementation. Do not invent business requirements or silently broaden the product.
3. Inspect the project before editing. Use its existing stack and patterns where present; preserve user work and avoid destructive changes.
4. If the user asks for a brand/domain, check the exact candidate with the authoritative RDAP/registry source before adopting it. If it is registered, suggest and check alternatives. Record source, time, and result; clarify that a lookup is not a reservation or purchase. Never register or purchase a domain.
5. For a React website request, implement the actual responsive site—not only scaffolding or documentation. Add only folders/files needed for the requested product, and keep routes, content, interactions, accessibility, and mobile behavior consistent with requirements.
6. Write or update `requirements.md` with confirmed requirements, assumptions, acceptance criteria, folder tree, and test cases. Give each test case an ID, requirement link, preconditions, steps, expected result, and priority.
7. When browser automation is requested or useful for validating the website, add Playwright CLI/test dependencies and browser setup. Execute test cases through the Playwright CLI (`npx playwright test`) and preserve its HTML/JSON reports and per-test attachments; do not replace the test run with a bespoke test harness. A project verification command may orchestrate setup/build, but the actual test runner must remain Playwright CLI. Make browser installation automatic when needed.
8. Add or update a CI workflow for pushes and pull requests when the user asks to automate the project lifecycle. CI must install dependencies/browser, run domain check and build commands, invoke `npx playwright test` directly, and upload evidence even when tests fail. Do not push, deploy, or create external resources without explicit permission.
9. After implementation, actually run the build and browser tests when the environment permits. Maintain `evidence/verification.md`, test reports, relevant screenshots, and a history file; update a clearly marked automated-status block in `requirements.md`. Never claim a test passed unless it ran successfully. If a dependency/browser/network issue blocks a run, record the blocker and do not fabricate evidence.
10. Keep evidence free of secrets and personal data. Record current domain lookup limitations and test outcomes accurately.
11. If this skill file is added or changed, refresh its Browser Review preview and verify OpenCode discovers the path-derived ID `requirements-folders`.
12. Finish with a concise summary of the implementation, how to run verification, test results/evidence paths, and any external setup still needed (such as pushing to GitHub).

Do not claim a local workflow is running continuously: skill instructions execute only when invoked. Use a script for one-command local verification and CI for automatic runs on repository events.
