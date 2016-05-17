<?php
/**
 * Created by PhpStorm.
 * User: Marius
 * Date: 5/12/2016
 * Time: 12:11 AM
 */
if (isset($_SESSION['sessionId'])) {

    include 'connectToDb.php';
    $routeArray = array();
    $username = $_POST['username'];
    $userId = -1;


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

    $sql = "select ec_users_has_favorite_route.route_id,
                ec_users_has_favorite_route.user_id,
                ec_users_has_favorite_route.routeName,
                ec_users_has_favorite_route.route

            from ec_users_has_favorite_route, ec_users
            where ec_users.user_id = ec_users_has_favorite_route.user_id
            and ec_users_has_favorite_route.user_id = " . $userId;


    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // output data of each row


        while ($row = $result->fetch_assoc()) {
            $routeArray[] = $row;
            //echo json_encode($row);
        }

        echo json_encode($routeArray);

        //Srkive favoritt stasjoner til en json fil
        /*$jsonFile = fopen("../FavoriteStations.json","w");
        fwrite($jsonFile,json_encode($favoriteArray));
        fclose($jsonFile);*/


    } else {
        echo "ingen resultat";
    }
}
else{
    echo "session er ikke satt";
}

?>