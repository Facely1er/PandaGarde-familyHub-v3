# Guided parent path — big picture → your apps → action plan

A fully guided, plain-language journey for non-technical parents that ends in an action plan for
the apps their child actually uses. Every page shows the same 3-step guide
(`components/journey/FamilyPlanSteps.tsx`) and one primary next step.

| Step | Route | What the parent does | What they get |
|---|---|---|---|
| 1. Big picture | `/big-picture` | Tick everyday kinds of apps (4 areas × 3) + optional ages | Where to start (Start here / Worth a look / Lighter for now), what those apps usually know, 3 things for this week, a question for their child, school questions + EduSoluce |
| 2. Your apps | `/service-catalog` | Tap **Add** on apps suggested from step 1 (or search all) | Their app list (`pandagarde_family_services`) |
| 3. Action plan | `/digital-footprint` | Tick steps as they do them | Per-app cards ordered *Do these first → Next → When you have time*: "Good to know" + "What to do" checklist, school/age notes, steps for areas with no app, a conversation prompt + story |

Legacy `/family-snapshot` and `/snapshot` redirect to `/big-picture`.

## Positioning

SocialCaution measures (scores, indices). PandaGarde guides a family to act and talk. No numbers on
steps 1–3; the scored footprint review is a collapsed **Detailed footprint review** under the plan
(needs 3+ apps). The plan itself works from one app.

## Where things live

- Content: `src/data/familyBigPicture.ts` (areas, kinds, `catalogIds` suggestions, school questions)
- Step 1 logic: `src/lib/familyBigPicture.ts` (ranks areas; never exposes a number)
- Step 3 logic: `src/lib/familyActionPlan.ts` (catalog risk → priority, ≤4 steps and ≤2 notes per app, progress storage)
- UI: `pages/FamilyBigPicturePage.tsx`, `pages/ServiceCatalogPage.tsx`, `components/FamilyActionPlan.tsx`, `pages/DigitalFootprintPage.tsx`

Storage (device only): `pandagarde_family_snapshot_v1` (step 1), `pandagarde_family_services` (step 2),
`pandagarde_action_plan_v1` (ticked steps).

## EduSoluce funnel

Step 1 shows school questions and "Share EduSoluce with your school" (`VITE_EDUSOLUCE_URL`) when
school apps are ticked; step 3 marks school-chosen apps ("Chosen by the school — ask the teacher…").

## Follow-ups

- Rewrite catalog `parentTips` that still use jargon (e.g. "FERPA-compliant", "CPNI") in plain words
- Translate steps 1–3 (homepage is EN/FR/ES)
- Add consoles, smart speakers and location apps to the catalog so every big-picture kind has suggestions
- Printable plan; story matched to the "Start here" area
