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
        <div class="page-name">Tripistry Agency Sign up</div>
    </header>
    <main>
        <section class="signup-card">
        <h1>Registration</h1>
        <form action="#" method="POST">
            <input type="text" name="Fname" placeholder="Enter your first name" required>
            <input type="text" name="Mname" placeholder="Enter your middle name">
            <input type="text" name="Lname" placeholder="Enter your last name" required>
            <input type="email" name="email" placeholder="Enter your email" required>
            <input type="email" name="phone" placeholder="Enter your phone number" required>
            <input type="password" name="password" placeholder="Create password" required>
            <label class="terms">
                <input type="checkbox" name="terms" required>
                <span>I accept all terms &amp; conditions</span>
            </label>
            <button type="submit">Register Now</button>
            <p class="login-text">
                Already have an account?
                <a href="#">Login now</a>
            </p>
        </form>
    </main>
    <footer>
        <p>&copy; <?php echo date("Y"); ?> Tripistry. All rights reserved.</p>
    </footer>
</body>
</html>