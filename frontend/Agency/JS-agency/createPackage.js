const API_URL = "../API/api.php";

document.addEventListener("DOMContentLoaded", function () {
    // get the data from the form
    const form = document.getElementById("createPackageForm");
    const messageBox = document.getElementById("messageBox");
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        messageBox.textContent = "";
        messageBox.className = "";
        //user id from dom
        const agencyID = localStorage.getItem("userID");
        // info from form
        const packageData = {
            action: "create_package",
            agencyID: parseInt(agencyID),
            packageType: document.getElementById("packageType").value.trim(),
            name: document.getElementById("name").value.trim(),
            description: document.getElementById("description").value.trim(),
            pricePerPerson: parseFloat(document.getElementById("pricePerPerson").value),
            status: document.getElementById("status").value.trim(),
            duration: parseInt(document.getElementById("duration").value),
            destinationID: parseInt(document.getElementById("destinationID").value)
        };
        //validation
        if (packageData.name === "" || packageData.packageType === "" || packageData.description === "" || packageData.status === "" || isNaN(packageData.pricePerPerson) || isNaN(packageData.duration) || isNaN(packageData.destinationID)) {
            showMessage("Please fill in all fields correctly.", "error");
            return;
        }
        //validation
        if (packageData.pricePerPerson <= 0) {
            showMessage("Price per person must be greater than 0.", "error");
            return;
        }
        //validation
        if (packageData.duration <= 0) {
            showMessage("Duration must be at least 1 day.", "error");
            return;
        }
        //validation
        if (packageData.destinationID <= 0) {
            showMessage("Destination ID must be valid.", "error");
            return;
        }


        // API REQ make sure it works with jacks api
        fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(packageData)
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.status === "success") {
                showMessage(data.data.message + " Package ID: " + data.data.packageID, "success");
                form.reset();
            } else {
                showMessage(data.data || "Could not create package.", "error");
            }
        })
        .catch(function (error) {
            console.error("Create package error:", error);
            showMessage("Something went wrong while creating the package.", "error");
        });
    });
    function showMessage(message, type) {
        messageBox.textContent = message;
        messageBox.className = type;
    }
});