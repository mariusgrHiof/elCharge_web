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
    user : {
        centerOn : function (camtilt){
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

    },
    map : {},
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
        panorama : {}
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
                app.vars.myloc.setPosition(app.gps.pos);
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
                    app.user.centerOn(45);
            }catch(e){}
        },
        onError : function (error) {
            if (window.location.protocol != "https:" && !phonegap)
                window.location.href = "https:" + window.location.href.substring(window.location.protocol.length);
            console.log('code: '    + error.code    + '\n' +
                'message: ' + error.message + '\n');
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
                downloadDump();
            else
                downloadDumpPG();
            document.addEventListener("backbutton", slideIn, false);

            document.addEventListener("pause", app.device.onPause, false);
            document.addEventListener("resume", app.device.onResume, false);
        },
        onPause : function () {
        },
        onResume :function () {
        }
    },
    /*
     * A function for initiating the app
    */
    initiate : function(){
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
        var scaleSize = isIOS ? 120 : 15;
        var mi = {
            url: 'icons/my_pos_marker.svg',
            anchor: new google.maps.Point( (phonegap && !isIOS ? scaleSize/2 : scaleSize/20), (phonegap && !isIOS ? scaleSize/2 : scaleSize/20) ),
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
            trafficOverlay();
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
                handleLocationError(true, infoWindow, app.map.getCenter());
            });
        } else {
            // If the browser doesn't support Geolocation
            handleLocationError(false, infoWindow, app.map.getCenter());
            app.gps.geopos = [59.91673,10.74782]; // Defaulting to oslo incase geopos isn't possible
        }
        //Downloading station data
        if(app.device.phonegap)
        //Safeguarding against timeout for the cordovaWebView
            setTimeout(document.addEventListener("deviceready", app.device.onReady, false), 2000);
        if(app.device.isMobile)
            setInterval(function () {
                //Updating the "nearby chargers" list for all mobile devices (web and app)
                updateNearbyChargers();
                updateFavoriteStations();
            }, 1000);

        window.addEventListener("resize",function(){
            google.maps.event.trigger(app.map, 'resize');
        }, false);
    }
};