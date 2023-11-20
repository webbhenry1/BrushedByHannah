// script.js
window.onscroll = function() {
    var menu = document.getElementById('menu');
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'flex';
    }
};
// Toggle mobile menu
function toggleMenu() {
    var menu = document.getElementById('menu');
    menu.classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', function() {
    // Attach click event to menu toggle button
    var toggleButton = document.querySelector('.menu-toggle');
    toggleButton.onclick = toggleMenu;
})