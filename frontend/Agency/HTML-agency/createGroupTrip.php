<?php
    require_once "layout.php";
    protectAgencyPage();

    $agencyID = $_SESSION["userID"] ?? $_SESSION["agencyID"] ?? null;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tripistry | Create Group Trip</title>

    <link rel="stylesheet" href="../CSS-agency/layout.css">
    <link rel="stylesheet" href="../CSS-agency/createGroupTrip.css">
</head>
<body>
    <?php renderHeader("Create Group Trip"); ?>

    <main>
        <section class="package-container">
            <div class="page-heading">
                <h1>Create Group Trip</h1>
                <p>Create a group trip from one of your existing travel packages.</p>
            </div>

            <form id="createGroupTripForm" class="package-form">
                <div class="form-section">
                    <div class="section-header">
                        <input type="text" value="Group Trip Information" readonly>
                        <button type="button" class="small-icon">✎</button>
                    </div>

                    <div class="field-grid two-columns">
                        <div class="form-group">
                            <label for="packageID">Package</label>
                            <select id="packageID" name="packageID" required>
                                <option value="">Loading packages...</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="maxSize">Maximum Group Size</label>
                            <input type="number" id="maxSize" name="maxSize" min="1" required>
                        </div>

                        <div class="form-group">
                            <label for="tripDate">Trip Date</label>
                            <input type="date" id="tripDate" name="tripDate" required>
                        </div>

                      
                    </div>
                </div>

                <div class="form-section">
                    <div class="section-header">
                        <input type="text" value="Selected Package Details" readonly>
                        <button type="button" class="small-icon">✎</button>
                    </div>

                    <div class="field-grid two-columns">
                        <div class="form-group">
                            <label for="packageName">Package Name</label>
                            <input type="text" id="packageName" readonly>
                        </div>

                        <div class="form-group">
                            <label for="packagePrice">Price Per Person</label>
                            <input type="text" id="packagePrice" readonly>
                        </div>

                        <div class="form-group">
                            <label for="packageDuration">Duration Days</label>
                            <input type="text" id="packageDuration" readonly>
                        </div>

                        <div class="form-group">
                            <label for="packageStatus">Status</label>
                            <input type="text" id="packageStatus" readonly>
                        </div>

                        <div class="form-group full-width">
                            <label for="packageDescription">Description</label>
                            <textarea id="packageDescription" readonly></textarea>
                        </div>
                    </div>
                </div>

                <p id="messageBox"></p>

                <div class="form-actions">
                    <button type="reset" class="secondary-btn">Clear Form</button>
                    <button type="submit" class="primary-btn">Create Group Trip</button>
                </div>
            </form>
        </section>
    </main>

    <?php renderFooter(); ?>

    <script>
        const SESSION_AGENCY_ID = <?php echo json_encode($agencyID); ?>;
    </script>
    <script src="../JS-agency/createGroupTrip.js"></script>
</body>
</html>