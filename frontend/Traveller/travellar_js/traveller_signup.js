document.addEventListener("DOMContentLoaded", function () {
    var signupForm = document.getElementById("signup");
    var errorMessage = document.getElementById("error-message");
    var showPassword = document.getElementById("show-password");
    var passwordInput = document.getElementById("password");

    if (showPassword && passwordInput) {
        showPassword.addEventListener("change", function () {
            passwordInput.type = showPassword.checked ? "text" : "password";
        });
    }

    if (!signupForm) {
        return;
    }

    signupForm.addEventListener("submit", function (event) {
        event.preventDefault();

        errorMessage.textContent = "";

        var firstName = document.getElementById("name").value.trim();
        var lastName = document.getElementById("surname").value.trim();
        var email = document.getElementById("email").value.trim();
        var phoneNumber = document.getElementById("phone").value.trim();
        var password = document.getElementById("password").value.trim();

        if (!firstName || !lastName || !email || !phoneNumber || !password) {
            errorMessage.textContent = "Please fill in all fields.";
            return;
        }

        TravelAPI.travellerRegister(firstName, lastName, email, phoneNumber, password, function (error, response) {
            if (error) {
                errorMessage.textContent = error.message;
                console.error(error);
                return;
            }

            if (response.status !== "success") {
                errorMessage.textContent = response.message || response.data || "Registration failed.";
                console.error(response);
                return;
            }

            localStorage.setItem("apiKey", response.data.apiKey);
            localStorage.setItem("userID", response.data.userID);
            localStorage.setItem("userType", response.data.userType);

            alert("Account created successfully.");

            window.location.href = "packages.php";
        });
    });
});