const API_URL = "http://localhost/COS-221-PA5/Travel-Agency-Package-Marketplace/backend/Agency_code/agencyAPI.php";//api url
// on load of the HTML page
document.addEventListener("DOMContentLoaded", function () {
    loadDashboardStats();
    const refreshButton = document.querySelector(".small-icon");
    if (refreshButton) {
        refreshButton.addEventListener("click", function () {
            loadDashboardStats();
        });
    }
});
// fetch the stats from the api to load in the dachboard
function loadDashboardStats() {
    const messageBox = document.getElementById("messageBox");
    messageBox.textContent = "";
    messageBox.className = "";
    const agencyID = localStorage.getItem("agencyID") || localStorage.getItem("userID");//uses agency ID to send to API
    //const agencyID = 11;// HARD CODE FOR TESTING

    if (!agencyID) {
        messageBox.textContent = "No agency ID found. Please log in again.";
        messageBox.className = "error";
        return;
    }
    // the API req
    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            action: "get_dashboard_stats",
            agencyID: parseInt(agencyID)
        })
    })
    .then(function (res) {
        return res.json();
    })
    .then(function (data) {
        if (data.status === "success") {
            updateDashboard(data.data);
            messageBox.textContent = "Analytics loaded successfully.";
            messageBox.className = "success";
        } else {
            messageBox.textContent = data.message || "Could not load analytics.";
            messageBox.className = "error";
        }
    })
    .catch(function (err) {
        messageBox.textContent = "Server error while loading analytics.";
        messageBox.className = "error";
        console.error(err);
    });
}
// Update the dashboard based on the data gotten form the API
function updateDashboard(stats) {
    const totalPackages = Number(stats.totalPackages) || 0;
    const activePackages = Number(stats.activePackages) || 0;
    const totalOrders = Number(stats.totalOrders) || 0;
    const confirmedOrders = Number(stats.confirmedOrders) || 0;
    const totalRevenue = Number(stats.totalRevenue) || 0;
    const averageRating = Number(stats.averageRating) || 0;
    const totalReviews = Number(stats.totalReviews) || 0;

    document.getElementById("totalPackages").textContent = totalPackages;
    document.getElementById("activePackages").textContent = activePackages;
    document.getElementById("totalOrders").textContent = totalOrders;
    document.getElementById("confirmedOrders").textContent = confirmedOrders;
    document.getElementById("totalRevenue").textContent = formatMoney(totalRevenue);
    document.getElementById("averageRating").textContent = averageRating.toFixed(2);
    document.getElementById("totalReviews").textContent = totalReviews;

    document.getElementById("confirmedOrdersCenter").textContent = confirmedOrders;

    updateOrderDonut(totalOrders, confirmedOrders);
    updateProgressBars(totalPackages, activePackages, totalOrders, confirmedOrders);
}
// update the donut with starts
function updateOrderDonut(totalOrders, confirmedOrders) {
    const ordersDonut = document.getElementById("ordersDonut");
    let confirmedPercentage = 0;
    if (totalOrders > 0) {
        confirmedPercentage = confirmedOrders / totalOrders;
    }
    const degrees = confirmedPercentage * 360;
    ordersDonut.style.background ="conic-gradient(var(--dark-pink) 0deg " +degrees +"deg, var(--light-pink) " +degrees +"deg 360deg)";//to displaty the wheel donut stats
}
//progress bar udate
function updateProgressBars(totalPackages, activePackages, totalOrders, confirmedOrders) {
    const packageProgress = document.getElementById("packageProgress");
    const orderProgress = document.getElementById("orderProgress");
    const packageActivityText = document.getElementById("packageActivityText");
    const orderRateText = document.getElementById("orderRateText");
    let packagePercentage = 0;
    let orderPercentage = 0;
    if (totalPackages > 0) {
        packagePercentage = (activePackages / totalPackages) * 100;
    }
    if (totalOrders > 0) {
        orderPercentage = (confirmedOrders / totalOrders) * 100;
    }
    packageProgress.style.width = packagePercentage + "%";
    orderProgress.style.width = orderPercentage + "%";
    packageActivityText.textContent =activePackages + " of " + totalPackages + " packages are active";
    orderRateText.textContent =confirmedOrders + " of " + totalOrders + " orders are confirmed";
}
// currency
function formatMoney(amount) {
    return "R" + amount.toLocaleString("en-ZA", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}