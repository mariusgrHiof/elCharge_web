/**
 * Created by jonas on 16.03.16.
 * source: https://developers.google.com/maps/documentation/javascript/examples/directions-draggable
 */

var waypoints = [];//[{location: 'Lillestrøm, Norway'}, {location: 'Moss, Norway'}];
var startDestination = "";
var endDestination ="";
var directionsDisplay;
var directionsService;
function navigate(){
    //Cleaning previous directions
    if(directionsDisplay != null){
        directionsDisplay.setMap(null);//The route in the map
    }
    if(document.getElementById('right-panel').innerHTML != null){
        document.getElementById('right-panel').innerHTML = ""; //The route description
    }

    //Getting destinations
    startDestination = $('#nav-start-pos').val();
    endDestination = $('#nav-end-pos').val();
    console.log("Start destination: " + startDestination + " end destination: " + endDestination);
    directionsService = new google.maps.DirectionsService;

    directionsDisplay = new google.maps.DirectionsRenderer({
        draggable: true,
        map: map,
        panel: document.getElementById('right-panel')
    });

    //Allows us to do stuff when the route is dragged and/or changed.
    directionsDisplay.addListener('directions_changed', function() {
        computeTotalDistance(directionsDisplay.getDirections());
    });

    displayRoute(startDestination, endDestination, directionsService,directionsDisplay);
    console.log("Dirs: " + directionsService.path);
}

function navigateFromUser(from, to){
    //Cleaning previous directions
    if(directionsDisplay != null){
        directionsDisplay.setMap(null);//The route in the map
    }
    if(document.getElementById('right-panel').innerHTML != null){
        document.getElementById('right-panel').innerHTML = ""; //The route description
    }

    //Getting destinations
    startDestination = from[0] + "," + from[1];
    endDestination = to[0] + "," + to[1];
    console.log("Start destination: " + startDestination + " end destination: " + endDestination);
    directionsService = new google.maps.DirectionsService;

    directionsDisplay = new google.maps.DirectionsRenderer({
        draggable: true,
        map: map,
        panel: document.getElementById('right-panel')
    });

    //Allows us to do stuff when the route is dragged and/or changed.
    directionsDisplay.addListener('directions_changed', function() {
        computeTotalDistance(directionsDisplay.getDirections());
    });

    displayRoute(startDestination, endDestination, directionsService,directionsDisplay);
    console.log("Dirs: " + directionsService.path);
}


function displayRoute(origin, destination, service, display) {
    var avoidTolls = !$('#route-option-tolls').prop('checked');
    var avoidHighways = !$('#route-option-highways').prop('checked');
    var provideRouteAlternatives = $('#route-option-alternative-routes').prop('checked');
    service.route({
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
        avoidTolls: avoidTolls,
        avoidHighways: avoidHighways,
        provideRouteAlternatives: provideRouteAlternatives
    }, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            display.setDirections(response);
        } else {
            alert('Could not display directions due to: ' + status);
        }
    });
}


function computeTotalDistance(result) {
    var total = 0;
    var myroute = result.routes[0];
    for (var i = 0; i < myroute.legs.length; i++) {
        total += myroute.legs[i].distance.value;
    }
    total = total / 1000;
    document.getElementById('total').innerHTML = 'Total reise distanse '+ total + ' km';
}

function currentPosMarker(pos){
    //TODO: Fix!
    //http://stackoverflow.com/questions/30938021/continuously-updating-google-maps-with-user-location
    var image = 'icons/geo-marker.svg';
    var geolocation = new google.maps.Marker({
        position: {lat: pos.lat, lng: pos.lon},
        map: map,
        icon: image
    });
}

/**
 * Autocomplete
 * Docs: https://developers.google.com/maps/documentation/javascript/places-autocomplete#introduction
 * TODO: FIX!
*/
function autocomplete(){


    // Create the search box and link it to the UI element.
    var input = document.getElementById('search-box');
    var searchBox = new google.maps.places.SearchBox(input);
    //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds-changed', function() {
        searchBox.setBounds(map.getBounds());
    });

}