/**
 * Created by jonas on 03.03.16.
 */



var typeIDs = new Array();
typeIDs['0'] = "Unspecified";
typeIDs['14'] = "Schuko";
typeIDs['22'] = "Danish (Section 107-2-D1)";
typeIDs['29'] = "Tesla Connector Roadster";
typeIDs['30'] = "CHAdeMO";
typeIDs['31'] = "Type 1";
typeIDs['32'] = "Type 2";
typeIDs['60'] = "Type1/Type2";
typeIDs['34'] = "Blue industrial 3-pin";
typeIDs['35'] = "Blue industrial 4-pin";
typeIDs['36'] = "Red industrial 5-pin";
typeIDs['38'] = "Marechal";
typeIDs['39'] = "CCS/Combo";
typeIDs['40'] = "Tesla Connector Model";
typeIDs['41'] = "Combo + CHAdeMO";
typeIDs['42'] = "CHAdeMO + Type 2";
typeIDs['43'] = "CHAdeMO + Combo + AC-Type2";
typeIDs['50'] = "Type 2 + Schuko";
typeIDs['52'] = "Type 2 + Danish (Section 107-2-D1)";

var schuko = ['14', '50'];
var type1 = ['31', '60'];
var type2 = ['32', '60', '42', '50', '52'];
var type2ac = ['43'];
var chademo = ['30', '41', '42', '43'];
var combo = ['39', '41'];
var ind3pin = ['34'];
var ind4pin = ['35'];
var ind5pin = ['36'];
var teslaModelS = ['40'];
var teslaRoadster = ['29'];

//http://ladestasjoner.no/ladehjelpen/praktisk/51-hvilke-elbiler-kan-lade-med-hva
var carModels = new Array();
carModels['Nissan Leaf'] = schuko.concat(schuko, type1, type2, chademo);
carModels['BMW i3'] = schuko.concat(schuko, type2, combo);
carModels['Buddy'] = schuko;
carModels['Citroën Berlingo'] = schuko.concat(schuko, type1, type2, chademo);
carModels['Citroën C-ZERO'] = schuko.concat(schuko, type1, type2, chademo);
carModels['Ford Focus Electric'] = schuko.concat(schuko,type1, type2);
carModels['Kia Soul Electric'] = schuko.concat(schuko, type1, type2, chademo);
carModels['Mercedes B-klasse ED'] = schuko.concat(schuko, type2);
carModels['Mitsubishi i-MIEV'] = schuko.concat(schuko, type1, type2, chademo);
carModels['Nissan e-NV200/Evalia'] = schuko.concat(schuko, type1, type2, chademo);
carModels['Peugeot iOn'] = schuko.concat(schuko, type1, type2, chademo);
carModels['Peugeot Partner'] = schuko.concat(schuko, type1, type2, chademo);
carModels['Renault Kangoo ZE'] = schuko.concat(schuko, type1, type2);
carModels['Renault Twizy'] = schuko;
carModels['Renault Zoe'] = schuko.concat(schuko,type2);
carModels['Reva'] = schuko;
carModels['Tesla Model S'] = schuko.concat(schuko, type2, ind3pin, ind5pin, teslaModelS);
carModels['Tesla Roadster'] = schuko.concat(schuko, teslaRoadster);
carModels['Think'] = schuko;
carModels['VW e-Golf'] = schuko.concat(schuko, type2, combo);
carModels['VW e-up!'] = schuko.concat(schuko, type1, type2);

var carModel = new Array();

/*
 * Charging capacity
 * name, current, kw, v, max a
 * http://nobil.no/admin/attributes.php
 *
 * Attribute value id	Name	Translated	Key
 * 0	Unspecified
 * 1	Battery exchange
 * 7	3,6 kW - 230V 1-phase max 16A
 * 8	7,4 kW - 230V 1-phase max 32A
 * 10	11 kW - 400V 3-phase max 16A
 * 11	22 kW - 400V 3-phase max 32A
 * 12	43 kW - 400V 3-phase max 63A
 * 13	50 kW - 500VDC max 100A
 * 23	100 kW - 500VDC max 200A
 * 16	230V 3-phase max 16A
 * 17	230V 3-phase max 32A
 * 18	230V 3-phase max 63A
 * 19	20 kW - 500VDC max 50A
 * 20	Less then 100 kW + 43 kW - 500VDC max 200A + 400V 3-phase max 63A
 * 21	Less then 100 kW + 22 kW - 500VDC max 50A + 400V 3-phase max 32A
 * 22	135 kW - 480VDC max 270A
 */

