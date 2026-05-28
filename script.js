/* ========================
   FORCE SCROLL TO TOP
   ======================== */
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

/* ========================
   LOADER
   ======================== */
const loaderEl   = document.getElementById('loader');
const loaderText = document.getElementById('loaderText');
// Kata-kata Indonesia/Inggris — tanpa huruf Jepang
const words = ['Hello.', 'Welcome.', 'To My.', 'Portfolio.'];
let wi = 0;

function cycleWord() {
    loaderText.classList.add('fade-out');
    setTimeout(() => {
        wi++;
        if (wi < words.length) {
            loaderText.textContent = words[wi];
            loaderText.classList.remove('fade-out');
            setTimeout(cycleWord, wi === words.length - 1 ? 800 : 500);
        } else {
            loaderEl.classList.add('curtain-in');
            setTimeout(() => {
                loaderEl.classList.add('curtain-out');
                setTimeout(() => {
                    loaderEl.classList.add('hide');
                    startCounters();
                }, 600);
            }, 550);
        }
    }, 200);
}
setTimeout(cycleWord, 600);


/* ========================
   CUSTOM CURSOR + TRAIL
   ======================== */
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

let mx = window.innerWidth  / 2;
let my = window.innerHeight / 2;
let rx = mx, ry = my;

// Trail
const TRAIL_LEN = 10;
const trailDots  = [];
const trailPos   = [];

for (let i = 0; i < TRAIL_LEN; i++) {
    const d = document.createElement('div');
    d.className = 'cursor-trail';
    document.body.appendChild(d);
    trailDots.push(d);
    trailPos.push({ x: mx, y: my });
}

document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursorDot.style.transform = `translate(${mx}px, ${my}px)`;
});

(function animLoop() {
    // Ring lerp
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    cursorRing.style.transform = `translate(${rx}px, ${ry}px)`;

    // Trail: push current pos, drop oldest
    trailPos.unshift({ x: mx, y: my });
    if (trailPos.length > TRAIL_LEN + 1) trailPos.pop();

    trailDots.forEach((dot, i) => {
        const p = trailPos[i + 1];
        if (!p) return;
        const scale   = 1 - (i / TRAIL_LEN);
        const opacity = (1 - i / TRAIL_LEN) * 0.55;
        dot.style.transform = `translate(${p.x}px, ${p.y}px) scale(${scale * 0.85})`;
        dot.style.opacity   = opacity;
    });

    requestAnimationFrame(animLoop);
})();

// Cursor click — diamond burst, no flash
document.addEventListener('mousedown', () => {
    cursorDot.classList.add('click');

    // burst ring
    const burst = document.createElement('div');
    burst.className = 'cursor-burst';
    burst.style.left = mx + 'px';
    burst.style.top  = my + 'px';
    document.body.appendChild(burst);
    burst.addEventListener('animationend', () => burst.remove());
});

document.addEventListener('mouseup', () => {
    cursorDot.classList.remove('click');
});

// Hover states
document.querySelectorAll('a, button, .premium-list-item, input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('hov');
        cursorRing.classList.add('hov');
    });
    el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('hov');
        cursorRing.classList.remove('hov');
    });
});


/* ========================
   HERO CANVAS — grid + floating boxes
   ======================== */
const canvas = document.getElementById('heroCanvas');
const ctx    = canvas.getContext('2d');
let boxes    = [];

function resizeCanvas() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function spawnBox() {
    const size = Math.random() * 60 + 20;
    boxes.push({
        x:       Math.random() * canvas.width,
        y:       canvas.height + size,
        size,
        speed:   Math.random() * 0.8 + 0.6,
        rot:     Math.random() * Math.PI,
        rotS:    (Math.random() - .5) * 0.012,
        alpha:   0,
        life:    0,
        maxLife: Math.random() * 500 + 300,
    });
}

