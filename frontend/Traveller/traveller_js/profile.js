document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    var messageDiv = document.getElementById("reviewsMessage");
    var reviewsGrid = document.getElementById("reviewsGrid");
    var reviewCountSpan = document.getElementById("reviewCount");

    var deleteModal = document.getElementById("deleteModal");
    var confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
    var cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
    var closeModalSpan = deleteModal ? deleteModal.querySelector(".modal-close") : null;

    var currentUserReviews = [];
    var pendingDeleteReviewId = null;

    function setMessage(msg, isError) {
        if (!messageDiv) return;
        messageDiv.textContent = msg || "";
        messageDiv.className = isError ? "reviews-message error" : "reviews-message";
        messageDiv.style.display = msg ? "block" : "none";
        if (!isError && msg) {
            setTimeout(function () {
                if (messageDiv && messageDiv.style.display === "block") {
                    messageDiv.style.display = "none";
                }
            }, 5000);
        }
    }

    function escapeHtml(value) {
        return String(value === null || value === undefined ? "" : value).replace(/[&<>"']/g, function (m) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m];
        });
    }

    function formatDate(dateString) {
        if (!dateString) return "Unknown date";
        var date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return date.toLocaleDateString("en-ZA", {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function renderStars(rating) {
        var fullStars = Math.floor(rating);
        var emptyStars = 5 - fullStars;
        var stars = "";
        for (var i = 0; i < fullStars; i++) stars += "&#9733;";
        for (var i = 0; i < emptyStars; i++) stars += "&#9734;";
        return stars;
    }

    function renderReviews() {
        if (!currentUserReviews || currentUserReviews.length === 0) {
            if (reviewsGrid) {
                reviewsGrid.innerHTML = '<div class="empty-state">You haven\'t written any reviews yet. <a href="packages.php">Browse packages</a> to share your experience.</div>';
            }
            if (reviewCountSpan) reviewCountSpan.textContent = "0 reviews";
            return;
        }
        if (reviewCountSpan) {
            reviewCountSpan.textContent = currentUserReviews.length + " " + (currentUserReviews.length === 1 ? "review" : "reviews");
        }
        var html = "";
        for (var i = 0; i < currentUserReviews.length; i++) {
            var review = currentUserReviews[i];
            var stars = renderStars(review.rating);
            var dateFormatted = formatDate(review.date);
            var packageName = "Package #" + review.packageID;
            var packageLink = "package_view.php?id=" + encodeURIComponent(review.packageID);
            var comment = review.comment || "No comment provided.";
            html += '' +
                '<div class="review-card" data-review-id="' + escapeHtml(review.reviewID) + '">' +
                '<div class="review-header">' +
                '<a href="' + packageLink + '" class="review-package">' + escapeHtml(packageName) + '</a>' +
                '<div class="review-rating">' +
                '<span class="stars">' + stars + '</span>' +
                '<span class="rating-number">' + review.rating + '/5</span>' +
                '</div>' +
                '</div>' +
                '<p class="review-comment">' + escapeHtml(comment) + '</p>' +
                '<div class="review-footer">' +
                '<span class="review-date">' + dateFormatted + '</span>' +
                '<button class="delete-review-btn" data-review-id="' + escapeHtml(review.reviewID) + '">Delete review</button>' +
                '</div>' +
                '</div>';
        }

        if (reviewsGrid) {
            reviewsGrid.innerHTML = html;
        }

        var deleteBtns = document.querySelectorAll(".delete-review-btn");
        for (var j = 0; j < deleteBtns.length; j++) {
            deleteBtns[j].addEventListener("click", function (e) {
                e.stopPropagation();
                var reviewId = this.getAttribute("data-review-id");
                openDeleteModal(reviewId);
            });
        }
    }

    function loadUserReviews() {
        var apiKey = TravelAPI.getApiKey();
        if (!apiKey) {
            setMessage("Please log in to view your reviews.", true);
            if (reviewsGrid) {
                reviewsGrid.innerHTML = '<div class="empty-state">Please <a href="traveller_login.php">login</a> to view your reviews.</div>';
            }
            return;
        }
        if (reviewsGrid) {
            reviewsGrid.innerHTML = '<div class="loading-state">Loading your reviews...</div>';
        }
        TravelAPI.getAllReviews(function (err, response) {
            if (err) {
                setMessage(err.message, true);
                if (reviewsGrid) {
                    reviewsGrid.innerHTML = '<div class="empty-state">Failed to load reviews: ' + escapeHtml(err.message) + '</div>';
                }
                return;
            }
            if (!response || response.status !== "success") {
                var errorMsg = (response && response.message) || "Failed to load reviews.";
                setMessage(errorMsg, true);
                if (reviewsGrid) {
                    reviewsGrid.innerHTML = '<div class="empty-state">' + escapeHtml(errorMsg) + '</div>';
                }
                return;
            }
            currentUserReviews = response.data || [];
            renderReviews();
            setMessage("", false);
        });
    }

    function openDeleteModal(reviewId) {
        if (!deleteModal) return;
        pendingDeleteReviewId = reviewId;
        deleteModal.style.display = "flex";
    }

    function closeDeleteModal() {
        if (deleteModal) {
            deleteModal.style.display = "none";
        }
        pendingDeleteReviewId = null;
    }

    function deleteReview(reviewId) {
        setMessage("Deleting review...", false);
        TravelAPI.deleteReview(reviewId, function (err, response) {
            if (err) {
                setMessage(err.message, true);
                closeDeleteModal();
                return;
            }
            if (!response || response.status !== "success") {
                setMessage((response && response.message) || "Failed to delete review.", true);
                closeDeleteModal();
                return;
            }
            setMessage("Review deleted successfully.", false);
            for (var i = 0; i < currentUserReviews.length; i++) {
                if (String(currentUserReviews[i].reviewID) === String(reviewId)) {
                    currentUserReviews.splice(i, 1);
                    break;
                }
            }
            renderReviews();
            closeDeleteModal();
        });
    }

    function confirmDelete() {
        if (pendingDeleteReviewId) {
            deleteReview(pendingDeleteReviewId);
        } else {
            closeDeleteModal();
        }
    }

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener("click", confirmDelete);
    }

    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener("click", closeDeleteModal);
    }

    if (closeModalSpan) {
        closeModalSpan.addEventListener("click", closeDeleteModal);
    }

    window.addEventListener("click", function (e) {
        if (e.target === deleteModal) {
            closeDeleteModal();
        }
    });

    loadUserReviews();
});