/** Menu toggle + section search (nav icons are embedded in HTML). */
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
