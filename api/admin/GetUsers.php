<?php
/*
* Script for the administration panel.
* The script is intended for requests for user data
*/
//Headers
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
      getUsers($conn);
    }
  }
}else if($_SESSION['logged_in']){
  $sql = "select * from ec_user where user_id='" . filter_var($_SESSION['user_id'], FILTER_SANITIZE_STRING) . "';";
  $result_login = $conn->query($sql);
  if ($result_login->num_rows > 0) {
    while ($row = $result_login->fetch_assoc()) {
      if($row['admin'] == 1){
        //The user is a admin and was already logged in
        getUsers($conn);
      }
    }
  }
}else{
  session_destroy();
}
getUsers($conn);//TODO: REMOVE!
$hash = '';

function getUsers($conn){
  $result = $conn->query('select * from ec_user;');
  if ($result->num_rows > 0) {
    // output data of each row
    while ($row = $result->fetch_assoc()) {
      $user['user_id'] = $row['user_id'];
      $user['username'] = $row['username'];
      $user['mail'] = $row['mail'];
      $user['admin'] = $row['admin'];
      $rows[] = $user;
    }
    $data['data'] = $rows;
    echo json_encode($data);
  }
}
