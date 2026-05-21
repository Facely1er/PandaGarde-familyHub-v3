# Interactive story scene images

PNG files here are referenced by `src/data/storyScenes.ts` (`imageUrl: '/images/story/…'`).

Use **hyphenated filenames only** (no spaces or apostrophes). Vite renames legacy names at build time; CI runs `npm run check:story-assets` to ensure every scene file exists and is non-empty.

Restore missing art from git history if needed:

```bash
git checkout 99a69cb -- "public/images/story/05-Po's Den.png" ...
# then copy to 05-Po-Den.png, etc.
```
