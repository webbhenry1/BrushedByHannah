// script.js
window.onscroll = function() {
    var menu = document.getElementById('menu');
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'flex';
    }
};

// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Select all control elements
    var controls = document.querySelectorAll('.control');

    // Add click event to each control
    controls.forEach(function(control) {
        control.addEventListener('click', function(e) {
            e.preventDefault();
            var targetId = this.getAttribute('href');
            var targetSection = document.querySelector(targetId);

            // Scroll to the target section
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Add active class to the clicked control and remove from others
            controls.forEach(function(ctrl) {
                ctrl.classList.remove('active-btn');
            });
            this.classList.add('active-btn');
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Attach click event to menu toggle button
    var toggleButton = document.querySelector('.menu-toggle');
    toggleButton.onclick = toggleMenu;
})