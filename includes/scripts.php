<?php
addJS('js/app/elevation.js', false, false);
addJS('js/app/navigation.js', false, false);
addJS('js/app/nearby.js', false, false);
addJS('js/app/station.js', false, false);
addJS('js/app/app.js', false, false);
addJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyAijAKyJWxMHEodrkA3jD2psiz6LmI0hT8&sensors=true&libraries=places,visualization,geometry&callback=app.init', true, true);
addJS('js/MarkerClusterer.js', false, false);
addJS('js/old/maplayers.js', false, false);

//Script for adding scripts to the html
function addJS($src, $async, $defer){
    echo '<script src="'. $src .'"'. ($async? " async":"") . ($defer? " defer":"") .'> </script>';
}
?>
