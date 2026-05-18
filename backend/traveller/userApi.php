<?php 

require_once("config.php");

class Database {
    private static $instance = null;
    private $conn; // var to hold connection

    //  pass conn to singleton
    public static function instance($db_connection) {
        if (self::$instance === null) {
            self::$instance = new Database($db_connection);
        }
        return self::$instance;
    }

    // make connection avaliable in class
    private function __construct($db_connection) {
        $this->conn = $db_connection;
    }

    public function __destruct() {}

    function processRequest() {
        $raw_json = file_get_contents("php://input");

        $request_data = json_decode($raw_json);

        // check if there is the type field for routing
        if (!$request_data || !isset($request_data->type)) {
            $this->sendResponse("error", "Invalid JSON or missing 'type' field.", 400);
        }

        // make sure api key field is specified
        if (!isset($request_data->apikey)) {
            $this->sendResponse("error", "Missing apikey field.", 400);
        }

        $stmt = $this->conn->prepare("SELECT userID from user where apiKey = ?");
        $stmt->bind_param("s", $request_data->apikey);
        $stmt->execute();

        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            $this->sendResponse("error", "Invalid api key.", 409);
        }

        if ($request_data->type === "getAllPackages") {
            $this->getAllPackages($request_data);
        } elseif ($request_data->type === "getPackage") {
            $this->getPackage($request_data);
        } elseif ($request_data->type === "bookPackage") {
            $this->bookPackage($request_data);
        } elseif ($request_data->type === "cancelBooking") {
            $this->cancelBooking($request_data);
        } else {
            $this->sendResponse("error", "Invalid request type", 400);
        }
    }

    function getAllPackages($data) {
        
    }

    public function getPackage($data) {
        if (!isset($data->packageId)) {
            return $this->sendResponse("error", "Missing package id field", 400);
        }

        // long sql to get everything aout the package
        // use arrayagg to stop cartesian products and duplicate data
        $sql = "
            SELECT 
                p.packageID, p.name, p.type, p.description, p.pricePerPerson, p.duration, p.status,
                d.city AS destinationCity, d.country AS destinationCountry,
                
                JSON_OBJECT(
                    'agencyName', ta.name,
                    'email', u.emailAddress,
                    'phone', u.phoneNumber,
                    'street', ta.street,
                    'city', ta.city
                ) AS agencyDetails,

                (SELECT JSON_ARRAYAGG(JSON_OBJECT('rating', r.starRating, 'comment', r.comment, 'date', r.reviewDate)) 
                FROM REVIEW r WHERE r.packageID = p.packageID) AS reviews,

                (SELECT JSON_ARRAYAGG(JSON_OBJECT('airline', f.airline, 'flightNumber', f.flightNumber, 'departure', f.departureTime, 'arrival', f.arrivalTime, 'price', f.price)) 
                FROM PACKAGE_FLIGHT pf 
                JOIN FLIGHT f ON pf.flightID = f.flightID 
                WHERE pf.packageID = p.packageID) AS flights,

                (SELECT JSON_ARRAYAGG(JSON_OBJECT('name', a.name, 'type', a.type, 'rating', a.rating, 'pricePerNight', a.pricePerNight)) 
                FROM PACKAGE_ACCOMMODATION pa 
                JOIN ACCOMMODATION a ON pa.accommodationID = a.accommodationID 
                WHERE pa.packageID = p.packageID) AS accommodations,

                (SELECT JSON_ARRAYAGG(JSON_OBJECT('name', rest.name, 'cuisine', rest.cuisine, 'priceRange', rest.priceRange)) 
                FROM PACKAGE_RESTAURANT pr 
                JOIN RESTAURANT rest ON pr.restaurantID = rest.restaurantID 
                WHERE pr.packageID = p.packageID) AS restaurants,

                (SELECT JSON_ARRAYAGG(JSON_OBJECT('name', attr.name, 'entryFee', attr.entryFee)) 
                FROM PACKAGE_ATTRACTION pat 
                JOIN ATTRACTION attr ON pat.destinationID = attr.destinationID AND pat.name = attr.name 
                WHERE pat.packageID = p.packageID) AS attractions,

                COALESCE(
                    (SELECT JSON_ARRAYAGG(JSON_OBJECT(
                        'tripID', gt.tripID, 
                        'tripDate', gt.tripDate, 
                        'maxSize', gt.maxSize, 
                        'currentSize', gt.currentSize,
                        'spotsRemaining', CAST((gt.maxSize - gt.currentSize) AS SIGNED)
                    )) 
                    FROM GROUP_TRIP gt 
                    WHERE gt.packageID = p.packageID AND gt.tripDate >= CURDATE()), 
                    '[]'
                ) AS upcomingGroupTrips

            FROM PACKAGE p
            JOIN DESTINATION d ON p.destinationID = d.destinationID
            JOIN TRAVEL_AGENCY ta ON p.agencyID = ta.userID
            JOIN USER u ON ta.userID = u.userID
            WHERE p.packageID = ? 
        ";

        try {
            $stmt = $this->conn->prepare($sql);
            
            // bind and run
            $stmt->bind_param("i", $data->packageId); 
            $stmt->execute();
            
            // get the results
            $result = $stmt->get_result();
            $package = $result->fetch_assoc();

            if (!$package) {
                return $this->sendResponse("error", "Package not found or inactive", 404);
            }

            // decode json
            // agg gives json strings
            $jsonColumns = ['agencyDetails', 'reviews', 'flights', 'accommodations', 'restaurants', 'attractions', 'upcomingGroupTrips'];
            foreach ($jsonColumns as $col) {
                if (isset($package[$col])) {
                    $package[$col] = json_decode($package[$col], true);
                }
            }

            return $this->sendResponse("success", $package, 200);

        } catch (mysqli_sql_exception $e) { 
            error_log("DB Error fetching package: " . $e->getMessage());
            return $this->sendResponse("error", "Failed to retrieve package details. MysQLi exception thrown in getPackage", 500);
        }
    }

    function bookPackage($data) {
        // ensure both needed fields exist
        if (!isset($data->groupTripID) || !isset($data->numTravellers)) {
            $this->sendresponse("error", "Missing groupTripID or numTravellers field in bookPackage request");
            return;
        }

        $groupTripID = (int)$data->groupTripID;
        $numTravellers = (int)$data->numTravellers;
        $apiKey = $data->apikey;

        // ensure nothing is messed up
        if ($numTravellers < 0) {
            $this->sendresponse("error", "Number of travellers must be greater than zero");
            return;
        }

        try {
            // get user details
            $stmt = $this->conn->prepare("SELECT userID, userType FROM USER WHERE apiKey = ?");
            $stmt->bind_param("s", $apiKey);
            $stmt->execute();
            $userResult = $stmt->get_result();

            // make sure user is traveller
            $user = $userResult->fetch_assoc();
            if ($user['userType'] !== 'Traveller') {
                $this->sendresponse("error", "Only Travellers can book packages.");
                return;
            }
            $userID = $user['userID'];
            $stmt->close();

            // fetch the trip and package details
            $tripQuery = "
                SELECT gt.packageID, gt.tripDate, gt.currentSize, gt.maxSize, p.pricePerPerson 
                FROM GROUP_TRIP gt
                JOIN PACKAGE p ON gt.packageID = p.packageID
                WHERE gt.tripID = ? AND p.status = 'Active'
            ";
            $stmt = $this->conn->prepare($tripQuery);
            $stmt->bind_param("i", $groupTripID);
            $stmt->execute();
            $tripResult = $stmt->get_result();

            // make sure that the trip exists
            if ($tripResult->num_rows === 0) {
                $this->sendresponse("error", "Trip not found or package is inactive.");
                return;
            }

            $trip = $tripResult->fetch_assoc();
            $stmt->close();

            // make sure theres still spots left
            if (($trip['currentSize'] + $numTravellers) > $trip['maxSize']) {
                $this->sendresponse("error", "Not enough available spots on this trip.");
                return;
            }

            // calculate total price
            $totalPrice = $trip['pricePerPerson'] * $numTravellers;
            $packageID = $trip['packageID'];
            $tripDate = $trip['tripDate'];

            // execute transaction
            $this->conn->begin_transaction();

            // insert the order
            $orderQuery = "INSERT INTO `ORDER` (startDate, numTravellers, status, totalPrice, userID, packageID) 
                        VALUES (?, ?, 'Pending', ?, ?, ?)";
            $stmtOrder = $this->conn->prepare($orderQuery);
            $stmtOrder->bind_param("sidii", $tripDate, $numTravellers, $totalPrice, $userID, $packageID);
            $stmtOrder->execute();
            $stmtOrder->close();

            // add traveller to group roster
            $rosterQuery = "INSERT INTO TRAVELLER_GROUP_TRIP (userID, tripID, joinDate) VALUES (?, ?, CURDATE())";
            $stmtRoster = $this->conn->prepare($rosterQuery);
            $stmtRoster->bind_param("ii", $userID, $groupTripID);
            $stmtRoster->execute();
            $stmtRoster->close();

            // update group size
            $updateTripQuery = "UPDATE GROUP_TRIP SET currentSize = currentSize + ? WHERE tripID = ?";
            $stmtUpdate = $this->conn->prepare($updateTripQuery);
            $stmtUpdate->bind_param("ii", $numTravellers, $groupTripID);
            $stmtUpdate->execute();
            $stmtUpdate->close();

            // if transactions good commit everything
            $this->conn->commit();

            $this->sendresponse("success", "Booking successfully created.", 200);

        } catch (Exception $e) {
            // fails then rollback whole transaction
            $this->conn->rollback();
            $this->sendresponse("error", "Booking failed due to a server error: " . $e->getMessage(), 400);
        }
    }

    public function cancelBooking($data) {
        // make sure the orderId is sent
        if (!isset($data->orderId)) {
            return $this->sendResponse("error", "Missing required cancellation details", 400);
        }

        $stmt = $this->conn->prepare("SELECT * from user where apiKey = ?");
        $stmt->bind_param("s", $data->apikey);
        $stmtFetch = $stmt->execute();
        $userRes = $stmt->get_result();
        $userInfo = $userRes->fetch_assoc();

        try {
            // START TRANSACTION
            $this->conn->begin_transaction();

            // fetch the order details
            // lock with the for update
            $sqlFetch = "
                SELECT o.numTravellers, o.status, gt.tripID 
                FROM `ORDER` o
                JOIN GROUP_TRIP gt ON o.packageID = gt.packageID AND o.startDate = gt.tripDate
                WHERE o.orderID = ? AND o.userID = ?
                FOR UPDATE
            ";
            $stmtFetch = $this->conn->prepare($sqlFetch);
            $stmtFetch->bind_param("ii", $data->orderId, $userInfo["userID"]);
            $stmtFetch->execute();
            $result = $stmtFetch->get_result();
            $order = $result->fetch_assoc();

            // make sure order was found and no double cancel
            if (!$order) {
                throw new Exception("Order not found or you do not have permission to cancel it.");
            }
            if ($order['status'] === 'Cancelled') {
                throw new Exception("This booking is already cancelled.");
            }

            // change order to cancelled
            $sqlUpdateOrder = "UPDATE `ORDER` SET status = 'Cancelled' WHERE orderID = ?";
            $stmtUpdateOrder = $this->conn->prepare($sqlUpdateOrder);
            $stmtUpdateOrder->bind_param("i", $data->orderId);
            $stmtUpdateOrder->execute();

            // remove traveller from the trip
            $sqlDeleteRoster = "DELETE FROM TRAVELLER_GROUP_TRIP WHERE userID = ? AND tripID = ?";
            $stmtDeleteRoster = $this->conn->prepare($sqlDeleteRoster);
            $stmtDeleteRoster->bind_param("ii", $userInfo["userID"], $order['tripID']);
            $stmtDeleteRoster->execute();

            // lower the trip capacity, just make sure doesnt go below 0
            // greater to not screw up
            $sqlUpdateCapacity = "UPDATE GROUP_TRIP 
                                  SET currentSize = GREATEST(0, currentSize - ?) 
                                  WHERE tripID = ?";
            $stmtCapacity = $this->conn->prepare($sqlUpdateCapacity);
            $stmtCapacity->bind_param("ii", $order['numTravellers'], $order['tripID']);
            $stmtCapacity->execute();

            // commit the transaction
            $this->conn->commit();
            return $this->sendResponse("success", "Booking successfully cancelled and spots freed up", 200);

        } catch (Exception $e) {
            // rollback transaction if mess up
            $this->conn->rollback();
            
            error_log("Cancellation Transaction Failed: " . $e->getMessage());
            return $this->sendResponse("error", $e->getMessage(), 400);
        }
    }

    private function sendResponse($status, $data, $http_code = 200) {
        http_response_code($http_code);
        header('Content-Type: application/json');

        if ($http_code === 200) {
            $response = [
                "status" => $status, 
                "timestamp" => time(), 
                "data" => $data
            ];
        } else {
            $response = [
                "status" => $status,  
                "data" => $data
            ];
        }
        

        echo json_encode($response);
        exit(); 
    }
}

$api = Database::instance($conn);
$api->processRequest();

?>