<?php
/**
 * Created by PhpStorm.
 * User: Marius
 * Date: 5/12/2016
 * Time: 12:11 AM
 */
if (isset($_SESSION['sessionId'])) {

    include 'dbConn.php';
    $routeArray = array();
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

    $sql = "select ec_users_has_routes.route_id,
                ec_users_has_routes.user_id,
                ec_users_has_routes.routeName,
                ec_users_has_routes.route
            from ec_users_has_routes, ec_user
            where ec_user.user_id = ec_user_has_routes.user_id
            and ec_user_has_routes.user_id = " . $userId;

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // output data of each row
        while ($row = $result->fetch_assoc()) {
            $routeArray[] = $row;
        }

        echo json_encode($routeArray);
    } else {
        echo "ingen resultat";
    }
}
else{
    echo "session er ikke satt";
}
?>
