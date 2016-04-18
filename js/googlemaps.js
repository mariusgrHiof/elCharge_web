/**
 * Created by jonas on 03.03.16.
 */
var map;
var geopos;
var markers = [];
var pathtest = [
    {lat: 36.579, lng: -118.292},  // Mt. Whitney
    {lat: 36.606, lng: -118.0638},  // Lone Pine
    {lat: 36.433, lng: -117.951},  // Owens Lake
    {lat: 36.588, lng: -116.943},  // Beatty Junction
    {lat: 36.34, lng: -117.468},  // Panama Mint Springs
    {lat: 36.24, lng: -116.832}];  // Badwater, Death Valley



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

    /*
    ** Search box header
     */

    // Create the search box and link it to the UI element.
    var input = document.getElementById('search-box');
    var searchBox = new google.maps.places.SearchBox(input);


    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds-changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    searchBox.addListener('places_changed', function(){
        var places = searchBox.getPlaces();

        if(places.length == 0) {
            return;
        }

        var bounds = new google.maps.LatLngBounds();


    });



    /*
    ** Search box startPos
     */

    var inputStartPos = document.getElementById('nav-start-pos');
    var searchBoxStartPos = new google.maps.places.SearchBox(inputStartPos);

    map.addListener('bounds-changed', function() {
        searchBoxStartPos.setBounds(map.getBounds());
    });

    /*
    ** Search box endPos
     */

    var inputEndPos = document.getElementById('nav-end-pos');
    var searchBoxEndPos = new google.maps.places.SearchBox(inputEndPos);

    map.addListener('bounds-changed', function() {
        searchBoxEndPos.setBounds(map.getBounds());
    });

    /*
    **
     */


    updateCarList();
    //Turning on layers
    trafficOverlay();
    weatherOverlay();
    cloudOverlay();
    geopos = [59.91673,10.74782]; // Defaulting to oslo incase geopos isn't possible
    console.log('el ' + getElevation(new google.maps.LatLng(-34.397, 150.644)));

    //Finding user location with geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            //Storing the user pos value
            geopos = [position.coords.latitude, position.coords.longitude];
            console.log("dadadad"+pos);
            map.setCenter(pos);
            currentPosMarker(pos);
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
    //Downloading station data
    downloadDump();

    //hallabruri(pathtest, elevationService, map);
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