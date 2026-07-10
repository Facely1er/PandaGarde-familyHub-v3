# Family Hub — iOS Simulator smoke test (Mac, optional)

Quick QA on Mac before uploading build 7. Same 16 steps as the App Review path.

```bash
npm run ios:simulator:review
```

Or Xcode: `npm run cap:ios` → Run on any iPhone simulator.

## Checklist

| # | Step |
|---|------|
| 1 | Launch → **Let's go!** |
| 2 | Welcome → **Add your family to start** |
| 3 | **Dashboard** tab |
| 4 | **Journey** tab |
| 5 | **Missions** tab → open a mission → **Back to activities** after celebration |
| 6 | **Family** → add member (e.g. Alex, 9) |
| 7 | **Settings** → **Clear all data on this device** → confirm |
| 8 | Back on login → **Let's go!** again |

Pass = no error screens. Then test the same path on a **real iPhone** (TestFlight) and fill section 2 in [FAMILYHUB_APP_STORE_REVIEW_REPLY.md](./FAMILYHUB_APP_STORE_REVIEW_REPLY.md).
