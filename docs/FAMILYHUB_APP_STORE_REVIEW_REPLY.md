# Apple App Store — Guideline 2.1 review reply (v1.0.0)

Paste into **App Store Connect → App Review → Reply** and **App Review Information → Notes**.

**Limit:** App Store Connect notes are capped at **4000 characters** — use the **Short reply** below.

Attach your screen recording (`.mov` / `.mp4`) when replying.

**Generate recording (automated tour — same approach as Silent Hour):**

```bash
npm run app-review:record
# → store-assets/app-review/app-review-recording.mp4
# → store-assets/app-review/app-review-recording.mov
```

The app auto-walks: login → welcome → dashboard → mission → add family member → journey → settings → clear data → login.

**Bundle ID:** `com.pandagarde.familyhub`  
**Support:** support@pandagarde.com  
**Privacy policy:** https://www.pandagarde.com/privacy

---

## Resubmission: new build required?

**Yes — upload a new iOS build (build 7), not the rejected build 6.**

| Change since rejected build | In store binary? | Why it matters |
|-----------------------------|----------------|----------------|
| **Settings → Clear all data on this device** | Yes (after rebuild) | Shown in your recording and stated in the reply — reviewers must see it in the IPA |
| **ChildProgressDetail** logger fix | Yes | Minor crash fix when viewing child progress |
| Premium copy (no IAP in v1.0.0) | Yes | Matches App Review notes |
| App Review auto-tour (`VITE_APP_REVIEW_DEMO`) | No (dev/recording only) | Not enabled in App Store builds |

**Rejected:** `1.0.0 (6)` · **Resubmit:** `1.0.0 (7)`

On Mac before upload:

```bash
npm run test:run
npm run mobile:bump:build          # 6 → 7
npm run ios:appstore               # or ios:prepare + archive in Xcode
```

Upload build **7** to App Store Connect, select it on the version, then reply with notes + recording.

**Do not** reply with only build 6 if the binary lacks **Clear all data** — Apple will not find what your notes describe.

---

## Devices tested — complete this honestly

**Recommended for resubmission:** run the full reviewer path on **Xcode Simulator** (iPhone + iPad), record on the **iPhone simulator**, and attach that `.mov` to App Store Connect. Label devices as **Simulator** — do not call them physical hardware.

**Do not attach** the Playwright web capture (`store-assets/app-review/app-review-recording.mp4`) and claim it is a device recording. Use simctl output from `npm run ios:simulator:review -- --record` instead.

**Before you submit:**

1. Run the 16-step checklist on **iPhone** simulator: `npm run ios:simulator:review -- --record`
2. Run the same checklist on **iPad** simulator: `npm run ios:simulator:review:ipad -- --record`
3. Bump, archive, and upload **build 7** (`npm run mobile:bump:build && npm run ios:appstore`).
4. Fill sections 1–2 with **only simulators you actually tested** (iPhone + iPad if both completed).

**Section 1 — simulator recording (attach iPhone `.mov`):**

```
1) SCREEN RECORDING
Attached: Xcode Simulator screen recording — iPhone 14 Pro Max (6.5"), iOS [X.Y].
Flow: cold launch → Let's go! → welcome → dashboard → Journey → Missions → complete one mission → Family (add member) → Settings (Clear all data) → login → Let's go! again.
```

**Section 2 — iPhone + iPad simulators:**

```
2) DEVICES TESTED
• iPhone Simulator (iPhone 14 Pro Max, 6.5") — iOS [X.Y] (full reviewer path + attached screen recording)
• iPad Simulator (iPad Pro 13-inch) — iPadOS [X.Y] (same reviewer path)
Build: 1.0.0 (7) — tested on Xcode Simulator before App Store upload.
```

Replace `[X.Y]` with the runtime version from Simulator or `xcrun simctl list runtimes`.

