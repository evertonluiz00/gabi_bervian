// Language toggle (PT-BR / EN) — the markup is written in PT-BR, this table holds the EN version
const translations = {
  en: {
    'nav.about': 'About Me',
    'nav.services': 'Services',
    'nav.projects': 'Projects',
    'nav.contact': 'Contact',
    'hero.title': 'Interior Designer',
    'hero.tagline': 'Designing spaces with precision.<br> Creating homes with soul.',
    'hero.scroll': '&#8595; Scroll',
    'about.tag': 'About Me',
    'about.title': 'Bringing ideas into buildable reality',
    'about.p1': 'I am an Interior Designer dedicated to transforming ideas into spaces that are not only beautiful, '
      + 'but meaningful, functional, and deeply connected to the people who experience them. Inspired by the '
      + 'principles of Neuroarchitecture, my work explores how thoughtful design decisions can influence emotions, '
      + 'well-being, and the way we live within a space.',
    'about.p2': 'I collaborate with interior design studios and creative teams to bridge the journey between vision '
      + 'and reality — turning concepts into detailed, organized, and buildable solutions. My role is to bring '
      + 'clarity to the design process, ensuring that every element, from the overall atmosphere to the smallest '
      + 'detail, is carefully considered and intentionally developed.',
    'about.p3': 'With a strong foundation in technical detailing and visual storytelling, I create precise design '
      + 'documentation and realistic visual experiences that allow each project to be understood, refined, and '
      + 'brought to life with confidence.',
    'about.p4': 'Balancing creativity, technical expertise, and a human-centered perspective, I believe exceptional '
      + 'interiors are created when beautiful ideas are supported by thoughtful execution — resulting in spaces that '
      + 'truly reflect the people they are designed for.',
    'services.tag': 'What I Do',
    'services.title': 'Services',
    'services.ffeTitle': 'FF&E',
    'services.ffe': 'Furniture, Fixtures & Equipment — curated selections that align with each project\'s aesthetic '
      + 'vision, budget, and functional needs. From mood boards to detailed specification sheets.',
    'services.constructionTitle': 'Construction Documents',
    'services.construction': 'Precise technical drawings and documentation — floor plans, elevations, reflected '
      + 'ceiling plans, millwork details — that bring clarity and confidence to every stage of the build.',
    'services.vizTitle': '3D Visualization',
    'services.viz': 'Realistic three-dimensional models that transform concepts into immersive spatial experiences '
      + '— allowing clients and teams to fully explore the design before construction begins.',
    'projects.tag': 'Portfolio',
    'projects.title': 'Projects',
    'contact.instagram': '@gabibervian.design',
    'contact.instagramUrl': 'https://www.instagram.com/gabibervian.design',
    'contact.tag': 'Get In Touch',
    'contact.title': 'Let\'s Create Together',
    'contact.sub': 'Available for freelance collaborations & design partnerships worldwide.',
    'title': 'Gabi Bervian | Interior Designer',
  },
};

const langToggle = document.getElementById('langToggle');
const langToggleCode = document.getElementById('langToggleCode');
const htmlEl = document.documentElement;
const originalTexts = new Map();
const originalTitle = document.title;

document.querySelectorAll('[data-i18n]').forEach(el => {
  originalTexts.set(el, { key: el.dataset.i18n, html: false, value: el.textContent });
});
document.querySelectorAll('[data-i18n-html]').forEach(el => {
  originalTexts.set(el, { key: el.dataset.i18nHtml, html: true, value: el.innerHTML });
});

// links whose destination changes with the language (e.g. the Instagram profile)
const originalHrefs = new Map();
document.querySelectorAll('[data-i18n-href]').forEach(el => {
  originalHrefs.set(el, { key: el.dataset.i18nHref, value: el.getAttribute('href') });
});

