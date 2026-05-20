<?php
$current_page = basename($_SERVER['PHP_SELF']);
if (!isset($_GET['id'])) {
    header('Location: packages.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tripistry - Package Details</title>
    <link rel="icon" type="image/png" href="traveller_img/logo.png" sizes="16x16">
    <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@500;700&display=swap"
        rel="stylesheet">
    <link rel="stylesheet" href="traveller_css/navbar.css">
    <link rel="stylesheet" href="traveller_css/package_detail.css">
</head>

<body class="package-view-page">
    <nav class="navbar">
        <a href="index.html" class="nav-brand">
            <img src="traveller_img/logo.png" alt="Tripistry Logo" class="nav-logo-img">
        </a>
        <ul class="nav-links">
            <li><a href="index.html">VIEW FLIGHTS &gt;</a></li>
            <li><a href="packages.php">PACKAGES &gt;</a></li>
            <li><a href="bookings.php">BOOKINGS &gt;</a></li>
            <li><a href="planes.html">PLANES &gt;</a></li>
            <li><a href="favourites.html">FAVOURITES &gt;</a></li>
        </ul>
    </nav>

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