/**
 * Created by jonas on 23.04.2016.
 */
var phonegap = false;

var onSuccess = function(position) {
    geopos = [position.coords.latitude, position.coords.longitude];

    var me = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    myloc.setPosition(me);
}
function onError(error) {
    alert('code: '    + error.code    + '\n' +
        'message: ' + error.message + '\n');
}
var init = includeHTML(); //Initializing the method once it's loaded.
function includeHTML() {
    /*
    $('header[include]').each(function() {
        $(this).load( $(this).attr('include')).trigger('create');
    });*/
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
init = null;


