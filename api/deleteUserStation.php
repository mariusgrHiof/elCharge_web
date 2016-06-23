<?php
session_start();
include 'dbConn.php';

if(isset($_SESSION['sessionId'])){
    if(isset($_SESSION['username'])){
        $sql = 'DELETE FROM ec_user_has_stations ' .
        'WHERE user_id = "' . $_SESSION['user_id'] . '" AND station_id = "' . $_REQUEST['stationId'] . '";';
        echo $sql;
        $conn->query($sql);
    }
}
?>
