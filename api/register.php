<?php
/**
 * Created by PhpStorm.
 * User: Marius
 * Date: 2/15/2016
 * Time: 12:04 AM
 */

include 'dbConn.php';

//Adding, updating or deleting users
$sql = "select count(*) from ec_user";
$result = $conn->query($sql);

if($result->num_rows > 0){
    while($row = $result->fetch_assoc()){
        $new_user_id = ($row['count(*)'] == 0 ? $row['count(*)'] : $row['count(*)']);
    }
}
if(!empty(($_POST['username'] && $_POST['password'] && $_POST['mail']))){
    $sql = "INSERT INTO ec_user
                    VALUES (
                    " . $new_user_id . ",
                    '". $_POST['username']. "',
                    '". md5($_POST['password']) . "',
                    '" . $_POST['mail'] . "'
                    )";
    if ($conn->query($sql) === TRUE) {
        echo "Registrering fullført";
    } else {
        echo "Brukernavn allerede registrert, velg et annet brukernavn";
    }
}
$conn->close();
?>
