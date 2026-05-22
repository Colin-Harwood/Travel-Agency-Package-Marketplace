<?php
    setcookie("userID", "", time() - 3600, "/");
    setcookie("userType", "", time() - 3600, "/");
    setcookie("apiKey", "", time() - 3600, "/");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Logging out...</title>
</head>
<body>
    <script>
        localStorage.removeItem("userID");
        localStorage.removeItem("userType");
        localStorage.removeItem("apiKey");

        window.location.href = "loginAgency.php";
    </script>
</body>
</html>