**Optional — physical device instead:** If you later test on a real iPhone via TestFlight, swap “Simulator” for the model from **Settings → General → About** and note TestFlight build 7. Do not list both simulator and physical unless you actually ran both.

**Full checklist:** [FAMILYHUB_IOS_SIMULATOR_REVIEW_TEST.md](./FAMILYHUB_IOS_SIMULATOR_REVIEW_TEST.md) · `npm run ios:simulator:review` · `npm run ios:simulator:review:ipad`

---

## Screen recording checklist (Xcode Simulator — iPhone + iPad)

Record on **iPhone simulator** (`npm run ios:simulator:review -- --record`). Repeat the same steps on **iPad simulator** (`npm run ios:simulator:review:ipad`). Suggested flow (~4–6 min each):

1. Launch app → login screen → tap **Let's go!**
2. Welcome (if shown) → **Start fresh**
3. Dashboard → start today's mission
4. Activities → browse age filters → open a mission → complete intro / learn / play / family talk / celebration
5. Family tab → add member (first name + age)
6. Journey → show progress / badges
7. Settings → Privacy → **View Privacy Policy** (opens Safari) → return to app
8. Settings → **Clear all data on this device** → confirm (shows local deletion; returns to login)
9. Tap **Let's go!** again to show fresh start

**Not in this build (state in reply):** no server accounts, no StoreKit purchases/subscriptions, no UGC/social feed, no sensitive permission prompts.

---

## Short reply (paste this — ~2060 chars, under 4000 limit)

Fill bracketed fields, then copy everything inside the code block:

```
APP REVIEW — PandaGarde Family Hub v1.0.0
Bundle ID: com.pandagarde.familyhub

1) SCREEN RECORDING
Attached: Xcode Simulator screen recording — iPhone 14 Pro Max (6.5"), iOS [VERSION]. Flow: cold launch → Let's go! → welcome → dashboard → Journey → Missions → complete one mission → Family (add member) → Settings (privacy, Clear all data) → login → Let's go! again.

Not in v1.0.0: no server accounts or cloud deletion; no IAP/subscriptions; no UGC, social, or reporting; no location, contacts, camera, microphone, photos, or ATT prompts.

2) DEVICES TESTED
• iPhone Simulator (iPhone 14 Pro Max, 6.5") — iOS [version] (full reviewer path + attached screen recording)
• iPad Simulator (iPad Pro 13-inch) — iPadOS [version] (same reviewer path)
Build: 1.0.0 (7) — tested on Xcode Simulator before App Store upload.

3) PURPOSE & AUDIENCE
Parent-guided educational app for families ages 5–17: 18 short privacy missions with real scenarios, optional practice activities, family discussion prompts, and one practical action per mission. Not a social network; does not monitor children's devices.

4) SETUP & ACCESS
No demo account. Tap "Let's go!" — creates a local guardian profile on this device only.
Reviewer path: Login → Dashboard → Journey → Missions → complete one mission → Family → Settings.
Optional pilot (not StoreKit): Settings → Premium → code FAMILYHUB-PREMIUM — on-device scenario personalization only.
Data deletion: Settings → Clear all data on this device → confirm, or delete the app. PandaGarde does not store this data on servers.

5) EXTERNAL SERVICES
Core features work offline after first load. No auth, payment, analytics, crash, or AI services in the app. Capacitor native shell; @capacitor/browser opens user-tapped links in Safari (privacy, terms on pandagarde.com). No third-party analytics loaded in Family Hub.

6) REGIONS
Consistent worldwide. UI: English, Spanish, French (Settings → Language). Free app; no IAP in v1.0.0.

7) REGULATED / THIRD-PARTY
Not applicable. Educational privacy content only. No medical, legal, or financial services. No licensed third-party media.

Support: support@pandagarde.com
Privacy: https://www.pandagarde.com/privacy
```

---

## Extended reply (reference only — exceeds 4000 chars if pasted whole)

