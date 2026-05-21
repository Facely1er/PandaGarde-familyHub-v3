# Family Hub — engaging UI for app stores

**Audience:** Parents + children ages 5–17  
**Platforms:** iOS / Android (Capacitor), hub.pandagarde.com PWA

## Design principles

1. **Warm, not corporate** — teal/amber gradients, Privacy Panda mascot, age-band emojis (🐼 🕵️ 🌐).
2. **Short labels on mobile** — bottom nav: Home · Family · Missions · Rewards · Settings (full names in `aria-label`).
3. **Real life first** — every mission surfaces “Real-life situation” before play.
4. **Age paths** — three scrollable adventure cards on login, welcome, dashboard, and missions.

## Key screens for store screenshots

Capture on **`npm run build:familyhub`** + device or `npm run preview:familyhub`:

| # | Screen | Why |
|---|--------|-----|
| 1 | Login | Age bands + “Let’s go!” — first impression |
| 2 | Home / Dashboard | Hero + Today’s mission card |
| 3 | Missions catalogue | Hero + age strip + activity card with real-life situation |
| 4 | Mission “Talk together” | Amber scenario + family prompt + discussion starters |
| 5 | Mission complete | “Try this at home” + streak |
| 6 | Family members | Age emoji avatars + mission link per child |
| 7 | Rewards / Progress | Hero + completion % + badges |

## Shared components

| File | Role |
|------|------|
| `src/familyhub/hubAgeBands.ts` | Age visuals & copy |
| `src/familyhub/components/HubScreenHero.tsx` | Gradient header + panda |
| `src/familyhub/components/AgeBandStrip.tsx` | Three age path cards |
| `src/index.css` `.family-hub-theme` | Motion tokens (`hub-mascot-float`, `hub-card-lift`) |

## Build & ship

```bash
npm run build:familyhub
npx cap sync
npx cap open android   # or ios on Mac
```

See [FAMILYHUB_STORE_RELEASE.md](./FAMILYHUB_STORE_RELEASE.md) and [FAMILYHUB_APP_STORE_COPY.md](./FAMILYHUB_APP_STORE_COPY.md).
