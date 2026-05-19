<?php

header("Content-Type: application/json");
require_once "config.php";

$data = json_decode(file_get_contents("php://input"), true);
if(!$data){
    $data = [];
}
$action = $data['action'] ?? '';

switch ($action){

    case 'create_package':
        createPackage($data, $conn);
        break;

    case 'get_agency_packages':
        getAgencyPackages($data, $conn);
        break;

    case 'get_package':
        getPackage($data, $conn);
        break;
    case 'update_package':
        updatePackage($data, $conn);
        break;
    case 'delete_package':
        deletePackage($data, $conn);
        break;
    case 'create_group_trip':
        createGroupTrip($data, $conn);
        break;
    case 'get_group_trips':
        getGroupTrips($data, $conn);
        break;
    case 'update_group_trip':
        updateGroupTrip($data, $conn);
        break;
    case 'delete_group_trip':
        deleteGroupTrip($data, $conn);
        break;
    case 'add_flight':
        addFlight($data, $conn);
        break;
    case 'remove_flight':
        removeFlight($data, $conn);
        break;
    case 'add_accommodation':
        addAccommodation($data, $conn);
        break;
    case 'remove_accommodation':
        removeAccommodation($data, $conn);
        break;
    case 'add_restaurant':
        addRestaurant($data, $conn);
        break;
    case 'remove_restaurant':
        removeRestaurant($data, $conn);
        break;
    case 'add_attraction':
        addAttraction($data, $conn);
        break;
    case 'remove_attraction':
        removeAttraction($data, $conn);
        break;
    case 'get_orders':
        getOrders($data, $conn);
        break;
    case 'get_reviews':
        getReviews($data, $conn);
        break;
    case 'get_dashboard_stats':
        getDashboardStats($data, $conn);
        break;
    case 'get_destinations':
        getDestinations($conn);
        break;
    case 'get_attractions':
        getAttractions($conn);
        break;
    case 'get_flights':
        getFlights($conn);
        break;
    case 'get_accommodations':
        getAccommodations($conn);
        break;
    case 'get_restaurants':
        getRestaurants($conn);
        break;
        

    default:
        errorResponse("Invalid API action", 400);
        break;


}




function successResponse($responseData){
    echo json_encode([
    "status" => "success",
    "timestamp" => time(),
    "data" => $responseData
]);
exit();

}
function errorResponse($message, $code = 400){
    http_response_code($code);
    echo json_encode([
    "status" => "error",
    "timestamp" => time(),
    "data" => $message
    
]);
exit();

}
function validateAgencyID($conn, $agencyID){
    if(!$agencyID) return false;

    $stmt = $conn->prepare("SELECT 1 FROM TRAVEL_AGENCY WHERE userID = ?");
    $stmt->bind_param("i", $agencyID);
    $stmt->execute();
    $stmt->store_result();

    return $stmt->num_rows > 0;


}

function validatePackageID($conn, $packageID){
    if(!$packageID) return false;

    $stmt = $conn->prepare("SELECT 1 FROM PACKAGE WHERE packageID = ?");
    $stmt->bind_param("i", $packageID);
    $stmt->execute();
    $stmt->store_result();

    return $stmt->num_rows > 0;

}
function validateGroupTripID($conn, $tripID){
    if(!$tripID){
        return false;
    }

    $stmt = $conn->prepare(
        "SELECT 1 FROM GROUP_TRIP
        WHERE tripID = ?"
    );
    $stmt->bind_param("i", $tripID);
    $stmt->execute();
    $stmt->store_result();

    return $stmt->num_rows > 0;
}

function addRelationship($conn, $table, $columns, $types, $values, $successMessage){
    $where = [];
    foreach ($columns as $column){
        $where[] = "$column = ?";
    }

    $checkSql = "SELECT 1 FROM $table WHERE " . implode(" AND ", $where);
    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->bind_param($types, ...$values);
    $checkStmt->execute();
    $checkStmt->store_result();

    if($checkStmt->num_rows > 0){
        errorResponse("Relationship already exists.");
    }

    $sql = "INSERT INTO $table (" .implode(", ", $columns). ")
    VALUES (" .implode(", ", array_fill(0, count($columns), "?")) . ")";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$values);

    if(!$stmt->execute()){
        errorResponse("Database error: " . $stmt->error, 500);
    }

    successResponse([
        "message" => $successMessage
    ]);
}

