# Family Hub — store release & hub.pandagarde.com deploy

Checklist for Google Play, Apple App Store, and the standalone web host.

---

## Release readiness snapshot (verified 2026-07-08)

Automated gates passing on `main` for the v1.0.0 hub bundle:

| Gate | Status |
|------|--------|
| `npm run lint` | ✅ 0 errors (2 warnings) |
| `npx tsc --noEmit` | ✅ clean |
| `npm run test:run` | ✅ 214 tests pass |
| `npm run build:familyhub` | ✅ builds; jsPDF/html2canvas lazy-split |
| `npx cap sync android` | ✅ web assets copied |
| `npm run check:content-truth` | ✅ no banned phrases |
| Native launcher icon + splash | ✅ real PandaGarde branding (all densities) |
| App name / bundle ID / version | ✅ `PandaGarde Family Hub` · `com.pandagarde.familyhub` · 1.0.0 (code 1) |
| Analytics in packaged app | ✅ none — `familyhub.html` ships no GA; declare "no data collected" |
| Standalone legal/story links | ✅ open the website via `HubWebsiteLink` / `openExternalUrl` (no dead in-app routes) |

**Story ↔ mission linking:** each mission links to its Season 1 episode via
`src/data/storyMissionLinks.ts`; story epilogue offers "Practice in Family Hub" and
missions offer an optional "Read the story" that opens the website in the system browser
when standalone.

Remaining steps are human-only (cannot be automated in-repo):

