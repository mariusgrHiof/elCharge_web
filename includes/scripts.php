<?php
//echo '<script type="text/javascript" src="cordova.js"></script>'.
//        '<script type="text/javascript" src="js/index.js"></script>';
addJS('js/include.js', false, false);
addJS('js/addStations.js', true, false);
addJS('js/global.js', true, false);
addJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyAijAKyJWxMHEodrkA3jD2psiz6LmI0hT8&callback=initMap&sensors=true&libraries=places,visualization,geometry', true, true);
addJS('js/googlemaps.js', true, false);
addJS('js/login.js', true, false);
addJS('js/geolocation-marker.js', false, false);
addJS('js/chargers-nearby.js', true, false);
addJS('js/MarkerClusterer.js', false, false);
addJS('js/maplayers.js', true, false);
addJS('js/navigation.js', true, false);
addJS('js/buttons.js', true, false);
addJS('js/elevation.js', true, false);



//Script for adding scripts to the html
function addJS($src, $async, $defer){
    echo '<script src="'. $src .'"'. ($async? " async":"") . ($defer? " defer":"") .'> </script>';
}
?>
