/**
 * Created by jonas on 16.03.16.
 */
var navigation = {
  startDestination : '',
  waypoints : [],
  waypointsData : [],
  endDestination : '',
  service : null,
  display : null,
  jsonRoute : {},
  route : [],
  build : function (){
    if($("#right-panel").html() !== ''){
      $("#right-panel").html('')
    } //The route description
    if(navigation.display !== null){
      navigation.display.setMap(null);
    }//The route in the map
    //Getting destinations
    navigation.startDestination = $('#nav-start-pos').val();
    navigation.endDestination = $('#nav-end-pos').val();
    navigation.service = new google.maps.DirectionsService;
    navigation.display = new google.maps.DirectionsRenderer({
      draggable: true,
      map: app.map,
      panel: $('#right-panel')[0]
    });

    //Allows us to do stuff when the route is dragged and/or changed.
    navigation.display.addListener('directions_changed', function() {
      navigation.getTotalDistance(navigation.display.getDirections());
      console.log($("#right-panel"));
      setTimeout(function(){
        $('.adp-placemark').each(function(index){
          if(index != 0 && index <= navigation.waypointsData.length && navigation.waypointsData[index - 1].isStation){
            $(this).find('.adp-text').html(station.list[navigation.waypointsData[index - 1].station_id].csmd.name);
            //TODO: $('.adp-summary').eq(index).find(':first-child').html('99');
          }
        });
      }, 1);
    });
    navigation.displayRoute(navigation.startDestination, navigation.endDestination, navigation.service,navigation.display);
  },
  fromUser : function (toel){
    //Cleaning out the route before we build a new one
    navigation.clearRoute();
    if($("#right-panel").html() !== ''){
      $("#right-panel").html('')
    }
    if(navigation.display !== null){
      navigation.display.setMap(null);
    }

    //Starting to build a new route
    var to = $(toel).attr('value');
    $('#nav-start-pos').val(app.gps.geopos);
    $('#nav-end-pos').val(to);

    //Getting destinations
    navigation.startDestination = app.gps.geopos[0] + "," + app.gps.geopos[1];
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
    });
    navigation.displayRoute(navigation.startDestination, navigation.endDestination, navigation.service, navigation.display);
  },
  fromUserSearch : function (){
    navigation.clearRoute();
    if($("#right-panel").html() !== ''){
      $("#right-panel").html("");
    } //The route description
    if(navigation.display !== null){
      navigation.display.setMap(null);
    }//The route in the map
    var to = $('#search-box').val();
    $('#nav-start-pos').val(app.gps.geopos);
    $('#nav-end-pos').val(to);
    //Cleaning previous directions
    if(navigation.display !== null){
      navigation.display.setMap(null);//The route in the map
    }

    //Getting destinations
    navigation.startDestination = app.gps.geopos[0] + "," + app.gps.geopos[1];
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
    });
    navigation.displayRoute(navigation.startDestination, navigation.endDestination, navigation.service, navigation.display);
  },
  clearRoute : function(){
    if(navigation.display !== null){
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
      optimizeWaypoints: false,
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
    var total = 0;
    navigation.route = result.routes[0];
    for (var i = 0, x = navigation.route.legs.length; i < x; i++){
      total += navigation.route.legs[i].distance.value;
    }
    //Getting waypoint adresses
    navigation.getRouteData();
    total = (total / 1000).toFixed(2);
    $('#total').html('Total reise distanse '+ total + ' km');
    station.favorite.distance = total;
    //Showing the path elevation
    elevation.displayForPath(navigation.route, elevation.service);
  },
  getRouteData : function () {
    var x = navigation.route.legs.length;
    for(var i = 0; i < x; i++){
      if(i === 0){
        //Getting starting pos
        console.log("Start pos is: " + navigation.route.legs[i].start_address);
      }
      if(x > 0 && i !== 0){
        //Getting all waypoints
        console.log("Waypoint "+ i +": " + navigation.route.legs[i].start_address);
      }
      for(var sWP in navigation.route.legs[i].via_waypoints){
        navigation.getLocationNameFromLatLng(navigation.route.legs[i].via_waypoints[sWP],i, sWP); // Can be used for something fancy?
      }
      if (i === x -1){
        //Getting end destination
        console.log("End dest is: " + navigation.route.legs[i].end_address);
      }
    }
  },
  getLocationNameFromLatLng : function (latlng){
    var request = new XMLHttpRequest(),
      method = 'GET',
      url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+latlng.lat().toFixed(4) +','+latlng.lng().toFixed(4) +'&sensor=true',
      async = true,
      data;
    request.open(method, url, async);
    request.onreadystatechange = function(){
      if(request.readyState === 4 && request.status === 200){
        data = JSON.parse(request.responseText);
        navigation.showDraggedInListAdress(latlng, data.results[0].formatted_address);
      }
    };
    request.send();
  },
  showDraggedInListAdress : function (ltlng, address){
    navigation.waypointsData.push(
      {
        isStation : false,
        address : address
      });
    navigation.waypoints.push(
      {location: ltlng}
    );
    $('#waypoint-list').append(
      "<li class='route-element'>" +
        "<div class='float-left' style='max-width:90%;'>"+
          address +
        "</div>"+
        "<div class='float-right'><button onclick=\"station.removeWaypoint(this)\">X</button></div>" +
      "</li>"
    );

    //Refreshing the route if it's active
    if($('#nav-start-pos').val() !== "" && $('#nav-end-pos').val() !== ""){
      navigation.build();
    }
  }
};
