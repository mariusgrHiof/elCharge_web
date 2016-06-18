<?php
/**
 * Created by PhpStorm.
 * User: Marius
 * Date: 5/8/2016
 * Time: 2:29 AM
 */
session_start();

$_SESSION['sessionId'] = uniqid();
$_SESSION['username'] = $_POST['username'];
$ecnryptedPass = md5($_POST['password']);

// Create connection
try {
    include 'dbConn.php';

    $prepStatment = $conn->prepare("select * from ec_users where username=? and password =?");
    $prepStatment->bind_param("ss", $_POST['username'], $ecnryptedPass);
    $prepStatment->execute();
    if ($row = $prepStatment->fetch()) {
        $stations = include_once 'favoriteStation.php';
    } else {
        echo "[{}]";
    }
}
catch (mysqli_sql_exception $ms){
    echo $ms;
}
