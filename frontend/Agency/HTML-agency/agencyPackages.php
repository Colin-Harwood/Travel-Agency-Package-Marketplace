<?php
    require_once "layout.php";
    protectAgencyPage(); // stop users from accessing this page if they are not logged in
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tripistry | Agency Packages</title>

    <link rel="stylesheet" href="../CSS-agency/layout.css">
    <link rel="stylesheet" href="../CSS-agency/agencyPackages.css">
</head>
<body>
    <?php renderHeader("Agency Packages"); ?>

    <main>
        <section class="package-container">
            <div class="page-heading">
                <h1>Manage Travel Packages</h1>
                <p>View and edit the packages created by your agency.</p>
            </div>

            <div class="toolbar">
                <button type="button" id="refreshPackagesBtn" class="secondary-btn">Refresh</button>
                <a href="createPackage.php" class="primary-link-btn">Create Package</a>
            </div>

            <p id="messageBox"></p>

            <div id="packagesList" class="packages-list">
                <div class="loading-box">Loading packages...</div>
            </div>
        </section>
    </main>

    <?php renderFooter(); ?>

    <script src="../JS-agency/agencyPackages.js"></script>
</body>
</html>