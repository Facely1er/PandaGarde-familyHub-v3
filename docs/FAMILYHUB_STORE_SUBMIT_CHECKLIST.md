# Family Hub v1.0.0 — Store submit checklist (Play + Apple)

One document to complete **Google Play** and **Apple App Store** listings for **PandaGarde Family Hub**.

**Identifiers (do not change after first upload):**

| Field | Value |
|-------|--------|
| App name | PandaGarde Family Hub |
| Bundle / package ID | `com.pandagarde.familyhub` |
| Version | 1.0.0 (Android `versionCode` 1 · iOS build 1) |
| Privacy policy | `https://www.pandagarde.com/privacy` |
| Support | `support@pandagarde.com` |
| Website | `https://www.pandagarde.com` |

**Related docs:** [FAMILYHUB_PLAY_STORE.md](./FAMILYHUB_PLAY_STORE.md) (Play walkthrough) · [FAMILYHUB_APP_STORE_COPY.md](./FAMILYHUB_APP_STORE_COPY.md) · [FAMILYHUB_STORE_PRIVACY_FORMS.md](./FAMILYHUB_STORE_PRIVACY_FORMS.md) · [FAMILYHUB_STORE_RELEASE.md](./FAMILYHUB_STORE_RELEASE.md) · [FAMILYHUB_PREMIUM_IAP_CHECKLIST.md](./FAMILYHUB_PREMIUM_IAP_CHECKLIST.md) (v1.1+ one-time IAP) · [FAMILYHUB_APP_STORE_REVIEW_REPLY.md](./FAMILYHUB_APP_STORE_REVIEW_REPLY.md)

---

## Phase 0 — Build the release (before any console work)

```bash
npm run test:run
npm run build:familyhub
npm run mobile:prepare          # build + cap sync
npm run assets:store            # 512 icon + 1024×500 feature graphic → store-assets/
```

**Android signing (one-time):**

```bash
# Requires JDK keytool (Android Studio JBR works):
#   $env:JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"
npm run android:keystore        # creates android/pandagarde-familyhub-upload.jks + keystore.properties
npm run android:bundleRelease   # → android/app/build/outputs/bundle/release/app-release.aab
```

Back up `android/pandagarde-familyhub-upload.jks` and passwords offline — losing them blocks all future Play updates.

**Manual keystore alternative** (if script fails):

```powershell
cd android
keytool -genkey -v -keystore pandagarde-familyhub-upload.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
# Then copy android/keystore.properties.example → keystore.properties and fill in passwords
```

**iOS** (Mac required):

```bash
npm run cap:ios
# Xcode → Archive → Distribute to App Store Connect
```

**Tag release (recommended):**

```bash
git tag familyhub-v1.0.0
git push origin familyhub-v1.0.0
```

- [ ] Tests pass · hub build succeeds · cap sync clean
- [ ] Signed AAB or IPA ready
- [ ] Keystore backed up securely (Android)
- [ ] Same git commit tagged for web + stores

---

## Phase 1 — Screenshots (capture before listing)

Use a **real device or emulator** with the **standalone** build (`npm run android:debug` or TestFlight).  
**Do not** use logo-only images — stores reject them.

