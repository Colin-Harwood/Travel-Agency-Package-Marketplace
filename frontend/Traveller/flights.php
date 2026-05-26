<?php
$current_page = basename($_SERVER['PHP_SELF']);
include "header.php";
?>
<link rel="stylesheet" href="traveller_css/flights.css">
<main class="flights-wrapper">
    <div class="hero-section">
        <h1>Flight Explorer</h1>
        <p>Search and filter flights to find the perfect journey for your next adventure</p>
    </div>

    <div class="filter-bar">
        <div class="filter-group search-group">
            <input type="text" id="filterAirline" placeholder="Search airline" autocomplete="off">
        </div>
        <div class="filter-group search-group">
            <input type="text" id="filterDepAirport" placeholder="Departure airport" autocomplete="off">
        </div>
        <div class="filter-group search-group">
            <input type="text" id="filterArrAirport" placeholder="Arrival airport" autocomplete="off">
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
                <option value="departure_asc">Departure: Earliest first</option>
                <option value="departure_desc">Departure: Latest first</option>
                <option value="airline_asc">Airline: A to Z</option>
            </select>
        </div>
        <div class="filter-group date-group">
            <label>Departure after</label>
            <input type="date" id="departureAfter">
        </div>
        <div class="filter-group date-group">
            <label>Departure before</label>
            <input type="date" id="departureBefore">
        </div>
        <div class="filter-group actions-group">
            <button id="applyFiltersBtn" class="apply-filters-btn">Apply filters</button>
            <button id="resetFiltersBtn" class="reset-filters-btn">Reset</button>
        </div>
    </div>

    <div id="flightsMessage" class="flights-message" role="status"></div>

    <div class="flights-table-container">
        <table class="flights-table" id="flightsTable">
            <thead>
                <tr>
                    <th data-sort="airline">Airline</th>
                    <th data-sort="flightNumber">Flight #</th>
                    <th data-sort="departureAirport">Departure</th>
                    <th data-sort="arrivalAirport">Arrival</th>
                    <th data-sort="departureTime">Departure time</th>
                    <th data-sort="arrivalTime">Arrival time</th>
                    <th data-sort="price">Price (ZAR)</th>
                    <th>Packages</th>
                </tr>
            </thead>
            <tbody id="flightsTableBody">
                <tr>
                    <td colspan="8" class="loading">Loading flights...</td>
                </tr>
            </tbody>
        </table>
    </div>
</main>

<div id="packageModal" class="modal">
    <div class="modal-content">
        <span class="modal-close">&times;</span>
        <h3>Packages that include this flight</h3>
        <div id="modalPackagesList">Loading packages...</div>
    </div>
</div>

<script src="traveller_js/api.js"></script>
<script src="traveller_js/flights.js"></script>
</body>

</html>