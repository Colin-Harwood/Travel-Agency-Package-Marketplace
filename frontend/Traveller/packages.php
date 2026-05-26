<?php
$current_page = basename($_SERVER['PHP_SELF']);
include "header.php";
?>
<link rel="stylesheet" href="traveller_css/packages.css">
<main class="packages-wrapper">
    <section class="packages-section">
        <h2 class="section-title">Packages guests love</h2>
        <p class="section-subtitle">Explore cultural city breaks to ultimate safari experiences.</p>
        <div class="filter-bar">
            <div class="filter-group search-group">
                <input type="text" id="filterDestination" placeholder="Search country or city" autocomplete="off">
            </div>
            <div class="filter-group price-group">
                <label>Price range</label>
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
                </select>
            </div>
            <div class="filter-group actions-group">
                <button id="applyFiltersBtn" class="apply-filters-btn">Apply filters</button>
                <button id="resetFiltersBtn" class="reset-filters-btn">Reset</button>
            </div>
        </div>
        <div id="packagesMessage" class="packages-message" role="status"></div>
        <div class="packages-grid" id="packagesGrid"></div>
    </section>
</main>
<script src="traveller_js/api.js"></script>
<script src="traveller_js/packages.js"></script>
</body>

</html>