function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)';
    ctx.lineWidth = 1;
    const gSize = 60;
    for (let x = 0; x < canvas.width; x += gSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    boxes = boxes.filter(b => b.life < b.maxLife);
    boxes.forEach(b => {
        b.y   -= b.speed;
        b.rot += b.rotS;
        b.life++;
        const progress = b.life / b.maxLife;
        b.alpha = (progress < .1 ? progress / .1 : progress > .85 ? (1 - progress) / .15 : 1) * 0.55;

        ctx.save();
        ctx.translate(b.x + b.size / 2, b.y + b.size / 2);
        ctx.rotate(b.rot);
        ctx.globalAlpha  = b.alpha;
        ctx.strokeStyle  = isDark ? '#c8ff00' : '#00aaff';
        ctx.lineWidth    = 1;
        ctx.strokeRect(-b.size / 2, -b.size / 2, b.size, b.size);
        ctx.restore();
    });

    if (Math.random() < 0.07) spawnBox();
    requestAnimationFrame(drawCanvas);
}

for (let i = 0; i < 15; i++) {
    spawnBox();
    boxes[boxes.length - 1].y = Math.random() * canvas.height;
}
drawCanvas();


/* ========================
   MARQUEE — pause on hover
   ======================== */
const nameInner = document.getElementById('heroNameInner');
if (nameInner) {
    nameInner.addEventListener('mouseenter', () => nameInner.style.animationPlayState = 'paused');
    nameInner.addEventListener('mouseleave', () => nameInner.style.animationPlayState = 'running');
}


/* ========================
   ROLE TEXT ROTATOR
   ======================== */
const roleText = document.getElementById('roleText');
if (roleText) {
    const roles = ['UI/UX Designer', 'Graphic Designer', 'Web Developer', 'Social Media Specialist'];
    let roleIdx = 0;
    setInterval(() => {
        roleText.classList.add('fade-out');
        setTimeout(() => {
            roleIdx = (roleIdx + 1) % roles.length;
            roleText.textContent = roles[roleIdx];
            roleText.classList.remove('fade-out');
            roleText.classList.add('fade-in');
            setTimeout(() => roleText.classList.remove('fade-in'), 50);
        }, 400);
    }, 3000);
}


/* ========================
   ACTIVE NAV LINK (scroll spy)
   ======================== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const spyObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            navLinks.forEach(a => {
                a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
            });
        }
    });
}, { threshold: 0.4 });

sections.forEach(s => spyObs.observe(s));


/* ========================
   THEME TOGGLE — SVG sun/moon
   ======================== */
const themeBtn  = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');

// Load saved theme, default dark
const savedTheme = localStorage.getItem('sr-theme') || 'dark';
let isDark = savedTheme === 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

const SVG_SUN = `
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1"    x2="12"    y2="3"/>
    <line x1="12" y1="21"   x2="12"    y2="23"/>
    <line x1="4.22" y1="4.22"  x2="5.64"  y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12"    x2="3"     y2="12"/>
    <line x1="21" y1="12"   x2="23"    y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64"  y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
`;

const SVG_MOON = `
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
`;

function setThemeIcon() {
    themeIcon.innerHTML = isDark ? SVG_SUN : SVG_MOON;
}
setThemeIcon();

themeBtn.addEventListener('click', () => {
    isDark = !isDark;
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sr-theme', theme);
    setThemeIcon();
});


/* ========================
   HAMBURGER / MOBILE MENU
   ======================== */
const hamBtn     = document.getElementById('hamBtn');
const mobileMenu = document.getElementById('mobileMenu');

function toggleMenu(force) {
    const isOpen = force !== undefined ? force : !mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open', isOpen);
    const spans = hamBtn.querySelectorAll('span');
    if (isOpen) {
        spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[1].style.transform = 'scaleX(0)';
        spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
    } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[1].style.transform = '';
        spans[2].style.transform = '';
    }
}

hamBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleMenu();
});

mobileMenu.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const href = a.getAttribute('href');
        toggleMenu(false);
        setTimeout(function() {
            const target = document.querySelector(href);
            if (target) {
                const top = target.getBoundingClientRect().top + window.pageYOffset - 20;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        }, 250);
    });
});

document.addEventListener('click', function(e) {
    if (mobileMenu.classList.contains('open') &&
        !mobileMenu.contains(e.target) &&
        !hamBtn.contains(e.target)) {
        toggleMenu(false);
    }
});


/* ========================
   CLICK RIPPLE EFFECT
   ======================== */
