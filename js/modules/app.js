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
  loggedIn : false,
  login : {
    showPopup : function(){
      $('#register-popup').hide();
      $('#login-popup').show();
    },
    hidePopup : function(){
      $('#login-popup').hide();
    },
    closeForm : function(){
      $('#auth').hide();
    },
    showForm : function(){
      if(app.loggedIn){
        app.buttons.logout();
        app.loggedIn = false;
        $('#title button').html('Logg inn');
      }else{
        $('#auth').show();
      }
    }
  },
  register : {
    showPopup : function(){
      $('#register-popup').show();
    },
    hidePopup : function(){
      $('#register-popup').hide();
    }
  },
  buttons : {
    slideInMenu : function(){
      try{
        var target = $('.menu');
        if($(target).css("left") == "-700px"){
          $('#menu-toggle').addClass('toggle');
          $(target).animate({left:'0px'}, {queue: false, duration: 300});
        }else{
          $('#menu-toggle').removeClass('toggle');
          $(target).animate({left:'-700px'}, {queue: false, duration: 300});
        }
      }catch(e){console.log(e);}
    },
    login : function(form){
      var path = "";
      if(app.device.phonegap)
        path += app.url;
      path +="api/login.php";

      //Logging the user in
      $.post(path,{
          //Posting username and password
          username: $(form).children(":input[name='username']").val(),
          password: $(form).children(":input[name='password']").val() },
        function( data ){
          //Populating the user logged in window.
          //Cleaning out the array
          station.favorite.stationList.length = 0;
          station.favorite.routeList.length = 0;
          $("#favorite-stations").html("");
          if(data != "0"){
            var result = JSON.parse(data);
            if(result.stations.length > 0){
              station.favorite.stationList = result.stations;

              station.favorite.updateStations();
            }
            if(result.routes.length > 0){
              station.favorite.routeList = result.routes;

              //station.favorite.updateStations();
            }
            app.loggedIn = true;
            $('#title button').html('Logg ut');
            $('#auth').hide();
            $('#logged-in').html('Du er logget på som, ' + result.username + '.');
            $(".favorite").each(function(){
              $(this).show();
            });
          }else {
            $('#login-form').html('Feil brukernavn eller passord');
          }
        }
      );
      return false;
    },
    logout : function(){
      var path = "";
      if(app.device.phonegap)
          path += app.url;
      path +="api/logout.php";

      $.post(path, function data(){
        $(".favorite").each(function(){
          $(this).hide();
        });
       $('#logged-in').html("Avlogging vellykket.");
      });
      station.favorite.updateStations();
    },
    register : function(form){
      var path = "";
      if(app.device.phonegap)
        path += app.url;
      path +="api/register.php";
      var uname = $(form).children(":input[name='username']").val();
      var pw = $(form).children(":input[name='password']").val();
      var m = $(form).children(":input[name='mail']").val();
      //Logging the user in
      if(uname != "" && pw != "" && m != ""){
        $.post(path,
          {
            username: $(form).children(":input[name='username']").val(),
            password: $(form).children(":input[name='password']").val(),
            mail: $(form).children(":input[name='mail']").val()
          },
          function( data ){
            $('#register-form').html(data );
          }
        );
      }else{
        $('#register-form').html( 'Alle feltene må fylles ut!' );
      }
      return false;
    },
    lockMapToUser : function(ele){
      //Making it so that the user can toggle if they want the map to follow or not
      app.gps.lockPos = !app.gps.lockPos;
      if($(ele).hasClass('lock-pos')){
          $(ele).addClass('unlock-pos');
          $(ele).removeClass('lock-pos');
      }else{
        $(ele).addClass('lock-pos');
        $(ele).removeClass('unlock-pos');
      }
      $(ele).html(app.gps.lockPos ? 'Unlock' : 'Lock');
    }
  },
  eventListeners : {
    loginRegister : function(){
      /*
       * Login & Register
      */
      //Show login popup
      $('#show-login').click(function(){
          app.login.showPopup();
      });

      //Show register popup
      $('.show-register').click(function(){
          app.register.showPopup();
          app.login.hidePopup();
      });

      //show login from the registrer form
      $('.show-login').click(function(){
          app.login.showPopup();
      });

      //Close login and register popup
      $('.close-form').click(function(){
          app.login.closeForm();
      });

    },
    textButtons : function (){
      /*
       * Text as buttons
      */
      $('.menu-item').click(
        function(){
          var child = $(this).next().filter('.sub-item');
          var parent = $(this).parent();
          var grandParent = $(this).parent().parent();

          if(!$(child).hasClass('toggle')){
            $(child).addClass('toggle');
            $(this).addClass('title-box');
            $(parent).addClass('parent');
            app.menu.selectHandeler(grandParent,true);
          }else{
            $(child).removeClass('toggle');
            $(this).removeClass('title-box');
            $(parent).removeClass('parent');
            app.menu.selectHandeler(grandParent, false);
          }
        }
      );
    },
    input : function(){
      /**
       * Input listeners
       */
      //Turning layers on or off
      $('input[type=checkbox].onoffswitch-checkbox').change(
        function(){
          if($(this).attr('id') == 'traffic-layer')
            app.layers.traffic();
        }
      );
      //Changing the autoupdate interval or deactivate autoupdate
      $('input[type=number]#bg-update-timer').change(
        function(){
          if($(this).val() <= 0)
            app.download.stopBackgroundTimer();
          else
            app.download.updateBackgroundTimer($(this).val());
        }
      );
      //Changing the selected car and updating station markers accordingly
      $('#select-car').change(
        function(){
          station.generateMarkers();
        }
      );
      //Updating stations with the prefered minimum charging capacity
      $("#selected-charger-capacity").change(
        function(){
          station.selectedCapacity = $(this).children(":input[name='kW']:checked").val();
          //Updating the map with markers
          station.generateMarkers();
        }
      );
    },
    init : function(){
      app.eventListeners.loginRegister();
      app.eventListeners.textButtons();
      app.eventListeners.input();
    }
  },
  menu : {
    selectHandeler : function (parent, remove){
      $(parent).children('li').each(
        function(){
          if(!$(this).children('h2').next().hasClass('toggle')){
            $(this).css('display',remove ? 'none' : 'block');
          }else{
            $(this).css('display','block');
          }
        }
      );
    },
    readMore : function(ele){
      if(!$(ele).hasClass('toggle')){
        $(ele).addClass('toggle');
      }else{
        $(ele).removeClass('toggle');
      }
    }
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
      //Starting automatic location update for mobile app and mobile browsers
      if(app.device.isMobile || app.device.phonegap)
        navigator.geolocation.watchPosition(app.gps.onSuccess, app.gps.onError, {enableHighAccuracy: true, timeout: 100, maximumAge: 1000 });
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
  layers : {
    trafficIsActive : false,
    trafficLayer : null,
    traffic : function(){
        if(app.layers.trafficLayer == null)
            app.layers.trafficLayer = new google.maps.TrafficLayer();

        if(app.layers.trafficLayerIsActive){
            app.layers.trafficLayer.setMap(null);
            !app.layers.trafficLayerIsActive;
        }else{
            app.layers.trafficLayer.setMap(app.map);
            !app.layers.trafficLayerIsActive;
        }
        $("input[type=checkbox].onoffswitch-checkbox#traffic-layer").attr("checked", app.layers.trafficLayerIsActive);
    }
  },
  setMapOnAll : function (map){
    for (var i in station.markers) {
      station.markers[i].setMap(map);
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
   * An object to hold everything related to GPS
   */
  gps : {
    accuracyRadius : null,
    lockPos : false,
    myLocationIndicator : {},
    pos : {},
    geopos : {},
    onSuccess : function(position) {
      app.gps.geopos = [position.coords.latitude, position.coords.longitude];
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
          if(app.gps.lockPos)
            app.gps.centerOnUser(45);
        }
      }catch(e){
        console.log(e);
      }
    },
    onError : function (error) {
      if (window.location.protocol != "https:" && !app.device.phonegap)
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
      if(!app.device.isMobile)//Only for desktop
        navigator.geolocation.getCurrentPosition(app.gps.onSuccess, app.gps.onError);
      //Applying wanted cam tilt
      if (app.map.getTilt()) {
        app.map.setTilt(camtilt);
      }
      app.map.setCenter(app.gps.pos);
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
    isWindows : false,
    typeCheck : function(){
      var mobile = window.matchMedia("only screen and (max-width: 600px)");
      if (mobile.matches) {
        //Allowing us to have a absolute position on the map rather than relative (default)
        app.device.isMobile = true;
        $('#map').css("position","absolute");
      }else
        //Removing the lock user pos button if this is desktop
        $('button#lock-to-my-pos-btn').remove();
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
    app.eventListeners.init();
    app.download.init();
    station.init();
    elevation.init();
    app.map = new google.maps.Map($('#map')[0], {
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

    var sw = app.map.getStreetView().setOptions(app.options.panorama);
    app.device.typeCheck();
    //Setting default map layer type to terrain
    app.map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
    try{
      //Search box header
      // Create the search box and link it to the UI element.
      var input = $('#search-box')[0];
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
        optimize : false,
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
      var inputStartPos = $('#nav-start-pos')[0];
      var searchBoxStartPos = new google.maps.places.SearchBox(inputStartPos);
      searchBoxStartPos.setBounds(app.map.getBounds());
      //Search box endPos
      var inputEndPos = $('#nav-end-pos')[0];
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
        nearby.update();
        station.favorite.updateStations();
      }, 1000);

    window.addEventListener("resize",function(){
      google.maps.event.trigger(app.map, 'resize');
    }, false);
  }
};
