<?php

//headers
header('content-type: application/json; charset=utf-8');
header("access-control-allow-origin: *");
header("Access-Control-Allow-Headers: *");

include '../dbConn.php';
session_set_cookie_params(7200,"/");
session_start();
if (!isset($_SESSION['user_id'])) {
  //Getting userID
  $sqlLogin = "select * from ec_user where username='" . filter_var($_GET['username'], FILTER_SANITIZE_STRING) . "';";
  $result_login = $conn->query($sqlLogin);
  if ($result_login->num_rows > 0) {
    // output data of each row
    while ($row = $result_login->fetch_assoc()) {
      $result['username'] = $row['username'];
      $isAdmin = $row['admin'];
      $hash = $row['password'];
    }
    if(password_verify($_GET['password'], $hash) && $isAdmin == 1){
      actOnCars($conn);
    }
  }
}else if($_SESSION['logged_in']){
  $sql = "select * from ec_user where user_id='" . filter_var($_SESSION['user_id'], FILTER_SANITIZE_STRING) . "';";
  $result_login = $conn->query($sql);
  if ($result_login->num_rows > 0) {
    while ($row = $result_login->fetch_assoc()) {
      if($row['admin'] == 1){
        //The user is a admin and was already logged in
        actOnCars($conn);
      }
    }
  }
}else{
  session_destroy();
}
$hash = '';

function actOnCars($conn){
  if($_GET['action'] == 'update'){
    //Update Car
    $conn->query('UPDATE `ec_cars` SET `json`=\'' . $_GET['json'] .'\' WHERE `model`=\''. $_GET['model'] .'\';');
  }else if($_GET['action'] == 'add'){
    //Add car
    $car['model'] = $_GET['model'];
    $car['conns'] = [];
    $conn->query('INSERT INTO ec_cars VALUES ("' . $_GET['model'] . '",\''. json_encode($car) .'\');');
  }else if($_GET['action'] == 'delete'){
    //Delete car
    $conn->query('DELETE FROM ec_cars ' . 'WHERE model = "' . $_GET['model'] . '";');
  }
  //Returning the current state of the DB back
  $query = $conn->query('SELECT * FROM bo16g6.ec_cars;');
  if ($query->num_rows > 0) {
    while ($row = $query->fetch_assoc()) {
      $result[] = json_decode($row['json']);
    }
    $r['data'] = $result;
    echo json_encode($r);
  }
}
