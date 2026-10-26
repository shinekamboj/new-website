# Project Requirements — Pixel Pals Arcade

## Product requirements

1. Build a responsive browser-based games website with **React**.
2. Use a colorful arcade visual style and provide brand/header, game search, category filters, and a useful footer.
3. Keep the kids' collection separate from the grown-ups' collection.
4. Include at least five games per collection. The grown-ups' selection must remain general-audience and appropriate.
5. Games must provide playable interaction, feedback, and/or a result—not just descriptions.
6. Search should match game names, categories, descriptions, and tags in the current collection. Category filters should work independently.
7. Provide an empty-search state with a way to reset filters/search.
8. Support mobile, tablet, and desktop sizes without horizontal overflow; controls should remain usable.
9. Support keyboard access, visible focus, and closing game dialogs with Escape.
10. Preserve verification evidence, including automated test output and screenshots.
11. Prepare the React site for Firebase Hosting deployment.

## Implemented scope

- React 19 + Vite front end; no separate backend is required to play.
- 13 browser games: 8 kids' games and 5 general-audience games for grown-ups.
- Header login opens a preview form; About Us information is available in the footer. No authentication service is configured.
- **Star Catcher** is a React-integrated Canvas arcade game: steer with arrow keys/A-D or touch controls, collect stars, avoid rocks, and track score, lives, and time.
- **Math Meteor** uses animated, isometric 3D-style boxes to visually count addition, subtraction, and multiplication step by step.
- **Word Wild** pairs each scramble round with its own dimensional illustration (cat, star, and grassy plain) that gently floats in a 3D-styled scene.
- **Dino Lab** and **Planet Pals** show a matching 3D-style image for each science question (fossil/dinosaur tracks and Earth/Sun/Saturn).
- **Code Camp** has simplified beginner questions with matching number-block, robot-step, and repeat-loop 3D-style images.
- **Turbo Track** is a Phaser 4 top-down racer loaded inside the React game modal. It has an oval circuit, keyboard/touch steering, acceleration and braking, off-track slowdown, a 3-lap goal, speed HUD, and a 60-second timer.
- **Gem Runner 3D** uses Three.js for a real-time 3D runner scene with three lanes, collectible gems, obstacles, jumping, keyboard controls, and touch controls.
- Other games provide quiz, word, reaction, story-choice, and resource-puzzle interactions.
- No user account or personal information is required.

## Assumptions and notes

- “Actual game” means original, self-contained browser gameplay, not an externally hosted commercial game.
- Domain lookup in the source project is point-in-time only; it does not reserve or purchase a domain.
- Firebase deployment configuration exists in the project. Automated deployment requires the configured GitHub secret/variable described in the source project documentation.
