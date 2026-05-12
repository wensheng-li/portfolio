/* ──────────────────────────────────────────
   PORTFOLIO — script.js
   ────────────────────────────────────────── */

// ── YEAR ──
document.getElementById('year').textContent = new Date().getFullYear();

// ── NAV: scroll state ──
const nav = document.getElementById('nav');
const onScroll = () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ── NAV: mobile hamburger ──
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
  const isOpen = navLinks.classList.contains('open');
  hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Toggle menu');
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

// ── SCROLL REVEAL ──
const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger delay based on sibling index
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
      const idx = siblings.indexOf(entry.target);
      const delay = idx * 80;
      entry.target.style.transitionDelay = `${delay}ms`;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
});

reveals.forEach(el => revealObserver.observe(el));

// Trigger hero reveals immediately (they're already in view)
window.addEventListener('DOMContentLoaded', () => {
  const heroReveals = document.querySelectorAll('.hero .reveal');
  heroReveals.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 200 + i * 150);
  });
});

// ── ACTIVE NAV LINK (highlight on scroll) ──
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}`
          ? 'var(--text)'
          : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

// ── PROJECT CARDS: subtle tilt on mouse move ──
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-2px) perspective(800px) rotateY(${x * 3}deg) rotateX(${-y * 1.5}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── SMOOTH NAV: prevent jump for hash links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const navHeight = nav.offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── COPY EMAIL on click ──
const emailLink = document.querySelector('.contact-email');
if (emailLink) {
  emailLink.addEventListener('click', (e) => {
    const email = emailLink.textContent.trim();
    if (navigator.clipboard && email.includes('@')) {
      e.preventDefault();
      navigator.clipboard.writeText(email).then(() => {
        const original = emailLink.textContent;
        emailLink.textContent = 'Copied to clipboard!';
        emailLink.style.color = 'var(--accent)';
        setTimeout(() => {
          emailLink.textContent = original;
          emailLink.style.color = '';
        }, 2000);
      }).catch(() => {
        // Fallback: just follow the mailto link
        window.location.href = `mailto:${email}`;
      });
    }
  });
}
