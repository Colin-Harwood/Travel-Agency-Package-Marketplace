const API_URL = "http://localhost/COS-221-PA5/Travel-Agency-Package-Marketplace/backend/Agency_code/agencyAPI.php";

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("createPackageForm");
    const messageBox = document.getElementById("messageBox");
    const destinationSelect = document.getElementById("destinationID");

    loadDestinations();

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        messageBox.textContent = "";
        messageBox.className = "";

        const agencyID = localStorage.getItem("userID");

        if (!agencyID) {
            showMessage("You must be logged in to create a package.", "error");
            return;
        }

        const packageData = {
            action: "create_package",
            agencyID: parseInt(agencyID),
            packageType: document.getElementById("packageType").value.trim(),
            name: document.getElementById("name").value.trim(),
            description: document.getElementById("description").value.trim(),
            pricePerPerson: parseFloat(document.getElementById("pricePerPerson").value),
            status: document.getElementById("status").value.trim(),
            duration: parseInt(document.getElementById("duration").value),
            destinationID: parseInt(destinationSelect.value)
        };

        const flightID = document.getElementById("flightID").value;
        const accommodationID = document.getElementById("accommodationID").value;
        const restaurantID = document.getElementById("restaurantID").value;
        const attractionSelect = document.getElementById("attractionID");
        const attractionID = attractionSelect.value;
        const attractionName = attractionSelect.options[attractionSelect.selectedIndex].text;

        if (packageData.name === "" || packageData.packageType === "" || packageData.description === "" || packageData.status === "" || isNaN(packageData.pricePerPerson) || isNaN(packageData.duration) || isNaN(packageData.destinationID)) {
            showMessage("Please fill in all fields correctly.", "error");
            return;
        }

        if (packageData.pricePerPerson <= 0) {
            showMessage("Price per person must be greater than 0.", "error");
            return;
        }

        if (packageData.duration <= 0) {
            showMessage("Duration must be at least 1 day.", "error");
            return;
        }

        if (packageData.destinationID <= 0) {
            showMessage("Please select a valid destination.", "error");
            return;
        }

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
            if (data.status !== "success") {
                showMessage(data.data || "Could not create package.", "error");
                return;
            }

            const packageID = data.data.packageID;
            const extraRequests = [];

            if (flightID !== "") {
                extraRequests.push(sendExtraRequest({
                    action: "add_flight",
                    packageID: parseInt(packageID),
                    flightID: parseInt(flightID)
                }));
            }

            if (accommodationID !== "") {
                extraRequests.push(sendExtraRequest({
                    action: "add_accommodation",
                    packageID: parseInt(packageID),
                    accommodationID: parseInt(accommodationID)
                }));
            }

            if (restaurantID !== "") {
                extraRequests.push(sendExtraRequest({
                    action: "add_restaurant",
                    packageID: parseInt(packageID),
                    restaurantID: parseInt(restaurantID)
                }));
            }

            if (attractionID !== "") {
                extraRequests.push(sendExtraRequest({
                    action: "add_attraction",
                    packageID: parseInt(packageID),
                    destinationID: parseInt(packageData.destinationID),
                    name: attractionName
                }));
            }

            Promise.all(extraRequests)
            .then(function () {
                showMessage(data.data.message + " Package ID: " + packageID, "success");
                form.reset();
                loadDestinations();
            })
            .catch(function (error) {
                console.error("Extra package item error:", error);
                showMessage("Package was created, but one or more extras could not be added.", "error");
            });
        })
        .catch(function (error) {
            console.error("Create package error:", error);
            showMessage("Something went wrong while creating the package.", "error");
        });
    });

    function loadDestinations() {
        destinationSelect.innerHTML = "<option value=''>Loading destinations...</option>";

        fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "get_destinations"
            })
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            destinationSelect.innerHTML = "";

            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.textContent = "Select destination";
            destinationSelect.appendChild(defaultOption);

            if (data.status !== "success" || !Array.isArray(data.data)) {
                showMessage("Could not load destinations.", "error");
                return;
            }

            data.data.forEach(function (destination) {
                const option = document.createElement("option");

                option.value = destination.destinationID;
                option.textContent = destination.city + ", " + destination.country;

                destinationSelect.appendChild(option);
            });
        })
        .catch(function (error) {
            console.error("Get destinations error:", error);
            destinationSelect.innerHTML = "<option value=''>Could not load destinations</option>";
            showMessage("Could not load destinations.", "error");
        });
    }

    function sendExtraRequest(extraData) {
        return fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(extraData)
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.status !== "success") {
                throw new Error(data.data || "Extra request failed.");
            }

            return data;
        });
    }

    function showMessage(message, type) {
        messageBox.textContent = message;
        messageBox.className = type;
    }
});