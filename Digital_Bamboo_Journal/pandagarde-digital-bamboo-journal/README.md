# PandaGarde Digital Bamboo Journal

Standalone static HTML blog/magazine project for PandaGarde.

## Deploy on Netlify (journal.pandagarde.com)

From the **PandaGarde-familyHub-v3** repo root, point Netlify at this subfolder:

| Setting | Value |
|--------|--------|
| Base directory | `Digital_Bamboo_Journal/pandagarde-digital-bamboo-journal` |
| Build command | *(empty)* |
| Publish directory | `.` |
| Custom domain | `journal.pandagarde.com` |

This site does not run `npm run build` from the main app. The React/Vite app at www and hub is unchanged.

Alternatively: drag this folder into Netlify Drop.

## Local preview

```bash
python -m http.server 8080
```

Open `http://localhost:8080`.

## Verification

Run:

```bash
python verify_links.py
python sync_layout.py   # re-apply shared header nav + footer to every HTML page
```


## PandaGarde Visual Alignment

This standalone journal site is visually aligned to the PandaGarde FamilyHub brand while remaining independently deployable as static HTML. The shared brand asset is `assets/LogoPandagarde.png`, copied from the PandaGarde project. The CSS design tokens now use the PandaGarde green palette: `#1B5E20`, `#2E7D32`, `#0D4A0F`, `#66BB6A`, and `#81C784`.
