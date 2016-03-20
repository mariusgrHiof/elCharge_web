<?php
addJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyAijAKyJWxMHEodrkA3jD2psiz6LmI0hT8&callback=initMap&sensors=true', true, true);
addJS('js/googlemaps.js');
addJS('js/login.js');
addJS('js/addStations.js');
addJS('js/addStations.js');
addJS('js/maplayers.js');
addJS('js/navigation.js');
addJS('js/buttons.js');
addJS('js/elevation.js');

//Script for adding scripts to the html
function addJS($src, $async, $defer){
    echo '<script src="'. $src .'"'. ($async? " async":"") . ($defer? " defer":"") .'> </script>';
}
?>
