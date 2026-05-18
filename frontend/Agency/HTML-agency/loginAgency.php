<?php
    require_once "layout.php";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tripistry | Login</title>

    <link rel="stylesheet" href="../CSS-agency/layout.css">
    <link rel="stylesheet" href="../CSS-agency/signupAgency.css">
</head>
<body>
    <?php renderHeader("Tripistry Agency Login"); ?>
    <main>
        <section class="signup-card">
            <h1>Login</h1>
            <form id="loginForm" action="#" method="POST">
                <input type="email" id="email" name="email" placeholder="Enter your email" required>
                <input type="password" id="password" name="password" placeholder="Enter your password" required>
                <p id="errorMsg"></p>
                <button type="submit">Login Now</button>
                <p class="login-text">
                    Don't have an account yet?
                    <a href="signupAgency.php">Sign up</a>
                </p>
            </form>
        </section>
    </main>

    <?php renderFooter(); ?>

    <script src="../JS-agency/loginAgency.js"></script>
</body>
</html>