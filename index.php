<?php
/**
 * Created by PhpStorm.
 * User: jonas
 * Date: 03.03.16
 * Time: 07:57
 * Google Maps API key: AIzaSyAijAKyJWxMHEodrkA3jD2psiz6LmI0hT8
 * NobilAPI: 274b68192b056e268f128ff63bfcd4a4
 * get all: http://nobil.no/api/server/datadump.php?apikey=274b68192b056e268f128ff63bfcd4a4&format=json&file=false
 * search box: https://developers.google.com/maps/documentation/javascript/examples/places-searchbox
 */
include 'ReadStuff.php';
?>

<!DOCTYPE html>
<html>
<?php include 'includes/head.php';?>
<body>
<?php
include 'includes/GetDownloadProgress.php';
include 'includes/login.php';
include 'includes/userwindow.php';
//Adding the header & menu elements (Menu is included in the header.php)
include 'includes/header.php';
include 'includes/map.php';
include 'includes/scripts.php';
?>
</body>
</html>
<?php
$mobileSite = "";
$path = "index.php";
$index ="index.html";
if(!file_exists($index)){
    //Downloading data dump if not already downloaded
    file_put_contents($index, $mobileSite);
}
?>