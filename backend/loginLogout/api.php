<?php
    require_once "config.php";
    header('Content-Type: application/json');


    
    // header("Access-Control-Allow-Origin: *");
    // header("Access-Control-Allow-Methods: POST, OPTIONS");
    // header("Access-Control-Allow-Headers: Content-Type, Authorization");
    
    // if($_SERVER['REQUEST_METHOD'] === 'OPTIONS'){
    //     http_response_code(200);
    //     exit();
    // }

    class Database{
        private static $instance = null;
        private $connection = null;
    
        public static function instantiate(){
            if(self::$instance === null){
                self::$instance = new Database();
            }

            return self::$instance;
        }

        public function getConnection(){
            return $this->connection;
        }
        private function __construct(){
            $dsnString = "mysql:host=".HOST.";dbname=".NAME.";charset=utf8mb4";
            $this->connection = new PDO($dsnString, USERNAME , PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,PDO::ATTR_STRINGIFY_FETCHES => false,
                PDO::ATTR_EMULATE_PREPARES => false
            ]);
        }

        public function __destruct(){}

    }

    $jsonData = file_get_contents("php://input");
    $phpData = json_decode($jsonData);

    session_start();
    function rateLimiter($key, $limit = 5, $seconds = 60){
        if(!isset($_SESSION["rate_limts"])){
            $_SESSION["rate_limits"] = [];
        }

        $now = time();

        if(!isset($_SESSION["rate_limits"][$key])){
            $_SESSION["rate_limits"][$key] = [
                "count" => 1, 
                "start" => $now
            ];
            return true;
        }

        $entry = &$_SESSION["rate_limits"][$key];

        if(($now - $entry["start"]) > $seconds){
            $entry["count"] = 1;
            $entry["start"] = $now;
            return true;
        }

        if ($entry["count"] >= $limit) {
            return false;
        }
        $entry["count"]++;
        return true;
    }


    /// check in the request is empty or not before anything else
    if(empty($jsonData) || $phpData === null){
        echo json_encode([
            "status" => "error",
            "errorCode" => 400,
            "timestamp" => time(),
            "message" => "Request is empty",
            "data" => null
        ]);
        die();
    }

    if(!isset($phpData->type)){
        echo json_encode([
            "status" => "error",
            "errorCode" => 400,
            "timestamp" => time(),
            "message" => "no request type specified",
            "data" => null
        ]);
        die();
    }

    try{
        if ($phpData && $phpData->type === "travellerRegister"){
            ///rate limiting
            $rateKey = $phpData->type . "_" . ($_SERVER["REMOTE_ADDR"] ?? "unknown");

            if (!rateLimiter($rateKey, 5, 60)) {
                echo json_encode([
                    "status" => "error",
                    "errorCode" => 429,
                    "timestamp" => time(),
                    "message" => "Too many requests. Please try again later.",
                    "data" => null
                ]);
                die();
            }
            ///firstName Check
            if (!isset($phpData->firstName) || trim($phpData->firstName) === ""){
                echo json_encode([
                "status" => "error",
                "errorCode" => 400,
                "timestamp" => time(),
                "message" => "no firstName passed",
                "data" => null
                ]);
                die();
            }

            ///lstName check
            if (!isset($phpData->lastName)  || trim($phpData->lastName) === ""){
                echo json_encode([
                "status" => "error",
                "errorCode" => 400,
                "timestamp" => time(),
                "message" => "no lastName passed",
                "data" => null
                ]);
                die();
            }
            /// phoneNumber check
            if (!isset($phpData->phoneNumber) || trim($phpData->phoneNumber) === ""){
                echo json_encode([
                "status" => "error",
                "errorCode" => 400,
                "timestamp" => time(),
                "message" => "no phoneNumber passed",
                "data" => null
                ]);
                die();
            }

            /// password check
            if (!isset($phpData->password) || trim($phpData->password) === ""){
                echo json_encode([
                "status" => "error",
                "errorCode" => 400,
                "timestamp" => time(),
                "message" => "no password passed",
                "data" => null
                ]);
                die();
            }

            if (!isset($phpData->email) || trim($phpData->email) === ""){
                echo json_encode([
                "status" => "error",
                "errorCode" => 400,
                "timestamp" => time(),
                "message" => "no email passed",
                "data" => null
                ]);
                die();
            }

            ////valid email check 
            $regEx = '/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/';
            if (!preg_match($regEx, $phpData->email)){
                echo json_encode([
                    "status" => "error",
                    "errorCode" => 400,
                    "timestamp" => time(),
                    "message" => "invalid email address",
                    "data" => null
                ]);
                die();
            }

            ///possible password check??

            $database = Database::instantiate()->getConnection();
            ///ensure email is unqute first
            
            $sqlStatement = $database->prepare('SELECT userID FROM USER WHERE emailAddress = :email');

            $sqlStatement->execute([':email' => $phpData->email]);
            $var = $sqlStatement->fetch();

            if($var !== false){
                echo json_encode([
                    "status" => "error",
                    "errorCode" => 409,
                    "timestamp" => time(),
                    "message" => "email address already exists",
                    "data" => null
                ]);
                die();
            }
            
            ///obsfucation
            $salt = bin2hex(random_bytes(32));
            $apiKey = bin2hex(random_bytes(16)) . bin2hex(random_bytes(8)) . bin2hex(random_bytes(8));
            $hashedPassword = hash_pbkdf2('sha256', $phpData->password, $salt, 100000, 64);

            $database->beginTransaction(); //// begin the transaction
            $userType = "Traveller";

            ////insert into users
            $sqlString = 'INSERT INTO USER (firstName, middleName, lastName, emailAddress, phoneNumber, password, salt, apiKey, userType)
                        VALUES (:firstName, :middleName, :lastName, :emailAddress, :phoneNumber, :password, :salt, :apiKey, :userType)';
            

            $sqlStatement = $database->prepare($sqlString);
            $sqlStatement->execute([
                ":firstName" => $phpData->firstName,
                ":middleName" => $phpData->middleName,
                ":lastName" => $phpData->lastName,
                ":emailAddress" => $phpData->email,
                ":phoneNumber" => $phpData->phoneNumber,
                ":password" => $hashedPassword,
                ":salt" => $salt,
                ":apiKey" => $apiKey,
                ":userType" => $userType,
            ]);

            $userID = $database->lastInsertId();

            $sqlStatement = $database->prepare('INSERT INTO TRAVELLER (userID) VALUES (:userID)');

            ////AND insert into Travelers
            $sqlStatement->execute([
                ':userID' => $userID
            ]);

            $database->commit();

            echo json_encode([
                "status" => "success", 
                "timestamp" => time(),
                "data" => [
                    "userID" => $userID,
                    "userType" => $userType,
                    "apiKey" => $apiKey
                ]
            ]);
            die();


        }else if($phpData->type === "agencyRegister"){
            $rateKey = $phpData->type . "_" . ($_SERVER["REMOTE_ADDR"] ?? "unknown");

            if (!rateLimiter($rateKey, 5, 60)) {
                echo json_encode([
                    "status" => "error",
                    "errorCode" => 429,
                    "timestamp" => time(),
                    "message" => "Too many requests. Please try again later.",
                    "data" => null
                ]);
                die();
            }

            ///firstName Check
            if (!isset($phpData->firstName) || trim($phpData->firstName) === ""){
                echo json_encode([
                "status" => "error",
                "errorCode" => 400,
                "timestamp" => time(),
                "message" => "no firstName passed",
                "data" => null
                ]);
                die();
            }

            ///lstName check
            if (!isset($phpData->lastName)  || trim($phpData->lastName) === ""){
                echo json_encode([
                "status" => "error",
                "errorCode" => 400,
                "timestamp" => time(),
                "message" => "no lastName passed",
                "data" => null
                ]);
                die();
            }
            /// phoneNumber check
            if (!isset($phpData->phoneNumber) || trim($phpData->phoneNumber) === ""){
                echo json_encode([
                "status" => "error",
                "errorCode" => 400,
                "timestamp" => time(),
                "message" => "no phoneNumber passed",
                "data" => null
                ]);
                die();
            }
            /// password check
            if (!isset($phpData->password) || trim($phpData->password) === ""){
                echo json_encode([
                "status" => "error",
                "errorCode" => 400,
                "timestamp" => time(),
                "message" => "no password passed",
                "data" => null
                ]);
                die();
            }

            if (!isset($phpData->email) || trim($phpData->email) === ""){
                echo json_encode([
                "status" => "error",
                "errorCode" => 400,
                "timestamp" => time(),
                "message" => "no email passed",
                "data" => null
                ]);
                die();
            }

            ////valid email check 
            $regEx = '/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/';
            if (!preg_match($regEx, $phpData->email)){
                echo json_encode([
                    "status" => "error",
                    "errorCode" => 400,
                    "timestamp" => time(),
                    "message" => "invalid email address",
                    "data" => null
                ]);
                die();
            }

            ///agencyName check
            if (!isset($phpData->agencyName) || trim($phpData->agencyName) === ""){
                echo json_encode([
                "status" => "error",
                "errorCode" => 400,
                "timestamp" => time(),
                "message" => "no agencyName passed",
                "data" => null
                ]);
                die();
            }

            if (!isset($phpData->street) || trim($phpData->street) === ""){
                echo json_encode([
                "status" => "error",
                "errorCode" => 400,
                "timestamp" => time(),
                "message" => "no street passed",
                "data" => null
                ]);
                die();
            }

            if (!isset($phpData->suburb) || trim($phpData->suburb) === ""){
                echo json_encode([
                "status" => "error",
                "errorCode" => 400,
                "timestamp" => time(),
                "message" => "no suburb passed",
                "data" => null
                ]);
                die();
            }

            if (!isset($phpData->city) || trim($phpData->city) === ""){
                echo json_encode([
                "status" => "error",
                "errorCode" => 400,
                "timestamp" => time(),
                "message" => "no city passed",
                "data" => null
                ]);
                die();
            }

            if (!isset($phpData->country) || trim($phpData->country) === ""){
                echo json_encode([
                "status" => "error",
                "errorCode" => 400,
                "timestamp" => time(),
                "message" => "no country passed",
                "data" => null
                ]);
                die();
            }

            ///possible password check??

            $database = Database::instantiate()->getConnection();
            ///ensure email is unqute first
            
            $sqlStatement = $database->prepare('SELECT userID FROM USER WHERE emailAddress = :email');

            $sqlStatement->execute([':email' => $phpData->email]);
            $var = $sqlStatement->fetch();

            if($var !== false){
                echo json_encode([
                    "status" => "error",
                    "errorCode" => 409,
                    "timestamp" => time(),
                    "message" => "email address already exists",
                    "data" => null
                ]);
                die();
            }
            
            ///obsfucation
            $salt = bin2hex(random_bytes(32));
            $apiKey = bin2hex(random_bytes(16)) . bin2hex(random_bytes(8)) . bin2hex(random_bytes(8));
            $hashedPassword = hash_pbkdf2('sha256', $phpData->password, $salt, 100000, 64);

            $database->beginTransaction(); //// begin the transaction
            $userType = "Agency";

            ////insert into users
            $sqlString = 'INSERT INTO USER (firstName, middleName, lastName, emailAddress, phoneNumber, password, salt, apiKey, userType)
                        VALUES (:firstName, :middleName, :lastName, :emailAddress, :phoneNumber, :password, :salt, :apiKey, :userType)';
            

            $sqlStatement = $database->prepare($sqlString);
            $sqlStatement->execute([
                ":firstName" => $phpData->firstName,
                ":middleName" => $phpData->middleName,
                ":lastName" => $phpData->lastName,
                ":emailAddress" => $phpData->email,
                ":phoneNumber" => $phpData->phoneNumber,
                ":password" => $hashedPassword,
                ":salt" => $salt,
                ":apiKey" => $apiKey,
                ":userType" => $userType,
            ]);

            $userID = $database->lastInsertId();

            $sqlStatement = $database->prepare('INSERT INTO TRAVEL_AGENCY (userID, name, street, suburb, city, country) VALUES 
                                                (:userID, :name, :street, :suburb, :city, :country)');

            ////AND insert into Travelers
            $sqlStatement->execute([
                ':userID' => $userID,
                ':name' => $phpData->agencyName,
                ':street' => $phpData->street,
                ':suburb' => $phpData->suburb,
                ':city' => $phpData->city,
                ':country' => $phpData->country
            ]);

            $database->commit();

            echo json_encode([
                "status" => "success", 
                "timestamp" => time(),
                "data" => [
                    "userID" => $userID,
                    "userType" => $userType,
                    "apiKey" => $apiKey
                ]
            ]);
            die();
        }else if($phpData->type === "travellerLogin"){
            $rateKey = $phpData->type . "_" . ($_SERVER["REMOTE_ADDR"] ?? "unknown");

            if (!rateLimiter($rateKey, 5, 60)) {
                echo json_encode([
                    "status" => "error",
                    "errorCode" => 429,
                    "timestamp" => time(),
                    "message" => "Too many requests. Please try again later.",
                    "data" => null
                ]);
                die();
            }

            if (!isset($phpData->email) || trim($phpData->email) === ""){
                echo json_encode([
                "status" => "error",
                "errorCode" => 400,
                "timestamp" => time(),
                "message" => "no email passed",
                "data" => null
                ]);
                die();
            }

            $regEx = '/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/';
            if (!preg_match($regEx, $phpData->email)){
                echo json_encode([
                    "status" => "error",
                    "errorCode" => 400,
                    "timestamp" => time(),
                    "message" => "invalid email address",
                    "data" => null
                ]);
                die();
            }

            if (!isset($phpData->password) || trim($phpData->password) === ""){
                echo json_encode([
                "status" => "error",
                "errorCode" => 400,
                "timestamp" => time(),
                "message" => "no password passed",
                "data" => null
                ]);
                die();
            }

            $Database = Database::instantiate()->getConnection();
            $sql = 'SELECT userID, userType, password, salt, apiKey FROM USER WHERE emailAddress = :email';
            $smt = $Database->prepare($sql);
            
            $smt->execute([":email" => $phpData->email]);
            $user = $smt->fetch(PDO::FETCH_ASSOC);

            if($user === false){
                echo json_encode([
                    "status" => "error",
                    "errorCode" => 401,
                    "timestamp" => time(),
                    "message" =>"email doesnt exist in database",
                    "data" => null
                ]);
                die();
            }

            if ($user["userType"] !== "Traveller") {
                echo json_encode([
                    "status" => "error",
                    "errorCode" => 401,
                    "timestamp" => time(),
                    "message" =>"user is not a traveller",
                    "data" => null
                ]);
                die();
            }

            $hashed = hash_pbkdf2('sha256', $phpData->password, $user["salt"], 100000, 64);

            if(!hash_equals($user["password"], $hashed)){ /// use hash_equals instead of !== for safety
                echo json_encode([
                    "status" => "error",
                    "errorCode" => 401,
                    "timestamp" => time(),
                    "message" => "incorrect password",
                    "data" => null
                ]);
                die();
            }

            echo json_encode([
                "status" => "success",
                "timestamp" => time(),
                "data" => [
                    "userID" => $user['userID'],
                    "userType" => $user['userType'],
                    "apiKey" => $user['apiKey']
                ]
            ]);
            die();
        }else if($phpData->type === "agencyLogin"){
            $rateKey = $phpData->type . "_" . ($_SERVER["REMOTE_ADDR"] ?? "unknown");

            if (!rateLimiter($rateKey, 5, 60)) {
                echo json_encode([
                    "status" => "error",
                    "errorCode" => 429,
                    "timestamp" => time(),
                    "message" => "Too many requests. Please try again later.",
                    "data" => null
                ]);
                die();
            }

            if (!isset($phpData->email) || trim($phpData->email) === ""){
                echo json_encode([
                "status" => "error",
                "errorCode" => 400,
                "timestamp" => time(),
                "message" => "no email passed",
                "data" => null
                ]);
                die();
            }

            $regEx = '/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/';
            if (!preg_match($regEx, $phpData->email)){
                echo json_encode([
                    "status" => "error",
                    "errorCode" => 400,
                    "timestamp" => time(),
                    "message" => "invalid email address",
                    "data" => null
                ]);
                die();
            }

            if (!isset($phpData->password) || trim($phpData->password) === ""){
                echo json_encode([
                "status" => "error",
                "errorCode" => 400,
                "timestamp" => time(),
                "message" => "no password passed",
                "data" => null
                ]);
                die();
            }

            $Database = Database::instantiate()->getConnection();
            $sql = 'SELECT userID, userType, password, salt, apiKey FROM USER WHERE emailAddress = :email';
            $smt = $Database->prepare($sql);
            
            $smt->execute([":email" => $phpData->email]);
            $user = $smt->fetch(PDO::FETCH_ASSOC);

            if($user === false){
                echo json_encode([
                    "status" => "error",
                    "errorCode" => 401,
                    "timestamp" => time(),
                    "message" =>"email doesnt exist in database",
                    "data" => null
                ]);
                die();
            }

            if ($user["userType"] !== "Agency") {
                echo json_encode([
                    "status" => "error",
                    "errorCode" => 401,
                    "timestamp" => time(),
                    "message" =>"user is not an agency user",
                    "data" => null
                ]);
                die();
            }

            $hashed = hash_pbkdf2('sha256', $phpData->password, $user["salt"], 100000, 64);

            if(!hash_equals($user["password"], $hashed)){ /// use hash_equals instead of !== for safety
                echo json_encode([
                    "status" => "error",
                    "errorCode" => 401,
                    "timestamp" => time(),
                    "message" => "incorrect password",
                    "data" => null
                ]);
                die();
            }

            echo json_encode([
                "status" => "success",
                "timestamp" => time(),
                "data" => [
                    "userID" => $user['userID'],
                    "userType" => $user['userType'],
                    "apiKey" => $user['apiKey']
                ]
            ]);
            die();
        }else if($phpData->type === "logout"){
            $rateKey = $phpData->type . "_" . ($_SERVER["REMOTE_ADDR"] ?? "unknown");

            if (!rateLimiter($rateKey, 5, 60)) {
                echo json_encode([
                    "status" => "error",
                    "errorCode" => 429,
                    "timestamp" => time(),
                    "message" => "Too many requests. Please try again later.",
                    "data" => null
                ]);
                die();
            }

            if (!isset($phpData->apiKey) || trim($phpData->apiKey) === ""){
                echo json_encode([
                "status" => "error",
                "errorCode" => 400,
                "timestamp" => time(),
                "message" => "no apiKey passed",
                "data" => null
                ]);
                die();
            }

            $database = Database::instantiate()->getConnection();

            $statement = $database->prepare('SELECT userID FROM USER WHERE apiKey = :apiKey');
            $statement->execute([":apiKey" => $phpData->apiKey]);

            $user = $statement->fetch(PDO::FETCH_ASSOC);

            if ($user === false){
                echo json_encode([
                "status" => "error",
                "errorCode" => 400,
                "timestamp" => time(),
                "message" => "invalid apiKey",
                "data" => null
                ]);
                die();
            }

            ///make a new apiKey
            $newApiKey = bin2hex(random_bytes(16)) . bin2hex(random_bytes(8)) . bin2hex(random_bytes(8));

            $statement = $database->prepare('UPDATE USER SET apiKey = :newApiKey WHERE userID = :userID');
            $statement->execute([
                ":newApiKey" => $newApiKey,
                ":userID" => $user['userID']
            ]);

            echo json_encode([
                "status" => "success",
                "timestamp" => time(),
                "message" => "logged out successfully",
                "data" => null
            ]);
            
            die();
        }else if($phpData->type === "profileUpdate"){

            if (!isset($phpData->apiKey) || trim($phpData->apiKey) === ""){
                echo json_encode([
                    "status" => "error",
                    "errorCode" => 400,
                    "timestamp" => time(),
                    "message" => "no apiKey passed",
                    "data" => null
                ]);
                die();
            }

            if (!isset($phpData->email) || trim($phpData->email) === ""){
                echo json_encode([
                    "status" => "error",
                    "errorCode" => 400,
                    "timestamp" => time(),
                    "message" => "no email passed",
                    "data" => null
                ]);
                die();
            }

            if (!isset($phpData->password) || trim($phpData->password) === ""){
                echo json_encode([
                    "status" => "error",
                    "errorCode" => 400,
                    "timestamp" => time(),
                    "message" => "no password passed",
                    "data" => null
                ]);
                die();
            }

            $regEx = '/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/';
            if (!preg_match($regEx, $phpData->email)){
                echo json_encode([
                    "status" => "error",
                    "errorCode" => 400,
                    "timestamp" => time(),
                    "message" => "invalid email address",
                    "data" => null
                ]);
                die();
            }

            $database = Database::instantiate()->getConnection();
            $sql = 'SELECT userID, userType FROM USER WHERE apiKey = :apiKey';
            $stmt = $database->prepare($sql);

            $stmt->execute([
                ':apiKey' => $phpData->apiKey
            ]);

            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user === false){
                echo json_encode([
                    "status" => "error",
                    "errorCode" => 401,
                    "timestamp" => time(),
                    "message" => "invalid apiKey",
                    "data" => null
                ]);
                die();
            }

            $statement = $database->prepare(
                'SELECT userID FROM USER 
                WHERE emailAddress = :email AND userID != :userID'
            );

            $statement->execute([
                ":email" => trim($phpData->email),
                ":userID" => $user["userID"]
            ]);

            if ($statement->fetch(PDO::FETCH_ASSOC) !== false){
                echo json_encode([
                    "status" => "error",
                    "errorCode" => 409,
                    "timestamp" => time(),
                    "message" => "email address already exists",
                    "data" => null
                ]);
                die();
            }

            $salt = bin2hex(random_bytes(32));
            $hashedPassword = hash_pbkdf2('sha256', $phpData->password, $salt, 100000, 64);
            $newApiKey = bin2hex(random_bytes(16)) . bin2hex(random_bytes(8)) . bin2hex(random_bytes(8));
            
            $statement = $database->prepare(
                'UPDATE USER SET emailAddress = :email, password = :password, salt = :salt, apiKey = :apiKey
                WHERE userID = :userID'
            );

            $statement->execute([
                ":email" => trim($phpData->email),
                ":password" => $hashedPassword,
                ":salt" => $salt,
                ":apiKey" => $newApiKey,
                ":userID" => $user["userID"]
            ]);

            echo json_encode([
                "status" => "success",
                "timestamp" => time(),
                "message" => "profile updated successfully",
                "data" => [
                    "userID" => $user["userID"],
                    "userType" => $user["userType"],
                    "apiKey" => $newApiKey
                ]
            ]);
            die();
        }
    }catch(PDOException $e){
        ///rolback if insert was unsuccessfull 
        if (isset($database) && $database->inTransaction()) {
            $database->rollBack();
            echo json_encode([
                "status" => "error",
                "errorCode" => 500,
                "timestamp" => time(),
                "message" => "error occured during insertion rollback executed",
                "data" => null
            ]);

            die();
        }

        echo json_encode([
            "status" => "error",
            "errorCode" => 500,
            "timestamp" => time(),
            "message" => $e->getMessage(),
            "data" => null
        ]);
    }

?>