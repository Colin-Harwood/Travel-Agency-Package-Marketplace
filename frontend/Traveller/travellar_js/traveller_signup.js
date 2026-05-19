document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("signup");
    const errorDiv = document.getElementById("error-message");
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

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const firstName = document.getElementById("name").value.trim();
        const lastName = document.getElementById("surname").value.trim();
        const email = document.getElementById("email").value.trim();
        const phoneNumber = document.getElementById("phone").value.trim();
        const password = document.getElementById("password").value;

        errorDiv.innerText = "";
        errorDiv.style.color = "red";

        if (!firstName || !lastName || !email || !password || !phoneNumber) {
            errorDiv.innerText = "All fields are required.";
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            errorDiv.innerText = "Please enter a valid email address.";
            return;
        }

        const payload = {
            type: "travellerRegister",
            email: email,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            password: password
        };

        fetch("http://localhost/Travel-Agency-Package-Marketplace/backend/loginLogout/api.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === "success") {
                    localStorage.setItem("userID", data.data.userID);
                    localStorage.setItem("userType", data.data.userType);
                    localStorage.setItem("apiKey", data.data.apiKey);

                    alert("Account created successfully!");
                    form.reset();
                    window.location.href = "index.html";
                } else {
                    errorDiv.innerText = data.message || "Registration failed.";
                }
            })
            .catch(err => {
                errorDiv.innerText = "Server error. Please try again later.";
                console.error(err);
            });
    });
});