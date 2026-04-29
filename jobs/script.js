/* ============================================================
   ADAM & FARAH — Wedding Invitation Script
   ============================================================ */
'use strict';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

/* ── Helpers ── */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

/* ============================================================
   SPLASH SCREEN
   ============================================================ */
(function initSplash() {
  createParticles();

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.to('#sl1', { opacity: 1, y: 0, duration: 1.2, delay: 0.6 }, 'start')
    .to('#sl2', { opacity: 1, y: 0, duration: 1.2 }, '-=0.4')
    .to('#sl3', { opacity: 1, y: 0, duration: 1.2 }, '-=0.4')
    .to('.splash-divider', { opacity: 1, width: '80px', duration: 0.8 }, '-=0.2')
    .to('.enter-btn',  { opacity: 1, duration: 0.8 });

  // Animate lines from below
  gsap.set($$('.splash-line'), { y: 20 });

  $('#enterBtn').addEventListener('click', handleEnter);

  function handleEnter() {
    startMusic();
    const tl2 = gsap.timeline();
    tl2.to('#splash', { opacity: 0, duration: 1, ease: 'power2.inOut' })
       .call(() => {
         $('#splash').style.display = 'none';
         const main = $('#mainContent');
         main.style.display = 'block';
         main.classList.remove('main-hidden');
         gsap.from(main, { opacity: 0, duration: 0.5 });
         initScrollAnimations();
         initRoots();
         initCountdown();
         initGuestbook();
         spawnPetals();
         updateNavDots();
         $('#musicToggle').classList.remove('hidden');
       });
  }
})();

function createParticles() {
  const container = $('#splashParticles');
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    Object.assign(p.style, {
      position: 'absolute',
      width: Math.random() * 3 + 1 + 'px',
      height: Math.random() * 3 + 1 + 'px',
      borderRadius: '50%',
      background: `rgba(184,147,90,${Math.random() * 0.4 + 0.1})`,
      left: Math.random() * 100 + '%',
      top:  Math.random() * 100 + '%',
    });
    container.appendChild(p);
    gsap.to(p, {
      y: '-=40',
      x: `+=${(Math.random()-0.5)*60}`,
      opacity: 0,
      duration: Math.random() * 4 + 3,
      repeat: -1,
      delay: Math.random() * 4,
      ease: 'none',
    });
  }
}

/* ============================================================
   MUSIC
   ============================================================ */
let musicPlaying = false;

function startMusic() {
  const audio = $('#bgMusic');
  // We use a royalty-free fallback piano track since the Discord URL
  // requires authentication and cannot be used directly as audio src.
  // Replace this src with any direct MP3/OGG URL you have access to.
  audio.src = 'https://cdn.pixabay.com/audio/2023/03/13/audio_9a8e0b8abe.mp3';
  audio.volume = 0.35;
  audio.play().then(() => {
    musicPlaying = true;
    $('#musicIcon').textContent = '♪';
  }).catch(() => {
    // Autoplay blocked; user can click toggle manually
  });
}

$('#musicToggle').addEventListener('click', () => {
  const audio = $('#bgMusic');
  if (musicPlaying) {
    audio.pause(); musicPlaying = false;
    $('#musicIcon').textContent = '♫';
  } else {
    audio.play(); musicPlaying = true;
    $('#musicIcon').textContent = '♪';
  }
});

/* ============================================================
   SCROLL ANIMATIONS (GSAP ScrollTrigger)
   ============================================================ */
function initScrollAnimations() {
  $$('.reveal-item').forEach((el) => {
    const delay = parseFloat(el.dataset.delay || 0);
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });

  // Hero parallax
  gsap.to('.hero-bg-overlay', {
    yPercent: 30,
    ease: 'none',
    scrollTrigger: { trigger: '#hero', scrub: true },
  });

  // Timeline line draw
  gsap.from('.timeline-line', {
    scaleY: 0,
    transformOrigin: 'top',
    duration: 2,
    ease: 'power2.out',
    scrollTrigger: { trigger: '#program', start: 'top 70%' },
  });
}

/* ============================================================
   OUR ROOTS — Photo Reveal on Scroll
   ============================================================ */
function initRoots() {
  $$('.root-circle').forEach((circle) => {
    ScrollTrigger.create({
      trigger: circle,
      start: 'top 50%',
      onEnter: () => circle.classList.add('revealed-adult'),
      onLeaveBack: () => circle.classList.remove('revealed-adult'),
    });
  });
}

/* ============================================================
   PETAL ANIMATION
   ============================================================ */
function spawnPetals() {
  const container = $('#petals');
  const shapes = ['◆','✦','⬡','•'];
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('span');
    p.className = 'petal';
    p.textContent = shapes[i % shapes.length];
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      font-size: ${Math.random() * 10 + 6}px;
      color: rgba(184,147,90,${Math.random()*0.5+0.1});
      animation-duration: ${Math.random()*10+8}s;
      animation-delay: ${Math.random()*8}s;
    `;
    container.appendChild(p);
  }
}

/* ============================================================
   COUNTDOWN
   ============================================================ */
function initCountdown() {
  const target = new Date('2026-07-10T18:00:00');

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      $('#cd-days').textContent = '00';
      $('#cd-hours').textContent = '00';
      $('#cd-mins').textContent = '00';
      $('#cd-secs').textContent = '00';
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const pad = (n) => String(n).padStart(2, '0');
    $('#cd-days').textContent  = pad(d);
    $('#cd-hours').textContent = pad(h);
    $('#cd-mins').textContent  = pad(m);
    $('#cd-secs').textContent  = pad(s);
  }
  tick();
  setInterval(tick, 1000);
}

/* ============================================================
   GUESTBOOK
   ============================================================ */
function initGuestbook() {
  const textarea = $('#wishInput');
  const charCount = $('#charCount');
  const MAX = 500;

  textarea.addEventListener('input', () => {
    const len = textarea.value.length;
    if (len > MAX) textarea.value = textarea.value.slice(0, MAX);
    charCount.textContent = `${Math.min(len, MAX)} / ${MAX}`;
  });

  $('#sendWishBtn').addEventListener('click', () => {
    const val = textarea.value.trim();
    if (!val) { textarea.focus(); return; }
    // Store locally (or send to backend if available)
    const wishes = JSON.parse(localStorage.getItem('wedding_wishes') || '[]');
    wishes.push({ text: val, ts: Date.now() });
    localStorage.setItem('wedding_wishes', JSON.stringify(wishes));

    gsap.to('.guestbook-glass', { y: -4, duration: 0.15, yoyo: true, repeat: 1 });
    textarea.value = '';
    charCount.textContent = `0 / ${MAX}`;
    const success = $('#wishSuccess');
    success.classList.add('visible');
    gsap.from(success, { opacity: 0, y: 10, duration: 0.6, ease: 'power2.out' });
  });
}

/* ============================================================
   NAV DOTS
   ============================================================ */
function updateNavDots() {
  const sections = ['hero','roots','program','dresscode','venue','guestbook'];
  const dots = $$('.nav-dot');

  function setActive() {
    const mid = window.innerHeight / 2;
    sections.forEach((id, i) => {
      const el = document.getElementById(id);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top <= mid && rect.bottom >= mid) {
        dots.forEach(d => d.classList.remove('active'));
        dots[i] && dots[i].classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();

  dots.forEach((dot, i) => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById(sections[i])?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}
