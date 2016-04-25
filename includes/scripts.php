<?php
echo '<script type="text/javascript" src="cordova.js"></script>'.
        '<script type="text/javascript" src="js/index.js"></script>';
addJS('js/include.js', false, false);
addJS('js/addStations.js', false, false);
addJS('js/global.js', false, false);
addJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyAijAKyJWxMHEodrkA3jD2psiz6LmI0hT8&callback=initMap&sensors=true&libraries=places,visualization,geometry', true, true);
addJS('js/googlemaps.js', false, false);
addJS('js/login.js', false, false);
addJS('js/geolocation-marker.js', false, false);
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
