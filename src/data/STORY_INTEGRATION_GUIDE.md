# 📖 PandaGarde — Story Integration & Publishing Guide

## Overview

This guide covers two things:
1. **How to integrate stories into the existing codebase** (file structure, routing, components)
2. **How to publish new stories** (the regular publishing workflow)

---

## PART 1 — Integration Into the Project

### Step 1 — Create the stories data layer

Create the file `src/data/stories.ts` (the full file is provided separately as `stories-data.ts`).

This single file is the **entire content backend**. It exports:
- `STORIES` — the master array of all story objects
- `getPublishedStories()` — filters out future-scheduled stories
- `getStoryBySlug(slug)` — for routing
- `getStoriesByAgeGroup(age)` — for age-filtered views
- `getLatestStory()` — highest published continuation (internal / future banners)
- `getHomepageLatestStory()` — homepage spotlight only when `HOMEPAGE_LATEST_STORY_ENABLED` is true
- `getNextScheduledStory()` — for the "Coming Soon" countdown

No database needed. No CMS. Stories live in TypeScript objects — readable, version-controlled, and directly linked to activities.

---

### Step 2 — Add the route in your router

In `src/App.tsx` (or wherever your React Router routes are defined), add:

```tsx
import { StoryListPage } from './pages/StoryListPage';
import { StoryReaderPage } from './pages/StoryReaderPage';

// Inside your <Routes>:
<Route path="/stories" element={<StoryListPage />} />
<Route path="/stories/:slug" element={<StoryReaderPage />} />
```

---

### Step 3 — Create the two pages

**`src/pages/StoryListPage.tsx`** — shows all published stories as cards, with age filter tabs.

```tsx
import { getPublishedStories, getStoriesByAgeGroup, AgeGroup } from '../data/stories';
import { StoryCard } from '../components/stories/StoryCard';
import { useState } from 'react';

export function StoryListPage() {
  const [ageFilter, setAgeFilter] = useState<AgeGroup | 'all'>('all');
  const stories = ageFilter === 'all'
    ? getPublishedStories()
    : getStoriesByAgeGroup(ageFilter);

  return (
    <main>
      <h1>📚 Privacy Panda Stories</h1>

      {/* Age filter tabs */}
      <div className="flex gap-2">
        {(['all', 'early', 'middle', 'older'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setAgeFilter(f)}
            className={ageFilter === f ? 'tab-active' : 'tab'}
          >
            {f === 'all' ? 'All Ages'
              : f === 'early' ? 'Ages 5–7'
              : f === 'middle' ? 'Ages 8–10'
              : 'Ages 11–13'}
          </button>
        ))}
      </div>

      {/* Story grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
    </main>
  );
}
```

**`src/pages/StoryReaderPage.tsx`** — full reading experience with chapter navigation.

```tsx
import { useParams, Navigate } from 'react-router-dom';
import { getStoryBySlug } from '../data/stories';
import { StoryReader } from '../components/stories/StoryReader';

export function StoryReaderPage() {
  const { slug } = useParams<{ slug: string }>();
  const story = slug ? getStoryBySlug(slug) : undefined;

  if (!story) return <Navigate to="/stories" replace />;
  return <StoryReader story={story} />;
}
```

---

### Step 4 — Create the components

Create these files under `src/components/stories/`:

```
src/components/stories/
  StoryCard.tsx        ← Card shown in the list (cover, title, age badge, summary)
  StoryReader.tsx      ← Full reading experience (chapter nav, lesson highlight, activities)
  ActivityCard.tsx     ← Activity display within StoryReader
  StoryProgress.tsx    ← Chapter progress bar (optional, nice for kids)
  ComingSoonBanner.tsx ← Countdown to next scheduled story
```

The `StoryReader.tsx` component structure:

