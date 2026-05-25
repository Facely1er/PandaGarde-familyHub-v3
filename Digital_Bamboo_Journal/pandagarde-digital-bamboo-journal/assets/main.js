const NAV_ICONS = {
  'index.html': '🏠',
  'family-digital-life.html': '👨‍👩‍👧',
  'inside-the-forest.html': '🌲',
  'parent-guides.html': '📖',
  'digital-resilience.html': '🛡️',
  'educator-corner.html': '🎓',
  'research-insights.html': '🔬',
};

function navHrefKey(href) {
  return (href || '').replace(/^\.\.\//, '').split('#')[0];
}

document.querySelectorAll('.nav a').forEach((link) => {
  const key = navHrefKey(link.getAttribute('href'));
  const icon = NAV_ICONS[key];
  if (!icon || link.querySelector('.nav-icon')) {
    return;
  }
  const span = document.createElement('span');
  span.className = 'nav-icon';
  span.setAttribute('aria-hidden', 'true');
  span.textContent = icon;
  link.prepend(span);
});

const btn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');
if (btn && nav) {
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
