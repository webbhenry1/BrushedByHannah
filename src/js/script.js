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


    const daysTag = document.querySelector(".days"),
    currentDate = document.querySelector(".current-date"),
    prevNextIcon = document.querySelectorAll(".icons span");

    // getting new date, current year and month
    let date = new Date(),
    currYear = date.getFullYear(),
    currMonth = date.getMonth();

    // storing full name of all months in array
    const months = ["January", "February", "March", "April", "May", "June", "July",
                "August", "September", "October", "November", "December"];

    const renderCalendar = () => {
        let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(), // getting first day of month
        lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(), // getting last date of month
        lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(), // getting last day of month
        lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(); // getting last date of previous month
        let liTag = "";

        for (let i = firstDayofMonth; i > 0; i--) { // creating li of previous month last days
            liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
        }

        for (let i = 1; i <= lastDateofMonth; i++) { // creating li of all days of current month
            // adding active class to li if the current day, month, and year matched
            let isToday = i === date.getDate() && currMonth === new Date().getMonth() 
                        && currYear === new Date().getFullYear() ? "active" : "";
            liTag += `<li class="${isToday}">${i}</li>`;
        }

        for (let i = lastDayofMonth; i < 6; i++) { // creating li of next month first days
            liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`
        }
        currentDate.innerText = `${months[currMonth]} ${currYear}`; // passing current mon and yr as currentDate text
        daysTag.innerHTML = liTag;
    }
    renderCalendar();

    prevNextIcon.forEach(icon => { // getting prev and next icons
        icon.addEventListener("click", () => { // adding click event on both icons
            // if clicked icon is previous icon then decrement current month by 1 else increment it by 1
            currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

            if(currMonth < 0 || currMonth > 11) { // if current month is less than 0 or greater than 11
                // creating a new date of current year & month and pass it as date value
                date = new Date(currYear, currMonth, new Date().getDate());
                currYear = date.getFullYear(); // updating current year with new date year
                currMonth = date.getMonth(); // updating current month with new date month
            } else {
                date = new Date(); // pass the current date as date value
            }
            renderCalendar(); // calling renderCalendar function
        });
    });
});
