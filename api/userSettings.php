/*
ALTER TABLE `bo16g6`.`ec_user`
ADD COLUMN `settings` VARCHAR(255) NULL DEFAULT NULL AFTER `mail`;
*/
<?php
include 'dbConn.php';
session_start();
if (!isset($_SESSION['user_id'])) {
  $conn->query("UPDATE `ec_user` SET `settings`='". $_POST['settings'] ."' WHERE `user_id`='". $_SESSION['user_id'] ."';");
  echo 'Settings are now saved';
}
 ?>
