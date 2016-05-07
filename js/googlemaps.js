/**
 * Created by jonas on 03.03.16.
 */
var map;
var geopos;
var pos;
var myloc;
var markers = [];
var pathtest = [
    {lat: 36.579, lng: -118.292},  // Mt. Whitney
    {lat: 36.606, lng: -118.0638},  // Lone Pine
    {lat: 36.433, lng: -117.951},  // Owens Lake
    {lat: 36.588, lng: -116.943},  // Beatty Junction
    {lat: 36.34, lng: -117.468},  // Panama Mint Springs
    {lat: 36.24, lng: -116.832}];  // Badwater, Death Valley

var clusterStyles = [
    {
        textColor: 'black',
        url: 'icons/markercluster.svg',
        height: 50,
        width: 50
    },
    {
        textColor: 'black',
        url: 'icons/markercluster.svg',
        height: 50,
        width: 50
    },
    {
        textColor: 'black',
        url: 'icons/markercluster.svg',
        height: 50,
        width: 50
    }
];

var mcOptions = {gridSize: 50, maxZoom: 15, styles: clusterStyles};

function initMap() {
    initiatedMap = true;
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 59.91673, lng: 10.74782},
        zoom: 13,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_RIGHT
        },
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM
        },
        scaleControl: true,
        streetViewControl: true,
        panControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM
        }

    });

    //Street view controls
    var panoramaOptions = {
        addressControlOptions:{
            position: google.maps.ControlPosition.BOTTOM_CENTER
        }
    };
    var sw = map.getStreetView().setOptions(panoramaOptions);


    //sw.setAddressControlOptions({position: google.maps.ControlPosition.BOTTOM_CENTER});
    deviceTypeCheck();
    //Setting default map layer type to terrain
    map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
    elevationService = new google.maps.ElevationService;





    /*
     ** Search box header
     */

    // Create the search box and link it to the UI element.
    var input = document.getElementById('search-box');
    var searchBox = new google.maps.places.SearchBox(input);

    searchBox.setBounds(map.getBounds());


    // Bias the SearchBox results towards current map's viewport.
    /*map.addListener('bounds-changed', function() {
     searchBox.setBounds(map.getBounds());
     });*/

    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
    //Users current position marker
    var scaleSize = isIOS ? 120 : 15;
    var mi = {
        url: 'icons/my_pos_marker.svg',
        anchor: new google.maps.Point( (phonegap && !isIOS ? scaleSize/2 : scaleSize/10), (phonegap && !isIOS ? scaleSize/2 : scaleSize/10) ),
        origin: new google.maps.Point(0, 0),
        scaledSize: new google.maps.Size(scaleSize, scaleSize),
        size: new google.maps.Size(64, 64)
    };
    myloc = new google.maps.Marker({
        clickable: false,
        icon: mi,
        shadow: null,
        zIndex: 999,
        map: map
    });

    /*
     * Search box startPos
     */

    var inputStartPos = document.getElementById('nav-start-pos');
    var searchBoxStartPos = new google.maps.places.SearchBox(inputStartPos);

    searchBoxStartPos.setBounds(map.getBounds());

    /*
     ** Search box endPos
     */

    var inputEndPos = document.getElementById('nav-end-pos');
    var searchBoxEndPos = new google.maps.places.SearchBox(inputEndPos);

    searchBoxEndPos.setBounds(map.getBounds());

    updateCarList();
    //Turning on layers
    try{
        trafficOverlay();
    }catch(e){}

    //Finding user location with geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            //Storing the user pos value
            geopos = [position.coords.latitude, position.coords.longitude];
            map.setCenter(pos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // If the browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
        geopos = [59.91673,10.74782]; // Defaulting to oslo incase geopos isn't possible
    }
    //Downloading station data
    if(phonegap){
        //Safeguarding against timeout for the cordovaWebView
        setTimeout(
            document.addEventListener("deviceready", downloadDumpPG(), false), 2000
        );
    }
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);

    }
}
//Deleting all the markers
function deleteMarkers() {
    //Memory managenent
    setMapOnAll(null);
    markerListeners.length = 0;
    infoWindows.length = 0;
    chargers_nearby.length = 0;
    markers.length = 0;
}
function centerOnUser(){
    //Refreshing user pos
    if(!isMobile)//Only for desktop
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    map.setCenter(pos);
    map.setZoom(15);
}