<?php
$current_page = basename($_SERVER['PHP_SELF']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tripistry - My Bookings</title>
    <link rel="icon" type="image/png" href="traveller_img/logo.png" sizes="16x16">
    <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="traveller_css/navbar.css">
    <link rel="stylesheet" href="traveller_css/packages.css">
</head>
<body class="bookings-page" data-page="bookings">
    <nav class="navbar">
        <a href="index.html" class="nav-brand">
            <img src="traveller_img/logo.png" alt="Tripistry Logo" class="nav-logo-img">
        </a>
        <ul class="nav-links">
            <li><a href="index.html">VIEW FLIGHTS &gt;</a></li>
            <li><a href="packages.php">PACKAGES &gt;</a></li>
            <li><a href="bookings.php" class="active">BOOKINGS &gt;</a></li>
            <li><a href="planes.html">PLANES &gt;</a></li>
            <li><a href="favourites.html">FAVOURITES &gt;</a></li>
        </ul>
    </nav>

    <main class="packages-wrapper">
        <section class="hero-panel small-hero">
            <div>
                <p class="eyebrow">Traveller dashboard</p>
                <h1>My package bookings</h1>
                <p>Bookings made through this page are saved to the database and shown here.</p>
            </div>
            <a class="ghost-link" href="packages.php">Book another package</a>
        </section>

        <div id="bookingsMessage" class="packages-message" role="status"></div>
        <section id="bookingsList" class="bookings-list"></section>
    </main>

    <script src="traveller_js/api.js"></script>
    <script src="traveller_js/bookings.js"></script>
</body>
</html>