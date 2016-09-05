<?php
header('content-type: application/json; charset=utf-8');
header("access-control-allow-origin: *");
session_set_cookie_params(7200,"/");
session_start();
include 'dbConn.php';

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
      deleteUser($conn);
    }
  }
}else if($_SESSION['logged_in']){
  $sql = "select * from ec_user where user_id='" . filter_var($_SESSION['user_id'], FILTER_SANITIZE_STRING) . "';";
  $result_login = $conn->query($sql);
  if ($result_login->num_rows > 0) {
    while ($row = $result_login->fetch_assoc()) {
      if($row['admin'] == 1){
        //The user is a admin and was already logged in
        deleteUser($conn);
      }
    }
  }
}else{
  session_destroy();
}
//TODO: Fix!
$hash = '';

function deleteUser($conn){
  //Deleting all route data
  $sql = 'DELETE FROM ec_user_has_routes ' . 'WHERE user_id = "' . $_GET['user_id'] . '";';
  $conn->query($sql);
  //Deleting all station data
  $sql = 'DELETE FROM ec_user_has_stations ' . 'WHERE user_id = "' . $_GET['user_id'] . '";';
  $conn->query($sql);
  //Delete logic
  $sql = 'DELETE FROM ec_user ' . 'WHERE user_id = "' . $_GET['user_id'] . '";';
  $conn->query($sql);

  $result = $conn->query('select * from ec_user;');
  if ($result->num_rows > 0) {
    // output data of each row
    while ($row = $result->fetch_assoc()) {
      $user['user_id'] = $row['user_id'];
      $user['username'] = $row['username'];
      $user['mail'] = $row['mail'];
      $rows[] = $user;
    }
    $data['data'] = $rows;
    echo json_encode($data);
  }
}
