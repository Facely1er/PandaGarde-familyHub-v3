# PandaGarde Digital Bamboo Journal

Standalone static HTML blog/magazine project for PandaGarde.

## Deploy on Netlify

1. Drag this folder into Netlify Drop, or connect it as a repository.
2. Build command: none.
3. Publish directory: `.`

## Local preview

```bash
python -m http.server 8080
```

Open `http://localhost:8080`.

## Verification

Run:

```bash
python verify_links.py
```


## PandaGarde Visual Alignment

This standalone journal site is visually aligned to the PandaGarde FamilyHub brand while remaining independently deployable as static HTML. The shared brand asset is `assets/LogoPandagarde.png`, copied from the PandaGarde project. The CSS design tokens now use the PandaGarde green palette: `#1B5E20`, `#2E7D32`, `#0D4A0F`, `#66BB6A`, and `#81C784`.
