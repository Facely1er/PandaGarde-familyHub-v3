/**
 * Single catalog for public marketing URLs (nav/footer/legal).
 * Owns sitemap membership — keep in sync with siteNavigation + legal routes.
 * Omit auth/hub internals, redirects, and transactional utilities.
 */
export const MARKETING_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/how-it-works', priority: '0.9', changefreq: 'monthly' },
  { path: '/digital-footprint', priority: '0.9', changefreq: 'monthly' },
  { path: '/for-families', priority: '0.9', changefreq: 'monthly' },
  { path: '/family-hub', priority: '0.8', changefreq: 'monthly' },
  { path: '/family-snapshot', priority: '0.8', changefreq: 'monthly' },
  { path: '/service-catalog', priority: '0.8', changefreq: 'monthly' },
  { path: '/scoring-methodology', priority: '0.7', changefreq: 'monthly' },
  { path: '/digital-rights', priority: '0.7', changefreq: 'monthly' },
  { path: '/stories', priority: '0.8', changefreq: 'weekly' },
  { path: '/stories/cast', priority: '0.6', changefreq: 'monthly' },
  { path: '/family-privacy-plan', priority: '0.7', changefreq: 'monthly' },
  { path: '/faq', priority: '0.7', changefreq: 'monthly' },
  { path: '/support', priority: '0.6', changefreq: 'monthly' },
  { path: '/contact', priority: '0.6', changefreq: 'monthly' },
  { path: '/about', priority: '0.6', changefreq: 'monthly' },
  { path: '/legal', priority: '0.5', changefreq: 'yearly' },
  { path: '/privacy', priority: '0.5', changefreq: 'yearly' },
  { path: '/terms', priority: '0.5', changefreq: 'yearly' },
  { path: '/cookies', priority: '0.4', changefreq: 'yearly' },
  { path: '/accessibility', priority: '0.4', changefreq: 'yearly' },
];
