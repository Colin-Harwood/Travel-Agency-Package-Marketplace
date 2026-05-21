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

        $stmt = $this->conn->prepare("SELECT userID from user where apiKey = ? AND userType = 'Traveller'");
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
        } elseif ($request_data->type === "getBookings") {
            $this->getBookings($request_data);
        } elseif ($request_data->type === "getSingleBooking") {
            $this->getSingleBooking($request_data);
        } elseif ($request_data->type === "getAllFlights") {
            $this->getAllFlights($request_data);
        } elseif ($request_data->type === "getAllAccommodations") {
            $this->getAllAccomodations($request_data);
        } elseif ($request_data->type === "getAllDestinations") {
            $this->getAllDestinations($request_data);
        } elseif ($request_data->type === "getAllAttractions") {
            $this->getAllAttractions($request_data);
        } elseif ($request_data->type === "getAllRestaurants") {
            $this->getAllRestaurants($request_data);
        } elseif ($request_data->type === "getAllReviews") {
            $this->getAllReviews($request_data);
        } elseif ($request_data->type === "makeReview") {
            $this->makeReview($request_data);
        }  else {
            $this->sendResponse("error", "Invalid request type", 400);
        }
    }

    function getAllPackages($data) {
        try {
            // base queuery and usiny 1=1 so the appending is easier
            $sqlMain = "
                SELECT 
                    p.packageID, p.name, p.type, p.description, p.pricePerPerson, p.duration, p.status,
                    d.city AS destinationCity, d.country AS destinationCountry,
                    ta.name AS agencyName, u.emailAddress AS email, u.phoneNumber AS phone,
                    ta.street, ta.city AS agencyCity
                FROM PACKAGE p
                JOIN DESTINATION d ON p.destinationID = d.destinationID
                JOIN TRAVEL_AGENCY ta ON p.agencyID = ta.userID
                JOIN USER u ON ta.userID = u.userID
                WHERE 1=1
            ";

            $conditions = [];
            $params = [];
            $types = "";

            // add the filters in dynamically if the frontend sent the field
            if (!empty($data->agencyName) && trim($data->agencyName) !== "") {
                $conditions[] = "ta.name LIKE ?";
                $params[] = "%" . $data->agencyName . "%";
                $types .= "s";
            }

            if (!empty($data->destination) && trim($data->destination) !== "") {
                $conditions[] = "(d.city LIKE ? OR d.country LIKE ?)";
                $params[] = "%" . $data->destination . "%";
                $params[] = "%" . $data->destination . "%";
                $types .= "ss";
            }

            if (!empty($data->maxPrice) && $data->maxPrice !== 0) {
                $conditions[] = "p.pricePerPerson <= ?";
                $params[] = $data->maxPrice;
                $types .= "d";
            }

            if (!empty($data->duration) && $data->duration !== 0) {
                $conditions[] = "p.duration = ?";
                $params[] = $data->duration;
                $types .= "i";
            }

            if (count($conditions) > 0) {
                $sqlMain .= " AND " . implode(" AND ", $conditions);
            }

            // for the three allowed sorting columns
            $allowedSortColumns = [
                'price'    => 'p.pricePerPerson',
                'duration' => 'p.duration',
                'name'     => 'p.name'
            ];

            // default sort column
            $sortColumn = 'p.packageID'; 
            if (!empty($data->sortBy) && array_key_exists($data->sortBy, $allowedSortColumns) && trim($data->sortDirection) !== "") {
                $sortColumn = $allowedSortColumns[$data->sortBy];
            }

            // default sort direction is DESC
            $sortDirection = 'DESC'; 
            if (!empty($data->sortDirection) && trim($data->sortDirection) !== "") {
                $dir = strtolower(trim($data->sortDirection));
                if ($dir === 'ascending' || $dir === 'asc') {
                    $sortDirection = 'ASC';
                } elseif ($dir === 'descending' || $dir === 'desc') {
                    $sortDirection = 'DESC';
                }
            }

            $sqlMain .= " ORDER BY " . $sortColumn . " " . $sortDirection;

            // for using pages
            $page = isset($data->page) && $data->page > 0 ? (int)$data->page : 1;
            $limit = isset($data->limit) && $data->limit > 0 ? (int)$data->limit : 10;
            $offset = ($page - 1) * $limit;

            $sqlMain .= " LIMIT ? OFFSET ?";
            $params[] = $limit;
            $params[] = $offset;
            $types .= "ii"; 

            // prepare and bind
            $stmt = $this->conn->prepare($sqlMain);

            if (!empty($params)) {
                $stmt->bind_param($types, ...$params);
            }

            $stmt->execute();
            $result = $stmt->get_result();
            $packages = [];

            // fetch and format the results and put in array
            while ($row = $result->fetch_assoc()) {
                
                // // nest the agency details
                // $row['agencyDetails'] = [
                //     'agencyName' => $row['agencyName'],
                //     'email'      => $row['email'],
                //     'phone'      => $row['phone'],
                //     'street'     => $row['street'],
                //     'city'       => $row['agencyCity']
                // ];

                // unset($row['agencyName'], $row['email'], $row['phone'], $row['street'], $row['agencyCity']);

                $packages[] = $row;
            }

            $stmt->close();

            if (empty($packages)) {
                $this->sendResponse("error", "No packages found matching those criteria", 404);
                return; 
            }

            // send back info to the front about the data
            $responseData = [
                'data' => $packages,
                'pagination' => [
                    'currentPage' => $page,
                    'perPage'     => $limit,
                    'count'       => count($packages)
                ]
            ];

            $this->sendResponse("success", $responseData, 200);

        } catch (mysqli_sql_exception $e) {
            error_log("DB Error fetching packages: " . $e->getMessage());
            $this->sendResponse("error", "Failed to retrieve packages.", 500);
        }
    }

    public function getPackage($data) {
        if (!isset($data->packageId)) {
            $this->sendResponse("error", "Missing package id field", 400);
        }

        try {
            // fetch main package and agency first
            $sqlMain = "
                SELECT 
                    p.packageID, p.name, p.type, p.description, p.pricePerPerson, p.duration, p.status,
                    d.city AS destinationCity, d.country AS destinationCountry,
                    ta.name AS agencyName, u.emailAddress AS email, u.phoneNumber AS phone,
                    ta.street, ta.city AS agencyCity
                FROM PACKAGE p
                JOIN DESTINATION d ON p.destinationID = d.destinationID
                JOIN TRAVEL_AGENCY ta ON p.agencyID = ta.userID
                JOIN USER u ON ta.userID = u.userID
                WHERE p.packageID = ?
            ";

            $stmt = $this->conn->prepare($sqlMain);
            $stmt->bind_param("i", $data->packageId); 
            $stmt->execute();
            
            $result = $stmt->get_result();
            $package = $result->fetch_assoc();
            $stmt->close();

            if (!$package) {
                $this->sendResponse("error", "Package not found or inactive", 404);
            }

            // format agency details into nested json format
            $package['agencyDetails'] = [
                'agencyName' => $package['agencyName'],
                'email'      => $package['email'],
                'phone'      => $package['phone'],
                'street'     => $package['street'],
                'city'       => $package['agencyCity']
            ];

            // Clean up the flat keys
            unset($package['agencyName'], $package['email'], $package['phone'], $package['street'], $package['agencyCity']);

            // get sub data for the package view page
            $relatedQueries = [
                'reviews' => "
                    SELECT starRating AS rating, comment, reviewDate AS date 
                    FROM REVIEW WHERE packageID = ?",
                
                'flights' => "
                    SELECT f.airline, f.flightNumber, f.departureTime AS departure, f.arrivalTime AS arrival, f.price 
                    FROM PACKAGE_FLIGHT pf 
                    JOIN FLIGHT f ON pf.flightID = f.flightID WHERE pf.packageID = ?",
                
                'accommodations' => "
                    SELECT a.name, a.type, a.rating, a.pricePerNight 
                    FROM PACKAGE_ACCOMMODATION pa 
                    JOIN ACCOMMODATION a ON pa.accommodationID = a.accommodationID WHERE pa.packageID = ?",
                
                'restaurants' => "
                    SELECT rest.name, rest.cuisine, rest.priceRange 
                    FROM PACKAGE_RESTAURANT pr 
                    JOIN RESTAURANT rest ON pr.restaurantID = rest.restaurantID WHERE pr.packageID = ?",
                
                'attractions' => "
                    SELECT attr.name, attr.entryFee 
                    FROM PACKAGE_ATTRACTION pat 
                    JOIN ATTRACTION attr ON pat.destinationID = attr.destinationID AND pat.name = attr.name WHERE pat.packageID = ?",
                
                'upcomingGroupTrips' => "
                    SELECT tripID, tripDate, maxSize, currentSize, CAST((maxSize - currentSize) AS SIGNED) AS spotsRemaining 
                    FROM GROUP_TRIP WHERE packageID = ? AND tripDate >= CURDATE()"
            ];

            // loop through and attach to the main package
            foreach ($relatedQueries as $key => $query) {
                $stmt = $this->conn->prepare($query);
                $stmt->bind_param("i", $data->packageId);
                $stmt->execute();
                
                $res = $stmt->get_result();
                // use fetch all to automatically create the arrays
                $package[$key] = $res->fetch_all(MYSQLI_ASSOC); 
                $stmt->close();
            }

            $this->sendResponse("success", $package, 200);

        } catch (mysqli_sql_exception $e) { 
            error_log("DB Error fetching package: " . $e->getMessage());
            $this->sendResponse("error", "Failed to retrieve package details. MySQLi exception thrown in getPackage", 500);
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
            $this->sendResponse("error", "Missing required cancellation details", 400);
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
            $this->sendResponse("success", "Booking successfully cancelled and spots freed up", 200);

        } catch (Exception $e) {
            // rollback transaction if mess up
            $this->conn->rollback();
            
            error_log("Cancellation Transaction Failed: " . $e->getMessage());
            $this->sendResponse("error", $e->getMessage(), 400);
        }
    }

    public function getBookings($data) {
        $userID = $this->getUserID($data);

        try {
            $sqlQueuery = "
                SELECT * FROM `order` AS o
                JOIN package AS p ON o.packageID = p.packageID
                WHERE o.userID = ?
            ";

            $stmt = $this->conn->prepare($sqlQueuery);
            $stmt->bind_param("i", $userID);
            $stmt->execute();
            $result = $stmt->get_result();

            $booking = [];

            while($row = $result->fetch_assoc()) {
                $booking[] = $row;
            }

            $this->sendResponse("success", $booking, 200);
        } catch (mysqli_sql_exception $e) {
            $this->sendResponse("error", $e->getMessage(), 400);
        }
    }

    public function getSingleBooking ($data) {
        try {

            if (!isset($data->orderID)) {
                $this->sendResponse("error", "No field orderID was found", 400);
            }
            // check to make sure the client is requesting their booking info
            // otherwise any logged in user can see any booking by querying the api
            $userID = $this->getUserID($data);
            
            //keep the columns i wanted before i realised not needed. leaving here incase i want them later
            // o.orderID, o.startDate, o.numTravellers, o.status, o.totalPrice, o.packageID, p.type, p.name, p.description, p.pricePerPerson
            $sql = "
                SELECT *
                FROM `order` AS o
                JOIN package AS p ON o.packageID = p.packageID
                LEFT JOIN travel_agency AS a ON p.agencyID = a.userID
                WHERE o.orderID = ? AND o.userID = ?
            ";

            // run sql
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("ii", $data->orderID, $userID);
            $stmt->execute();
            $result = $stmt->get_result();

            $booking = $result->fetch_assoc();

            // check to make sure not invalid orderID
            if (!$booking) {
                $this->sendResponse("error", "No order exists for this orderID or no order belongs to this user for that orderID", 400);
            }

            $this->sendResponse("success", $booking, 200);


        } catch (mysqli_sql_exception $e) {
            $this->sendResponse("error", $e->getMessage(), 400);
        }
    }

    public function getAllFlights($data) {
        try {
            $sql = "
                SELECT * 
                FROM flight
                ORDER BY departureTime
            ";

            $stmt = $this->conn->prepare($sql);
            $stmt->execute();
            $result = $stmt->get_result();

            $flights = [];

            while ($row = $result->fetch_assoc()) {
                $flights[] = $row;
            }

            $this->sendResponse("success", $flights, 200);

        } catch (mysqli_sql_exception $e) {
            $this->sendResponse("error", $e->getMessage(), 400);
        }
    }

    public function getAllRestaurants($data) {
        try {
            $sql = "
                SELECT * 
                FROM restaurant
            ";

            $stmt = $this->conn->prepare($sql);
            $stmt->execute();
            $result = $stmt->get_result();

            $resData = [];

            while ($row = $result->fetch_assoc()) {
                $resData[] = $row;
            }

            $this->sendResponse("success", $resData, 200);

        } catch (mysqli_sql_exception $e) {
            $this->sendResponse("error", $e->getMessage(), 400);
        }
    }

    public function getAllDestinations($data) {
        try {
            $sql = "
                SELECT * 
                FROM destination
            ";

            $stmt = $this->conn->prepare($sql);
            $stmt->execute();
            $result = $stmt->get_result();

            $resData = [];

            while ($row = $result->fetch_assoc()) {
                $resData[] = $row;
            }

            $this->sendResponse("success", $resData, 200);

        } catch (mysqli_sql_exception $e) {
            $this->sendResponse("error", $e->getMessage(), 400);
        }
    }

    public function getAllAccomodations($data) {
        try {
            $sql = "
                SELECT * 
                FROM accommodation
            ";

            $stmt = $this->conn->prepare($sql);
            $stmt->execute();
            $result = $stmt->get_result();

            $resData = [];

            while ($row = $result->fetch_assoc()) {
                $resData[] = $row;
            }

            $this->sendResponse("success", $resData, 200);

        } catch (mysqli_sql_exception $e) {
            $this->sendResponse("error", $e->getMessage(), 400);
        }
    }

    public function getAllAttractions($data) {
        try {
            $sql = "
                SELECT * 
                FROM attraction
            ";

            $stmt = $this->conn->prepare($sql);
            $stmt->execute();
            $result = $stmt->get_result();

            $resData = [];

            while ($row = $result->fetch_assoc()) {
                $resData[] = $row;
            }

            $this->sendResponse("success", $resData, 200);

        } catch (mysqli_sql_exception $e) {
            $this->sendResponse("error", $e->getMessage(), 400);
        }
    }

    public function getAllReviews($data) {
        try {
            $sql = "
                SELECT reviewID, starRating AS rating, comment, reviewDate AS date, firstName, middleName, lastName, packageID, agencyID
                FROM review AS r
                JOIN user AS u ON r.userID = u.userID
                WHERE u.apiKey = ?
            ";

            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("s", $data->apikey);
            $stmt->execute();
            $result = $stmt->get_result();

            $resData = [];

            while ($row = $result->fetch_assoc()) {
                $resData[] = $row;
            }

            $this->sendResponse("success", $resData, 200);

        } catch (mysqli_sql_exception $e) {
            $this->sendResponse("error", $e->getMessage(), 400);
        }
    }

    public function makeReview($data) {
        try {
            // front only needs to send three things
            $req_fields = ["comment", "starRating", "packageID"];

            foreach($req_fields as $val) {
                if (!isset($data->$val)) {
                    $this->sendResponse("error", "Missing field: " . $val . " in the request to makeReview", 400);
                }
            }

            //ensure the starRating is in the correct range
            if ($data->starRating < 1 || $data->starRating > 5) {
                $this->sendResponse("error", "Star rating is not in the range of 1-5", 400);
            }

            $userID = $this->getUserID($data);

            //getting the agencyID
            $sqlAgencyID = "
                SELECT agencyID
                FROM package
                WHERE packageID = ?
            ";

            $stmt = $this->conn->prepare($sqlAgencyID);
            $stmt->bind_param("i", $data->packageID);
            $stmt->execute();
            $result = $stmt->get_result();
            $stmt->close();

            $agencyRow = $result->fetch_assoc();

            //no packageId exists
            if (!$agencyRow) {
                $this->sendResponse("error", "Package not found", 404);
                return;
            }

            //extract agencyId
            $agencyID = $agencyRow['agencyID'];

            //use sqls curdate as its easier
            $insertSql = "
                INSERT INTO review (comment, starRating, reviewDate, userID, packageID, agencyID)
                VALUES (?, ?, CURDATE(), ?, ?, ?)
            ";

            $stmt = $this->conn->prepare($insertSql);
            $stmt->bind_param("siiii", $data->comment, $data->starRating, $userID, $data->packageID, $agencyID);
            $stmt->execute();
            $stmt->close();

            // it will automatically throw a sql exception if the insert fails so just just response
            $this->sendResponse("Success", "Review created successfully", 200);

        } catch(mysqli_sql_exception $e) {
            $this->sendResponse("error", $e->getMessage(), 400);
        }
    }

    private function getUserID($data) {
        $stmt = $this->conn->prepare("SELECT userID from user where apiKey = ?");
        $stmt->bind_param("s", $data->apikey);
        $stmt->execute();

        $result = $stmt->get_result();
        $row = $result->fetch_assoc();

        $userID = $row["userID"];

        return $userID;
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