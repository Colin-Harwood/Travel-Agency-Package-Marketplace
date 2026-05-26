document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    var messageDiv = document.getElementById("bookingsMessage");
    var listContainer = document.getElementById("bookingsList");
    var modal = document.getElementById("bookingDetailModal");
    var modalClose = document.getElementById("modalClose");
    var modalContent = document.getElementById("modalDetailContent");

    function setMessage(msg, isError) {
        if (!messageDiv) return;
        messageDiv.textContent = msg || "";
        messageDiv.className = isError ? "packages-message error" : "packages-message";
        messageDiv.style.display = msg ? "block" : "none";
        if (!isError && msg) {
            setTimeout(function () {
                if (messageDiv) messageDiv.style.display = "none";
            }, 5000);
        }
    }

    function formatPrice(value) {
        var num = parseFloat(value || 0);
        if (isNaN(num)) num = 0;
        return num.toLocaleString("en-ZA", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }

    function escapeHtml(value) {
        return String(value === null || value === undefined ? "" : value).replace(/[&<>\"']/g, function (m) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;" }[m];
        });
    }

    function getStatusBadgeClass(status) {
        var s = String(status || "").toLowerCase();
        if (s === "confirmed") return "status-confirmed";
        if (s === "pending") return "status-pending";
        if (s === "cancelled") return "status-cancelled";
        if (s === "completed") return "status-completed";
        return "status-pending";
    }

    function canCancel(status) {
        var s = String(status || "").toLowerCase();
        return s !== "cancelled" && s !== "completed";
    }

    function getBookingsArray(response) {
        if (!response) return [];
        if (Array.isArray(response.data)) return response.data;
        if (response.data && Array.isArray(response.data.data)) return response.data.data;
        return [];
    }

    function getDisplayStatus(status) {
        if (!status) return "Pending";
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    }

    function renderBookings(bookings) {
        if (!bookings || bookings.length === 0) {
            return '<div class="empty-state">You have no active bookings. <a href="packages.php">Browse packages</a> to start your journey.</div>';
        }

        var html = "";
        for (var i = 0; i < bookings.length; i++) {
            var booking = bookings[i];
            var displayStatus = getDisplayStatus(booking.status);
            var statusClass = getStatusBadgeClass(booking.status);
            var cancelButton = canCancel(booking.status) ? '<button type="button" class="cancel-booking-btn" data-order-id="' + escapeHtml(booking.orderID) + '">Cancel booking</button>' : '';
            var viewDetailsButton = '<button type="button" class="view-details-btn" data-order-id="' + escapeHtml(booking.orderID) + '">View details</button>';

            html += '<article class="booking-card" data-order-id="' + escapeHtml(booking.orderID) + '">' +
                '<div class="booking-header">' +
                '<h3 class="booking-title">' + escapeHtml(booking.name || "Package booking") + '</h3>' +
                '<span class="status-badge ' + statusClass + '">' + escapeHtml(displayStatus) + '</span>' +
                '</div>' +
                '<p class="booking-description">' + escapeHtml(booking.description || "") + '</p>' +
                '<div class="booking-details">' +
                '<div class="detail-item"><strong>Order ID:</strong> #' + escapeHtml(booking.orderID) + '</div>' +
                '<div class="detail-item"><strong>Package type:</strong> ' + escapeHtml(booking.type || "") + '</div>' +
                '<div class="detail-item"><strong>Start date:</strong> ' + escapeHtml(booking.startDate || "") + '</div>' +
                '<div class="detail-item"><strong>Travellers:</strong> ' + escapeHtml(booking.numTravellers || "") + '</div>' +
                '<div class="detail-item"><strong>Duration:</strong> ' + escapeHtml(booking.duration || "") + ' days</div>' +
                '<div class="detail-item"><strong>Total price:</strong> ZAR ' + formatPrice(booking.totalPrice) + '</div>' +
                '<div class="detail-item"><strong>Price per person:</strong> ZAR ' + formatPrice(booking.pricePerPerson) + '</div>' +
                '</div>' +
                '<div class="booking-actions">' + cancelButton + viewDetailsButton + '<a href="package_view.php?id=' + encodeURIComponent(booking.packageID) + '" class="view-package-link">View package</a></div>' +
                '</article>';
        }
        return html;
    }

    function attachHandlers() {
        var cancelBtns = document.querySelectorAll(".cancel-booking-btn");
        for (var i = 0; i < cancelBtns.length; i++) {
            cancelBtns[i].onclick = function (e) {
                e.preventDefault();
                var orderId = this.getAttribute("data-order-id");
                if (window.confirm("Are you sure you want to cancel this booking?")) {
                    cancelBooking(orderId);
                }
            };
        }

        var detailBtns = document.querySelectorAll(".view-details-btn");
        for (var j = 0; j < detailBtns.length; j++) {
            detailBtns[j].onclick = function (e) {
                e.preventDefault();
                var orderId = this.getAttribute("data-order-id");
                showBookingDetails(orderId);
            };
        }
    }

    function cancelBooking(orderId) {
        setMessage("Cancelling booking...", false);
        TravelAPI.cancelBooking(orderId, function (err, response) {
            if (err) {
                setMessage(err.message, true);
                return;
            }
            if (!response || String(response.status).toLowerCase() !== "success") {
                setMessage((response && response.data) || "Cancellation failed.", true);
                return;
            }

            setMessage(response.data || "Booking cancelled successfully.", false);

            var bookingCard = document.querySelector('.booking-card[data-order-id="' + orderId + '"]');
            if (bookingCard) {
                bookingCard.remove();
            }

            var remainingBookings = document.querySelectorAll('.booking-card');
            if (remainingBookings.length === 0) {
                listContainer.innerHTML = '<div class="empty-state">You have no active bookings. <a href="packages.php">Browse packages</a> to start your journey.</div>';
            }

            if (modal) {
                modal.style.display = "none";
            }
        });
    }

    function showBookingDetails(orderId) {
        var apiKey = TravelAPI.getApiKey();
        if (!apiKey) {
            setMessage("Please log in first.", true);
            return;
        }

        if (!modal || !modalContent) return;

        modal.style.display = "block";

        TravelAPI.getSingleBooking(orderId, function (err, response) {
            if (err) {
                modalContent.innerHTML = '<div class="error-details">' + escapeHtml(err.message) + '</div>';
                return;
            }

            if (response && response.status === "success") {
                renderBookingDetails(response.data);
            } else {
                var errorMsg = (response && response.data) || "Failed to load booking details.";
                modalContent.innerHTML = '<div class="error-details">' + escapeHtml(errorMsg) + '</div>';
            }
        });
    }

    function renderBookingDetails(booking) {
        if (!booking) {
            modalContent.innerHTML = '<div class="error-details">No booking data found.</div>';
            return;
        }

        var displayStatus = getDisplayStatus(booking.status);
        var statusClass = getStatusBadgeClass(booking.status);
        var canCancelBooking = canCancel(booking.status);
        var agencyLocation = [];
        if (booking.street) agencyLocation.push(booking.street);
        if (booking.suburb) agencyLocation.push(booking.suburb);
        if (booking.city) agencyLocation.push(booking.city);
        if (booking.country) agencyLocation.push(booking.country);
        var agencyAddress = agencyLocation.join(", ");

        var html = '' +
            '<div class="detail-header">' +
            '<h2>' + escapeHtml(booking.name || "Package Booking") + '</h2>' +
            '<span class="status-badge ' + statusClass + '">' + escapeHtml(displayStatus) + '</span>' +
            '</div>' +
            '<div class="detail-section">' +
            '<h3>Order Information</h3>' +
            '<div class="detail-grid">' +
            '<div class="detail-row"><strong>Order ID:</strong> #' + escapeHtml(booking.orderID) + '</div>' +
            '<div class="detail-row"><strong>Start Date:</strong> ' + escapeHtml(booking.startDate || "Not specified") + '</div>' +
            '<div class="detail-row"><strong>Number of Travellers:</strong> ' + escapeHtml(booking.numTravellers || "0") + '</div>' +
            '<div class="detail-row"><strong>Total Price:</strong> ZAR ' + formatPrice(booking.totalPrice) + '</div>' +
            '<div class="detail-row"><strong>Price per Person:</strong> ZAR ' + formatPrice(booking.pricePerPerson) + '</div>' +
            '<div class="detail-row"><strong>Duration:</strong> ' + escapeHtml(booking.duration || "0") + ' days</div>' +
            '<div class="detail-row"><strong>Package Type:</strong> ' + escapeHtml(booking.type || "Not specified") + '</div>' +
            '</div>' +
            '</div>' +
            '<div class="detail-section">' +
            '<h3>Package Description</h3>' +
            '<p>' + escapeHtml(booking.description || "No description available.") + '</p>' +
            '</div>' +
            '<div class="detail-section">' +
            '<h3>Agency Contact Details</h3>' +
            '<div class="detail-grid">' +
            '<div class="detail-row"><strong>Agency:</strong> ' + escapeHtml(booking.name || "Not specified") + '</div>' +
            '<div class="detail-row"><strong>Address:</strong> ' + escapeHtml(agencyAddress || "Not specified") + '</div>' +
            '</div>' +
            '</div>' +
            '<div class="detail-section">' +
            '<h3>Destination</h3>' +
            '<div class="detail-grid">' +
            '<div class="detail-row"><strong>Destination ID:</strong> ' + escapeHtml(booking.destinationID || "Not specified") + '</div>' +
            '</div>' +
            '</div>' +
            '<div class="detail-actions">' +
            (canCancelBooking ? '<button type="button" class="cancel-booking-detail" data-order-id="' + escapeHtml(booking.orderID) + '">Cancel this booking</button>' : '<span class="cancelled-message">This booking has been cancelled</span>') +
            '<a href="package_view.php?id=' + encodeURIComponent(booking.packageID) + '" class="view-package-detail">View full package details</a>' +
            '</div>';

        modalContent.innerHTML = html;

        if (canCancelBooking) {
            var cancelDetailBtn = document.querySelector(".cancel-booking-detail");
            if (cancelDetailBtn) {
                cancelDetailBtn.onclick = function () {
                    var orderId = this.getAttribute("data-order-id");
                    if (window.confirm("Are you sure you want to cancel this booking?")) {
                        if (modal) modal.style.display = "none";
                        cancelBooking(orderId);
                    }
                };
            }
        }
    }

    function closeModal() {
        if (modal) modal.style.display = "none";
    }

    function loadBookings() {
        var apiKey = TravelAPI.getApiKey();
        if (!apiKey) {
            setMessage("Please log in as a traveller first.", true);
            listContainer.innerHTML = '<div class="empty-state">Please <a href="traveller_login.php">login</a> to continue.</div>';
            return;
        }

        listContainer.innerHTML = '<div class="loading">Loading bookings...</div>';

        TravelAPI.getUserBookings(function (err, response) {
            if (err) {
                setMessage(err.message, true);
                listContainer.innerHTML = "";
                return;
            }
            if (!response || String(response.status).toLowerCase() !== "success") {
                setMessage((response && response.data) || "Failed to load bookings.", true);
                listContainer.innerHTML = "";
                return;
            }

            var bookings = getBookingsArray(response);
            listContainer.innerHTML = renderBookings(bookings);
            attachHandlers();
        });
    }

    if (modalClose) modalClose.onclick = closeModal;
    window.onclick = function (e) {
        if (e.target === modal) closeModal();
    };

    loadBookings();
});