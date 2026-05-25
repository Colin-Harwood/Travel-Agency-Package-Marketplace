document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    var packageId = getQueryParam("id");
    var messageDiv = document.getElementById("detailMessage");
    var container = document.getElementById("packageDetailContainer");
    var modal = document.getElementById("bookingModal");
    var bookingForm = document.getElementById("bookingForm");
    var groupTripSelect = document.getElementById("groupTripSelect");
    var currentPackageData = null;
    var currentUserReviews = [];

    function getQueryParam(name) {
        var query = window.location.search.substring(1).split("&");
        var i;
        var pair;
        for (i = 0; i < query.length; i++) {
            pair = query[i].split("=");
            if (decodeURIComponent(pair[0]) === name) {
                return decodeURIComponent((pair[1] || "").replace(/\+/g, " "));
            }
        }
        return "";
    }

    function showMessage(msg, isError) {
        if (!messageDiv) return;
        messageDiv.textContent = msg || "";
        messageDiv.className = isError ? "detail-message error" : "detail-message success";
        messageDiv.style.display = msg ? "block" : "none";
        if (!isError && msg) {
            setTimeout(function () {
                if (messageDiv && messageDiv.style.display === "block") {
                    messageDiv.style.display = "none";
                }
            }, 5000);
        }
    }

    function clearMessage() {
        showMessage("", false);
    }

    function escapeHtml(value) {
        return String(value === null || value === undefined ? "" : value).replace(/[&<>\"']/g, function (m) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                "\"": "&quot;",
                "'": "&#039;"
            }[m];
        });
    }

    function formatPrice(value) {
        var num = parseFloat(value || 0);
        if (isNaN(num)) num = 0;
        return num.toLocaleString("en-ZA", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }

    function safeArray(value) {
        return Array.isArray(value) ? value : [];
    }

    function repeatChar(character, times) {
        var result = "";
        var i;
        times = parseInt(times, 10) || 0;
        for (i = 0; i < times; i++) result += character;
        return result;
    }

    function loadCurrentUserReviews(callback) {
        TravelAPI.getAllReviews(function (err, response) {
            if (!err && response && response.status === "success") {
                currentUserReviews = response.data || [];
            }
            if (callback) callback();
        });
    }

    function isCurrentUserReview(reviewID) {
        for (var i = 0; i < currentUserReviews.length; i++) {
            if (currentUserReviews[i].reviewID == reviewID) {
                return true;
            }
        }
        return false;
    }

    function renderReviews(reviews) {
        var html = "";
        var i;
        var r;
        reviews = safeArray(reviews);
        if (!reviews.length) return "<p>No reviews yet. Be the first to leave a review!</p>";

        for (i = 0; i < reviews.length; i++) {
            r = reviews[i];
            var deleteButton = "";
            if (r.reviewID && isCurrentUserReview(r.reviewID)) {
                deleteButton = '<button class="btn-delete-review" data-review-id="' + escapeHtml(r.reviewID) + '">Delete</button>';
            }
            html += '<div class="review-item" data-review-id="' + (r.reviewID || '') + '">' +
                '<div class="rating">' + repeatChar("&#9733", r.rating) + repeatChar("&#9734", 5 - r.rating) + ' ' + escapeHtml(r.rating || "0") + '/5</div>' +
                '<div class="comment">' + escapeHtml(r.comment || "") + '</div>' +
                '<div class="date">' + escapeHtml(r.date || "") + '</div>' +
                '<div class="review-actions">' + deleteButton + '</div>' +
                '</div>';
        }
        return html;
    }

    function renderReviewForm() {
        return '<div class="info-section review-form-section">' +
            '<h3>Write a review</h3>' +
            '<div class="review-form">' +
            '<div class="star-rating-widget">' +
            '<span class="star-rating-label">Your rating: </span>' +
            '<div class="star-rating" id="starRatingWidget">' +
            '<span data-value="1" class="star">&#9733;</span>' +
            '<span data-value="2" class="star">&#9733;</span>' +
            '<span data-value="3" class="star">&#9733;</span>' +
            '<span data-value="4" class="star">&#9733;</span>' +
            '<span data-value="5" class="star">&#9733;</span>' +
            '</div>' +
            '<input type="hidden" id="selectedRating" value="0">' +
            '</div>' +
            '<textarea id="reviewComment" rows="3" placeholder="Share your experience with this package..."></textarea>' +
            '<button id="submitReviewBtn" class="btn-submit small">Submit review</button>' +
            '</div>' +
            '</div>';
    }

    function renderFlights(flights) {
        var html = "";
        var i;
        var f;
        flights = safeArray(flights);
        if (!flights.length) return "<p>No flights assigned.</p>";
        for (i = 0; i < flights.length; i++) {
            f = flights[i];
            html += '<div class="flight-item"><span>' + escapeHtml(f.airline || "") + ' ' + escapeHtml(f.flightNumber || "") + '</span> ' +
                escapeHtml(f.departure || f.departureTime || "") + ' &rarr; ' + escapeHtml(f.arrival || f.arrivalTime || "") +
                ' | ZAR ' + formatPrice(f.price) + '</div>';
        }
        return html;
    }

    function renderAccommodations(accommodations) {
        var html = "";
        var i;
        var a;
        accommodations = safeArray(accommodations);
        if (!accommodations.length) return "<p>No accommodations listed.</p>";
        for (i = 0; i < accommodations.length; i++) {
            a = accommodations[i];
            html += '<div class="accommodation-item"><span>' + escapeHtml(a.name || "") + ' (' + escapeHtml(a.type || "") + ')</span> ' +
                'Rating: ' + escapeHtml(a.rating || "N/A") + ' | ZAR ' + formatPrice(a.pricePerNight) + '/night</div>';
        }
        return html;
    }

    function renderRestaurants(restaurants) {
        var html = "";
        var i;
        var r;
        restaurants = safeArray(restaurants);
        if (!restaurants.length) return "<p>No restaurants listed.</p>";
        for (i = 0; i < restaurants.length; i++) {
            r = restaurants[i];
            html += '<div class="restaurant-item"><span>' + escapeHtml(r.name || "") + '</span> ' +
                escapeHtml(r.cuisine || "") + ' | ' + escapeHtml(r.priceRange || "") + '</div>';
        }
        return html;
    }

    function renderAttractions(attractions) {
        var html = "";
        var i;
        var a;
        attractions = safeArray(attractions);
        if (!attractions.length) return "<p>No attractions listed.</p>";
        for (i = 0; i < attractions.length; i++) {
            a = attractions[i];
            html += '<div class="attraction-item"><span>' + escapeHtml(a.name || "") + '</span> Entry: ZAR ' + formatPrice(a.entryFee) + '</div>';
        }
        return html;
    }

    function renderTrips(trips) {
        var html;
        var i;
        var t;
        trips = safeArray(trips);
        if (!trips.length) return "<p>No upcoming group trips available for this package.</p>";
        html = '<table class="trips-table"><thead><tr><th>Date</th><th>Current size</th><th>Spots left</th><th>Max size</th><th></th></tr></thead><tbody>';
        for (i = 0; i < trips.length; i++) {
            t = trips[i];
            html += '<tr>' +
                '<td>' + escapeHtml(t.tripDate) + '</td>' +
                '<td>' + escapeHtml(t.currentSize || 0) + '</td>' +
                '<td>' + escapeHtml(t.spotsRemaining || 0) + '</td>' +
                '<td>' + escapeHtml(t.maxSize || "") + '</td>' +
                '<td><button class="btn-book-trip" type="button" data-trip-id="' + escapeHtml(t.tripID) + '">Book</button></td>' +
                '</tr>';
        }
        html += '</tbody></table>';
        return html;
    }

    function renderPackage(pkg) {
        var agency;
        if (!pkg) return '<div class="loading-state">No data available.</div>';
        agency = pkg.agencyDetails || {
            agencyName: pkg.agencyName,
            email: pkg.email,
            phone: pkg.phone,
            street: pkg.street,
            city: pkg.agencyCity
        };
        return '' +
            '<div class="package-detail-card">' +
            '<div class="package-header">' +
            '<h1>' + escapeHtml(pkg.name || "Package details") + '</h1>' +
            '<div class="package-meta">' +
            '<span>' + escapeHtml(pkg.type || "Package") + ' Package</span>' +
            '<span>' + escapeHtml(pkg.duration || "") + ' days</span>' +
            '<span>From ZAR ' + formatPrice(pkg.pricePerPerson) + ' per person</span>' +
            '<span>' + escapeHtml(pkg.status || "") + '</span>' +
            '</div>' +
            '</div>' +
            '<div class="package-body">' +
            '<div>' +
            '<div class="info-section"><h3>About this package</h3><p>' + escapeHtml(pkg.description || "No description provided.") + '</p></div>' +
            '<div class="info-section"><h3>Destination</h3><p><strong>' + escapeHtml(pkg.destinationCity || "") + ', ' + escapeHtml(pkg.destinationCountry || "") + '</strong></p></div>' +
            '<div class="info-section"><h3>Agency</h3><div class="agency-details">' +
            '<strong>' + escapeHtml(agency.agencyName || "") + '</strong><br>' +
            escapeHtml(agency.street || "") + '<br>' +
            escapeHtml(agency.city || "") + '<br>' +
            escapeHtml(agency.email || "") + '<br>' +
            escapeHtml(agency.phone || "") +
            '</div></div>' +
            '<div class="info-section"><h3>Reviews</h3>' + renderReviews(pkg.reviews) + '</div>' +
            renderReviewForm() +
            '</div>' +
            '<div>' +
            '<div class="info-section"><h3>Flights</h3>' + renderFlights(pkg.flights) + '</div>' +
            '<div class="info-section"><h3>Accommodations</h3>' + renderAccommodations(pkg.accommodations) + '</div>' +
            '<div class="info-section"><h3>Restaurants</h3>' + renderRestaurants(pkg.restaurants) + '</div>' +
            '<div class="info-section"><h3>Attractions</h3>' + renderAttractions(pkg.attractions) + '</div>' +
            '<div class="info-section"><h3>Upcoming Group Trips</h3>' + renderTrips(pkg.upcomingGroupTrips) + '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
    }

    function initStarRating() {
        var stars = document.querySelectorAll("#starRatingWidget .star");
        var ratingInput = document.getElementById("selectedRating");
        if (!stars.length || !ratingInput) return;
        function setRating(value) {
            ratingInput.value = value;
            stars.forEach(function (star, idx) {
                var starValue = parseInt(star.getAttribute("data-value"), 10);
                if (starValue <= value) {
                    star.classList.add("active");
                } else {
                    star.classList.remove("active");
                }
            });
        }
        stars.forEach(function (star) {
            star.addEventListener("click", function (e) {
                var value = parseInt(this.getAttribute("data-value"), 10);
                setRating(value);
            });
            star.addEventListener("mouseenter", function () {
                var hoverValue = parseInt(this.getAttribute("data-value"), 10);
                stars.forEach(function (s, idx) {
                    var sv = parseInt(s.getAttribute("data-value"), 10);
                    if (sv <= hoverValue) {
                        s.classList.add("hover");
                    } else {
                        s.classList.remove("hover");
                    }
                });
            });
            star.addEventListener("mouseleave", function () {
                stars.forEach(function (s) {
                    s.classList.remove("hover");
                });
            });
        });
        setRating(0);
    }

    function attachDeleteReviewHandlers() {
        var deleteButtons = document.querySelectorAll(".btn-delete-review");
        for (var i = 0; i < deleteButtons.length; i++) {
            var button = deleteButtons[i];
            var newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);

            newButton.addEventListener("click", function (e) {
                e.stopPropagation();
                var reviewID = this.getAttribute("data-review-id");
                if (!reviewID) {
                    showMessage("Invalid review ID", true);
                    return;
                }

                if (confirm("Are you sure you want to delete this review? This action cannot be undone.")) {
                    showMessage("Deleting review...", false);
                    TravelAPI.deleteReview(reviewID, function (err, response) {
                        if (err) {
                            showMessage(err.message, true);
                            return;
                        }
                        if (!response || String(response.status).toLowerCase() !== "success") {
                            showMessage((response && response.data) || "Failed to delete review.", true);
                            return;
                        }
                        showMessage("Review deleted successfully!", false);
                        setTimeout(function () {
                            loadPackage();
                        }, 1000);
                    });
                }
            });
        }
    }

    function attachReviewSubmitHandler() {
        var submitBtn = document.getElementById("submitReviewBtn");
        if (!submitBtn) return;
        var newBtn = submitBtn.cloneNode(true);
        submitBtn.parentNode.replaceChild(newBtn, submitBtn);
        newBtn.addEventListener("click", function () {
            var rating = parseInt(document.getElementById("selectedRating").value, 10);
            var comment = document.getElementById("reviewComment").value.trim();
            if (!rating || rating < 1 || rating > 5) {
                showMessage("Please select a star rating (1-5).", true);
                return;
            }
            if (!comment) {
                showMessage("Please write a comment before submitting.", true);
                return;
            }
            showMessage("Submitting review...", false);
            TravelAPI.makeReview(packageId, rating, comment, function (err, response) {
                if (err) {
                    showMessage(err.message, true);
                    return;
                }
                if (!response || String(response.status).toLowerCase() !== "success") {
                    showMessage((response && response.data) || "Failed to submit review.", true);
                    return;
                }
                showMessage("Review posted successfully! Refreshing...", false);
                document.getElementById("selectedRating").value = "0";
                document.getElementById("reviewComment").value = "";
                initStarRating();
                loadPackage();
            });
        });
    }

    function loadPackage() {
        clearMessage();
        container.innerHTML = '<div class="loading-state">Loading package details...</div>';

        loadCurrentUserReviews(function () {
            TravelAPI.getPackage(packageId, function (err, response) {
                if (err) {
                    showMessage(err.message, true);
                    container.innerHTML = '<div class="loading-state">Failed to load package.</div>';
                    return;
                }
                if (!response || String(response.status).toLowerCase() !== "success") {
                    showMessage((response && response.data) || "Error loading package.", true);
                    container.innerHTML = '<div class="loading-state">Package not found.</div>';
                    return;
                }
                currentPackageData = response.data;
                container.innerHTML = renderPackage(currentPackageData);
                attachBookButtons();
                initStarRating();
                attachReviewSubmitHandler();
                attachDeleteReviewHandlers();
            });
        });
    }

    function attachBookButtons() {
        var bookBtns = document.querySelectorAll(".btn-book-trip");
        var i;
        for (i = 0; i < bookBtns.length; i++) {
            bookBtns[i].onclick = function () {
                openBookingModal(this.getAttribute("data-trip-id"));
            };
        }
    }

    function openBookingModal(tripID) {
        var trips;
        var i;
        var trip = null;
        var option;
        if (!currentPackageData) return;
        trips = safeArray(currentPackageData.upcomingGroupTrips);
        groupTripSelect.innerHTML = "";
        for (i = 0; i < trips.length; i++) {
            if (String(trips[i].tripID) === String(tripID)) {
                trip = trips[i];
                break;
            }
        }
        if (trip) {
            option = document.createElement("option");
            option.value = trip.tripID;
            option.textContent = trip.tripDate + " (" + trip.spotsRemaining + " spots left)";
            groupTripSelect.appendChild(option);
        }
        var existingInput = document.getElementById("numTravellers");
        if (existingInput) {
            existingInput.style.display = "block";
            existingInput.value = "1";
        }
        var hiddenNum = document.getElementById("hiddenNumTravellers");
        if (!hiddenNum) {
            hiddenNum = document.createElement("input");
            hiddenNum.type = "hidden";
            hiddenNum.id = "hiddenNumTravellers";
            hiddenNum.value = "1";
            bookingForm.appendChild(hiddenNum);
        } else {
            hiddenNum.value = "1";
        }
        modal.style.display = "block";
        modal.setAttribute("aria-hidden", "false");
    }

    function closeModal() {
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");
        var existingInput = document.getElementById("numTravellers");
        if (existingInput) existingInput.style.display = "block";
    }

    function bookPackage(tripID, numTravellers) {
        clearMessage();
        showMessage("Creating booking...", false);
        TravelAPI.bookPackage(tripID, numTravellers, function (err, response) {
            if (err) {
                showMessage(err.message, true);
                return;
            }
            if (!response || String(response.status).toLowerCase() !== "success") {
                showMessage((response && response.data) || "Booking failed.", true);
                return;
            }
            showMessage(response.data || "Booking successfully created! Only you have been booked.", false);
            closeModal();
            loadPackage();
        });
    }

    if (!TravelAPI.getApiKey()) {
        showMessage("Please log in first. The updated traveller API requires an API key for every request.", true);
        container.innerHTML = '<div class="loading-state">Please <a href="traveller_login.php">login</a> to continue.</div>';
        return;
    }

    if (!packageId) {
        showMessage("No package selected.", true);
        container.innerHTML = '<div class="loading-state">Invalid package. <a href="packages.php">Go back</a></div>';
        return;
    }

    if (bookingForm) {
        bookingForm.onsubmit = function (e) {
            var selectedTripID;
            var numTravellers = 1;
            if (e && e.preventDefault) e.preventDefault();
            selectedTripID = groupTripSelect.value;
            if (!selectedTripID) {
                showMessage("Please select a trip date.", true);
                return false;
            }
            bookPackage(selectedTripID, numTravellers);
            return false;
        };
    }

    if (document.querySelector(".modal-close")) {
        document.querySelector(".modal-close").onclick = closeModal;
    }

    window.onclick = function (e) {
        if (e.target === modal) closeModal();
    };

    loadPackage();
});