// url for the api
const API_URL = "http://localhost/COS-221-PA5/Travel-Agency-Package-Marketplace/backend/Agency_code/agencyAPI.php";
// on page load
document.addEventListener("DOMContentLoaded", function () {
    // getting data from the hrml
    const packagesList = document.getElementById("packagesList");
    const messageBox = document.getElementById("messageBox");
    const refreshPackagesBtn = document.getElementById("refreshPackagesBtn");

    let destinations = [];
    loadPageData();
    refreshPackagesBtn.addEventListener("click", function () {
        loadPageData();
    });
    // load all the package data
    function loadPageData() {
        messageBox.textContent = "";
        messageBox.className = "";
        // get agency id form local storage
        const agencyID = localStorage.getItem("userID");
        //const agencyID = 11;// HARD CODE FOR TESTING
        if (!agencyID) {
            showMessage("You must be logged in as an agency to view packages.", "error");
            packagesList.innerHTML = '<div class="empty-box">No agency user was found in local storage.</div>';
            return;
        }

        packagesList.innerHTML = '<div class="loading-box">Loading packages...</div>';
        // load destinactions
        loadDestinations()
        .then(function () {
            return loadAgencyPackages(parseInt(agencyID));
        })
        .catch(function (error) {
            console.error("Load page error:", error);
            showMessage("Something went wrong while loading the page.", "error");
            packagesList.innerHTML = '<div class="empty-box">Could not load packages.</div>';
        });
    }
    // send load destination req to the api
    function loadDestinations() {
        return fetch(API_URL, {
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
            if (data.status !== "success" || !Array.isArray(data.data)) {
                throw new Error(data.data || "Could not load destinations.");
            }
            destinations = data.data;
        });
    }
    // rends the load agency packages API req to add to frontend
    function loadAgencyPackages(agencyID) {
        return fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "get_agency_packages",
                agencyID: agencyID
            })
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.status !== "success" || !Array.isArray(data.data)) {
                showMessage(data.data || "Could not load agency packages.", "error");
                packagesList.innerHTML = '<div class="empty-box">Could not load packages.</div>';
                return;
            }

            renderPackages(data.data);
        });
    }
    // Loops over each package so we can add them to the frontend
    function renderPackages(packages) {
        packagesList.innerHTML = "";
        if (packages.length === 0) {
            packagesList.innerHTML = '<div class="empty-box">Your agency has no packages yet.</div>';
            return;
        }
        packages.forEach(function (packageItem) {
            const card = createPackageCard(packageItem);
            packagesList.appendChild(card);
        });
    }
    // create the HTML card so we can have the package loaded it just easyer to do this in the backend JS
    function createPackageCard(packageItem) {
        const card = document.createElement("div");
        card.className = "package-card";
        const originalData = {
            packageID: packageItem.packageID,
            name: packageItem.name || "",
            packageType: packageItem.type || packageItem.packageType || "",
            description: packageItem.description || "",
            pricePerPerson: packageItem.pricePerPerson || "",
            status: packageItem.status || "Draft",
            duration: packageItem.duration || "",
            destinationID: packageItem.destinationID || ""
        };

        card.innerHTML = `
            <div class="card-top">
                <div class="package-title-area">
                    <span class="package-id">Package ID: ${escapeHtml(originalData.packageID)}</span>
                    <h2 class="package-name-heading">${escapeHtml(originalData.name)}</h2>
                    <span class="status-pill ${escapeHtml(originalData.status)}">${escapeHtml(originalData.status)}</span>
                </div>
                <div class="card-actions">
                    <button type="button" class="secondary-btn edit-btn">Edit</button>
                    <button type="button" class="primary-btn save-btn hidden">Save Changes</button>
                    <button type="button" class="secondary-btn cancel-btn hidden">Cancel</button>
                </div>
            </div>
            <form class="edit-package-form">
                <div class="field-grid two-columns">
                    <div class="form-group">
                        <label>Package Name</label>
                        <input type="text" class="name-input" value="${escapeAttribute(originalData.name)}" disabled required>
                    </div>
                    <div class="form-group">
                        <label>Package Type</label>
                        <select class="type-input" disabled required>
                            ${getPackageTypeOptions(originalData.packageType)}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Price Per Person</label>
                        <input type="number" class="price-input" step="0.01" min="0" value="${escapeAttribute(originalData.pricePerPerson)}" disabled required>
                    </div>
                    <div class="form-group">
                        <label>Duration Days</label>
                        <input type="number" class="duration-input" min="1" value="${escapeAttribute(originalData.duration)}" disabled required>
                    </div>
                    <div class="form-group">
                        <label>Status</label>
                        <select class="status-input" disabled required>
                            ${getStatusOptions(originalData.status)}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Destination</label>
                        <select class="destination-input" disabled required>
                            ${getDestinationOptions(originalData.destinationID)}
                        </select>
                    </div>
                    <div class="form-group full-width">
                        <label>Description</label>
                        <textarea class="description-input" disabled required>${escapeHtml(originalData.description)}</textarea>
                    </div>
                </div>
            </form>
        `;
        // getting buttons from th card
        const editBtn = card.querySelector(".edit-btn");
        const saveBtn = card.querySelector(".save-btn");
        const cancelBtn = card.querySelector(".cancel-btn");
        // creating the button on clicks os the call the correct functions
        editBtn.addEventListener("click", function () {
            enableEditing(card);
        });
        cancelBtn.addEventListener("click", function () {
            restoreCardValues(card, originalData);
            disableEditing(card);
        });
        saveBtn.addEventListener("click", function () {
            updatePackage(card, originalData);
        });

        return card;
    }
    // Alows the agencay to edit existing packages
    function enableEditing(card) {
        card.classList.add("editing");
        const inputs = card.querySelectorAll("input, select, textarea");
        inputs.forEach(function (input) {
            input.disabled = false;
        });
        card.querySelector(".edit-btn").classList.add("hidden");
        card.querySelector(".save-btn").classList.remove("hidden");
        card.querySelector(".cancel-btn").classList.remove("hidden");
    }
    // Stops the user form being able to edit individual packages
    function disableEditing(card) {
        card.classList.remove("editing");
        const inputs = card.querySelectorAll("input, select, textarea");
        inputs.forEach(function (input) {
            input.disabled = true;
        });
        card.querySelector(".edit-btn").classList.remove("hidden");
        card.querySelector(".save-btn").classList.add("hidden");
        card.querySelector(".cancel-btn").classList.add("hidden");
    }
    // get the original data back in the package cards
    function restoreCardValues(card, originalData) {
        card.querySelector(".name-input").value = originalData.name;
        card.querySelector(".type-input").value = originalData.packageType;
        card.querySelector(".description-input").value = originalData.description;
        card.querySelector(".price-input").value = originalData.pricePerPerson;
        card.querySelector(".status-input").value = originalData.status;
        card.querySelector(".duration-input").value = originalData.duration;
        card.querySelector(".destination-input").value = originalData.destinationID;
    }
    // collects the editited values so the package can be updated
    function updatePackage(card, originalData) {
        messageBox.textContent = "";
        messageBox.className = "";
        const packageData = {
            action: "update_package",
            packageID: parseInt(originalData.packageID),
            packageType: card.querySelector(".type-input").value.trim(),
            name: card.querySelector(".name-input").value.trim(),
            description: card.querySelector(".description-input").value.trim(),
            pricePerPerson: parseFloat(card.querySelector(".price-input").value),
            status: card.querySelector(".status-input").value.trim(),
            duration: parseInt(card.querySelector(".duration-input").value),
            destinationID: parseInt(card.querySelector(".destination-input").value)
        };
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
        // Sendint he updated data to the API
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
                showMessage(data.data || "Could not update package.", "error");
                return;
            }
            showMessage(data.data.message || "Package updated successfully.", "success");
            card.querySelector(".package-name-heading").textContent = packageData.name;
            const statusPill = card.querySelector(".status-pill");
            statusPill.textContent = packageData.status;
            statusPill.className = "status-pill " + packageData.status;
            originalData.name = packageData.name;
            originalData.packageType = packageData.packageType;
            originalData.description = packageData.description;
            originalData.pricePerPerson = packageData.pricePerPerson;
            originalData.status = packageData.status;
            originalData.duration = packageData.duration;
            originalData.destinationID = packageData.destinationID;
            disableEditing(card);
        })
        .catch(function (error) {
            console.error("Update package error:", error);
            showMessage("Something went wrong while updating the package.", "error");
        });
    }
    // get data form the API to populate the dropdown
    function getPackageTypeOptions(selectedValue) {
        const packageTypes = [
            "Adventure",
            "Cultural",
            "Beach",
            "City",
            "Safari",
            "Ski",
            "Cruise",
            "Wellness"
        ];
        let options = '<option value="">Select package type</option>';
        packageTypes.forEach(function (type) {
            const selected = type === selectedValue ? "selected" : "";
            options += `<option value="${escapeAttribute(type)}" ${selected}>${escapeHtml(type)}</option>`;
        });
        return options;
    }
    // get data form the API to populate the dropdown
    function getStatusOptions(selectedValue) {
        const statuses = [
            "Draft",
            "Active",
            "Inactive"
        ];
        let options = "";
        statuses.forEach(function (status) {
            const selected = status === selectedValue ? "selected" : "";
            options += `<option value="${escapeAttribute(status)}" ${selected}>${escapeHtml(status)}</option>`;
        });
        return options;
    }
    // get data form the API to populate the dropdown
    function getDestinationOptions(selectedDestinationID) {
        let options = '<option value="">Select destination</option>';

        destinations.forEach(function (destination) {
            const destinationID = String(destination.destinationID);
            const selected = String(selectedDestinationID) === destinationID ? "selected" : "";

            options += `
                <option value="${escapeAttribute(destinationID)}" ${selected}>
                    ${escapeHtml(destination.city + ", " + destination.country)}
                </option>
            `;
        });
        return options;
    }

    function showMessage(message, type) {
        messageBox.textContent = message;
        messageBox.className = type;
    }
    // used to escape
    function escapeHtml(value) {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function escapeAttribute(value) {
        return escapeHtml(value);
    }
});