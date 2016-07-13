<?php
/*
*ALTER TABLE `bo16g6`.`ec_user`
*ADD COLUMN `settings` VARCHAR(255) NULL DEFAULT NULL AFTER `mail`;
*/
include 'dbConn.php';
session_start();
if (isset($_SESSION['user_id'])) {
  $sql = "UPDATE `ec_user` SET `settings`='". $_POST['settings'] ."' WHERE `user_id`='". $_SESSION['user_id'] ."';";
  echo 'query: '.$sql;
  $conn->query($sql);
  echo 'Settings are now saved';
}
 ?>
