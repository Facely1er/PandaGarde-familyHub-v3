# Family Hub Premium — one-time IAP checklist (v1.1+)

Track **Premium mission personalization** billing for the **next** store release after v1.0.0 review.

**v1.0.0 (in review):** no IAP — pilot unlock codes only. Do not add billing to the binary under review.

**Related docs:** [CONTENT_TRUTH.md](./CONTENT_TRUTH.md) §8 · [FAMILYHUB_MISSIONS_PARENT_GUIDE.md](./FAMILYHUB_MISSIONS_PARENT_GUIDE.md) · [FAMILYHUB_STORE_PRIVACY_FORMS.md](./FAMILYHUB_STORE_PRIVACY_FORMS.md) · [FAMILYHUB_STORE_SUBMIT_CHECKLIST.md](./FAMILYHUB_STORE_SUBMIT_CHECKLIST.md)

---

## Product model (locked for v1.1)

| Layer | Free | Premium (one-time unlock) |
|-------|------|---------------------------|
| 18 missions, games, family prompts | ✅ | ✅ |
| Digital Footprint Analysis (website) | ✅ | ✅ |
| Baseline real-life scenarios | ✅ | ✅ |
| **Customize** — app, child name, frequency, custom text | — | ✅ |
| DFA catalog → scenario app names | — | ✅ |
| Billing | — | **Non-consumable IAP** (~$9.99) — **not** a subscription |

**Rationale:** Premium unlocks a static on-device feature. No ongoing service (new missions, cloud sync, live catalog) → no monthly fee.

**Identifiers (pick before store setup — do not change after first upload):**

| Field | Value |
|-------|--------|
| Product ID | `com.pandagarde.familyhub.premium_unlock` |
| Display name | Premium Mission Personalization |
| Price (target) | ~$9.99 one-time |
| Code constant | `PREMIUM_PRICING_LABEL` in `src/lib/premiumEntitlement.ts` |

---

## Scope by surface

| Surface | v1.0.0 | v1.1+ |
|---------|--------|-------|
| iOS / Android app | Pilot codes | Pilot codes **+** store purchase + restore |
| Web / PWA Hub (`hub.pandagarde.com`) | Pilot codes | Pilot codes only (unless Stripe added later) |

---

## Already built (do not rebuild)

- [x] Scenario engine — `src/lib/personalizeActivity.ts`
- [x] Parent Customize UI — `src/familyhub/components/MissionScenarioCustomize.tsx`
- [x] Entitlement flag — `src/lib/premiumEntitlement.ts` (`source: 'purchase'` type exists)
- [x] Mission card + intro personalized display — `ActivitiesScreen.tsx`, `MissionShell.tsx`
- [x] Settings pilot unlock — `SettingsScreen.tsx`
- [x] i18n (en / es / fr) — one-time wording in `src/i18n/hub/*.json`
- [x] Marketing copy — `ForFamiliesPage.tsx`, `CONTENT_TRUTH.md` §8
- [x] Unit tests — `src/lib/personalizeActivity.test.ts`

---

## Phase 1 — Store product setup

Do this **before** coding so product IDs match native config.

### Apple App Store Connect