document.addEventListener('click', (e) => {
    if (e.target.closest('input, textarea, button, label, #themeBtn, .hamburger, .nav-inner, .mobile-menu, .mobile-menu a')) return;
    const size = Math.max(window.innerWidth, window.innerHeight) * 0.55;
    const ripple = document.createElement('div');
    ripple.className = 'ripple-effect';
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX}px;top:${e.clientY}px;`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
});


/* ========================
   PORTFOLIO CARD SLIDER
   ======================== */
(function () {
    const track  = document.getElementById('portTrack');
    const btnP   = document.getElementById('portPrev');
    const btnN   = document.getElementById('portNext');
    if (!track || !btnP || !btnN) return;

    const gap    = 20;
    let offset   = 0;
    const cardW  = () => (track.querySelector('.port-card')?.offsetWidth || 280) + gap;
    const maxOff = () => track.scrollWidth - track.parentElement.offsetWidth;

    btnN.addEventListener('click', () => {
        offset = Math.min(offset + cardW(), maxOff());
        track.style.transform = `translateX(-${offset}px)`;
    });
    btnP.addEventListener('click', () => {
        offset = Math.max(offset - cardW(), 0);
        track.style.transform = `translateX(-${offset}px)`;
    });

    // Touch swipe
    let sx = 0;
    track.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
        const dx = sx - e.changedTouches[0].clientX;
        if (Math.abs(dx) < 40) return;
        if (dx > 0) offset = Math.min(offset + cardW(), maxOff());
        else        offset = Math.max(offset - cardW(), 0);
        track.style.transform = `translateX(-${offset}px)`;
    }, { passive: true });
})();


/* ========================
   STAT COUNTERS
   ======================== */
function startCounters() {
    document.querySelectorAll('.stat-num').forEach(el => {
        const target = +el.dataset.target;
        let cur = 0;
        const step = target / 50;
        const t = setInterval(() => {
            cur += step;
            if (cur >= target) { cur = target; clearInterval(t); }
            el.textContent = Math.ceil(cur);
        }, 30);
    });
}


/* ========================
   CONTACT FORM
   ======================== */
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const n  = document.getElementById('fname').value.trim();
    const em = document.getElementById('femail').value.trim();
    const m  = document.getElementById('fmsg').value.trim();
    let ok = true;

    document.getElementById('e-name').textContent  = !n  ? (ok = false, 'Nama wajib diisi') : '';
    if (!em) {
        document.getElementById('e-email').textContent = 'Email wajib diisi'; ok = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
        document.getElementById('e-email').textContent = 'Format email tidak valid'; ok = false;
    } else {
        document.getElementById('e-email').textContent = '';
    }
    document.getElementById('e-msg').textContent = !m ? (ok = false, 'Pesan wajib diisi') : '';

    if (ok) { alert('Pesan berhasil dikirim! Terima kasih 🙏'); this.reset(); }
});


/* ========================
   SCROLL REVEAL
   ======================== */
const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('on'); });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));


/* ========================
   TEXT SCRAMBLE (Latin/Indo only, smooth, no Jepang)
   Karakter hanya huruf Latin + angka + simbol umum
   Tidak melebihi panjang teks asli
   ======================== */

// Pool Latin + simbol — tanpa karakter Jepang/Katakana
const SCRAMBLE_POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#$%&!?-_+=';

function scrambleText(el, duration = 700) {
    const original    = el.dataset.original || el.textContent;
    el.dataset.original = original;

    const totalFrames = Math.floor(duration / 40);
    let frame = 0;

    const interval = setInterval(() => {
        const progress    = frame / totalFrames;
        // easing: lebih smooth di awal, cepat di akhir
        const easedProg   = 1 - Math.pow(1 - progress, 2);
        const revealCount = Math.floor(easedProg * original.length);

        let result = '';
        for (let i = 0; i < original.length; i++) {
            const ch = original[i];
            // spasi, tanda baca, simbol khusus langsung tampilkan
            if (ch === ' ' || ch === '\n' || ch === '—' || ch === '.' || ch === ',') {
                result += ch;
            } else if (i < revealCount) {
                result += ch;
            } else {
                result += SCRAMBLE_POOL[Math.floor(Math.random() * SCRAMBLE_POOL.length)];
            }
        }

        el.textContent = result;
        frame++;

        if (frame >= totalFrames) {
            clearInterval(interval);
            el.textContent = original; // pastikan kembali ke teks asli
        }
    }, 40);
}

// Pasang data-text untuk CSS glitch
document.querySelectorAll('.manifesto-title').forEach(el => {
    el.setAttribute('data-text', el.textContent);
});

// Trigger scramble saat heading masuk viewport
const scrambleObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.scrambled) {
            entry.target.dataset.scrambled = 'true';
            setTimeout(() => scrambleText(entry.target, 750), 100);
            scrambleObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.sec-heading, .manifesto-title, .work-title').forEach(el => {
    scrambleObs.observe(el);
});


/* pixel clock removed */


/* ========================
   TOUCH: flash on tap (for mobile)
   ======================== */
document.querySelectorAll('.premium-list-item, .work-item').forEach(el => {
    el.addEventListener('touchstart', () => {
        const splash = document.createElement('span');
        Object.assign(splash.style, {
            position:   'absolute',
            inset:      '0',
            background: 'linear-gradient(105deg, transparent 20%, rgba(200,255,0,0.18) 50%, transparent 80%)',
            transform:  'translateX(-120%)',
            animation:  'flashSweep 0.5s cubic-bezier(0.4,0,0.2,1) forwards',
            pointerEvents: 'none',
            zIndex:     '5',
        });
        el.style.position = 'relative';
        el.style.overflow = 'hidden';
        el.appendChild(splash);

        if (!document.getElementById('_flashStyle')) {
            const s = document.createElement('style');
            s.id = '_flashStyle';
            s.textContent = `@keyframes flashSweep { from{transform:translateX(-120%)} to{transform:translateX(120%)} }`;
            document.head.appendChild(s);
        }
        setTimeout(() => splash.remove(), 550);
    }, { passive: true });
});

/* ========================
   HIRE ME — MAGNET EFFECT
   Tombol bergerak mengikuti cursor seperti magnet,
   kembali ke posisi semula saat cursor keluar.
   ======================== */
(function () {
    const btn = document.querySelector('.circle-btn.liquid-btn');
    if (!btn) return;

    const wrapper = btn.closest('.manifesto-btn-wrapper') || btn.parentElement;

    // Kekuatan tarikan magnet (0–1, makin besar makin kuat)
    const STRENGTH = 0.42;
    // Radius area aktif magnet (px dari pusat tombol)
    const RADIUS = 120;

    let animId = null;
    let curX = 0, curY = 0;   // posisi target
    let posX = 0, posY = 0;   // posisi saat ini (lerp)

    function lerp(a, b, t) { return a + (b - a) * t; }

    function animate() {
        posX = lerp(posX, curX, 0.12);
        posY = lerp(posY, curY, 0.12);

        btn.style.transform = `translate(${posX}px, ${posY}px)`;

        // Hentikan animasi jika sudah sangat dekat dengan target
        if (Math.abs(posX - curX) < 0.01 && Math.abs(posY - curY) < 0.01) {
            posX = curX; posY = curY;
            btn.style.transform = `translate(${posX}px, ${posY}px)`;
            cancelAnimationFrame(animId);
            animId = null;
            return;
        }
        animId = requestAnimationFrame(animate);
    }

    function startAnim() {
        if (!animId) animId = requestAnimationFrame(animate);
    }

    // Gunakan area wrapper yang lebih besar sebagai zona magnet
    document.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const btnCX = rect.left + rect.width / 2;
        const btnCY = rect.top + rect.height / 2;

        const dx = e.clientX - btnCX;
        const dy = e.clientY - btnCY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < RADIUS) {
            // Di dalam zona magnet → tarik
            const pull = (1 - dist / RADIUS) * STRENGTH;
            curX = dx * pull * 1.8;
            curY = dy * pull * 1.8;
        } else {
            // Di luar zona magnet → kembalikan
            curX = 0;
            curY = 0;
        }
        startAnim();
    });

    // Pastikan kembali ke posisi awal kalau cursor hilang dari window
    document.addEventListener('mouseleave', () => {
        curX = 0; curY = 0;
        startAnim();
    });
})();

/* ========================
   HERO PHOTO — GLARE SWEEP
   ======================== */
(function () {
    const glare = document.getElementById('faceGlare');
    if (!glare) return;

    const SWEEP_DURATION = 2400;

    function randomInterval() {
        return 4000 + Math.random() * 3000;
    }

    function triggerGlare() {
        glare.style.animation = 'none';
        glare.style.opacity   = '0';
        glare.style.transform = 'translateX(0%)';
        void glare.offsetWidth; // force reflow
        glare.style.animation = `glareSweep ${SWEEP_DURATION}ms ease-in-out forwards`;
        setTimeout(triggerGlare, SWEEP_DURATION + randomInterval());
    }

    setTimeout(triggerGlare, 3200);
})();

/* ========================
   MASONRY PORTFOLIO SLIDESHOW
   ======================== */
(function () {
    const INTERVAL = 3000; // ms per slide

    document.querySelectorAll('.masonry-card').forEach(card => {
        const slidesRaw = card.dataset.slides;
        if (!slidesRaw) return;

        let slides;
        try { slides = JSON.parse(slidesRaw); } catch(e) { return; }
        if (!slides || slides.length < 2) return;

        const img          = card.querySelector('.masonry-img');
        const dotsWrap     = card.querySelector('.masonry-dots');
        const progressFill = card.querySelector('.masonry-progress-fill');
        const playBtn      = card.querySelector('.masonry-play-btn');
        const iconPlay     = playBtn.querySelector('.icon-play');
        const iconPause    = playBtn.querySelector('.icon-pause');

        let current  = 0;
        let isPlaying = false;
        let timer    = null;
        let progressTimer = null;
        let progressStart = null;

        // Build dot indicators
        slides.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.className = 'masonry-dot' + (i === 0 ? ' active' : '');
            dotsWrap.appendChild(dot);
        });

        function getDots() { return dotsWrap.querySelectorAll('.masonry-dot'); }

        function goTo(index) {
            const dots = getDots();
            dots[current].classList.remove('active');
            current = (index + slides.length) % slides.length;
            dots[current].classList.add('active');

            // Crossfade
            img.classList.add('slide-out');
            setTimeout(() => {
                img.src = slides[current];
                img.classList.remove('slide-out');
                img.classList.add('slide-in');
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        img.classList.remove('slide-in');
                        img.classList.add('slide-active');
                    });
                });
            }, 280);

            // Reset progress
            clearProgressBar();
            if (isPlaying) startProgressBar();
        }

        function startProgressBar() {
            progressFill.style.transition = 'none';
            progressFill.style.width = '0%';
            requestAnimationFrame(() => {
                progressFill.style.transition = `width ${INTERVAL}ms linear`;
                progressFill.style.width = '100%';
            });
        }

        function clearProgressBar() {
            progressFill.style.transition = 'none';
            progressFill.style.width = '0%';
        }

        function play() {
            isPlaying = true;
            card.classList.add('is-playing');
            iconPlay.style.display = 'none';
            iconPause.style.display = '';
            startProgressBar();
            timer = setInterval(() => goTo(current + 1), INTERVAL);
        }

        function pause() {
            isPlaying = false;
            card.classList.remove('is-playing');
            iconPlay.style.display = '';
            iconPause.style.display = 'none';
            clearProgressBar();
            clearInterval(timer);
        }

        // Click play button
        playBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (isPlaying) pause(); else play();
        });

        // Click card image to go to next slide (if playing)
        card.querySelector('.masonry-img-wrap').addEventListener('click', function(e) {
            if (e.target === playBtn || playBtn.contains(e.target)) return;
            if (isPlaying) {
                clearInterval(timer);
                goTo(current + 1);
                timer = setInterval(() => goTo(current + 1), INTERVAL);
            } else {
                goTo(current + 1);
            }
        });

        // Init image class
        img.classList.add('slide-active');
        img.onerror = function() {
            this.style.display = 'none';
            const fb = card.querySelector('.masonry-fallback');
            if (fb) fb.style.display = 'flex';
        };
    });
})();