document.addEventListener("DOMContentLoaded", function () {
    var urlParams = new URLSearchParams(window.location.search);
    var packageId = urlParams.get("id");
    var messageDiv = document.getElementById("detailMessage");
    var container = document.getElementById("packageDetailContainer");
    var modal = document.getElementById("bookingModal");
    var bookingForm = document.getElementById("bookingForm");
    var groupTripSelect = document.getElementById("groupTripSelect");
    var currentPackageData = null;

    if (!TravelAPI.getApiKey()) {
        showMessage("Please log in first to view package details.", true);
        container.innerHTML = '<div class="loading-state">Please <a href="traveller_login.php">login</a> to continue.</div>';
        return;
    }

    if (!packageId) {
        showMessage("No package selected.", true);
        container.innerHTML = '<div class="loading-state">Invalid package. <a href="packages.php">Go back</a></div>';
        return;
    }

    function showMessage(msg, isError) {
        messageDiv.textContent = msg || "";
        messageDiv.className = isError ? "detail-message error" : "detail-message success";
        if (msg) messageDiv.style.display = "block";
        else messageDiv.style.display = "none";
    }

    function clearMessage() {
        showMessage("", false);
    }

    function renderPackage(pkg) {
        if (!pkg) return "<div class='loading-state'>No data available.</div>";

        var agency = pkg.agencyDetails || {};
        var reviewsHtml = "";
        if (pkg.reviews && pkg.reviews.length) {
            pkg.reviews.forEach(function (r) {
                reviewsHtml += `
                    <div class="review-item">
                        <div class="rating">${"*".repeat(r.rating)} ${r.rating}/5</div>
                        <div class="comment">${escapeHtml(r.comment || "")}</div>
                        <div class="date">${r.date || ""}</div>
                    </div>
                `;
            });
        } else {
            reviewsHtml = "<p>No reviews yet.</p>";
        }

        var flightsHtml = "";
        if (pkg.flights && pkg.flights.length) {
            pkg.flights.forEach(function (f) {
                flightsHtml += `<div class="flight-item"><span>${escapeHtml(f.airline)} ${f.flightNumber}</span> ${f.departure} → ${f.arrival} | ZAR ${f.price}</div>`;
            });
        } else { flightsHtml = "<p>No flights assigned.</p>"; }

        var accommodationsHtml = "";
        if (pkg.accommodations && pkg.accommodations.length) {
            pkg.accommodations.forEach(function (a) {
                accommodationsHtml += `<div class="accommodation-item"><span>${escapeHtml(a.name)} (${a.type})</span> Rating: ${a.rating || "N/A"} | ZAR ${a.pricePerNight}/night</div>`;
            });
        } else { accommodationsHtml = "<p>No accommodations listed.</p>"; }

        var restaurantsHtml = "";
        if (pkg.restaurants && pkg.restaurants.length) {
            pkg.restaurants.forEach(function (r) {
                restaurantsHtml += `<div class="restaurant-item"><span>${escapeHtml(r.name)}</span> ${r.cuisine || ""} | ${r.priceRange}</div>`;
            });
        } else { restaurantsHtml = "<p>No restaurants listed.</p>"; }

        var attractionsHtml = "";
        if (pkg.attractions && pkg.attractions.length) {
            pkg.attractions.forEach(function (a) {
                attractionsHtml += `<div class="attraction-item"><span>${escapeHtml(a.name)}</span> Entry: ZAR ${a.entryFee}</div>`;
            });
        } else { attractionsHtml = "<p>No attractions listed.</p>"; }

        var tripsHtml = "";
        if (pkg.upcomingGroupTrips && pkg.upcomingGroupTrips.length) {
            tripsHtml = `<table class="trips-table">
                            <thead><tr><th>Date</th><th>Spots left</th><th>Max size</th><th></th></tr></thead><tbody>`;
            pkg.upcomingGroupTrips.forEach(function (t) {
                tripsHtml += `<tr>
                                <td>${t.tripDate}</td>
                                <td>${t.spotsRemaining}</td>
                                <td>${t.maxSize}</td>
                                <td><button class="btn-book-trip" data-trip-id="${t.tripID}">Book</button></td>
                              </tr>`;
            });
            tripsHtml += `</tbody></table>`;
        } else {
            tripsHtml = "<p>No upcoming group trips available for this package.</p>";
        }

        return `
            <div class="package-detail-card">
                <div class="package-header">
                    <h1>${escapeHtml(pkg.name)}</h1>
                    <div class="package-meta">
                        <span>${escapeHtml(pkg.type)} Package</span>
                        <span>${pkg.duration} days</span>
                        <span>From ZAR ${formatPrice(pkg.pricePerPerson)} per person</span>
                    </div>
                </div>
                <div class="package-body">
                    <div>
                        <div class="info-section">
                            <h3>About this package</h3>
                            <p>${escapeHtml(pkg.description || "No description provided.")}</p>
                        </div>
                        <div class="info-section">
                            <h3>Destination</h3>
                            <p><strong>${escapeHtml(pkg.destinationCity)}, ${escapeHtml(pkg.destinationCountry)}</strong></p>
                        </div>
                        <div class="info-section">
                            <h3>Agency</h3>
                            <div class="agency-details">
                                <strong>${escapeHtml(agency.agencyName)}</strong><br>
                                ${escapeHtml(agency.street || "")}<br>
                                ${escapeHtml(agency.city || "")}<br>
                                ${escapeHtml(agency.email || "")}<br>
                                ${escapeHtml(agency.phone || "")}
                            </div>
                        </div>
                        <div class="info-section">
                            <h3>Reviews</h3>
                            ${reviewsHtml}
                        </div>
                    </div>
                    <div>
                        <div class="info-section">
                            <h3>Flights</h3>
                            ${flightsHtml}
                        </div>
                        <div class="info-section">
                            <h3>Accommodations</h3>
                            ${accommodationsHtml}
                        </div>
                        <div class="info-section">
                            <h3>Restaurants</h3>
                            ${restaurantsHtml}
                        </div>
                        <div class="info-section">
                            <h3>Attractions</h3>
                            ${attractionsHtml}
                        </div>
                        <div class="info-section">
                            <h3>Upcoming Group Trips</h3>
                            ${tripsHtml}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function escapeHtml(str) {
        if (!str) return "";
        return String(str).replace(/[&<>]/g, function (m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    function formatPrice(value) {
        var num = parseFloat(value);
        if (isNaN(num)) num = 0;
        return num.toLocaleString("en-ZA", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }

    function loadPackage() {
        clearMessage();
        container.innerHTML = '<div class="loading-state">Loading package details...</div>';
        TravelAPI.getPackage(packageId, function (err, response) {
            if (err) {
                showMessage(err.message, true);
                container.innerHTML = '<div class="loading-state">Failed to load package.</div>';
                return;
            }
            if (response.status !== "success") {
                showMessage(response.data || "Error loading package.", true);
                container.innerHTML = '<div class="loading-state">Package not found.</div>';
                return;
            }
            currentPackageData = response.data;
            container.innerHTML = renderPackage(currentPackageData);
            attachBookButtons();
        });
    }

    function attachBookButtons() {
        var bookBtns = document.querySelectorAll(".btn-book-trip");
        bookBtns.forEach(function (btn) {
            btn.addEventListener("click", function (e) {
                var tripID = btn.getAttribute("data-trip-id");
                openBookingModal(tripID);
            });
        });
    }

    function openBookingModal(tripID) {
        if (!currentPackageData) return;
        groupTripSelect.innerHTML = "";
        var trip = currentPackageData.upcomingGroupTrips.find(function (t) { return t.tripID == tripID; });
        if (trip) {
            var option = document.createElement("option");
            option.value = trip.tripID;
            option.textContent = `${trip.tripDate} (${trip.spotsRemaining} spots left)`;
            groupTripSelect.appendChild(option);
        }
        modal.style.display = "block";
    }

    function closeModal() {
        modal.style.display = "none";
    }

    function bookPackage(tripID, numTravellers) {
        clearMessage();
        TravelAPI.bookPackage(tripID, numTravellers, function (err, response) {
            if (err) {
                showMessage(err.message, true);
                return;
            }
            if (response.status !== "success") {
                showMessage(response.data || "Booking failed.", true);
                return;
            }
            showMessage(response.data || "Booking successfully created!", false);
            closeModal();
            loadPackage();
        });
    }

    bookingForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var selectedTripID = groupTripSelect.value;
        var numTravellers = document.getElementById("numTravellers").value;
        if (!selectedTripID) {
            showMessage("Please select a trip date.", true);
            return;
        }
        if (numTravellers < 1) {
            showMessage("Number of travellers must be at least 1.", true);
            return;
        }
        bookPackage(selectedTripID, numTravellers);
    });

    document.querySelector(".modal-close").addEventListener("click", closeModal);
    window.addEventListener("click", function (e) {
        if (e.target === modal) closeModal();
    });

    loadPackage();
});