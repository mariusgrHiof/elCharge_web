<?php
header('content-type: application/json; charset=utf-8');
header("access-control-allow-origin: *");
session_set_cookie_params(7200,"/");
session_start();
include 'dbConn.php';
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
}else {
  //0 incase the login fails
  echo "404";
}
