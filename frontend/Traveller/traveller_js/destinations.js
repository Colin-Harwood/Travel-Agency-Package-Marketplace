document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    var messageDiv = document.getElementById("destinationsMessage");
    var grid = document.getElementById("destinationsGrid");
    var filterDestination = document.getElementById("filterDestination");
    var sortSelect = document.getElementById("sortSelect");
    var resetBtn = document.getElementById("resetFiltersBtn");

    var allDestinations = [];
    var modal = document.getElementById("destinationModal");
    var modalClose = document.getElementById("modalClose");
    var modalDetailContent = document.getElementById("modalDetailContent");

    function setMessage(msg, isError) {
        if (!messageDiv) return;
        messageDiv.textContent = msg || "";
        messageDiv.className = isError ? "destinations-message error" : "destinations-message";
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
        if (!rating || rating === 0) return "No reviews yet";
        var fullStars = Math.floor(rating);
        var halfStar = (rating % 1) >= 0.5;
        var emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        var stars = "";

        for (var i = 0; i < fullStars; i++) stars += "&#9733";
        if (halfStar) stars += "&#189;";
        for (var i = 0; i < emptyStars; i++) stars += "&#9734";

        return stars;
    }

    function renderDestinationCard(dest) {
        var stats = dest.stats || {};
        var packageCount = stats.packageCount || 0;
        var avgRating = stats.avgRating ? parseFloat(stats.avgRating) : 0;

        var previewPackages = [];
        if (dest.packages && dest.packages.length > 0) {
            previewPackages = dest.packages.slice(0, 3);
        }

        var previewHtml = '';
        if (previewPackages.length > 0) {
            previewHtml = '<div class="package-preview">' +
                '<div class="package-preview-title">Featured packages</div>' +
                '<div class="package-tags">';
            for (var i = 0; i < previewPackages.length; i++) {
                previewHtml += '<span class="package-tag">' + escapeHtml(previewPackages[i].name.length > 25 ?
                    previewPackages[i].name.substring(0, 25) + "..." : previewPackages[i].name) + '</span>';
            }
            if (dest.packages.length > 3) {
                previewHtml += '<span class="package-tag">+' + (dest.packages.length - 3) + ' more</span>';
            }
            previewHtml += '</div></div>';
        }

        return '' +
            '<article class="destination-card" data-destination-id="' + escapeHtml(dest.destinationID) + '">' +
            '<div class="card-content">' +
            '<h3 class="card-title">' + escapeHtml(dest.city) + '</h3>' +
            '<div class="card-location">' + escapeHtml(dest.country) + '</div>' +
            '<p class="card-description">' + escapeHtml(dest.description && dest.description.length > 100 ?
                dest.description.substring(0, 100) + "..." : dest.description || "No description available.") + '</p>' +
            '<div class="simple-stats">' +
            '<div class="simple-stat"><span class="stat-number">' + packageCount + '</span> packages</div>' +
            (avgRating > 0 ? '<div class="simple-stat rating"><span class="stars-small">' + renderStars(avgRating) + '</span> <span>(' + avgRating.toFixed(1) + ')</span></div>' : '') +
            '</div>' +
            previewHtml +
            '<button class="view-details-btn" data-dest-id="' + escapeHtml(dest.destinationID) + '">View Details</button>' +
            '</div>' +
            '</article>';
    }

    function renderDetailedModal(dest) {
        var stats = dest.stats || {};
        var avgRating = stats.avgRating ? parseFloat(stats.avgRating) : 0;
        var reviewCount = stats.reviewCount || 0;

        var packagesHtml = '';
        if (dest.packages && dest.packages.length > 0) {
            packagesHtml = '<div class="modal-packages-list">';
            for (var i = 0; i < dest.packages.length; i++) {
                var p = dest.packages[i];
                var statusClass = p.status === 'Active' ? 'package-status-active' : 'package-status-inactive';
                packagesHtml += '<div class="modal-package-item">' +
                    '<a href="package_view.php?id=' + escapeHtml(p.packageID) + '" class="modal-package-link">' +
                    '<strong>' + escapeHtml(p.name) + '</strong>' +
                    '<span class="modal-package-type">(' + escapeHtml(p.type) + ')</span>' +
                    '</a>' +
                    '<div class="modal-package-details">' +
                    '<span>ZAR ' + formatPrice(p.pricePerPerson) + ' per person</span>' +
                    '<span>' + escapeHtml(p.duration) + ' days</span>' +
                    '</div>' +
                    '</div>';
            }
            packagesHtml += '</div>';
        } else {
            packagesHtml = '<p class="no-packages">No packages available for this destination yet.</p>';
        }

        return '' +
            '<div class="modal-header">' +
            '<h2>' + escapeHtml(dest.city) + ', ' + escapeHtml(dest.country) + '</h2>' +
            '</div>' +
            '<div class="modal-description">' +
            '<p>' + escapeHtml(dest.description || "No description available.") + '</p>' +
            '</div>' +
            '<div class="modal-stats-grid">' +
            '<div class="modal-stat-card"><div class="modal-stat-value">' + (stats.packageCount || 0) + '</div><div class="modal-stat-label">Total Packages</div></div>' +
            '<div class="modal-stat-card"><div class="modal-stat-value">' + (stats.agencyCount || 0) + '</div><div class="modal-stat-label">Agencies</div></div>' +
            '<div class="modal-stat-card"><div class="modal-stat-value">' + (stats.bookingCount || 0) + '</div><div class="modal-stat-label">Bookings</div></div>' +
            '<div class="modal-stat-card"><div class="modal-stat-value">' + (stats.upcomingTrips || 0) + '</div><div class="modal-stat-label">Upcoming Trips</div></div>' +
            '<div class="modal-stat-card"><div class="modal-stat-value">' + (stats.reviewCount || 0) + '</div><div class="modal-stat-label">Reviews</div></div>' +
            '<div class="modal-stat-card"><div class="modal-stat-value">' + (avgRating > 0 ? avgRating.toFixed(1) : 'N/A') + '</div><div class="modal-stat-label">Avg Rating</div></div>' +
            '</div>' +
            (avgRating > 0 ? '<div class="modal-rating"><span class="rating-stars-large">' + renderStars(avgRating) + '</span> <span class="rating-count">(' + reviewCount + ' traveller reviews)</span></div>' : '') +
            '<div class="modal-price-range">' +
            '<strong>Price Range:</strong> ZAR ' + formatPrice(stats.minPrice) + ' - ZAR ' + formatPrice(stats.maxPrice || stats.minPrice) +
            '</div>' +
            '<div class="modal-packages-section">' +
            '<h3>Available Packages (' + (stats.packageCount || 0) + ')</h3>' +
            packagesHtml +
            '</div>' +
            '<div class="modal-footer">' +
            '<a href="packages.php?destination=' + encodeURIComponent(dest.city) + '" class="view-all-packages-link">View all packages for ' + escapeHtml(dest.city) + '</a>' +
            '</div>';
    }

    function filterAndSortDestinations() {
        if (!allDestinations.length) return [];

        var searchTerm = filterDestination ? filterDestination.value.trim().toLowerCase() : "";

        var filtered = allDestinations.filter(function (dest) {
            if (searchTerm === "") return true;
            var city = (dest.city || "").toLowerCase();
            var country = (dest.country || "").toLowerCase();
            return city.includes(searchTerm) || country.includes(searchTerm);
        });

        var sortValue = sortSelect ? sortSelect.value : "default";

        if (sortValue === "name_asc") {
            filtered.sort(function (a, b) { return (a.city || "").localeCompare(b.city || ""); });
        } else if (sortValue === "name_desc") {
            filtered.sort(function (a, b) { return (b.city || "").localeCompare(a.city || ""); });
        } else if (sortValue === "packages_desc") {
            filtered.sort(function (a, b) {
                var countA = (a.stats && a.stats.packageCount) || 0;
                var countB = (b.stats && b.stats.packageCount) || 0;
                return countB - countA;
            });
        } else if (sortValue === "rating_desc") {
            filtered.sort(function (a, b) {
                var ratingA = (a.stats && a.stats.avgRating) || 0;
                var ratingB = (b.stats && b.stats.avgRating) || 0;
                return ratingB - ratingA;
            });
        } else if (sortValue === "price_asc") {
            filtered.sort(function (a, b) {
                var priceA = (a.stats && a.stats.minPrice) ? parseFloat(a.stats.minPrice) : Infinity;
                var priceB = (b.stats && b.stats.minPrice) ? parseFloat(b.stats.minPrice) : Infinity;
                return priceA - priceB;
            });
        } else {
            filtered.sort(function (a, b) { return (a.destinationID || 0) - (b.destinationID || 0); });
        }

        return filtered;
    }

    function applyFiltersAndRender() {
        var filtered = filterAndSortDestinations();
        if (filtered.length === 0) {
            grid.innerHTML = '<div class="empty-state">No destinations match your search. Try a different search term.</div>';
            setMessage("", false);
        } else {
            grid.innerHTML = filtered.map(renderDestinationCard).join("");
            setMessage("", false);
            attachDetailButtonHandlers();
        }
    }

    function attachDetailButtonHandlers() {
        var detailBtns = document.querySelectorAll(".view-details-btn");
        for (var i = 0; i < detailBtns.length; i++) {
            detailBtns[i].addEventListener("click", function (e) {
                e.stopPropagation();
                var destId = this.getAttribute("data-dest-id");
                showDestinationDetails(destId);
            });
        }
    }

    function showDestinationDetails(destId) {
        if (!modal || !modalDetailContent) return;

        var destination = null;
        for (var i = 0; i < allDestinations.length; i++) {
            if (String(allDestinations[i].destinationID) === String(destId)) {
                destination = allDestinations[i];
                break;
            }
        }

        if (!destination) {
            modalDetailContent.innerHTML = '<div class="error-details">Destination not found.</div>';
            modal.style.display = "block";
            return;
        }

        modalDetailContent.innerHTML = renderDetailedModal(destination);
        modal.style.display = "block";
    }

    function closeModal() {
        if (modal) modal.style.display = "none";
    }

    function loadDestinations() {
        var apiKey = TravelAPI.getApiKey();
        if (!apiKey) {
            setMessage("Please log in first to view destinations.", true);
            grid.innerHTML = '<div class="empty-state">Please <a href="traveller_login.php">login</a> to view destinations.</div>';
            return;
        }

        setMessage("Loading destinations...", false);
        grid.innerHTML = '<div class="loading">Loading destinations...</div>';

        TravelAPI.getAllDestinations(function (err, response) {
            if (err) {
                setMessage(err.message, true);
                grid.innerHTML = '<div class="empty-state">' + escapeHtml(err.message) + '</div>';
                return;
            }

            if (response && response.status === "success") {
                var destinations = response.data;
                if (!destinations || destinations.length === 0) {
                    allDestinations = [];
                    grid.innerHTML = '<div class="empty-state">No destinations were found in the database.</div>';
                    setMessage("", false);
                    return;
                }
                allDestinations = destinations;
                applyFiltersAndRender();
            } else {
                var errorMsg = (response && response.data) || "Failed to load destinations.";
                setMessage(errorMsg, true);
                grid.innerHTML = '<div class="empty-state">' + escapeHtml(errorMsg) + '</div>';
            }
        });
    }

    function resetFilters() {
        if (filterDestination) filterDestination.value = "";
        if (sortSelect) sortSelect.value = "default";
        applyFiltersAndRender();
        setMessage("Filters reset.", false);
    }

    if (modalClose) modalClose.onclick = closeModal;
    window.onclick = function (e) {
        if (e.target === modal) closeModal();
    };

    if (resetBtn) resetBtn.addEventListener("click", resetFilters);

    if (filterDestination) {
        var debounceTimer;
        filterDestination.addEventListener("input", function () {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(applyFiltersAndRender, 300);
        });
    }

    if (sortSelect) sortSelect.addEventListener("change", applyFiltersAndRender);

    loadDestinations();
});