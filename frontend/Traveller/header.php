<?php
$current_page = basename($_SERVER['PHP_SELF'], '.php');
$body_class = isset($body_class) ? trim($body_class) : "";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tripistry</title>
    <link rel="icon" type="image/png" href="traveller_img/logo.png" sizes="16x16">
    <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="traveller_css/navbar.css">
    <script src="traveller_js/api.js"></script>
</head>
<body<?= $body_class !== "" ? ' class="' . htmlspecialchars($body_class, ENT_QUOTES, 'UTF-8') . '"' : '' ?>>
    <nav class="navbar">
        <a href="#" id="nav-pic" class="nav-brand">
            <img src="traveller_img/logo.png" alt="Tripistry Logo" class="nav-logo-img">
        </a>
        <ul class="nav-links" id="dynamicNavLinks">
            <li id="nav-packages"><a href="packages.php" class="<?= $current_page == 'packages' ? 'active' : '' ?>">PACKAGES</a></li>
            <li id="nav-desti"><a href="destinations.php" class="<?= $current_page == 'destinations' ? 'active' : '' ?>">DESTINATIONS</a></li>
            <li id="nav-flights"><a href="flights.php" class="<?= $current_page == 'flights' ? 'active' : '' ?>">FLIGHTS</a></li>
            <li id="nav-accom"><a href="accommodations.php" class="<?= $current_page == 'accommodations' ? 'active' : '' ?>">ACCOMMODATIONS</a></li>
            <li id="nav-attrac"><a href="attractions.php" class="<?= $current_page == 'attractions' ? 'active' : '' ?>">ATTRACTIONS</a></li>
            <li id="nav-rest"><a href="restaurants.php" class="<?= $current_page == 'restaurants' ? 'active' : '' ?>">RESTAURANTS</a></li>
            <li id="nav-bookings"><a href="bookings.php" class="<?= $current_page == 'bookings' ? 'active' : '' ?>">BOOKINGS</a></li>
            <li id="nav-prof"><a href="profile.php" class="<?= $current_page == 'profile' ? 'active' : '' ?>">USER PROFILE</a></li>
            <li id="nav-about"><a href="about.php" class="<?= $current_page == 'about' ? 'active' : '' ?>">ABOUT US</a></li>
            <li id="nav-login"><a href="traveller_login.php" class="<?= $current_page == 'traveller_login' ? 'active' : '' ?>">LOGIN</a></li>
            <li id="nav-signup"><a href="traveller_signup.php" class="<?= $current_page == 'traveller_signup' ? 'active' : '' ?>">CREATE ACCOUNT</a></li>
            <li id="nav-logout"><a href="#" id="logoutLink">LOGOUT</a></li>
        </ul>
    </nav>
    <script src="traveller_js/nav.js"></script>
