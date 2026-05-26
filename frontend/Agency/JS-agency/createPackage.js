const API_URL = "http://localhost/COS-221-PA5/Travel-Agency-Package-Marketplace/backend/Agency_code/agencyAPI.php";// api url
// when the page loads
document.addEventListener("DOMContentLoaded", function () {
    // getting the form data
    const form = document.getElementById("createPackageForm");
    const messageBox = document.getElementById("messageBox");

    const destinationSelect = document.getElementById("destinationID");
    const flightSelect = document.getElementById("flightID");
    const accommodationSelect = document.getElementById("accommodationID");
    const restaurantSelect = document.getElementById("restaurantID");
    const attractionSelect = document.getElementById("attractionID");

    loadDestinations();
    loadFlights();
    loadAccommodations();
    loadRestaurants();
    loadAttractions();
    // submit button impoklemetation
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        messageBox.textContent = "";
        messageBox.className = "";

        const agencyID = localStorage.getItem("userID");

        if (!agencyID) {
            showMessage("You must be logged in to create a package.", "error");
            return;
        }
        // get package data
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

        const flightID = flightSelect.value;
        const accommodationID = accommodationSelect.value;
        const restaurantID = restaurantSelect.value;
        const attractionValue = attractionSelect.value;
        // some validation
        if (
            packageData.name === "" ||
            packageData.packageType === "" ||
            packageData.description === "" ||
            packageData.status === "" ||
            isNaN(packageData.pricePerPerson) ||
            isNaN(packageData.duration) ||
            isNaN(packageData.destinationID)
        ) {
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
        // API req to create the package
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
            // making sure the extras are added if there are any
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

            if (attractionValue !== "") {
                const attractionParts = attractionValue.split("|");
                const attractionDestinationID = parseInt(attractionParts[0]);
                const attractionName = attractionParts[1];

                extraRequests.push(sendExtraRequest({
                    action: "add_attraction",
                    packageID: parseInt(packageID),
                    destinationID: attractionDestinationID,
                    name: attractionName
                }));
            }

            Promise.all(extraRequests)
            .then(function () {
                showMessage(data.data.message + " Package ID: " + packageID, "success");
                form.reset();

                loadDestinations();
                loadFlights();
                loadAccommodations();
                loadRestaurants();
                loadAttractions();
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
    // load for dropdowns
    function loadDestinations() {
        loadSelectOptions({
            selectElement: destinationSelect,
            action: "get_destinations",
            defaultText: "Select destination",
            loadingText: "Loading destinations...",
            errorText: "Could not load destinations",
            getValue: function (destination) {
                return destination.destinationID;
            },
            getText: function (destination) {
                return destination.city + ", " + destination.country;
            }
        });
    }
     // load for dropdowns
    function loadFlights() {
        loadSelectOptions({
            selectElement: flightSelect,
            action: "get_flights",
            defaultText: "None",
            loadingText: "Loading flights...",
            errorText: "Could not load flights",
            getValue: function (flight) {
                return flight.flightID;
            },
            getText: function (flight) {
                return flight.flightNumber;
            }
        });
    }
     // load for dropdowns
    function loadAccommodations() {
        loadSelectOptions({
            selectElement: accommodationSelect,
            action: "get_accommodations",
            defaultText: "None",
            loadingText: "Loading accommodations...",
            errorText: "Could not load accommodations",
            getValue: function (accommodation) {
                return accommodation.accommodationID;
            },
            getText: function (accommodation) {
                return accommodation.name;
            }
        });
    }
     // load for dropdowns
    function loadRestaurants() {
        loadSelectOptions({
            selectElement: restaurantSelect,
            action: "get_restaurants",
            defaultText: "None",
            loadingText: "Loading restaurants...",
            errorText: "Could not load restaurants",
            getValue: function (restaurant) {
                return restaurant.restaurantID;
            },
            getText: function (restaurant) {
                return restaurant.name;
            }
        });
    }
     // load for dropdowns
    function loadAttractions() {
        loadSelectOptions({
            selectElement: attractionSelect,
            action: "get_attractions",
            defaultText: "None",
            loadingText: "Loading attractions...",
            errorText: "Could not load attractions",
            getValue: function (attraction) {
                return attraction.destinationID + "|" + attraction.name;
            },
            getText: function (attraction) {
                return attraction.name;
            }
        });
    }
     // load for dropdowns
    function loadSelectOptions(config) {
        config.selectElement.innerHTML = "";

        const loadingOption = document.createElement("option");
        loadingOption.value = "";
        loadingOption.textContent = config.loadingText;
        config.selectElement.appendChild(loadingOption);

        fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: config.action
            })
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            config.selectElement.innerHTML = "";

            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.textContent = config.defaultText;
            config.selectElement.appendChild(defaultOption);

            if (data.status !== "success" || !Array.isArray(data.data)) {
                showMessage(config.errorText + ".", "error");
                return;
            }

            data.data.forEach(function (item) {
                const option = document.createElement("option");

                option.value = config.getValue(item);
                option.textContent = config.getText(item);

                config.selectElement.appendChild(option);
            });
        })
        .catch(function (error) {
            console.error(config.action + " error:", error);

            config.selectElement.innerHTML = "";

            const errorOption = document.createElement("option");
            errorOption.value = "";
            errorOption.textContent = config.errorText;
            config.selectElement.appendChild(errorOption);

            showMessage(config.errorText + ".", "error");
        });
    }
    // send the extra data to the API
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