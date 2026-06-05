<?php
$current_page = basename($_SERVER['PHP_SELF']);
$body_class = "bookings-page";
include "header.php"
    ?>
<link rel="stylesheet" href="traveller_css/packages.css">
<link rel="stylesheet" href="traveller_css/bookings.css">

    <main class="packages-wrapper">
        <section class="hero-panel small-hero">
            <div>
                <h1>My package bookings</h1>
            </div>
            <a class="ghost-link" href="packages.php">Book another package</a>
        </section>
        <div id="bookingsMessage" class="packages-message" role="status"></div>
        <section id="bookingsList" class="bookings-list"></section>
    </main>

    <div id="bookingDetailModal" class="modal booking-detail-modal">
        <div class="modal-content booking-detail-content">
            <span class="modal-close" id="modalClose">&times;</span>
            <div id="modalDetailContent">
                <div class="loading-details">Loading booking details...</div>
            </div>
        </div>
    </div>

    <script src="traveller_js/api.js"></script>
    <script src="traveller_js/bookings.js"></script>
</body>

</html>
