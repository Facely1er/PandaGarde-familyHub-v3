# Family Hub — mobile (Capacitor) & hub-only web build

Family Hub can ship as a **standalone app** (iOS / Android) separate from the PandaGarde marketing site and DFA funnel.

## Builds

| Command | Output | Use |
|---------|--------|-----|
| `npm run build` | `dist/` | Full website (Netlify) |
| `npm run build:familyhub` | `dist-familyhub/` | Hub-only SPA (Capacitor `webDir`) |
| `npm run dev:familyhub` | Vite on port 5174 | Local hub-only dev |

Hub-only sets `VITE_HUB_STANDALONE=true` so routes are `/dashboard`, `/activities`, … instead of `/family-hub/...`.

## Local hub-only dev

```bash
npm run dev:familyhub
```

Open http://localhost:5174 — same UI as `/family-hub` on the main site.

## Capacitor (iOS / Android)

### Prerequisites

- Node 20.x, npm 10+
- **Android:** Android Studio, SDK 34+
- **iOS (macOS only):** Xcode 15+, CocoaPods (`pod --version`)

### First-time setup

```bash
npm install
npm run build:familyhub
npx cap sync
```

Add native projects once:

```bash
npx cap add android
npx cap add ios   # macOS only
```

### Day-to-day workflow

```bash
npm run build:familyhub
npx cap sync
npx cap open android
# or
npx cap open ios
```

Or use convenience scripts:

```bash
npm run cap:sync
npm run cap:android
npm run cap:ios
```

### Store identifiers

- **App ID:** `com.pandagarde.familyhub` (change in `capacitor.config.ts` before release)
- **Display name:** PandaGarde Family Hub

Update bundle ID, icons, and splash in Xcode / Android Studio before App Store / Play submission.

### Optional website URL

In `.env` or CI:

```env
VITE_WEBSITE_URL=https://www.pandagarde.com
```

The header “Site” link opens this URL in the system browser when running standalone.

## Deploy hub-only web (optional)

Host `dist-familyhub/` on e.g. `hub.pandagarde.com` with SPA fallback to `index.html` (same as Netlify `/* → /index.html`).

## Architecture

- **Entry:** `familyhub.html` → `src/familyhub-main.tsx` → `FamilyHubStandaloneApp.tsx`
- **Routes:** Reuses `FamilyHubWrapper` (auth, welcome, dashboard, activities, …)
- **Paths:** `src/familyhub/hubPaths.ts` switches `/family-hub/*` vs `/` based on `VITE_HUB_STANDALONE`

The main site build is unchanged; marketing + DFA remain on `npm run build`.
