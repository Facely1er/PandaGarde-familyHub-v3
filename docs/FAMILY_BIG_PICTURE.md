# Family big picture — plain words first

Route: `/big-picture` (legacy `/family-snapshot`, `/snapshot` redirect). Header nav: **Big picture**.

## Principles

1. **Doesn't compete with SocialCaution.** SocialCaution measures (scores, indices, per-app
   inventories). PandaGarde helps a family understand and *talk*. No numbers on parent-entry pages.
2. **Written for non-technical parents.** Everyday app kinds with familiar examples; results say
   "Start here / Worth a look / Lighter for now" and "These apps usually know: …".
3. **One next step on every screen.** Home → big picture → read a story together. Family Hub and
   the app-by-app footprint review are quiet secondary links.

## The parent path (homepage)

1. **See the big picture** — `/big-picture`, 2 minutes
2. **Talk about it with a story** — Privacy Panda story
3. **Practice together** — Family Hub missions

The footprint review (catalog → scores) stays available from the footer "Review workflow" column
and a single "Want app-by-app detail?" link on the result.

## Picker

Four areas × three everyday kinds (`src/data/familyBigPicture.ts`), plus optional ages:

| Area | Kinds | Who picks the apps |
|---|---|---|
| School | classwork & homework apps · class messages & behavior points · school laptop or tablet | The school |
| Games | online games & consoles · free phone games · game chat & streaming | You and your child |
| Social apps & AI chat | video & photo apps · messaging apps · AI chatbots | Often your child |
| At home | streaming · smart speakers & connected toys · kid phone, watch or location sharing | You |

## Result

- Four area cards: plain label, "These apps usually know: …" tags, who picks the apps
- **This week**: up to three concrete actions, starting with the "Start here" area
- **Ask your child**: one conversation opener for the "Start here" area
- **Good to know for their age** (only when relevant)
- **Questions to ask your child's school** (collapsed; only when school is ticked) + "Share
  EduSoluce with your school" (`VITE_EDUSOLUCE_URL`) — the EduSoluce funnel
- **Next: talk about it together** → story; secondary: Family Hub missions, app list

Areas are ranked internally by the sensitivity of what their apps usually hold
(`src/lib/familyBigPicture.ts`); the weights are never shown. A unit test keeps "score", "exposure",
"index" and "/100" out of parent-facing copy.

## Follow-ups

- Translate the big picture page (home is EN/FR/ES)
- Decide the footprint review's future: plain-language rewrite or keep as an "advanced" area
- Pick the story that matches the "Start here" area instead of the origin story
