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

  hamburger.addEventListener('click', function () {
    if (mobileNav.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  backdrop.addEventListener('click', closeMenu);

 
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });


  window.addEventListener('resize', function () {
    if (window.innerWidth > 700) closeMenu();
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const textElements = Array.from(document.querySelectorAll('p, h1')).filter(el => !el.closest('.project-box'));

  const projectBoxes = Array.from(document.querySelectorAll('.project-box'));

  textElements.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('pop-in');
    }, i * 0.2 * 1000);
  });

  projectBoxes.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('pop-in');
    }, i * 0.6 * 1000);
  });
});
