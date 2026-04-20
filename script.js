/* ─────────────────────────────────────────────────────────────
   ЧДТУ — script.js
   Clock · Theme · Navigation · Scroll · Animations
   ───────────────────────────────────────────────────────────── */

'use strict';

// ─── DOM REFS ─────────────────────────────────────────────────
const clockTime   = document.getElementById('clockTime');
const clockDate   = document.getElementById('clockDate');
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const header      = document.getElementById('header');
const navItems    = document.querySelectorAll('.nav-item');
const html        = document.documentElement;

// ─── REAL-TIME CLOCK ──────────────────────────────────────────
const DAYS_UK = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const MONTHS_UK = [
    'Січня','Лютого','Березня','Квітня','Травня','Червня',
    'Липня','Серпня','Вересня','Жовтня','Листопада','Грудня'
];

function padZ(n) {
    return String(n).padStart(2, '0');
}

function updateClock() {
    const now   = new Date();
    const h     = padZ(now.getHours());
    const m     = padZ(now.getMinutes());
    const s     = padZ(now.getSeconds());
    const day   = DAYS_UK[now.getDay()];
    const date  = now.getDate();
    const month = MONTHS_UK[now.getMonth()];

    clockTime.textContent = `${h}:${m}:${s}`;
    clockDate.textContent = `${day}, ${date} ${month}`;
}

updateClock();
setInterval(updateClock, 1000);

// ─── THEME TOGGLE ─────────────────────────────────────────────
const STORAGE_KEY = 'cstu-theme';

function getPreferredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark' : 'light';
}

function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    themeIcon.textContent = theme === 'dark' ? '🌙' : '💡';
    themeToggle.setAttribute('aria-label',
        theme === 'dark' ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'
    );
    localStorage.setItem(STORAGE_KEY, theme);

    // Update meta theme-color for mobile browser chrome
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
        metaTheme.setAttribute('content', theme === 'dark' ? '#080810' : '#f0f4ff');
    }
}

// Apply on load
applyTheme(getPreferredTheme());

// Toggle on click
themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';

    // Tiny animation
    themeIcon.style.transform = 'scale(0) rotate(-180deg)';
    themeIcon.style.transition = '0.18s ease';
    setTimeout(() => {
        applyTheme(next);
        themeIcon.style.transform = 'scale(1) rotate(0)';
    }, 150);
});

// Listen for system preference changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
    }
});

// ─── HEADER SCROLL STATE ──────────────────────────────────────
let lastScroll  = 0;
let ticking     = false;

function handleScroll() {
    const scrollY = window.scrollY;

    // Scrolled class for glass opacity
    header.classList.toggle('scrolled', scrollY > 20);

    lastScroll = scrollY;
    ticking    = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(handleScroll);
        ticking = true;
    }
}, { passive: true });

// ─── BOTTOM NAV — active state on scroll ─────────────────────
const sections = [
    { id: 'home',      selector: '#home' },
    { id: 'faculties', selector: '#faculties' },
    { id: 'schedule',  selector: '#schedule' },
    { id: 'community', selector: '#community' },
    { id: 'contacts',  selector: '#contacts' },
];

function getActiveSectionId() {
    const scrollY  = window.scrollY + 200;
    let active     = sections[0].id;

    for (const sec of sections) {
        const el = document.querySelector(sec.selector);
        if (!el) continue;
        if (el.offsetTop <= scrollY) active = sec.id;
    }

    return active;
}

function updateNav() {
    const activeId = getActiveSectionId();
    navItems.forEach(item => {
        const isActive = item.dataset.section === activeId;
        item.classList.toggle('active', isActive);
    });
}

window.addEventListener('scroll', updateNav, { passive: true });

// Nav click — smooth scroll
navItems.forEach(item => {
    item.addEventListener('click', e => {
        e.preventDefault();
        const href = item.getAttribute('href');
        const target = document.querySelector(href);
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetY = target.getBoundingClientRect().top
                          + window.scrollY - headerHeight - 8;
            window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
        // Active immediately on click
        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');
    });
});

// ─── INTERSECTION OBSERVER — fade-in sections ─────────────────
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity   = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.08,
    rootMargin: '0px 0px -60px 0px'
});

// Observe cards & sections
const animated = document.querySelectorAll(
    '.glass, .quick-card, .faculty-card, .sched-card, ' +
    '.comm-card, .building-card, .info-card, .stat, .pill'
);