function removeRelationship($conn, $table, $columns, $types, $values, $successMessage){
    $where = [];
    foreach ($columns as $column){
        $where[] = "$column = ?";
    }

    $sql = "DELETE FROM $table WHERE " . implode(" AND ", $where);

    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$values);

    if(!$stmt->execute()){
        errorResponse("Database error: " . $stmt->error, 500);
    }

    if($stmt->affected_rows === 0){
        errorResponse("Relationship not found.", 404);
    }

    successResponse([
        "message" => $successMessage
    ]);
}

function createPackage($data, $conn){
    $agencyID = $data['agencyID'] ??'';
    $name = $data['name'] ??'';
    $packageType = $data['packageType'] ??'';
    $description = $data['description'] ??'';
    $pricePerPerson = $data['pricePerPerson'] ??'';
    $duration = $data['duration'] ??'';
    $destinationID = $data['destinationID'] ??'';

    if(!$agencyID || !$name || !$packageType || !$description || !$pricePerPerson || !$duration || !$destinationID){
        errorResponse("Missing Fields", 400);
        
    }

    if(!validateAgencyID($conn, $agencyID)){
        errorResponse("Invalid agencyID.", 404);
    }

    $sql = "INSERT INTO PACKAGE (agencyID, name, type, description, pricePerPerson, duration, destinationID)
    VALUES (?, ?, ?, ?, ?, ?, ?)";




    $stmt = $conn->prepare($sql);
    $stmt->bind_param("isssdii", 
    $agencyID, $name, $packageType, $description, $pricePerPerson, $duration, $destinationID);
    if(!$stmt->execute()){
        errorResponse("Failed to create package: ". $stmt->error, 500);
    }

    successResponse([
        "message" => "Package created successfully.",
        "packageID" => $conn->insert_id
    ]);
}



function getAgencyPackages($data, $conn){
    $agencyID = $data['agencyID'] ?? null;

    if(!$agencyID){
        errorResponse("agencyID is required.", 400);
        return;
    }

    if(!validateAgencyID($conn, $agencyID)){
        errorResponse("not a valid ID", 401);
        return;
    }

    $stmt = $conn->prepare("SELECT * FROM PACKAGE WHERE agencyID = ? ORDER BY packageID DESC" );
    $stmt->bind_param("i", $agencyID);
    $stmt->execute();
    $result = $stmt->get_result();

    $packages = [];
    while($row = $result->fetch_assoc()){
        $packages[] = $row;


    }
    successResponse($packages);

}

function getPackage($data, $conn){
    $packageID = $data['packageID'] ??'';

    if(!$packageID){
        errorResponse("missing field", 400);
        return;
    }

    if(!validatePackageID($conn, $packageID)){
        errorResponse("not a valid ID", 404);
        return;
    }

    $stmt = $conn->prepare("SELECT * FROM PACKAGE WHERE packageID = ?" );
    $stmt->bind_param("i", $packageID);
    $stmt->execute();
    $result = $stmt->get_result();

    $package = $result->fetch_assoc();
    
    


    
    successResponse($package);

}

