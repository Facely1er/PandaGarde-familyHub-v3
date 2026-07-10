# Family Hub — Play Data safety & Apple App Privacy (v1.0.0)

Copy-paste reference for **PandaGarde Family Hub** (`com.pandagarde.familyhub`).  
Aligned with shipped behavior: local-only storage, no backend account, no analytics in the packaged app.

**Privacy policy URL (required on both stores):**  
`https://www.pandagarde.com/privacy`  
(or your live policy URL — must match the listing)

**Support email:** `support@pandagarde.com`

---

## What the app actually does (source of truth)

| Behavior | Shipped? |
|----------|----------|
| Server account / login | **No** — local “Let’s go!” only |
| Data sent to PandaGarde servers | **No** |
| Analytics (GA4) in packaged app | **No** — `familyhub.html` has no gtag |
| Sentry / crash reporting | **No** — no-op stub |
| Ads | **No** |
| In-app purchases | **No** |
| Social network / child messaging | **No** |
| Location, contacts, photos, mic, camera | **No** (no permissions requested) |
| Internet permission | **Yes** — load app bundle, optional user-opened links, service worker cache |
| User-entered data on device | **Yes** — child first name, age, mission progress, theme (localStorage only) |
| Optional external links | **Yes** — user taps “Site”, stories, privacy policy → system browser → pandagarde.com (separate site; may use analytics) |

**Store rule of thumb:** If data **never leaves the device** to you or a third party, Google Play Data safety and Apple App Privacy can both be answered **“No data collected”** (developer does not receive user data). User-initiated browser links to the website are **not** in-app collection.

---

## Google Play Console

### App access (reviewers)

Paste from `FAMILYHUB_APP_STORE_COPY.md` § Review notes, or:

```
SIGN-IN: No real account. Tap "Let's go!" on the login screen to open Family Hub.

DATA: Family members (first name + age) and mission progress are stored in on-device storage only. No backend sync in this build.

DATA DELETION: Settings → "Clear all data on this device", or uninstall the app. PandaGarde does not receive user data.

CHILDREN: Parent-guided educational missions (scenarios, games, family discussion). No user-generated social feed, no child-to-child messaging, no ads targeting children.

OPTIONAL: Users may open pandagarde.com in the system browser for stories or Digital Footprint Analysis. That website is separate from the in-app flow.

TEST PATH: Login → Welcome (optional) → Dashboard → Activities → start any mission → complete intro/learn/play → family step → celebration.
```

### Target audience and content

| Question | Recommended answer |
|----------|-------------------|
| **App category** | Education (primary); Parenting (secondary if allowed) |
| **Designed for children?** | **Mixed audience / families** — not a standalone kids-only app. Primary buyer: parents/guardians. Missions are parent-guided. |
| **Ages 5–8 / 9–12 / 13–17 in store targeting** | You may include these in **content** description; for **Target audience** wizard, prefer **not “primarily child-directed”** unless Google requires it for family education apps in your region. If forced to declare under-13: app has **no ads**, **no behavioral tracking**, **no social features** — Families policy compliant. |
| **Ads** | No, app does not contain ads |
| **Contains in-app purchases** | No |

### Data safety form

**Start screen**

| Question | Answer |
|----------|--------|
| Does your app collect or share any of the required user data types? | **No** |
| Is all of the user data collected by your app encrypted in transit? | **N/A** (no user data transmitted off device) |
| Do you provide a way for users to request that their data is deleted? | **Yes** — explain: uninstall app or clear app data / storage in device settings; all data is local |

If Google’s wizard still asks about **on-device** data even when not transmitted, use this fallback (conservative):

| Data type | Collected? | Shared? | Ephemeral? | Required? | Purpose |
|-----------|------------|---------|------------|-----------|---------|
| Name | On device only — **No** (not transmitted) | No | — | Optional | App functionality |
| Other info (age) | On device only — **No** (not transmitted) | No | — | Optional | App functionality |
| App activity (mission progress) | On device only — **No** (not transmitted) | No | — | — | App functionality |

> Prefer the single **“No”** path first. Google’s help text: data only on device and never transmitted off device does not need disclosure.

**Security practices**

