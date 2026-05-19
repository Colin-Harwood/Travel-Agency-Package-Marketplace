<?php
$current_page = basename($_SERVER['PHP_SELF']);
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tripistry - Packages</title>
    <link rel="icon" type="image/png" href="traveller_img/logo.png" sizes="16x16">
    <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@500;700&display=swap"
        rel="stylesheet">
    <link rel="stylesheet" href="/Travel-Agency-Package-Marketplace/frontend/Traveller/traveller_css/navbar.css">
    <link rel="stylesheet" href="/Travel-Agency-Package-Marketplace/frontend/Traveller/traveller_css/packages.css">
</head>

<body class="dark-theme">
    <nav class="navbar">
        <a href="index.html" class="nav-brand">
            <img src="/Travel-Agency-Package-Marketplace/frontend/Traveller/traveller_img/logo.png" alt="Tripistry Logo"
                class="nav-logo-img">
        </a>
        <ul class="nav-links">
            <li><a href="index.html">VIEW FLIGHTS &gt;</a></li>
            <li><a href="packages.php" class="active">PACKAGES &gt;</a></li>
            <li><a href="bookings.html">BOOKINGS &gt;</a></li>
            <li><a href="planes.html">PLANES &gt;</a></li>
            <li><a href="favourites.html">FAVOURITES &gt;</a></li>
        </ul>
    </nav>

    <main class="packages-wrapper">
        <section class="packages-section">
            <h2 class="section-title">Packages guests love</h2>
            <p class="section-subtitle">From cultural city breaks to ultimate safari experiences, we have it all</p>

            <div id="packagesMessage" class="packages-message" role="status"></div>
            <div class="packages-grid" id="packagesGrid"></div>
        </section>
    </main>

    <script src="/Travel-Agency-Package-Marketplace/frontend/Traveller/traveller_js/api.js"></script>
    <script src="/Travel-Agency-Package-Marketplace/frontend/Traveller/traveller_js/packages.js"></script>
</body>

</html>