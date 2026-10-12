(() => {
  const availableThemes = ['purple', 'winter', 'bubblegum', 'autumn'];
  const defaultTheme = 'autumn';
  const themeKey = 'site-theme';
  const migrationKey = 'site-theme-v2-migrated';
  let theme = localStorage.getItem(themeKey);

  if (localStorage.getItem(migrationKey) !== 'true') {
    if (theme === 'bubblegum') theme = 'winter';
    if (theme) localStorage.setItem(themeKey, theme);
    localStorage.setItem(migrationKey, 'true');
  }

  window.SITE_DEFAULT_THEME = availableThemes.includes(defaultTheme) ? defaultTheme : 'purple';
  document.documentElement.dataset.theme = availableThemes.includes(theme) ? theme : window.SITE_DEFAULT_THEME;
})();
