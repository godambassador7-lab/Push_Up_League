# Push Up League — PWA v3 (Metallic Blue)
- Matches your logo palette (deep navy + electric blue)
- Mini calendar for lock days
- Push-up type selector
- Total push-ups stat
- 500 dynamic achievements
- 100 Legendary titles in the "Legendary Store"
- Firebase Auth ready (Google + Email/Password)
- PWA (manifest + service worker)

## Setup
1. Edit `firebase.js` with your Firebase web app config.
2. Firebase Console → Authentication → enable Google + Email/Password, add your GitHub Pages domain under Authorized domains.
3. Deploy files to GitHub Pages root and open the URL.
4. Install from the browser menu (Add to Home Screen).

## Notes
- Progress is stored locally under `pul-v3`. Hook Firestore if you want cloud sync.
- Achievements and titles are generated in `app.js` (functions `generateAchievements()` and `generateTitles()`).
