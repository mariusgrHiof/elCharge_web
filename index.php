<?php
/**
 * Created by PhpStorm.
 * User: jonas
 * Date: 03.03.16
 * Time: 07:57
 * Google Maps API key: AIzaSyAijAKyJWxMHEodrkA3jD2psiz6LmI0hT8
 */

?>

<!DOCTYPE html>
<html>
<head>
    <title>elCharge - ladekart for elbiler</title>
    <meta name="viewport" content="initial-scale=1.0">
    <meta charset="utf-8">
    <link rel="stylesheet" type="text/css" href="styles/menu.css"/>
    <link rel="stylesheet" type="text/css" href="styles/footer.css"/>
    <link rel="stylesheet" type="text/css" href="styles/maps.css"/>
</head>
<body>

<?php include 'includes/header.php'?>

<div id="map"></div>

<script>
    <?php
        //TODO: Fix it so that it works to just include the file the normal way.
        //including the content of the googlemaps javascript file
        include 'js/googlemaps.js'
    ?>
</script>

<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAijAKyJWxMHEodrkA3jD2psiz6LmI0hT8&callback=initMap"
        async defer></script>

<?php include 'includes/footer.php'?>
</body>
</html>