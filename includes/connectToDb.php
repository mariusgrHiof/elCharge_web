<?php
/**
 * Created by PhpStorm.
 * User: Marius
 * Date: 5/4/2016
 * Time: 4:37 PM
 */

$servername = "frigg.hiof.no";
$username = "bo16g6";
$password = "bgGGY5DB";

// Create connection
$conn = new mysqli($servername, $username, $password, $username);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}