<?php
/**
 * Created by PhpStorm.
 * User: Marius
 * Date: 2/15/2016
 * Time: 12:04 AM
 */

$servername ="frigg.hiof.no";
$username ="bo16g6";
$password ="bgGGY5DB";


// Create connection
$conn = new mysqli($servername, $username, $password, $username);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
//echo "Connected successfully";


//Eksempelkode for query:
//Adding, updating or deleting users
$sql = "select count(*) from ec_users";
$result = $conn->query($sql);


if($result->num_rows > 0){
    while($row = $result->fetch_assoc()){
        $new_user_id = ($row['count(*)'] == 0 ? $row['count(*)'] : $row['count(*)']);
    }
}

if(!empty(($_POST['username'] && $_POST['password']))){
    $sql = "INSERT INTO ec_users
                    VALUES (
                    " . $new_user_id . ",
                    '". $_POST['username']. "',
                    '". md5($_POST['password']) . "'
                    )";
    if ($conn->query($sql) === TRUE) {
        echo "User added successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

}

$conn->close();


?>