<?php
/*
* A script to hold the DB connection
*/
$servername = "localhost";
$username = "root";//"bo16g6";
$password = "root";//"bgGGY5DB";

// Create connection
$conn = new mysqli($servername, $username, $password, "bo16g6");
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
