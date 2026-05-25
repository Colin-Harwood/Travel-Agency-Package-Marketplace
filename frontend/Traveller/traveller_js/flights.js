document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    var tbody = document.getElementById("flightsTableBody");
    var messageDiv = document.getElementById("flightsMessage");
    var filterAirline = document.getElementById("filterAirline");
    var filterDepAirport = document.getElementById("filterDepAirport");
    var filterArrAirport = document.getElementById("filterArrAirport");
    var minPriceInput = document.getElementById("minPrice");
    var maxPriceInput = document.getElementById("maxPrice");
    var departureAfter = document.getElementById("departureAfter");
    var departureBefore = document.getElementById("departureBefore");
    var applyBtn = document.getElementById("applyFiltersBtn");
    var resetBtn = document.getElementById("resetFiltersBtn");

    var allFlights = [];
    var currentSort = { column: "departureTime", direction: "asc" };
    var modal = document.getElementById("packageModal");
    var modalList = document.getElementById("modalPackagesList");
    var closeModalSpan = document.querySelector(".modal-close");

    function setMessage(msg, isError) {
        if (!messageDiv) return;
        messageDiv.textContent = msg || "";
        messageDiv.className = isError ? "flights-message error" : "flights-message";
        messageDiv.style.display = msg ? "block" : "none";
        if (!isError && msg) {
            setTimeout(function () {
                if (messageDiv) messageDiv.style.display = "none";
            }, 5000);
        }
    }

    function escapeHtml(str) {
        if (!str) return "";
        return String(str).replace(/[&<>"']/g, function (m) {
            if (m === "&") return "&amp;";
            if (m === "<") return "&lt;";
            if (m === ">") return "&gt;";
            if (m === '"') return "&quot;";
            return "&#039;";
        });
    }

    function formatPrice(value) {
        var num = parseFloat(value || 0);
        if (isNaN(num)) num = 0;
        return num.toLocaleString("en-ZA", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }

    function formatDateTime(datetime) {
        if (!datetime) return "";
        var date = new Date(datetime);
        if (isNaN(date.getTime())) return datetime;
        return date.toLocaleDateString("en-ZA", {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }) + " at " + date.toLocaleTimeString("en-ZA", {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function renderTable() {
        var html = "";
        var i, f;

        if (!allFlights || allFlights.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="loading">No flights match your filters.</td></tr>';
            return;
        }

        for (i = 0; i < allFlights.length; i++) {
            f = allFlights[i];
            var packageCount = (f.packages && f.packages.length) ? f.packages.length : 0;
            html += '<tr>' +
                '<td>' + escapeHtml(f.airline) + '</td>' +
                '<td>' + escapeHtml(f.flightNumber) + '</td>' +
                '<td>' + escapeHtml(f.departureAirport) + '</td>' +
                '<td>' + escapeHtml(f.arrivalAirport) + '</td>' +
                '<td>' + escapeHtml(formatDateTime(f.departureTime)) + '</td>' +
                '<td>' + escapeHtml(formatDateTime(f.arrivalTime)) + '</td>' +
                '<td class="price-cell">ZAR ' + formatPrice(f.price) + '</td>' +
                '<td><button class="view-packages-btn" data-flight-id="' + escapeHtml(f.flightID) + '">View packages (' + packageCount + ')</button></td>' +
                '</tr>';
        }

        tbody.innerHTML = html;

        var btns = document.querySelectorAll(".view-packages-btn");
        for (i = 0; i < btns.length; i++) {
            btns[i].addEventListener("click", function (e) {
                var flightId = this.getAttribute("data-flight-id");
                showPackagesForFlight(flightId);
            });
        }
    }

    function sortFlights() {
        if (!allFlights.length) return;

        allFlights.sort(function (a, b) {
            var valA, valB;
            if (currentSort.column === "price") {
                valA = parseFloat(a.price);
                valB = parseFloat(b.price);
            } else if (currentSort.column === "departureTime" || currentSort.column === "arrivalTime") {
                valA = new Date(a[currentSort.column]);
                valB = new Date(b[currentSort.column]);
            } else {
                valA = (a[currentSort.column] || "").toLowerCase();
                valB = (b[currentSort.column] || "").toLowerCase();
            }
            if (valA < valB) return currentSort.direction === "asc" ? -1 : 1;
            if (valA > valB) return currentSort.direction === "asc" ? 1 : -1;
            return 0;
        });

        renderTable();
    }

    function populateAirlineFilter(flights) {
        if (!flights || flights.length === 0 || !filterAirline) return;

        var airlines = {};
        for (var i = 0; i < flights.length; i++) {
            airlines[flights[i].airline] = true;
        }

        var current = filterAirline.value;
        var opts = '<option value="">All airlines</option>';
        var keys = Object.keys(airlines).sort();
        for (var j = 0; j < keys.length; j++) {
            opts += '<option value="' + escapeHtml(keys[j]) + '">' + escapeHtml(keys[j]) + '</option>';
        }
        filterAirline.innerHTML = opts;
        if (current && airlines[current]) filterAirline.value = current;
        else filterAirline.value = "";
    }

    function populateAirportFilters(flights) {
        if (!flights || flights.length === 0) return;

        var depAirports = {};
        var arrAirports = {};

        for (var i = 0; i < flights.length; i++) {
            depAirports[flights[i].departureAirport] = true;
            arrAirports[flights[i].arrivalAirport] = true;
        }

        function fillSelect(select, valuesObj, label) {
            if (!select) return;
            var current = select.value;
            var opts = '<option value="">All ' + label + '</option>';
            var keys = Object.keys(valuesObj).sort();
            for (var j = 0; j < keys.length; j++) {
                opts += '<option value="' + escapeHtml(keys[j]) + '">' + escapeHtml(keys[j]) + '</option>';
            }
            select.innerHTML = opts;
            if (current && valuesObj[current]) select.value = current;
            else select.value = "";
        }

        fillSelect(filterDepAirport, depAirports, "airports");
        fillSelect(filterArrAirport, arrAirports, "airports");
    }

    function loadFlights() {
        var apiKey = TravelAPI.getApiKey();
        if (!apiKey) {
            setMessage("Please log in to view flights.", true);
            tbody.innerHTML = '<tr><td colspan="8" class="loading">Please <a href="traveller_login.php">login</a> to continue.</td></tr>';
            return;
        }

        var airline = filterAirline ? filterAirline.value.trim() : "";
        var minPrice = minPriceInput && minPriceInput.value ? parseFloat(minPriceInput.value) : 0;
        var maxPrice = maxPriceInput && maxPriceInput.value ? parseFloat(maxPriceInput.value) : 0;
        var startDate = departureAfter && departureAfter.value ? departureAfter.value : "";
        var endDate = departureBefore && departureBefore.value ? departureBefore.value : "";

        var depAirport = filterDepAirport ? filterDepAirport.value.trim() : "";
        var arrAirport = filterArrAirport ? filterArrAirport.value.trim() : "";

        setMessage("Loading flights...", false);
        tbody.innerHTML = '<tr><td colspan="8" class="loading">Fetching flight data...</td></tr>';

        TravelAPI.getAllFlights({
            airline: airline,
            minPrice: minPrice,
            maxPrice: maxPrice,
            startDate: startDate,
            endDate: endDate
        }, function (err, response) {
            if (err) {
                setMessage(err.message, true);
                tbody.innerHTML = '<tr><td colspan="8" class="loading">Failed to load flights.</td></tr>';
                return;
            }

            if (!response || response.status !== "success") {
                var errorMsg = response && response.data ? response.data : "Error loading flights.";
                setMessage(errorMsg, true);
                tbody.innerHTML = '<tr><td colspan="8" class="loading">' + escapeHtml(errorMsg) + '</td></tr>';
                return;
            }

            var flights = response.data;
            if (!flights || flights.length === 0) {
                setMessage("No flights available with the selected criteria.", false);
                allFlights = [];
                renderTable();
                return;
            }

            var filteredFlights = flights;
            if (depAirport) {
                filteredFlights = filteredFlights.filter(function (f) {
                    return f.departureAirport === depAirport;
                });
            }
            if (arrAirport) {
                filteredFlights = filteredFlights.filter(function (f) {
                    return f.arrivalAirport === arrAirport;
                });
            }

            allFlights = filteredFlights;

            populateAirlineFilter(flights);
            populateAirportFilters(flights);
            sortFlights();
            setMessage("", false);
        });
    }

    function showPackagesForFlight(flightId) {
        if (!modal || !modalList) return;

        var flight = null;
        for (var i = 0; i < allFlights.length; i++) {
            if (String(allFlights[i].flightID) === String(flightId)) {
                flight = allFlights[i];
                break;
            }
        }

        if (!flight || !flight.packages || flight.packages.length === 0) {
            modalList.innerHTML = '<p class="no-packages">No packages currently include this flight.</p>';
            modal.style.display = "block";
            return;
        }

        var html = '<ul class="package-list">';
        for (var j = 0; j < flight.packages.length; j++) {
            var p = flight.packages[j];
            html += '<li class="package-list-item">' +
                '<a href="package_view.php?id=' + escapeHtml(p.packageID) + '" class="package-link">' +
                '<strong>' + escapeHtml(p.name) + '</strong>' +
                '<span class="package-type">(' + escapeHtml(p.type) + ')</span>' +
                '</a>' +
                '<div class="package-details">' +
                '<span class="package-price">ZAR ' + formatPrice(p.pricePerPerson) + ' per person</span>' +
                '<span class="package-duration"> ' + escapeHtml(p.duration) + ' days</span>' +
                '</div>' +
                '</li>';
        }
        html += '</ul>';

        modalList.innerHTML = html;
        modal.style.display = "block";
    }

    function closeModal() {
        if (modal) modal.style.display = "none";
    }

    function initSorting() {
        var headers = document.querySelectorAll(".flights-table th[data-sort]");
        var i, th;

        for (i = 0; i < headers.length; i++) {
            th = headers[i];
            th.addEventListener("click", (function (column) {
                return function () {
                    if (currentSort.column === column) {
                        currentSort.direction = currentSort.direction === "asc" ? "desc" : "asc";
                    } else {
                        currentSort.column = column;
                        currentSort.direction = "asc";
                    }

                    var h;
                    for (h = 0; h < headers.length; h++) {
                        headers[h].classList.remove("sorted-asc", "sorted-desc");
                    }
                    this.classList.add(currentSort.direction === "asc" ? "sorted-asc" : "sorted-desc");
                    sortFlights();
                };
            })(th.getAttribute("data-sort")));
        }

        var defaultHeader = document.querySelector(".flights-table th[data-sort='departureTime']");
        if (defaultHeader) defaultHeader.classList.add("sorted-asc");
    }

    function resetFilters() {
        if (filterAirline) filterAirline.value = "";
        if (filterDepAirport) filterDepAirport.value = "";
        if (filterArrAirport) filterArrAirport.value = "";
        if (minPriceInput) minPriceInput.value = "";
        if (maxPriceInput) maxPriceInput.value = "";
        if (departureAfter) departureAfter.value = "";
        if (departureBefore) departureBefore.value = "";

        currentSort = { column: "departureTime", direction: "asc" };

        var headers = document.querySelectorAll(".flights-table th");
        for (var i = 0; i < headers.length; i++) {
            headers[i].classList.remove("sorted-asc", "sorted-desc");
        }
        var defaultHeader = document.querySelector(".flights-table th[data-sort='departureTime']");
        if (defaultHeader) defaultHeader.classList.add("sorted-asc");

        loadFlights();
        setMessage("Filters reset.", false);
    }

    if (applyBtn) applyBtn.addEventListener("click", loadFlights);
    if (resetBtn) resetBtn.addEventListener("click", resetFilters);

    if (filterAirline) filterAirline.addEventListener("change", loadFlights);
    if (filterDepAirport) filterDepAirport.addEventListener("change", loadFlights);
    if (filterArrAirport) filterArrAirport.addEventListener("change", loadFlights);

    if (closeModalSpan) closeModalSpan.onclick = closeModal;
    window.onclick = function (e) {
        if (e.target === modal) closeModal();
    };

    loadFlights();
    initSorting();
});