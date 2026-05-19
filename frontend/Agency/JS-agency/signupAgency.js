// we get the data from the form
document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault();
    // getting the data from the form using DOM
    const Fname = document.getElementById("Fname").value.trim();
    const Mname = document.getElementById("Mname").value.trim();
    const Lname = document.getElementById("Lname").value.trim();
    const email = document.getElementById("email").value.trim();
    const agencyName = document.getElementById("agencyName").value.trim();
    const street = document.getElementById("street").value.trim();
    const suburb = document.getElementById("suburb").value.trim();
    const city = document.getElementById("city").value.trim();
    const country = document.getElementById("country").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;
    const terms = document.getElementById("terms").checked;
    const errorMsg = document.getElementById("errorMsg"); // will be displayed on the form if there is an error when the user signs-up in
    // clear old message
    errorMsg.textContent = "";
    // handeling if the user leaves fields open
    if (Fname === "" ||Lname === "" ||email === "" ||agencyName === "" ||street === "" ||suburb === "" ||city === "" ||country === "" ||phone === "" ||password === ""){
        errorMsg.textContent = "All signup fields must be filled in";
        return;
    }
    // checking if terms checkbox is selected
    if (!terms) {
        errorMsg.textContent = "You must accept the terms and conditions.";
        return;
    }
    // email validation regex
    const emailRegex = /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_'+\-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i;
    if (!emailRegex.test(email)) {
        errorMsg.textContent = "Email invalid try again";
        return;
    }
    // phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
        errorMsg.textContent = "Phone number invalid try again";
        return;
    }
    // checking password length
    if (password.length < 8) {
        errorMsg.textContent = "Password too short must be >= 8";
        return;
    }
    // uppercase check
    if (!/[A-Z]/.test(password)) {
        errorMsg.textContent = "Password must have at least 1 uppercase letter";
        return;
    }
    // lowercase check
    if (!/[a-z]/.test(password)) {
        errorMsg.textContent = "Password must have at least 1 lowercase letter";
        return;
    }
    // digit check
    if (!/[0-9]/.test(password)) {
        errorMsg.textContent = "Password must have at least 1 digit";
        return;
    }
    // check symbol
    if (!/[!@#$%^&*(),.?":{}|<>_\-]/.test(password)) {
        errorMsg.textContent = "Password must have at least 1 special character";
        return;
    }
    // SENDING THE DATA TO THE SIGNUP API
    fetch("http://localhost/COS-221-PA5/Travel-Agency-Package-Marketplace/backend/loginLogout/api.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            type: "agencyRegister",
            email: email,
            firstName: Fname,
            middleName: Mname,
            lastName: Lname,
            agencyName: agencyName,
            street: street,
            suburb: suburb,
            city: city,
            country: country,
            phoneNumber: phone,
            password: password
        })
    })
    .then(function (res) {
        return res.json();
    })
    .then(function (data) {
        if (data.status === "success") {
            errorMsg.textContent = "New agency added. Try logging in.";

            setTimeout(function () {
                window.location.href = "loginAgency.php";
            }, 800);
        } else {
            errorMsg.textContent = data.message || data.data || "Agency signup failed.";
        }
    })
    .catch(function (err) {
        errorMsg.textContent = "Server error from agency signup.";
        console.error(err);
    });
});