var chargingCapacity =[
    {'id':0,'name':'Unspecified','current':'ukjent', 'watt':0, 'volt':0, 'ampere':0},
    {'id':1,'name':'Battery exchange','current':'ukjent', 'watt':0, 'volt':0, 'ampere':0},
    {'id':7, 'name':'3,6 kW - 230V 1-phase max 16A','current':'AC', 'kW':3.6, 'volt':230, 'ampere':16},//husholdning
    {'id':8, 'name':'7,4 kW - 230V 1-phase max 32A','current':'AC', 'kW':7.4, 'volt':230, 'ampere':32},
    {'id':10, 'name':'11 kW - 400V 3-phase max 16A','current':'AC', 'kW':11, 'volt':400, 'ampere':16},//semihurtig
    {'id':11, 'name':'22 kW - 400V 3-phase max 32A','current':'AC', 'kW':22, 'volt':400, 'ampere':22}//semihurtig
];



var connectors = new Array();


/**
 *
 * @param callback
 */


/* usage
 readTextFile(function(text){
 var data = JSON.parse(text);
 console.log(data);
 });
 */
//Filter for gratis, hurtigladere og offentlige ladere
function updateCarList(){
    //Adding elements to the car list dropdown
    for(car in carModels){
        document.getElementById('select-car').innerHTML += '<option value="'+car+'">' + car + '</option>';
    }
}


function generateMarkers(){
    //TODO: Mer permanent fiks -> La brukeren velge selv
    var isPublic = false;
    deleteMarkers();
    for(var station in jsonData){
        connectors = [];
        isPublic = jsonData[station].attr.st[2].attrvalid == "1" ? true : false;
        if(isPublic){
            var numOfPorts = jsonData[station].csmd.Number_charging_points;
            /**
             * TODO: Hvis ikke filtrer -> duplikater av conns O_o
             * TODO: Hvis filtrer -> Viser kun de kontakter som funker til bilen O_o
             */
            //Checking filter
            if(document.getElementById("select-car").value !=0){
                carModel = carModels[document.getElementById("select-car").value];

                //TODO: Fiks sånn at vi sjekker begge ladeportene og ikke kun den første av de.
                var isMatch = getCarMatch(i, numOfPorts, jsonData[station]);
                if(isMatch){
                    addMarker(i, jsonData);
                }
            }else{
                for(var c = 1; c <= numOfPorts; c++){
                    try{
                        connectors.push(jsonData[station].attr.conn[c]);
                    }catch(e){}
                }
                //Adding all charging stations
                addMarker(jsonData[station]);
            }
        }
        //TODO: FIX! var mc = new google.maps.MarkerClusterer(map, markers, options);

    }

    getNearbyChargers();
    if(mc == null)
        mc = new MarkerClusterer(map, markers, mcOptions);
    else{
        mc.clearMarkers();
        mc.addMarkers(markers);
    }
}

function getCarMatch(index, portCount, object){
    var match = false;
    var connType;
    for(var c = 1; c <= portCount; c++){
        //Checking if any connection ports match the user prefs
        try{
            connType = object.attr.conn[c][4].attrvalid; //id
            if(!match && ($.inArray(connType, carModel)>0)){
                match = true; //trans
            }
            connectors.push(object.attr.conn[c]);
        }catch(e){}
    }
    return match;
}

