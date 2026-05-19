<?php 
$host = "localhost";
$db = "tripistry_data";
$user = "root";
$password = "";

$conn = new mysqli($host, $user, $password, $db, 3307);

if($conn->connect_error){
    die(json_encode([
        "status" => "error",
        "timestamp" => time(),
        "data" => "Database connection failed: ". $conn->connect_error
    ]));
}

$conn->set_charset("utf8mb4");
?>