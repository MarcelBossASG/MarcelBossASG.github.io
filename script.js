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

  const textElements = Array.from(document.querySelectorAll('p, h1')).filter(
    el => !el.closest('.project-box')
  );
  const projectBoxes = document.querySelectorAll('.project-box');

  textElements.forEach((el, i) =>
    el.style.animation = `popIn 0.6s ease forwards ${i * 0.2}s`
  );
  projectBoxes.forEach((el, i) =>
    el.style.animation = `popIn 0.6s ease forwards ${i * 0.6}s`
  );

const newsSliderContainer = document.querySelector('.news-slider-container');
const slides = document.querySelectorAll('.news-slide');
const dots = document.querySelectorAll('.dot');
const progressBars = document.querySelectorAll('.progress-bar');
const slideDuration = 6000;
let currentSlide = 0;
let slideTimer;
let isTransitioning = false;

function resetProgressBar() {
  progressBars.forEach(bar => {
    bar.style.transition = 'none';
    bar.style.width = '0%';
    void bar.offsetWidth; 
    bar.style.transition = `width ${slideDuration}ms linear`;
    bar.style.width = '100%';
  });
}

function showSlide(index) {
  if (isTransitioning || index === currentSlide) return;
  isTransitioning = true;
  const prevSlide = slides[currentSlide];
  const nextSlide = slides[index];

  prevSlide.classList.remove('active');
  nextSlide.classList.add('active');

  dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  currentSlide = index;
  resetProgressBar();

  setTimeout(() => (isTransitioning = false), 1200);
}

function nextSlide() {
  showSlide((currentSlide + 1) % slides.length);
}

function resetSlideTimer() {
  clearInterval(slideTimer);
  slideTimer = setInterval(nextSlide, slideDuration);
}

if (newsSliderContainer) {
  const totalDelay = (textElements.length - 1) * 0.2 * 1000; 
  setTimeout(() => {
    newsSliderContainer.classList.add('fade-in-news');
    showSlide(0);
    resetProgressBar();
    resetSlideTimer();

    document.querySelectorAll('.news-arrow-left').forEach(btn =>
      btn.addEventListener('click', e => {
        e.preventDefault();
        showSlide((currentSlide - 1 + slides.length) % slides.length);
        resetSlideTimer();
      })
    );
    document.querySelectorAll('.news-arrow-right').forEach(btn =>
      btn.addEventListener('click', e => {
        e.preventDefault();
        showSlide((currentSlide + 1) % slides.length);
        resetSlideTimer();
      })
    );

    let resizeTimeout;
    function applyImageFit() {
      document.querySelectorAll('.news-slide img').forEach(img => {
        const wrapper = img.closest('.image-wrapper');
        if (!wrapper || !img.naturalWidth) return;
        const wrapperRatio = wrapper.clientWidth / wrapper.clientHeight;
        const imgRatio = img.naturalWidth / img.naturalHeight;
        img.classList.remove('fit-cover', 'fit-contain');
        img.classList.add(imgRatio > wrapperRatio ? 'fit-contain' : 'fit-cover');
      });
    }
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(applyImageFit, 150);
    });
    applyImageFit();
  }, totalDelay + 400);
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
});