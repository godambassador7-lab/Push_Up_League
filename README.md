# Push Up League

A gamified push-up tracker PWA. Log by the hour, lock days to earn XP, collect titles, rank up, and keep a weekly streak for bonus XP. Optimized for mobile with a sleek sports look, installable to your home screen.

## Features
- 12-hour AM/PM logging by the hour
- Lock day to finalize XP and trigger streak logic (≥100/day for 7 days → 3 days of 2× XP)
- 500 legendary titles, spendable XP shop
- 100 levels, weekly target scales by level
- Streak/bonus indicators, weekly/monthly calendar
- Local profiles (username/password, hashed)
- Optional Google Sign-In (paste your Client ID in the code)
- Local leaderboard + rank tiers
- PWA: Add to Home Screen, offline caching, swipe gestures
- Data durability: localStorage + IndexedDB mirror

## Getting Started (Local)
1. Serve the folder (service workers need http/https):
   - Python: `python3 -m http.server 8080`
   - Node: `npx serve`
2. Visit `http://localhost:8080/pushup_league_pwa.html`
3. Add to Home Screen when prompted.

## GitHub Pages
- Put all files at the repo root.
- Rename `pushup_league_pwa.html` to `index.html` (optional) so the site root loads the app.
- Enable Pages in **Settings → Pages** (branch: `main`, folder: `/`).
- Visit `https://<username>.github.io/<repo>/`.

## Google Sign-In
- Open `pushup_league_pwa.html`, find:
  ```js
  const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE';
  ```
- Replace with your Client ID from Google Cloud Console.
- Add your domain (or `http://localhost`) to **Authorized JavaScript origins**.

## License
Copyright © 2025 Demetrius Smith. All Rights Reserved.
Push Up League™ is a trademark of Demetrius Smith.