animated.forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.5s ${i * 0.04}s ease, transform 0.5s ${i * 0.04}s ease`;
    observer.observe(el);
});

// ─── RIPPLE EFFECT on interactive cards ───────────────────────
function createRipple(e, el) {
    const existing = el.querySelector('.ripple');
    if (existing) existing.remove();

    const rect   = el.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height) * 1.5;
    const x      = e.clientX - rect.left - size / 2;
    const y      = e.clientY - rect.top  - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    Object.assign(ripple.style, {
        position:  'absolute',
        width:     size + 'px',
        height:    size + 'px',
        left:      x + 'px',
        top:       y + 'px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.15)',
        transform: 'scale(0)',
        animation: 'rippleAnim 0.5s ease forwards',
        pointerEvents: 'none',
    });

    el.style.position = 'relative';
    el.style.overflow = 'hidden';
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

// Inject ripple keyframes
const style = document.createElement('style');
style.textContent = `
@keyframes rippleAnim {
    to { transform: scale(1); opacity: 0; }
}
`;
document.head.appendChild(style);

document.querySelectorAll('.quick-card, .comm-card, .btn, .nav-item').forEach(el => {
    el.addEventListener('click', e => createRipple(e, el));
});

// ─── SMOOTH SCROLL for all anchor links ───────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
    if (link.closest('.bottom-nav')) return; // handled above
    link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const headerH = header.offsetHeight;
            window.scrollTo({
                top: target.getBoundingClientRect().top + window.scrollY - headerH - 8,
                behavior: 'smooth'
            });
        }
    });
});

// ─── HAPTIC FEEDBACK on mobile (Vibration API) ────────────────
function haptic(duration = 10) {
    if (navigator.vibrate) {
        navigator.vibrate(duration);
    }
}

document.querySelectorAll('.btn, .nav-item').forEach(el => {
    el.addEventListener('pointerdown', () => haptic(8));
});

// ─── ONLINE STATUS INDICATOR ──────────────────────────────────
function showToast(msg, emoji = 'ℹ️', duration = 3000) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${emoji}</span> <span>${msg}</span>`;
    Object.assign(toast.style, {
        position:   'fixed',
        bottom:     '100px',
        left:       '50%',
        transform:  'translateX(-50%) translateY(20px)',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border:     '1px solid var(--glass-border)',
        borderRadius: '100px',
        padding:    '12px 20px',
        fontSize:   '14px',
        color:      'var(--text)',
        fontFamily: 'var(--font)',
        fontWeight: '500',
        zIndex:     '999',
        boxShadow:  '0 8px 32px rgba(0,0,0,0.3)',
        opacity:    '0',
        transition: 'all 0.3s ease',
        display:    'flex',
        gap:        '8px',
        alignItems: 'center',
        whiteSpace: 'nowrap',
    });

    document.body.appendChild(toast);
    requestAnimationFrame(() => {
        toast.style.opacity   = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
        toast.style.opacity   = '0';
        toast.style.transform = 'translateX(-50%) translateY(8px)';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

window.addEventListener('offline', () => showToast('Відсутнє з\'єднання з мережею', '📡'));
window.addEventListener('online',  () => showToast('З\'єднання відновлено', '✅'));

// ─── GREETING based on time of day ───────────────────────────
function getGreeting() {
    const h = new Date().getHours();
    if (h >= 5  && h < 12) return { text: 'Доброго ранку! ☀️', emoji: '🌅' };
    if (h >= 12 && h < 17) return { text: 'Доброго дня! 🌤️',   emoji: '☀️' };
    if (h >= 17 && h < 21) return { text: 'Доброго вечора! 🌆', emoji: '🌇' };
    return { text: 'Доброї ночі! 🌙', emoji: '⭐' };
}

// Show greeting after 1 second
setTimeout(() => {
    const g = getGreeting();
    showToast(g.text, g.emoji, 3500);
}, 1000);

// ─── INIT ─────────────────────────────────────────────────────
updateNav();
handleScroll();

console.log(
    '%c🎓 ЧДТУ — Черкаський Державний Технологічний Університет',
    'font-size:14px;font-weight:bold;color:#3b9eff;font-family:-apple-system'
);
console.log(
    '%cCONSTANTIA EVOLUTIONIS — Постійність та розвиток',
    'font-size:12px;color:#888;font-family:-apple-system'
);