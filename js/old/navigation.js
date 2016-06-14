/**
 * Created by jonas on 16.03.16.
 */

var waypoints = [];
var startDestination = "";
var endDestination ="";
var directionsDisplay;
var directionsService;

var jsonRoute = {};

var myroute = [];
function navigate(){
    if(document.getElementById('right-panel').innerHTML != null)
        $("#right-panel").html("") //The route description
    if(directionsDisplay != null)
        directionsDisplay.setMap(null);//The route in the map
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
}

function navigateFromUser(from, toel){
    if(document.getElementById('right-panel').innerHTML != null)
        $("#right-panel").html("") //The route description
    if(directionsDisplay != null)
        directionsDisplay.setMap(null);//The route in the map
    var to = $(toel).attr('value');
    $('#nav-start-pos').val(from);
    $('#nav-end-pos').val(to);
    //Cleaning previous directions
    if(directionsDisplay != null)
        directionsDisplay.setMap(null);//The route in the map

    if(document.getElementById('right-panel').innerHTML != null)
        $("#right-panel").html(""); //The route description

    //Getting destinations
    startDestination = from[0] + "," + from[1];
    endDestination = to;
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
}

function clearRoute(){
    if(directionsDisplay != null){
        $("#right-panel").html("");
        directionsDisplay.setMap(null);//The route in the map
    }
    //Removing waypoints as well as the route
    $("#waypoint-list").children().each(
        function(){
            $(this).remove();
        }
    );
    waypoints.length = 0;
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
            alert('Noe gikk galt når vi forsøkte å lage ruten: ' + status);
        }
    });
}

function computeTotalDistance(result) {
    var total = 0;
    myroute = result.routes[0];
    for (var i = 0; i < myroute.legs.length; i++) {
        total += myroute.legs[i].distance.value;
    }
    //Getting waypoint adresses
    getRouteData();
    total = total / 1000;
    $('#total').html('Total reise distanse '+ total + ' km');
    //Showing the path elevation
    displayPathElevation(myroute, elevationService);
}

//Printing out information about a given route to console for debug
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
    var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+latlng.lat().toFixed(4) +','+latlng.lng().toFixed(4) +'&sensor=true';
    var async = true;
    request.open(method, url, async);
    request.onreadystatechange = function(){
        if(request.readyState == 4 && request.status == 200){
            var data = JSON.parse(request.responseText);
            showDraggedInListAdress(latlng, data.results[0].formatted_address);
        }
    };
    request.send();
};

//function for populating the waypoints in  a route with it's adress instead of latitude and longtitude
function showDraggedInListAdress(ltlng, address){
    waypoints.push(
        {location: ltlng}
    );
    var content =
        "<div class='route-element'>" +
            "<div class='float-left' style='width:calc( 66% - 1.1em );'>"+
                "<Strong>" + address +"</Strong>"+
            "</div>"+
            "<div><button onclick=\"removeWaypoint(this)\">X</button></div>" +
        "</div>";
    document.getElementById('waypoint-list').innerHTML += content;

    //Refreshing the route if it's active
    if($('#nav-start-pos').val() != "" && $('#nav-end-pos').val() != ""){
        navigate();
    }
}

//Function for saving a user spesified route to DB
function saveRouteData(){
    for(var i in myroute.legs){
        if(i == 0)
        //Getting starting pos
            jsonRoute["start"] = myroute.legs[i].start_address;
        console.log("Start pos is: " + myroute.legs[i].start_address);

        if (i == myroute.legs.length -1)
        //Getting end destination
            jsonRoute["end"] =  myroute.legs[i].end_address;
            console.log("End dest is: " + myroute.legs[i].end_address);
    }
    jsonRoute['waypoints'] = waypoints;

    console.log(JSON.stringify(jsonRoute));

    $.post("includes/myRoute.php", {
       data: JSON.stringify(jsonRoute)
    }, function(data){
        $('#myRoute-saved').html("Ruten er lagret");
        console.log("Feedback " + data);
    });
    return false;
}