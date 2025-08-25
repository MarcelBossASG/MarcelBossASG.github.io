document.addEventListener('DOMContentLoaded', function () {
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

  hamburger.addEventListener('click', () => {
    mobileNav.classList.contains('open') ? closeMenu() : openMenu();
  });

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
  const newsSliderContainer = document.querySelector('.news-slider-container');

  textElements.forEach((el, i) => {
    setTimeout(() => el.classList.add('pop-in'), i * 200);
  });

  projectBoxes.forEach((el, i) => {
    setTimeout(() => el.classList.add('pop-in'), i * 600);
  });

  if (newsSliderContainer) {
    const totalDelay = (textElements.length - 1) * 200;
    setTimeout(() => {
      newsSliderContainer.classList.add('fade-in-news');
      newsSliderContainer.style.opacity = '1';
      newsSliderContainer.style.transform = 'translateY(0)';
      showSlide(0);

      resetProgressBar();
      resetSlideTimer();

      // set up image fit helper
      function applyImageFit() {
        document.querySelectorAll('.news-slide img').forEach(img => {
          const wrapper = img.closest('.image-wrapper');
          if (!wrapper || !img.naturalWidth) return;
          const wrapperRatio = wrapper.clientWidth / wrapper.clientHeight;
          const imgRatio = img.naturalWidth / img.naturalHeight;
          img.classList.remove('fit-cover', 'fit-contain');
          // if image is wider than wrapper, contain; otherwise cover
          if (imgRatio > wrapperRatio) {
            img.classList.add('fit-contain');
          } else {
            img.classList.add('fit-cover');
          }
        });
      }

      window.addEventListener('resize', applyImageFit);
      // run once after a short delay to allow images to load
      setTimeout(applyImageFit, 250);

      document.querySelectorAll('.news-arrow-left').forEach(leftArrow => {
        leftArrow.onclick = function(e) {
          e.preventDefault();
          let prev = currentSlide - 1;
          if (prev < 0) prev = slides.length - 1;
          setSlide(prev);
        };
      });
      document.querySelectorAll('.news-arrow-right').forEach(rightArrow => {
        rightArrow.onclick = function(e) {
          e.preventDefault();
          let next = (currentSlide + 1) % slides.length;
          setSlide(next);
        };
      });
    }, totalDelay + 400);
  } else {
    console.warn('newsSliderContainer not found');
  }

  const slides = document.querySelectorAll('.news-slide');
  const dots = document.querySelectorAll('.dot');
  const progressBars = document.querySelectorAll('.progress-bar');
  const slideDuration = 6000;
  let currentSlide = 0;
  let slideTimer;
  let progressInterval;
  let progressStartTime;
  let isTransitioning = false;

  function resetProgressBar() {
    clearInterval(progressInterval);

    progressBars.forEach(bar => {
      bar.style.transition = 'none';
      bar.style.width = '0%';
    });

    void progressBars[0]?.offsetWidth;
    progressBars.forEach(bar => {
      bar.style.transition = '';
    });
    progressStartTime = Date.now();

    progressInterval = setInterval(() => {
      const elapsed = Date.now() - progressStartTime;
      const progressPercent = Math.min((elapsed / slideDuration) * 105, 100);
      progressBars.forEach(bar => (bar.style.width = `${progressPercent}%`));
      if (progressPercent >= 100) clearInterval(progressInterval);
    }, 30);
  }

  function showSlide(index) {
    if (isTransitioning || index === currentSlide) return;
    isTransitioning = true;
    const prevSlide = slides[currentSlide];
    const nextSlide = slides[index];
    prevSlide.classList.add('active');
    nextSlide.classList.add('active');
    prevSlide.style.opacity = 1;
    nextSlide.style.opacity = 0;
    prevSlide.style.transition = 'opacity 1.2s cubic-bezier(.4,2,.6,1)';
    nextSlide.style.transition = 'opacity 1.2s cubic-bezier(.4,2,.6,1)';
    setTimeout(() => {
      nextSlide.style.opacity = 1;
      prevSlide.style.opacity = 0;
      setTimeout(() => {
        prevSlide.classList.remove('active');
        prevSlide.style.opacity = '';
        prevSlide.style.transition = '';
        nextSlide.style.transition = '';
        isTransitioning = false;
      }, 1210);
    }, 10);
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    currentSlide = index;
    resetProgressBar();
  }

  function setSlide(index) {
    showSlide(index);
    resetSlideTimer();
  }

  function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }

  function resetSlideTimer() {
    clearInterval(slideTimer);
    slideTimer = setInterval(nextSlide, slideDuration);
  }

  // Final fix to ensure snow covers the entire website dynamically
  const canvas = document.createElement('canvas');
  canvas.classList.add('snow-canvas');
  canvas.style.position = 'fixed'; // Ensure it stays fixed on the viewport
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.zIndex = '-1'; // Lower z-index to underlay everything except the background
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  function updateCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight; // Adjust to viewport height
  }

  updateCanvasSize();
  window.addEventListener('resize', updateCanvasSize);

  const snowflakes = [];
  function createSnowflakes() {
    for (let i = 0; i < 150; i++) {
      snowflakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        speed: Math.random() * 0.2 + 0.1 // Reduced speed range for slower snowflakes
      });
    }
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

  function animateSnow() {
    drawSnowflakes();
    updateSnowflakes();
    requestAnimationFrame(animateSnow);
  }

  createSnowflakes();
  animateSnow();
});
