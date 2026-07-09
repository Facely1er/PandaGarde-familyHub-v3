/**
 * One-off generator: extracts mission copy from ageBasedActivities into hub mission locale files.
 * Run: node scripts/generate-hub-missions-i18n.mjs
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ageBasedActivities } from '../src/data/ageBasedActivities.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'src/i18n/hub/missions');

const missions = {};
for (const group of ageBasedActivities) {
  for (const activity of group.activities) {
    missions[activity.id] = {
      name: activity.name,
      description: activity.description,
      realLifeScenario: activity.realLifeScenario,
      learningObjective: activity.learningObjective,
      familyPrompt: activity.familyPrompt,
      nextStep: activity.nextStep,
      keyLearnings: activity.keyLearnings,
      discussionPrompts: activity.discussionPrompts,
    };
  }
}

const ageGroupDescriptions = Object.fromEntries(
  ageBasedActivities.map((g) => [g.ageRange, g.description])
);

writeFileSync(join(outDir, 'en.json'), `${JSON.stringify({ missions, ageGroupDescriptions }, null, 2)}\n`, 'utf8');
console.log(`Wrote ${Object.keys(missions).length} missions to ${outDir}/en.json`);
