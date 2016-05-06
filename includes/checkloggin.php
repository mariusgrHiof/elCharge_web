<?php
/**
 * Created by PhpStorm.
 * User: Marius
 * Date: 3/30/2016
 * Time: 4:23 PM
 */
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


session_start();

$_SESSION['UserId'] = rand(1,99);
$ecnryptedPass = md5($_POST['password']);

// Create connection

try {


    include 'connectToDb.php';

    $prepStatment = $conn->prepare("select * from ec_users where username=? and password =?");

    $prepStatment->bind_param("ss", $_POST['username'], $ecnryptedPass);

    $prepStatment->execute();


    if ($row = $prepStatment->fetch()) {
        include 'favoriteStation.php';

    } else {
        echo "Feil brukernavn eller passord";

    }



}
catch (mysqli_sql_exception $ms){
    echo $ms;
}


