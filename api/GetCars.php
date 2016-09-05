<?php

//headers
header('content-type: application/json; charset=utf-8');
header("access-control-allow-origin: *");
header("Access-Control-Allow-Headers: *");

include 'dbConn.php';

$query = $conn->query('SELECT * FROM bo16g6.ec_cars;');
if ($query->num_rows > 0) {
  while ($row = $query->fetch_assoc()) {
    $result[] = json_decode($row['json']);
  }
  $r['data'] = $result;
  echo json_encode($r);
}
