<?php
/*
* A script to hold the DB connection
* If using the non local DB, you must be connected to the same network as the servername
* in order for it to work.
*/
$servername = "localhost";
$username = "root";//"bo16g6";
$password = "root";//"bgGGY5DB";

// Create connection
$conn = new mysqli($servername, $username, $password, "bo16g6");
$conn->set_charset("utf8");

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
