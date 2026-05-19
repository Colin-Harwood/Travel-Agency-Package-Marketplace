// we get the data from the form
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    // getting the data from the form using DOM
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const errorMsg = document.getElementById("errorMsg");
    // clear old message
    errorMsg.textContent = "";
    // handeling if the user leaves fields open
    if (email === "" || password === "") {
        errorMsg.textContent = "Must fill in email and password";
        return;
    }
    // email validation
    const emailRegex = /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_'+\-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i;
    if (!emailRegex.test(email)) {
        errorMsg.textContent = "Invalid Email";
        return;
    }
    // send req to api
    fetch("http://localhost/COS-221-PA5/Travel-Agency-Package-Marketplace/backend/loginLogout/api.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            type: "agencyLogin",
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
            errorMsg.textContent = "Login successful.";
            // window.location.href = "agencyHome.php";
        } else {
            errorMsg.textContent = data.message;
        }
    })
    .catch(err => {
        errorMsg.textContent = "Server error from agency login.";
        console.error(err);
    });
});