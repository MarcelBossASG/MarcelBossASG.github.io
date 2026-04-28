document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger-menu');
  const mobileNav = document.querySelector('.mobile-nav');
  const backdrop = document.querySelector('.mobile-nav-backdrop');

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    backdrop.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
  }

  function openMenu() {
    hamburger.classList.add('open');
    mobileNav.classList.add('open');
    backdrop.classList.add('open');
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

const pageHeading = document.querySelector('.irl-page h1');
const textElements = Array.from(document.querySelectorAll('.main-content p'));
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

  function alignIrlAccordion() {
    const page = document.querySelector('.irl-page');
    const accordion = document.querySelector('.irl-page .irl-accordion');
    if (!page || !accordion) return;
    const heading = page.querySelector('h1, h2, .section-title');
    const ref = heading || page;
    // position is absolute within .irl-page, so use offsetLeft/Top
    const left = ref.offsetLeft || 0;
    const top = (ref.offsetTop || 0) + (ref.offsetHeight || 0) + 6; // small gap
    accordion.style.left = left + 'px';
    accordion.style.top = top + 'px';
  }

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
    if (timestamp - lastFrame > 33) { 
      drawSnowflakes();
      updateSnowflakes();
      lastFrame = timestamp;
    }
    requestAnimationFrame(animateSnow);
  }
  requestAnimationFrame(animateSnow);
  // IRL accordion: accessible toggle handlers for `.irl-toggle` buttons
  (function(){
    // Create overlay element used for the expand animation
    const overlay = document.createElement('div');
    overlay.className = 'irl-overlay';
    overlay.innerHTML = `
      <button class="irl-overlay-close" aria-label="Close">✕</button>
      <div class="irl-overlay-inner" role="dialog" aria-modal="true"></div>
      <div class="irl-overlay-bottom" aria-hidden="true"></div>
    `;
    document.body.appendChild(overlay);
    const overlayInner = overlay.querySelector('.irl-overlay-inner');
    const overlayClose = overlay.querySelector('.irl-overlay-close');

    function loadOverlayMedia(container) {
    // IMAGES
    container.querySelectorAll("img[data-src]").forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute("data-src");
    });

    // IFRAMES (YouTube etc.)
    container.querySelectorAll("iframe[data-src]").forEach(frame => {
      frame.src = frame.dataset.src;
      frame.removeAttribute("data-src");
    });
  }

    function openOverlayFromButton(btn, panel) {
      const rect = btn.getBoundingClientRect();
      // use viewport coordinates (no scroll offsets) because overlay is fixed
      const start = { left: rect.left, top: rect.top, width: rect.width, height: rect.height, radius: window.getComputedStyle(btn).borderRadius || '8px' };
      // save previous body overflow and prevent body scrolling while overlay is open
      overlay._prevBodyOverflow = document.body.style.overflow || '';
      document.body.style.overflow = 'hidden';
      // copy panel content into overlay
      overlayInner.innerHTML = panel.innerHTML;
      overlayInner.querySelectorAll("iframe[data-src]").forEach(frame => {
        if (!frame.src) {
          frame.src = frame.dataset.src;
        }
      });
      overlayInner.style.visibility = 'hidden';
      // set initial geometry (viewport coordinates)
      overlay.style.position = 'fixed';
      overlay.style.left = start.left + 'px';
      overlay.style.top = start.top + 'px';
      overlay.style.width = start.width + 'px';
      overlay.style.height = start.height + 'px';
      overlay.style.borderRadius = start.radius;
      overlay._start = start;
      // show overlay element (kept overflow:hidden via CSS)
      overlay.style.display = 'block';
      overlay.classList.add('open');

      requestAnimationFrame(() => {
        loadOverlayMedia(overlayInner);
      });

      // ensure inner pane doesn't scroll during the expand animation
      overlayInner.style.overflow = 'hidden';

      // target geometry (10px gap from viewport edges), anchored top-left
      const gap = 0;
      const topbarRect = document.querySelector('.topbar')?.getBoundingClientRect();
      const targetTop = topbarRect ? Math.round(topbarRect.bottom) : 0; // flush under topbar
      const targetWidth = Math.max(200, document.documentElement.clientWidth);
      // cover down to the bottom of the viewport (will overlap the bottombar)
      const targetHeight = Math.max(200, window.innerHeight - targetTop);

      function onOpenEnd(e) {
        if (e.target !== overlay) return;
        if (e.propertyName !== 'height') return; // 🔥 critical fix

        overlay.removeEventListener('transitionend', onOpenEnd);

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

        // apply pop-in to all child elements inside overlay
        const groups = overlayInner.querySelectorAll(':scope > *');

        groups.forEach((group, i) => {
          group.classList.add('pop-in');
          group.style.setProperty('--delay', `${i * 0.2}s`);

          // animate images inside gallery slightly after group
          const inner = group.querySelectorAll?.('.irl-gallery > *');
          inner?.forEach((el, j) => {
            el.classList.add('pop-in');
            el.style.setProperty('--delay', `${i * 0.2 + j * 0.08}s`);
          });
        });
      }
      
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
      // animate inner content out
        overlayInner.classList.remove('visible');
        // prevent inner scrolling during collapse to avoid flicker
        overlayInner.style.overflow = 'hidden';
      // animate back to the starting button rect if available
      const start = overlay._start;
      if (start) {
        overlay.style.right = 'auto';
        overlay.style.left = start.left + 'px';
        overlay.style.top = start.top + 'px';
        overlay.style.width = start.width + 'px';
        overlay.style.height = start.height + 'px';
        overlay.style.borderRadius = start.radius || '8px';
      } else {
        // fallback: collapse to small top-left box
        const gap = 10;
        overlay.style.right = 'auto';
        overlay.style.left = (gap + window.scrollX) + 'px';
        overlay.style.top = (gap + window.scrollY) + 'px';
        overlay.style.width = '200px';
        overlay.style.height = '48px';
        overlay.style.borderRadius = '8px';
      }
      // after transition end, hide
      const onEnd = () => {
        overlay.removeEventListener('transitionend', onEnd);
        overlay.style.display = 'none';
        overlay.classList.remove('open');
        overlayInner.innerHTML = '';
        overlayInner.style.height = '';
        // restore body scroll
        document.body.style.overflow = overlay._prevBodyOverflow || '';
        if (window.placeWatermark) window.placeWatermark();
      };
      overlay.addEventListener('transitionend', onEnd);
    }

    overlayClose.addEventListener('click', closeOverlay);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('open')) closeOverlay(); });

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

  let active = null;

  document.addEventListener("mouseover", (e) => {
    const el = e.target.closest("[data-tooltip]");
    if (!el) return;

    active = el;
    tooltip.innerHTML = el.dataset.tooltip;
    tooltip.classList.add("show");
  });

  document.addEventListener("mouseout", (e) => {
    const el = e.target.closest("[data-tooltip]");
    if (!el) return;

    active = null;
    tooltip.classList.remove("show");
  });

  document.addEventListener("mousemove", (e) => {
    if (!active) return;
    tooltip.style.left = e.clientX + 12 + "px";
    tooltip.style.top = e.clientY + 12 + "px";
  });
});

document.addEventListener("mousemove", (e) => {
  if (!active) return;

  const padding = 14;

  const x = Math.min(e.clientX + padding, window.innerWidth - 240);
  const y = Math.min(e.clientY + padding, window.innerHeight - 80);

  tooltip.style.left = x + "px";
  tooltip.style.top = y + "px";
});
