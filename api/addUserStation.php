<?php
/**
 * Created by PhpStorm.
 * User: Marius
 * Date: 5/8/2016
 * Time: 2:29 AM
 */

session_start();
include 'dbConn.php';

$stationId = $_REQUEST['stationId'];

$userIdResult = $conn->query("select user_id from ec_user where username = '" . $_SESSION['username'] . "'")->fetch_assoc()['user_id'];
echo $userIdResult;

echo $_SESSION['username'];
if(isset($_SESSION['sessionId'])){
    if(isset($_SESSION['username'])){
        $sql = "insert into ec_user_has_stations(user_id, station_id) values(" . $userIdResult . ",'" . $stationId ."')";
        echo $sql;
        $conn->query($sql);
    }
    else{
        echo "Du må være logget inn";
    }
}
else
    echo "Session er ikke satt";
?>
