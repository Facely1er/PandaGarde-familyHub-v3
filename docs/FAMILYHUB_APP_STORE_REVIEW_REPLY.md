# Apple App Store — Guideline 2.1 review reply (v1.0.0)

Paste into **App Store Connect → App Review → Reply** and into **App Review Information → Notes** for future submissions.

Attach a **physical-device screen recording** (`.mov` / `.mp4`) when replying.

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

## Screen recording checklist (physical iPhone, latest iOS)

Record from the home screen (cold launch). Suggested flow (~4–6 min):

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

## Reply text (copy below — fill bracketed fields)

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

---

## App Review Information fields

| Field | Value |
|-------|--------|
| Sign-in required? | **No** |
| Demo account | Leave blank |
| Notes | Full reply text above |
| Attachment | Physical-device screen recording |

---

## Related docs

- [FAMILYHUB_STORE_SUBMIT_CHECKLIST.md](./FAMILYHUB_STORE_SUBMIT_CHECKLIST.md)
- [FAMILYHUB_APP_STORE_COPY.md](./FAMILYHUB_APP_STORE_COPY.md)
- [FAMILYHUB_STORE_PRIVACY_FORMS.md](./FAMILYHUB_STORE_PRIVACY_FORMS.md)
