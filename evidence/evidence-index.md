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
| TC-08 — Word Wild 3D-style image and score | [3D-style illustration and wrong-word feedback](screenshots/tc-08-word-wrong-answer.png), [final score](screenshots/08-word-game-result.png) |
| TC-09 — early tap and reaction-time result | [Early tap](screenshots/tc-09-neon-early-tap.png), [reaction result](screenshots/04-neon-drift-result.png) |
| TC-10 — footer navigation | [Footer and collection link](screenshots/tc-10-footer-navigation.png) |
| TC-11 — mobile layout | [375px mobile view](screenshots/05-kids-mobile.png) |
| TC-12 — tablet and desktop layouts | [768px tablet](screenshots/tc-12-layout-768px.png), [1280px desktop](screenshots/tc-12-layout-1280px.png) |
| TC-13 — keyboard access and game dialog | [Keyboard-opened dialog](screenshots/tc-13-keyboard-game-dialog.png) |
| TC-14 — all thirteen games open | [Kids games](screenshots/tc-14-kids-math-meteor.png), [Word Wild](screenshots/tc-14-kids-word-wild.png), [Dino Lab](screenshots/tc-14-kids-dino-lab.png), [Planet Pals](screenshots/tc-14-kids-planet-pals.png), [Code Camp](screenshots/tc-14-kids-code-camp.png), [Star Catcher](screenshots/tc-14-kids-star-catcher.png), [Turbo Track](screenshots/tc-14-kids-turbo-track.png), [Gem Runner 3D](screenshots/tc-14-kids-gem-runner-3d.png), [grown-up games](screenshots/tc-14-adult-neon-drift.png) |
| TC-19 — Login and About Us | [Login popup](screenshots/tc-19-login-popup.png), [About Us footer](screenshots/tc-19-about-us-footer.png) |
| TC-20 — science-game visuals | [Dino Lab fossil](screenshots/tc-20-dino-visual.png), [Planet Pals Earth](screenshots/tc-20-planet-visual.png) |
| TC-21 — Code Camp visuals | [Number pattern](screenshots/tc-21-code-camp-pattern.png), [Robot steps](screenshots/tc-21-code-camp-robot.png), [Repeat loop](screenshots/tc-21-code-camp-loop.png) |

## Run artifacts

- [Playwright HTML report (screenshots attached per test)](playwright-report/index.html)
- [Playwright JSON results](test-results/results.json)
- [Playwright CLI transcript](test-results/playwright-cli.log)
- [Production build transcript](test-results/build.log)
- [RDAP result](domain-check.md) · [sanitized RDAP evidence](domain-check.json)
- [Earlier browser preview](screenshots/00-browser-preview.png)

| TC-18 — game card popup | [Game card popup](screenshots/tc-18-game-card-popup.png) |

Result: **20 Playwright tests passed, 0 failed.**

## Firebase deployment

- Live URL: https://new-website-50b26.web.app
- Deployment record: [firebase-deploy.md](firebase-deploy.md)
- Live screenshot: [firebase-hosted-live.png](screenshots/firebase-hosted-live.png)
