<?php
/**
 * Created by PhpStorm.
 * User: Marius
 * Date: 5/8/2016
 * Time: 2:29 AM
 * ini_set('display_errors', 1);
 * ini_set('display_startup_errors', 1);
 * error_reporting(E_ALL);
 */

include 'dbConn.php';
session_set_cookie_params(7200,"/");
session_start();

if (!isset($_SESSION['user_id'])) {
  $_SESSION['sessionId'] = uniqid();
  $_SESSION['username'] = $_POST['username'];
  $_SESSION['logged_in'] = false;
  //Getting userID
  $sqlLogin = "select * from ec_user where username='" . filter_var($_SESSION['username'], FILTER_SANITIZE_STRING) . "'";
  $result_login = $conn->query($sqlLogin);
  if ($result_login->num_rows > 0) {
    $stations = [];
    $routes = [];
    // output data of each row
    while ($row = $result_login->fetch_assoc()) {
      $_SESSION['user_id'] = $row['user_id'];
      $hash = $row['password'];
    }
    if(password_verify($_POST['password'], $hash)){
      getUserData($conn);
    }else{
      echo "0";
    }
  }else {
    //0 incase the login fails
    echo "0";
  }
}else if($_SESSION['logged_in']){
  $result_login = $conn->query("select settings from ec_user where user_id='" . filter_var($_SESSION['user_id'], FILTER_SANITIZE_STRING) . "';");
  if ($result_login->num_rows > 0) {
    // output data of each row
    while ($row = $result_login->fetch_assoc()) {
      $result['settings'] = $row['settings'];
    }
  }
  getUserData($conn);
}else{
  echo '0';
}

$hash = '';

function getUserData($conn){
  $result['user_id'] = $_SESSION['user_id'];
  $result['username'] = $_SESSION['username'];
  $_SESSION['logged_in'] = true;

  /*
   * Getting saved stations
  */
  $sqlStation = "SELECT * FROM ec_user_has_stations WHERE user_id = '" . $_SESSION['user_id'] . "'";
  $result_stations = $conn->query($sqlStation);
  if ($result_stations->num_rows > 0) {
    while ($row = $result_stations->fetch_assoc()) {
      $stations[] = $row;
    }
  }
  $result['stations'] = $stations;

  /*
   * Getting saved routes
   */
   $sqlRoute = "select route_id, name, route, distance, comment from ec_user_has_routes where user_id = '". $result['user_id'] . "'";
   $result_routes = $conn->query($sqlRoute);
   if ($result_routes->num_rows > 0) {
     while ($row = $result_routes->fetch_assoc()) {
       $rows['comment'] = $row['comment'];
       $rows['distance'] = $row['distance'];
       $rows['route'] = json_decode($row['route']);
       $rows['route'] = json_decode($row['route']);
       $rows['name'] = $row['name'];
       $rows['route_id'] = $row['route_id'];
       $routes[] = $rows;
     }
   }
  $result['routes'] = $routes;
  echo json_encode($result);
}
