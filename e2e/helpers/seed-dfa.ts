/** Service IDs from `childServiceCatalog.ts` used to seed a minimal DFA path in e2e. */
export const E2E_SERVICE_IDS = ['instagram', 'tiktok', 'snapchat'] as const;

/** In-browser seed for Playwright `page.evaluate`. */
export function seedFamilyCatalogScript(): void {
  localStorage.setItem('pandagarde_family_services', JSON.stringify(E2E_SERVICE_IDS));
}
