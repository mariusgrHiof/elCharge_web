<?php
/**
 * Created by PhpStorm.
 * User: Marius
 * Date: 5/11/2016
 * Time: 4:14 PM
 */

session_start();
include 'dbConn.php';

$userIdResult = $conn->query("select user_id from ec_user where username = '" . $_SESSION['username'] . "'")->fetch_assoc()['user_id'];
echo $userIdResult;
echo $_SESSION['username'];

if(isset($_SESSION['sessionId'])){
    if(isset($_SESSION['username'])){
        $sql = "insert into ec_user_has_routes(route_id,user_id, routeName, route) values(0," . $userIdResult . ",'" . "Rutenavn" ."','" . $_POST['data'] . "');";
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
