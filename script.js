// =====================================================
//  OMPHU'S LANDING PAGE — script.js
//  Dynamic interactions & animations
// =====================================================

/* ── Environment Config ──────────────────────────── */
// Values loaded from .env via a build tool or injected at build time.
// For plain HTML, we expose them on a global config object.
const ENV = {
  siteOwner:   window.__ENV?.SITE_OWNER   ?? 'Omphulusa',
  siteTagline: window.__ENV?.SITE_TAGLINE ?? 'Learning Git, one commit at a time',
  githubUrl:   window.__ENV?.GITHUB_URL   ?? 'https://github.com',
  accentColor: window.__ENV?.ACCENT_COLOR ?? '#F4A11C',
};

/* ── Cursor Glow ─────────────────────────────────── */
const cursorGlow = document.getElementById('cursorGlow');
let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  glowX += (mouseX - glowX) * 0.08;
  glowY += (mouseY - glowY) * 0.08;
  cursorGlow.style.left = glowX + 'px';
  cursorGlow.style.top  = glowY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

/* ── Navbar Scroll Effect ────────────────────────── */
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  if (scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Hide navbar when scrolling down fast, show when scrolling up
  if (scrollY > lastScroll + 5 && scrollY > 200) {
    navbar.style.transform = 'translateY(-100%)';
  } else if (scrollY < lastScroll - 5) {
    navbar.style.transform = 'translateY(0)';
  }
  lastScroll = scrollY;
});

navbar.style.transition = 'background 0.4s ease, box-shadow 0.4s ease, transform 0.4s ease';

/* ── Mobile Nav Toggle ───────────────────────────── */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  // Animate hamburger → X
  const spans = navToggle.querySelectorAll('span');
  navLinks.classList.contains('open')
    ? animateHamburgerOpen(spans)
    : animateHamburgerClose(spans);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    animateHamburgerClose(navToggle.querySelectorAll('span'));
  });
});

function animateHamburgerOpen(spans) {
  spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
  spans[1].style.opacity   = '0';
  spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
}

function animateHamburgerClose(spans) {
  spans[0].style.transform = '';
  spans[1].style.opacity   = '';
  spans[2].style.transform = '';
}

/* ── Scroll Reveal ───────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Parallax on Hero shapes ─────────────────────── */
document.addEventListener('mousemove', (e) => {
  const { innerWidth: w, innerHeight: h } = window;
  const x = (e.clientX / w - 0.5) * 30;
  const y = (e.clientY / h - 0.5) * 30;

  const shapes = document.querySelectorAll('.shape');
  shapes.forEach((shape, i) => {
    const depth = (i + 1) * 0.5;
    shape.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
  });
});

/* ── Typing Effect on Hero Eyebrow ──────────────── */
const eyebrow = document.querySelector('.hero-eyebrow');
if (eyebrow) {
  const text   = eyebrow.textContent;
  eyebrow.textContent = '';
  let i = 0;

  setTimeout(() => {
    const type = () => {
      if (i < text.length) {
        eyebrow.textContent += text[i++];
        setTimeout(type, 60);
      }
    };
    type();
  }, 400);
}

/* ── Code block copy-on-click ────────────────────── */
document.querySelectorAll('.code-block').forEach(block => {
  block.title = 'Click to copy';
  block.style.cursor = 'pointer';

  block.addEventListener('click', () => {
    const code = block.innerText;
    navigator.clipboard?.writeText(code).then(() => {
      const original = block.style.borderColor;
      block.style.borderColor = 'rgba(0,122,77,0.6)';
      block.style.transition  = 'border-color 0.3s';

      const toast = document.createElement('div');
      toast.textContent = 'Copied!';
      Object.assign(toast.style, {
        position: 'fixed',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%) translateY(0)',
        background: '#007A4D',
        color: '#fff',
        padding: '0.6rem 1.4rem',
        borderRadius: '50px',
        fontSize: '0.85rem',
        fontWeight: '600',
        zIndex: '9999',
        boxShadow: '0 4px 20px rgba(0,122,77,0.4)',
        transition: 'opacity 0.5s ease',
      });
      document.body.appendChild(toast);

      setTimeout(() => { toast.style.opacity = '0'; }, 1500);
      setTimeout(() => { toast.remove(); block.style.borderColor = original; }, 2000);
    });
  });
});

/* ── Cheat card tilt effect ──────────────────────── */
document.querySelectorAll('.cheat-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-6px) scale(1.02) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── Smooth active nav highlight ─────────────────── */
const sections = document.querySelectorAll('section[id]');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.nav-links a').forEach(a => {
          a.style.color = '';
        });
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.style.color = '#F4A11C';
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(s => navObserver.observe(s));

/* ── Counter animation for stats ─────────────────── */
function animateCounter(el, target, suffix = '') {
  let current = 0;
  const step  = target / 40;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current) + suffix;
    }
  }, 30);
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numberEl = entry.target.querySelector('.stat-number');
        if (numberEl && numberEl.dataset.target) {
          animateCounter(numberEl, parseInt(numberEl.dataset.target), numberEl.dataset.suffix ?? '');
        }
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.6 }
);

document.querySelectorAll('.stat').forEach(stat => {
  const numEl = stat.querySelector('.stat-number');
  if (numEl && !isNaN(parseInt(numEl.textContent))) {
    const val = parseInt(numEl.textContent);
    numEl.dataset.target = val;
    numEl.textContent = '0';
    statsObserver.observe(stat);
  }
});

/* ── Page load entrance animation ───────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  setTimeout(() => { document.body.style.opacity = '1'; }, 50);
});

console.log(
  `%c✨ Welcome to Omphu's World!\n%cThis site was built to teach Git. Start exploring! 🚀`,
  'color: #F4A11C; font-size: 1.2rem; font-weight: bold;',
  'color: #9CDCFE; font-size: 0.9rem;'
);
