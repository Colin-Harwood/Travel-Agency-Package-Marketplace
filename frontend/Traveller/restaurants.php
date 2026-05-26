<?php
$current_page = basename($_SERVER['PHP_SELF']);
include "header.php";
?>
<link rel="stylesheet" href="traveller_css/restaurants.css">
<main class="restaurants-wrapper">
    <div class="hero-section">
        <h1>Culinary Guide</h1>
        <p>Discover exceptional restaurants around the world.</p>
    </div>

    <div class="filter-bar">
        <div class="filter-group search-group">
            <input type="text" id="filterName" placeholder="Search restaurant name..." autocomplete="off">
        </div>
        <div class="filter-group search-group">
            <input type="text" id="filterDestination" placeholder="Search country or city..." autocomplete="off">
        </div>
        <div class="filter-group search-group">
            <input type="text" id="filterCuisine" placeholder="Search cuisine (e.g., French, Thai)..."
                autocomplete="off">
        </div>
        <div class="filter-group price-group">
            <label>Price range</label>
            <div class="price-range-buttons">
                <button type="button" data-price="$" class="price-btn">$</button>
                <button type="button" data-price="$$" class="price-btn">$$</button>
                <button type="button" data-price="$$$" class="price-btn">$$$</button>
                <button type="button" data-price="$$$$" class="price-btn">$$$$</button>
                <button type="button" data-price="all" class="price-btn active">All</button>
            </div>
        </div>
        <div class="filter-group sort-group">
            <label>Sort by</label>
            <select id="sortSelect">
                <option value="default">Default</option>
                <option value="name_asc">Name: A to Z</option>
                <option value="name_desc">Name: Z to A</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="packages_desc">Most packages first</option>
            </select>
        </div>
        <div class="filter-group actions-group">
            <button id="applyFiltersBtn" class="apply-filters-btn">Apply filters</button>
            <button id="resetFiltersBtn" class="reset-filters-btn">Reset</button>
        </div>
    </div>

    <div id="restaurantsMessage" class="restaurants-message" role="status"></div>

    <div class="restaurants-grid" id="restaurantsGrid"></div>
</main>

<div id="packageModal" class="modal">
    <div class="modal-content">
        <span class="modal-close">&times;</span>
        <h3>Packages that include this restaurant</h3>
        <div id="modalPackagesList">Loading packages...</div>
    </div>
</div>

<script src="traveller_js/api.js"></script>
<script src="traveller_js/restaurants.js"></script>
</body>

</html>