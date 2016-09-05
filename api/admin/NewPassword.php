<?php
/*
* Script for the administration panel.
* The script is intended for changing a users password.
*/
header('content-type: application/json; charset=utf-8');
header("access-control-allow-origin: *");
session_set_cookie_params(7200,"/");
session_start();
include '../dbConn.php';

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
      newPassword($conn);
    }
  }
}else if($_SESSION['logged_in']){
  $sql = "select * from ec_user where user_id='" . filter_var($_SESSION['user_id'], FILTER_SANITIZE_STRING) . "';";
  $result_login = $conn->query($sql);
  if ($result_login->num_rows > 0) {
    while ($row = $result_login->fetch_assoc()) {
      if($row['admin'] == 1){
        //The user is a admin and was already logged in
        newPassword($conn);
      }
    }
  }
}else{
  session_destroy();
}

//Creating a new password for a user
function newPassword($conn){
  $username = filter_var($_GET['username'], FILTER_SANITIZE_STRING);
  $newPassword = $_GET['password'];
  $rePassword = $_GET['rePassword'];
  $currentResetKey = $conn->query("select reset_key from ec_user where username='" . $username . "';")->fetch_assoc()['reset_key'];
  try{
    if( $newPassword == $rePassword){
      $conn->query('UPDATE `ec_user` SET `password`=\''. password_hash(filter_var($newPassword, FILTER_SANITIZE_STRING), PASSWORD_DEFAULT) .'\' WHERE `username`=\''. $username .'\';');
    }else{
      echo json_encode('{"status":"ok"}');
    }
  }catch(Exception $e){
    echo json_encode('{"status":"failed"}');
  }
}
