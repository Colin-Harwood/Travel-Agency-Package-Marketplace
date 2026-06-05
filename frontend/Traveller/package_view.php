<?php
$current_page = basename($_SERVER['PHP_SELF']);
if (!isset($_GET['id'])) {
    header('Location: packages.php');
    exit;
}
$body_class = "package-view-page";
include 'header.php';
?>
<link rel="stylesheet" href="traveller_css/package_detail.css">
    <main class="detail-wrapper">
        <div class="top-bar">
            <a href="packages.php" class="button-back">&lt; BACK TO PACKAGES</a>
        </div>
        <div id="detailMessage" class="detail-message" role="status"></div>
        <div id="packageDetailContainer">
            <div class="loading-state">Loading package details...</div>
        </div>
        <div id="bookingModal" class="modal">
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <h3>Book this package</h3>
                <form id="bookingForm">
                    <div class="form-group">
                        <label for="groupTripSelect">Select trip date:</label>
                        <select id="groupTripSelect" required></select>
                    </div>
                    <div class="form-group">
                        <label for="numTravellers">Number of travellers:</label>
                        <input type="number" id="numTravellers" min="1" value="1" required>
                    </div>
                    <button type="submit" class="btn-submit">Confirm Booking</button>
                </form>
            </div>
        </div>
    </main>
    <script src="traveller_js/api.js"></script>
    <script src="traveller_js/package_detail.js"></script>
</body>

</html>
