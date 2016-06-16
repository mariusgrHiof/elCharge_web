/**
* Created by jonas on 13.06.16.
*/

/*
* Dependencies:
*  - jQuery
*  - app.js
*  - station.js
*/
var app = {
  initiatedMap : false,
  path : 'http://frigg.hiof.no/bo16-g6/webapp/',
  api : {
    url : 'https://nobil.no/api/server/datadump.php?',
    key : '274b68192b056e268f128ff63bfcd4a4'
  },
  download : {
    lastDownloaded : '2005-01-01',
    hasDownloaded : false,
    initDownloaded : false,
    animation : null,
    animationFaded : false,
    doInBackground : null,
    intervalTime : 0,
    updateBackgroundTimer : function (minutes){
      console.log("Timer is now: " + minutes);
      app.download.intervalTime = minutes * 60000;
      clearInterval(app.download.doInBackground);
      app.download.doInBackground = setInterval(function() {
        console.log("The time has come!");
        if(app.download.hasDownloaded){
            app.download.hasDownloaded = false;
            if(app.device.phonegap)
              app.download.getDumpPhoneGap();
            else
              app.download.getDump();
        }else{
          console.log("nope..");
        }
      }, app.download.intervalTime)
    },
    stopBackgroundTimer : function (){
      clearInterval(app.download.doInBackground);
    },
    updateTime : function (){
      //Updating the time for when the last update was performed
      var date = new Date();
      app.download.lastDownloaded = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    },
    getDumpPhoneGap : function(){
      $.ajax({
        xhr: function()
        {
          $('#download-progression').show();
          var xhr = new window.XMLHttpRequest();
          //Upload progress
          xhr.upload.addEventListener("progress", function(evt){
            if (evt.lengthComputable) {
              var percentComplete = evt.loaded / evt.total;
              //Do something with upload progress
              console.log(percentComplete);
            }
          }, false);
          //Download progress
          xhr.addEventListener("progress", function(evt){
            if (evt.lengthComputable) {
              var percentComplete = evt.loaded / evt.total;
              var downloaded = (evt.loaded/1000000).toFixed(2);
              var totalSize = (evt.total/1000000).toFixed(2);
              //Do something with download progress
              $('.dl-progress').text(Math.round(percentComplete * 100) + '%');
              $('.dl-progressbar').css('width', function (){ return Math.round(percentComplete * 100) + '%'});
              $('.dl-progress-text').text(downloaded + '/' + totalSize + 'MB');
              console.log(Math.round(percentComplete * 100) + '%');
            }
          }, false);
          return xhr;
        },
        crossDomain: true,
        type: 'POST',
        datatype:'json',
        contentType: 'application/json; charset=utf-8',
        url: (app.download.lastDownloaded == "2005-01-01" && app.device.isAndroid ? "datadump.json" : app.api.url + "&apikey=" + app.api.key + "&fromdate=" + app.download.lastDownloaded + "&format=json"),
        data: {},
        success: function(i){
          var data;
          try{
              data = JSON.parse(i);
          }catch(e){
              data = i;
          }
          app.download.finalize(data);
          event.preventDefault();
        },
        error: function(err){
          console.log("Unable to download file: ");
          console.log(JSON.stringify(err));
          $('#download-progression').hide();
          app.download.hasDownloaded = true;
        }
      });
    },
    getDump : function(){
      $('#download-progression').show();
      try{
        $('.dl-progress-text').text("Laster ned stasjoner");
        $.ajax({
          xhr: function()
          {
            $('#download-progression').show();
            var xhr = new window.XMLHttpRequest();
            //Upload progress
            xhr.upload.addEventListener("progress", function(evt){
              if (evt.lengthComputable) {
                var percentComplete = evt.loaded / evt.total;
                //Do something with upload progress
                console.log(percentComplete);
              }
            }, false);
            //Download progress
            xhr.addEventListener("progress", function(evt){
              if (evt.lengthComputable) {
                var percentComplete = evt.loaded / evt.total;
                var downloaded = (evt.loaded/1000000).toFixed(2);
                var totalSize = (evt.total/1000000).toFixed(2);
                //Do something with download progress
                $('.dl-progress').text(Math.round(percentComplete * 100) + '%');
                $('.dl-progressbar').css('width', function (){ return Math.round(percentComplete * 100) + '%'});
                $('.dl-progress-text').text(downloaded + '/' + totalSize + 'MB');
                console.log(Math.round(percentComplete * 100) + '%');
              }
            }, false);
            return xhr;
          },
          dataType: 'jsonp',
          url: app.api.url,
          data: {
            'apikey': app.api.key,
            'apiversion': '3',
            'action': "datadump",
            'fromdate': app.download.lastDownloaded
          },
          success: function(data){
            app.download.finalize(data);
          },
          error: function(err){
            console.log("Unable to download file: ");
            console.log("URL: "+ app.api.url);
            console.log(JSON.stringify(err));
            $('#download-progression').hide();
            app.download.hasDownloaded = true;
          }
        });
      }catch(err){
        console.log("Failed: " + err);
        $('.dl-progress-text').text("Nedlasingen har feilet med følgende feilmelding: " + err);
      }
    },
    finalize : function (data){
      if(app.download.lastDownloaded == "2005-01-01")
        station.list = []; // We only need to create a empty array if we haven't already downloaded.
      var id;
      for(var i = 0; i < data.chargerstations.length; i++){
        id = data.chargerstations[i].csmd.International_id;
        station.list[id] = data.chargerstations[i];
      }
      //Adding markers
      if(!app.download.initDownloaded){
        setTimeout(station.generateMarkers(),0.001);
        app.download.initDownloaded = true;
      }else{
        //TODO:Remove when the K,V markerlist works propperly again
        setTimeout(station.generateMarkers(),0.001);
        app.download.hasDownloaded = true;
      }
      try{
        //Starting automatic location update for mobile app and mobile browsers
        if(app.device.isMobile || app.device.phonegap)
          navigator.geolocation.watchPosition(app.gps.onSuccess(), app.gps.onError(), {enableHighAccuracy: true, timeout: 100, maximumAge: 1000 });
      }catch(e){
        console.log("Failed: " + e);
        $('.dl-progress-text').text("Innlasting har feilet med følgende feilmeling: " + e);
      }
      app.download.updateTime();
    },
    init : function(){
      dlAnimation = setInterval(
        function () {
          if(app.download.animationFaded){
            $( '.spinning' ).fadeTo( "slow", 1 );
            app.download.animationFaded = false;
          }
          else{
            $( '.spinning' ).fadeTo( "slow", 0.1 );
            app.download.animationFaded = true;
          }
        },
        3
      );
    }
  },
  map : {},
  setMapOnAll : function (map){
    for (var i in station.markers) {
      markers[i].setMap(map);
    }
  },
  cluster : {
    styles : [
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
    ]
  },
  /*
   * All the apps options
   */
  options : {
    panorama : {},
    markerCluster : {}
  },
  /*
   * An object to hold all of the apps services
   */
  services : {
    elevation : {}
  },
  /*
   * An object to hold everything related to GPS
   */
  gps : {
    accuracyRadius : 999,
    lockPos : false,
    myLocationIndicator : {},
    pos : {},
    geopos : {},
    onSuccess : function(position) {
      geopos = [position.coords.latitude, position.coords.longitude];
      try{
        app.gps.pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        app.gps.myLocationIndicator.setPosition(app.gps.pos);
        if(app.device.isMobile){
          if(app.gps.accuracyRadius != null)
            app.gps.accuracyRadius.setMap(null);
          app.gps.accuracyRadius = new google.maps.Circle({
            strokeColor: '#00d8ff',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#00d8ff',
            fillOpacity: 0.35,
            map: app.map,
            center: app.gps.pos,
            radius: position.coords.accuracy
          });
        }
        if(app.gps.lockPos)
          app.gps.centerOnUser(45);
      }catch(e){}
    },
    onError : function (error) {
      if (window.location.protocol != "https:" && !phonegap)
        window.location.href = "https:" + window.location.href.substring(window.location.protocol.length);
      console.log('code: '    + error.code    + '\n' +
        'message: ' + error.message + '\n');
    },
    handleLocationError : function (browserHasGeolocation, infoWindow, pos) {
      infoWindow.setPosition(pos);
      infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    },
    centerOnUser : function (camtilt){
      //Refreshing user pos
      if(!isMobile)//Only for desktop
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
      //Applying wanted cam tilt
      if (app.map.getTilt()) {
        app.map.setTilt(camtilt);
      }
      app.map.setCenter(pos);
      app.map.setZoom(18);
    },
    //TODO: Rename all reffs
    strToLtLng : function (pos){
      var arr = pos.replace(/[()]/g,"").split(",");
      return new google.maps.LatLng(arr[0],arr[1]);
    }
  },
  /*
   * An object to hold any device related methods or variables
   */
  device : {
    phonegap : document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1,
    isMobile : false,
    isAndroid : false,
    isIOS : false,
    typeCheck : function(){
      var mobile = window.matchMedia("only screen and (max-width: 600px)");
      if (mobile.matches) {
        //Allowing us to have a absolute position on the map rather than relative (default)
        app.device.isMobile = true;
        $('#map').css("position","absolute");
      }
      // if iPod / iPhone, display install app prompt
      if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i) ||
        navigator.userAgent.match(/android/i)) {
        if (navigator.userAgent.match(/android/i))
          app.device.isAndroid = true;
        else
          app.device.isIOS = true;
      }
      if(app.device.phonegap)
        $('head').append('<script type="text/javascript" src="cordova.js"></script>');
      if(app.device.phonegap && app.device.isIOS)
        $('head').append('<link rel="stylesheet" type="text/css" href="styles/ios.css">');
      else if(app.device.isAndroid)
        $('head').append('<link rel="stylesheet" type="text/css" href="styles/android.css">');
    },
    onReady : function (){
      if(app.device.isIOS)
        app.download.getDump();
      else
        app.download.getDumpPhoneGap();

      document.addEventListener("backbutton", slideIn, false);
      document.addEventListener("pause", app.device.onPause, false);
      document.addEventListener("resume", app.device.onResume, false);
    },
    onPause : function () {
    },
    onResume :function () {
    }
  },
  inArray : function(key, array) {
    return $.inArray(key, array)>0;
  },
  inArrayVal : function (value, array){
    for(var i in array){
      if(array[i] == value ){
        return true;
      }
    }
    return false;
  },
  /*
   * A function for initiating the app
  */
  init : function(){
    app.download.init();
    station.init();
    app.map = new google.maps.Map(document.getElementById('map'), {
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
    app.options.markerCluster = {gridSize: 50, maxZoom: 15, styles: app.cluster.styles};
    app.options.panorama = {
      addressControlOptions:{
        position: google.maps.ControlPosition.BOTTOM_CENTER
      }
    };
    app.services.elevation = new google.maps.ElevationService;

    var sw = app.map.getStreetView().setOptions(app.options.panorama);
    app.device.typeCheck();
    //Setting default map layer type to terrain
    app.map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
    try{
      //Search box header
      // Create the search box and link it to the UI element.
      var input = document.getElementById('search-box');
      var searchBox = new google.maps.places.SearchBox(input);

      searchBox.setBounds(app.map.getBounds());
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
        app.map.fitBounds(bounds);
      });
    }catch(e){console.log(e);}

    //Users current position marker
    var scaleSize = app.device.isIOS ? 120 : 15;
    var mi = {
        url: 'icons/my_pos_marker.svg',
        anchor: new google.maps.Point( (app.device.phonegap && !app.device.isIOS ? scaleSize/2 : scaleSize/20), (app.device.phonegap && !app.device.isIOS ? scaleSize/2 : scaleSize/20) ),
        origin: new google.maps.Point(0, 0),
        scaledSize: new google.maps.Size(scaleSize, scaleSize),
        size: new google.maps.Size(64, 64)
    };
    app.gps.myLocationIndicator = new google.maps.Marker({
      clickable: false,
      icon: mi,
      shadow: null,
      zIndex: 999,
      map: app.map
    });

    try{
      //Search box startPos
      var inputStartPos = document.getElementById('nav-start-pos');
      var searchBoxStartPos = new google.maps.places.SearchBox(inputStartPos);
      searchBoxStartPos.setBounds(app.map.getBounds());
      //Search box endPos
      var inputEndPos = document.getElementById('nav-end-pos');
      var searchBoxEndPos = new google.maps.places.SearchBox(inputEndPos);
      searchBoxEndPos.setBounds(app.map.getBounds());
    }catch(e){}

    station.updateCarList();
    //Turning on layers
    try{
      //TODO: trafficOverlay();
    }catch(e){}

    //Finding user location with geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        app.gps.pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        //Storing the user pos value
        app.gps.geopos = [position.coords.latitude, position.coords.longitude];
        app.map.setCenter(app.gps.pos);
      }, function() {
        var infoWindow = new google.maps.InfoWindow({
            content: '',
            maxWidth: 500,
            maxHeight: 500
        });
        app.gps.handleLocationError(true, infoWindow, app.map.getCenter());
      });
    } else {
      // If the browser doesn't support Geolocation
      var infoWindow = new google.maps.InfoWindow({
          content: '',
          maxWidth: 500,
          maxHeight: 500
      });
      app.gps.handleLocationError(false, infoWindow, app.map.getCenter());
      app.gps.geopos = [59.91673,10.74782]; // Defaulting to oslo incase geopos isn't possible
    }
    //Downloading station data
    if(app.device.phonegap)
      //Safeguarding against timeout for the cordovaWebView
      setTimeout(document.addEventListener("deviceready", app.device.onReady, false), 2000);
    else
      app.download.getDump();
    if(app.device.isMobile)
      setInterval(function () {
        //Updating the "nearby chargers" list for all mobile devices (web and app)
        updateNearbyChargers();
        station.favorite.updateStations();
      }, 1000);

    window.addEventListener("resize",function(){
      google.maps.event.trigger(app.map, 'resize');
    }, false);
  }
};
