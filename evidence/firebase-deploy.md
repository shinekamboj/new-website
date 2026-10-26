# Firebase Hosting, Auth & Firestore

- Firebase project: `new-website-50b26` (Spark plan).
- Latest Hosting deploy: **2026-10-26**, via `npm.cmd run deploy` (`firebase deploy --only hosting`).
- Live URL: https://new-website-50b26.web.app
- Firebase Web App: registered for the React client in this project.
- Email/password signup and login use Firebase Authentication. Passwords are handled by Auth and are never stored in Firestore.
- Successful signup/login writes a profile at `users/{uid}`. Completing a game while signed in writes a score/result at `users/{uid}/gameResults`.
- Owner-only Firestore rules from `firestore.rules` were deployed on **2026-10-26**.
- To verify real persistence, create an account through **Log in → Create an account**, then finish a game. Check Firebase Console → Authentication → Users and Firestore → `users/{uid}/gameResults`. No test account was created during development.
- Firebase Hosting serves the Vite `dist/` build and rewrites routes to `index.html`. No custom domain was purchased or connected.
- Automated GitHub deployment remains paused until its service-account secret and enable variable are configured.
