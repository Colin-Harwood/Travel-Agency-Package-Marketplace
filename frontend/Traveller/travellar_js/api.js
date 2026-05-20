var TravelAPI = (function () {
    function getBaseUrl() {
        return window.location.origin + "/Travel-Agency-Package-Marketplace/backend/traveller/userApi.php";
    }

    var LOGIN_API_URL = window.location.origin + "/Travel-Agency-Package-Marketplace/backend/loginLogout/api.php";
    var PACKAGE_API_URL = getBaseUrl();
    var BOOKINGS_API_URL = window.location.origin + "/Travel-Agency-Package-Marketplace/backend/traveller/bookingsApi.php";

    function sendRequest(url, payload, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                var response = null;
                try {
                    response = JSON.parse(xhr.responseText);
                } catch (e) {
                    callback(new Error("Invalid JSON returned by server: " + xhr.responseText.substring(0, 250)), null);
                    return;
                }

                if (xhr.status >= 200 && xhr.status < 300) {
                    callback(null, response);
                } else {
                    callback(new Error(response.message || response.data || "Server error " + xhr.status), response);
                }
            }
        };

        xhr.onerror = function () {
            callback(new Error("Network error. Check that XAMPP/Apache is running and the API path is correct."), null);
        };

        xhr.send(JSON.stringify(payload));
    }

    function travellerRegister(firstName, lastName, email, phoneNumber, password, callback) {
        sendRequest(LOGIN_API_URL, {
            type: "travellerRegister",
            firstName: firstName,
            middleName: "",
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
            password: password
        }, callback);
    }

    function travellerLogin(email, password, callback) {
        sendRequest(LOGIN_API_URL, {
            type: "travellerLogin",
            email: email,
            password: password
        }, callback);
    }

    function logout(apiKey, callback) {
        sendRequest(LOGIN_API_URL, {
            type: "logout",
            apiKey: apiKey
        }, callback);
    }

    function getApiKey() {
        return localStorage.getItem("apiKey");
    }

    function requireApiKey(callback) {
        var apiKey = getApiKey();
        if (!apiKey) {
            callback(new Error("Please log in first."), null);
            return null;
        }
        return apiKey;
    }

    function getAllPackages(callback) {
        var apiKey = requireApiKey(callback);
        if (!apiKey) return;

        sendRequest(PACKAGE_API_URL, {
            type: "getAllPackages",
            apikey: apiKey
        }, callback);
    }

    function getPackage(packageId, callback) {
        var apiKey = requireApiKey(callback);
        if (!apiKey) return;

        sendRequest(PACKAGE_API_URL, {
            type: "getPackage",
            apikey: apiKey,
            packageId: packageId
        }, callback);
    }

    function bookPackage(groupTripID, numTravellers, callback) {
        var apiKey = requireApiKey(callback);
        if (!apiKey) return;

        sendRequest(PACKAGE_API_URL, {
            type: "bookPackage",
            apikey: apiKey,
            groupTripID: groupTripID,
            numTravellers: numTravellers
        }, callback);
    }

    function cancelBooking(orderId, callback) {
        var apiKey = requireApiKey(callback);
        if (!apiKey) return;

        sendRequest(PACKAGE_API_URL, {
            type: "cancelBooking",
            apikey: apiKey,
            orderId: orderId
        }, callback);
    }

    function getUserBookings(callback) {
        var apiKey = getApiKey();
        if (!apiKey) {
            callback(new Error("Please log in first."), null);
            return;
        }

        sendRequest(BOOKINGS_API_URL, {
            type: "getUserBookings",
            apikey: apiKey
        }, callback);
    }

    return {
        travellerRegister: travellerRegister,
        travellerLogin: travellerLogin,
        logout: logout,
        getApiKey: getApiKey,
        getAllPackages: getAllPackages,
        getPackage: getPackage,
        bookPackage: bookPackage,
        cancelBooking: cancelBooking,
        getUserBookings: getUserBookings
    };
})();