function getMatchConnectorType(index, portCount, object){
    var match = false;
    var connType;
    for(var c = 1; c <= portCount; c++){
        console.log("connector num: "+c);
        //Checking if any connection ports match the user prefs
        try{
            connType = object.attr.conn[c][4].trans;//.attrvalid;//Getting one of the connectors ID
            if(!match && connType.indexOf(typeIDs[document.getElementById("select_port").value]) >= 0){// == typeID)
                match = true; //trans
                console.log('index: ' + connectorArray.length-1 + ' trans: ' + object.attr.conn[c][4].trans);
            }
            connectors.push(object.attr.conn[c]);
        }catch(e){}
    }
    return match;
}

function addMarker(station){
    //Adding markers
    var pos = station.csmd.Position.replace(/[()]/g,"").split(",");

    var isLive = station.attr.st[21].attrvalid == "1";



    //TODO: Fikse nestet short if: de markørene som har hurtigladekontakt skal ha _v2.svg (den med vinger)

    var markerIcon = {
        url: 'icons/'+(isLive ? 'marker_green_v3':'marker_blue_v3')+'.svg', //Changing the color of the marker based on if it has live status or not.
        anchor: new google.maps.Point(0, 32),
        origin: new google.maps.Point(0, 0),
        scaledSize: new google.maps.Size(32, 51),
        size: new google.maps.Size(64, 64)
    };

    var marker = new google.maps.Marker({
        position:{lat: parseFloat(pos[0]), lng: parseFloat(pos[1])}/*,
        icon: {
            path: markerIcon,
            scale: 1
        }*/,
        icon: markerIcon,
        map: map,
        title: station.csmd.name
    });



    var isInService = true;

    var connStatus = "9";

    //Showing a info windows when you click on the marker
    var connectorsString = '<div style="margin:0;">';
    for(var i = 0; i < connectors.length; i++){

        try{//Could be one single string.. I know..and now it is, WOW
            if(isLive){
                try {
                    isInService = connectors[i][9].attrvalid == "0";
                    connStatus = connectors[i][8].attrvalid;
                } catch(e) {}
            }
            connectorsString +=
                "<div class='cpelements'>"+
                    "<span style=\'color:black; width:90%; float:left;\'>"+
                        connectors[i][4].trans+
                        "<br />" + connectors[i][5].trans+
                    "</span>"+
                    "<div class='chargePointColor' style='background-color:"+ (isLive ? (isInService ? (connStatus == "0" ? "lightgreen" : (connStatus == "9" ? "blue" : "yellow")) : "red") : "blue") +";'>"+
                    "</div>"+
                "</div>";
        }catch(e){
            console.log('Failed to build connectorsString for ' + station.csmd.name);
        }

    }
    connectorsString += "</div>";


    //var latlng = new Array();//{lat:  lng: };
    //latlng.push();
    //getElevation(new google.maps.LatLng(parseFloat(pos[0]), parseFloat(pos[1])))

    var contentString =
        "<div id=\"station-tooltip\">"+
            "<div id=\"topBox\">"+
            "</div>"+
            "<div id=\"secondRow\">"+
                "<img src=\"" + (/kommer/i.test(station.csmd.Image.toLowerCase())? 'icons/logo.svg' : 'http://www.nobil.no/img/ladestasjonbilder/'+ station.csmd.Image) + "\"/>" +
                "<div id='placeNameIcons' style='color:blue;'>"+
                    "<h3>"+ station.csmd.name + "(ID:" + station.csmd.id + ")</h3>" +
                "</div>"+
                "<div class='markerColor' style='background-color:"+ (isLive ? "lightgreen" : "blue") +";'>"+
                "</div>"+
            "</div>"+
            "<div id='secondContainer'>"+
                "<div id='infoLeft'>"+
                    "<p><strong>Kontakt info:</strong> "+ station.csmd.Contact_info+"</p>" +
                    "<p><strong>Adresse:</strong> "+ station.csmd.Street +" " + station.csmd.House_number +"</p>"+
                    "<p><strong>Beskrivelse:</strong> "+ station.csmd.description +"</p>" +
                    "<p><strong>Lokasjonsbeskrivelse:</strong> "+ station.csmd.Description_of_location +"</p>" +
                    "<p><strong>Eier:</strong> " + station.csmd.Owned_by +"</p>" +
                    "<p><strong>Kommentarer:</strong> "+ station.csmd.User_comment+"</p>" +
                "</div>"+
                "<div id='chargingPoints'>"+
                    "<p style='border-bottom:1px solid gray;margin-bottom:0;'><strong>Ladepunkter:</strong> "+ station.csmd.Number_charging_points+" </p>" +
                    "<div> "+
                        connectorsString +
                    "</div>" +
                "</div>"+
            "</div>"+
            "<div id='lowerContainer'>"+
                "<button onclick='addWaypoint(" + station.csmd.id + "," + pos[0] + "," + pos[1] + ")'>Legg til i rute</button>" +
                '<button onclick="navigateFromUser(geopos, this)" value="'+ station.csmd.Position.replace(/[()]/g,"") +'">Ta meg hit</button>'+
            "</div>"+
        "</div>";
        station.csmd.name;

    //TODO: Sjekk ut http://en.marnoto.com/2014/09/5-formas-de-personalizar-infowindow.html
    var maxWidth = (isMobile?500:500);
    var maxHeight = (isMobile?300:500);
    var infowindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: maxWidth,
        maxHeight: maxHeight
    });

    google.maps.event.addListener(infowindow, 'domready', function() {

        // Reference to the DIV which receives the contents of the infowindow using jQuery
        var iwOuter = $('.gm-style-iw');
        //var iwParent = $(iwOuter).parent().css({'height':'100% !important'});

        /* The DIV we want to change is above the .gm-style-iw DIV.
         * So, we use jQuery and create a iwBackground variable,
         * and took advantage of the existing reference to .gm-style-iw for the previous DIV with .prev().
         */
        var iwBackground = iwOuter.prev();

        // Remove the background shadow DIV
        iwBackground.children(':nth-child(2)').css({'display' : 'none'});

        // Remove the white background DIV
        iwBackground.children(':nth-child(4)').css({'display' : 'none'});

    });
    /*
     * Making it so that the popups disappear upon click outside box
     */
    google.maps.event.addListener(map, 'click', function() {
        if(infowindow){
            infowindow.close();
        }
    });

    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });

    markers.push(marker);

    //Building closest charging stations list
    if(compareDistance(geopos, pos) <= 10){
        chargers_nearby[chargers_nearby.length] = station;
    }
}
/*
 * A method for adding a selected station to the waypoints
 */