| # | Screen to open | Caption (overlay text optional) | Play | Apple |
|---|----------------|----------------------------------|------|-------|
| 1 | Login → tap **Let's go!** | Family privacy missions for ages 5–17 | Phone | 6.7" iPhone required |
| 2 | Dashboard (today's mission visible) | Daily privacy missions for the whole family | Phone | 6.7" + optional iPad |
| 3 | Activities (age filters visible) | 18 missions · Ages 5–17 | Phone | Phone |
| 4 | Mission intro (scenario + guide) | Real situations, not abstract rules | Phone | Phone |
| 5 | In-mission game or learn step | Play and learn together | Phone | Phone |
| 6 | Family talk step in mission | Talk it through at home | Phone | Phone |
| 7 | Journey / Progress (forest friends) | Track progress & celebrate | Phone | Phone |
| 8 | Kids screen (member list) | Add each child — name and age only | Phone | Phone |
| 9 | Settings → Privacy section | Your data stays on your device | Phone | Optional |

**Minimum:** 4 screenshots (Play) · 3+ per device size (Apple).  
**Aspect:** Play phone 16:9 or 9:16 · Apple **iPhone 6.5"** 1284×2778 · **iPad 13"** 2064×2752 (portrait).

**Generate App Store sets (recommended):**

```bash
npm run assets:screenshots:build
# → store-assets/app-store/iphone-6.5/*.png
# → store-assets/app-store/ipad-13/*.png
```

**How to capture manually** (alternative):

```bash
npm run android:debug
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
# Or: npm run cap:android → Run in Android Studio
```

- [ ] 5–8 phone screenshots captured
- [ ] No placeholder logos as screenshots
- [ ] Light mode (add 1–2 dark mode if you want polish)

---

## Phase 2 — Google Play Console

Create app → package name **`com.pandagarde.familyhub`** → upload AAB to **Internal testing** first.

### Store listing → Main store listing

| Field | Paste |
|-------|--------|
| **App name** | `PandaGarde Family Hub` |
| **Short description** (80 chars) | `18 family privacy missions, ages 5 to 17. Practice, talk, fix — device only.` |
| **Full description** | See [Full description](#full-description-both-stores) below |
| **App icon** | 512×512 PNG → `store-assets/play-store-icon-512.png` (`npm run assets:store`) |
| **Feature graphic** | 1024×500 → `store-assets/play-feature-graphic-1024x500.png` |
| **Screenshots** | Upload Phase 1 set |
| **Category** | Education (primary) |
| **Tags** | Family, Parenting, Education, Privacy (as available) |
| **Contact email** | `support@pandagarde.com` |
| **Privacy policy URL** | `https://www.pandagarde.com/privacy` |
| **Website** | `https://www.pandagarde.com` |

### Store settings

| Field | Value |
|-------|--------|
| App access | All functionality available without special access |
| Ads | No |
| In-app purchases | No |
| Target audience | Families / mixed; parent-guided (see privacy doc if under-13 questions appear) |
| Content rating | Complete IARC → expect Everyone |
| Data safety | **No data collected** — see [FAMILYHUB_STORE_PRIVACY_FORMS.md](./FAMILYHUB_STORE_PRIVACY_FORMS.md) |
| News app / COVID / government | No |

### App content → App access (review instructions)

```
SIGN-IN: No real account. Tap "Let's go!" on the login screen to open Family Hub.

DATA: Family members (first name + age) and mission progress are stored in on-device storage only. No backend sync in this build.

DATA DELETION: Settings → "Clear all data on this device", or uninstall the app.

CHILDREN: Parent-guided educational missions. No social feed, no child-to-child messaging, no ads targeting children.

OPTIONAL: Users may open pandagarde.com in the system browser for stories or Digital Footprint Analysis.

TEST PATH: Login → Welcome (optional) → Dashboard → Activities → start any mission → complete intro/learn/play → family step → celebration.
```

### Release → Internal testing → Create release

- [ ] Upload `app-release.aab`
- [ ] Release name: `1.0.0 (1)` — first public release
- [ ] Release notes: see [What's New](#whats-new-v100) below
- [ ] Add testers → install → smoke test
- [ ] Promote to **Closed testing** → then **Production** with **staged rollout 10%**

**Play checklist**

- [ ] Store listing complete
- [ ] Data safety submitted
- [ ] Content rating certificate attached
- [ ] Privacy policy URL loads on phone
- [ ] Internal test install works
- [ ] Review instructions pasted

---

## Phase 3 — Apple App Store Connect

Create app → bundle ID **`com.pandagarde.familyhub`** → platform iOS.

### App Information

| Field | Value |
|-------|--------|
| Name | PandaGarde Family Hub |
| Subtitle (30 chars) | `Family privacy missions` |
| Primary category | Education |
| Secondary category | Lifestyle or Parenting |
| Privacy policy URL | `https://www.pandagarde.com/privacy` |
| Content rights | Does not contain third-party content requiring attribution |

### Pricing and availability

| Field | Value |
|-------|--------|
| Price | Free |
| Availability | All territories (or your chosen list) |

### App Privacy

| Question | Answer |
|----------|--------|
| Collect data? | **No** |
| Tracking | **No** |

(Full detail: [FAMILYHUB_STORE_PRIVACY_FORMS.md](./FAMILYHUB_STORE_PRIVACY_FORMS.md))

### Version 1.0.0 — Prepare for Submission

| Field | Paste |
|-------|--------|
| **Promotional text** (170 chars, optional) | `18 short privacy missions for ages 5–17—games, family talk, and one real fix per mission. Works alone or after PandaGarde's footprint check. All progress stays on your device.` |
| **Description** | [Full description](#full-description-both-stores) below |
| **Keywords** (100 chars) | `privacy,family,parenting,children,security,password,phishing,social media,digital footprint,education` |
| **Support URL** | `https://www.pandagarde.com/contact` or support page |
| **Marketing URL** | `https://www.pandagarde.com` |
| **What's New** | [What's New](#whats-new-v100) below |
| **Screenshots** | Phase 1 set per device size |
| **Build** | Select uploaded IPA from Xcode / Transporter |

### Age rating

- Answer questionnaire honestly (no violence, no UGC, no messaging)
- **Unrestricted web access:** Yes (optional links to pandagarde.com)
- **Made for Kids / Kids Category:** **No**

### App Review Information

| Field | Value |
|-------|--------|
| Sign-in required? | **No** |
| Demo account | Leave blank — local “Let’s go!” only |
| Notes | Full 7-point reply in [FAMILYHUB_APP_STORE_REVIEW_REPLY.md](./FAMILYHUB_APP_STORE_REVIEW_REPLY.md) |
| Attachment | **Physical-device screen recording** (required for Apple 2.1) |
| Contact | Your name, phone, email |

**Apple Guideline 2.1 reply must include all seven items** (recording, devices tested, purpose, setup, external services, regions, regulated industry). Paste the block from `FAMILYHUB_APP_STORE_REVIEW_REPLY.md` — the short Google Play notes are not enough for Apple.

**Screen recording must show:** cold launch → Let’s go! → mission flow → add family member → Settings → **Clear all data on this device** → back to login.

### TestFlight (recommended before public)

- [ ] Upload build → Internal testing group
- [ ] Smoke test on physical iPhone
- [ ] Submit for App Review

**Apple checklist**

- [ ] Metadata + screenshots complete
- [ ] App Privacy = No data collected
- [ ] Age rating done
- [ ] Build selected
- [ ] Review notes pasted
- [ ] TestFlight smoke passed

---

## Copy blocks (paste into both stores)

### Full description (both stores)

```
PandaGarde Family Hub is your family's privacy practice space—not another lecture, and not kids playing alone.

Turn everyday online moments into short missions you do together: game sign-ups that ask too much, scam messages promising free Robux, first social accounts, screenshot drama in group chats, weak passwords, job and college name searches, data-broker listings, school apps that want student data, and homework pasted into AI tools.

What you get

• 18 age-matched missions for ages 5–8, 9–12, and 13–17
• Real situations — each mission starts with a scenario your family actually faces
• Play or learn — sorting games, mazes, phishing practice, privacy settings simulators, social media scenarios, and more
• Family conversation — built-in prompts so parents and kids agree on rules
• One real action — finish with something you do on a real app or account
• Progress at home — completions, streaks, and certificates; all data stays on your device
• Works two ways — use Family Hub on its own, or continue after PandaGarde's Digital Footprint Analysis on the website

Who it's for

Parents and guardians who want practical, repeatable privacy habits—not one-time "internet safety" talks. Missions are parent-guided; there is no open social network for children.

Privacy

• No server account required
• Family and progress data stored locally on your device
• Optional link to the full PandaGarde website for assessment and resources

From the makers of PandaGarde

Family Hub is the "act on your plan" step: the website helps you see your family's digital exposure; Family Hub helps you practice and follow through together.
```

### What's New (v1.0.0)

```
Welcome to PandaGarde Family Hub! 18 privacy missions for ages 5–17, family discussion prompts, progress tracking, and certificates—all stored on your device. Works standalone or after the PandaGarde website assessment.
```

---

## Phase 4 — After approval

| Step | Action |
|------|--------|
| Web sync | `npm run deploy:netlify:familyhub` (same commit as store build) |
| Play rollout | Staged 10% → 50% → 100% over a few days |
| Apple | Release manually or automatic after approval |
| Monitor | Support inbox + store reviews first 48h |
| Next upload | `npm run mobile:bump:build` → increment `versionCode` / iOS build only |

---

## Quick reference — what NOT to claim in listings

Per [CONTENT_TRUTH.md](./CONTENT_TRUTH.md):

- ❌ Child device monitoring or live tracking
- ❌ Cloud account / multi-device sync
- ❌ Social network to connect with other families
- ❌ "Join Family Hub" (use **Open Family Hub**)
- ❌ Stories included in-app (optional link to website only)
- ❌ HIPAA-compliant / certifies compliance

---

## Master checkbox (print or duplicate in issue tracker)

```
PRE-BUILD
[ ] npm run test:run
[ ] npm run build:familyhub && cap sync
[ ] Signed AAB / IPA
[ ] Keystore backed up (Android)

ASSETS
[ ] 5–8 real device screenshots
[ ] 512×512 icon · 1024×500 feature graphic (Play)

GOOGLE PLAY
[ ] App created · package com.pandagarde.familyhub
[ ] Listing copy pasted
[ ] Data safety: No data collected
[ ] Content rating · privacy URL
[ ] Review notes · internal test passed
[ ] Production staged rollout

APPLE
[ ] App created · bundle com.pandagarde.familyhub
[ ] Metadata · keywords · subtitle
[ ] App Privacy: No data collected
[ ] Screenshots · TestFlight smoke
[ ] Submitted for review

POST-LAUNCH
[ ] hub.pandagarde.com deployed (same commit)
[ ] git tag familyhub-v1.0.0 pushed
```

---

*Last updated for v1.0.0 store readiness — July 2026*
