/** Theme (PandaGarde localStorage) + nav/footer SVG icons + mobile menu + search */

(function initJournalTheme() {
  try {
    const saved = localStorage.getItem('pandagarde-theme');
    const theme =
      saved === 'dark' || saved === 'light'
        ? saved
        : window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (_e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();

function mountThemeToggle() {
  const topbar = document.querySelector('.topbar');
  if (!topbar || topbar.querySelector('.theme-toggle')) {
    return;
  }
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'theme-toggle';
  const syncLabel = () => {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    btn.textContent = dark ? '☀' : '☾';
  };
  syncLabel();
  btn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('pandagarde-theme', next);
    } catch (_e) {
      /* ignore */
    }
    syncLabel();
  });
  topbar.appendChild(btn);
}

mountThemeToggle();

const SVG_ATTRS =
  'xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"';

const ICONS = {
  home: `<svg ${SVG_ATTRS}><path d="M3 10.5 12 3l9 7.5"/><path d="M5 10v10h14V10"/></svg>`,
  family: `<svg ${SVG_ATTRS}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  forest: `<svg ${SVG_ATTRS}><path d="M12 22v-8"/><path d="M5 12H2a10 10 0 0 1 20 0h-3"/><path d="M8 12 12 2l4 10"/></svg>`,
  book: `<svg ${SVG_ATTRS}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  shield: `<svg ${SVG_ATTRS}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  educator: `<svg ${SVG_ATTRS}><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 3 4 6 4s6-2 6-4v-5"/></svg>`,
  research: `<svg ${SVG_ATTRS}><path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 9a4 4 0 0 0-8 0c0 4 4 6 4 6s4-2 4-6z"/><path d="M10 2v2"/><path d="M6 4 4 6"/><path d="m18 4 2 2"/></svg>`,
  seasonal: `<svg ${SVG_ATTRS}><path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M2 12h2"/><path d="m4.93 19.07 1.41-1.41"/><path d="M12 18v2"/><path d="m17.66 17.66 1.41 1.41"/><path d="M22 12h-2"/><path d="m17.66 6.34 1.41-1.41"/><circle cx="12" cy="12" r="4"/></svg>`,
  news: `<svg ${SVG_ATTRS}><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Z"/><path d="M10 6h8"/><path d="M10 10h8"/><path d="M10 14h4"/></svg>`,
  campfire: `<svg ${SVG_ATTRS}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
  lock: `<svg ${SVG_ATTRS}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  school: `<svg ${SVG_ATTRS}><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
  camp: `<svg ${SVG_ATTRS}><path d="M3 20h18"/><path d="M7 20V10l5-6 5 6v10"/><path d="M12 4v3"/></svg>`,
  menu: `<svg ${SVG_ATTRS}><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/></svg>`,
};

const NAV_ICON_KEYS = {
  'index.html': 'home',
  'family-digital-life.html': 'family',
  'forest-stories.html': 'campfire',
  'inside-the-forest.html': 'forest',
  'parent-guides.html': 'book',
  'digital-resilience.html': 'shield',
  'educator-corner.html': 'educator',
  'research-insights.html': 'research',
  'seasonal-challenges.html': 'seasonal',
  'pandagarde-news.html': 'news',
  'campfire-conversations.html': 'campfire',
  'socialcaution-bridge.html': 'lock',
  'edusoluce-bridge.html': 'school',
  'summer-camp.html': 'camp',
};

function navHrefKey(href) {
  const raw = (href || '').replace(/^\.\.\//, '').split('#')[0];
  const slug = raw.replace(/^\//, '').replace(/\/$/, '');
  if (!slug || slug === 'index') {
    return 'index.html';
  }
  return slug.endsWith('.html') ? slug : `${slug}.html`;
}

function createIcon(key) {
  const svg = ICONS[key];
  if (!svg) {
    return null;
  }
  const span = document.createElement('span');
  span.className = 'nav-icon';
  span.setAttribute('aria-hidden', 'true');
  span.innerHTML = svg;
  return span;
}

function addIcon(link) {
  if (link.querySelector('.nav-icon')) {
    return;
  }
  const key = NAV_ICON_KEYS[navHrefKey(link.getAttribute('href'))];
  const icon = key ? createIcon(key) : null;
  if (!icon) {
    return;
  }
  const label = document.createElement('span');
  label.className = 'nav-label';
  while (link.firstChild) {
    const child = link.firstChild;
    if (child.nodeType === Node.TEXT_NODE && !child.textContent.trim()) {
      link.removeChild(child);
      continue;
    }
    if (child.nodeType === Node.ELEMENT_NODE && child.tagName === 'SPAN' && !child.classList.contains('nav-icon')) {
      label.appendChild(child);
      continue;
    }
    label.appendChild(child);
  }
  if (!label.textContent.trim() && link.textContent.trim()) {
    label.textContent = link.textContent.trim();
  }
  link.textContent = '';
  link.append(icon, label);
}

document.querySelectorAll('.nav a, .footer-grid a').forEach(addIcon);

const btn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');
if (btn && nav) {
  if (!btn.querySelector('.nav-icon')) {
    const menuIcon = createIcon('menu');
    const menuLabel = document.createElement('span');
    menuLabel.className = 'menu-btn-label';
    menuLabel.textContent = 'Menu';
    btn.textContent = '';
    if (menuIcon) {
      btn.append(menuIcon, menuLabel);
    } else {
      btn.append(menuLabel);
    }
  }
  btn.addEventListener('click', () => nav.classList.toggle('open'));
}

const search = document.querySelector('[data-search]');
if (search) {
  search.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('[data-card]').forEach((card) => {
      card.style.display = card.innerText.toLowerCase().includes(q) ? 'flex' : 'none';
    });
  });
}
