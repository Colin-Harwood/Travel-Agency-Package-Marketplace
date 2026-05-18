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
            <form id="signupForm" action="#" method="POST">
                <input type="text" id="Fname" name="Fname" placeholder="Enter your first name" required>
                <input type="text" id="Mname" name="Mname" placeholder="Enter your middle name">
                <input type="text" id="Lname" name="Lname" placeholder="Enter your last name" required>
                <input type="text" id="agencyName" name="agencyName" placeholder="Enter your agency name" required>
                <input type="text" id="street" name="street" placeholder="Enter your agency street name" required>
                <input type="text" id="suburb" name="suburb" placeholder="Enter your agency suburb" required>
                <input type="text" id="city" name="city" placeholder="Enter your agency city" required>
                <input type="text" id="country" name="country" placeholder="Enter your agency country" required>
                <input type="email" id="email" name="email" placeholder="Enter your email" required>
                <input type="tel" id="phone" name="phone" placeholder="Enter your phone number" required>
                <input type="password" id="password" name="password" placeholder="Create password" required>
                <label class="terms">
                    <input type="checkbox" id="terms" name="terms" required>
                    <span>I accept all terms &amp; conditions</span>
                </label>
                <p id="errorMsg"></p>
                <button type="submit">Register Now</button>
                <p class="login-text">
                    Already have an account?
                    <a href="loginAgency.php">Login now</a>
                </p>
            </form>
        </section>
    </main>
    <footer>
        <p>&copy; <?php echo date("Y"); ?> Tripistry. All rights reserved.</p>
    </footer>
    <script src="../JS-agency/signupAgency.js"></script>
</body>
</html>