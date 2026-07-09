# Store marketing assets

## Icons & feature graphic (generated)

Regenerate from `assets/icon.png`:

```bash
npm run assets:store
```

| File | Size | Use |
|------|------|-----|
| `play-store-icon-512.png` | 512×512 | Google Play → Store listing → App icon |
| `play-feature-graphic-1024x500.png` | 1024×500 | Google Play → Feature graphic |
| `apple-app-store-icon-1024.png` | 1024×1024 | App Store Connect → App icon (if not using Xcode catalog) |

## App Store screenshots (generated)

Capture **iPhone 6.5"** (1284×2778) and **iPad 13"** (2064×2752) sets from the standalone Family Hub build:

```bash
npm run assets:screenshots:build
```

Output:

| Folder | Device class in App Store Connect | Size |
|--------|-----------------------------------|------|
| `app-store/iphone-6.5/` | iPhone 6.5" Display | 1284×2778 |
| `app-store/ipad-13/` | iPad 13" Display | 2064×2752 |

Each folder contains 7 PNGs at **exact App Store dimensions**, composited **inside a device bezel** (rounded screen + Dynamic Island / iPad camera bar) on a soft teal marketing background.

| Folder | Device class | Output size | Screen capture |
|--------|--------------|-------------|----------------|
| `iphone-6.5/` | iPhone 6.5" Display | **1284×2778** | 1152×2496 inside frame |
| `ipad-13/` | iPad 13" Display | **2064×2752** | 1840×2528 inside frame |

Raw full-bleed captures (no bezel) are saved to `_raw/{device}/` for reference.

Screens:

1. `01-login.png` — Login + age bands  
2. `02-dashboard.png` — Today's mission (tour dismissed)  
3. `03-activities.png` — Mission catalog  
4. `04-mission-intro.png` — Scenario + family talk prompts  
5. `05-journey.png` — Progress & badges  
6. `06-kids.png` — Family members (sample data)  
7. `07-settings.png` — Privacy & support links  

Options:

```bash
npm run assets:screenshots -- --no-frame   # full-bleed only (still exact output size)
```

**Legacy captures** (older emulator sizes) remain in `ios-screenshots/` for reference.

For Google Play phone screenshots, reuse the `iphone-6.5` set or capture from an Android emulator (see `docs/FAMILYHUB_STORE_SUBMIT_CHECKLIST.md`).
