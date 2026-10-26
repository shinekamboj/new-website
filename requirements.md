# Pixel Pals Arcade — Requirements, Test Cases & Evidence

## Confirmed requirements

- Build a responsive gaming website using React.
- Include a colorful gaming-inspired design, a logo/brand, search, distinct game categories, and a useful footer.
- Keep kids' educational games and grown-up games in separate collections.
- Include at least five games in each collection. Grown-up games must be general-audience only; do not add inappropriate/explicit content.
- Visitors must be able to play the games, not only browse descriptions.
- Search and category filters are both required.
- The site should work well on phones, tablets, and desktop.
- The assistant may choose sensible additional details and footer content.
- Check domain availability and use the available domain's name for branding.
- Maintain test evidence alongside the implementation.
- Deploy the React site to Firebase Hosting using the new Firebase project.
- Include a Firebase email/password login popup in the header and About Us content in the footer.
- Allow account creation/sign-in through Firebase Authentication; save each user's profile and completed game results to their own Firestore path.

## Decisions and assumptions

- Current brand: **Pixel Pals Arcade**. `pixelplayground.com` and `pixel-playground.com` are registered. A Verisign RDAP lookup on 2026-10-20 returned no registration record for `pixelpalsarcade.com`, so that candidate appeared unregistered at lookup time. Availability can change and must be confirmed with a registrar before purchase; no domain was purchased or registered.
- Adult collection is labeled “For grown-ups” but contains only friendly, general-audience games, with no age gate or explicit material.
- Thirteen original browser games are included: eight activities for kids and five general-audience games for grown-ups. Math Meteor explains arithmetic with animated 3D-style counting boxes; Word Wild shows a dimensional illustration for every word; Turbo Track uses Phaser 4 and Gem Runner 3D uses Three.js. Games are self-contained, not externally hosted commercial games.
- Search matches game titles, categories, descriptions, and tags within the selected collection. Category chips also filter the current collection.
- Visual identity uses a gaming-themed background and responsive layouts. Footer includes About Us, collection links, and a general-audience play reminder.
- No account is required to play. Optional accounts use Firebase Auth; game-result data is stored only for the signed-in user. No analytics are used.

## Acceptance criteria

1. Header shows the Pixel Pals Arcade brand, usable game search, and controls for both collections.
2. Kids collection is the default and has at least five educational games from different categories.
3. Grown-up collection has at least five general-audience games, is directly accessible without an age gate, and contains no explicit content.
4. Each game has a playable interaction with feedback and/or a result; users can close a game and return to browsing.
5. Search and category filters both work and an empty search state offers a way to reset.
6. Footer has useful links and clear, appropriate play guidance.
7. The interface is legible and usable at 320px mobile width, tablet width, and desktop width without horizontal overflow.
8. Automated Playwright runs save test reports and relevant screenshots as evidence.
9. The production build is deployed to Firebase Hosting; GitHub Actions verification runs on pushes. Hosting auto-deploy becomes active after its service-account secret and enable variable are configured.
10. Clicking a game card or Play button opens the playable popup; category, collection, and game controls retain their normal behavior.
11. Header supports Firebase email/password sign-in and signup; Firebase owns passwords and the UI shows signed-in state.
12. Footer includes an About Us link and section.
13. Dino Lab and Planet Pals show a question-matched 3D-style illustration for each quiz question.
14. Code Camp uses simpler child-friendly questions and a relevant 3D-style image for each question.
15. Signup creates a Firebase Auth account and profile; finishing a game stores a result in the signed-in user's Firestore subcollection, protected by owner-only rules.

## Domain check

| Candidate | RDAP result (2026-10-20) |
|---|---|
| `pixelplayground.com` | Registered |
| `pixel-playground.com` | Registered |
| `pixelpalsarcade.com` | No registration record found; appears available at lookup time |

