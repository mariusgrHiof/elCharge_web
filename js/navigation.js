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

    directionsDisplay.addListener('directions_changed', function() {
        computeTotalDistance(directionsDisplay.getDirections());
    });

    displayRoute(startDestination, endDestination, directionsService,directionsDisplay);
}

function displayRoute(origin, destination, service, display) {
    service.route({
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
        avoidTolls: false
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
    document.getElementById('total').innerHTML = total + ' km';
}