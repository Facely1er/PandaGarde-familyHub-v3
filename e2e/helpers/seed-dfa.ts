/** Service IDs from `childServiceCatalog.ts` used to seed a minimal DFA path in e2e. */
export const E2E_SERVICE_IDS = ['instagram', 'tiktok', 'snapchat'] as const;

/** Runs in the browser before navigation to simulate catalog → footprint → assessment. */
export function seedFamilyCatalogScript(): string {
  return `(() => {
    localStorage.setItem('pandagarde_family_services', ${JSON.stringify(E2E_SERVICE_IDS)});
  })();`;
}
