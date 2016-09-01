<?php
/**
 * Created by PhpStorm.
 * User: Marius
 * Date: 2/15/2016
 * Time: 12:04 AM
 */

include 'dbConn.php';

//Adding, updating or deleting users
$sql = "select user_id from ec_user";
$uIdExists = false;
$result = $conn->query($sql);

if($result->num_rows > 0){
  while(!$uIdExists){
    $id = uniqid(rand(), true);
    //TODO: Do this without array_key_exists as it is rather expensive and slow!
    if(!array_key_exists($id, $result)){
      $new_user_id = $id;
      $uIdExists = true;
    }
  }
}


if(!empty(($_POST['username'] && $_POST['password'] && $_POST['mail']))){
  $sql = "INSERT INTO ec_user
            VALUES (
            '" . $new_user_id . "',
            '". filter_var(strtolower($_POST['username']), FILTER_SANITIZE_STRING). "',
            '". password_hash(filter_var($_POST['password'], FILTER_SANITIZE_STRING), PASSWORD_DEFAULT) . "',
            '" . filter_var($_POST['mail'], FILTER_SANITIZE_STRING) . "',
            '{}',
            null,
            null,
            0
            )";
  if ($conn->query($sql) === TRUE) {
    echo "Registrering fullført";
  } else {
    echo "Brukernavn  eller mail er allerede registrert.";
  }
}else{
  echo 'Alle feltene var ikke fyllt ut';
}
$conn->close();
?>
