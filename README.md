# Push Up League — PWA (No Leaderboards)
Metallic-gold / black theme. Integrity system, lock-days XP, achievements, titles shop. Firebase Auth ready.

## Quick start
1. **Edit `firebase.js`** with your Firebase project keys (Settings → General → Web app).
2. In Firebase Console:
   - **Authentication → Sign-in method**: enable **Email/Password** and **Google** (or what you prefer).
   - (Optional) Add authorized domain for GitHub Pages: `yourname.github.io`.
3. Deploy to **GitHub Pages**:
   - Create a repo, push these files to the root (or `/docs` subfolder if you prefer Pages → `/docs`).
   - In repo settings → **Pages**, set branch to `main` and root to `/` (or `/docs` if used).
4. Visit your Pages URL; install the PWA from the browser's install option.

## PWA notes
- `manifest.webmanifest` + `sw.js` provide installability & offline basics.
- Icons are placeholders; replace `assets/icons/icon-192.png` & `icon-512.png` with your logo.

## Data & Sync
- Progress is stored in `localStorage` under key `pul-v2`.
- Authentication is wired (Google & Email/Password). This starter does **not** sync data to Firestore.
  - If you want sync, create a `users/{uid}` doc and persist XP, integrity, streak, etc.

## Customize achievements & titles
Open `app.js` and edit the `ACHIEVEMENTS` and `TITLES` arrays. The UI will adapt to the number you provide.

## Common issues
- **Blank screen on GitHub Pages**: ensure all files live at repo root (or adjust relative paths) and that Pages is enabled.
- **Firebase Auth blocked**: Add your Pages domain to Firebase **Authentication → Settings → Authorized domains**.
- **PWA install icon not showing**: must be visited over HTTPS (Pages is), with a valid manifest and a registered service worker.

## Development
No build step needed. Edit files and refresh. For local previews, run any static server (e.g., `python -m http.server 8080`).
