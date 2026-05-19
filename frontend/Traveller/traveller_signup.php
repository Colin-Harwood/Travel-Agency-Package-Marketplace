<?php
include "header.php";
?>

<div class="video-container">
    <video autoplay muted loop class="bg-video">
        <source
            src="/Travel-Agency-Package-Marketplace/frontend/Traveller/traveller_img/Beautiful Destinations in Greece with The Luxury Collection.mp4"
            type="video/mp4">
    </video>
</div>

<main class="content-wrapper">
    <div class="form-main">
        <h1 class="form-title">Register</h1>
        <div id="error-message" class="error-message"></div>

        <form class="signup-form" id="signup">
            <div class="form-group">
                <label style="display:none;" for="name">FIRST NAME</label>
                <input type="text" id="name" class="name" placeholder="Firstname" required>
            </div>

            <div class="form-group">
                <label style="display:none;" for="surname">SURNAME</label>
                <input type="text" id="surname" class="surname" placeholder="Surname" required>
            </div>

            <div class="form-group">
                <label style="display:none;" for="email">EMAIL</label>
                <input type="email" id="email" class="email" placeholder="Email Address" required>
            </div>

            <div class="form-group">
                <label style="display:none;" for="phone">PHONE NUMBER</label>
                <input type="tel" id="phone" class="phone" placeholder="Phone Number" required>
            </div>

            <div class="form-group">
                <label style="display:none;" for="password">PASSWORD</label>
                <input type="password" id="password" class="password" placeholder="Password" required>
            </div>

            <div class="form-group checkbox-group" style="justify-content: flex-start;">
                <label>
                    <input type="checkbox" id="show-password"> Show Password
                </label>
            </div>

            <button type="submit" class="btn-submit">Register</button>
        </form>

        <p class="bottom-link">Already have an account? <a href="traveller_login.php">Login</a></p>
    </div>
</main>

<script src="/Travel-Agency-Package-Marketplace/frontend/Traveller/traveller_js/api.js"></script>
<script src="/Travel-Agency-Package-Marketplace/frontend/Traveller/traveller_js/traveller_signup.js"></script>

</body>

</html>