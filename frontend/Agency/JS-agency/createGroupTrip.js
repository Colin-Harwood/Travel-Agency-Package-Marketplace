const API_URL = "http://localhost/COS-221-PA5/Travel-Agency-Package-Marketplace/backend/Agency_code/agencyAPI.php";// api url
// when the HTML loads
document.addEventListener("DOMContentLoaded", function () {
    // get the data fromthe frontend to send in th API
    const form = document.getElementById("createGroupTripForm");
    const messageBox = document.getElementById("messageBox");
    const packageSelect = document.getElementById("packageID");
    const packageName = document.getElementById("packageName");
    const packagePrice = document.getElementById("packagePrice");
    const packageDuration = document.getElementById("packageDuration");
    const packageStatus = document.getElementById("packageStatus");
    const packageDescription = document.getElementById("packageDescription");

    let packages = [];
    loadPackages();
    packageSelect.addEventListener("change", function () {
        displaySelectedPackage();
    });
    // for the button to reset the form data
    form.addEventListener("reset", function () {
        messageBox.textContent = "";
        messageBox.className = "";
        setTimeout(function () {
            packageName.value = "";
            packagePrice.value = "";
            packageDuration.value = "";
            packageStatus.value = "";
            packageDescription.value = "";
        }, 0);
    });
    // submit data button
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        messageBox.textContent = "";
        messageBox.className = "";
        const agencyID = localStorage.getItem("userID");
        // some validation
        if (!agencyID) {
            showMessage("You must be logged in to create a group trip.", "error");
            return;
        }

        const groupTripData = {
            action: "create_group_trip",//the api to be used
            agencyID: parseInt(agencyID),
            packageID: parseInt(packageSelect.value),
            maxSize: parseInt(document.getElementById("maxSize").value),
            tripDate: document.getElementById("tripDate").value
        };

        if (isNaN(groupTripData.agencyID) ||
            isNaN(groupTripData.packageID) ||
            isNaN(groupTripData.maxSize) ||
            groupTripData.tripDate === ""
        ) {
            showMessage("Please fill in all fields correctly.", "error");
            return;
        }
        if (groupTripData.packageID <= 0) {
            showMessage("Please select a valid package.", "error");
            return;
        }
        if (groupTripData.maxSize <= 0) {
            showMessage("Maximum group size must be at least 1.", "error");
            return;
        }
        // sending the data to the API to ceate a group trip
        fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(groupTripData)
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.status !== "success") {
                showMessage(data.data || "Could not create group trip.", "error");
                return;
            }
            showMessage(data.data.message + " Trip ID: " + data.data.tripID, "success");
            form.reset();
            packageName.value = "";
            packagePrice.value = "";
            packageDuration.value = "";
            packageStatus.value = "";
            packageDescription.value = "";
            loadPackages();
        })
        .catch(function (error) {
            console.error("Create group trip error:", error);
            showMessage("Something went wrong while creating the group trip.", "error");
        });
    });
    // load packages to UI
    function loadPackages() {
        const agencyID = localStorage.getItem("userID");
        packageSelect.innerHTML = "";
        const loadingOption = document.createElement("option");
        loadingOption.value = "";
        loadingOption.textContent = "Loading packages...";
        packageSelect.appendChild(loadingOption);
        if (!agencyID) {
            packageSelect.innerHTML = "";

            const errorOption = document.createElement("option");
            errorOption.value = "";
            errorOption.textContent = "Could not find agency";
            packageSelect.appendChild(errorOption);

            showMessage("You must be logged in to load packages.", "error");
            return;
        }
        // get packages api req
        fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "get_agency_packages",
                agencyID: parseInt(agencyID)
            })
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            packageSelect.innerHTML = "";

            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.textContent = "Select package";
            packageSelect.appendChild(defaultOption);

            if (data.status !== "success" || !Array.isArray(data.data)) {
                showMessage("Could not load packages.", "error");
                return;
            }

            packages = data.data;

            if (packages.length === 0) {
                const emptyOption = document.createElement("option");
                emptyOption.value = "";
                emptyOption.textContent = "No packages found";
                packageSelect.appendChild(emptyOption);

                showMessage("You must create a package before creating a group trip.", "error");
                return;
            }

            packages.forEach(function (packageItem) {
                const option = document.createElement("option");

                option.value = packageItem.packageID;
                option.textContent = packageItem.name + " - " + packageItem.type;

                packageSelect.appendChild(option);
            });
        })
        .catch(function (error) {
            console.error("Load packages error:", error);

            packageSelect.innerHTML = "";

            const errorOption = document.createElement("option");
            errorOption.value = "";
            errorOption.textContent = "Could not load packages";
            packageSelect.appendChild(errorOption);

            showMessage("Could not load packages.", "error");
        });
    }
    // display the packages in thr UI
    function displaySelectedPackage() {
        const selectedPackageID = packageSelect.value;

        const selectedPackage = packages.find(function (packageItem) {
            return String(packageItem.packageID) === String(selectedPackageID);
        });

        if (!selectedPackage) {
            packageName.value = "";
            packagePrice.value = "";
            packageDuration.value = "";
            packageStatus.value = "";
            packageDescription.value = "";
            return;
        }

        packageName.value = selectedPackage.name || "";
        packagePrice.value = selectedPackage.pricePerPerson || "";
        packageDuration.value = selectedPackage.duration || "";
        packageStatus.value = selectedPackage.status || "";
        packageDescription.value = selectedPackage.description || "";
    }

    function showMessage(message, type) {
        messageBox.textContent = message;
        messageBox.className = type;
    }
});