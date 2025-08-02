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
      // Ensure progress bar animates for first slide
      resetProgressBar();
      resetSlideTimer();

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
    // Always reset all bars to 0% first
    progressBars.forEach(bar => {
      bar.style.transition = 'none';
      bar.style.width = '0%';
    });
    // Force reflow to apply the width instantly
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

});
