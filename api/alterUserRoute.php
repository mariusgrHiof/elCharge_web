<?php
session_start();
include 'dbConn.php';

if(isset($_SESSION['sessionId'])){
    if(isset($_SESSION['username'])){
      if($_REQUEST['action'] == 'delete'){
        $sql = 'DELETE FROM ec_user_has_routes ' .
        'WHERE user_id = "' . $_SESSION['user_id'] . '" AND route_id = "' . $_REQUEST['route_id'] . '";';
        echo $sql;
        $conn->query($sql);
      }else if($_REQUEST['action'] == 'edit'){

      }
    }
}
?>
