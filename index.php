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
    <style rel="stylesheet" type="text/css" href="styles/menu.css"/>
    <style rel="stylesheet" type="text/css" href="styles/maps.css"/>
</head>
<body>
<header>
    <h1>elCharge</h1>
</header>
<div id="map"></div>
<script>
    var map;
    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: -34.397, lng: 150.644},
            zoom: 8
        });
    }
</script>
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAijAKyJWxMHEodrkA3jD2psiz6LmI0hT8&callback=initMap"
        async defer></script>
</body>
</html>