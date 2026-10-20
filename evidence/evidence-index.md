# Playwright Evidence Index

Run date: 2026-10-20. Tests were executed directly with the Playwright CLI (`npx playwright test`), not through the custom verification runner.

The HTML report contains the same screenshots attached to each Playwright test. The PNG files below are also saved as standalone artifacts.

| Test case | Evidence |
|---|---|
| TC-01/02 — kids collection and educational variety | [Kids desktop](screenshots/01-kids-desktop.png) |
| TC-03 — general-audience grown-up collection | [Grown-up desktop](screenshots/02-grown-up-desktop.png) |
| TC-04 — search match | [Search result](screenshots/tc-04-search-match.png) |
| TC-05 — category filtering | [Math category filter](screenshots/tc-05-math-category.png) |
| TC-06 — empty search and reset | [Empty state](screenshots/tc-06-empty-search.png), [reset result](screenshots/tc-06-search-reset.png) |
| TC-07 — quiz answer feedback and score | [Wrong-answer feedback](screenshots/tc-07-math-wrong-answer.png), [final score](screenshots/03-math-game-result.png) |
| TC-08 — word game feedback and score | [Wrong-word feedback](screenshots/tc-08-word-wrong-answer.png), [final score](screenshots/08-word-game-result.png) |
| TC-09 — early tap and reaction-time result | [Early tap](screenshots/tc-09-neon-early-tap.png), [reaction result](screenshots/04-neon-drift-result.png) |
| TC-10 — footer navigation | [Footer and collection link](screenshots/tc-10-footer-navigation.png) |
| TC-11 — mobile layout | [375px mobile view](screenshots/05-kids-mobile.png) |
| TC-12 — tablet and desktop layouts | [768px tablet](screenshots/tc-12-layout-768px.png), [1280px desktop](screenshots/tc-12-layout-1280px.png) |
| TC-13 — keyboard access and game dialog | [Keyboard-opened dialog](screenshots/tc-13-keyboard-game-dialog.png) |
| TC-14 — all ten games open and are playable | [Kids games](screenshots/tc-14-kids-math-meteor.png), [Word Wild](screenshots/tc-14-kids-word-wild.png), [Dino Lab](screenshots/tc-14-kids-dino-lab.png), [Planet Pals](screenshots/tc-14-kids-planet-pals.png), [Code Camp](screenshots/tc-14-kids-code-camp.png), [Neon Drift](screenshots/tc-14-adult-neon-drift.png), [Mythic Realms](screenshots/tc-14-adult-mythic-realms.png), [Outpost Zero](screenshots/tc-14-adult-outpost-zero.png), [Shadow Circuit](screenshots/tc-14-adult-shadow-circuit.png), [Summit Bound](screenshots/tc-14-adult-summit-bound.png), [story choice](screenshots/tc-14-mythic-choice-result.png), [resource-puzzle failure](screenshots/tc-14-outpost-failed-plan.png), [resource-puzzle success](screenshots/tc-14-outpost-powered.png) |

## Run artifacts

- [Playwright HTML report (screenshots attached per test)](playwright-report/index.html)
- [Playwright JSON results](test-results/results.json)
- [Playwright CLI transcript](test-results/playwright-cli.log)
- [Production build transcript](test-results/build.log)
- [RDAP result](domain-check.md) · [sanitized RDAP evidence](domain-check.json)
- [Earlier browser preview](screenshots/00-browser-preview.png)

Result: **13 Playwright tests passed, 0 failed.**

## Firebase deployment

- Live URL: https://new-website-50b26.web.app
- Deployment record: [firebase-deploy.md](firebase-deploy.md)
- Live screenshot: [firebase-hosted-live.png](screenshots/firebase-hosted-live.png)
