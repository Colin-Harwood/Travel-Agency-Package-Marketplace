var TravelAPI = (function () {
    var LOGIN_API_URL = "http://localhost/Travel-Agency-Package-Marketplace/backend/loginLogout/api.php";

    function sendRequest(payload, callback) {
        var xhr = new XMLHttpRequest();

        xhr.open("POST", LOGIN_API_URL, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                var response = null;

                try {
                    response = JSON.parse(xhr.responseText);
                } catch (e) {
                    callback(new Error("Server did not return valid JSON: " + xhr.responseText), null);
                    return;
                }

                if (xhr.status >= 200 && xhr.status < 300) {
                    callback(null, response);
                } else {
                    callback(new Error(response.message || response.data || "Server returned status " + xhr.status), response);
                }
            }
        };

        xhr.onerror = function () {
            callback(new Error("Network error. Could not connect to the API."), null);
        };

        xhr.send(JSON.stringify(payload));
    }

    function travellerRegister(firstName, lastName, email, phoneNumber, password, callback) {
        sendRequest({
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
        sendRequest({
            type: "travellerLogin",
            email: email,
            password: password
        }, callback);
    }

    function logout(apiKey, callback) {
        sendRequest({
            type: "logout",
            apiKey: apiKey
        }, callback);
    }

    return {
        sendRequest: sendRequest,
        travellerRegister: travellerRegister,
        travellerLogin: travellerLogin,
        logout: logout
    };
})();