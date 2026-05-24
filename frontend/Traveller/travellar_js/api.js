var TravelAPI = (function () {
    "use strict";

    function getProjectRoot() {
        var marker = "/Travel-Agency-Package-Marketplace";
        var path = window.location.pathname;
        var index = path.indexOf(marker);
        if (index !== -1) {
            return path.substring(0, index + marker.length);
        }
        return "/Travel-Agency-Package-Marketplace";
    }

    function getTravellerApiUrl() {
        return window.location.origin + getProjectRoot() + "/backend/traveller/userApi.php";
    }

    function getLoginApiUrl() {
        return window.location.origin + getProjectRoot() + "/backend/loginLogout/api.php";
    }

    var USER_API_URL = getTravellerApiUrl();
    var LOGIN_API_URL = getLoginApiUrl();

    function getErrorMessage(response, fallback) {
        if (!response) return fallback || "Request failed.";
        if (typeof response === "string") return response;
        if (response.message) return response.message;
        if (response.data) {
            if (typeof response.data === "string") return response.data;
            try {
                return JSON.stringify(response.data);
            } catch (e) {
                return fallback || "Request failed.";
            }
        }
        return fallback || "Request failed.";
    }

    function sendRequest(url, payload, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onreadystatechange = function () {
            var response;
            if (xhr.readyState !== 4) return;
            try {
                response = JSON.parse(xhr.responseText || "{}");
            } catch (e) {
                callback(new Error("Invalid JSON returned by server. Raw response: " + xhr.responseText.substring(0, 300)), null);
                return;
            }
            if (window.console && console.log) {
                console.log("Tripistry API request", payload);
                console.log("Tripistry API response", response);
            }
            if (xhr.status >= 200 && xhr.status < 300) {
                callback(null, response);
            } else {
                callback(new Error(getErrorMessage(response, "Server error " + xhr.status)), response);
            }
        };
        xhr.onerror = function () {
            callback(new Error("Network error. Check Apache/XAMPP and this API path: " + url), null);
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
        }, function (err, response) {
            var key;
            if (!err && response && response.status === "success" && response.data) {
                key = response.data.apiKey || response.data.apikey;
                if (key) {
                    saveApiKey(key);
                }
            }
            callback(err, response);
        });
    }

    function logout(apiKey, callback) {
        sendRequest(LOGIN_API_URL, {
            type: "logout",
            apiKey: apiKey
        }, function (err, response) {
            clearStoredApiKeys();
            if (callback) {
                callback(err, response);
            }
        });
    }

    function clearStoredApiKeys() {
        localStorage.removeItem("apiKey");
        localStorage.removeItem("apikey");
        localStorage.removeItem("travellerApiKey");
        sessionStorage.removeItem("apiKey");
        sessionStorage.removeItem("apikey");
        sessionStorage.removeItem("travellerApiKey");
    }

    function getApiKey() {
        return localStorage.getItem("apiKey") || localStorage.getItem("apikey") || localStorage.getItem("travellerApiKey") || "";
    }

    function saveApiKey(apiKey) {
        if (apiKey && apiKey !== "") {
            localStorage.setItem("apiKey", apiKey);
            localStorage.setItem("apikey", apiKey);
            localStorage.setItem("travellerApiKey", apiKey);
        }
    }

    function requireApiKey(callback) {
        var apiKey = getApiKey();
        if (!apiKey || apiKey === "") {
            callback(new Error("Please log in first."), null);
            return null;
        }
        return apiKey;
    }

    function getAllPackages(options, callback) {
        var apiKey;
        var payload;
        if (typeof options === "function") {
            callback = options;
            options = {};
        }
        options = options || {};
        apiKey = requireApiKey(callback);
        if (!apiKey) return;
        payload = {
            type: "getAllPackages",
            apikey: apiKey
        };
        if (options.agencyName !== undefined && options.agencyName !== "") payload.agencyName = options.agencyName;
        if (options.destination !== undefined && options.destination !== "") payload.destination = options.destination;
        if (options.maxPrice !== undefined && options.maxPrice !== 0) payload.maxPrice = parseInt(options.maxPrice, 10);
        if (options.duration !== undefined && options.duration !== 0) payload.duration = parseInt(options.duration, 10);
        if (options.sortBy !== undefined && options.sortBy !== "") payload.sortBy = options.sortBy;
        if (options.sortDirection !== undefined && options.sortDirection !== "") payload.sortDirection = options.sortDirection;
        if (options.page !== undefined) payload.page = parseInt(options.page, 10);
        if (options.limit !== undefined) payload.limit = parseInt(options.limit, 10);
        sendRequest(USER_API_URL, payload, callback);
    }

    function getPackage(packageId, callback) {
        var apiKey = requireApiKey(callback);
        if (!apiKey) return;
        sendRequest(USER_API_URL, {
            type: "getPackage",
            apikey: apiKey,
            packageId: String(packageId)
        }, callback);
    }

    function bookPackage(groupTripID, numTravellers, callback) {
        var apiKey = requireApiKey(callback);
        if (!apiKey) return;
        sendRequest(USER_API_URL, {
            type: "bookPackage",
            apikey: apiKey,
            groupTripID: String(groupTripID),
            numTravellers: String(numTravellers)
        }, callback);
    }

    function cancelBooking(orderId, callback) {
        var apiKey = requireApiKey(callback);
        if (!apiKey) return;
        sendRequest(USER_API_URL, {
            type: "cancelBooking",
            apikey: apiKey,
            orderId: String(orderId)
        }, callback);
    }

    function getUserBookings(callback) {
        var apiKey = requireApiKey(callback);
        if (!apiKey) return;
        sendRequest(USER_API_URL, {
            type: "getBookings",
            apikey: apiKey
        }, callback);
    }

    function getSingleBooking(orderId, callback) {
        var apiKey = requireApiKey(callback);
        if (!apiKey) return;
        sendRequest(USER_API_URL, {
            type: "getSingleBooking",
            apikey: apiKey,
            orderID: String(orderId)
        }, callback);
    }

    function makeReview(packageID, starRating, comment, callback) {
        var apiKey = requireApiKey(callback);
        if (!apiKey) return;
        sendRequest(USER_API_URL, {
            type: "makeReview",
            apikey: apiKey,
            packageID: String(packageID),
            starRating: parseInt(starRating, 10),
            comment: String(comment)
        }, callback);
    }

    function getAllFlights(filters, callback) {
        var apiKey = requireApiKey(callback);
        if (!apiKey) return;

        if (typeof filters === "function") {
            callback = filters;
            filters = {};
        }

        filters = filters || {};

        var payload = {
            type: "getAllFlights",
            apikey: apiKey,
            startDate: filters.startDate !== undefined ? String(filters.startDate) : "",
            endDate: filters.endDate !== undefined ? String(filters.endDate) : "",
            airline: filters.airline !== undefined ? String(filters.airline) : "",
            minPrice: filters.minPrice !== undefined ? String(filters.minPrice) : "0",
            maxPrice: filters.maxPrice !== undefined ? String(filters.maxPrice) : "0"
        };

        sendRequest(USER_API_URL, payload, callback);
    }

    function getAllAccommodations(filters, callback) {
        var apiKey = requireApiKey(callback);
        if (!apiKey) return;

        if (typeof filters === "function") {
            callback = filters;
            filters = {};
        }

        filters = filters || {};

        var payload = {
            type: "getAllAccommodations",
            apikey: apiKey,
            accommodationType: filters.accommodationType !== undefined ? String(filters.accommodationType) : "",
            minRating: filters.minRating !== undefined ? String(filters.minRating) : "",
            minPrice: filters.minPrice !== undefined ? String(filters.minPrice) : "",
            maxPrice: filters.maxPrice !== undefined ? String(filters.maxPrice) : "",
            destination: filters.destination !== undefined ? String(filters.destination) : ""
        };

        sendRequest(USER_API_URL, payload, callback);
    }

    function getAllAttractions(callback) {
        var apiKey = requireApiKey(callback);
        if (!apiKey) return;

        sendRequest(USER_API_URL, {
            type: "getAllAttractions",
            apikey: apiKey
        }, callback);
    }

    function getAllDestinations(callback) {
        var apiKey = requireApiKey(callback);
        if (!apiKey) return;

        sendRequest(USER_API_URL, {
            type: "getAllDestinations",
            apikey: apiKey
        }, callback);
    }

    function getAllRestaurants(callback) {
        var apiKey = requireApiKey(callback);
        if (!apiKey) return;

        sendRequest(USER_API_URL, {
            type: "getAllRestaurants",
            apikey: apiKey
        }, callback);
    }

    function deleteReview(reviewID, callback) {
        var apiKey = getApiKey();
        if (!apiKey) {
            callback(new Error("No API key found. Please log in."), null);
            return;
        }
        
        sendRequest(USER_API_URL, {
            type: "deleteReview",
            apikey: apiKey,
            reviewID: parseInt(reviewID, 10)
        }, callback);
    }

    function getAllReviews(callback) {
        var apiKey = requireApiKey(callback);
        if (!apiKey) return;

        sendRequest(USER_API_URL, {
            type: "getAllReviews",
            apikey: apiKey
        }, callback);
    }

    return {
        travellerRegister: travellerRegister,
        travellerLogin: travellerLogin,
        logout: logout,
        getApiKey: getApiKey,
        saveApiKey: saveApiKey,
        clearStoredApiKeys: clearStoredApiKeys,
        getAllPackages: getAllPackages,
        getPackage: getPackage,
        bookPackage: bookPackage,
        cancelBooking: cancelBooking,
        getUserBookings: getUserBookings,
        makeReview: makeReview,
        getAllFlights: getAllFlights,
        getSingleBooking: getSingleBooking,
        getAllAccommodations: getAllAccommodations,
        getAllAttractions: getAllAttractions,
        getAllDestinations: getAllDestinations,
        getAllRestaurants: getAllRestaurants,
        deleteReview: deleteReview,
        getAllReviews: getAllReviews
    };
})();