function addWaypoint(id, lat, lon){

    var isLive = jsonData[id].attr.st[21].attrvalid == "1" ? true : false;
    waypoints.push({location: lat + "," + lon});
    var content =
        "<div class='route-element'>" +
            "<img src=\"" + (/kommer/i.test(jsonData[id].csmd.Image.toLowerCase())? 'icons/logo.svg' : 'http://www.nobil.no/img/ladestasjonbilder/'+ jsonData[id].csmd.Image) + "\"/>" +
            "<span>" + jsonData[id].csmd.name +"</span>"+
            "<div class='markerColor' style='background-color:"+ (isLive ? "lightgreen" : "blue") +";'>"+
            "<button onclick=\"removeWaypoint(this)\">X</button></p>"+
        "</div>";
    document.getElementById('waypoint-list').innerHTML += content;

    //Refreshing the route if it's active
    if($('#nav-start-pos').val() != "" && $('#nav-end-pos').val() != ""){
        navigate();
    }
}

function removeWaypoint(element){
    var parent = $(element).parent().parent();
    var index = $(parent).index();

    //Removing the waypoint from the html
    $(parent).remove();
    //Removing elements from waypoints and moving the other elements down in the array.
    if(index > -1){
        waypoints.splice(index, 1);
    }

    //Refreshing the route if it's active
    if($('#nav-start-pos').val() != "" && $('#nav-end-pos').val() != ""){
        navigate();
    }
}

/** 
 * Live data
 * API: http://java-coders.com/p/nobil/nobil-stream-api
 * Websocket:
 * - how to: https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications
 * - Wiki: https://en.wikipedia.org/wiki/WebSocket
 */