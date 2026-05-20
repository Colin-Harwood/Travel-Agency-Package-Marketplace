document.addEventListener("DOMContentLoaded", function () {
    var messageDiv = document.getElementById("packagesMessage");
    var grid = document.getElementById("packagesGrid");

    function setMessage(msg, isError) {
        if (!messageDiv) return;
        messageDiv.textContent = msg || "";
        messageDiv.className = isError ? "packages-message error" : "packages-message";
    }

    function escapeHTML(value) {
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
        var number = parseFloat(value || 0);
        if (isNaN(number)) number = 0;
        return number.toLocaleString("en-ZA", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }

    function stars() {
        return '<span class="stars">* * * * *</span>';
    }

    function packageInitials(pkg) {
        var city = pkg.destinationCity || "Trip";
        var country = pkg.destinationCountry || "Package";
        return (city.charAt(0) + country.charAt(0)).toUpperCase();
    }

    function shortText(value, limit) {
        var text = String(value || "");
        if (text.length <= limit) return text;
        return text.substring(0, limit).trim() + "...";
    }

    function requireLogin() {
        if (!TravelAPI.getApiKey()) {
            setMessage("Please log in first before viewing packages.", true);
            setTimeout(function () {
                window.location.href = "traveller_login.php";
            }, 900);
            return false;
        }
        return true;
    }

    function computeAverageRating(reviews) {
        if (!reviews || reviews.length === 0) return null;
        var sum = 0;
        for (var i = 0; i < reviews.length; i++) {
            sum += parseInt(reviews[i].rating, 10);
        }
        var avg = sum / reviews.length;
        return { avg: avg.toFixed(1), count: reviews.length };
    }

    function ratingWordFromScore(score) {
        var s = parseFloat(score);
        if (s >= 9.0) return "Superb";
        if (s >= 8.0) return "Excellent";
        if (s >= 7.0) return "Very Good";
        if (s >= 6.0) return "Good";
        return "Average";
    }

    function renderPackageCard(pkg) {
        var isActive = String(pkg.status || "").toLowerCase() === "active";
        var detailUrl = "package_view.php?id=" + encodeURIComponent(pkg.packageID);
        var location = [pkg.destinationCity, pkg.destinationCountry].filter(Boolean).join(", ");
        var durationText = pkg.duration ? pkg.duration + " Days duration" : "Duration not listed";

        return `
            <div class="package-card" data-package-id="${escapeHTML(pkg.packageID)}">
                <button class="fav-btn" type="button" aria-label="Save package">+</button>
                <a class="card-link" href="${detailUrl}" aria-label="View ${escapeHTML(pkg.name)}">
                    <div class="card-image-placeholder">
                        ${escapeHTML(pkg.type || "Package")}
                    </div>
                    <div class="card-content">
                        <div class="card-type-row">
                            <span>${escapeHTML(pkg.type || "Package")} Package</span>
                        </div>
                        <h3 class="card-title">${escapeHTML(pkg.name || "Unnamed package")}</h3>
                        <div class="card-location">${escapeHTML(location || "Destination not listed")}</div>
                        <div class="card-rating">
                            <div class="rating-score">--</div>
                            <div class="rating-text">
                                <span class="rating-word">Loading...</span>
                                <span class="rating-count"></span>
                            </div>
                        </div>
                        <div class="card-distance">${escapeHTML(durationText)}</div>
                        <div class="card-price-row">
                            Starting from <span class="card-price">ZAR ${formatPrice(pkg.pricePerPerson)}</span>
                        </div>
                    </div>
                </a>
            </div>
        `;
    }

    function updateCardRating(card, reviews) {
        var ratingInfo = computeAverageRating(reviews);
        var ratingScoreSpan = card.querySelector(".rating-score");
        var ratingWordSpan = card.querySelector(".rating-word");
        var ratingCountSpan = card.querySelector(".rating-count");

        if (ratingInfo) {
            ratingScoreSpan.textContent = ratingInfo.avg;
            ratingWordSpan.textContent = ratingWordFromScore(ratingInfo.avg);
            ratingCountSpan.textContent = ratingInfo.count + " reviews";
        } else {
            ratingWordSpan.textContent = "No reviews";
            ratingCountSpan.textContent = "";
            ratingScoreSpan.textContent = "--";
        }
    }

    function enrichCardsWithRatings(packages, cards) {
        for (var i = 0; i < packages.length; i++) {
            var pkg = packages[i];
            var card = cards[i];
            (function (pkgId, cardElement) {
                TravelAPI.getPackage(pkgId, function (err, response) {
                    if (err || response.status !== "success") return;
                    var reviews = response.data.reviews || [];
                    updateCardRating(cardElement, reviews);
                });
            })(pkg.packageID, card);
        }
    }

    function renderPackagesList(packages) {
        if (!packages || packages.length === 0) {
            grid.innerHTML = '<div class="empty-state">No packages were found in the database.</div>';
            return;
        }
        grid.innerHTML = packages.map(renderPackageCard).join("");
        var cards = grid.querySelectorAll(".package-card");
        enrichCardsWithRatings(packages, cards);
    }

    function loadPackagesList() {
        if (!requireLogin()) return;
        setMessage("Loading packages from the database...", false);
        grid.innerHTML = '<div class="loading">Loading packages...</div>';

        TravelAPI.getAllPackages(function (error, response) {
            if (error) {
                setMessage(error.message, true);
                grid.innerHTML = "";
                return;
            }
            if (response.status !== "success") {
                setMessage(response.data || "Failed to load packages.", true);
                grid.innerHTML = "";
                return;
            }
            var allPackages = Array.isArray(response.data) ? response.data : [];
            setMessage("", false);
            renderPackagesList(allPackages);
        });
    }

    loadPackagesList();
});