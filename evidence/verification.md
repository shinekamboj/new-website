# Latest verification evidence

- Date: 2026-10-26
- Playwright command: `npm.cmd exec playwright test` (direct CLI run)
- Playwright direct CLI run: latest run on 2026-10-26 — **20 passed, 0 failed, 0 skipped, 0 flaky**.
- Firebase Auth/Firestore client build passes; live data persistence needs a real test account to complete sign-up and finish a game.
- Build: `npm run build` — passed
- Browser: Chromium 156.0.8078.4
- Evidence screenshots: latest Playwright screenshots, including game-card popup, plus earlier manual browser preview in `evidence/screenshots/`
- Test-by-test screenshot map: [evidence-index.md](evidence-index.md)

## Full artifacts

- [HTML report with screenshots attached to the tests](playwright-report/index.html)
- [JSON test results](test-results/results.json)
- [Playwright CLI output](test-results/playwright-cli.log)
- [Build output](test-results/build.log)
- [Domain check and sanitized RDAP response](domain-check.md) · [JSON](domain-check.json)
- [Run history](verification-history.jsonl)

The domain lookup is point-in-time evidence, not a reservation or purchase. The Playwright tests were run directly through the CLI as requested; the custom verification runner was not used for this evidence run.
