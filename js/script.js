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

// Project carousels
document.querySelectorAll('[data-carousel]').forEach(carousel => {
  const track = carousel.querySelector('.carousel__track');
  const slides = Array.from(track.children);
  const dotsWrap = carousel.querySelector('[data-dots]');
  const prevBtn = carousel.querySelector('[data-prev]');
  const nextBtn = carousel.querySelector('[data-next]');
  let index = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    if (i === 0) dot.classList.add('is-active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function update() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    update();
  }

  prevBtn.addEventListener('click', () => goTo(index - 1));
  nextBtn.addEventListener('click', () => goTo(index + 1));

  let touchStartX = 0;
  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', e => {
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(deltaX) > 40) goTo(index + (deltaX < 0 ? 1 : -1));
  });
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
  const images = JSON.parse(card.dataset.images);

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

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('is-open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') lightboxGoTo(lightboxIndex - 1);
  if (e.key === 'ArrowRight') lightboxGoTo(lightboxIndex + 1);
});
