# Capacitor asset sources

Regenerate Android/iOS launcher icons and splash screens from the PandaGarde logo:

```bash
# After updating icon.png or splash.png:
npm run assets:generate
npm run cap:sync
```

## Source files

| File | Purpose |
|------|---------|
| `icon.png` | App icon (from `public/LogoPandagarde.png`) |
| `splash.png` | Splash screen center artwork |

For best results, replace `icon.png` with a **1024×1024** PNG with safe padding (logo centered, transparent or solid background).

Optional: add `icon-foreground.png` + `icon-background.png` for adaptive icons with a flat teal backdrop (`#f0fdfa`).
