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

        $stmt = $this->conn->prepare("SELECT userID from TRAVELLER where userID = ?");
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

    function getPackage($data) {
        if (!isset($data->packageId)) {
            $this->sendResponse("error", "Missing package id field", 400);
        }

        // $stmt = $this->conn->prepare
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

?>