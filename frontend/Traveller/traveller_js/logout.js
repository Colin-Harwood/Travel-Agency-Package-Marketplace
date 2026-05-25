(function() {
    "use strict";
    
    localStorage.removeItem("apiKey");
    localStorage.removeItem("apikey");
    localStorage.removeItem("travellerApiKey");
    sessionStorage.removeItem("apiKey");
    sessionStorage.removeItem("apikey");
    sessionStorage.removeItem("travellerApiKey");
    
    window.location.href = "traveller_login.php";
})();