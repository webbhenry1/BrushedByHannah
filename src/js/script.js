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

    // Initialize the carousel
    let currentIndex = 0;
    const images = document.querySelectorAll('.carousel-images img');
    const totalImages = images.length;

    function updateCarousel() {
        images.forEach(img => {
            img.style.display = 'none';
        });
        images[currentIndex].style.display = 'block'; 
    }

    // Control buttons
    document.querySelector('.left-control').addEventListener('click', function() {
        currentIndex = (currentIndex + totalImages - 1) % totalImages;
        updateCarousel();
    });

    document.querySelector('.right-control').addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % totalImages;
        updateCarousel();
    });

    updateCarousel(); 
});
