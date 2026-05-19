document.addEventListener("DOMContentLoaded", function () {
    var loginForm = document.getElementById("loginForm");
    var loginError = document.getElementById("login-error");
    var showPassword = document.getElementById("show-password");
    var passwordInput = document.getElementById("password");

    if (showPassword && passwordInput) {
        showPassword.addEventListener("change", function () {
            passwordInput.type = showPassword.checked ? "text" : "password";
        });
    }

    if (!loginForm) {
        return;
    }

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        loginError.textContent = "";

        var email = document.getElementById("email").value.trim();
        var password = document.getElementById("password").value.trim();

        if (!email || !password) {
            loginError.textContent = "Please enter your email and password.";
            return;
        }

        TravelAPI.travellerLogin(email, password, function (error, response) {
            if (error) {
                loginError.textContent = error.message;
                console.error(error);
                return;
            }

            if (response.status !== "success") {
                loginError.textContent = response.message || response.data || "Login failed.";
                console.error(response);
                return;
            }

            localStorage.setItem("apiKey", response.data.apiKey);
            localStorage.setItem("userID", response.data.userID);
            localStorage.setItem("userType", response.data.userType);

            window.location.href = "packages.php";
        });
    });
});