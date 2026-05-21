# Story cover assets

| File | Use |
|------|-----|
| `episode-1-hero-source.png` | Full Episode 1 illustration (1024×576). Source for `episode-1-cover.webp`. |
| `story-covers-master.png` | Three stacked episode banners; used for episodes 2–3 only. |
| `episode-*-cover.webp` | Bundled card/hero covers (imported in `src/data/storyCoverAssets.ts`). |

Regenerate WebP covers after updating sources:

```bash
npm run assets:story-covers
```

Episode 1 hero thumbnail on `/stories` uses `coverHeroImagePosition` in `src/data/stories.ts` (default `32% center` for panda + turtle in the narrow hero frame).
