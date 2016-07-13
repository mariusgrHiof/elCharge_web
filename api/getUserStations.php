<?php
/**
 * Created by PhpStorm.
 * User: Marius
 * Date: 5/4/2016
 * Time: 3:33 PM
 */

if (isset($_SESSION['sessionId'])) {
    include 'dbConn.php';
    $favoriteArray = array();
    $username = $_POST['username'];
    $sql = "select ec_user_has_stations.user_id,station_id, ec_users.username from ec_user_has_stations,ec_user
        where ec_user.user_id = ec_user_has_stations.user_id
        and ec_user_has_stations.user_id = " . $_SESSION['user_id'];
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // output data of each row
        while ($row = $result->fetch_assoc()) {
            $favoriteArray[] = $row;
        }
        echo json_encode($favoriteArray);
    } else {
        echo "";
    }
    $conn->close();
} else {
    echo "Sessionsid ikke satt";
}
