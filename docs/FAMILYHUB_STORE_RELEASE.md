# Family Hub — store release & hub.pandagarde.com deploy

Checklist for Google Play, Apple App Store, and the standalone web host.

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

- **Build command:** `npm ci --ignore-scripts && npm run build:familyhub`
- **Publish directory:** `dist-familyhub`
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

- [FAMILYHUB_RELEASE_SYNC.md](./FAMILYHUB_RELEASE_SYNC.md) — web + Android + iOS on one commit
- [FAMILYHUB_MOBILE.md](./FAMILYHUB_MOBILE.md) — dev workflow
- [PRE_DEPLOYMENT_UI_UX_QA_AUDIT.md](./sdlc/PRE_DEPLOYMENT_UI_UX_QA_AUDIT.md) — store UX gates
