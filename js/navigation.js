/**
 * Created by jonas on 16.03.16.
 * source: https://developers.google.com/maps/documentation/javascript/examples/directions-draggable
 */

var waypoints = [];//[{location: 'Lillestrøm, Norway'}, {location: 'Moss, Norway'}];
var startDestination = "";
var endDestination ="";
var directionsDisplay;
var directionsService;

var myroute = [];
function navigate(){
    //Cleaning previous directions
    clearRoute();
    if(document.getElementById('right-panel').innerHTML != null){
        document.getElementById('right-panel').innerHTML = ""; //The route description
    }

    //Getting destinations
    startDestination = $('#nav-start-pos').val();
    endDestination = $('#nav-end-pos').val();
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

function navigateFromUser(from, toel){
    var to = $(toel).attr('value');
    $('#nav-start-pos').val(from);
    $('#nav-end-pos').val(to);
    //Cleaning previous directions
    if(directionsDisplay != null){
        directionsDisplay.setMap(null);//The route in the map
    }
    if(document.getElementById('right-panel').innerHTML != null){
        $("#right-panel").html(""); //The route description
    }

    //Getting destinations
    startDestination = from[0] + "," + from[1];
    endDestination = to;
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
        directionsDisplay.setDirections();
    });

    displayRoute(startDestination, endDestination, directionsService,directionsDisplay);
    console.log("Dirs: " + directionsService.path);
}

function clearRoute(){
    if(directionsDisplay != null){
        $("#right-panel").html("");
        directionsDisplay.setMap(null);//The route in the map
    }
}


function displayRoute(origin, destination, service, display) {
    var avoidTolls = !$('#route-option-tolls').prop('checked');
    var avoidHighways = !$('#route-option-highways').prop('checked');
    var provideRouteAlternatives = $('#route-option-alternative-routes').prop('checked');
    service.route({
        origin: origin,
        destination: destination,
        optimizeWaypoints: true,
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
    myroute = result.routes[0];

    console.log(myroute);
    for (var i = 0; i < myroute.legs.length; i++) {
        total += myroute.legs[i].distance.value;
        console.log(myroute.legs[i].start_address);
        getStationMatch(i);
    }
    getRouteData();
    total = total / 1000;
    $('#total').html('Total reise distanse '+ total + ' km');
    //Showing the path elevation
    displayPathElevation(myroute, elevationService);
}

function getStationMatch(routeIndex){
    for(var station in jsonData){
        if((myroute.legs[routeIndex].start_location.lat()).toFixed(3) == (strToLtLng(jsonData[station].csmd.Position).lat()).toFixed(3)
            && (myroute.legs[routeIndex].start_location.lng()).toFixed(3) == (strToLtLng(jsonData[station].csmd.Position).lng()).toFixed(3))
            console.log("Denne stasjonen er i listen ->  "+ jsonData[station].csmd.name + " adresse: " + myroute.legs[routeIndex].start_address);
    }
}

//Printing out information about a given route
function getRouteData(){
    for(var i in myroute.legs){
        if(i == 0)
            //Getting starting pos
            console.log("Start pos is: " + myroute.legs[i].start_address);
        if(myroute.legs.length > 0 && i != 0)
            //Getting all waypoints
            console.log("Waypoint "+ i +": " + myroute.legs[i].start_address);
        for(var sWP in myroute.legs[i].via_waypoints){
            getLocationNameFromLatLng(myroute.legs[i].via_waypoints[sWP],i, sWP); // Can be used for something fancy?
        }
        if (i == myroute.legs.length -1)
            //Getting end destination
            console.log("End dest is: " + myroute.legs[i].end_address);
    }
}

//Getting the adress of a given latlong object
function getLocationNameFromLatLng(latlng,index, subIndex){
    var request = new XMLHttpRequest();

    var method = 'GET';
    var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+latlng.lat().toFixed(4) +','+latlng.lng().toFixed(4) +'&sensor=true';
    var async = true;
    request.open(method, url, async);
    request.onreadystatechange = function(){
        if(request.readyState == 4 && request.status == 200){
            var data = JSON.parse(request.responseText);
            console.log(data);
            console.log("Sub waypoint" + index + "." + subIndex + " - " + data.results[0].formatted_address);
            showDraggedInList(latlng, data.results[0].formatted_address);
        }
    };
    request.send();
};

function showDraggedInList(ltlng, address){
    waypoints.push(
        {location: ltlng}
    );
    var content =
        "<div class='route-element'>" +
            "<div class='float-left' style='width:calc( 66% - 1.1em );'>"+
                "<Strong>" + address +"</Strong>"+
            "</div>"+
            "<button onclick=\"removeWaypoint(this)\">X</button>" +
        "</div>";
    document.getElementById('waypoint-list').innerHTML += content;

    //Refreshing the route if it's active
    if($('#nav-start-pos').val() != "" && $('#nav-end-pos').val() != ""){
        navigate();
    }
}