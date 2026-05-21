<?php
    require_once "layout.php";
    protectAgencyPage(); // stop users from accessing this page if they are not logged in
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tripistry | Analytics</title>

    <link rel="stylesheet" href="../CSS-agency/layout.css">
    <link rel="stylesheet" href="../CSS-agency/analyticsAgency.css">
</head>
<body>
    <?php renderHeader("Agency Analytics"); ?>

    <main>
        <section class="analytics-container">
            <div class="page-heading">
                <h1>Analytics Dashboard</h1>
                <p>View your agency package performance, orders, revenue, and customer feedback.</p>
            </div>

            <p id="messageBox"></p>

            <section class="dashboard-grid">
                <div class="analytics-card large-card">
                    <div class="card-title">Revenue Overview</div>
                    <div class="main-stat" id="totalRevenue">R0.00</div>
                    <p class="card-subtitle">Total revenue from confirmed and completed orders</p>
                    <div class="mini-line"></div>
                </div>

                <div class="analytics-card">
                    <div class="card-title">Total Packages</div>
                    <div class="stat-number" id="totalPackages">0</div>
                    <p class="card-subtitle">Packages created by your agency</p>
                </div>

                <div class="analytics-card">
                    <div class="card-title">Active Packages</div>
                    <div class="stat-number" id="activePackages">0</div>
                    <p class="card-subtitle">Currently active packages</p>
                </div>

                <div class="analytics-card chart-card">
                    <div class="card-title">Order Status</div>

                    <div class="donut-wrapper">
                        <div class="donut-chart" id="ordersDonut">
                            <div class="donut-center">
                                <span id="confirmedOrdersCenter">0</span>
                                <small>Confirmed</small>
                            </div>
                        </div>
                    </div>

                    <div class="legend">
                        <div><span class="legend-dot confirmed"></span>Confirmed Orders</div>
                        <div><span class="legend-dot other"></span>Other Orders</div>
                    </div>
                </div>

                <div class="analytics-card">
                    <div class="card-title">Total Orders</div>
                    <div class="stat-number" id="totalOrders">0</div>
                    <p class="card-subtitle">All customer orders</p>
                </div>

                <div class="analytics-card">
                    <div class="card-title">Confirmed Orders</div>
                    <div class="stat-number" id="confirmedOrders">0</div>
                    <p class="card-subtitle">Orders with confirmed status</p>
                </div>

                <div class="analytics-card rating-card">
                    <div class="card-title">Average Rating</div>
                    <div class="rating-circle">
                        <span id="averageRating">0.00</span>
                    </div>
                    <p class="card-subtitle">Average package review score</p>
                </div>

                <div class="analytics-card">
                    <div class="card-title">Total Reviews</div>
                    <div class="stat-number" id="totalReviews">0</div>
                    <p class="card-subtitle">Reviews received from customers</p>
                </div>
            </section>

            <section class="form-section summary-section">
                <div class="section-header">
                    <input type="text" value="Agency Performance Summary" readonly>
                    <button type="button" class="small-icon">↻</button>
                </div>

                <div class="summary-grid">
                    <div class="summary-item">
                        <label>Package Activity</label>
                        <div class="progress-bar">
                            <div id="packageProgress" class="progress-fill"></div>
                        </div>
                        <p id="packageActivityText">0 of 0 packages are active</p>
                    </div>

                    <div class="summary-item">
                        <label>Order Confirmation Rate</label>
                        <div class="progress-bar">
                            <div id="orderProgress" class="progress-fill"></div>
                        </div>
                        <p id="orderRateText">0 of 0 orders are confirmed</p>
                    </div>
                </div>
            </section>
        </section>
    </main>

    <?php renderFooter(); ?>

    <script src="../JS-agency/analyticsAgency.js"></script>
</body>
</html>