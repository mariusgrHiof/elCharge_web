<?php
header('content-type: application/json; charset=utf-8');
header("access-control-allow-origin: *");
session_set_cookie_params(7200,"/");
session_start();
include 'dbConn.php';
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
}else {
  //0 incase the login fails
  echo "404";
}