1. Generate & back up the upload keystore (see [Google Play](#google-play) below).
2. Host the privacy policy URL and confirm it loads.
3. Capture real device/emulator screenshots (see `FAMILYHUB_APP_STORE_COPY.md`).
4. Create the Play Console / App Store Connect listings and complete Data safety / App Privacy forms.

---

## Store identifiers (must match everywhere)

| Platform | Field | Value |
|----------|-------|-------|
| Capacitor | `appId` | `com.pandagarde.familyhub` |
| Android | `applicationId` | `com.pandagarde.familyhub` |
| Android | `namespace` | `com.pandagarde.familyhub` |
| iOS | Bundle ID | `com.pandagarde.familyhub` |
| Display name | App name | **PandaGarde Family Hub** |

**Files to keep in sync:** `capacitor.config.ts`, `android/app/build.gradle`, `android/app/src/main/res/values/strings.xml`, Xcode target (after `npx cap add ios`).

Change the bundle ID **before** first store upload if ERMITS uses a different reverse-DNS (e.g. `com.ermits.pandagarde.familyhub`).

---

## Versioning

| Build | Location | Current |
|-------|----------|---------|
| Android `versionCode` | `android/app/build.gradle` | `1` (increment every Play upload) |
| Android `versionName` | `android/app/build.gradle` | `1.0` |
| iOS | Xcode → General → Version / Build | Set on first iOS open |

---

## Icons & splash

Source artwork: `assets/icon.png`, `assets/splash.png` (from PandaGarde logo).

```bash
npm run assets:generate   # @capacitor/assets → android/ (+ ios when added)
npm run cap:sync
```

Launcher background color: teal tint `#F0FDFA` (`android/app/src/main/res/values/ic_launcher_background.xml`).

---

## Reviewer notes (no real accounts)

Family Hub uses **local-only** sign-in (`LoginPage` → “Open Family Hub”). Document for store review:

- No server account required
- Progress stored in on-device storage only
- Optional link to full PandaGarde website for Digital Footprint Analysis
- Child-facing content is parent-guided missions, not open social features

See `src/pages/AppStoreReviewPage.tsx` on the marketing site for copy you can mirror in store listing notes.

---

## Google Play

1. `npm run cap:android` → Android Studio → **Build → Generate Signed Bundle / APK** (AAB recommended).
2. Play Console → Create app → same package `com.pandagarde.familyhub`.
3. Privacy policy URL (required): use `https://www.pandagarde.com/privacy` or dedicated hub policy.
4. Data safety: declare local storage only; no account, no ads to children (per governance suite).
5. Screenshots: capture from hub standalone build (`npm run dev:familyhub` or device).

---

## Apple App Store (macOS required)

```bash
npx cap add ios          # once, on Mac
npm run assets:generate -- --ios
npm run cap:ios
```

1. Xcode → Signing & Capabilities → Team + bundle `com.pandagarde.familyhub`.
2. Archive → Distribute to App Store Connect.
3. App Privacy questionnaire: align with local-only storage story.

---

## Deploy hub.pandagarde.com (Netlify)

**Production:** https://hub.pandagarde.com  
**Netlify site:** `pandagarde-family-hub` (`09a33b67-21f2-4f27-bc38-1b732b9cf29e`)  
**Admin:** https://app.netlify.com/projects/pandagarde-family-hub

### Manual deploy (CLI)

```bash
npm run deploy:netlify:familyhub
```

Uploads `dist-familyhub/` with `--no-build` (avoids running the full-site `netlify.toml` build).

### Git-connected builds

The site is configured to run:

- **Configuration file:** `netlify-familyhub.toml` (Site settings → Build & deploy)
- **Build command:** `node scripts/netlify-build.mjs` (hub-only; safe even if `netlify.toml` is selected)
- **Publish directory:** `dist-familyhub` (not `dist` — that folder is the full marketing website)
- **Repo:** `Facely1er/PandaGarde-familyHub-v3` (branch `main`)

Optional env in Netlify UI:

- `VITE_HUB_STANDALONE=true`
- `VITE_WEBSITE_URL=https://www.pandagarde.com`

Config reference: [netlify-familyhub.toml](../netlify-familyhub.toml)

### Attach domain (one-time script)

```bash
node scripts/netlify-add-hub-domain.mjs
```

---

## Deploy hub (Vercel alternative)

1. New Vercel project → same repo.
2. Import settings from [vercel-familyhub.json](../vercel-familyhub.json) or set:
   - Build: `npm run build:familyhub`
   - Output: `dist-familyhub`
3. Environment: `VITE_HUB_STANDALONE=true`, `VITE_WEBSITE_URL=https://www.pandagarde.com`
4. Domain: `hub.pandagarde.com`

---

## Pre-release smoke test

```bash
npm run build:familyhub
npm run preview:familyhub
# or
npm run cap:sync && npm run cap:android
```

- [ ] Welcome → “Start fresh” → dashboard shows **Today’s mission**
- [ ] Complete one mission → celebration + streak
- [ ] Kids → add member → age-filtered activities
- [ ] Header “Site” opens pandagarde.com in browser (standalone)
- [ ] Works offline after first load (airplane mode spot-check)

---

## Version bump (all platforms)

```bash
node scripts/bump-familyhub-version.mjs 1.0.1
npm run mobile:prepare
```

Build-number only (same marketing version, new Play/App Store upload):

```bash
npm run mobile:bump:build
npm run mobile:prepare
```

## Related docs

- [FAMILYHUB_STORE_SUBMIT_CHECKLIST.md](./FAMILYHUB_STORE_SUBMIT_CHECKLIST.md) — **single submit checklist** (Play + Apple, copy-paste)
- [FAMILYHUB_STORE_PRIVACY_FORMS.md](./FAMILYHUB_STORE_PRIVACY_FORMS.md) — Data safety & App Privacy answers
- [FAMILYHUB_RELEASE_SYNC.md](./FAMILYHUB_RELEASE_SYNC.md) — web + Android + iOS on one commit
- [FAMILYHUB_MOBILE.md](./FAMILYHUB_MOBILE.md) — dev workflow
- [PRE_DEPLOYMENT_UI_UX_QA_AUDIT.md](./sdlc/PRE_DEPLOYMENT_UI_UX_QA_AUDIT.md) — store UX gates