```tsx
import { useState } from 'react';
import { Story } from '../../data/stories';
import { ActivityCard } from './ActivityCard';

export function StoryReader({ story }: { story: Story }) {
  const [currentChapter, setCurrentChapter] = useState(0);
  const chapter = story.chapters[currentChapter];
  const isLastChapter = currentChapter === story.chapters.length - 1;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <span className="text-5xl">{story.coverEmoji}</span>
        <h1 className="text-3xl font-bold mt-2">{story.title}</h1>
        <p className="text-gray-500">Episode {story.episodeNumber} · {story.privacyTopic}</p>
      </div>

      {/* Chapter progress */}
      <div className="flex gap-2 mb-6">
        {story.chapters.map((ch, i) => (
          <button
            key={ch.id}
            onClick={() => setCurrentChapter(i)}
            className={`flex-1 h-2 rounded-full transition-colors ${
              i === currentChapter ? 'bg-green-500' : i < currentChapter ? 'bg-green-200' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Chapter title */}
      <h2 className="text-xl font-semibold mb-4">{chapter.title}</h2>

      {/* Chapter content */}
      <div className="prose prose-lg whitespace-pre-line mb-6">
        {chapter.content}
      </div>

      {/* Lesson highlight */}
      {chapter.lessonHighlight && (
        <blockquote className="border-l-4 border-green-500 pl-4 my-6 text-green-800 font-medium italic">
          💡 {chapter.lessonHighlight}
        </blockquote>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => setCurrentChapter((c) => c - 1)}
          disabled={currentChapter === 0}
          className="btn-secondary"
        >
          ← Previous
        </button>
        {!isLastChapter ? (
          <button onClick={() => setCurrentChapter((c) => c + 1)} className="btn-primary">
            Next →
          </button>
        ) : (
          <div className="text-green-600 font-bold">🎉 The End!</div>
        )}
      </div>

      {/* Key lesson (shown at end) */}
      {isLastChapter && (
        <div className="mt-8 p-4 bg-green-50 rounded-xl border border-green-200">
          <p className="font-semibold text-green-800">🐼 Privacy Panda's Lesson:</p>
          <p className="mt-1 text-green-700">"{story.keyLesson}"</p>
        </div>
      )}

      {/* Activities (shown at end) */}
      {isLastChapter && story.activities.length > 0 && (
        <div className="mt-10">
          <h3 className="text-lg font-bold mb-4">🎮 Activities for this story</h3>
          {story.activities.map((act) => (
            <ActivityCard key={act.id} activity={act} />
          ))}
        </div>
      )}
    </div>
  );
}
```

---

### Step 5 — Add "Stories" to your navigation

In your main nav (wherever your other menu items are):

```tsx
<NavLink to="/stories">📚 Stories</NavLink>
```

And on the homepage, add a "Latest Story" banner using:

```tsx
import { getHomepageLatestStory, getNextScheduledStory } from '../data/stories';