RDAP lookup is not a reservation or purchase. Verify with a domain registrar before relying on or buying the domain.
Lookup sources: [pixelplayground.com](https://rdap.verisign.com/com/v1/domain/pixelplayground.com), [pixel-playground.com](https://rdap.verisign.com/com/v1/domain/pixel-playground.com), and [pixelpalsarcade.com](https://rdap.verisign.com/com/v1/domain/pixelpalsarcade.com).

## Project structure

```text
gaming website/
├── .github/
│   └── workflows/
│       ├── firebase-hosting.yml
│       └── verify.yml
├── evidence/
│   ├── domain-check.json
│   ├── domain-check.md
│   ├── evidence-index.md
│   ├── firebase-deploy.md
│   ├── verification.md
│   ├── verification-history.jsonl
│   ├── screenshots/
│   ├── playwright-report/
│   └── test-results/
│       ├── build.log
│       ├── playwright-cli.log
│       └── results.json
├── index.html
├── .gitignore
├── .firebaserc
├── firebase.json
├── package-lock.json
├── package.json
├── playwright.config.js
├── README.md
├── requirements.md
├── scripts/
│   ├── check-domain.mjs
│   └── verify.mjs
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── styles.css
│   ├── components/
│   │   ├── CategoryTabs.jsx
│   │   ├── Footer.jsx
│   │   ├── GameCard.jsx
│   │   ├── GamePlayer.jsx
│   │   └── Header.jsx
│   └── data/
│       ├── challenges.js
│       └── games.js
└── tests/
    └── arcade.spec.js
```

## Test cases

| ID | Requirement | Preconditions | Steps | Expected result | Priority |
|---|---|---|---|---|---|
| TC-01 | Kids collection | Open the home page | Inspect the default collection | Kids collection is selected and at least five games are visible | High |
| TC-02 | Educational variety | Kids collection is open | Review game names and categories | At least five child-appropriate learning games span multiple categories | High |
| TC-03 | General-audience grown-up collection | Home page is open | Select “For grown-ups” | Collection opens directly, without an age gate, and shows at least five general-audience games | High |
| TC-04 | Search | A collection is open | Search for a game title, category, or tag | Only matching games from the active collection are shown and the result count updates | High |
| TC-05 | Category filter | A collection with multiple categories is open | Select a category, then “All games” | The selected category is filtered; selecting “All games” restores the full active collection | High |
| TC-06 | Empty search | A collection is open | Search for a term with no matches; select reset | Helpful empty state appears and reset restores the collection | Medium |
| TC-07 | Math Meteor visual quiz | Kids collection is open | Watch the animated block-counting visual, answer each operation, and finish | 3D-style boxes illustrate add/subtract/multiply; feedback and final score appear | High |
| TC-08 | Word Wild visuals and gameplay | Kids collection is open | View each round illustration, enter answers, and advance | Matching 3D-style art appears for each word; feedback and final score work | High |
| TC-09 | Grown-up game is playable | Grown-up collection is open | Start Neon Drift and react to the green signal | A reaction-time result is shown; premature tap is handled; user can retry | High |
| TC-10 | Footer links and guidance | Scroll to footer | Inspect links and choose a collection link | Footer guidance is visible and collection links switch to the requested collection | Medium |
| TC-11 | Mobile layout | Set viewport to 320–560px wide | Inspect header, search, cards, filters, game dialog, and footer | No horizontal overflow; content and controls remain usable | High |
| TC-12 | Tablet/desktop layout | Use tablet and desktop viewports | Inspect hero, game grid, and footer | Layout adapts and game cards remain readable | Medium |
| TC-13 | Keyboard and dialog controls | Open the site with keyboard navigation | Tab through controls; open a game and press Escape | Focus is visible, controls are reachable, dialog is named and Escape closes it | High |
| TC-14 | Every game is playable | Open each collection | Launch each of the thirteen cards | Every card opens its own working game activity | High |
| TC-18 | Game card popup | Open the kids' collection | Click a card, or focus it and press Enter | The selected game opens in its playable popup | High |
| TC-19 | Login and About Us | Open the home page | Open Firebase Login form and use footer About Us link | Login form appears; About Us section is reachable | Medium |
| TC-20 | Science-game visuals | Open Dino Lab and Planet Pals | Advance through each question | Matching dino/fossil and solar-system image appears with each question | Medium |
| TC-21 | Code Camp difficulty and visuals | Open Code Camp | View each image, answer the three questions | Beginner-friendly questions and matching 3D-style visuals appear; final score is shown | High |
| TC-22 | Firebase data persistence | Create a test account and finish a game | Inspect Firebase Authentication and Firestore | Auth user, `users/{uid}` profile, and `gameResults` record are present | High |
| TC-22 | Firebase data persistence | Use a test account and finish a game | Inspect Firebase Authentication and Firestore | User appears in Auth; `users/{uid}` profile and `gameResults` record are stored | High |

## Test evidence

Test evidence is stored under `evidence/`:

- `evidence/screenshots/` — screenshots of the kids and grown-up collections, gameplay, and mobile layout.
- `evidence/playwright-report/` — HTML report generated by Playwright.
- `evidence/test-results/` — Playwright attachments and per-test results.
- `evidence/evidence-index.md` — screenshot links mapped to every test case.
- `evidence/verification.md` and `evidence/verification-history.jsonl` — latest automated run and run history.
- `evidence/domain-check.md` — latest point-in-time RDAP lookup.
- `evidence/firebase-deploy.md` — successful Firebase Hosting deployment details and live URL.
- `evidence/test-results/playwright-cli.log` and `build.log` — CLI/build run transcripts.
- `npm run verify` — checks the domain, builds the site, runs Playwright, and refreshes the evidence automatically. Chromium is installed if needed.
- `.github/workflows/verify.yml` — repeats verification on pushes and pull requests and uploads the evidence artifact.
- `.github/workflows/firebase-hosting.yml` — builds/tests and deploys to Firebase Hosting on pushes to `main` when `FIREBASE_HOSTING_AUTODEPLOY=enabled` and secret `FIREBASE_SERVICE_ACCOUNT_NEW_WEBSITE_50B26` are configured.
- `firebase.json` and `.firebaserc` — Firebase Hosting configuration for project `new-website-50b26`.
- `firestore.rules` — owner-only access for each user's profile and game results. Rules deployed to the existing Firestore database on 2026-10-26.

Manual browser smoke check (2026-10-20): the home page rendered in the browser and the console was clear after a React runtime-import issue was fixed. Screenshot: `evidence/screenshots/00-browser-preview.png`.

Latest direct Playwright CLI run (2026-10-26): **20 passed, 0 failed** with `npm.cmd exec playwright test`; production build also passed. Screenshots are saved and attached to the tests, including animated math boxes, Word Wild art, science-game illustrations, Code Camp visuals, game-card popups, Login, and About Us. See `evidence/evidence-index.md` for the test-case-to-screenshot map and `evidence/verification.md` for logs and reports.

## Automated verification status

Run `npm run verify` to refresh this status, `evidence/verification.md`, the test history, domain lookup, and browser artifacts.

<!-- AUTO-VERIFICATION-START -->

Latest validation (2026-10-26): domain RDAP record at `evidence/domain-check.md`; production build **PASS**; direct Playwright CLI **PASS** — 20 passed, 0 failed.

Evidence: [verification summary](evidence/verification.md), [test-case evidence index](evidence/evidence-index.md), [CLI log](evidence/test-results/playwright-cli.log), [HTML report](evidence/playwright-report/index.html), and screenshots in [evidence/screenshots](evidence/screenshots/).

<!-- AUTO-VERIFICATION-END -->

GitHub Actions is configured but only runs after this folder is pushed to a GitHub repository. No push or deployment has been performed.
