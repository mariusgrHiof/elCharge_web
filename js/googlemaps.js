/**
 * Created by jonas on 03.03.16.
 */
var map;
var geopos;
var pos;
var myloc;
var markers = [];

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

    deviceTypeCheck();
    //Setting default map layer type to terrain
    map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
    elevationService = new google.maps.ElevationService;
    try{
        //Search box header
        // Create the search box and link it to the UI element.
        var input = document.getElementById('search-box');
        var searchBox = new google.maps.places.SearchBox(input);

        searchBox.setBounds(map.getBounds());


        searchBox.addListener('places_changed', function() {
            var places = searchBox.getPlaces();

            if (places.length == 0)
                return;

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
    }catch(e){console.log(e);}

    //Users current position marker
    var scaleSize = isIOS ? 120 : 15;
    var mi = {
        url: 'icons/my_pos_marker.svg',
        anchor: new google.maps.Point( (phonegap && !isIOS ? scaleSize/2 : scaleSize/20), (phonegap && !isIOS ? scaleSize/2 : scaleSize/20) ),
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

    try{
        //Search box startPos
        var inputStartPos = document.getElementById('nav-start-pos');
        var searchBoxStartPos = new google.maps.places.SearchBox(inputStartPos);
        searchBoxStartPos.setBounds(map.getBounds());
        //Search box endPos
        var inputEndPos = document.getElementById('nav-end-pos');
        var searchBoxEndPos = new google.maps.places.SearchBox(inputEndPos);
        searchBoxEndPos.setBounds(map.getBounds());
    }catch(e){}

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
    if(phonegap)
        //Safeguarding against timeout for the cordovaWebView
        setTimeout(document.addEventListener("deviceready", onDeviceReady, false), 2000);
    if(isMobile)
        setInterval(function () {
            //Updating the "nearby chargers" list for all mobile devices (web and app)
            updateNearbyChargers();
            updateFavoriteStations();
        }, 1000);

    window.addEventListener("resize",function(){
        google.maps.event.trigger(map, 'resize');
    }, false);
}

function onDeviceReady(){
    if(isIOS)
        downloadDump();
    else
        downloadDumpPG();
    document.addEventListener("backbutton", slideIn, false);

    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);

    function onPause() {
    }

    function onResume() {
    }
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i in markers) {
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
function centerOnUser(camtilt){
    //Refreshing user pos
    if(!isMobile)//Only for desktop
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    //Applying wanted cam tilt
    if (map.getTilt()) {
        map.setTilt(camtilt);
    }
    map.setCenter(pos);
    map.setZoom(18);
}


/**
 * Created by jonas on 23.04.2016.
 */
var phonegap = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1; //true;
var isMobile = false;
var isAndroid = false;
var isIOS = false;
var accuracyRadius;
var lockPos = false;

var onSuccess = function(position) {
    geopos = [position.coords.latitude, position.coords.longitude];
    try{
        pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        myloc.setPosition(pos);
        if(isMobile){
            if(accuracyRadius != null)
                accuracyRadius.setMap(null);
            accuracyRadius = new google.maps.Circle({
                strokeColor: '#00d8ff',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#00d8ff',
                fillOpacity: 0.35,
                map: map,
                center: pos,
                radius: position.coords.accuracy
            });
        }
        if(lockPos)
            centerOnUser(45);
    }catch(e){}
}
function onError(error) {
    if (window.location.protocol != "https:" && !phonegap)
        window.location.href = "https:" + window.location.href.substring(window.location.protocol.length);
    console.log('code: '    + error.code    + '\n' +
        'message: ' + error.message + '\n');
}

/**
 * Checking if device type is mobile
 */
function deviceTypeCheck() {
    var mobile = window.matchMedia("only screen and (max-width: 600px)");
    if (mobile.matches) {
        //Allowing us to have a absolute position on the map rather than relative (default)
        isMobile = true;
        $('#map').css("position","absolute");
    }
    // if iPod / iPhone, display install app prompt
    if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i) ||
        navigator.userAgent.match(/android/i)) {
        if (navigator.userAgent.match(/android/i)) {
            //Android spesific logic
            isAndroid = true;
        }else{
            //iOS spesific logic
            isIOS = true;
        }
    }
    if(phonegap)
        $('head').append('<script type="text/javascript" src="cordova.js"></script>');
    if(phonegap && isIOS){
        console.log("Phonegap && isIOS");
        $('head').append('<link rel="stylesheet" type="text/css" href="styles/ios.css">');
    }else if(isAndroid){
        console.log("isAndroid");
        $('head').append('<link rel="stylesheet" type="text/css" href="styles/android.css">');
    }
}