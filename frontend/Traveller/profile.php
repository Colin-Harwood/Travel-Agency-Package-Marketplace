<?php
$current_page = basename($_SERVER['PHP_SELF']);
include "header.php";
?>
<link rel="stylesheet" href="traveller_css/profile.css">
<main class="profile-wrapper">
    <div class="hero-section">
        <div class="hero-content">
            <h1>My Reviews</h1>
            <p>View and manage your reviews</p>
        </div>
    </div>

    <div class="reviews-section">
        <div class="section-header">
            <h2>Reviews I've Written</h2>
            <span class="review-count" id="reviewCount">0 reviews</span>
        </div>
        <div id="reviewsMessage" class="reviews-message" role="status"></div>
        <div class="reviews-grid" id="reviewsGrid">
            <div class="loading-state">Loading your reviews...</div>
        </div>
    </div>
</main>

<div id="deleteModal" class="modal">
    <div class="modal-content">
        <span class="modal-close">&times;</span>
        <h3>Delete Review</h3>
        <p>Are you sure you want to delete this review? This action cannot be undone.</p>
        <div class="modal-buttons">
            <button id="confirmDeleteBtn" class="btn-delete">Delete Review</button>
            <button id="cancelDeleteBtn" class="btn-cancel">Cancel</button>
        </div>
    </div>
</div>

<script src="traveller_js/api.js"></script>
<script src="traveller_js/profile.js"></script>
</body>
</html>