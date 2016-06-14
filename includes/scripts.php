<?php
addJS('js/addStations.js', false, false);
addJS('js/station.js', false, false);
addJS('js/app.js', false, false);
addJS('js/global.js', false, false);
addJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyAijAKyJWxMHEodrkA3jD2psiz6LmI0hT8&sensors=true&libraries=places,visualization,geometry&callback=app.init', true, true);
addJS('js/googlemaps.js', false, false);
addJS('js/login.js', false, false);
addJS('js/chargers-nearby.js', false, false);
addJS('js/MarkerClusterer.js', false, false);
addJS('js/maplayers.js', false, false);
addJS('js/navigation.js', false, false);
addJS('js/buttons.js', false, false);
addJS('js/elevation.js', false, false);

//Script for adding scripts to the html
function addJS($src, $async, $defer){
    echo '<script src="'. $src .'"'. ($async? " async":"") . ($defer? " defer":"") .'> </script>';
}
?>
