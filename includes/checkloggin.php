<?php
/**
 * Created by PhpStorm.
 * User: Marius
 * Date: 3/30/2016
 * Time: 4:23 PM
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

    $prepStatment = $conn->prepare("select * from ec_users where username=? and password =?");

    $prepStatment->bind_param("ss", $_POST['username'],md5($_POST['password']));

    $prepStatment->execute();



    if($row = $prepStatment->fetch()){
        echo "Velkommen, " . $_POST['username'] . ", profil";
    }
    else{
        echo "Feil brukernavn eller passord";
    }



