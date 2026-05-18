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
                WHERE pat.packageID = p.packageID) AS attractions

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
            $jsonColumns = ['agencyDetails', 'reviews', 'flights', 'accommodations', 'restaurants', 'attractions'];
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