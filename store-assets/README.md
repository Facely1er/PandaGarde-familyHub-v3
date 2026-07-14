# Store marketing assets

## Icons & feature graphic (generated)

```bash
npm run assets:store
```

| File | Size | Use |
|------|------|-----|
| `play-store-icon-512.png` | 512×512 | Google Play app icon |
| `play-feature-graphic-1024x500.png` | 1024×500 | Google Play feature graphic |
| `apple-app-store-icon-1024.png` | 1024×1024 | App Store Connect app icon |

## App Store screenshots (generated)

**Recommended for App Store (Apple) — Xcode Simulator native Capacitor app only:**

```bash
npm run assets:screenshots:ios
```

Rebuilds the native Simulator `.app` and captures from **installed Capacitor shell** (not browser preview). Use `npm run assets:screenshots:ios:fast` only when re-shooting with an already-fresh native build.

**Do not use `npm run assets:screenshots:build` for Apple listings** — that path uses Playwright browser preview (website bundle), not the native iOS shell.

Uses simulators **SC-Store-iPhone-6.5** and **iPad Pro 13-inch (M5)**. Output PNGs are composited **inside a device bezel** with marketing headlines on a soft teal gradient at exact App Store dimensions. Raw simulator captures are kept in `_raw/`.

Re-frame existing raw captures without re-running the simulator:

```bash
npm run assets:screenshots:ios:frame
```

**Alternative — Playwright preview (browser):**

```bash
npm run assets:screenshots:build
```

| Folder | App Store Connect slot | Size |
|--------|------------------------|------|
| `app-store/iphone-6.5/` | iPhone 6.5" Display | **1284×2778** |
| `app-store/ipad-13/` | iPad 13" Display | **2064×2752** |

Each set has 7 screens: login, dashboard, activities, mission intro, journey, kids, settings.

Captures use the standalone Family Hub bundle with Capacitor-style safe areas and sample family/progress data so screens look populated.

Legacy emulator captures: `ios-screenshots/`.
