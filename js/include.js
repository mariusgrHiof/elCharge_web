/**
 * Created by jonas on 23.04.2016.
 */

var init = includeHTML(); //Initializing the method once it's loaded.
function includeHTML() {
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
    initMap();
}
init = null;