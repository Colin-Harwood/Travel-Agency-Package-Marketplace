<?php
    require_once "layout.php";
    protectAgencyPage(); // stop users from accessing this page if they are not logged in
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tripistry | Create Package</title>

    <link rel="stylesheet" href="../CSS-agency/layout.css">
    <link rel="stylesheet" href="../CSS-agency/createPackage.css">
</head>
<body>
    <?php renderHeader("Create Package"); ?>

    <main>
        <section class="package-container">
            <div class="page-heading">
                <h1>Create Travel Package</h1>
                <p>Add a new travel package for your agency.</p>
            </div>

            <form id="createPackageForm" class="package-form">
                <div class="form-section">
                    <div class="section-header">
                        <input type="text" value="Basic Information" readonly>
                        <button type="button" class="small-icon">✎</button>
                    </div>

                    <div class="field-grid two-columns">
                        <div class="form-group">
                            <label for="name">Package Name</label>
                            <input type="text" id="name" name="name" placeholder="" required>
                        </div>

                        <div class="form-group">
                            <label for="packageType">Package Type</label>
                            <select id="packageType" name="packageType" required>
                                <option value="">Select package type</option>
                                <option value="Adventure">Adventure</option>
                                <option value="Cultural">Cultural</option>
                                <option value="Beach">Beach</option>
                                <option value="City">City</option>
                                <option value="Safari">Safari</option>
                                <option value="Ski">Ski</option>
                                <option value="Cruise">Cruise</option>
                                <option value="Wellness">Wellness</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="pricePerPerson">Price Per Person</label>
                            <input type="number" id="pricePerPerson" name="pricePerPerson" step="0.01" min="0" required>
                        </div>

                        <div class="form-group">
                            <label for="duration">Duration Days</label>
                            <input type="number" id="duration" name="duration" min="1" required>
                        </div>

                        <div class="form-group">
                            <label for="status">Status</label>
                            <select id="status" name="status" required>
                                <option value="Draft">Draft</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="destinationID">Destination</label>
                            <select id="destinationID" name="destinationID" required>
                                <option value="">Loading destinations...</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="form-section">
                    <div class="section-header">
                        <input type="text" value="Package Description" readonly>
                        <button type="button" class="small-icon">✎</button>
                    </div>

                    <div class="field-grid">
                        <div class="form-group full-width">
                            <label for="description">Description</label>
                            <textarea id="description" name="description" required></textarea>
                        </div>
                    </div>
                </div>

                <div class="form-section">
                    <div class="section-header">
                        <input type="text" value="Extras" readonly>
                        <button type="button" class="small-icon">✎</button>
                    </div>

                    <div class="field-grid two-columns">
                        <div class="form-group">
                            <label for="flightID">Flight</label>
                            <select id="flightID" name="flightID">
                                <option value="">Loading flights...</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="accommodationID">Accommodation</label>
                            <select id="accommodationID" name="accommodationID">
                                <option value="">Loading accommodations...</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="restaurantID">Restaurant</label>
                            <select id="restaurantID" name="restaurantID">
                                <option value="">Loading restaurants...</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="attractionID">Attraction</label>
                            <select id="attractionID" name="attractionID">
                                <option value="">Loading attractions...</option>
                            </select>
                        </div>
                    </div>
                </div>

                <p id="messageBox"></p>

                <div class="form-actions">
                    <button type="reset" class="secondary-btn">Clear Form</button>
                    <button type="submit" class="primary-btn">Create Package</button>
                </div>
            </form>
        </section>
    </main>

    <?php renderFooter(); ?>

    <script src="../JS-agency/createPackage.js"></script>
</body>
</html>