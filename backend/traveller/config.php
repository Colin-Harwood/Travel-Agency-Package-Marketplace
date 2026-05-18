<?php

$envFile = __DIR__ . '/env.php';
if (!file_exists($envFile)) {
    die("Environment file is missing. Please create env.php");
}
$env = require $envFile;
// 1 for dev, set 0 for prod
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

date_default_timezone_set('Africa/Johannesburg'); 

define('BASE_URL', 'localhost');

$db_host = 'localhost';
$db_name = 'tripistry_data';
$db_user = 'root'; 
$db_pass = $env['DB_PASS'];

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $conn = new mysqli($db_host, $db_user, $db_pass, $db_name);
    
    $conn->set_charset("utf8mb4");
    
} catch (mysqli_sql_exception $e) {
    // stop execution completely if database is down
    die("Database Connection Failed: " . $e->getMessage());
}

// 7. SESSION START (For your web pages, if needed later)
// if (session_status() === PHP_SESSION_NONE) {
//     session_start();
// }
?>