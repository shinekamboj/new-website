# Test Cases — Pixel Pals Arcade

Automated using Playwright + Chromium. The latest run completed with **20 passed, 0 failed**. TC-01/02 and TC-14 are combined/covered by shared automated tests, so the number of test cases is greater than the number of Playwright test functions.

| ID | Test case | Expected result | Latest result |
|---|---|---|---|
| TC-01 | Open the home page | Kids collection is selected by default and games are shown | PASS |
| TC-02 | Review kids' game variety | At least five kid-friendly games span multiple categories | PASS |
| TC-03 | Open grown-ups collection | Five general-audience games appear without an age gate | PASS |
| TC-04 | Search for a game/category/tag | Matching games appear and result count updates | PASS |
| TC-05 | Apply a category filter and reset | Selected category is filtered; “All games” restores the collection | PASS |
| TC-06 | Search for a nonexistent game and reset | Helpful empty state appears; reset restores games | PASS |
| TC-07 | Play Math Meteor | Animated 3D-style boxes illustrate each math operation; answers receive feedback and a final score | PASS |
| TC-08 | Play Word Wild | Each word shows its matching 3D-style illustration; typed answers, feedback, and final score work | PASS |
| TC-09 | Play Neon Drift | Early tap is handled; reaction time is shown after the signal | PASS |
| TC-10 | Use footer navigation | Footer guidance appears and collection links switch collections | PASS |
| TC-11 | View at phone width | Mobile layout has no horizontal overflow | PASS |
| TC-12 | View at tablet/desktop widths | Responsive layouts fit their viewports | PASS |
| TC-13 | Use keyboard/dialog controls | Focus is visible and Escape closes the game dialog | PASS |
| TC-14 | Launch each of the 13 catalog games | Each card opens its own playable activity | PASS |
| TC-15 | Start Star Catcher and use controls | Game canvas/timer render; keyboard and touch controls are available | PASS |
| TC-16 | Play Turbo Track | Phaser canvas starts; keyboard accelerates; tapping steering changes heading; brake tap reduces speed | PASS |
| TC-17 | Play Gem Runner 3D | Three.js scene renders; start works and the touch lane control changes lanes | PASS |
| TC-18 | Open a game card | Clicking or keyboard-activating a card opens its game popup | PASS |
| TC-19 | Login and About Us | Login popup shows a safe preview notice; footer About Us link opens its section | PASS |
| TC-20 | Dino Lab and Planet Pals visuals | Each science question displays its matching 3D-style image | PASS |
| TC-21 | Code Camp beginner mode | Easier questions and matching 3D-style image appear each round; all answers can be completed | PASS |

## How to rerun

From the project root in Windows PowerShell:

```powershell
npm.cmd run build
npm.cmd exec playwright test
```

The Playwright configuration writes the HTML report, JSON results, and screenshots under the root `evidence/` directory.
