# Firebase Hosting deployment

- Date: 2026-10-20
- Firebase project name: Pixel Pals Arcade
- Firebase project ID: `new-website-50b26`
- Firebase plan: Spark
- Deploy command: `npm exec -- firebase deploy --only hosting --project new-website-50b26`
- Result: Deployment completed successfully; the live page loaded in the browser with no console errors.
- Hosting URL: https://new-website-50b26.web.app
- Screenshot: [Live Firebase deployment](screenshots/firebase-hosted-live.png)

Firebase Hosting serves the Vite `dist/` build and rewrites application routes to `index.html`. No custom domain was purchased or connected.
