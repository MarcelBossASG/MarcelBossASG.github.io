const SITE_THEME_CREDITS = {
  purple: '',
  winter: 'Background art: @yorunogumo',
  bubblegum: '',
  autumn: ''
};
const SITE_SETTINGS_KEYS = {
  theme: 'site-theme',
  snow: 'site-snow',
  language: 'site-language',
  imageOptimization: 'site-image-quality'
};

function addSiteSettings() {
  const settings = document.createElement('aside');
  settings.className = 'site-settings';
  settings.innerHTML = `
    <button class="site-settings-tab" type="button" aria-expanded="false" aria-controls="site-settings-panel" aria-label="Open site settings">
    </button>
    <div class="site-settings-panel" id="site-settings-panel" aria-hidden="true" inert>
      <h2>Customize</h2>
      <label>
        Theme
        <select name="theme">
          <option value="purple">Purple</option>
          <option value="winter">Winter</option>
          <option value="bubblegum">Bubblegum</option>
          <option value="autumn">Autumn</option>
        </select>
      </label>
      <label class="site-settings-checkbox">
        <input name="snow" type="checkbox">
        Snow
      </label>
      <label class="site-settings-checkbox">
        <input name="imageOptimization" type="checkbox">
        Optimize image loading
      </label>
      <small class="site-settings-note">Loads images as needed and decodes them asynchronously. Image quality is unchanged.</small>
      <label>
        Language
        <select name="language">
          <option value="en">English</option>
        </select>
      </label>
    </div>
  `;
  document.body.appendChild(settings);

  const button = settings.querySelector('.site-settings-tab');
  const panel = settings.querySelector('.site-settings-panel');
  const themeSelect = settings.querySelector('[name="theme"]');
  const snowCheckbox = settings.querySelector('[name="snow"]');
  const imageOptimizationCheckbox = settings.querySelector('[name="imageOptimization"]');
  const languageSelect = settings.querySelector('[name="language"]');

  const savedTheme = localStorage.getItem(SITE_SETTINGS_KEYS.theme);
  const savedSnow = localStorage.getItem(SITE_SETTINGS_KEYS.snow);
  const savedLanguage = localStorage.getItem(SITE_SETTINGS_KEYS.language);
  const savedImageOptimization = localStorage.getItem(SITE_SETTINGS_KEYS.imageOptimization);
  const defaultTheme = window.SITE_DEFAULT_THEME;
  const availableThemes = Array.from(themeSelect.options, option => option.value);
  const defaultThemeOption = themeSelect.querySelector(`option[value="${defaultTheme}"]`);
  if (defaultThemeOption) defaultThemeOption.textContent += ' [Default]';
  const theme = availableThemes.includes(savedTheme) ? savedTheme : defaultTheme;
  const language = savedLanguage === 'en' ? savedLanguage : 'en';

  document.documentElement.dataset.theme = theme;
  themeSelect.value = theme;
  languageSelect.value = language;
  snowCheckbox.checked = savedSnow !== 'false';
  imageOptimizationCheckbox.checked = savedImageOptimization !== 'false';
  let imageOptimizationEnabled = imageOptimizationCheckbox.checked;
  document.documentElement.dataset.imageOptimization = String(imageOptimizationEnabled);

  function configureImageLoading(image) {
    image.loading = imageOptimizationEnabled ? 'lazy' : 'eager';
    image.decoding = imageOptimizationEnabled ? 'async' : 'auto';
  }

  function configureImages(root) {
    if (root instanceof HTMLImageElement) configureImageLoading(root);
    root.querySelectorAll?.('img').forEach(configureImageLoading);
  }

  configureImages(document);
  const imageObserver = new MutationObserver(records => {
    records.forEach(record => {
      record.addedNodes.forEach(configureImages);
    });
  });
  imageObserver.observe(document.body, { childList: true, subtree: true });

  button.addEventListener('click', () => {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    setExpanded(!isExpanded);
  });

  function setExpanded(expanded) {
    button.setAttribute('aria-expanded', String(expanded));
    button.setAttribute('aria-label', expanded ? 'Close site settings' : 'Open site settings');
    panel.setAttribute('aria-hidden', String(!expanded));
    panel.inert = !expanded;
    settings.classList.toggle('expanded', expanded);
  }

  themeSelect.addEventListener('change', () => {
    const theme = themeSelect.value;
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(SITE_SETTINGS_KEYS.theme, theme);
    const watermark = document.querySelector('.background-credit');
    if (watermark) watermark.textContent = SITE_THEME_CREDITS[theme];
  });

  snowCheckbox.addEventListener('change', () => {
    localStorage.setItem(SITE_SETTINGS_KEYS.snow, String(snowCheckbox.checked));
    window.dispatchEvent(new CustomEvent('site-snow-change', { detail: snowCheckbox.checked }));
  });

  imageOptimizationCheckbox.addEventListener('change', () => {
    imageOptimizationEnabled = imageOptimizationCheckbox.checked;
    document.documentElement.dataset.imageOptimization = String(imageOptimizationEnabled);
    configureImages(document);
    localStorage.setItem(SITE_SETTINGS_KEYS.imageOptimization, String(imageOptimizationCheckbox.checked));
  });

  languageSelect.addEventListener('change', () => {
    localStorage.setItem(SITE_SETTINGS_KEYS.language, languageSelect.value);
  });

  document.addEventListener('click', event => {
    if (!settings.contains(event.target)) {
      setExpanded(false);
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      setExpanded(false);
      button.focus();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  addSiteSettings();

  document.querySelectorAll('.copy-discord-tag').forEach(button => {
    button.addEventListener('click', async () => {
      if (!navigator.clipboard?.writeText) {
        window.alert('Clipboard access is unavailable in this browser.');
        return;
      }

      try {
        await navigator.clipboard.writeText('marcelbossasg');
        window.alert('Discord tag copied: marcelbossasg');
      } catch {
        window.alert('Could not copy the Discord tag. Please copy it manually: marcelbossasg');
      }
    });
  });

  const mainContent = document.querySelector('.main-content');
  if (mainContent) {
    const watermark = document.createElement('small');
    watermark.className = 'background-credit';
    watermark.textContent = SITE_THEME_CREDITS[document.documentElement.dataset.theme];
    mainContent.appendChild(watermark);
  }

  const aboutPage = document.querySelector('.about-page');
  if (aboutPage) {
    const floatingLayer = aboutPage.querySelector('.about-floating-text');
    const floatingQuotes = [
      // Add entries here. Use \n for a line break and leave author empty for plain text.
      {
        text: 'If you notice this send me a DM',
        author: '@MarcelBossASG'
      }
    ];
    const floatingItems = [];

    for (let i = floatingQuotes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [floatingQuotes[i], floatingQuotes[j]] = [floatingQuotes[j], floatingQuotes[i]];
    }

    const selectedQuotes = floatingQuotes.slice(0, 10);
    selectedQuotes.forEach(quote => {
      const element = document.createElement('div');
      element.className = 'about-floating-quote';
      quote.text.split('\n').forEach((line, lineIndex) => {
        if (lineIndex > 0) element.appendChild(document.createElement('br'));
        element.appendChild(document.createTextNode(line));
      });
      if (quote.author) {
        const author = document.createElement('span');
        author.className = 'about-floating-author';
        author.textContent = `— ${quote.author}`;
        element.appendChild(author);
      }
      floatingLayer.appendChild(element);
      floatingItems.push({
        element,
        x: 0,
        y: 0,
        vx: (Math.random() < 0.5 ? -1 : 1) * (7 + Math.random() * 7),
        vy: (Math.random() < 0.5 ? -1 : 1) * (5 + Math.random() * 6),
        width: 0,
        height: 0
      });
    });

    let hasInitialPositions = false;
    function positionFloatingItems() {
      const width = floatingLayer.clientWidth;
      const height = floatingLayer.clientHeight;

      floatingItems.forEach(item => {
        item.width = item.element.offsetWidth;
        item.height = item.element.offsetHeight;
        const maxX = Math.max(0, width - item.width);
        const maxY = Math.max(0, height - item.height);
        if (hasInitialPositions) {
          item.x = Math.min(item.x, maxX);
          item.y = Math.min(item.y, maxY);
        } else {
          const edge = Math.floor(Math.random() * 4);
          item.x = edge === 1
            ? maxX
            : edge === 3
              ? 0
              : Math.random() * maxX;
          item.y = edge === 0
            ? 0
            : edge === 2
              ? maxY
              : Math.random() * maxY;
        }
        item.element.style.transform = `translate(${item.x}px, ${item.y}px)`;
      });
      hasInitialPositions = true;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let animationFrame = 0;
    let previousFrame = 0;

    function shouldPauseFloatingAnimation() {
      return document.hidden || reducedMotion.matches;
    }

    function advanceFloatingAxis(position, velocity, maximum, delta) {
      if (maximum <= 0) return [0, 0];

      position += velocity * delta;
      while (position < 0 || position > maximum) {
        if (position < 0) {
          position = -position;
          velocity = Math.abs(velocity);
        } else {
          position = 2 * maximum - position;
          velocity = -Math.abs(velocity);
        }
      }

      return [position, velocity];
    }

    function animateFloatingItems(timestamp) {
      animationFrame = 0;
      if (shouldPauseFloatingAnimation()) return;

      const delta = previousFrame
        ? (timestamp - previousFrame) / 1000
        : 0;
      previousFrame = timestamp;

      const width = floatingLayer.clientWidth;
      const height = floatingLayer.clientHeight;
      floatingItems.forEach(item => {
        const maxX = Math.max(0, width - item.width);
        const maxY = Math.max(0, height - item.height);
        [item.x, item.vx] = advanceFloatingAxis(item.x, item.vx, maxX, delta);
        [item.y, item.vy] = advanceFloatingAxis(item.y, item.vy, maxY, delta);

        item.element.style.transform = `translate(${item.x}px, ${item.y}px)`;
      });

      animationFrame = window.requestAnimationFrame(animateFloatingItems);
    }

    function startFloatingAnimation() {
      if (!shouldPauseFloatingAnimation() && !animationFrame) {
        previousFrame = 0;
        animationFrame = window.requestAnimationFrame(animateFloatingItems);
      }
    }

    function updateFloatingAnimation() {
      positionFloatingItems();
      if (shouldPauseFloatingAnimation()) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
        previousFrame = 0;
      } else {
        startFloatingAnimation();
      }
    }

    positionFloatingItems();
    startFloatingAnimation();
    window.addEventListener('resize', updateFloatingAnimation);
    document.addEventListener('visibilitychange', updateFloatingAnimation);
    reducedMotion.addEventListener('change', updateFloatingAnimation);
  }

  const hamburger = document.querySelector('.hamburger-menu');
  const mobileNav = document.querySelector('.mobile-nav');
  const backdrop = document.querySelector('.mobile-nav-backdrop');
  const topbar = document.querySelector('.topbar');

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    backdrop.classList.remove('open');
    topbar.classList.remove('menu-open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
  }

  function openMenu() {
    hamburger.classList.add('open');
    mobileNav.classList.add('open');
    backdrop.classList.add('open');
    topbar.classList.add('menu-open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileNav.setAttribute('aria-hidden', 'false');
  }

  hamburger.addEventListener('click', () =>
    mobileNav.classList.contains('open') ? closeMenu() : openMenu()
  );
  backdrop.addEventListener('click', closeMenu);
  mobileNav.querySelectorAll('a').forEach(link =>
    link.addEventListener('click', closeMenu)
  );
  window.addEventListener('resize', () => {
    if (window.innerWidth > 700) closeMenu();
  });

  window.addEventListener('load', () => {
    document.querySelector('.main-content')?.classList.add('loaded');
  });

  const textElements = Array.from(document.querySelectorAll('.main-content p'))
    .filter(el => !el.closest('.project-box'));
  const projectBoxes = document.querySelectorAll('.project-box');
  const irlItems = document.querySelectorAll('.irl-item');

  const TEXT_STAGGER = 0.2;
  const PROJECT_STAGGER = 0.65;
  const IRL_STAGGER = 0.3;

  function applyStagger(elements, stagger) {
    elements.forEach((el, i) => {
      el.classList.add('pop-in');
      el.style.setProperty('--delay', `${i * stagger}s`);
    });
  }

  setTimeout(() => {
    applyStagger(textElements, TEXT_STAGGER);
    applyStagger(projectBoxes, PROJECT_STAGGER);
    applyStagger(irlItems, IRL_STAGGER);
  }, 50);

  const canvas = document.createElement('canvas');
  canvas.classList.add('snow-canvas');
  Object.assign(canvas.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    zIndex: '-1'
  });
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let snowEnabled = localStorage.getItem(SITE_SETTINGS_KEYS.snow) !== 'false';
  let snowAnimationRunning = false;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function setSnowEnabled(enabled) {
    snowEnabled = enabled;
    const shouldAnimate = enabled && !reducedMotion.matches;
    canvas.style.display = shouldAnimate
      ? 'block'
      : 'none';
    if (shouldAnimate && !snowAnimationRunning) {
      snowAnimationRunning = true;
      requestAnimationFrame(animateSnow);
    }
  }

  setSnowEnabled(snowEnabled);
  reducedMotion.addEventListener('change', () => setSnowEnabled(snowEnabled));
  window.addEventListener('site-snow-change', event => {
    setSnowEnabled(event.detail);
  });

  function updateCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  updateCanvasSize();
  window.addEventListener('resize', updateCanvasSize);

  const snowflakes = [];
  for (let i = 0; i < (window.innerWidth < 768 ? 80 : 150); i++) {
    snowflakes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 3 + 1,
      speed: Math.random() * 0.2 + 0.6
    });
  }

  function drawSnowflakes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    snowflakes.forEach(flake => {
      ctx.beginPath();
      ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function updateSnowflakes() {
    snowflakes.forEach(flake => {
      flake.y += flake.speed;
      if (flake.y > canvas.height) {
        flake.y = -flake.radius;
        flake.x = Math.random() * canvas.width;
      }
    });
  }

  let lastFrame = 0;
  function animateSnow(timestamp) {
    if (!snowEnabled || reducedMotion.matches) {
      snowAnimationRunning = false;
      return;
    }
    if (timestamp - lastFrame > 33) {
      drawSnowflakes();
      updateSnowflakes();
      lastFrame = timestamp;
    }
    requestAnimationFrame(animateSnow);
  }
  // IRL accordion: accessible toggle handlers for `.irl-toggle` buttons
  (function(){
    // Create overlay element used for the expand animation
    const overlay = document.createElement('div');
    overlay.className = 'irl-overlay';
    overlay.innerHTML = `
      <button class="irl-overlay-close" type="button" aria-label="Close">✕</button>
      <div class="irl-overlay-inner" role="dialog" aria-modal="true"></div>
      <div class="irl-overlay-bottom" aria-hidden="true"></div>
    `;
    document.body.appendChild(overlay);
    const overlayInner = overlay.querySelector('.irl-overlay-inner');
    const overlayClose = overlay.querySelector('.irl-overlay-close');
    const imageLightbox = document.createElement('div');
    imageLightbox.className = 'image-lightbox';
    imageLightbox.setAttribute('role', 'dialog');
    imageLightbox.setAttribute('aria-modal', 'true');
    imageLightbox.setAttribute('aria-label', 'Image preview');
    imageLightbox.hidden = true;
    imageLightbox.innerHTML = `
      <img alt="" tabindex="-1">
    `;
    document.body.appendChild(imageLightbox);
    const lightboxImage = imageLightbox.querySelector('img');
    let lightboxTrigger = null;

    document.querySelectorAll('.irl-gallery-art img, .irl-gallery-photos img').forEach(img => {
      img.tabIndex = 0;
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', `View image: ${img.alt}`);
    });

    function closeImageLightbox() {
      imageLightbox.hidden = true;
      lightboxImage.removeAttribute('src');
      delete lightboxImage.dataset.tooltip;
      document.dispatchEvent(new Event('site-hide-tooltip'));
      lightboxTrigger?.focus();
    }

    function openImageLightbox(img) {
      lightboxTrigger = img;
      lightboxImage.src = img.currentSrc || img.getAttribute('src') || img.dataset.src;
      lightboxImage.alt = img.alt;
      if (img.dataset.tooltip) {
        lightboxImage.dataset.tooltip = img.dataset.tooltip;
      }
      imageLightbox.hidden = false;
      lightboxImage.focus();
    }

    document.addEventListener('click', event => {
      if (!(event.target instanceof Element)) return;
      const img = event.target.closest('.irl-gallery-art img, .irl-gallery-photos img');
      if (img) openImageLightbox(img);
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !imageLightbox.hidden) {
        event.stopImmediatePropagation();
        closeImageLightbox();
        return;
      }
      if (!(event.target instanceof HTMLImageElement) ||
          !event.target.matches('.irl-gallery-art img, .irl-gallery-photos img') ||
          (event.key !== 'Enter' && event.key !== ' ')) return;
      event.preventDefault();
      openImageLightbox(event.target);
    });

    imageLightbox.addEventListener('click', event => {
      if (event.target === imageLightbox) closeImageLightbox();
    });

    let overlayMediaObserver = null;
    let openingTransitionHandler = null;
    let overlayTrigger = null;

    function loadOverlayMedia(container) {
      overlayMediaObserver?.disconnect();

      const mediaElements = container.querySelectorAll('img[data-src], iframe[data-src]');
      const loadMedia = media => {
        const source = media.dataset.src;
        if (!source) return;
        if (media instanceof HTMLImageElement) {
          media.loading = document.documentElement.dataset.imageOptimization === 'false'
            ? 'eager'
            : 'lazy';
          media.decoding = document.documentElement.dataset.imageOptimization === 'false'
            ? 'auto'
            : 'async';
        }
        media.src = source;
        media.removeAttribute('data-src');
      };

      if (document.documentElement.dataset.imageOptimization === 'false') {
        mediaElements.forEach(loadMedia);
        return;
      }

      if (!('IntersectionObserver' in window)) {
        mediaElements.forEach(loadMedia);
        return;
      }

      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          const media = entry.target;
          loadMedia(media);
          observer.unobserve(media);
        });
      }, {
        root: container,
        rootMargin: '300px 0px'
      });
      overlayMediaObserver = observer;

      mediaElements.forEach(media => {
        overlayMediaObserver.observe(media);
      });
    }

    function openOverlayFromButton(btn, panel) {
      overlayTrigger = btn;
      const rect = btn.getBoundingClientRect();
      // use viewport coordinates (no scroll offsets) because overlay is fixed
      const start = { left: rect.left, top: rect.top, width: rect.width, height: rect.height, radius: window.getComputedStyle(btn).borderRadius || '8px' };
      // save previous body overflow and prevent body scrolling while overlay is open
      overlay._prevBodyOverflow = document.body.style.overflow || '';
      document.body.style.overflow = 'hidden';
      // copy panel content into overlay
      overlayInner.innerHTML = panel.innerHTML;
      overlayInner.style.visibility = 'hidden';
      // set initial geometry (viewport coordinates)
      overlay.style.position = 'fixed';
      overlay.style.left = start.left + 'px';
      overlay.style.top = start.top + 'px';
      overlay.style.width = start.width + 'px';
      overlay.style.height = start.height + 'px';
      overlay.style.borderRadius = start.radius;
      overlay.style.transform = 'none';
      overlay.classList.remove('closing');
      overlay._start = start;
      // show overlay element (kept overflow:hidden via CSS)
      overlay.style.display = 'block';
      overlay.classList.add('open');

      // ensure inner pane doesn't scroll during the expand animation
      overlayInner.style.overflow = 'hidden';

      // target geometry (10px gap from viewport edges), anchored top-left
      const topbarRect = document.querySelector('.topbar')?.getBoundingClientRect();
      const targetTop = topbarRect ? Math.round(topbarRect.bottom) : 0; // flush under topbar
      // cover down to the bottom of the viewport (will overlap the bottombar)
      const targetHeight = Math.max(200, window.innerHeight - targetTop);

      function onOpenEnd(e) {
        if (e.target !== overlay) return;
        if (e.propertyName !== 'height') return; // 🔥 critical fix

        overlay.removeEventListener('transitionend', onOpenEnd);
        openingTransitionHandler = null;

        overlayInner.style.overflow = 'auto';

        const overlayRect = overlay.getBoundingClientRect();
        const innerTop = overlayInner.getBoundingClientRect().top - overlayRect.top;
        const cs = window.getComputedStyle(overlayInner);
        const padBottom = parseFloat(cs.paddingBottom) || 0;

        const bottomBar = overlay.querySelector('.irl-overlay-bottom');
        const bottomBarHeight = bottomBar ? Math.round(bottomBar.getBoundingClientRect().height) : 0;

        const safety = 6;

        overlayInner.style.height =
          Math.max(
            120,
            Math.floor(
              overlayRect.height - innerTop - padBottom - bottomBarHeight - safety
            )
          ) + 'px';

        overlayInner.style.maxHeight = 'none';
        overlayInner.scrollTop = 0;
        overlayInner.setAttribute('tabindex', '0');
        overlayInner.focus();

        overlayInner.style.visibility = 'visible';

        overlayInner.classList.add('visible');
        loadOverlayMedia(overlayInner);

        // Stagger the actual blog post content instead of animating its wrapper as one item.
        const blogContent = overlayInner.querySelector('.blog-post-content');
        const groups = blogContent
          ? Array.from(blogContent.children)
          : Array.from(overlayInner.children);

        groups.forEach((group, i) => {
          group.classList.add('pop-in');
          group.style.setProperty('--delay', `${i * 0.2}s`);

          // animate images inside gallery slightly after group
          const inner = group.querySelectorAll('.irl-gallery > *');
          inner.forEach((el, j) => {
            el.classList.add('pop-in');
            el.style.setProperty('--delay', `${i * 0.2 + j * 0.08}s`);
          });
        });
      }
      
      openingTransitionHandler = onOpenEnd;
      overlay.addEventListener('transitionend', onOpenEnd);

      // use native scrolling and prevent scroll chaining using CSS 'overscroll-behavior'
      // (no manual wheel/touch handlers here to keep scrolling smooth)

      // trigger transition to target (anchor to topbar, flush-left)
      requestAnimationFrame(() => {
        overlay.style.right = '0px';
        overlay.style.left = '0px';
        overlay.style.top = targetTop + 'px';
        overlay.style.width = '100vw';
        overlay.style.height = targetHeight + 'px';
        overlay.style.borderRadius = '0px';
      });
    }

    function closeOverlay() {
      if (overlay.classList.contains('closing')) return;
      overlayMediaObserver?.disconnect();
      overlayMediaObserver = null;
      if (openingTransitionHandler) {
        overlay.removeEventListener('transitionend', openingTransitionHandler);
        openingTransitionHandler = null;
      }
      // animate inner content out
      overlayInner.classList.remove('visible');
      overlayInner.style.overflow = 'hidden';

      const current = overlay.getBoundingClientRect();
      const start = overlay._start || {
        left: 10,
        top: 10,
        width: 200,
        height: 48,
        radius: '8px'
      };
      overlay.style.right = 'auto';
      overlay.style.left = current.left + 'px';
      overlay.style.top = current.top + 'px';
      overlay.style.width = current.width + 'px';
      overlay.style.height = current.height + 'px';
      overlay.style.borderRadius = start.radius || '8px';
      overlay.classList.add('closing');

      requestAnimationFrame(() => {
        overlay.style.transform =
          `translate(${start.left - current.left}px, ${start.top - current.top}px) ` +
          `scale(${start.width / current.width}, ${start.height / current.height})`;
      });

      const onEnd = event => {
        if (event.target !== overlay || event.propertyName !== 'transform') return;
        overlay.removeEventListener('transitionend', onEnd);
        overlay.style.display = 'none';
        overlay.classList.remove('open');
        overlay.classList.remove('closing');
        overlay.style.transform = 'none';
        overlayInner.innerHTML = '';
        overlayInner.style.height = '';
        // restore body scroll
        document.body.style.overflow = overlay._prevBodyOverflow || '';
        overlayTrigger?.focus();
        overlayTrigger = null;
      };
      overlay.addEventListener('transitionend', onEnd);
    }

    overlayClose.addEventListener('click', closeOverlay);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && imageLightbox.hidden && overlay.classList.contains('open')) closeOverlay();
    });

    const toggles = document.querySelectorAll('.irl-toggle');
    toggles.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const panelId = btn.getAttribute('aria-controls');
        const panel = document.getElementById(panelId);
        if (!panel) return;
        // open overlay with panel content
        openOverlayFromButton(btn, panel);
      });
    });

  })();

});