const latest = getHomepageLatestStory();
const coming = getNextScheduledStory();
```

Set `HOMEPAGE_LATEST_STORY_ENABLED = true` in `stories.ts` when ready to show the homepage spotlight card.

---

### Step 6 — Integrate with the existing Interactive Story entry point

The platform already has an "Interactive Story" in the activities section. Connect it:

```
Existing: /activities/story  →  redirect to  →  /stories/privacy-panda-and-the-digital-bamboo-forest
```

This preserves your existing flow while making the story part of the new expandable system.

---

## PART 2 — Regular Story Publishing Workflow

### Publishing Cadence (Recommended)

| Cadence | Best for |
|---|---|
| Monthly | Sustainable solo/small team |
| Bi-weekly | If you have illustration support |
| Quarterly seasons (3–4 stories/season) | Thematic batching |

The Storyline Bible defines **8 planned episodes** beyond the origin story. That gives you roughly **9 months of monthly content** already scoped.

---

### How to Publish a New Story

Publishing a new story is **one file edit** — no CMS, no database migration:

**1. Open `src/data/stories.ts`**

**2. Copy the episode template:**

```typescript
const episodeN: Story = {
  id: 'story-00N',
  slug: 'your-story-slug',
  episodeNumber: N,
  title: 'Story Title',
  theme: 'Privacy Theme',
  privacyTopic: 'Short tag',
  ageGroups: ['early', 'middle'],  // or ['middle', 'older']
  publishedAt: '2024-MM-DD',
  // To schedule in advance, add:
  // scheduledAt: '2024-MM-DD',
  coverEmoji: '🐼',
  coverColor: 'bg-green-100',
  summary: 'One-paragraph summary...',
  characters: ['Po (Privacy Panda)', 'Character Name'],
  keyLesson: 'The one thing children should remember.',
  chapters: [
    {
      id: 'cN-1',
      title: 'Chapter Title',
      content: `Chapter text here...`,
      lessonHighlight: 'Optional pull-quote.',  // shown in a callout box
    },
    // Add more chapters...
  ],
  activities: [
    {
      id: 'aN-1',
      title: 'Activity Name',
      type: 'craft',  // craft | game | discussion | worksheet | role-play
      ageGroups: ['early', 'middle'],
      description: 'What students do...',
      materials: ['Item 1', 'Item 2'],
    },
  ],
};
```

**3. Add it to the registry at the bottom:**

```typescript
export const STORIES: Story[] = [episode1, episode2, episode3, episodeN];
```

**4. Commit and deploy.**

That's it. The story list, reader, and age filters all update automatically.

---

### Scheduling Stories in Advance

To write stories ahead of time but release them on a specific date:

```typescript
publishedAt: '2024-03-01',   // when you wrote it
scheduledAt: '2024-04-15',   // when it goes live
```

`getPublishedStories()` automatically filters out anything with a future `scheduledAt`. The `ComingSoonBanner` component can show a countdown using `getNextScheduledStory()`.

---

### Story Quality Checklist (before publishing)

Before adding a story to the registry, verify:

- [ ] Story follows the 3-act template: Calm → Ripple → Learning → Choice → Closing Wisdom
- [ ] The core lesson appears once as `lessonHighlight` in a chapter AND once as `keyLesson`
- [ ] Characters are from the canon roster (Storyline Bible)
- [ ] At least one activity is included with `ageGroups` set correctly
- [ ] `slug` is URL-safe (lowercase, hyphens only)
- [ ] `coverEmoji` is set (used as fallback before illustrations are added)
- [ ] `ageGroups` is accurate — don't mark `older` unless content is appropriate for 11–13

---

### Future Enhancement: Adding Illustrations

When you have illustrations ready:

1. Place images in `public/stories/{slug}/cover.webp` and `public/stories/{slug}/ch{N}.webp`
2. Add an `illustration` field to the Story and StoryChapter types:

```typescript
// In Story type:
coverIllustration?: string;  // '/stories/story-slug/cover.webp'

// In StoryChapter type:
illustration?: string;       // '/stories/story-slug/ch1.webp'
```

The `StoryCard` and `StoryReader` components will use `coverIllustration ?? coverEmoji` as a graceful fallback — so the system works now with emojis and upgrades cleanly when art arrives.

---

### Future Enhancement: Audio Narration

Add per-chapter audio:

```typescript
// In StoryChapter type:
audioUrl?: string;  // '/stories/story-slug/ch1.mp3'
```

The StoryReader can show a play button when `audioUrl` is present. This is especially valuable for the `early` (ages 5–7) audience.

---

## File Map Summary

```
src/
├── data/
│   └── stories.ts              ← ALL story content lives here
├── pages/
│   ├── StoryListPage.tsx       ← /stories route
│   └── StoryReaderPage.tsx     ← /stories/:slug route
└── components/
    └── stories/
        ├── StoryCard.tsx
        ├── StoryReader.tsx
        ├── ActivityCard.tsx
        ├── StoryProgress.tsx
        └── ComingSoonBanner.tsx
```

---

*Keep stories.ts in version control. Each commit is a publishing record with a timestamp. No CMS admin panel needed at this stage.*
