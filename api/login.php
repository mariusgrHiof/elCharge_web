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

    $prepStatment = $conn->prepare("select * from ec_user where username=? and password =?");
    $prepStatment->bind_param("ss", $_POST['username'], $ecnryptedPass);
    $prepStatment->execute();
    if ($row = $prepStatment->fetch()) {
        //$station = include_once 'getUserStations.php';
        $stations = [];
        $routes = [];
        $result['username'] = $_POST['username'];
        /*
         * Getting saved stations
        */
        $sql = "select ec_user_has_stations.user_id,station_id, ec_users.username from ec_user_has_stations,ec_user
            where ec_user.user_id = ec_user_has_stations.user_id
            and ec_user_has_stations.user_id = " . $userId;
        $result_stations = $conn->query($sql);
        if ($result->num_rows > 0) {
            // output data of each row
            while ($row = $result->fetch_assoc()) {
                $stations[] = $row;
            }
        }
        $result['stations'] = $stations;

        /*
         * Getting saved routes
         */
        $sql = "select ec_user_has_routes.user_id,route_id, ec_users.username from ec_user_has_routes, ec_user
            where ec_user.user_id = ec_user_has_routes.user_id
            and ec_user_has_routes.user_id = " . $userId;
        $result_stations = $conn->query($sql);
        if ($result->num_rows > 0) {
            // output data of each row
            while ($row = $result->fetch_assoc()) {
                $stations[] = $row;
            }
        }
        $result['routes'] = $routes;

        echo json_encode($result);
    } else {
        echo "0";
    }
}
catch (mysqli_sql_exception $ms){
    echo $ms;
}
