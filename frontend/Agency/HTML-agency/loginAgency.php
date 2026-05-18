<?php
    // any php functionality 
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tripistry | Sign Up</title>
        <link rel="stylesheet" href="../CSS-agency/signupAgency.css">
    </head>
<body>
    <header>
        <div class="page-name">Tripistry Agency Login</div>
    </header>
    <main>
        <section class="signup-card">
        <h1>Login</h1>
        <form action="#" method="POST">
            <input type="email" name="email" placeholder="Enter your email" required>
            <input type="password" name="password" placeholder="Enter your password" required>
            <button type="submit">Register Now</button>
            <p class="login-text">
                Dont have an account yet?
                <a href="signupAgency.php">Sign up</a>
            </p>
        </form>
    </main>
    <footer>
        <p>&copy; <?php echo date("Y"); ?> Tripistry. All rights reserved.</p>
    </footer>
</body>
</html>