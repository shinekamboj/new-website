# Pixel Pals Arcade — Project Documents

This folder is a shareable copy of the project requirements, test cases, and verification evidence.

## Contents

- `requirements.md` — confirmed product and technical requirements.
- `test-cases.md` — manual/automated test cases and latest outcomes.
- `evidence-index.md` — links to screenshots, Playwright report, and JSON results.
- `evidence/` — copied screenshots, Playwright HTML report, and test-result artifacts.

## Technology and verification

- Front end: React 19 with Vite.
- Game engine: Phaser 4 for Turbo Track's 2D racing gameplay.
- 3D engine: Three.js for Gem Runner 3D.
- Header includes a login-preview popup; footer includes About Us. Authentication is not connected.
- Catalog: 13 playable browser games (8 kids' games, 5 grown-ups' games).
- Tests: Playwright using Chromium.
- Latest recorded run: **20 tests passed, 0 failed**.
- To run the website from the project root: `npm.cmd run dev -- --port 4173` (PowerShell) and open `http://localhost:4173`.
- To rerun tests from the project root: `npm.cmd exec playwright test`.

These documents and evidence are a copy; the working source code and original evidence remain in the project root and its `evidence/` folder.
