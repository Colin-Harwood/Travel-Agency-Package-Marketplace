<?php
function renderHeader($pageTitle = "Tripistry") {
?>
    <header class="site-header">
        <div class="header-left">
            <a href="../../IndexPage/index.php" class="logo-link">
                <img src="../../IndexPage/logo.png" alt="Tripistry logo" class="site-logo">
            </a>
        </div>
        <nav class="nav-tabs">
            <a href="loginAgency.php" class="nav-tab">Login</a>
            <a href="signupAgency.php" class="nav-tab">Registration</a>
            <a href="createPackage.php" class="nav-tab">Create Package</a>
            <a href="#" class="nav-tab">Tab 4</a>
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