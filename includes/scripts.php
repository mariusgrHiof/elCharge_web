<?php
//addJS('js/old/addStations.js', false, false);
addJS('js/modules/elevation.js', false, false);
addJS('js/modules/navigation.js', false, false);
addJS('js/modules/nearby.js', false, false);
addJS('js/modules/station.js', false, false);
addJS('js/modules/app.js', false, false);
//addJS('js/old/global.js', false, false);
addJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyAijAKyJWxMHEodrkA3jD2psiz6LmI0hT8&sensors=true&libraries=places,visualization,geometry&callback=app.init', true, true);
addJS('js/MarkerClusterer.js', false, false);
addJS('js/old/maplayers.js', false, false);

//addJS('js/old/googlemaps.js', false, false);
//addJS('js/old/login.js', false, false);
//addJS('js/old/chargers-nearby.js', false, false);
//addJS('js/old/buttons.js', false, false);

//Script for adding scripts to the html
function addJS($src, $async, $defer){
    echo '<script src="'. $src .'"'. ($async? " async":"") . ($defer? " defer":"") .'> </script>';
}
?>
