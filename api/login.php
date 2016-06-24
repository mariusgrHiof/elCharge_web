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
$hash = '';

// Create connection
try {
  include 'dbConn.php';
  /*
  $prepStatment = $conn->prepare("select * from ec_user where username=? and password =?");
  $prepStatment->bind_param("ss", $_POST['username'], $ecnryptedPass);
  $prepStatment->execute();*/

  $sqlLogin = "select * from ec_user where username='" . $_SESSION['username'] . "'";
  $result_login = $conn->query($sqlLogin);
  if ($result_login->num_rows > 0) {
    $stations = [];
    $routes = [];
    // output data of each row
    while ($row = $result_login->fetch_assoc()) {
      $_SESSION['user_id'] = $row['user_id'];
      $user['user_id'] = $row['user_id'];
      $user['username'] = $row['username'];
      $hash = $row['password'];
    }
    $result = $user;
    if(password_verify($_POST['password'], $hash) ){
      /*
       * Getting saved stations
      */
      $sqlStation = "SELECT * FROM ec_user_has_stations WHERE user_id = '" . $result['user_id'] . "'";
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
    }else{
      echo "0";
    }
  }else {
    //0 incase the login fails
    echo "0";
  }
}
catch (mysqli_sql_exception $ms){
  echo $ms;
}
