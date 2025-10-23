// scripts.js
// Handles theme toggle, smooth scrolling, scrollspy, back-to-top, progress bar, AOS init and counters.
// Author: Generated for Damilare Ogunlana

(function () {
    'use strict';

    // Cached elements
    const htmlEl = document.documentElement;
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const backToTopBtn = document.getElementById('backToTop');
    const progressBar = document.getElementById('progress-bar');
    const navLinks = document.querySelectorAll('.navbar .nav-link');
    const sections = document.querySelectorAll('main section[id], main [role="article"], main article');
    const counters = document.querySelectorAll('.counter');

    // Helper: set theme
   function setTheme(theme, persist = true) {
    if (theme === 'dark') {
        htmlEl.classList.remove('theme-light');
        htmlEl.classList.add('theme-dark');
        htmlEl.setAttribute('data-theme', 'dark'); // added for CSS targeting
        themeToggle.setAttribute('aria-pressed', 'true');
        themeIcon.className = 'bi bi-sun-fill';
        if (persist) localStorage.setItem('site-theme', 'dark');
    } else {
        htmlEl.classList.remove('theme-dark');
        htmlEl.classList.add('theme-light');
        htmlEl.setAttribute('data-theme', 'light'); // added for CSS targeting
        themeToggle.setAttribute('aria-pressed', 'false');
        themeIcon.className = 'bi bi-moon-stars-fill';
        if (persist) localStorage.setItem('site-theme', 'light');
    }
    // update meta theme-color for mobile
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute('content', theme === 'dark' ? '#000000' : '#0d9488');
}

    // Initialize theme based on preference/localStorage
    function initTheme() {
        const saved = localStorage.getItem('site-theme');
        if (saved) {
            setTheme(saved, false);
            return;
        }
        // Default to light mode if nothing is saved
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme('light', false); // Always start in light mode
    }

    // Toggle theme button
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = htmlEl.classList.contains('theme-dark');
            setTheme(isDark ? 'light' : 'dark', true);
            themeToggle.blur();
        });
    }

    // Smooth scroll to anchors with offset for sticky nav
    function offsetScrollIntoView(elem) {
        const nav = document.querySelector('.navbar');
        const navHeight = nav ? nav.offsetHeight + 8 : 0;
        const top = elem.getBoundingClientRect().top + window.pageYOffset - navHeight;
        // Respect prefers-reduced-motion
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) {
            window.scrollTo(0, top);
        } else {
            window.scrollTo({ top, behavior: 'smooth' });
        }
    }

    // Attach smooth scrolling to nav links and internal links
    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;
        const href = anchor.getAttribute('href');
        if (href === '#' || href === '') return;
        const targetId = href.slice(1);
        const target = document.getElementById(targetId);
        if (target) {
            e.preventDefault();
            offsetScrollIntoView(target);
            // update hash without jump
            history.replaceState(null, '', '#' + targetId);
        }
    });

    // Scrollspy via IntersectionObserver
    const spyOptions = {
        root: null,
        rootMargin: '0px 0px -45% 0px', // trigger when section top is near middle
        threshold: 0
    };
    const linkMap = {};
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            linkMap[href.slice(1)] = link;
        }
    });

    function onSectionIntersect(entries) {
        entries.forEach(entry => {
            const id = entry.target.id;
            const link = linkMap[id];
            if (!link) return;
            if (entry.isIntersecting) {
                navLinks.forEach(n => n.classList.remove('active'));
                link.classList.add('active');
            }
        });
    }
    const spyObserver = new IntersectionObserver(onSectionIntersect, spyOptions);
    sections.forEach(sec => { if (sec.id) spyObserver.observe(sec); });

    // Progress bar
    function updateProgress() {
        const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - window.innerHeight;
        const percent = docHeight > 0 ? Math.min(100, Math.round((window.scrollY / docHeight) * 100)) : 0;
        progressBar.style.width = percent + '%';
        progressBar.setAttribute('aria-valuenow', String(percent));
    }

    // Back-to-top visibility
    function updateBackToTop() {
        if (!backToTopBtn) return;
        const show = window.scrollY > 360;
        if (show) backToTopBtn.removeAttribute('hidden'); else backToTopBtn.setAttribute('hidden', '');
    }
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (reduce) window.scrollTo(0, 0);
            else window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Debounced scroll handler for performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateProgress();
                updateBackToTop();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Initialize AOS with stronger dynamic animation style
    function initAOS() {
        if (window.AOS) {
            AOS.init({
                duration: 700,
                once: true,
                disable: function() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
            });
        }
    }

    // Counters: start when visible (IntersectionObserver)
    function initCounters() {
        if (!counters || counters.length === 0) return;
        const counterObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    // animate
                    const target = parseFloat(el.getAttribute('data-target')) || 0;
                    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                    if (reduce) {
                        el.textContent = String(target);
                    } else {
                        let current = parseFloat(el.textContent) || 0;
                        const increment = target > 100 ? Math.ceil(target / 40) : (target < 10 ? 0.1 : 1);
                        const step = () => {
                            current = Math.round((current + increment) * 10) / 10;
                            if (current >= target) {
                                el.textContent = String(target);
                            } else {
                                el.textContent = String(current);
                                setTimeout(step, 20);
                            }
                        };
                        step();
                    }
                    obs.unobserve(el);
                }
            });
        }, { threshold: 0.4 });
        counters.forEach(c => counterObserver.observe(c));
    }

    // Mark sections visible for CSS fade-in when AOS or JS triggers
    function markVisibleSections() {
        const visibleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('aos-in');
            });
        }, { root: null, threshold: 0.08 });
        document.querySelectorAll('.section-card').forEach(s => visibleObserver.observe(s));
    }

    // DOM ready
    document.addEventListener('DOMContentLoaded', () => {
        initTheme();
        initAOS();
        initCounters();
        markVisibleSections();
        updateProgress();
        updateBackToTop();

        // Allow keyboard activation for project cards
        document.querySelectorAll('.project-card[role="button"]').forEach(card => {
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
        });

        // Ensure initial scrollspy state matches current scroll
        setTimeout(() => {
            // run a fake intersection by updating progress (will trigger observer callbacks)
            updateProgress();
        }, 300);
    });

    // Expose setTheme for debugging (optional)
    window.setSiteTheme = setTheme;

})();
