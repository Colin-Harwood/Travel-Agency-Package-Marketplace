<?php
$current_page = basename($_SERVER['PHP_SELF']);
include "header.php";
?>
<link rel="stylesheet" href="traveller_css/attractions.css">
<main class="attractions-wrapper">
    <div class="hero-section">
        <h1>Things to Do</h1>
        <p>Discover must-see attractions around the world</p>
    </div>

    <div class="filter-bar">
        <div class="filter-group search-group">
            <input type="text" id="filterName" placeholder="Search attraction name" autocomplete="off">
        </div>
        <div class="filter-group search-group">
            <input type="text" id="filterDestination" placeholder="Search country or city..." autocomplete="off">
        </div>
        <div class="filter-group price-group">
            <label>Entry fee</label>
            <div class="price-inputs">
                <input type="number" id="minPrice" placeholder="Min" min="0" step="50" value="">
                <span>-</span>
                <input type="number" id="maxPrice" placeholder="Max" min="0" step="50" value="">
            </div>
        </div>
        <div class="filter-group free-group">
            <label>Free attractions</label>
            <select id="freeOnly">
                <option value="">All</option>
                <option value="free">Free</option>
                <option value="paid">Paid</option>
            </select>
        </div>
        <div class="filter-group sort-group">
            <label>Sort by</label>
            <select id="sortSelect">
                <option value="default">Default</option>
                <option value="name_asc">Name: A to Z</option>
                <option value="name_desc">Name: Z to A</option>
                <option value="fee_asc">Entry fee: Low to High</option>
                <option value="fee_desc">Entry fee: High to Low</option>
                <option value="packages_desc">Most packages first</option>
            </select>
        </div>
        <div class="filter-group actions-group">
            <button id="applyFiltersBtn" class="apply-filters-btn">Apply filters</button>
            <button id="resetFiltersBtn" class="reset-filters-btn">Reset</button>
        </div>
    </div>

    <div id="attractionsMessage" class="attractions-message" role="status"></div>

    <div class="attractions-grid" id="attractionsGrid"></div>
</main>

<div id="packageModal" class="modal">
    <div class="modal-content">
        <span class="modal-close">&times;</span>
        <h3>Packages that include this attraction</h3>
        <div id="modalPackagesList">Loading packages...</div>
    </div>
</div>

<script src="traveller_js/api.js"></script>
<script src="traveller_js/attractions.js"></script>
</body>

</html>