<details>
<summary>Full text for internal reference</summary>

```
APP REVIEW INFORMATION — PandaGarde Family Hub v1.0.0
Bundle ID: com.pandagarde.familyhub

---

1) SCREEN RECORDING
Attached: screen recording captured on a physical [DEVICE MODEL] running iOS [VERSION].
Flow shown: cold launch → “Let’s go!” → welcome → dashboard → complete one mission → add family member → journey/progress → settings (privacy link, clear all data) → return to login → “Let’s go!” again.

Not applicable in v1.0.0 (confirmed in recording):
• No server account registration, login credentials, or cloud account deletion
• No paid content, subscriptions, or StoreKit in-app purchases
• No user-generated content, reporting, or blocking (no social features)
• No sensitive-data permission prompts (location, contacts, camera, microphone, photos, App Tracking Transparency)

---

2) DEVICES & OS TESTED
• iPhone [model] — iOS [version]
• iPhone [model] — iOS [version]
• iPad [model, if applicable] — iPadOS [version]
Build tested: 1.0.0 ([build number]) via TestFlight / App Review.

---

3) PURPOSE & TARGET AUDIENCE
PandaGarde Family Hub is a parent-guided educational app that helps families ages 5–17 practice digital privacy through 18 short, age-matched missions (real scenarios, interactive practice, family discussion prompts, and one practical action per mission).

Problem: Parents need repeatable privacy habits—not one-time lectures. Children need concrete practice for passwords, scams, social media, and app permissions.

Audience: Parents and guardians. Missions are done together. The app is not a social network and does not monitor children’s devices.

---

4) SETUP & ACCESS
No demo account or password required.

Sign-in: Tap “Let’s go!” on the first screen. This creates a local guardian profile on the device only.

Reviewer path:
Login → Dashboard → Activities → complete one mission → Family → add child (name + age) → Journey → Settings.

Optional pilot premium (NOT App Store billing): Settings → Premium → expand → code: FAMILYHUB-PREMIUM
Unlocks personalized mission scenarios on-device only. v1.0.0 has no in-app purchases.

Data deletion (no cloud account):
• Settings → “Clear all data on this device” → confirm, or
• Delete the app (Settings → General → iPhone Storage → PandaGarde Family Hub → Delete App).
All data stays on-device only; PandaGarde servers never receive it.

---

5) EXTERNAL SERVICES
Core features work offline after first load. No authentication service, payment processor, analytics SDK, crash reporter, or AI API is used in the app.

• Capacitor (native shell)
• @capacitor/browser (user-initiated links open in Safari)

Optional user-initiated links to https://www.pandagarde.com (privacy, terms, stories). That website is separate; Family Hub does not load third-party analytics in-app.

---

6) REGIONAL DIFFERENCES
Consistent worldwide. UI languages: English, Spanish, French (Settings → Language). No geo-restricted features. Free app; no IAP in v1.0.0.

---

7) REGULATED INDUSTRY / THIRD-PARTY MATERIAL
Not applicable. Educational privacy content only—not medical, legal, or financial services. No HIPAA claims. No licensed third-party media requiring separate authorization.

---

Support: support@pandagarde.com
Privacy: https://www.pandagarde.com/privacy
```

</details>

---

## App Review Information fields

| Field | Value |
|-------|--------|
| Sign-in required? | **No** |
| Demo account | Leave blank |
| Notes | **Short reply** above (~2060 chars) |
| Attachment | Your screen recording |

---

## Related docs

- [FAMILYHUB_STORE_SUBMIT_CHECKLIST.md](./FAMILYHUB_STORE_SUBMIT_CHECKLIST.md)
- [FAMILYHUB_APP_STORE_COPY.md](./FAMILYHUB_APP_STORE_COPY.md)
- [FAMILYHUB_STORE_PRIVACY_FORMS.md](./FAMILYHUB_STORE_PRIVACY_FORMS.md)
