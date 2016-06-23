<?php
session_start();
include 'dbConn.php';

if(isset($_SESSION['sessionId'])){
    if(isset($_SESSION['username'])){
      $user['user_id'] = $_SESSION['user_id'];
      if($_REQUEST['action'] == 'delete'){
        //Delete logic
        $sql = 'DELETE FROM ec_user_has_routes ' .
        'WHERE user_id = "' . $user['user_id'] . '" AND route_id = "' . $_REQUEST['route_id'] . '";';
        echo $sql;
        $conn->query($sql);
      }else if($_REQUEST['action'] == 'edit'){
        //Edit logic goes here
      }else if($_REQUEST['action'] == 'add'){
        //Add logic
        //Getting the last route ID for the user
        $routeCount = $conn->query("select route_id from ec_user_has_routes WHERE user_id = '" . $user['user_id'] . "' ORDER BY route_id DESC limit 1;");
        if ($routeCount->num_rows > 0) {
          while ($row = $routeCount->fetch_assoc()) {
            $user['route_id'] = $row['route_id'] + 1;
          }
        }else{
          $user['route_id'] = 0;
        }
        $sql = "INSERT INTO ec_user_has_routes VALUES('" . $user['user_id'] . "','" . $user['route_id'] . "','" . $_POST['name'] ."','" . $_POST['route'] . "'," . $_POST['distance'] . ",'". $_POST['comment'] . "');";
        $conn->query($sql);
        echo '1';
      }
    }
}
?>
