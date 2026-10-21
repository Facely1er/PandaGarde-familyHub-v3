# Family Snapshot — big picture first

Route: `/family-snapshot` (alias `/snapshot`). Adapted from the SocialCaution
**Category Snapshot** (`socialcaution-v5/docs/features/QUICK_SNAPSHOT_WWW.md`):
same idea (tick kinds of services → teaser report → named-app journey), same
tier weights and score curve, rebuilt around a child's online life.

## Why

Parents arrived on a homepage that offered four equal options (stories, guides,
footprint, Hub) and a footprint review that needs ~10 minutes of app picking
before it shows anything. The snapshot gives value in two minutes and turns the
site into one readable path:

1. **See the big picture** — `/family-snapshot` (2 min, no app names)
2. **Name your apps → footprint review** — `/service-catalog` → `/digital-footprint`
3. **Talk it through** — a Privacy Panda story
4. **Practice together** — Family Hub missions
5. *(when school apps are ticked)* **Bring the school in** — questions + EduSoluce

Each step still works on its own (CONTENT_TRUTH §1 independence rule).

## What parents tick

Four contexts, 16 kinds — `src/data/familySnapshot.ts`:

| Context | Who decides | Kinds |
|---|---|---|
| School & learning | Usually the school | classroom platforms, practice/test apps, class messaging & behavior, school laptop & monitoring, student records |
| Games & play | You and your child | game worlds, consoles & stores, free mobile games, game chat & streaming |
| Social, video & AI chat | Often your child | video & photo feeds, messaging, AI chatbots |
| Home & family devices | You | streaming, smart speakers/toys, phones & location sharing, health apps |

Plus optional age bands (5–8, 9–12, 13–17) used only for age notes.

## Report

- Overall score + band; count of school-chosen kinds ("you didn't choose these")
- **Where exposure builds up** — per-context score (vs every kind in that context), who decides, the parent's lever
- **For your children's ages** — under-13 on 13+ services, open chat at 5–8, school consent (US), teen AI chat
- Top 6 data types (child-centred: grades, behavior notes, face & voice, location…)
- **Where to start this week** — first step of the highest-scoring contexts, filled to 3
- One "why it matters" combo (e.g. *A school record outside the school*, *Scam and pressure target*)
- **Questions to ask your child's school** + EduSoluce link (`VITE_EDUSOLUCE_URL`)
- **Your path from here** — roadmap with done state from `pandagarde_dfa_journey_v1`
- Copy / share summary (no app or child names)

Logic: `src/lib/familySnapshot.ts` (unit tested). Storage: `pandagarde_family_snapshot_v1` only.

## EduSoluce funnel

School apps are the exposure parents cannot fix alone. The report turns that
into five concrete questions for the school and, when answers are unclear, a
"share with your school's privacy lead" link to EduSoluce. Track clicks with the
`family_snapshot_edusoluce_click` analytics event (no-op until analytics ships).

## Follow-ups

- Translate the snapshot page (homepage is EN/FR/ES; snapshot is EN like the catalog and footprint pages)
- Pre-filter the service catalog by the kinds ticked here (read-only hint; never auto-add)
- Printable "questions for the school" sheet
