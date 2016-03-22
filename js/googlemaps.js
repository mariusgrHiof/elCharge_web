/**
 * Created by jonas on 03.03.16.
 */
var map;
var markers = [];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 59.91673, lng: 10.74782},
        zoom: 13,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_CENTER
        },
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
        },
        scaleControl: true,
        streetViewControl: true,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM
        }

    });
    //Setting default map layer type to terrain
    map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
    elevationService = new google.maps.ElevationService;

    updateCarList();
    //Turning on layers
    trafficOverlay();
    weatherOverlay();
    cloudOverlay();
    console.log('el ' + getElevation(new google.maps.LatLng(-34.397, 150.644)));

    //Finding user location with geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(pos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
        //Showing current user location
        /**TODO: Fix! -> var GeoMarker = new GeolocationMarker(map);
         * url: https://chadkillingsworth.github.io/geolocation-marker/
         * alt url: https://toddmotto.com/using-html5-geolocation-to-show-current-location-with-google-maps-api/
         */
    } else {
        // If the browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
    //Adding markers
    generateMarkers();
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}
//Deleting all the markers
function deleteMarkers() {
    setMapOnAll(null);
    markers = [];
}