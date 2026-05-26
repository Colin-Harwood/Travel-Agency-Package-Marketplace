<?php
$current_page = basename($_SERVER['PHP_SELF']);
include "header.php";
?>
<link rel="stylesheet" href="traveller_css/destinations.css">
<main class="destinations-wrapper">
    <div class="hero-section">
        <h1>Destination Discovery Hub</h1>
        <p>Explore amazing destinations around the world and find your perfect getaway</p>
    </div>

    <div class="filter-bar">
        <div class="filter-group search-group">
            <input type="text" id="filterDestination" placeholder="Search country or city" autocomplete="off">
        </div>
        <div class="filter-group sort-group">
            <label>Sort by</label>
            <select id="sortSelect">
                <option value="default">Default</option>
                <option value="name_asc">Destination: A to Z</option>
                <option value="name_desc">Destination: Z to A</option>
                <option value="packages_desc">Most packages first</option>
                <option value="rating_desc">Highest rated first</option>
                <option value="price_asc">Lowest price first</option>
            </select>
        </div>
        <div class="filter-group actions-group">
            <button id="resetFiltersBtn" class="reset-filters-btn">Reset</button>
        </div>
    </div>

    <div id="destinationsMessage" class="destinations-message" role="status"></div>

    <div class="destinations-grid" id="destinationsGrid"></div>
</main>

<div id="destinationModal" class="modal">
    <div class="modal-content">
        <span class="modal-close" id="modalClose">&times;</span>
        <div id="modalDetailContent">
            <div class="loading-details">Loading destination details...</div>
        </div>
    </div>
</div>

<script src="traveller_js/api.js"></script>
<script src="traveller_js/destinations.js"></script>
</body>

</html>