| Question | Answer |
|----------|--------|
| Data encrypted in transit | N/A or Yes for HTTPS asset delivery only (not user PII) |
| Users can request deletion | **Yes** — uninstall or clear app storage |
| Committed to Play Families Policy | **Yes** if you declare child appeal; otherwise follow default education path |
| Independent security review | No |

### Content rating (IARC)

Typical honest answers for Family Hub:

| Topic | Answer |
|-------|--------|
| Violence | None |
| Sexual content | None |
| Language | None |
| Controlled substances | None |
| User interaction / communication | **No** user-to-user communication |
| Shares location | No |
| Shares personal info | No (nothing shared with other users) |
| Digital purchases | No |
| **Likely rating** | **Everyone / PEGI 3 / US ESRB Everyone** (confirm after questionnaire) |

---

## Apple App Store Connect

### App Privacy (Nutrition labels)

**Step 1 — Do you or your third-party partners collect data from this app?**

**No** — the developer does not receive data from the app. All family/progress data stays on device.

(If Apple asks about third-party SDKs: Capacitor shell + `@capacitor/browser` only; no analytics SDK in the hub bundle.)

**If the wizard forces detail** (rare for local-only):

| Data type | Collected | Linked to identity | Tracking |
|-----------|-----------|-------------------|----------|
| — | — | — | **No** |

**Tracking:** No — no IDFA, no cross-app tracking, no analytics in app.

### App Review information

Same reviewer notes as Google (above). **Apple Guideline 2.1** requires the full 7-point reply — see [FAMILYHUB_APP_STORE_REVIEW_REPLY.md](./FAMILYHUB_APP_STORE_REVIEW_REPLY.md) and attach a physical-device screen recording.

**Demo account:** Not required — document local login ("Let's go!").

**Pilot premium (not StoreKit):** Settings → Premium → code `FAMILYHUB-PREMIUM` unlocks scenario personalization locally. v1.0.0 has **no in-app purchases**.

### Age rating (App Store)

| Question | Answer |
|----------|--------|
| Cartoon/fantasy violence | None |
| Realistic violence | None |
| Sexual content | None |
| Profanity | None |
| Horror | None |
| Mature/suggestive themes | None |
| Gambling | None |
| Unrestricted web access | **Yes** — user can open pandagarde.com in browser (optional links) |
| User-generated content | No |
| Messaging | No |
| **Made for Kids** (Kids Category) | **No** — list in **Education** or **Lifestyle**; parent-facing family tool, not a kids-category app |

> **Important:** Do **not** opt into the **Kids Category** for Family Hub. Use Education + age rating 4+ / 9+ as questionnaire suggests. Ship **Kids App** separately later if you want Kids Category.

### Privacy Policy URL

`https://www.pandagarde.com/privacy`

---

## Data safety ↔ in-app copy alignment

These in-app statements are **accurate** for the store forms:

- Settings: *“All data is stored locally on your device and is never shared with third parties.”*
- Login: *“Progress saved on this device only”*
- Kids screen: *“Nothing is sent to us; profiles and progress stay on this device.”*

**Do not claim** in store forms: cloud sync, accounts, monitoring, server backup by PandaGarde.

---

## Optional links caveat (both stores)

When the user taps **Site**, **Privacy policy**, or **Read the story**, the app opens **pandagarde.com** in the **system browser**. That website may use analytics and cookies per its own policy. This is:

- **User-initiated**
- **Outside the app**
- **Not** Family Hub collecting or sharing data

If a reviewer asks: *“The in-app experience does not load third-party analytics. Optional web links open the marketing site in Safari/Chrome.”*

---

## Android backup note (internal)

`android:allowBackup="true"` may include app localStorage in the user’s Google account backup. PandaGarde does **not** receive this data. No change required for v1; mention only if legal asks.

---

## Checklist before submit

- [ ] Privacy policy URL loads on mobile
- [ ] Settings → View Privacy Policy opens correct page in browser (standalone build)
- [ ] Data safety / App Privacy answers match **no off-device collection**
- [ ] Screenshots from **device**, not logo placeholders
- [ ] Review notes pasted in both consoles
- [ ] `versionCode` / build number incremented for each upload

---

*Related: [FAMILYHUB_STORE_RELEASE.md](./FAMILYHUB_STORE_RELEASE.md) · [FAMILYHUB_APP_STORE_COPY.md](./FAMILYHUB_APP_STORE_COPY.md)*
