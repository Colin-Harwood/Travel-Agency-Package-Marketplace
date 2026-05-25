document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    var messageDiv = document.getElementById("packagesMessage");
    var grid = document.getElementById("packagesGrid");
    var filterDestination = document.getElementById("filterDestination");
    var minPriceInput = document.getElementById("minPrice");
    var maxPriceInput = document.getElementById("maxPrice");
    var sortSelect = document.getElementById("sortSelect");
    var applyBtn = document.getElementById("applyFiltersBtn");
    var resetBtn = document.getElementById("resetFiltersBtn");

    var allPackages = [];

    function getQueryParam(name) {
        var urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name) || "";
    }

    function setMessage(msg, isError) {
        if (!messageDiv) return;
        messageDiv.textContent = msg || "";
        messageDiv.className = isError ? "packages-message error" : "packages-message";
        messageDiv.style.display = msg ? "block" : "none";
        if (!isError && msg) {
            setTimeout(function () {
                if (messageDiv) messageDiv.style.display = "none";
            }, 5000);
        }
    }

    function escapeHTML(value) {
        if (value === null || value === undefined) return "";
        return String(value).replace(/[&<>"']/g, function (m) {
            if (m === "&") return "&amp;";
            if (m === "<") return "&lt;";
            if (m === ">") return "&gt;";
            if (m === '"') return "&quot;";
            return "&#039;";
        });
    }

    function formatPrice(value) {
        var num = parseFloat(value || 0);
        if (isNaN(num)) num = 0;
        return num.toLocaleString("en-ZA", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }

    function renderPackageCard(pkg) {
        var detailUrl = "package_view.php?id=" + encodeURIComponent(pkg.packageID);
        var location = [pkg.destinationCity, pkg.destinationCountry].filter(Boolean).join(", ");
        var agency = pkg.agencyName ? "By " + pkg.agencyName : "Agency not listed";
        var status = pkg.status || "Unknown";

        return '<article class="package-card" data-package-id="' + escapeHTML(pkg.packageID) + '">' +
            '<a class="card-link" href="' + detailUrl + '">' +
            '<div class="card-image-placeholder">' + escapeHTML(pkg.name) + '</div>' +
            '<div class="card-content">' +
            '<div class="card-type-row">' +
            '<span>' + escapeHTML(pkg.type || "Package") + ' Package</span>' +
            '<span class="badge">' + escapeHTML(status) + '</span>' +
            '</div>' +
            '<h3 class="card-title">' + escapeHTML(pkg.name || "Unnamed package") + '</h3>' +
            '<div class="card-location">' + escapeHTML(location || "Destination not listed") + '</div>' +
            '<p class="card-description">' + escapeHTML(pkg.description || "") + '</p>' +
            '<div class="card-rating">' +
            '<div class="rating-text">' +
            '<span class="rating-word"><br></span>' +
            '<span class="rating-count">' + escapeHTML(agency) + '</span>' +
            '</div>' +
            '</div>' +
            '<div class="card-distance">' + escapeHTML(pkg.duration ? pkg.duration + " days" : "Duration not listed") + '</div>' +
            '<div class="card-price-row">Starting from <span class="card-price">ZAR ' + formatPrice(pkg.pricePerPerson) + '</span></div>' +
            '</div>' +
            '</a>' +
            '</article>';
    }

    function renderPackages() {
        if (!allPackages.length) {
            grid.innerHTML = '<div class="loading">Loading packages...</div>';
            return;
        }

        var destinationText = filterDestination ? filterDestination.value.trim().toLowerCase() : "";
        var minPrice = minPriceInput && minPriceInput.value !== "" ? parseFloat(minPriceInput.value) : 0;
        var maxPrice = maxPriceInput && maxPriceInput.value !== "" ? parseFloat(maxPriceInput.value) : Infinity;

        var filtered = allPackages.filter(function (pkg) {
            var matchesDest = true;
            if (destinationText !== "") {
                var city = (pkg.destinationCity || "").toLowerCase();
                var country = (pkg.destinationCountry || "").toLowerCase();
                matchesDest = city.includes(destinationText) || country.includes(destinationText);
            }
            var price = parseFloat(pkg.pricePerPerson);
            var matchesPrice = price >= minPrice && price <= maxPrice;
            return matchesDest && matchesPrice;
        });

        var sortValue = sortSelect ? sortSelect.value : "default";
        if (sortValue === "price_asc") {
            filtered.sort(function (a, b) { return parseFloat(a.pricePerPerson) - parseFloat(b.pricePerPerson); });
        } else if (sortValue === "price_desc") {
            filtered.sort(function (a, b) { return parseFloat(b.pricePerPerson) - parseFloat(a.pricePerPerson); });
        } else {
            filtered.sort(function (a, b) { return a.packageID - b.packageID; });
        }

        if (filtered.length === 0) {
            if (destinationText) {
                grid.innerHTML = '<div class="empty-state">No packages found for "' + escapeHTML(destinationText) + '".</div>';
            } else {
                grid.innerHTML = '<div class="empty-state">No packages match your filters.</div>';
            }
        } else {
            grid.innerHTML = filtered.map(renderPackageCard).join("");
        }
    }

    function loadPackages() {
        var apiKey = TravelAPI.getApiKey();
        if (!apiKey) {
            setMessage("Please log in first.", true);
            grid.innerHTML = '<div class="empty-state">Please <a href="traveller_login.php">login</a> to view packages.</div>';
            return;
        }

        setMessage("Loading packages...", false);
        grid.innerHTML = '<div class="loading">Loading packages...</div>';

        TravelAPI.getAllPackages({ limit: 1000 }, function (err, response) {
            if (err) {
                setMessage(err.message, true);
                grid.innerHTML = '<div class="empty-state">Failed to load packages.</div>';
                return;
            }

            var packages = [];
            if (response && response.status === "success") {
                if (Array.isArray(response.data)) {
                    packages = response.data;
                } else if (response.data && Array.isArray(response.data.data)) {
                    packages = response.data.data;
                }
            }

            if (!packages || packages.length === 0) {
                allPackages = [];
                grid.innerHTML = '<div class="empty-state">No packages were found.</div>';
                return;
            }

            allPackages = packages;

            var urlDestination = getQueryParam("destination");
            console.log("URL Destination:", urlDestination);

            if (urlDestination && filterDestination) {
                filterDestination.value = urlDestination;
                setMessage("Showing packages for " + urlDestination, false);
                console.log("Filter set to:", filterDestination.value);
            }

            renderPackages();
        });
    }

    function resetFilters() {
        if (filterDestination) filterDestination.value = "";
        if (minPriceInput) minPriceInput.value = "";
        if (maxPriceInput) maxPriceInput.value = "";
        if (sortSelect) sortSelect.value = "default";

        var newUrl = window.location.pathname;
        window.history.pushState({}, "", newUrl);

        renderPackages();
        setMessage("Filters reset.", false);
    }

    if (applyBtn) applyBtn.addEventListener("click", renderPackages);
    if (resetBtn) resetBtn.addEventListener("click", resetFilters);
    if (filterDestination) filterDestination.addEventListener("input", renderPackages);
    if (minPriceInput) minPriceInput.addEventListener("input", renderPackages);
    if (maxPriceInput) maxPriceInput.addEventListener("input", renderPackages);
    if (sortSelect) sortSelect.addEventListener("change", renderPackages);

    loadPackages();
});