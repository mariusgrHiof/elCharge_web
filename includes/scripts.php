<?php
addJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyAijAKyJWxMHEodrkA3jD2psiz6LmI0hT8&callback=initMap&sensors=true', true, true);
addJS('js/googlemaps.js', false, false);
addJS('js/login.js', false, false);
addJS('js/global.js', true, true);
addJS('js/geolocation-marker.js', true, true);
addJS('js/addStations.js', false, false);
addJS('js/maplayers.js', false, false);
addJS('js/navigation.js', false, false);
addJS('js/buttons.js', false, false);
addJS('js/elevation.js', false, false);

//Script for adding scripts to the html
function addJS($src, $async, $defer){
    echo '<script src="'. $src .'"'. ($async? " async":"") . ($defer? " defer":"") .'> </script>';
}
?>