window.addEventListener("DOMContentLoaded", () => {
  const tooltip = document.createElement("div");
  tooltip.className = "tooltip";
  document.body.appendChild(tooltip);

  let activeElement = null;
  let lastPointer = null;
  let tooltipRefreshScheduled = false;

  function hideTooltip() {
    activeElement = null;
    tooltip.classList.remove("show");
  }

  document.addEventListener("site-hide-tooltip", hideTooltip);

  function positionTooltip(pointerX, pointerY) {
    const margin = 8;
    const gap = 14;
    const bounds = tooltip.getBoundingClientRect();
    const maxLeft = Math.max(margin, window.innerWidth - bounds.width - margin);
    const maxTop = Math.max(margin, window.innerHeight - bounds.height - margin);
    const left = Math.min(
      Math.max(pointerX + gap + bounds.width > window.innerWidth - margin
        ? pointerX - bounds.width - gap
        : pointerX + gap, margin),
      maxLeft
    );
    const top = Math.min(
      Math.max(pointerY + gap + bounds.height > window.innerHeight - margin
        ? pointerY - bounds.height - gap
        : pointerY + gap, margin),
      maxTop
    );

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }

  function showTooltip(element, pointerX, pointerY) {
    if (activeElement !== element) {
      tooltip.innerHTML = element.dataset.tooltip;
    }
    activeElement = element;
    tooltip.classList.add("show");
    positionTooltip(pointerX, pointerY);
  }

  function refreshTooltip() {
    if (!lastPointer || lastPointer.pointerType === "touch") return;
    const target = document.elementFromPoint(lastPointer.x, lastPointer.y);
    const element = target instanceof Element ? target.closest("[data-tooltip]") : null;

    if (!element) {
      hideTooltip();
      return;
    }

    showTooltip(element, lastPointer.x, lastPointer.y);
  }

  function refreshTooltipAfterScroll() {
    if (lastPointer?.pointerType === "touch") {
      hideTooltip();
      return;
    }
    if (tooltipRefreshScheduled) return;

    tooltipRefreshScheduled = true;
    window.requestAnimationFrame(() => {
      tooltipRefreshScheduled = false;
      refreshTooltip();
    });
  }

  document.addEventListener("pointerover", event => {
    if (event.pointerType === "touch" || !(event.target instanceof Element)) return;
    lastPointer = { x: event.clientX, y: event.clientY, pointerType: event.pointerType };
    const element = event.target.closest("[data-tooltip]");
    if (element) showTooltip(element, event.clientX, event.clientY);
  });

  document.addEventListener("pointermove", event => {
    if (event.pointerType !== "touch") {
      lastPointer = { x: event.clientX, y: event.clientY, pointerType: event.pointerType };
      if (activeElement) positionTooltip(event.clientX, event.clientY);
    }
  });

  document.addEventListener("pointerout", event => {
    if (event.pointerType === "touch" || !(event.target instanceof Element)) return;
    const element = event.target.closest("[data-tooltip]");
    if (element && !element.contains(event.relatedTarget)) hideTooltip();
  });

  document.addEventListener("pointerdown", event => {
    if (event.pointerType !== "touch") return;
    lastPointer = { x: event.clientX, y: event.clientY, pointerType: event.pointerType };
    if (!(event.target instanceof Element)) return;
    const element = event.target.closest("[data-tooltip]");
    if (element) {
      if (element.matches(".irl-gallery-art img, .irl-gallery-photos img")) {
        hideTooltip();
        return;
      }
      showTooltip(element, event.clientX, event.clientY);
    } else {
      hideTooltip();
    }
  });

  window.addEventListener("scroll", refreshTooltipAfterScroll, true);
  window.addEventListener("resize", refreshTooltip);
});
