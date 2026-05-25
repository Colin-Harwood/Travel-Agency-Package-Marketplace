<?php
function isAgencyLoggedIn() {
    return (
        isset($_COOKIE["userID"]) &&
        isset($_COOKIE["userType"]) &&
        isset($_COOKIE["apiKey"]) &&
        $_COOKIE["userType"] === "Agency"
    );
}

function protectAgencyPage() {
    if (!isAgencyLoggedIn()) {
        header("Location: loginAgency.php");
        exit();
    }
}

function renderHeader($pageTitle = "Tripistry") {
?>
    <header class="site-header">
        <div class="header-left">
            <a href="../../IndexPage/index.php" class="logo-link">
                <img src="../../IndexPage/logo.png" alt="Tripistry logo" class="site-logo">
            </a>
        </div>

        <nav class="nav-tabs">
            <?php if (!isAgencyLoggedIn()) { ?>
                <a href="loginAgency.php" class="nav-tab">Login</a>
                <a href="signupAgency.php" class="nav-tab">Registration</a>
            <?php } ?>

            <?php if (isAgencyLoggedIn()) { ?>
                <a href="createPackage.php" class="nav-tab">Create Package</a>
                <a href="createGroupTrip.php" class="nav-tab">Create Group Package</a>
                <a href="analyticsAgency.php" class="nav-tab">Analytics</a>
                <a href="agencyPackages.php" class="nav-tab">My Packages</a>
                <a href="logoutAgency.php" class="nav-tab">Logout</a>
            <?php } ?>
        </nav>
    </header>
<?php
}

function renderFooter() {
?>
    <footer class="site-footer">
        <p>&copy; <?php echo date("Y"); ?> Tripistry. All rights reserved.</p>
    </footer>
<?php
}
?>