function updatePackage($data, $conn){
    $packageID = $data['packageID'] ?? null;
    $packageType = $data['packageType'] ?? null;
    $name = $data['name'] ?? null;
    $description = $data['description'] ?? null;
    $pricePerPerson = $data['pricePerPerson'] ?? null;
    $status = $data['status'] ?? null;
    $duration = $data['duration'] ?? null;
    $destinationID = $data['destinationID'] ?? null;

    if(!$packageID || !$packageType || !$name || $pricePerPerson === null || !$status || !$duration || !$destinationID){
        errorResponse("Missing required fields.");
    }

    if(!validatePackageID($conn, $packageID)){
        errorResponse("Invalid packageID.", 404);
    }

    $sql = "UPDATE PACKAGE 
    SET type=?,
    name = ?,
    description = ?,
    pricePerPerson = ?,
    status = ?,
    duration = ?,
    destinationID = ?
    WHERE packageID = ?
    ";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param(
        "sssdsiii",
        $packageType,
        $name,
        $description,
        $pricePerPerson,
        $status,
        $duration,
        $destinationID,
        $packageID
    );

    if(!$stmt->execute()){
        errorResponse("Failed to update package: " . $stmt->error, 500);
    }


    successResponse([
        "message" => "Package updated successfully."
    ]);
        
}
/* might need to add package ID to traveller group trip*/
function deletePackage($data, $conn){
    $packageID = $data['packageID'] ?? null;

    if(!$packageID){
        errorResponse("packageID is required.");
    }

    if(!validatePackageID($conn, $packageID)){
        errorResponse("Invalid packageID.", 404);
    }

    $conn->begin_transaction();

    try{
        

        $tables = [
            "PACKAGE_FLIGHT",
            "PACKAGE_ACCOMMODATION",
            "PACKAGE_RESTAURANT",
            "PACKAGE_ATTRACTION",
            "GROUP_TRIP",
            "REVIEW",
            "`ORDER`"
        ];

        foreach ($tables as $table){
            $stmt = $conn->prepare("DELETE FROM $table WHERE packageID = ?");
            if($stmt){
                $stmt->bind_param("i", $packageID);
                $stmt->execute();
            }
            
        }

        $stmt = $conn->prepare("DELETE FROM PACKAGE WHERE packageID = ?");
        $stmt->bind_param("i", $packageID);
        $stmt->execute();

        if($stmt->affected_rows === 0){
            throw new Exception("Package not found.");
        }

        $conn->commit();

        successResponse([
            "message" => "Package deleted successfully."
        ]);

    } catch (Exception $e){
        $conn->rollback();
        errorResponse("Delete failed: " . $e->getMessage(), 500);
    }
}

