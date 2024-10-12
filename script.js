document.addEventListener("DOMContentLoaded", function() {
    const fadeInElement = document.querySelector('.fade-in');

    setTimeout(() => {
        fadeInElement.classList.add('visible');
    }, 200);
});