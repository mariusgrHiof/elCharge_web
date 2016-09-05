<?php
/**
 * Created by PhpStorm.
 * User: Marius
 * Date: 5/8/2016
 * Time: 2:29 AM
 */

session_start();
include 'dbConn.php';

if(isset($_SESSION['sessionId'])){
    if(isset($_SESSION['username'])){
        $sql = 'INSERT INTO ec_user_has_stations VALUES'.
        '("' . $_SESSION['user_id'] . '","' . $_REQUEST['stationId'] .'")';
        $conn->query($sql);
    }
}
?>
