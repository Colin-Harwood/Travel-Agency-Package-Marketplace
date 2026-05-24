<?php
$current_page = basename($_SERVER['PHP_SELF']);
include "header.php";
?>
<link rel="stylesheet" href="traveller_css/accommodations.css">
<main class="accommodations-wrapper">
    <div class="hero-section">
        <h1>Accommodation Explorer</h1>
        <p>Find the perfect place to stay for your next adventure</p>
    </div>

    <div class="filter-bar">
        <div class="filter-group search-group">
            <input type="text" id="filterDestination" placeholder="Search country, city or ID" autocomplete="off">
        </div>
        <div class="filter-group type-group">
            <label>Property type</label>
            <select id="filterType">
                <option value="">All types</option>
                <option value="Hotel">Hotel</option>
                <option value="Hostel">Hostel</option>
                <option value="Resort">Resort</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Guesthouse">Guesthouse</option>
            </select>
        </div>
        <div class="filter-group rating-group">
            <label>Minimum rating</label>
            <select id="minRating">
                <option value="">Any rating</option>
                <option value="0">0+ stars</option>
                <option value="1">1+ stars</option>
                <option value="2">2+ stars</option>
                <option value="3">3+ stars</option>
                <option value="4">4+ stars</option>
                <option value="4.5">4.5+ stars</option>
            </select>
        </div>
        <div class="filter-group price-group">
            <label>Price per night</label>
            <div class="price-inputs">
                <input type="number" id="minPrice" placeholder="Min" min="0" step="500" value="">
                <span>-</span>
                <input type="number" id="maxPrice" placeholder="Max" min="0" step="500" value="">
            </div>
        </div>
        <div class="filter-group sort-group">
            <label>Sort by</label>
            <select id="sortSelect">
                <option value="default">Default</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating_desc">Rating: Highest first</option>
                <option value="name_asc">Name: A to Z</option>
            </select>
        </div>
        <div class="filter-group actions-group">
            <button id="applyFiltersBtn" class="apply-filters-btn">Apply filters</button>
            <button id="resetFiltersBtn" class="reset-filters-btn">Reset</button>
        </div>
    </div>

    <div id="accommodationsMessage" class="accommodations-message" role="status"></div>

    <div class="accommodations-grid" id="accommodationsGrid"></div>
</main>

<div id="packageModal" class="modal">
    <div class="modal-content">
        <span class="modal-close">&times;</span>
        <h3>Packages that include this accommodation</h3>
        <div id="modalPackagesList">Loading packages...</div>
    </div>
</div>

<script src="traveller_js/api.js"></script>
<script src="traveller_js/accommodations.js"></script>
</body>

</html>