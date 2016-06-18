<?php
/**
 * Created by PhpStorm.
 * User: Marius
 * Date: 5/8/2016
 * Time: 2:29 AM
 */

session_start();

$stationId = $_REQUEST['stationId'];
$userIdResult = $conn->query("select user_id from ec_users where username = '" . $_SESSION['username'] . "'")->fetch_assoc()['user_id'];
echo $userIdResult;

echo $_SESSION['username'];
if(isset($_SESSION['sessionId'])){
    if(isset($_SESSION['username'])){
        if(isset($_REQUEST['stationId'])){
          $sql = "insert into ec_users_has_favorite_station(user_id, station_id) values(" . $userIdResult . ",'" . $stationId ."')";
          echo $sql;
          $conn->query($sql);
        }else{
          /*
           * Getting favorite stations
          */
          $favoriteArray = array();
          $username = $_POST['username'];
          $userId = -1;
          $userIdResult = $conn->query("select user_id from ec_users where username = '" . $username . "'");

          if ($userIdResult->num_rows > 0) {
              // output data of each row
              while ($row = $userIdResult->fetch_assoc()) {
                  $userId = $row["user_id"];
              }
          } else {
              echo "ingen id";
          }
          if ($userId >= 0) {
              $sql = "select ec_users_has_favorite_station.user_id,station_id, ec_users.username from ec_users_has_favorite_station,ec_users
                  where ec_users.user_id = ec_users_has_favorite_station.user_id
                  and ec_users_has_favorite_station.user_id = " . $userId;
              $result = $conn->query($sql);

              if ($result->num_rows > 0) {
                  // output data of each row
                  while ($row = $result->fetch_assoc()) {
                      $favoriteArray[] = $row;
                  }
                  echo json_encode($favoriteArray);
              } else {
                  echo "[{}]";
              }
          } else {
              echo "[{'error':'Ugyldig id'}]";
          }
          $conn->close();
        }
    }
    else{
        echo "Du må være logget inn";
    }
}
else
    echo "Session er ikke satt";
?>