function applyLanguage(lang) {
  originalTexts.forEach((original, el) => {
    if (lang === 'pt') {
      if (original.html) el.innerHTML = original.value;
      else el.textContent = original.value;
    } else {
      const translated = translations[lang][original.key];
      if (translated === undefined) return;
      if (original.html) el.innerHTML = translated;
      else el.textContent = translated;
    }
  });

  originalHrefs.forEach((original, el) => {
    const href = lang === 'pt' ? original.value : translations[lang][original.key];
    if (href !== undefined) el.setAttribute('href', href);
  });

  document.title = lang === 'pt' ? originalTitle : (translations[lang]['title'] || originalTitle);
  htmlEl.setAttribute('lang', lang === 'pt' ? 'pt-BR' : 'en');

  // the button always advertises the language it switches to (flag + code)
  const target = lang === 'pt' ? 'en' : 'pt';
  langToggle.dataset.target = target;
  langToggleCode.textContent = target.toUpperCase();
  langToggle.setAttribute('aria-label', target === 'en' ? 'Ver site em inglês' : 'View site in Portuguese');

  localStorage.setItem('lang', lang);
}

langToggle.addEventListener('click', () => {
  const current = localStorage.getItem('lang') === 'en' ? 'en' : 'pt';
  applyLanguage(current === 'en' ? 'pt' : 'en');
});

applyLanguage(localStorage.getItem('lang') === 'en' ? 'en' : 'pt');

// Navbar mobile toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('is-open');
});

navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navMenu.classList.remove('is-open'));
});

// Navbar background on scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('is-scrolled', window.scrollY > 20);
});

// Project image viewer (lightbox)
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxCounter = document.getElementById('lightboxCounter');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxClose = document.getElementById('lightboxClose');

let lightboxImages = [];
let lightboxIndex = 0;

function showLightboxImage() {
  const item = lightboxImages[lightboxIndex];
  lightboxImg.src = item.src;
  lightboxImg.alt = item.alt || '';
  lightboxCaption.textContent = item.alt || '';
  lightboxCounter.textContent = `${lightboxIndex + 1} / ${lightboxImages.length}`;
}

function openLightbox(images, startIndex) {
  lightboxImages = images;
  lightboxIndex = startIndex;
  showLightboxImage();
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function lightboxGoTo(i) {
  lightboxIndex = (i + lightboxImages.length) % lightboxImages.length;
  showLightboxImage();
}

document.querySelectorAll('[data-project]').forEach(card => {
  const { folder, prefix, count } = card.dataset;
  const title = card.querySelector('.project-card__title').textContent.trim();

  // images are numbered <prefix>_01.png … <prefix>_<count>.png inside the project folder
  const images = Array.from({ length: Number(count) }, (_, i) => ({
    src: encodeURI(`images/projects/${folder}/${prefix}_${String(i + 1).padStart(2, '0')}.png`),
    alt: title,
  }));

  card.addEventListener('click', () => openLightbox(images, 0));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLightbox(images, 0);
    }
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', () => lightboxGoTo(lightboxIndex - 1));
lightboxNext.addEventListener('click', () => lightboxGoTo(lightboxIndex + 1));

// swipe left/right to move between images on touch devices
const SWIPE_MIN = 45;
let touchStartX = 0;
let touchStartY = 0;
let tracking = false;
let swiped = false;

lightbox.addEventListener('click', (e) => {
  if (swiped) return; // a swipe that ends on the backdrop must not close the viewer
  if (e.target === lightbox) closeLightbox();
});

lightbox.addEventListener('touchstart', (e) => {
  // a second finger means pinch-zoom, not a swipe
  tracking = e.touches.length === 1;
  if (!tracking) return;
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  swiped = false;
}, { passive: true });

lightbox.addEventListener('touchend', (e) => {
  if (!tracking) return;
  tracking = false;

  const deltaX = e.changedTouches[0].clientX - touchStartX;
  const deltaY = e.changedTouches[0].clientY - touchStartY;

  // horizontal intent only, so a vertical drag never changes the image
  if (Math.abs(deltaX) < SWIPE_MIN || Math.abs(deltaX) < Math.abs(deltaY)) return;

  swiped = true;
  lightboxGoTo(lightboxIndex + (deltaX < 0 ? 1 : -1));
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('is-open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') lightboxGoTo(lightboxIndex - 1);
  if (e.key === 'ArrowRight') lightboxGoTo(lightboxIndex + 1);
});
