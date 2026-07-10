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
| `npx cap copy ios` | ✅ web assets copied to `ios/App/App/public` |
| iOS `Info.plist` + privacy manifest | ✅ export-compliance flag + `PrivacyInfo.xcprivacy` (no data collected) |
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

Family Hub uses **local-only** sign-in (`LoginPage` → “Let's go!”). Document for store review:

- No server account required
- Progress stored in on-device storage only
- **Data deletion:** Settings → Clear all data on this device, or uninstall
- Optional link to full PandaGarde website for Digital Footprint Analysis
- Child-facing content is parent-guided missions, not open social features
- **Apple 2.1:** full reply + screen recording → [FAMILYHUB_APP_STORE_REVIEW_REPLY.md](./FAMILYHUB_APP_STORE_REVIEW_REPLY.md)

See `src/pages/AppStoreReviewPage.tsx` on the marketing site for copy you can mirror in store listing notes.

---

## Google Play

### Already prepared on Windows

| Item | State |
|------|-------|
| Android project + synced web assets | ✅ `npm run cap:sync:android` |
| `targetSdkVersion` 35 | ✅ Play requirement met |
| App icon + splash (all densities) | ✅ `android/app/src/main/res/` |
| Store marketing assets | ✅ `store-assets/play-store-icon-512.png` · `play-feature-graphic-1024x500.png` |
| Upload keystore + signing config | ✅ `npm run android:keystore` → gitignored `.jks` + `keystore.properties` |
| Signed release AAB | ✅ `npm run android:bundleRelease` → `android/app/build/outputs/bundle/release/app-release.aab` |
| Debug APK (screenshots) | ✅ `npm run android:debug` → `app-debug.apk` |

**Full Play Console walkthrough:** [FAMILYHUB_PLAY_STORE.md](./FAMILYHUB_PLAY_STORE.md)

**Refresh release AAB after code changes:**

```bash
npm run test:run
npm run cap:sync:android
npm run android:bundleRelease
```

**Back up** `android/pandagarde-familyhub-upload.jks` and passwords offline before first upload.

### Play Console (human steps)

1. Create app → package `com.pandagarde.familyhub` → enroll in Play App Signing on first upload.
2. **Internal testing** → upload `app-release.aab` → smoke test.
3. Store listing: icon, feature graphic, copy from [FAMILYHUB_APP_STORE_COPY.md](./FAMILYHUB_APP_STORE_COPY.md), screenshots (capture with debug APK or emulator).
4. Privacy policy: `https://www.pandagarde.com/privacy`
5. Data safety: **No data collected** — [FAMILYHUB_STORE_PRIVACY_FORMS.md](./FAMILYHUB_STORE_PRIVACY_FORMS.md)
6. Content rating (IARC) → promote to production with staged rollout.

---

## Apple App Store

### Already prepared on Windows (no Mac needed)

The `ios/` Capacitor project is committed and pre-configured so the Mac steps are minimal:

| Item | State |
|------|-------|
| `ios/` native project (`npx cap add ios`) | ✅ present in repo |
| App icon (1024², no alpha) | ✅ `ios/App/App/Assets.xcassets/AppIcon.appiconset` |
| Splash screen | ✅ `Splash.imageset` (light + dark) |
| Bundle ID / display name | ✅ `com.pandagarde.familyhub` · `PandaGarde Family Hub` |
| Version / build | ✅ `MARKETING_VERSION 1.0.0` · `CURRENT_PROJECT_VERSION 1` (in `project.pbxproj`) |
| Web assets | ✅ `npm run build:familyhub && npx cap copy ios` copies to `ios/App/App/public` |
| Export compliance | ✅ `ITSAppUsesNonExemptEncryption=false` in `Info.plist` (no per-upload encryption prompt) |
| Deployment target | ✅ iOS 14.0 · device family iPhone + iPad · `arm64` |
| **Privacy manifest** | ✅ `ios/App/App/PrivacyInfo.xcprivacy` — no tracking, no data collected, `UserDefaults`/`CA92.1` required-reason API. Already added to the Xcode target (Copy Bundle Resources). |
| App Store marketing icon | ✅ `store-assets/apple-app-store-icon-1024.png` (opaque) via `npm run assets:store` |

**To refresh web assets after any code change (works on Windows):**

```bash
npm run build:familyhub
npx cap copy ios          # copies dist-familyhub → ios/App/App/public (no CocoaPods needed)
```

> `npx cap sync ios` additionally runs `pod install`, which requires macOS + CocoaPods.
> On Windows use `cap copy ios`; run the full `cap sync ios` once on the Mac.

### Remaining steps (require a Mac with Xcode)

```bash
# On the Mac, after cloning/pulling this repo:
npm install
npm run build:familyhub
npx cap sync ios          # runs pod install (Mac-only)
npm run cap:ios           # opens ios/App/App.xcworkspace in Xcode
```

1. Xcode → target **App** → Signing & Capabilities → select your **Team** (bundle `com.pandagarde.familyhub` is already set). Enable automatic signing.
2. Confirm the **PrivacyInfo.xcprivacy** file shows under Target → Build Phases → *Copy Bundle Resources* (already wired in `project.pbxproj`).
3. Select **Any iOS Device (arm64)** → Product → **Archive** → **Distribute App** → App Store Connect.
4. In App Store Connect, create the app (bundle `com.pandagarde.familyhub`), complete the **App Privacy** questionnaire = *No data collected* (matches the privacy manifest), attach screenshots, and submit. See [FAMILYHUB_STORE_SUBMIT_CHECKLIST.md](./FAMILYHUB_STORE_SUBMIT_CHECKLIST.md) Phase 3.

Screenshots can be captured from the iOS Simulator (Mac) or with the standalone build; see the submit checklist Phase 1.

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

- [FAMILYHUB_PLAY_STORE.md](./FAMILYHUB_PLAY_STORE.md) — **Google Play** step-by-step (AAB, console, screenshots)
- [FAMILYHUB_STORE_SUBMIT_CHECKLIST.md](./FAMILYHUB_STORE_SUBMIT_CHECKLIST.md) — **single submit checklist** (Play + Apple, copy-paste)
- [FAMILYHUB_STORE_PRIVACY_FORMS.md](./FAMILYHUB_STORE_PRIVACY_FORMS.md) — Data safety & App Privacy answers
- [FAMILYHUB_RELEASE_SYNC.md](./FAMILYHUB_RELEASE_SYNC.md) — web + Android + iOS on one commit
- [FAMILYHUB_MOBILE.md](./FAMILYHUB_MOBILE.md) — dev workflow
- [PRE_DEPLOYMENT_UI_UX_QA_AUDIT.md](./sdlc/PRE_DEPLOYMENT_UI_UX_QA_AUDIT.md) — store UX gates
