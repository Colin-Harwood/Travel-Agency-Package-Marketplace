document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    var messageDiv = document.getElementById("accommodationsMessage");
    var grid = document.getElementById("accommodationsGrid");
    var filterDestination = document.getElementById("filterDestination");
    var filterType = document.getElementById("filterType");
    var minRating = document.getElementById("minRating");
    var minPriceInput = document.getElementById("minPrice");
    var maxPriceInput = document.getElementById("maxPrice");
    var sortSelect = document.getElementById("sortSelect");
    var applyBtn = document.getElementById("applyFiltersBtn");
    var resetBtn = document.getElementById("resetFiltersBtn");

    var allAccommodations = [];
    var modal = document.getElementById("packageModal");
    var modalList = document.getElementById("modalPackagesList");
    var closeModalSpan = document.querySelector(".modal-close");

    function setMessage(msg, isError) {
        if (!messageDiv) return;
        messageDiv.textContent = msg || "";
        messageDiv.className = isError ? "accommodations-message error" : "accommodations-message";
        messageDiv.style.display = msg ? "block" : "none";
        if (!isError && msg) {
            setTimeout(function () {
                if (messageDiv) messageDiv.style.display = "none";
            }, 5000);
        }
    }

    function escapeHtml(value) {
        return String(value === null || value === undefined ? "" : value).replace(/[&<>"']/g, function (m) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m];
        });
    }

    function formatPrice(value) {
        var num = parseFloat(value || 0);
        if (isNaN(num)) num = 0;
        return num.toLocaleString("en-ZA", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }

    function renderStars(rating) {
        var fullStars = Math.floor(rating);
        var halfStar = (rating % 1) >= 0.5;
        var emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        var stars = "";
        for (var i = 0; i < fullStars; i++) stars += "&#9733";
        if (halfStar) stars += "&frac12";
        for (var i = 0; i < emptyStars; i++) stars += "&#9734";
        return stars;
    }

    function renderAccommodationCard(acc) {
        var rating = parseFloat(acc.rating) || 0;
        var packageCount = (acc.packages && acc.packages.length) ? acc.packages.length : 0;
        var location = "";
        if (acc.city && acc.country) {
            location = acc.city + ", " + acc.country;
        } else if (acc.city) {
            location = acc.city;
        } else if (acc.country) {
            location = acc.country;
        }
        return '' +
            '<article class="accommodation-card" data-accommodation-id="' + escapeHtml(acc.accommodationID) + '">' +
            '<div class="card-content">' +
            '<span class="card-type">' + escapeHtml(acc.type || "") + '</span>' +
            '<h3 class="card-title">' + escapeHtml(acc.name || "Unnamed") + '</h3>' +
            (location ? '<div class="card-location">' + escapeHtml(location) + '</div>' : '') +
            '<div class="rating-stars">' +
            '<span class="stars">' + renderStars(rating) + '</span>' +
            '<span class="rating-value">' + rating.toFixed(1) + '/5</span>' +
            '</div>' +
            '<div class="price-per-night">' +
            '<span class="label">Per night</span>' +
            '<div class="price">ZAR ' + formatPrice(acc.pricePerNight) + '</div>' +
            '</div>' +
            (packageCount > 0 ? '<div class="package-count" data-acc-id="' + escapeHtml(acc.accommodationID) + '">' + packageCount + ' package(s) available</div>' : '<div class="package-count" style="color:#999;">No packages available</div>') +
            '</div>' +
            '</article>';
    }

    function filterAndSortAccommodations() {
        if (!allAccommodations.length) return [];
        var destination = filterDestination ? filterDestination.value.trim().toLowerCase() : "";
        var type = filterType ? filterType.value : "";
        var minRatingVal = minRating && minRating.value ? parseFloat(minRating.value) : 0;
        var minPriceVal = minPriceInput && minPriceInput.value !== "" ? parseFloat(minPriceInput.value) : 0;
        var maxPriceVal = maxPriceInput && maxPriceInput.value !== "" ? parseFloat(maxPriceInput.value) : Infinity;
        var filtered = allAccommodations.filter(function (acc) {
            var matchesDest = true;
            if (destination !== "") {
                var city = (acc.city || "").toLowerCase();
                var country = (acc.country || "").toLowerCase();
                var idMatch = String(acc.accommodationID).toLowerCase().includes(destination);
                matchesDest = city.includes(destination) || country.includes(destination) || idMatch;
            }
            var matchesType = (type === "" || acc.type === type);
            var accRating = parseFloat(acc.rating) || 0;
            var matchesRating = accRating >= minRatingVal;
            var price = parseFloat(acc.pricePerNight);
            var matchesPrice = price >= minPriceVal && price <= maxPriceVal;
            return matchesDest && matchesType && matchesRating && matchesPrice;
        });
        var sortValue = sortSelect ? sortSelect.value : "default";
        if (sortValue === "price_asc") {
            filtered.sort(function (a, b) { return parseFloat(a.pricePerNight) - parseFloat(b.pricePerNight); });
        } else if (sortValue === "price_desc") {
            filtered.sort(function (a, b) { return parseFloat(b.pricePerNight) - parseFloat(a.pricePerNight); });
        } else if (sortValue === "rating_desc") {
            filtered.sort(function (a, b) { return (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0); });
        } else if (sortValue === "name_asc") {
            filtered.sort(function (a, b) { return (a.name || "").localeCompare(b.name || ""); });
        } else {
            filtered.sort(function (a, b) { return a.accommodationID - b.accommodationID; });
        }
        return filtered;
    }

    function applyFiltersAndRender() {
        var filtered = filterAndSortAccommodations();
        if (filtered.length === 0) {
            grid.innerHTML = '<div class="empty-state">No accommodations match your filters. Try adjusting the criteria.</div>';
            setMessage("", false);
        } else {
            grid.innerHTML = filtered.map(renderAccommodationCard).join("");
            setMessage("", false);
            attachPackageClickHandlers();
        }
    }

    function attachPackageClickHandlers() {
        var packageCountDivs = document.querySelectorAll(".package-count[data-acc-id]");
        for (var i = 0; i < packageCountDivs.length; i++) {
            packageCountDivs[i].onclick = function () {
                var accId = this.getAttribute("data-acc-id");
                showPackagesForAccommodation(accId);
            };
        }
    }

    function showPackagesForAccommodation(accId) {
        if (!modal || !modalList) return;
        var accommodation = null;
        for (var i = 0; i < allAccommodations.length; i++) {
            if (String(allAccommodations[i].accommodationID) === String(accId)) {
                accommodation = allAccommodations[i];
                break;
            }
        }
        if (!accommodation || !accommodation.packages || accommodation.packages.length === 0) {
            modalList.innerHTML = '<p class="no-packages">No packages currently include this accommodation.</p>';
            modal.style.display = "block";
            return;
        }
        var html = '<ul class="package-list">';
        for (var j = 0; j < accommodation.packages.length; j++) {
            var p = accommodation.packages[j];
            var statusBadge = p.status === "Active" ? "" : '<span style="color:#999; font-size:0.7rem;"> (' + escapeHtml(p.status) + ')</span>';
            html += '<li class="package-list-item">' +
                '<a href="package_view.php?id=' + escapeHtml(p.packageID) + '" class="package-link">' +
                '<strong>' + escapeHtml(p.name) + '</strong>' +
                '<span class="package-type">(' + escapeHtml(p.type) + ')</span>' +
                statusBadge +
                '</a>' +
                '<div class="package-details">' +
                '<span class="package-price">ZAR ' + formatPrice(p.pricePerPerson) + ' per person</span>' +
                '<span class="package-duration"> ' + escapeHtml(p.duration) + ' days</span>' +
                '</div>' +
                '</li>';
        }
        html += '</ul>';
        modalList.innerHTML = html;
        modal.style.display = "block";
    }

    function closeModal() {
        if (modal) modal.style.display = "none";
    }

    function loadAccommodations() {
        var apiKey = TravelAPI.getApiKey();
        if (!apiKey) {
            setMessage("Please log in first.", true);
            grid.innerHTML = '<div class="empty-state">Please <a href="traveller_login.php">login</a> to view accommodations.</div>';
            return;
        }
        setMessage("Loading accommodations...", false);
        grid.innerHTML = '<div class="loading">Loading accommodations...</div>';
        TravelAPI.getAllAccommodations({}, function (err, response) {
            if (err) {
                setMessage(err.message, true);
                grid.innerHTML = '<div class="empty-state">' + escapeHtml(err.message) + '</div>';
                return;
            }
            if (response && response.status === "success") {
                var accommodations = response.data;
                if (!accommodations || accommodations.length === 0) {
                    allAccommodations = [];
                    grid.innerHTML = '<div class="empty-state">No accommodations were found in the database.</div>';
                    setMessage("", false);
                    return;
                }
                allAccommodations = accommodations;
                applyFiltersAndRender();
            } else {
                var errorMsg = (response && response.data) || "Failed to load accommodations.";
                setMessage(errorMsg, true);
                grid.innerHTML = '<div class="empty-state">' + escapeHtml(errorMsg) + '</div>';
            }
        });
    }

    function resetFilters() {
        if (filterDestination) filterDestination.value = "";
        if (filterType) filterType.value = "";
        if (minRating) minRating.value = "";
        if (minPriceInput) minPriceInput.value = "";
        if (maxPriceInput) maxPriceInput.value = "";
        if (sortSelect) sortSelect.value = "default";
        applyFiltersAndRender();
        setMessage("Filters reset.", false);
    }

    if (applyBtn) applyBtn.addEventListener("click", applyFiltersAndRender);
    if (resetBtn) resetBtn.addEventListener("click", resetFilters);

    if (filterDestination) {
        var debounceTimer;
        filterDestination.addEventListener("input", function () {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(applyFiltersAndRender, 300);
        });
    }

    if (filterType) filterType.addEventListener("change", applyFiltersAndRender);
    if (minRating) minRating.addEventListener("change", applyFiltersAndRender);
    if (minPriceInput) minPriceInput.addEventListener("input", applyFiltersAndRender);
    if (maxPriceInput) maxPriceInput.addEventListener("input", applyFiltersAndRender);
    if (sortSelect) sortSelect.addEventListener("change", applyFiltersAndRender);

    if (closeModalSpan) closeModalSpan.onclick = closeModal;
    window.onclick = function (e) {
        if (e.target === modal) closeModal();
    };

    loadAccommodations();
});