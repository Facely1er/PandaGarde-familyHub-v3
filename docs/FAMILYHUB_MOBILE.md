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
npm run mobile:prepare    # build:familyhub + cap sync (both platforms)
npm run cap:android       # open Android Studio
npm run cap:ios           # open Xcode (macOS)
```

Platform-only sync:

```bash
npm run cap:sync:android
npm run cap:sync:ios
```

**Release sync (web + stores):** see [FAMILYHUB_RELEASE_SYNC.md](./FAMILYHUB_RELEASE_SYNC.md).

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

## Icons & splash (native)

Source files live in `assets/` (see [assets/README.md](../assets/README.md)).

```bash
npm run assets:generate   # writes Android res/; add --ios after cap add ios
npm run cap:sync
```

## PWA (website + hub web)

Both production bundles register `/sw.js` in production (`src/main.tsx` for www, `src/familyhub-main.tsx` for hub).

| Host | Build | Manifest |
|------|-------|----------|
| www.pandagarde.com | `npm run build` → `dist/` | `/manifest.json` |
| hub.pandagarde.com | `npm run build:familyhub` → `dist-familyhub/` | `/familyhub-manifest.json` |

Pre-deploy (one command — tests, both builds, PWA asset checks):

```bash
npm run deploy:check
```

Ship both Netlify sites after `deploy:check` passes (requires Netlify CLI login + linked sites):

```bash
npm run deploy:netlify:all
```

Individual deploys (run `deploy:check` first; deploys use `--no-build`):

```bash
npm run deploy:netlify              # www.pandagarde.com — dist/
npm run deploy:netlify:familyhub    # hub.pandagarde.com — dist-familyhub/
```

Netlify site IDs (ERMITS team): main `2e41bc3f-2d27-469f-a104-c8ddcee69883`, hub `09a33b67-21f2-4f27-bc38-1b732b9cf29e`.

CI: `.github/workflows/website-build.yml` (main site), `familyhub-netlify.yml` (hub).

---

## Deploy hub.pandagarde.com

**Netlify (recommended):** second site using [netlify-familyhub.toml](../netlify-familyhub.toml) — full steps in [FAMILYHUB_STORE_RELEASE.md](./FAMILYHUB_STORE_RELEASE.md).

```bash
npm run deploy:netlify:familyhub   # requires netlify CLI + linked site
```

**Vercel:** new project with [vercel-familyhub.json](../vercel-familyhub.json), output `dist-familyhub`.

Env for both hosts:

```env
VITE_HUB_STANDALONE=true
VITE_WEBSITE_URL=https://www.pandagarde.com
```

## Architecture

- **Entry:** `familyhub.html` → `src/familyhub-main.tsx` → `FamilyHubStandaloneApp.tsx`
- **Routes:** Reuses `FamilyHubWrapper` (auth, welcome, dashboard, activities, …)
- **Paths:** `src/familyhub/hubPaths.ts` switches `/family-hub/*` vs `/` based on `VITE_HUB_STANDALONE`

The main site build is unchanged; marketing + DFA remain on `npm run build`.

## Store release

See [FAMILYHUB_STORE_RELEASE.md](./FAMILYHUB_STORE_RELEASE.md) for bundle IDs, Play/App Store checklist, and reviewer notes.
