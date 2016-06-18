<?php
  ini_set('display_errors', 1);
  ini_set('display_startup_errors', 1);
  error_reporting(E_ALL);
  include 'dbConn.php';

  $sqlRoute = "select route_id, name, route, comment from ec_user_has_routes where user_id = '0'";
  $result_routes = $conn->query($sqlRoute);
  if ($result_routes->num_rows > 0) {
      // output data of each row

      while ($row = $result_routes->fetch_assoc()) {
          $rows['route_id'] = $row['route_id'];
          $rows['name'] = $row['name'];
          $rows['route'] = json_decode($row['route']);
          $rows['comment'] = $row['comment'];

          $routes[] = $rows;
      }
  }
  echo json_encode($routes);
 ?>
