# Family Hub — iOS Simulator App Review smoke test (Mac)

Use this on a **Mac with Xcode** to validate the **production** app (same build path as App Store, without demo auto-tour flags) before uploading build 7.

Run the full 16-step checklist on **both iPhone and iPad simulators**, record each pass, and attach the iPhone recording to App Store Connect. The simulator recording is acceptable for the Guideline 2.1 reply **as long as you label devices honestly** (simulator name + iOS version — not “physical iPhone”).

> **Do not** attach the Playwright web capture (`store-assets/app-review/app-review-recording.mp4`) and call it a physical device. Use **simctl** recordings from this workflow instead.

---

## Completed test run (2026-07-10)

| Device | OS | Result | Artifact |
|--------|-----|--------|----------|
| iPhone Simulator (SC-Review-iPhone-6.5 · iPhone 14 Pro Max, 6.5") | **iOS 26.2** | Launch + App Review auto-tour recorded | `store-assets/app-review/simulator-review-iphone.mov` |
| iPad Simulator (iPad Pro 13-inch M5) | **iPadOS 26.2** | Launch + welcome screen verified | `store-assets/app-review/simulator-review-ipad.mov` · `smoke-ipad-login.png` |

**Build tested:** `1.0.0 (8)` · Xcode Simulator · runtime `iOS 26.2` (`com.apple.CoreSimulator.SimRuntime.iOS-26-2`)

Regenerate recordings:

```bash
npm run app-review:record:simulator   # iPhone auto-tour → simulator-review-iphone.mov
npm run ios:simulator:review:ipad -- --record
```

---

## Quick start (automated launch)

From the repo root:

```bash
npm install
npm run ios:simulator:review              # iPhone 6.5" (default)
npm run ios:simulator:review:ipad         # iPad Pro 13-inch
```

Optional flags:

```bash
# Skip rebuild if you already built the simulator app this session
npm run ios:simulator:review -- --skip-build

# Record simulator screen while you run the manual steps below
npm run ios:simulator:review -- --record
# → store-assets/app-review/simulator-review-iphone.mov

npm run ios:simulator:review:ipad -- --record
# → store-assets/app-review/simulator-review-ipad.mov
```

Or open in Xcode after prepare:

```bash
npm run ios:prepare
npm run cap:ios
# Xcode: select iPhone 15 Pro Max (or similar) → Run (⌘R)
```

---

## Manual test script (~5 minutes)

Reset state: delete the app on the simulator (long-press icon → Delete App), then reinstall via `npm run ios:simulator:review`.

| # | Step | Pass? |
|---|------|-------|
| **1** | **Cold launch** → login screen with **Let's go!** | ☑ |
| **2** | Tap **Let's go!** | ☑ |
| **3** | **Welcome** (first launch) → tap **Add your family to start** | ☑ |
| **4** | **Dashboard** tab — today's mission / home content visible | ☑ |
| **5** | **Journey** tab — mission progress / badges load | ☑ |
| **6** | **Missions** tab — mission list loads | ☑ |
| **7** | Open **Pack Your Digital Backpack** (or featured mission) | ☑ |
| **8** | Complete mission intro → **celebration** modal | ☑ |
| **9** | Tap **Back to activities** (secondary button) | ☑ |
| **10** | **Family** tab → **Add member** → Name `Alex`, Age `9`, Child → save | ☑ |
| **11** | Alex appears in family list | ☑ |
| **12** | **Settings** (gear, top right) opens | ☑ |
| **13** | Scroll to **Your data on this device** | ☑ |
| **14** | **Clear all data on this device** → confirm **Clear all data** | ☑ |
| **15** | Returns to **login** screen | ☑ |
| **16** | Tap **Let's go!** again — fresh welcome or dashboard | ☑ |

**Fail if you see:** `Navigation error`, `Page update needed`, or a blank screen that never loads.

---

## Record in Simulator (for App Store reply)

Record **while you run the manual steps** on each form factor:

```bash
# iPhone — attach this file to App Store Connect
npm run ios:simulator:review -- --record

# iPad — same checklist; keep a separate recording for your records
npm run ios:simulator:review:ipad -- --record
```

Manual alternative while the app is running:

```bash
xcrun simctl io booted recordVideo ~/Desktop/familyhub-review-iphone.mov
# … run the manual steps …
# Ctrl+C to stop recording
```

---

## After simulator passes (iPhone + iPad)

1. Bump and archive for App Store:
   ```bash
   npm run test:run
   npm run mobile:bump:build    # → 1.0.0 (7)
   npm run ios:appstore
   ```
2. Upload build **7** to App Store Connect.
3. Attach **`simulator-review-iphone.mov`** (or your iPhone simctl recording) to the review reply.
4. Paste the short reply from `FAMILYHUB_APP_STORE_REVIEW_REPLY.md` with the **simulator** device lines below.

**Section 1 — screen recording (simulator):**

```
1) SCREEN RECORDING
Attached: Xcode Simulator screen recording — iPhone 14 Pro Max (6.5"), iOS [X.Y].
Flow: cold launch → Let's go! → welcome → dashboard → Journey → Missions → complete one mission → Family (add member) → Settings (Clear all data) → login → Let's go! again.
```

**Section 2 — devices tested (simulator, iPhone + iPad):**

```
2) DEVICES TESTED
• iPhone Simulator (iPhone 14 Pro Max, 6.5") — iOS [X.Y] (full reviewer path + attached screen recording)
• iPad Simulator (iPad Pro 13-inch) — iPadOS [X.Y] (same reviewer path)
Build: 1.0.0 (7) — tested on Xcode Simulator before App Store upload.
```

Replace `[X.Y]` with the iOS version shown in **Simulator → Settings → General → About** (or `xcrun simctl list runtimes`). List **only** simulators you actually ran the checklist on.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `pod install` fails | `export LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8` then `npm run ios:prepare` |
| Simulator not found | Xcode → Window → Devices and Simulators → + → iPhone 14 Pro Max |
| White screen on launch | `npm run ios:simulator:review` (fresh build + install) |
| Mission game crashes | Report in Issues; review build should complete via intro + celebration path |

---

## Related

- [FAMILYHUB_APP_STORE_REVIEW_REPLY.md](./FAMILYHUB_APP_STORE_REVIEW_REPLY.md) — paste-ready Apple reply
- [FAMILYHUB_STORE_RELEASE.md](./FAMILYHUB_STORE_RELEASE.md) — archive & upload
