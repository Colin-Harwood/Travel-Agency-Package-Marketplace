<?php
include "header.php";
?>
<link rel="stylesheet" href="traveller_css/traveller_login.css">
<div class="video-container">
    <video autoplay muted loop class="bg-video">
        <source src="traveller_img/Beautiful Destinations in Greece with The Luxury Collection.mp4" type="video/mp4">
    </video>
</div>
<main class="content-wrapper">
    <div class="form-main">
        <h1 class="form-title">Login</h1>
        <div id="login-error" class="error-message"></div>
        <form class="signup-form" id="loginForm">
            <div class="form-group">
                <label style="display:none;" for="email">EMAIL</label>
                <input type="email" id="email" class="email" placeholder="Email" required>
            </div>
            <div class="form-group">
                <label style="display:none;" for="password">PASSWORD</label>
                <input type="password" id="password" class="password" placeholder="Password" required>
            </div>
            <div class="form-group checkbox-group">
                <label>
                    <input type="checkbox" id="show-password"> Show Password
                </label>
            </div>
            <button type="submit" class="btn-submit">Login</button>
        </form>
        <p class="bottom-link">Don't have an account? <a href="traveller_signup.php">Register</a></p>
    </div>
</main>
<script src="traveller_js/api.js"></script>
<script src="traveller_js/traveller_login.js"></script>
</body>

</html>