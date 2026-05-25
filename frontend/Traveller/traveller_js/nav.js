(function () {
    "use strict";

    function isLoggedIn() {
        var apiKey = TravelAPI.getApiKey();
        return apiKey && apiKey !== "";
    }

    function updateNavVisibility() {
        var loggedIn = isLoggedIn();
        var loggedInItems = ["nav-flights", "nav-packages", "nav-desti", "nav-bookings", "nav-accom", "nav-attrac", "nav-about", "nav-logout", "nav-attrac", "nav-rest"];
        var loggedOutItems = ["nav-login", "nav-signup"];
        for (var i = 0; i < loggedInItems.length; i++) {
            var el = document.getElementById(loggedInItems[i]);
            if (el) {
                el.style.display = loggedIn ? "list-item" : "none";
            }
        }
        for (var j = 0; j < loggedOutItems.length; j++) {
            var el2 = document.getElementById(loggedOutItems[j]);
            if (el2) {
                el2.style.display = loggedIn ? "none" : "list-item";
            }
        }
        var aboutNav = document.getElementById("nav-about");
        if (aboutNav) {
            aboutNav.style.display = "list-item";
        }
    }

    function clearAllApiKeys() {
        localStorage.removeItem("apiKey");
        localStorage.removeItem("apikey");
        localStorage.removeItem("travellerApiKey");
        sessionStorage.removeItem("apiKey");
        sessionStorage.removeItem("apikey");
        sessionStorage.removeItem("travellerApiKey");
    }

    function setupLogout() {
        var logoutLink = document.getElementById("logoutLink");
        if (logoutLink) {
            var newLogoutLink = logoutLink.cloneNode(true);
            logoutLink.parentNode.replaceChild(newLogoutLink, logoutLink);

            newLogoutLink.addEventListener("click", function (e) {
                e.preventDefault();
                var apiKey = TravelAPI.getApiKey();
                if (confirm("Are you sure you want to log out?")) {
                    if (apiKey) {
                        TravelAPI.logout(apiKey, function (err, response) {
                            clearAllApiKeys();
                            updateNavVisibility();
                            window.location.href = "traveller_login.php";
                        });
                    } else {
                        clearAllApiKeys();
                        updateNavVisibility();
                        window.location.href = "traveller_login.php";
                    }
                }
            });
        }
    }

    function setupBrandLink() {
        var logo = document.getElementById("nav-pic");
        if (logo) {
            logo.addEventListener("click", function (e) {
                e.preventDefault();
                if (isLoggedIn()) {
                    window.location.href = "packages.php";
                } else {
                    window.location.href = "traveller_login.php";
                }
            });
        }
    }

    function init() {
        updateNavVisibility();
        setupLogout();
        setupBrandLink();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();