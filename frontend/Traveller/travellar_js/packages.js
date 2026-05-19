document.addEventListener("DOMContentLoaded", function () {
    var packagesGrid = document.getElementById("packagesGrid");
    var packagesMessage = document.getElementById("packagesMessage");

    function setMessage(message, isError) {
        if (!packagesMessage) {
            return;
        }
        packagesMessage.textContent = message || "";
        packagesMessage.className = isError ? "packages-message error" : "packages-message";
    }

    function escapeHTML(value) {
        return String(value === null || value === undefined ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function formatPrice(value) {
        var numberValue = parseFloat(value || 0);
        return numberValue.toLocaleString("en-ZA", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function getRatingWord(rating) {
        rating = parseFloat(rating || 0);
        if (rating >= 9) {
            return "Superb";
        }
        if (rating >= 8.5) {
            return "Excellent";
        }
        if (rating >= 7.5) {
            return "Very Good";
        }
        if (rating > 0) {
            return "Good";
        }
        return "New";
    }

    function getStoredBooking(packageID) {
        try {
            var bookings = JSON.parse(localStorage.getItem("packageBookings") || "{}");
            return bookings[String(packageID)] || null;
        } catch (e) {
            return null;
        }
    }

    function saveStoredBooking(packageID, booking) {
        var bookings = {};
        try {
            bookings = JSON.parse(localStorage.getItem("packageBookings") || "{}");
        } catch (e) {
            bookings = {};
        }
        bookings[String(packageID)] = booking;
        localStorage.setItem("packageBookings", JSON.stringify(bookings));
    }

    function removeStoredBooking(packageID) {
        var bookings = {};
        try {
            bookings = JSON.parse(localStorage.getItem("packageBookings") || "{}");
        } catch (e) {
            bookings = {};
        }
        delete bookings[String(packageID)];
        localStorage.setItem("packageBookings", JSON.stringify(bookings));
    }

    function firstAvailableTrip(pkg) {
        var trips = pkg.upcomingGroupTrips || [];
        for (var i = 0; i < trips.length; i++) {
            if (parseInt(trips[i].spotsRemaining, 10) > 0) {
                return trips[i];
            }
        }
        return trips.length > 0 ? trips[0] : null;
    }

    function buildTripOptions(trips) {
        if (!trips || trips.length === 0) {
            return '<option value="">No upcoming trips</option>';
        }

        var html = "";
        for (var i = 0; i < trips.length; i++) {
            var trip = trips[i];
            var remaining = parseInt(trip.spotsRemaining, 10);
            var disabled = remaining <= 0 ? " disabled" : "";
            html += '<option value="' + escapeHTML(trip.tripID) + '" data-spots="' + escapeHTML(remaining) + '"' + disabled + '>' +
                escapeHTML(trip.tripDate) + ' - ' + escapeHTML(remaining) + ' spots left</option>';
        }
        return html;
    }

    function renderPackages(packages) {
        packagesGrid.innerHTML = "";

        if (!packages || packages.length === 0) {
            packagesGrid.innerHTML = '<div class="empty-state">No active packages were found.</div>';
            return;
        }

        for (var i = 0; i < packages.length; i++) {
            var pkg = packages[i];
            var rating = parseFloat(pkg.averageRating || 0);
            var reviewCount = parseInt(pkg.reviewCount || 0, 10);
            var storedBooking = getStoredBooking(pkg.packageID);
            var activeTrip = firstAvailableTrip(pkg);
            var canBook = activeTrip && parseInt(activeTrip.spotsRemaining, 10) > 0;

            var card = document.createElement("div");
            card.className = "package-card";
            card.setAttribute("data-package-id", pkg.packageID);

            card.innerHTML =
                '<div class="fav-btn">+</div>' +
                '<div class="card-image-placeholder">' + escapeHTML(pkg.type) + '</div>' +
                '<div class="card-content">' +
                '<div class="card-type-row">' +
                '<span>' + escapeHTML(pkg.type) + ' Package</span>' +
                '<span class="badge">Genius</span>' +
                '</div>' +
                '<h3 class="card-title">' + escapeHTML(pkg.name) + '</h3>' +
                '<div class="card-location">' + escapeHTML(pkg.destinationCity) + ', ' + escapeHTML(pkg.destinationCountry) + '</div>' +
                '<p class="card-description">' + escapeHTML(pkg.description || '') + '</p>' +
                '<div class="card-rating">' +
                '<div class="rating-score">' + (rating > 0 ? rating.toFixed(1) : '0.0') + '</div>' +
                '<div class="rating-text">' +
                '<span class="rating-word">' + escapeHTML(getRatingWord(rating)) + '</span>' +
                '<span class="rating-count">' + reviewCount + ' reviews</span>' +
                '</div>' +
                '</div>' +
                '<div class="card-distance">' + escapeHTML(pkg.duration) + ' Days duration</div>' +
                '<div class="card-trip">Next trip: ' + (activeTrip ? escapeHTML(activeTrip.tripDate) : 'No upcoming trips') + '</div>' +
                '<div class="card-price-row">Starting from <span class="card-price">ZAR ' + formatPrice(pkg.pricePerPerson) + '</span></div>' +
                '<div class="booking-panel">' +
                '<label for="trip-' + escapeHTML(pkg.packageID) + '">Choose trip</label>' +
                '<select id="trip-' + escapeHTML(pkg.packageID) + '" class="trip-select" ' + (!canBook ? 'disabled' : '') + '>' + buildTripOptions(pkg.upcomingGroupTrips) + '</select>' +
                '<label for="travellers-' + escapeHTML(pkg.packageID) + '">Travellers</label>' +
                '<input id="travellers-' + escapeHTML(pkg.packageID) + '" class="traveller-count" type="number" min="1" value="1" ' + (!canBook ? 'disabled' : '') + '>' +
                '<button type="button" class="button-book" ' + (!canBook ? 'disabled' : '') + '>Book package</button>' +
                (storedBooking ? '<button type="button" class="button-cancel">Cancel booking #' + escapeHTML(storedBooking.orderID) + '</button>' : '') +
                '<div class="card-status">' + (storedBooking ? 'Booked. Order ID: ' + escapeHTML(storedBooking.orderID) : '') + '</div>' +
                '</div>' +
                '</div>';

            packagesGrid.appendChild(card);
        }
    }

    function loadPackages() {
        if (!window.UserAPI) {
            setMessage("UserAPI could not be found. Make sure traveller_js/api.js is loaded before packages.js.", true);
            return;
        }

        if (!UserAPI.getApiKey()) {
            setMessage("Please log in as a traveller before viewing and booking packages.", true);
            packagesGrid.innerHTML = "";
            return;
        }

        setMessage("Loading packages...", false);
        packagesGrid.innerHTML = "";

        UserAPI.getAllPackages(function (error, response) {
            if (error) {
                setMessage(error.message, true);
                return;
            }

            setMessage("", false);
            renderPackages(response.data || []);
        });
    }

    packagesGrid.addEventListener("click", function (event) {
        var target = event.target;
        var card = target.closest ? target.closest(".package-card") : null;

        if (!card) {
            return;
        }

        var packageID = card.getAttribute("data-package-id");
        var statusBox = card.querySelector(".card-status");

        if (target.className.indexOf("button-book") !== -1) {
            var tripSelect = card.querySelector(".trip-select");
            var travellerInput = card.querySelector(".traveller-count");
            var groupTripID = tripSelect.value;
            var numTravellers = parseInt(travellerInput.value, 10);

            if (!groupTripID) {
                statusBox.textContent = "Please select an available trip.";
                return;
            }

            if (!numTravellers || numTravellers < 1) {
                statusBox.textContent = "Enter at least 1 traveller.";
                return;
            }

            target.disabled = true;
            statusBox.textContent = "Creating booking...";

            UserAPI.bookPackage(groupTripID, numTravellers, function (error, response) {
                target.disabled = false;

                if (error) {
                    statusBox.textContent = error.message;
                    return;
                }

                var data = response.data || {};
                var orderID = data.orderID || data.orderId || "";

                if (orderID) {
                    saveStoredBooking(packageID, {
                        orderID: orderID,
                        groupTripID: groupTripID,
                        numTravellers: numTravellers
                    });
                    statusBox.textContent = "Booking created. Order ID: " + orderID;
                    loadPackages();
                } else {
                    statusBox.textContent = typeof data === "string" ? data : "Booking created.";
                }
            });
        }

        if (target.className.indexOf("button-cancel") !== -1) {
            var booking = getStoredBooking(packageID);
            if (!booking || !booking.orderID) {
                statusBox.textContent = "No stored order ID was found for this package.";
                return;
            }

            target.disabled = true;
            statusBox.textContent = "Cancelling booking...";

            UserAPI.cancelBooking(booking.orderID, function (error, response) {
                target.disabled = false;

                if (error) {
                    statusBox.textContent = error.message;
                    return;
                }

                removeStoredBooking(packageID);
                statusBox.textContent = response.data || "Booking cancelled.";
                loadPackages();
            });
        }
    });

    loadPackages();
});