- [ ] **Paid Apps Agreement** + banking/tax complete
- [ ] Create IAP: **Non-Consumable** (not Auto-Renewable Subscription)
- [ ] Product ID: `com.pandagarde.familyhub.premium_unlock`
- [ ] Localized display name + description (see [Store copy](#store-copy-both-platforms) below)
- [ ] Price tier ≈ $9.99
- [ ] Review screenshot: Settings → Premium + mission Customize panel
- [ ] Sandbox tester account created
- [ ] IAP marked **Ready to Submit** with app version binary

### Google Play Console

- [ ] **Monetize → Products → In-app products** (one-time, not subscription)
- [ ] Same product ID: `com.pandagarde.familyhub.premium_unlock`
- [ ] Title, description, price ≈ $9.99
- [ ] Product **Active**
- [ ] License testers added (Gmail accounts)
- [ ] Build uploaded to **internal testing** before purchase testing

### Store copy (both platforms)

**Title:** Unlock Premium missions (one-time)

**Description:**

> Personalize real-life scenarios with your child's apps, names, and situations. All 18 missions stay free; this one-time unlock enables the Customize panel on this device. Footprint review on the website stays free. No subscription.

---

## Phase 2 — Code implementation

No IAP plugin is in `package.json` today. Choose one:

| Option | When to use |
|--------|-------------|
| Capacitor IAP plugin (e.g. `@capgo/native-purchases`) | Single SKU, local-first — **recommended** |
| RevenueCat (`@revenuecat/purchases-capacitor`) | If you want hosted receipt/restore helpers |

### New: `src/lib/premiumBilling.ts`

- [ ] `PREMIUM_PRODUCT_ID = 'com.pandagarde.familyhub.premium_unlock'`
- [ ] `isBillingAvailable()` — `Capacitor.isNativePlatform()` only
- [ ] `getPremiumProduct()` — localized price from store (fallback: `PREMIUM_PRICING_LABEL`)
- [ ] `purchasePremium()` — store flow → on success call entitlement save
- [ ] `restorePremiumPurchases()` — query owned non-consumables → re-enable entitlement
- [ ] Persist `purchaseTransactionId` (or equivalent) on `PremiumEntitlement` for support/debug
- [ ] Web/PWA: no-op or “available in the app” message

### Extend: `src/lib/premiumEntitlement.ts`

- [ ] `unlockPremiumFromPurchase(transactionId: string)`
- [ ] Optional `purchaseTransactionId?: string` on `PremiumEntitlement`
- [ ] Keep pilot codes (`PANDA-PILOT-2026`, `FAMILYHUB-PREMIUM`) for reviewers/partners

### Update: `src/familyhub/screens/SettingsScreen.tsx`

- [ ] Native + not premium: **Unlock Premium — {price}** button
- [ ] **Restore purchases** link (Apple requirement)
- [ ] Loading / cancelled / error states
- [ ] Keep pilot code field (collapse: “Have a pilot code?”)
- [ ] When `source === 'purchase'`: hide or rename **Sign out of Premium** — paid users restore, not wipe
- [ ] When `source === 'pilot-code'`: keep clear/sign-out for local pilot testing

### i18n keys to add (`en.json`, `es.json`, `fr.json`)

- [ ] `hub.settings.premiumPurchase`
- [ ] `hub.settings.premiumRestore`
- [ ] `hub.settings.premiumPurchasing`
- [ ] `hub.settings.premiumPurchaseFailed`
- [ ] `hub.settings.premiumRestored`
- [ ] `hub.settings.premiumBillingUnavailable`

### Native / Capacitor

- [ ] Install IAP plugin + `npx cap sync`
- [ ] iOS: **In-App Purchase** capability in Xcode
- [ ] Android: Play Billing (plugin usually configures)
- [ ] Test on **internal track** (Play) and **Sandbox** (Apple) — not production until v1.1 submit

### Explicitly out of scope for v1.1

- Subscription renewal / webhooks
- Backend receipt validation server (optional later)
- Cloud sync of personalization across devices
- Changes to `resolveMissionScenario()` logic

---

## Phase 3 — Legal & website

- [ ] **Privacy policy** — purchases processed by Apple/Google; no card data to PandaGarde; unlock state on device
- [ ] **Terms** — one-time unlock; refunds per store policy; feature is device-local
- [ ] **For Families page** — change “app stores soon” → live when v1.1 ships
- [ ] Optional: FAQ section or `/family-hub` anchor explaining free vs Premium

---

## Phase 4 — Store listing updates (v1.1 submit)

| File / surface | Change |
|----------------|--------|
| `docs/FAMILYHUB_STORE_PRIVACY_FORMS.md` | In-app purchases: **Yes** (non-consumable) |
| `docs/FAMILYHUB_STORE_SUBMIT_CHECKLIST.md` | IAP = Yes; review notes mention Premium |
| `src/pages/AppStoreReviewPage.tsx` | Update if it still says “No in-app purchases” |
| `src/pages/AppFeaturesPage.tsx` | Same |
| App Store / Play descriptions | Optional one-time Premium unlock |
| Play Data safety | Re-run wizard — likely still **no data collected by developer** if only local unlock flag |

### Review notes (paste into both stores)

```
PREMIUM (optional): Settings → Premium missions → one-time in-app purchase unlocks scenario customization. All missions remain free without purchase.

SANDBOX: [Apple sandbox tester email] / [Play license tester Gmail]

RESTORE: Settings → Restore purchases.

TEST PATH: Login → Settings → Premium (or open mission → Customize after unlock) → Activities → start mission → intro shows personalized scenario.
```

---

## Phase 5 — Screenshots (optional)

- [ ] Settings with Premium section visible
- [ ] Mission intro with Customize expanded + personalized scenario
- [ ] Regenerate store assets if captions mention Premium (`npm run assets:screenshots:*`)

---

## Phase 6 — Testing matrix

| Case | Expected |
|------|----------|
| Free user, no purchase | Baseline scenarios + Premium hint |
| Pilot code | Customize works (`source: pilot-code`) |
| Purchase success | Customize works (`source: purchase`) |
| Purchase cancelled | No entitlement change |
| Restore after reinstall | Premium returns without repaying |
| Restore, never purchased | Clear message, no crash |
| Web Hub | No buy button; pilot code works |
| Customize + save | Scenario on mission card + intro |
| Pilot clear premium | Works for pilot only |

```bash
npm run test:run -- src/lib/personalizeActivity.test.ts
# Add unit tests for premiumBilling (mocked store)
npm run android:debug          # Play internal testing
# iOS: TestFlight + Sandbox Apple ID
```

---

## Phase 7 — Release (v1.1.0)

```bash
npm run mobile:bump            # → 1.1.0
npm run test:run
npm run build:familyhub
npm run mobile:prepare
npm run android:bundleRelease  # Android AAB
npm run cap:ios                # Xcode archive → App Store Connect
```

- [ ] Version **1.1.0** (or **1.0.1** if you prefer patch semantics)
- [ ] IAP products submitted **with** the binary (Apple requires linked IAP on version)
- [ ] Release notes: *“Optional Premium unlock: personalize mission scenarios with your family’s apps (one-time purchase). All missions still free.”*
- [ ] Play: staged rollout 10% → monitor → 100%
- [ ] Tag: `git tag familyhub-v1.1.0`

---

## Open decisions (resolve before Phase 2)

| # | Decision | Default |
|---|----------|---------|
| 1 | Final price | $9.99 |
| 2 | Product ID | `com.pandagarde.familyhub.premium_unlock` |
| 3 | Web purchases | Pilot codes only (no Stripe in v1.1) |
| 4 | Pilot codes after IAP | Keep for reviewers/partners |
| 5 | IAP plugin | Capacitor native plugin (not RevenueCat unless needed) |

---

## Implementation order

1. Store products created (Apple + Google)
2. IAP plugin + `premiumBilling.ts`
3. Settings: Buy + Restore UI
4. Internal track / Sandbox testing
5. Legal + store form updates
6. Submit v1.1

---

*Code anchors: `src/lib/premiumEntitlement.ts` · `src/familyhub/screens/SettingsScreen.tsx` · `src/lib/personalizeActivity.ts`*
