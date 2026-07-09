# Family Hub — Google Play completion guide (v1.0.0)

Everything you can do **from Windows** before opening Play Console. iOS steps are in [FAMILYHUB_STORE_RELEASE.md](./FAMILYHUB_STORE_RELEASE.md).

**Package:** `com.pandagarde.familyhub` · **Version:** 1.0.0 (`versionCode` 1)

---

## Already prepared in-repo

| Item | Status |
|------|--------|
| Capacitor Android project | ✅ `android/` |
| App ID / display name | ✅ `com.pandagarde.familyhub` · PandaGarde Family Hub |
| `targetSdkVersion` / `compileSdkVersion` | ✅ 35 |
| Launcher icons + splash (all densities) | ✅ `android/app/src/main/res/` |
| Web bundle synced | ✅ `npm run cap:sync:android` |
| Store marketing assets | ✅ `store-assets/play-store-icon-512.png` · `play-feature-graphic-1024x500.png` |
| Listing copy | ✅ [FAMILYHUB_APP_STORE_COPY.md](./FAMILYHUB_APP_STORE_COPY.md) |
| Data safety answers | ✅ [FAMILYHUB_STORE_PRIVACY_FORMS.md](./FAMILYHUB_STORE_PRIVACY_FORMS.md) |
| Unit tests | ✅ `npm run test:run` |

---

## Release build (Windows)

### One-time: upload keystore

```bash
# Requires Android Studio JBR (keytool):
$env:JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"
npm run android:keystore
```

Creates (gitignored):

- `android/pandagarde-familyhub-upload.jks`
- `android/keystore.properties`

**Back up the `.jks` file and passwords offline** (password manager + encrypted drive). Losing them blocks all future Play updates.

### Build signed AAB (every release)

```bash
npm run test:run
npm run cap:sync:android
npm run assets:store
npm run android:bundleRelease
```

**Upload this file to Play Console:**

```
android/app/build/outputs/bundle/release/app-release.aab
```

### Debug APK (screenshots / smoke test)

```bash
npm run android:debug
# → android/app/build/outputs/apk/debug/app-debug.apk
```

Install on emulator or device:

```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

Or open Android Studio: `npm run cap:android` → **Run**.

---

## Screenshots (required before listing)

Capture **5–8 real app screens** (not logo-only images — Play rejects those).

| # | Screen | Suggested caption |
|---|--------|-------------------|
| 1 | Login → tap **Let's go!** | Family privacy missions for ages 5–17 |
| 2 | Dashboard (today's mission) | Daily privacy missions for the whole family |
| 3 | Activities (age filters) | 18 missions · Ages 5–17 |
| 4 | Mission intro (scenario) | Real situations, not abstract rules |
| 5 | In-mission game / learn step | Play and learn together |
| 6 | Family talk step | Talk it through at home |
| 7 | Journey / Progress | Track progress & celebrate |
| 8 | Kids screen | Add each child — name and age only |

**Minimum:** 4 phone screenshots · **Aspect:** 9:16 portrait (e.g. Pixel emulator 1080×2400).

Save screenshots to `store-assets/screenshots/play/` (create folder when ready).

---

## Play Console — step by step

### 1. Create the app

1. [Google Play Console](https://play.google.com/console) → **Create app**
2. App name: **PandaGarde Family Hub**
3. Default language: English (United States)
4. App or game: **App**
5. Free or paid: **Free**
6. Declarations: comply with policies → **Create app**

When prompted for package name, use **`com.pandagarde.familyhub`** (must match the AAB exactly).

### 2. Set up the app → App integrity

On first upload, enroll in **Google Play App Signing**. Google will manage the app signing key; you keep the upload keystore (`pandagarde-familyhub-upload.jks`).

### 3. Testing → Internal testing

1. **Create new release**
2. Upload `app-release.aab`
3. Release name: `1.0.0 (1)`
4. Release notes (paste):

```
Welcome to PandaGarde Family Hub! 18 privacy missions for ages 5–17, family discussion prompts, progress tracking, and certificates—all stored on your device. Works standalone or after the PandaGarde website assessment.
```

5. Save → **Review release** → **Start rollout to Internal testing**
6. Add yourself as a tester → install from the opt-in link → smoke test

### 4. Store presence → Main store listing

| Field | Value |
|-------|--------|
| App name | `PandaGarde Family Hub` |
| Short description (80 chars) | `18 family privacy missions, ages 5 to 17. Practice, talk, fix — device only.` |
| Full description | [FAMILYHUB_APP_STORE_COPY.md](./FAMILYHUB_APP_STORE_COPY.md) § Full description |
| App icon | `store-assets/play-store-icon-512.png` |
| Feature graphic | `store-assets/play-feature-graphic-1024x500.png` |
| Phone screenshots | Your captured set |
| Category | **Education** |
| Contact email | `support@pandagarde.com` |
| Privacy policy | `https://www.pandagarde.com/privacy` |
| Website | `https://www.pandagarde.com` |

### 5. Policy → App content

Complete each section:

| Section | Answer |
|---------|--------|
| **Privacy policy** | `https://www.pandagarde.com/privacy` |
| **Ads** | No, app does not contain ads |
| **App access** | All functionality available without special access — paste review notes below |
| **Content rating** | Start questionnaire → IARC → expect **Everyone** |
| **Target audience** | Families / mixed; parent-guided (not primarily child-directed standalone app) |
| **Data safety** | **No data collected** — see [FAMILYHUB_STORE_PRIVACY_FORMS.md](./FAMILYHUB_STORE_PRIVACY_FORMS.md) |
| **Government apps** | No |
| **Financial features** | No |
| **Health** | No |

**App access — review instructions (paste):**

```
SIGN-IN: No real account. Tap "Let's go!" on the login screen to open Family Hub.

DATA: Family members (first name + age) and mission progress are stored in on-device storage only. No backend sync in this build.

CHILDREN: Parent-guided educational missions. No social feed, no child-to-child messaging, no ads targeting children.

OPTIONAL: Users may open pandagarde.com in the system browser for stories or Digital Footprint Analysis.

TEST PATH: Login → Welcome (optional) → Dashboard → Activities → start any mission → complete intro/learn/play → family step → celebration.
```

### 6. Release to production

1. Internal test passed → promote to **Closed testing** (optional) or **Production**
2. **Staged rollout** recommended: 10% → 50% → 100% over a few days
3. Submit for review

---

## Post-launch

| Step | Command / action |
|------|------------------|
| Deploy web hub (same commit) | `npm run deploy:netlify:familyhub` |
| Tag release | `git tag familyhub-v1.0.0 && git push origin familyhub-v1.0.0` |
| Next Play upload | `npm run mobile:bump:build` → rebuild AAB → increment `versionCode` only |

---

## Master checklist

```
BUILD (Windows)
[x] npm run test:run
[x] npm run cap:sync:android
[x] npm run assets:store
[x] Upload keystore created + backed up offline
[x] app-release.aab built

ASSETS (you)
[ ] 5–8 phone screenshots captured
[ ] Privacy policy URL loads on phone

PLAY CONSOLE
[ ] App created (com.pandagarde.familyhub)
[ ] App signing enrolled
[ ] Internal testing release uploaded + installed
[ ] Store listing complete (icon, feature graphic, copy, screenshots)
[ ] Data safety: No data collected
[ ] Content rating certificate
[ ] App access review notes pasted
[ ] Production release submitted (staged rollout)
```

---

*Last updated for v1.0.0 Play Store readiness — July 2026*
