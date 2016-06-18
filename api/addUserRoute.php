<?php
/**
 * Created by PhpStorm.
 * User: Marius
 * Date: 5/11/2016
 * Time: 4:14 PM
 */

session_start();
include 'dbConn.php';

if(isset($_SESSION['sessionId'])){
    if(isset($_SESSION['username'])){
      $userIdResult = $conn->query("select user_id FROM ec_user WHERE username = '" . $_SESSION['username'] . "'");

      if ($userIdResult->num_rows > 0) {
          //Getting userID
          while ($row = $userIdResult->fetch_assoc()) {
            $user = $row;
          }
          //Getting the last route ID for the user
          $routeCount = $conn->query("select route_id from ec_user_has_routes WHERE user_id = '" . $user['user_id'] . "' ORDER BY route_id DESC limit 1;");
          if ($routeCount->num_rows > 0) {
            while ($row = $routeCount->fetch_assoc()) {
              $user['route_id'] = $row['route_id'] + 1;
            }
          }else{
            $user['route_id'] = 0;
          }
      }
        $sql = "INSERT INTO ec_user_has_routes VALUES('" . $user['user_id'] . "','" . $user['route_id'] . "','" . $_POST['name'] ."','" . $_POST['route'] . "','" . $_POST['comment'] . "');";

        $conn->query($sql);
    }
}
$conn->close();
?>
