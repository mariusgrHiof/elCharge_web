/**
 * Created by jonas on 23.04.2016.
 */
var isAndroid = false;
var isIOS = false;
var phonegap = true;
var isMobile = false;

var init = includeHTML(); //Initializing the method once it's loaded.
function includeHTML() {
    deviceTypeCheck();
    /*
    $('header[include]').each(function() {
        $(this).load( $(this).attr('include')).trigger('create');
    });*/
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
init = null;

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
    }
}
