# Firebase Hosting deployment

- Date: 2026-10-20
- Firebase project name: Pixel Pals Arcade
- Firebase project ID: `new-website-50b26`
- Firebase plan: Spark
- Deploy command: `npm exec -- firebase deploy --only hosting --project new-website-50b26`
- Result: Deployment completed successfully; the live page loaded in the browser with no console errors.
- GitHub Actions verification: build and Playwright tests pass on push. Automated Firebase deployment is paused until its service-account secret and enable variable are configured.
- Hosting URL: https://new-website-50b26.web.app
- Screenshot: [Live Firebase deployment](screenshots/firebase-hosted-live.png)

Firebase Hosting serves the Vite `dist/` build and rewrites application routes to `index.html`. No custom domain was purchased or connected.

## Firebase Auth and Firestore

- Firebase Web App is registered for project `new-website-50b26`.
- Email/password Firebase Auth supports signup and login; passwords are never written to Firestore.
- Profiles are saved at `users/{uid}` and completed game results at `users/{uid}/gameResults`.
- Owner-only rules from `firestore.rules` were deployed to Firestore on 2026-10-26.
- The latest Auth/Firestore UI changes are in the project working tree; a Hosting deploy is required before they appear on the live URL.

## Firebase Auth and Firestore

- A Firebase Web App is registered for the React client in project `new-website-50b26`.
- Email/password signup and login use Firebase Authentication. Passwords are not written to Firestore.
- User profiles are saved to `users/{uid}`; finished game results are saved to `users/{uid}/gameResults`.
- Owner-only Firestore rules from `firestore.rules` were deployed on 2026-10-26. A real account and completed game are needed for a manual persistence check.
- The Auth/Firestore UI changes are separate from the earlier Hosting deployment; publish a fresh Hosting build to update the live URL.
