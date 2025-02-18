document.addEventListener("DOMContentLoaded", function () {
    const fadeInElement = document.querySelector('.fade-in');

    if (fadeInElement) {
        setTimeout(() => {
            fadeInElement.classList.add('visible');
        }, 100);
    }
});
