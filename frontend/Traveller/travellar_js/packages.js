document.addEventListener("DOMContentLoaded", function() {
    var container = document.getElementById("packagesGrid");
    var messageDiv = document.getElementById("packagesMessage");

    function setMessage(msg, isError) {
        if (messageDiv) {
            messageDiv.textContent = msg;
            messageDiv.className = isError ? "packages-message error" : "packages-message";
        }
    }

    function escapeHTML(str) {
        return String(str || "").replace(/[&<>]/g, function(m) {
            if (m === "&") return "&amp;";
            if (m === "<") return "&lt;";
            if (m === ">") return "&gt;";
            return m;
        });
    }

    function formatPrice(value) {
        return parseFloat(value || 0).toLocaleString("en-ZA", { minimumFractionDigits: 2 });
    }

    // Store orderId locally (if available)
    function getStoredOrderId(packageId) {
        var key = "booking_package_" + packageId;
        return localStorage.getItem(key);
    }

    function storeOrderId(packageId, orderId) {
        var key = "booking_package_" + packageId;
        localStorage.setItem(key, orderId);
    }

    function removeStoredOrderId(packageId) {
        var key = "booking_package_" + packageId;
        localStorage.removeItem(key);
    }

    function renderPackage(pkg, storedOrderId) {
        if (!pkg) {
            container.innerHTML = "<div class='empty-state'>Package not found.</div>";
            return;
        }

        var availableTrips = (pkg.upcomingGroupTrips || []).filter(t => t.spotsRemaining > 0);
        var hasAvailableTrips = availableTrips.length > 0;

        var tripsHtml = '<option value="">-- Select a trip --</option>';
        if (hasAvailableTrips) {
            for (var i = 0; i < availableTrips.length; i++) {
                var trip = availableTrips[i];
                tripsHtml += `<option value="${escapeHTML(trip.tripID)}">${escapeHTML(trip.tripDate)} - ${escapeHTML(trip.spotsRemaining)} spots left</option>`;
            }
        } else {
            tripsHtml = '<option disabled>No upcoming trips with available spots</option>';
        }

        var agency = pkg.agencyDetails || {};

        var html = `
            <div class="package-detail">
                <div class="package-header">
                    <h2>${escapeHTML(pkg.name)}</h2>
                    <p class="location">${escapeHTML(pkg.destinationCity)}, ${escapeHTML(pkg.destinationCountry)}</p>
                    <p class="type">${escapeHTML(pkg.type)} Package · ${pkg.duration} days</p>
                </div>
                <div class="package-description">${escapeHTML(pkg.description)}</div>
                <div class="package-price">ZAR ${formatPrice(pkg.pricePerPerson)} per person</div>
                <div class="package-agency">
                    <strong>Agency:</strong> ${escapeHTML(agency.agencyName)}<br>
                    <strong>Contact:</strong> ${escapeHTML(agency.email)} | ${escapeHTML(agency.phone)}
                </div>
                <div class="booking-section">
                    <h3>Book this package</h3>
                    <div class="form-row">
                        <label for="tripSelect">Choose trip date:</label>
                        <select id="tripSelect" ${!hasAvailableTrips ? 'disabled' : ''}>${tripsHtml}</select>
                    </div>
                    <div class="form-row">
                        <label for="travellerCount">Number of travellers:</label>
                        <input type="number" id="travellerCount" min="1" value="1" ${!hasAvailableTrips ? 'disabled' : ''}>
                    </div>
                    <button id="bookButton" ${!hasAvailableTrips ? 'disabled' : ''}>Book now</button>
                    <div id="bookingMessage" class="booking-status"></div>
                </div>
                ${storedOrderId ? `
                <div class="cancel-section">
                    <p>You have a booking for this package (Order ID: ${escapeHTML(storedOrderId)}).</p>
                    <button id="cancelButton">Cancel this booking</button>
                    <div id="cancelMessage" class="booking-status"></div>
                </div>
                ` : ''}
                <div class="reviews">
                    <h3>Reviews</h3>
                    ${pkg.reviews && pkg.reviews.length ? pkg.reviews.map(r => `
                        <div class="review">
                            <strong>Rating: ${r.rating}/5</strong> - ${r.date}<br>${escapeHTML(r.comment)}
                        </div>
                    `).join('') : "<p>No reviews yet.</p>"}
                </div>
            </div>
        `;
        container.innerHTML = html;

        // ---- BOOKING ----
        var bookBtn = document.getElementById("bookButton");
        var tripSelect = document.getElementById("tripSelect");
        var travellerInput = document.getElementById("travellerCount");
        var bookingMsg = document.getElementById("bookingMessage");

        if (bookBtn && tripSelect && travellerInput) {
            bookBtn.addEventListener("click", function() {
                var tripId = tripSelect.value;
                var num = parseInt(travellerInput.value, 10);
                if (!tripId) {
                    bookingMsg.textContent = "Please select a trip.";
                    return;
                }
                if (isNaN(num) || num < 1) {
                    bookingMsg.textContent = "Enter a valid number of travellers.";
                    return;
                }
                bookBtn.disabled = true;
                bookingMsg.textContent = "Processing booking...";
                TravelAPI.bookPackage(tripId, num, function(error, response) {
                    if (error) {
                        bookingMsg.textContent = error.message;
                        bookBtn.disabled = false;
                        return;
                    }
                    if (response.status === "success") {
                        // Try to extract orderId from response (if server returns it)
                        var orderId = response.data && response.data.orderId ? response.data.orderId : null;
                        if (orderId) {
                            storeOrderId(pkg.packageID, orderId);
                            bookingMsg.textContent = "Booking successful! Order ID: " + orderId;
                        } else {
                            bookingMsg.textContent = response.data || "Booking created (no order ID returned – cancellation will not work).";
                        }
                        setTimeout(() => location.reload(), 1500);
                    } else {
                        bookingMsg.textContent = response.data || "Booking failed.";
                    }
                    bookBtn.disabled = false;
                });
            });
        }

        // ---- CANCELLATION ----
        var cancelBtn = document.getElementById("cancelButton");
        var cancelMsg = document.getElementById("cancelMessage");
        if (cancelBtn && storedOrderId) {
            cancelBtn.addEventListener("click", function() {
                cancelBtn.disabled = true;
                cancelMsg.textContent = "Cancelling...";
                TravelAPI.cancelBooking(storedOrderId, function(error, response) {
                    if (error) {
                        cancelMsg.textContent = error.message;
                        cancelBtn.disabled = false;
                        return;
                    }
                    if (response.status === "success") {
                        removeStoredOrderId(pkg.packageID);
                        cancelMsg.textContent = "Booking cancelled successfully.";
                        setTimeout(() => location.reload(), 1500);
                    } else {
                        cancelMsg.textContent = response.data || "Cancellation failed.";
                        cancelBtn.disabled = false;
                    }
                });
            });
        }
    }

    function loadPackage() {
        var apiKey = TravelAPI.getApiKey();
        if (!apiKey) {
            setMessage("Please log in first.", true);
            return;
        }

        var urlParams = new URLSearchParams(window.location.search);
        var packageId = urlParams.get("id") || 1;

        setMessage("Loading package...", false);
        container.innerHTML = "<div class='loading'>Loading package details...</div>";

        TravelAPI.getPackage(packageId, function(error, response) {
            if (error) {
                setMessage(error.message, true);
                return;
            }
            if (response.status !== "success") {
                setMessage(response.data || "Failed to load package", true);
                return;
            }
            setMessage("", false);
            var pkg = response.data;
            var storedOrderId = getStoredOrderId(pkg.packageID);
            renderPackage(pkg, storedOrderId);
        });
    }

    loadPackage();
});