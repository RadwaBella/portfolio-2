// ---------- Footer year ----------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Mobile menu ----------
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
  navToggle.firstElementChild.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
});
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
    navToggle.firstElementChild.className = 'fa-solid fa-bars';
  })
);

// ---------- Navbar background + back-to-top ----------
const navbar = document.getElementById('navbar');
const toTop = document.getElementById('toTop');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
  toTop.classList.toggle('show', window.scrollY > 600);
}, { passive: true });
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ---------- Active nav link on scroll ----------
const sections = document.querySelectorAll('main section[id]');
const links = document.querySelectorAll('.nav-links a:not(.nav-cta)');

const spy = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => spy.observe(s));

// ---------- Hero: typing code editor ----------
const typed = document.getElementById('typed');
const lines = [
  [['k', 'const '], ['f', 'developpeuse'], ['p', ' = {']],
  [['p', '  '], ['f', 'nom'], ['p', ': '], ['s', '"Radwa Belahsiniya"'], ['p', ',']],
  [['p', '  '], ['f', 'role'], ['p', ': '], ['s', '"Développeuse Full-Stack"'], ['p', ',']],
  [['p', '  '], ['f', 'stack'], ['p', ': ['], ['s', '"HTML"'], ['p', ', '], ['s', '"JavaScript"'], ['p', ', '], ['s', '"React"'], ['p', ', '], ['s', '"PHP"'], ['p', '],']],
  [['p', '  '], ['f', 'projetsPro'], ['p', ': '], ['k', '3'], ['p', ',']],
  [['p', '  '], ['f', 'disponible'], ['p', ': '], ['k', 'true'], ['p', ',']],
  [['p', '  '], ['f', 'contact'], ['p', '() {']],
  [['p', '    '], ['k', 'return '], ['s', '"Parlons-en !"'], ['p', ';']],
  [['p', '  }']],
  [['p', '};']]
];

function escapeHTML(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

function typeCode() {
  // Reduced motion: print everything at once
  const instant = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let html = '';
  let l = 0, t = 0, c = 0;

  function render() { typed.innerHTML = html; }

  if (instant) {
    html = lines.map(line => line.map(([k, txt]) => `<span class="tk-${k}">${escapeHTML(txt)}</span>`).join('')).join('\n');
    return render();
  }

  function step() {
    if (l >= lines.length) return;
    const [kind, text] = lines[l][t];
    c++;
    const partial = escapeHTML(text.slice(0, c));
    const done = html + `<span class="tk-${kind}">${partial}</span>`;
    typed.innerHTML = done;

    if (c >= text.length) {
      html += `<span class="tk-${kind}">${partial}</span>`;
      c = 0; t++;
      if (t >= lines[l].length) { html += '\n'; t = 0; l++; }
    }
    setTimeout(step, 28);
  }
  setTimeout(step, 600);
}
typeCode();

// ---------- Count-up stats + skill bars (when visible) ----------
function animateCount(el) {
  const target = +el.dataset.count;
  let n = 0;
  const timer = setInterval(() => {
    n++;
    el.textContent = n;
    if (n >= target) clearInterval(timer);
  }, Math.max(30, 1000 / target));
}

const reveal = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('[data-count]').forEach(animateCount);
    entry.target.querySelectorAll('[data-level]').forEach(bar => (bar.style.width = bar.dataset.level + '%'));
    obs.unobserve(entry.target);
  });
}, { threshold: 0.3 });
document.querySelectorAll('#about, #skills').forEach(s => reveal.observe(s));
