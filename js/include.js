/**
 * Created by jonas on 23.04.2016.
 */
var phonegap = true; //TODO: Replace with this later -> document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
var isMobile = false;
var isAndroid = false;
var isIOS = false;
var accuracyRadius;

var onSuccess = function(position) {

    geopos = [position.coords.latitude, position.coords.longitude];

    try{

        pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        myloc.setPosition(pos);
        if(isMobile){
            if(accuracyRadius != null)
                accuracyRadius.setMap(null);
            accuracyRadius = new google.maps.Circle({
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                map: map,
                center: pos,
                radius: position.coords.accuracy
            });
        }

        console.log("GPS accuracy: " + position.coords.accuracy + "m.");
    }catch(e){
        //console.log("Not able to get your current position.");
    }
}
function onError(error) {
    if (window.location.protocol != "https:")
        window.location.href = "https:" + window.location.href.substring(window.location.protocol.length);
    console.log('code: '    + error.code    + '\n' +
        'message: ' + error.message + '\n');
}

var init = includeHTML(); //Initializing the method once it's loaded.
/*
 Depricated

 function includeHTML() {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
    if(phonegap){
        //Clumsy, but only way I could get it work with phonegap.
        // Do this better if you can please!
        $('header').load("includes/header-full.html");
    }else{
        //From w3data script @ w3schools
        var z, i, a, file, xhttp;
        z = document.getElementsByTagName("*");
        for (i = 0; i < z.length; i++) {
            if (z[i].getAttribute("include")) {
                a = z[i].cloneNode(false);
                file = z[i].getAttribute("include");
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (xhttp.readyState == 4 && xhttp.status == 200) {
                        a.removeAttribute("include");
                        a.innerHTML = xhttp.responseText;
                        z[i].parentNode.replaceChild(a, z[i]);
                        includeHTML();
                    }
                }
                xhttp.open("GET", file, true);
                xhttp.send();
                return;
            }
        }
    }
}
init = null;*/


/**
 * Checking if device tye is mobile
 */
function deviceTypeCheck() {
    //url: http://stackoverflow.com/questions/3469908/make-a-link-in-the-android-browser-start-up-my-app
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
    if(phonegap && isIOS){
        $('head').append('<link rel="stylesheet" type="text/css" href="styles/ios.css">');
    }else if(isAndroid){
        $('head').append('<link rel="stylesheet" type="text/css" href="styles/android.css">');
    }
}