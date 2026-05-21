# Family Hub — release sync (web + Android + iOS)

One codebase, three channels. Keep them on the **same git commit** for each release.

## Channels

| Channel | Command | Output |
|---------|---------|--------|
| Hub web | `npm run deploy:netlify:familyhub` | `dist-familyhub/` → hub.pandagarde.com |
| Android | `npm run mobile:prepare` → Android Studio / Gradle | Play Store AAB |
| iOS | `npm run mobile:prepare` → Xcode (macOS) | App Store IPA |

## Source of truth

- **App logic:** `src/` (shared with marketing site where applicable)
- **Hub bundle:** `npm run build:familyhub` → `dist-familyhub/` (gitignored)
- **Native shells:** `android/`, `ios/` (committed; synced web assets are **gitignored** inside each platform)
- **Capacitor:** `capacitor.config.ts` → `webDir: 'dist-familyhub'`
- **Version:** `package.json` `version` + `scripts/bump-familyhub-version.mjs`

## Every release (checklist)

1. Merge hub changes to `main`.
2. Copy env: `.env.production.example` → `.env.production` (or set CI env).
3. `npm run test:run` and `npm run build:familyhub`.
4. Bump version:
   ```bash
   npm run mobile:bump -- 1.0.1
   # or build-number only (same marketing version):
   npm run mobile:bump:build
   ```
5. Sync native projects:
   ```bash
   npm run mobile:prepare
   ```
6. **Smoke test** on device/emulator (both platforms if shipping both).
7. Deploy web: `npm run deploy:netlify:familyhub`.
8. Submit stores from the **same commit** as step 7.
9. Git tag: `git tag familyhub-v1.0.1 && git push origin familyhub-v1.0.1`.

## Android (Windows-friendly)

```bash
npm run mobile:prepare
npm run cap:android
```

Release signing:

1. Copy `android/keystore.properties.example` → `android/keystore.properties`.
2. Place upload keystore at `android/pandagarde-familyhub-upload.jks` (gitignored).
3. `npm run android:bundleRelease` or Android Studio → Generate Signed Bundle.

## iOS (macOS required for archive)

First time on a Mac:

```bash
npm run mobile:prepare
cd ios/App && pod install && cd ../..
npm run cap:ios
```

In Xcode: set Team, bundle `com.pandagarde.familyhub`, Archive → Distribute.

Icons: `npm run assets:generate` then `npm run mobile:prepare`.

## CI

- **Netlify / hub web:** `.github/workflows/familyhub-netlify.yml`
- **Mobile smoke:** `.github/workflows/familyhub-mobile.yml`
  - `android-debug`: debug APK on every matching push
  - `ios-sync`: simulator build on `macos-latest`
  - `android-release`: manual `workflow_dispatch` + GitHub secrets:
    - `ANDROID_KEYSTORE_BASE64`
    - `ANDROID_KEYSTORE_PASSWORD`
    - `ANDROID_KEY_ALIAS`
    - `ANDROID_KEY_PASSWORD`

## What not to edit manually

- `android/app/src/main/assets/public/` — overwritten by `cap sync`
- `ios/App/App/public/` — overwritten by `cap sync`

Edit React/TS in `src/` only, then rebuild and sync.

## Related

- [FAMILYHUB_MOBILE.md](./FAMILYHUB_MOBILE.md)
- [FAMILYHUB_STORE_RELEASE.md](./FAMILYHUB_STORE_RELEASE.md)
