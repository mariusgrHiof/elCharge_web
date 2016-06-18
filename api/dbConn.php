<?php
/*
* A script to hold the DB connection
*/
$servername = "localhost";
$username = "bo16g6";
$password = "bgGGY5DB";

// Create connection
$conn = mysql_connect($servername, $username, $password, $username);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
