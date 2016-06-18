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
    $userId = -1;
    $userIdResult = $conn->query("select user_id from ec_user where username = '" . $username . "'");

    if ($userIdResult->num_rows > 0) {
        // output data of each row
        while ($row = $userIdResult->fetch_assoc()) {
            $userId = $row["user_id"];
        }
    } else {
        echo "ingen id";
    }
    if ($userId >= 0) {
        $sql = "select ec_user_has_stations.user_id,station_id, ec_users.username from ec_user_has_stations,ec_user
            where ec_user.user_id = ec_user_has_stations.user_id
            and ec_user_has_stations.user_id = " . $userId;
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
    } else {
        echo "[{'error':'Ugyldig id'}]";
    }
    $conn->close();
} else {
    echo "Sessionsid ikke satt";
}