function createGroupTrip($data, $conn){
    $packageID = $data['packageID'] ?? null;
    $agencyID = $data['agencyID'] ?? null;
    $maxSize = $data['maxSize'] ?? null;
    $tripDate = $data['tripDate'] ?? null;

    if(!$packageID || !$agencyID || !$maxSize || !$tripDate){
        errorResponse("missing required fields.");
    }

    if(!validatePackageID($conn, $packageID)){
        errorResponse("Invalid packageID.", 404);
    }
    if(!validateAgencyID($conn, $agencyID)){
        errorResponse("Invalid agencyID.", 404);
    }

    $sql = "INSERT INTO GROUP_TRIP
    (maxSize, tripDate, currentSize, packageID, agencyID)
    VALUES (?, ?, 0, ?, ?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("isii", $maxSize, $tripDate, $packageID, $agencyID);

    if(!$stmt->execute()){
        errorResponse("Failed to create group trip: " . $stmt->error, 500);
    }

    successResponse([
        "message" => "Group trip created successfully.",
        "tripID" => $conn->insert_id
    ]);
}

function getGroupTrips($data, $conn){
    $agencyID = $data['agencyID'] ?? null;

    if(!$agencyID){
        errorResponse("agencyID is required.");

    }
    if(!validateAgencyID($conn, $agencyID)){
        errorResponse("Invalid agencyID.", 404);
    }

    $stmt = $conn->prepare(
        "SELECT * FROM GROUP_TRIP
        WHERE agencyID = ?
        ORDER BY tripDate ASC"
    );
    $stmt->bind_param("i", $agencyID);
    $stmt->execute();

    $result = $stmt->get_result();

    $trips = [];
    while($row = $result->fetch_assoc()){
        $trips[] = $row;
    }
    successResponse($trips);
}

function updateGroupTrip($data, $conn){
    $tripID = $data['tripID'] ?? null;
    $maxSize = $data['maxSize'] ?? null;
    $tripDate = $data['tripDate'] ?? null;

    if(!$tripID || !$maxSize || !$tripDate){
        errorResponse("Missing required fields.");
    }

    if(!validateGroupTripID($conn, $tripID)){
        errorResponse("Invalid tripID.", 404);
    }

    $sql = "UPDATE GROUP_TRIP
    SET maxSize = ?,
    tripDate = ?
    WHERE tripID = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("isi", $maxSize, $tripDate, $tripID);

    if(!$stmt->execute()){
        errorResponse("Failed to update group trip: " . $stmt->error, 500);
    }

    successResponse([
        "message" => "Group trip updated successfully."
    ]);
}

function deleteGroupTrip($data, $conn){
    $tripID = $data['tripID'] ?? null;

    if (!$tripID){
        errorResponse("Invalid tripID.", 404);
    }
    if(!validateGroupTripID($conn, $tripID)){
        errorResponse("Invalid tripID.", 404);
    }

    $conn->begin_transaction();

    try{
        $stmt = $conn->prepare(
            "DELETE FROM TRAVELLER_GROUP_TRIP
            WHERE tripID = ?"
        );
        $stmt->bind_param("i", $tripID);
        $stmt->execute();

        $stmt = $conn->prepare(
            "DELETE FROM GROUP_TRIP
            WHERE tripID = ?"
        );
        $stmt->bind_param("i", $tripID);
        $stmt->execute();

        $conn->commit();

        successResponse([
            "message" => "Group trip deleted successfully."
        ]);
    } catch (Exception $e){
        $conn->rollback();
        errorResponse("Delete failed: " . $e->getMessage(), 500);
    }
}

function addFlight($data, $conn){
    $packageID = $data['packageID'] ?? null;
    $flightID = $data['flightID'] ?? null;

    if(!$packageID || !$flightID){
        errorResponse("packageID and flightID are required.");
    }

    addRelationship($conn, "PACKAGE_FLIGHT", ["packageID", "flightID"], "ii", [$packageID, $flightID], "Flight added to package successfully.");
}

function removeFlight($data, $conn){
    $packageID = $data['packageID'] ?? null;
    $flightID = $data['flightID'] ?? null;

    if(!$packageID || !$flightID){
        errorResponse("packageID and flightID are required.");
    }

    removeRelationship($conn, "PACKAGE_FLIGHT", ["packageID", "flightID"], "ii", [$packageID, $flightID], "Flight removed from package successfully.");



}

function addAccommodation($data, $conn){
    $packageID = $data['packageID'] ?? null;
    $accommodationID = $data['accommodationID'] ?? null;

    if(!$packageID || !$accommodationID){
        errorResponse("packageID and accommodationID are required.");
    }

    addRelationship($conn, "PACKAGE_ACCOMMODATION", ["packageID", "accommodationID"], "ii", [$packageID, $accommodationID], "Accommodation added to package successfully.");


    
}

function removeAccommodation($data, $conn){
    $packageID = $data['packageID'] ?? null;
    $accommodationID = $data['accommodationID'] ?? null;

    if(!$packageID || !$accommodationID){
        errorResponse("packageID and accommodationID are required.");
    }

    removeRelationship($conn, "PACKAGE_ACCOMMODATION", ["packageID", "accommodationID"], "ii", [$packageID, $accommodationID], "Accommodation removed from package successfully.");


}


function addRestaurant($data, $conn){
    $packageID = $data['packageID'] ?? null;
    $restaurantID = $data['restaurantID'] ?? null;

    if(!$packageID || !$restaurantID){
        errorResponse("packageID and restaurantID are required.");
    }

     addRelationship($conn, "PACKAGE_RESTAURANT", ["packageID", "restaurantID"], "ii", [$packageID, $restaurantID], "Restaurant added to package successfully.");
}

function removeRestaurant($data, $conn){
    $packageID = $data['packageID'] ?? null;
    $restaurantID = $data['restaurantID'] ?? null;

    if(!$packageID || !$restaurantID){
        errorResponse("packageID and restaurantID are required.");
    }

    removeRelationship($conn, "PACKAGE_RESTAURANT", ["packageID", "restaurantID"], "ii", [$packageID, $restaurantID], "Restaurant removed from package successfully.");
}

function addAttraction($data, $conn){
    $packageID = $data['packageID'] ?? null;
    $destinationID = $data['destinationID'] ?? null;
    $name = $data['name'] ?? null;
    

    if(!$packageID || !$destinationID || !$name){
        errorResponse("packageID and attractionID and name are required.");
    }

    addRelationship($conn, "PACKAGE_ATTRACTION", ["packageID", "destinationID", "name"], "iis", [$packageID, $destinationID, $name], "Attraction added to package successfully.");

}

function removeAttraction($data, $conn){
    $packageID = $data['packageID'] ?? null;
    $destinationID = $data['destinationID'] ?? null;
    

    if(!$packageID || !$destinationID){
        errorResponse("packageID and destinationID and name are required.");
    }

    removeRelationship($conn, "PACKAGE_ATTRACTION", ["packageID", "destinationID"], "ii", [$packageID, $destinationID], "Attraction removed from package successfully.");

}

function getOrders($data, $conn){
    $agencyID = $data['agencyID'] ?? null;

    if(!$agencyID){
        errorResponse("agencyID is required.");
    }

    if(!validateAgencyID($conn, $agencyID)){
        errorResponse("Invalid agencyID.", 404);
    }

    $sql = "SELECT o.orderId, o.startDate, o.numTravellers, o.status, o.totalPrice, p.packageID, p.name AS packageName, u.userID, CONCAT(u.firstName, ' ', u.lastName) AS travellerName, u.emailAddress
    FROM `ORDER` o
    INNER JOIN PACKAGE p ON o.packageID = p.packageID
    INNER JOIN USER u ON o.userID = u.userID
    WHERE p.agencyID = ?
    ORDER BY o.startDate DESC";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $agencyID);
    $stmt->execute();

    $result = $stmt->get_result();

    $orders = [];
    while($row = $result->fetch_assoc()){
        $orders[] = $row;
    }

    successResponse($orders);
}

function getReviews($data, $conn){
    $agencyID = $data['agencyID'] ?? null;

    if(!$agencyID){
        errorResponse("agencyID is required.");
    }

    if(!validateAgencyID($conn, $agencyID)){
        errorResponse("Invalid agencyID.", 404);
    }

    $sql = "SELECT r.reviewID, r.comment, r.starRating, r.reviewDate, p.packageID, p.name AS packageName, u.userID, CONCAT(u.firstName, ' ', u.lastName) AS travellerName
    FROM REVIEW r
    INNER JOIN PACKAGE p ON r.packageID = p.packageID
    INNER JOIN USER u ON r.userID = u.userID
    WHERE p.agencyID = ?
    ORDER BY r.reviewDate DESC";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $agencyID);
    $stmt->execute();

    $result = $stmt->get_result();

    $reviews = [];
    while($row = $result->fetch_assoc()){
        $reviews[] = $row;
    }

    successResponse($reviews);


}

function getDashboardStats($data, $conn){
    $agencyID = $data['agencyID'] ?? null;

    if(!$agencyID){
        errorResponse("agencyID is required.");
    }

    if(!validateAgencyID($conn, $agencyID)){
        errorResponse("Invalid agencyID.", 404);
    }

    /* Total Packages */    
    $stmt = $conn->prepare("SELECT COUNT(*)
    FROM PACKAGE
    WHERE agencyID = ?");
    $stmt->bind_param("i", $agencyID);
    $stmt->execute();
    $stmt->bind_result($totalPackages);
    $stmt->fetch();
    $stmt->close();

    /* Active Packages */    
    $stmt = $conn->prepare("SELECT COUNT(*)
    FROM PACKAGE
    WHERE agencyID = ? AND status = 'Active'");
    $stmt->bind_param("i", $agencyID);
    $stmt->execute();
    $stmt->bind_result($activePackages);
    $stmt->fetch();
    $stmt->close();

    /* Comfirmed Orders */     
    $stmt = $conn->prepare("SELECT COUNT(*)
    FROM `ORDER` o
    INNER JOIN PACKAGE p ON o.packageID = p.packageID
    WHERE p.agencyID = ?");

    $stmt->bind_param("i", $agencyID);
    $stmt->execute();
    $stmt->bind_result($totalOrders);
    $stmt->fetch();
    $stmt->close();

    /* Comfirmed Orders */     
    $stmt = $conn->prepare("SELECT COUNT(*)
    FROM `ORDER` o
    INNER JOIN PACKAGE p ON o.packageID = p.packageID
    WHERE p.agencyID = ? AND o.status = 'Confirmed'");

    $stmt->bind_param("i", $agencyID);
    $stmt->execute();
    $stmt->bind_result($confirmedOrders);
    $stmt->fetch();
    $stmt->close();

    /* Total Revenue */     
    $stmt = $conn->prepare("SELECT COALESCE(SUM(o.totalPrice), 0)
    FROM `ORDER` o
    INNER JOIN PACKAGE p ON o.packageID = p.packageID
    WHERE p.agencyID = ? AND o.status IN ('Confirmed', 'Completed')");

    $stmt->bind_param("i", $agencyID);
    $stmt->execute();
    $stmt->bind_result($totalRevenue);
    $stmt->fetch();
    $stmt->close();

    /* Average Rating */     
    $stmt = $conn->prepare("SELECT COALESCE(AVG(r.starRating), 0)
    FROM `REVIEW` r
    INNER JOIN PACKAGE p ON r.packageID = p.packageID
    WHERE p.agencyID = ?");

    $stmt->bind_param("i", $agencyID);
    $stmt->execute();
    $stmt->bind_result($averageRating);
    $stmt->fetch();
    $stmt->close();

    /* Total Reviews */     
    $stmt = $conn->prepare("SELECT COUNT(*)
    FROM `REVIEW` r
    INNER JOIN PACKAGE p ON r.packageID = p.packageID
    WHERE p.agencyID = ? ");

    $stmt->bind_param("i", $agencyID);
    $stmt->execute();
    $stmt->bind_result($totalReviews);
    $stmt->fetch();
    $stmt->close();

    successResponse([
        "totalPackages" => (int)$totalPackages,
        "activePackages" => (int)$activePackages,
        "totalOrders" => (int)$totalOrders,
        "confirmedOrders" => (int)$confirmedOrders,
        "totalRevenue" => (float)$totalRevenue,
        "averageRating" => round((float)$averageRating, 2),
        "totalReviews" => (int)$totalReviews,
    ]);

}

function getDestinations($conn){
    $sql = "SELECT *
    FROM DESTINATION
    ORDER BY country, city";

    $result = $conn->query($sql);

    $destinations = [];

    while($row = $result->fetch_assoc()){
        $destinations[] = $row;
    }

    successResponse($destinations);
}

function getAttractions($conn){
    $sql = "SELECT *
    FROM ATTRACTION
    ORDER BY destinationID, name";

    $result = $conn->query($sql);

    $destinations = [];

    while($row = $result->fetch_assoc()){
        $destinations[] = $row;
    }

    successResponse($destinations);

}

function getFlights($conn){
    $sql = "SELECT *
    FROM FLIGHT
    ORDER BY flightID";

    $result = $conn->query($sql);

    $flights = [];

    while($row = $result->fetch_assoc()){
        $flights[] = $row;
    }

    successResponse($flights);

}

function getAccommodations($conn){
    $sql = "SELECT *
    FROM ACCOMMODATION
    ORDER BY name";

    $result = $conn->query($sql);

    $accommodations = [];

    while($row = $result->fetch_assoc()){
        $accommodations[] = $row;
    }

    successResponse($accommodations);

}

function getRestaurants($conn){
    $sql = "SELECT *
    FROM RESTAURANT
    ORDER BY name";

    $result = $conn->query($sql);

    $restaurants = [];

    while($row = $result->fetch_assoc()){
        $restaurants[] = $row;
    }

    successResponse($restaurants);

}


?>
