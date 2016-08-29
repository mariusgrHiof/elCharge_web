<?php
//Headers
header('content-type: application/json; charset=utf-8');
header("access-control-allow-origin: *");
header("Access-Control-Allow-Headers: *");

include 'dbConn.php';
session_set_cookie_params(7200,"/");
session_start();

if (!isset($_SESSION['user_id'])) {
  $_SESSION['sessionId'] = uniqid();
  $_SESSION['username'] = strtolower($_POST['username']);
  $_SESSION['logged_in'] = false;
  //Getting userID
  $sqlLogin = "select * from ec_user where username='" . filter_var($_SESSION['username'], FILTER_SANITIZE_STRING) . "'";
  $result_login = $conn->query($sqlLogin);
  if ($result_login->num_rows > 0) {
    // output data of each row
    while ($row = $result_login->fetch_assoc()) {
      $_SESSION['user_id'] = $row['user_id'];
      $result['username'] = $row['username'];
      $hash = $row['password'];
    }
    if(password_verify($_POST['password'], $hash) && $row['admin'] === 1){
      //The user is a admin and typed in the correct password
      $_SESSION['logged_in'] = true;
      echo json_encode($result);
    }else{
      echo '';
    }
  }else {
    echo json_encode($result);
  }
}else if($_SESSION['logged_in']){
  $result_login = $conn->query("select settings from ec_user where user_id='" . filter_var($_SESSION['user_id'], FILTER_SANITIZE_STRING) . "';");
  if ($result_login->num_rows > 0) {
    // output data of each row
    while ($row = $result_login->fetch_assoc()) {
      if($row['admin'] === 1){
        //The user is a admin and was already logged in
        $_SESSION['logged_in'] = true;
        $result['username'] = $row['username'];
        echo json_encode($result);
      }else{
        echo json_encode($result);
      }
    }
  }
}else{
  session_destroy();
  echo '2';
}

$hash = '';