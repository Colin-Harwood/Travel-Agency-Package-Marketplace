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
        $req_fields = ["startDate", "endDate", "airline", "minPrice", "maxPrice"];

        foreach($req_fields as $val) {
            if (!isset($data->$val)) {
                    $this->sendResponse("error", "Missing field: " . $val . " in the request to makeReview", 400);
            }
        }

        try {
            $sql = "
                SELECT * 
                FROM flight AS f
                LEFT JOIN package_flight AS pf ON f.flightID = pf.flightID
                LEFT JOIN package as p ON p.packageID = pf.packageID
                WHERE 1=1
            ";

            $params = [];
            $datatypes = "";

            if (isset($data->startDate) && trim($data->startDate) !== "") {
                $sql = $sql . " AND f.departureTime > ?";
                $params[] = $data->startDate;
                $datatypes .= "s";
            }

            if (isset($data->endDate) && trim($data->endDate) !== "") {
                $sql = $sql . " AND f.arrivalTime < ?";
                $params[] = $data->endDate;
                $datatypes .= "s";
            }

            if (isset($data->airline) && trim($data->airline) !== "") {
                $sql = $sql . " AND f.airline LIKE ?";
                $params[] = "%" . $data->airline . "%";
                $datatypes .= "s";
            }

            if (isset($data->minPrice) && trim($data->minPrice) != 0) {
                $sql = $sql . " AND f.price > ?";
                $params[] = $data->minPrice;
                $datatypes .= "d";
            }

            if (isset($data->maxPrice) && trim($data->maxPrice) != 0) {
                $sql = $sql . " AND f.price < ?";
                $params[] = $data->maxPrice;
                $datatypes .= "d";
            }

            $sql .= " ORDER BY f.price ASC";

            $stmt = $this->conn->prepare($sql);
            if (!empty($params)) {
                $stmt->bind_param($datatypes, ...$params);
            }
            $stmt->execute();

            $result = $stmt->get_result();

            $flights = [];

            $groupedFlights = [];

            while ($row = $result->fetch_assoc()) {
                $flightId = $row['flightID'];

                // make main entry for that flight if it hasnt been made
                if (!isset($groupedFlights[$flightId])) {
                    $groupedFlights[$flightId] = [
                        'flightID'         => $row['flightID'],
                        'airline'          => $row['airline'],
                        'flightNumber'     => $row['flightNumber'],
                        'departureAirport' => $row['departureAirport'],
                        'arrivalAirport'   => $row['arrivalAirport'],
                        'departureTime'    => $row['departureTime'],
                        'arrivalTime'      => $row['arrivalTime'],
                        'price'            => $row['price'],
                        'packages'         => [] //make the packages array empty at first
                    ];
                }

                // if a package exists in the array for that flight id we add the package to that instead of duplicating data
                if (!empty($row['packageID'])) {
                    $groupedFlights[$flightId]['packages'][] = [
                        'packageID'      => $row['packageID'],
                        'type'           => $row['type'],
                        'name'           => $row['name'],
                        'description'    => $row['description'],
                        'pricePerPerson' => $row['pricePerPerson'],
                        'status'         => $row['status'],
                        'duration'       => $row['duration'],
                        'destinationID'  => $row['destinationID'],
                        'agencyID'       => $row['agencyID']
                    ];
                }
            }

            // reindex the array so that its not a dict and becomes an array
            // as the flight id used be the keys to the values but now just in the arrays
            $flights = array_values($groupedFlights);

            $this->sendResponse("success", $flights, 200);

        } catch (mysqli_sql_exception $e) {
            $this->sendResponse("error", $e->getMessage(), 400);
        }
    }

    public function getAllRestaurants($data) {
        try {
            // updated the sql to get the packages
            $sql = "
                SELECT 
                    r.*, 
                    p.packageID, p.name AS packageName, p.type AS packageType, 
                    p.description AS packageDescription, p.pricePerPerson, 
                    p.status AS packageStatus, p.duration, p.agencyID
                FROM restaurant AS r
                LEFT JOIN package_restaurant AS pr ON r.restaurantID = pr.restaurantID
                LEFT JOIN package AS p ON pr.packageID = p.packageID
            ";

            $stmt = $this->conn->prepare($sql);
            $stmt->execute();
            $result = $stmt->get_result();

            $groupedRestaurants = [];

            while ($row = $result->fetch_assoc()) {
                $restId = $row['restaurantID'];
                
                // build main if not exists
                if (!isset($groupedRestaurants[$restId])) {
                    $groupedRestaurants[$restId] = [
                        "restaurantID"  => $row["restaurantID"],
                        "name"          => $row["name"],
                        "priceRange"    => $row["priceRange"],
                        "cuisine"       => $row["cuisine"],
                        "destinationID" => $row["destinationID"],
                        "packages"      => []
                    ];
                }
            
                // add package to sub array
                if (!empty($row['packageID'])) {
                    $groupedRestaurants[$restId]['packages'][] = [
                        'packageID'      => $row['packageID'],
                        'name'           => $row['packageName'], 
                        'type'           => $row['packageType'], 
                        'description'    => $row['packageDescription'],
                        'pricePerPerson' => $row['pricePerPerson'],
                        'status'         => $row['packageStatus'],
                        'duration'       => $row['duration'],
                        'agencyID'       => $row['agencyID']
                    ];
                }
            }

            // make standard array
            $resData = array_values($groupedRestaurants);

            $this->sendResponse("success", $resData, 200);

        } catch (mysqli_sql_exception $e) {
            $this->sendResponse("error", $e->getMessage(), 400);
        }
    }

    public function getAllDestinations($data) {
        try {
            // update to meet new requirements to fulfill stats needs
            $sql = "
                SELECT 
                    d.*, 
                    p.packageID, p.name AS packageName, p.type AS packageType, 
                    p.description AS packageDescription, p.pricePerPerson, 
                    p.status AS packageStatus, p.duration, p.agencyID,
                    
                    -- from below subquery
                    stats.packageCount, stats.agencyCount, stats.minPrice, 
                    stats.maxPrice, stats.avgPrice, stats.bookingCount, 
                    stats.upcomingTrips, stats.reviewCount, stats.avgRating
                    
                FROM destination AS d
                LEFT JOIN package AS p ON d.destinationID = p.destinationID
                
                -- subquery to aggreagate the stats
                LEFT JOIN (
                    SELECT 
                        p2.destinationID,
                        COUNT(DISTINCT p2.packageID) AS packageCount,
                        COUNT(DISTINCT p2.agencyID) AS agencyCount,
                        MIN(p2.pricePerPerson) AS minPrice,
                        MAX(p2.pricePerPerson) AS maxPrice,
                        AVG(p2.pricePerPerson) AS avgPrice,
                        
                        -- bookings
                        COUNT(DISTINCT o.orderID) AS bookingCount,
                        COUNT(DISTINCT CASE WHEN o.startDate > CURDATE() THEN o.orderID END) AS upcomingTrips,
                        
                        -- reviews
                        COUNT(DISTINCT r.reviewID) AS reviewCount,
                        AVG(r.starRating) AS avgRating
                    FROM package p2
                    LEFT JOIN `order` o ON p2.packageID = o.orderID
                    LEFT JOIN review r ON p2.packageID = r.packageID
                    GROUP BY p2.destinationID
                ) AS stats ON d.destinationID = stats.destinationID
            ";

            $stmt = $this->conn->prepare($sql);
            $stmt->execute();
            $result = $stmt->get_result();

            $groupedDestinations = [];

            while ($row = $result->fetch_assoc()) {
                $destId = $row['destinationID'];
                
                // build main destination
                if (!isset($groupedDestinations[$destId])) {
                    $groupedDestinations[$destId] = [
                        "destinationID" => $row["destinationID"],
                        "country"       => $row["country"],
                        "city"          => $row["city"],
                        "description"   => $row["description"],
                        
                        // nest stats
                        "stats" => [
                            "packageCount"  => (int)$row["packageCount"],
                            "agencyCount"   => (int)$row["agencyCount"],
                            "bookingCount"  => (int)$row["bookingCount"],
                            "upcomingTrips" => (int)$row["upcomingTrips"],
                            "reviewCount"   => (int)$row["reviewCount"],
                            "minPrice"      => $row["minPrice"] ? number_format((float)$row["minPrice"], 2, '.', '') : null,
                            "maxPrice"      => $row["maxPrice"] ? number_format((float)$row["maxPrice"], 2, '.', '') : null,
                            "avgPrice"      => $row["avgPrice"] ? number_format((float)$row["avgPrice"], 2, '.', '') : null,
                            "avgRating"     => $row["avgRating"] ? round((float)$row["avgRating"], 1) : null
                        ],
                        
                        "packages"      => [],
                    ];
                }
            
                // add to subarray
                if (!empty($row['packageID'])) {
                    $groupedDestinations[$destId]['packages'][] = [
                        'packageID'      => $row['packageID'],
                        'name'           => $row['packageName'], 
                        'type'           => $row['packageType'], 
                        'description'    => $row['packageDescription'],
                        'pricePerPerson' => $row['pricePerPerson'],
                        'status'         => $row['packageStatus'],
                        'duration'       => $row['duration'],
                        'agencyID'       => $row['agencyID']
                    ];
                }
            }

            // remove keys and flatten
            $resData = array_values($groupedDestinations);

            $this->sendResponse("success", $resData, 200);

        } catch (mysqli_sql_exception $e) {
            $this->sendResponse("error", $e->getMessage(), 400);
        }
    }

    public function getAllAccomodations($data) {
        $req_fields = ["accommodationType", "minRating", "minPrice", "maxPrice", "destination"];

        foreach($req_fields as $val) {
            if (!isset($data->$val)) {
                    $this->sendResponse("error", "Missing field: " . $val . " in the request to makeRestaurant", 400);
            }
        }

        try {
            $sql = "
                SELECT
                    a.*, 
                    p.packageID, p.name AS packageName, p.type AS packageType, 
                    p.description AS packageDescription, p.pricePerPerson, 
                    p.status AS packageStatus, p.duration, p.agencyID,
                    d.city, d.country
                FROM accommodation AS a
                LEFT JOIN package_accommodation AS pr ON a.accommodationID = pr.accommodationID
                LEFT JOIN package AS p ON pr.packageID = p.packageID
                LEFT JOIN destination AS d ON p.destinationID = d.destinationID
                WHERE 1=1
            ";

            $params = [];
            $datatypes = "";

            if (isset($data->accommodationType) && trim($data->accommodationType) !== "") {
                $sql = $sql . " AND a.type = ?";
                $params[] = $data->accommodationType;
                $datatypes .= "s";
            }

            if (isset($data->minRating) && trim($data->minRating) !== "") {
                $sql = $sql . " AND a.rating > ?";
                $params[] = $data->minRating;
                $datatypes .= "d";
            }

            if (isset($data->minPrice) && trim($data->minPrice) !== "") {
                $sql = $sql . " AND a.pricePerNight > ?";
                $params[] = $data->minPrice;
                $datatypes .= "d";
            }

            if (isset($data->maxPrice) && trim($data->maxPrice) !== "") {
                // $priceStmt = " AND (a.price = '$'";

                // if ($data->maxPrice === "$$") {
                //     $priceStmt .= " OR a.price = '$$'";
                // } elseif ($data->maxPrice === "$$$") {
                //     $priceStmt .= " OR a.price = '$$'  OR a.price = '$$$'";
                // } elseif ($data->maxPrice === "$$$$") {
                //     $priceStmt .= " OR a.price = '$$'  OR a.price = '$$$'  OR a.price = '$$$$'";
                // }

                // $priceStmt .= ")";

                // $sql = $sql . $priceStmt;

                $sql = $sql . " AND a.pricePerNight < ?";
                $params[] = $data->maxPrice;
                $datatypes .= "d";
            }

            if (!empty($data->destination) && trim($data->destination) !== "") {
                $sql .= " AND (d.city LIKE ? OR d.country LIKE ? OR d.destinationID = ?)";
                $params[] = "%" . $data->destination . "%";
                $params[] = "%" . $data->destination . "%";
                $params[] = $data->destination;
                $datatypes .= "sss";
            }

            $stmt = $this->conn->prepare($sql);
            if (!empty($params)) {
                $stmt->bind_param($datatypes, ...$params);
            }
            $stmt->execute();
            $result = $stmt->get_result();

            $groupedAccommodations = [];

            while ($row = $result->fetch_assoc()) {
                $accId = $row['accommodationID'];

                // add the main accommodation if it doesn't exist yet
                if (!isset($groupedAccommodations[$accId])) {
                    $groupedAccommodations[$accId] = [
                        'accommodationID' => $row['accommodationID'],
                        'name'            => $row['name'],
                        'type'            => $row['type'],
                        'rating'          => $row['rating'],
                        'pricePerNight'           => $row['pricePerNight'],
                        'city'            => $row['city'],
                        'country'         => $row['country'],
                        'packages'        => [] // empty subarray
                    ];
                }

                // if package exists add it to the subarray
                if (!empty($row['packageID'])) {
                    $groupedAccommodations[$accId]['packages'][] = [
                        'packageID'      => $row['packageID'],
                        'name'           => $row['packageName'], 
                        'type'           => $row['packageType'], 
                        'description'    => $row['packageDescription'],
                        'pricePerPerson' => $row['pricePerPerson'],
                        'status'         => $row['packageStatus'],
                        'duration'       => $row['duration'],
                        'agencyID'       => $row['agencyID']
                    ];
                }
            }

            // make it not dict
            $resData = array_values($groupedAccommodations);

            $this->sendResponse("success", $resData, 200);

        } catch (mysqli_sql_exception $e) {
            $this->sendResponse("error", $e->getMessage(), 400);
        }
    }

    public function getAllAttractions($data) {
        try {
            // select now accomodates fot packages
            $sql = "
                SELECT 
                    a.*, 
                    p.packageID, p.name AS packageName, p.type AS packageType, 
                    p.description AS packageDescription, p.pricePerPerson, 
                    p.status AS packageStatus, p.duration, p.agencyID
                FROM attraction AS a
                LEFT JOIN package_attraction AS pa 
                    ON a.destinationID = pa.destinationID AND a.name = pa.name
                LEFT JOIN package AS p 
                    ON pa.packageID = p.packageID
            ";

            $stmt = $this->conn->prepare($sql);
            $stmt->execute();
            $result = $stmt->get_result();

            $groupedAttractions = [];

            while ($row = $result->fetch_assoc()) {
                // group by comp key
                $attrKey = $row['destinationID'] . '_' . $row['name'];
                
                // make main entry
                if (!isset($groupedAttractions[$attrKey])) {
                    $groupedAttractions[$attrKey] = [
                        "name"          => $row["name"],
                        "entryFee"      => $row["entryFee"],
                        "description"   => $row["description"], 
                        "destinationID" => $row["destinationID"],
                        "packages"      => []
                    ];
                }
            
                // if package add to subarray
                if (!empty($row['packageID'])) {
                    $groupedAttractions[$attrKey]['packages'][] = [
                        'packageID'      => $row['packageID'],
                        'name'           => $row['packageName'], 
                        'type'           => $row['packageType'], 
                        'description'    => $row['packageDescription'], 
                        'pricePerPerson' => $row['pricePerPerson'],
                        'status'         => $row['packageStatus'],
                        'duration'       => $row['duration'],
                        'agencyID'       => $row['agencyID']
                    ];
                }
            }

            // flatten to array from dictionary
            $resData = array_values($groupedAttractions);

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