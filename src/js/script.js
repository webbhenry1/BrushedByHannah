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
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const renderCalendar = () => {
        let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(),
            lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(),
            lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(),
            lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();
        let liTag = "";
    
        for (let i = firstDayofMonth; i > 0; i--) {
            liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
        }
    
        for (let i = 1; i <= lastDateofMonth; i++) {
            let isToday = i === date.getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear() ? "active" : "";
            liTag += `<li class="${isToday}">${i}</li>`;
        }
    
        for (let i = lastDayofMonth; i < 6; i++) {
            liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
        }
    
        currentDate.innerText = `${months[currMonth]} ${currYear}`;
        daysTag.innerHTML = liTag;
        const year = currYear;
        const month = currMonth + 1; 
        markAvailableDates(year, month);
    
        attachDayClickListeners();
    };
    
    const attachDayClickListeners = () => {
        document.querySelectorAll('.days li:not(.inactive)').forEach(day => {
            day.addEventListener('click', function() {
                const dayNumber = parseInt(this.textContent, 10);
                const selectedDate = new Date(currYear, currMonth, dayNumber);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
    
                if (selectedDate < today) {
                    showAvailabilityPopup("", true);
                } else {
                    // Format the date correctly for the API call
                    const formattedDate = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${dayNumber}`;
                    fetchAvailabilityData(formattedDate);
                }
            });
        });        
    };
    
    
    function fetchAvailabilityData(date) {
        const [year, month, day] = date.split("-");
        const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    
        fetch(`http://18.220.182.66:5000/api/availability/${formattedDate}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.availableSlots && data.availableSlots.length === 0) {
                    // Handle no available times differently
                    showAvailabilityPopup("No available times for this date.", false);
                } else {
                    // Assuming data is an array of availability times
                    let availabilityText = data.map(slot => `${slot.availableStartTime} - ${slot.availableEndTime}`).join(', ');
                    showAvailabilityPopup(availabilityText, false);
                }
            })
            .catch(error => {
                console.error('Error fetching availability:', error);
                showAvailabilityPopup("Error fetching availability.", true);
            });
    }
    
    
    function markAvailableDates(year, month) {
        fetch(`http://18.220.182.66:5000/api/monthly_availability/${year}/${month}`)
            .then(response => response.json())
            .then(data => {
                // Mark these dates in the calendar
                data.forEach(date => {
                    const day = new Date(date).getDate();
                    const dayElement = document.querySelector(`.days li:not(.inactive):nth-child(${day})`);
                    if (dayElement) {
                        dayElement.classList.add('available');
                    }
                });
            })
            .catch(error => console.error('Error fetching monthly availability:', error));
    }
    
    renderCalendar();
    
    prevNextIcon.forEach(icon => { 
        icon.addEventListener("click", () => { 
            currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

            if(currMonth < 0 || currMonth > 11) { 
                date = new Date(currYear, currMonth, new Date().getDate());
                currYear = date.getFullYear(); 
                currMonth = date.getMonth(); 
            } else {
                date = new Date(); 
            }
            renderCalendar(); 
            markAvailableDates(currYear, currMonth + 1);
        });
    });

    // Function to show the availability popup with the selected date
    function showAvailabilityPopup(dateText, isPast) {
        let message = isPast ? 
            "You have selected a day in the past, please select a future date to see my availability." 
            : `Availability on ${dateText}`;
        document.getElementById('selected-date').innerText = message;
        document.getElementById('availability-popup').style.display = 'block';
    }

    // Function to hide the availability popup
    function hideAvailabilityPopup() {
        document.getElementById('availability-popup').style.display = 'none';
    }

    // Event listener for closing the popup
    document.getElementById('close-popup').addEventListener('click', function() {
        hideAvailabilityPopup();
    });

    // Function to show the user info form
    function showUserInfoForm() {
        document.getElementById("user-info-form").style.display = "block";
    }

    // Event listener for Confirm Booking button
    document.getElementById("confirm-booking-btn").addEventListener("click", bookAppointment);

    // Function to book an appointment
    function bookAppointment() {
        const customerName = document.getElementById("customer-name").value;
        const customerEmail = document.getElementById("customer-email").value;
        const customerPhone = document.getElementById("customer-phone").value;
        const comments = document.getElementById("comments").value;

        // Assuming you have variables for the selected service and time slot
        const appointmentData = {
            date: selectedDate,
            startTime: selectedStartTime,
            endTime: selectedEndTime,
            service: selectedService,
            customerName: customerName,
            customerEmail: customerEmail,
            customerPhone: customerPhone,
            comments: comments
        };

        fetch('http://18.220.182.66:5000/book_appointment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(appointmentData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'Success') {
                alert('Appointment booked successfully');
            } else {
                alert(data.message); 
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error booking appointment');
        });
    }



    // Event delegation for calendar days
    document.querySelector(".calendar").addEventListener('click', function(e) {
        // Check if the clicked element is a day in the calendar and is not 'inactive'
        if (e.target.tagName === 'LI' && !e.target.classList.contains('inactive')) {
            const day = parseInt(e.target.textContent, 10);
            const selectedDate = new Date(currYear, currMonth, day);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                showAvailabilityPopup("", true);
            } else {
                const formattedDate = `${selectedDate.getMonth() + 1}/${day}/${selectedDate.getFullYear()}`;
                showAvailabilityPopup(formattedDate, false);
            }
        }
    });

    // Function to show loading spinner and overlay
    function showLoading() {
        const loader = document.getElementById('loading-spinner');
        const overlay = document.getElementById('overlay');
        loader.style.display = 'block';
        overlay.style.display = 'block';
    }

    // Function to hide loading spinner only
    function hideLoading() {
        const loader = document.getElementById('loading-spinner');
        loader.style.display = 'none';
    }

    // Function to show thank you popup (overlay is already shown)
    function showThankYouPopup() {
        const popup = document.getElementById('thank-you-popup');
        popup.style.display = 'block';
    }

    // Function to close thank you popup and overlay
    function closeThankYouPopup() {
        const popup = document.getElementById('thank-you-popup');
        const overlay = document.getElementById('overlay');
        popup.style.display = 'none';
        overlay.style.display = 'none';
    }

    document.getElementById('contact-form').addEventListener('submit', function(e) {
        e.preventDefault();
        showLoading(); 

        const formData = {
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        fetch('http://18.118.253.135:5000/send_message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            hideLoading(); 
            showThankYouPopup(); 
            document.getElementById('contact-form').reset(); 
        })
        .catch(error => {
            console.error('Error:', error);
            hideLoading(); // Hide loading spinner only
        });
    });

    // Event listener for closing the thank you popup
    document.getElementById('close-popup').addEventListener('click', function() {
        closeThankYouPopup();
    });


    // Ensure popup is initially hidden
    window.onload = function() {
        hideLoading();
        closeThankYouPopup();
        renderCalendar()
    };
    
});


