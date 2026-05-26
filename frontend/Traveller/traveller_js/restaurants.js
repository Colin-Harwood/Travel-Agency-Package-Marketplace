document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    var messageDiv = document.getElementById("restaurantsMessage");
    var grid = document.getElementById("restaurantsGrid");
    var filterName = document.getElementById("filterName");
    var filterDestination = document.getElementById("filterDestination");
    var filterCuisine = document.getElementById("filterCuisine");
    var sortSelect = document.getElementById("sortSelect");
    var applyBtn = document.getElementById("applyFiltersBtn");
    var resetBtn = document.getElementById("resetFiltersBtn");

    var allRestaurants = [];
    var selectedPriceRange = "all";
    var destinationsCache = {};

    var modal = document.getElementById("packageModal");
    var modalList = document.getElementById("modalPackagesList");
    var closeModalSpan = document.querySelector(".modal-close");

    function setMessage(msg, isError) {
        if (!messageDiv) return;
        messageDiv.textContent = msg || "";
        messageDiv.className = isError ? "restaurants-message error" : "restaurants-message";
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

    function getPriceIconClass(priceRange) {
        switch (priceRange) {
            case "$": return "price-1";
            case "$$": return "price-2";
            case "$$$": return "price-3";
            case "$$$$": return "price-4";
            default: return "";
        }
    }

    function renderRestaurantCard(restaurant) {
        var priceIconClass = getPriceIconClass(restaurant.priceRange);
        var packageCount = (restaurant.packages && restaurant.packages.length) ? restaurant.packages.length : 0;
        var location = "";

        if (restaurant.city && restaurant.country) {
            location = restaurant.city + ", " + restaurant.country;
        } else if (restaurant.city) {
            location = restaurant.city;
        } else if (restaurant.country) {
            location = restaurant.country;
        } else if (restaurant.destinationID && destinationsCache[restaurant.destinationID]) {
            var dest = destinationsCache[restaurant.destinationID];
            location = dest.city + ", " + dest.country;
        }

        var cuisine = restaurant.cuisine || "Various";

        return '' +
            '<article class="restaurant-card" data-restaurant-id="' + escapeHtml(restaurant.restaurantID) + '">' +
            '<div class="card-content">' +
            '<h3 class="card-title">' + escapeHtml(restaurant.name) + '</h3>' +
            (location ? '<div class="card-location">' + escapeHtml(location) + '</div>' : '') +
            '<span class="cuisine-tag">' + escapeHtml(cuisine) + '</span>' +
            '<div class="price-range-display">' +
            '<span class="price-range-label">Price range</span>' +
            '<span class="price-value ' + priceIconClass + '">' + escapeHtml(restaurant.priceRange || "Not specified") + '</span>' +
            '</div>' +
            (packageCount > 0 ?
                '<div class="package-count" data-restaurant-id="' + escapeHtml(restaurant.restaurantID) + '">' + packageCount + ' package(s) include this restaurant</div>' :
                '<div class="package-count no-packages">No packages include this restaurant</div>'
            ) +
            '</div>' +
            '</article>';
    }

    function loadDestinations(callback) {
        TravelAPI.getAllDestinations(function (err, response) {
            if (!err && response && response.status === "success") {
                var destinations = response.data;
                for (var i = 0; i < destinations.length; i++) {
                    destinationsCache[destinations[i].destinationID] = {
                        city: destinations[i].city,
                        country: destinations[i].country
                    };
                }
            }
            if (callback) callback();
        });
    }

    function filterAndSortRestaurants() {
        if (!allRestaurants.length) return [];

        var nameSearch = filterName ? filterName.value.trim().toLowerCase() : "";
        var destSearch = filterDestination ? filterDestination.value.trim().toLowerCase() : "";
        var cuisineSearch = filterCuisine ? filterCuisine.value.trim().toLowerCase() : "";

        var filtered = allRestaurants.filter(function (rest) {
            var matchesName = true;
            if (nameSearch !== "") {
                matchesName = (rest.name || "").toLowerCase().includes(nameSearch);
            }

            var matchesDest = true;
            if (destSearch !== "") {
                var city = (rest.city || "").toLowerCase();
                var country = (rest.country || "").toLowerCase();
                matchesDest = city.includes(destSearch) || country.includes(destSearch);
            }

            var matchesCuisine = true;
            if (cuisineSearch !== "") {
                matchesCuisine = (rest.cuisine || "").toLowerCase().includes(cuisineSearch);
            }

            var matchesPrice = true;
            if (selectedPriceRange !== "all") {
                matchesPrice = rest.priceRange === selectedPriceRange;
            }

            return matchesName && matchesDest && matchesCuisine && matchesPrice;
        });

        var sortValue = sortSelect ? sortSelect.value : "default";

        var priceOrder = { "$": 1, "$$": 2, "$$$": 3, "$$$$": 4 };

        if (sortValue === "name_asc") {
            filtered.sort(function (a, b) { return (a.name || "").localeCompare(b.name || ""); });
        } else if (sortValue === "name_desc") {
            filtered.sort(function (a, b) { return (b.name || "").localeCompare(a.name || ""); });
        } else if (sortValue === "price_asc") {
            filtered.sort(function (a, b) {
                return (priceOrder[a.priceRange] || 99) - (priceOrder[b.priceRange] || 99);
            });
        } else if (sortValue === "price_desc") {
            filtered.sort(function (a, b) {
                return (priceOrder[b.priceRange] || 99) - (priceOrder[a.priceRange] || 99);
            });
        } else if (sortValue === "packages_desc") {
            filtered.sort(function (a, b) {
                var countA = (a.packages && a.packages.length) || 0;
                var countB = (b.packages && b.packages.length) || 0;
                return countB - countA;
            });
        } else {
            filtered.sort(function (a, b) { return a.restaurantID - b.restaurantID; });
        }

        return filtered;
    }

    function applyFiltersAndRender() {
        var filtered = filterAndSortRestaurants();
        if (filtered.length === 0) {
            grid.innerHTML = '<div class="empty-state">No restaurants match your filters. Try adjusting the criteria.</div>';
            setMessage("", false);
        } else {
            grid.innerHTML = filtered.map(renderRestaurantCard).join("");
            setMessage("", false);
            attachPackageClickHandlers();
        }
    }

    function attachPackageClickHandlers() {
        var packageCountDivs = document.querySelectorAll(".package-count[data-restaurant-id]");
        for (var i = 0; i < packageCountDivs.length; i++) {
            packageCountDivs[i].onclick = function () {
                var restId = this.getAttribute("data-restaurant-id");
                showPackagesForRestaurant(restId);
            };
        }
    }

    function showPackagesForRestaurant(restId) {
        if (!modal || !modalList) return;

        var restaurant = null;
        for (var i = 0; i < allRestaurants.length; i++) {
            if (String(allRestaurants[i].restaurantID) === String(restId)) {
                restaurant = allRestaurants[i];
                break;
            }
        }

        if (!restaurant || !restaurant.packages || restaurant.packages.length === 0) {
            modalList.innerHTML = '<p class="no-packages">No packages currently include this restaurant.</p>';
            modal.style.display = "block";
            return;
        }

        var html = '<ul class="package-list">';
        for (var j = 0; j < restaurant.packages.length; j++) {
            var p = restaurant.packages[j];
            var statusBadge = p.status === "Active" ? "" : '<span class="package-status-inactive"> (' + escapeHtml(p.status) + ')</span>';
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

    function setupPriceButtons() {
        var priceBtns = document.querySelectorAll(".price-btn");
        for (var i = 0; i < priceBtns.length; i++) {
            priceBtns[i].addEventListener("click", function () {
                var priceValue = this.getAttribute("data-price");

                var btns = document.querySelectorAll(".price-btn");
                for (var j = 0; j < btns.length; j++) {
                    btns[j].classList.remove("active");
                }
                this.classList.add("active");

                selectedPriceRange = priceValue;
                applyFiltersAndRender();
            });
        }
    }

    function loadRestaurants() {
        var apiKey = TravelAPI.getApiKey();
        if (!apiKey) {
            setMessage("Please log in first to view restaurants.", true);
            grid.innerHTML = '<div class="empty-state">Please <a href="traveller_login.php">login</a> to view restaurants.</div>';
            return;
        }

        setMessage("Loading restaurants...", false);
        grid.innerHTML = '<div class="loading">Loading restaurants...</div>';

        TravelAPI.getAllRestaurants(function (err, response) {
            if (err) {
                setMessage(err.message, true);
                grid.innerHTML = '<div class="empty-state">' + escapeHtml(err.message) + '</div>';
                return;
            }

            if (response && response.status === "success") {
                var restaurants = response.data;
                if (!restaurants || restaurants.length === 0) {
                    allRestaurants = [];
                    grid.innerHTML = '<div class="empty-state">No restaurants were found in the database.</div>';
                    setMessage("", false);
                    return;
                }

                allRestaurants = restaurants;
                loadDestinations(function () {
                    for (var i = 0; i < allRestaurants.length; i++) {
                        var destId = allRestaurants[i].destinationID;
                        if (destId && destinationsCache[destId]) {
                            allRestaurants[i].city = destinationsCache[destId].city;
                            allRestaurants[i].country = destinationsCache[destId].country;
                        }
                    }
                    applyFiltersAndRender();
                });
            } else {
                var errorMsg = (response && response.data) || "Failed to load restaurants.";
                setMessage(errorMsg, true);
                grid.innerHTML = '<div class="empty-state">' + escapeHtml(errorMsg) + '</div>';
            }
        });
    }

    function resetFilters() {
        if (filterName) filterName.value = "";
        if (filterDestination) filterDestination.value = "";
        if (filterCuisine) filterCuisine.value = "";
        if (sortSelect) sortSelect.value = "default";

        selectedPriceRange = "all";
        var priceBtns = document.querySelectorAll(".price-btn");
        for (var i = 0; i < priceBtns.length; i++) {
            if (priceBtns[i].getAttribute("data-price") === "all") {
                priceBtns[i].classList.add("active");
            } else {
                priceBtns[i].classList.remove("active");
            }
        }

        applyFiltersAndRender();
        setMessage("Filters reset.", false);
    }

    if (applyBtn) applyBtn.addEventListener("click", applyFiltersAndRender);
    if (resetBtn) resetBtn.addEventListener("click", resetFilters);

    if (filterName) {
        var nameDebounce;
        filterName.addEventListener("input", function () {
            clearTimeout(nameDebounce);
            nameDebounce = setTimeout(applyFiltersAndRender, 300);
        });
    }

    if (filterDestination) {
        var destDebounce;
        filterDestination.addEventListener("input", function () {
            clearTimeout(destDebounce);
            destDebounce = setTimeout(applyFiltersAndRender, 300);
        });
    }

    if (filterCuisine) {
        var cuisineDebounce;
        filterCuisine.addEventListener("input", function () {
            clearTimeout(cuisineDebounce);
            cuisineDebounce = setTimeout(applyFiltersAndRender, 300);
        });
    }

    if (sortSelect) sortSelect.addEventListener("change", applyFiltersAndRender);

    if (closeModalSpan) closeModalSpan.onclick = closeModal;
    window.onclick = function (e) {
        if (e.target === modal) closeModal();
    };

    setupPriceButtons();
    loadRestaurants();
});