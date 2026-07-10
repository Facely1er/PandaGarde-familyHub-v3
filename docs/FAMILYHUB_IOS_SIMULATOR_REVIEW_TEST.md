# Family Hub — iOS Simulator App Review smoke test (Mac)

Use this on a **Mac with Xcode** to validate the **production** app (same build path as App Store, without demo auto-tour flags) before uploading build 7.

> **Apple’s Guideline 2.1** asks for a **physical iPhone** screen recording for submission. Simulator testing here is for **QA only**. After this passes, repeat on a **real iPhone** (TestFlight) and record there for App Store Connect.

---

## Quick start (automated launch)

From the repo root:

```bash
npm install
npm run ios:simulator:review
```

Optional flags:

```bash
# Skip rebuild if you already built the simulator app this session
npm run ios:simulator:review -- --skip-build

# Record simulator screen while you run the manual steps below
npm run ios:simulator:review -- --record
# → store-assets/app-review/simulator-review-recording.mov
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
| **1** | **Cold launch** → login screen with **Let's go!** | ☐ |
| **2** | Tap **Let's go!** | ☐ |
| **3** | **Welcome** (first launch) → tap **Add your family to start** | ☐ |
| **4** | **Dashboard** tab — today's mission / home content visible | ☐ |
| **5** | **Journey** tab — mission progress / badges load | ☐ |
| **6** | **Missions** tab — mission list loads | ☐ |
| **7** | Open **Pack Your Digital Backpack** (or featured mission) | ☐ |
| **8** | Complete mission intro → **celebration** modal | ☐ |
| **9** | Tap **Back to activities** (secondary button) | ☐ |
| **10** | **Family** tab → **Add member** → Name `Alex`, Age `9`, Child → save | ☐ |
| **11** | Alex appears in family list | ☐ |
| **12** | **Settings** (gear, top right) opens | ☐ |
| **13** | Scroll to **Your data on this device** | ☐ |
| **14** | **Clear all data on this device** → confirm **Clear all data** | ☐ |
| **15** | Returns to **login** screen | ☐ |
| **16** | Tap **Let's go!** again — fresh welcome or dashboard | ☐ |

**Fail if you see:** `Navigation error`, `Page update needed`, or a blank screen that never loads.

---

## Record in Simulator (optional)

While the app is running:

```bash
xcrun simctl io booted recordVideo ~/Desktop/familyhub-review.mov
# … run the manual steps …
# Ctrl+C to stop recording
```

Or use `npm run ios:simulator:review -- --record`.

---

## After simulator passes

1. Bump and archive for App Store:
   ```bash
   npm run test:run
   npm run mobile:bump:build    # → 1.0.0 (7)
   npm run ios:appstore
   ```
2. Upload build **7** to App Store Connect → TestFlight.
3. Install on a **physical iPhone** and run the same 16 steps.
4. Record on the **physical iPhone** (Control Center → Screen Recording) for the Apple reply.
5. Paste the short reply from `FAMILYHUB_APP_STORE_REVIEW_REPLY.md` with honest device lines.

**Honest devices line (simulator only):**

```
2) DEVICES TESTED
• iPhone Simulator (iPhone 14 Pro Max) — iOS [X.Y] (pre-submission smoke test)
• iPhone [your model] — iOS [your version] (TestFlight build 7 + screen recording)
Build: 1.0.0 (7) via TestFlight internal testing.
```

Use the physical iPhone line only after you actually test on that device.

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
