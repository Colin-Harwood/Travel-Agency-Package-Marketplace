document.addEventListener("DOMContentLoaded", function () {
    const showPasswordCheckbox = document.getElementById("show-password");

    if (showPasswordCheckbox) {
        showPasswordCheckbox.addEventListener("change", function () {
            const passwordInput = document.getElementById("password");
            if (this.checked) {
                passwordInput.type = "text";
            } else {
                passwordInput.type = "password";
            }
        });
    }

    document.getElementById("loginForm").addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const errorDiv = document.getElementById("login-error");

        errorDiv.innerText = "";
        errorDiv.style.color = "red";

        if (email === "" || password === "") {
            errorDiv.innerText = "Must fill in email and password";
            return;
        }

        fetch("http://localhost/Travel-Agency-Package-Marketplace/backend/loginLogout/api.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                type: "travellerLogin",
                email: email,
                password: password
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === "success") {
                    localStorage.setItem("userID", data.data.userID);
                    localStorage.setItem("userType", data.data.userType);
                    localStorage.setItem("apiKey", data.data.apiKey);

                    errorDiv.style.color = "green";
                    errorDiv.innerText = "Login successful! Redirecting...";

                    setTimeout(() => {
                        window.location.href = "index.html";
                    }, 1000);
                } else {
                    errorDiv.innerText = data.message || "Invalid email or password.";
                }
            })
            .catch(err => {
                errorDiv.innerText = "Server error during login.";
                console.error(err);
            });
    });
});