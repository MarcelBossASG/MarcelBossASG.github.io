const bgm = document.getElementById('bgm');
document.addEventListener('keydown', e => {
  if (e.key.toLowerCase() === 'm') bgm.paused ? bgm.play() : bgm.pause();
});

const signupForm = document.getElementById('signup-form');
const topButtons = document.querySelectorAll('.top-signup');
const bottomButtons = document.querySelectorAll('.bottom-signup');

function showTooltip(input, message) {
  const existing = input.parentNode.querySelector('.error-tooltip');
  if (existing) existing.remove();

  const tooltip = document.createElement('div');
  tooltip.classList.add('error-tooltip');
  tooltip.innerText = message;

  input.parentNode.style.position = 'relative';
  input.parentNode.appendChild(tooltip);

  requestAnimationFrame(() => {
    tooltip.style.opacity = '1';
    tooltip.style.transform = 'translateX(0) translateY(-50%)';
  });

  setTimeout(() => {
    tooltip.style.opacity = '0';
    tooltip.style.transform = 'translateX(10px) translateY(-50%)';
    setTimeout(() => tooltip.remove(), 300);
  }, 2500);
}

function validateAndConfirm() {
  const inputs = signupForm.querySelectorAll('input');
  let allValid = true;

  inputs.forEach(input => {
    const value = input.value.trim();
    if (!value) {
      allValid = false;
      showTooltip(input, 'This field is required');
    } else if (input.type === 'email' && !value.includes('@')) {
      allValid = false;
      showTooltip(input, 'Email must contain @');
    }
  });

  if (allValid) {
    signupForm.innerHTML = `<p class="confirmation-msg">Your pre-registration is confirmed!</p>`;
    signupForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function openSignupFormTop() {
  return new Promise(resolve => {
    if (!signupForm.classList.contains('active')) {
      const onTransitionEnd = () => {
        signupForm.removeEventListener('transitionend', onTransitionEnd);
        resolve();
      };
      signupForm.addEventListener('transitionend', onTransitionEnd);
      signupForm.classList.add('active');
    } else resolve();
  });
}

async function scrollToSignupTop() {
  await openSignupFormTop();
  const rect = signupForm.getBoundingClientRect();
  const scrollTarget = window.scrollY + rect.top + rect.height / 2 - window.innerHeight / 2;
  window.scrollTo({ top: scrollTarget, behavior: 'smooth' });

  setTimeout(() => {
    const firstInput = signupForm.querySelector('input');
    if (firstInput) firstInput.focus();
  }, 600);
}

topButtons.forEach(btn => btn.addEventListener('click', scrollToSignupTop));

function openAndScrollBottom() {
  if (!signupForm.classList.contains('active')) signupForm.classList.add('active');

  const scrollStep = () => {
    const rect = signupForm.getBoundingClientRect();
    const formMiddle = window.scrollY + rect.top + rect.height / 2;
    let targetY = formMiddle - window.innerHeight / 2;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    if (targetY > maxScroll) targetY = maxScroll;

    const distance = targetY - window.scrollY;

    if (Math.abs(distance) < 1) {
      window.scrollTo(0, targetY);
      clearInterval(interval);
      validateAndConfirm();
      return;
    }

    window.scrollBy(0, distance * 0.08);
  };

  const interval = setInterval(scrollStep, 15);

  setTimeout(() => {
    const firstInput = signupForm.querySelector('input');
    if (firstInput) firstInput.focus();
  }, 200);
}

bottomButtons.forEach(btn => btn.addEventListener('click', openAndScrollBottom));
