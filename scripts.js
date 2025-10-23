// ===== SMOOTH THEME TOGGLE =====
// Features: Light/Dark toggle, localStorage persistence,
// system sync, true black mode, and smooth fade transitions.

(() => {
  const htmlEl = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  const storageKey = 'site-theme';

  /**
   * Apply theme with fade transition
   */
  function setTheme(theme, persist = true) {
    const isDark = theme === 'dark';

    // Add temporary transition class
    htmlEl.classList.add('theme-transition');

    // Set HTML theme attributes
    htmlEl.classList.toggle('theme-dark', isDark);
    htmlEl.classList.toggle('theme-light', !isDark);
    htmlEl.setAttribute('data-theme', theme);

    // Update button icon
    themeIcon.className = isDark ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
    themeToggle?.setAttribute('aria-pressed', isDark.toString());

    // Save preference
    if (persist) localStorage.setItem(storageKey, theme);

    // Update browser meta color (for mobile)
    if (metaTheme) metaTheme.setAttribute('content', isDark ? '#000000' : '#0d9488');

    // Remove transition class after animation
    setTimeout(() => htmlEl.classList.remove('theme-transition'), 600);
  }

  function getPreferredTheme() {
    const stored = localStorage.getItem(storageKey);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function toggleTheme() {
    const current = htmlEl.getAttribute('data-theme') || getPreferredTheme();
    setTheme(current === 'dark' ? 'light' : 'dark');
  }

  function initTheme() {
    setTheme(getPreferredTheme(), false);

    // React to system preference changes (only if no manual override)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem(storageKey)) setTheme(e.matches ? 'dark' : 'light', false);
    });

    themeToggle?.addEventListener('click', toggleTheme);
  }

  document.addEventListener('DOMContentLoaded', initTheme);
})();
