/**
 * Created by jonas on 16.03.16.
 */
var navigation = {
  startDestination : '',
  waypoints : [],
  endDestination : '',
  service : null,
  display : null,
  jsonRoute : {},
  route : [],
  build : function (){
    if(document.getElementById('right-panel').innerHTML != null)
      $("#right-panel").html("") //The route description
    if(navigation.display != null)
      navigation.display.setMap(null);//The route in the map
    //Getting destinations
    navigation.startDestination = $('#nav-start-pos').val();
    navigation.endDestination = $('#nav-end-pos').val();
    navigation.service = new google.maps.DirectionsService;
    navigation.display = new google.maps.DirectionsRenderer({
      draggable: true,
      map: app.map,
      panel: document.getElementById('right-panel')
    });

    //Allows us to do stuff when the route is dragged and/or changed.
    navigation.display.addListener('directions_changed', function() {
      navigation.getTotalDistance(navigation.display.getDirections());
    });
    navigation.displayRoute(navigation.startDestination, navigation.endDestination, navigation.service,navigation.display);
  },
  fromUser : function (from, toel){
    if(document.getElementById('right-panel').innerHTML != null)
      $("#right-panel").html("") //The route description
    if(navigation.display != null)
      navigation.display.setMap(null);//The route in the map
    var to = $(toel).attr('value');
    $('#nav-start-pos').val(from);
    $('#nav-end-pos').val(to);
    //Cleaning previous directions
    if(navigation.display != null)
      navigation.display.setMap(null);//The route in the map

    if(document.getElementById('right-panel').innerHTML != null)
      $("#right-panel").html(""); //The route description

    //Getting destinations
    navigation.startDestination = from[0] + "," + from[1];
    navigation.endDestination = to;
    navigation.service = new google.maps.DirectionsService;
    navigation.display = new google.maps.DirectionsRenderer({
      draggable: true,
      map: app.map,
      panel: $('#right-panel')[0]
    });

    //Allows us to do stuff when the route is dragged and/or changed.
    navigation.display.addListener('directions_changed', function() {
      navigation.getTotalDistance(navigation.display.getDirections());
      navigation.display.setDirections();
    });
    navigation.displayRoute(navigation.startDestination, navigation.endDestination, navigation.service, navigation.display);
  },
  clearRoute : function(){
    if(navigation.display != null){
      $("#right-panel").html("");
      navigation.display.setMap(null);//The route in the map
    }
    //Removing waypoints as well as the route
    $("#waypoint-list").children().each(
      function(){
        $(this).remove();
      }
    );
    navigation.waypoints.length = 0;
  },
  displayRoute : function (origin, destination, service, display) {
    var avoidTolls = !$('#route-option-tolls').prop('checked');
    var avoidHighways = !$('#route-option-highways').prop('checked');
    var provideRouteAlternatives = $('#route-option-alternative-routes').prop('checked');
    service.route({
      origin: origin,
      destination: destination,
      optimizeWaypoints: true,
      waypoints: navigation.waypoints,
      travelMode: google.maps.TravelMode.DRIVING,
      avoidTolls: avoidTolls,
      avoidHighways: avoidHighways,
      provideRouteAlternatives: provideRouteAlternatives
    }, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        navigation.display.setDirections(response);
      } else {
        alert('Noe gikk galt når vi forsøkte å lage ruten: ' + status);
      }
    });
  },
  /*
   * Calculating the distance between all the route points
   * And assigning route to array
   */
  getTotalDistance : function (result) {
    try{
      var total = 0;
      navigation.route = result.routes[0];
      for (var i = 0; i < navigation.route.legs.length; i++) {
        total += navigation.route.legs[i].distance.value;
      }
      //Getting waypoint adresses
      navigation.getRouteData();
      total = total / 1000;
      $('#total').html('Total reise distanse '+ total + ' km');
      //Showing the path elevation
      elevation.displayForPath(navigation.route, elevation.service);
    }catch(e){console.log(e);}
  },
  getRouteData : function () {
    for(var i in navigation.route.legs){
      if(i == 0)
        //Getting starting pos
        console.log("Start pos is: " + navigation.route.legs[i].start_address);
      if(navigation.route.legs.length > 0 && i != 0)
        //Getting all waypoints
        console.log("Waypoint "+ i +": " + navigation.route.legs[i].start_address);
      for(var sWP in navigation.route.legs[i].via_waypoints){
        navigation.getLocationNameFromLatLng(navigation.route.legs[i].via_waypoints[sWP],i, sWP); // Can be used for something fancy?
      }
      if (i == navigation.route.legs.length -1)
        //Getting end destination
        console.log("End dest is: " + navigation.route.legs[i].end_address);
    }
  },
  getLocationNameFromLatLng : function (latlng){
    var request = new XMLHttpRequest();
    var method = 'GET';
    var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+latlng.lat().toFixed(4) +','+latlng.lng().toFixed(4) +'&sensor=true';
    var async = true;
    request.open(method, url, async);
    request.onreadystatechange = function(){
      if(request.readyState == 4 && request.status == 200){
        var data = JSON.parse(request.responseText);
        navigation.showDraggedInListAdress(latlng, data.results[0].formatted_address);
      }
    };
    request.send();
  },
  showDraggedInListAdress : function (ltlng, address){
    navigation.waypoints.push(
      {location: ltlng}
    );
    var content =
      "<div class='route-element'>" +
        "<div class='float-left' style='width:calc( 66% - 1.1em );'>"+
          "<Strong>" + address +"</Strong>"+
        "</div>"+
        "<div><button onclick=\"station.removeWaypoint(this)\">X</button></div>" +
      "</div>";
    document.getElementById('waypoint-list').innerHTML += content;

    //Refreshing the route if it's active
    if($('#nav-start-pos').val() != "" && $('#nav-end-pos').val() != ""){
      navigation.build();
    }
  },
  saveRoute : function(){
    for(var i in navigation.route.legs){
      if(i == 0)
        //Getting starting pos
        navigation.jsonRoute["start"] = navigation.route.legs[i].start_address;

      if (i == navigation.route.legs.length -1)
        //Getting end destination
        navigation.jsonRoute["end"] =  navigation.route.legs[i].end_address;
    }
    navigation.jsonRoute['waypoints'] = navigation.waypoints;
    //TODO: Remove
    console.log(JSON.stringify(navigation.jsonRoute));

    $.post("includes/navigation.route.php", {
      data: JSON.stringify(navigation.jsonRoute)
    }, function(data){
      $('#navigation.route-saved').html("Ruten er lagret");
      console.log("Feedback " + data);
    });
    return false;
  }
};
