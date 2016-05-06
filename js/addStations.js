/**
 * Created by jonas on 03.03.16.
 */


var contentString;
var connectorsString;
var infoWindows = [];
var markerListeners = [];
var selectedCapacity = 0;

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
 */

var chargingCapacity =[];
chargingCapacity[0] = {'id':0,'name':'Unspecified','current':'ukjent', 'kW':0, 'volt':0, 'ampere':0};
chargingCapacity[1] = {'id':1,'name':'Battery exchange','current':'ukjent', 'kW':0, 'volt':0, 'ampere':0};
chargingCapacity[7] = {'id':7, 'name':'3,6 kW - 230V 1-phase max 16A','current':'AC', 'kW':3.6, 'volt':230, 'ampere':16};
chargingCapacity[8] = {'id':8, 'name':'7,4 kW - 230V 1-phase max 32A','current':'AC', 'kW':7.4, 'volt':230, 'ampere':32};
chargingCapacity[10] = {'id':10, 'name':'11 kW - 400V 3-phase max 16A','current':'AC', 'kW':11, 'volt':400, 'ampere':16};
chargingCapacity[11] = {'id':11, 'name':'22 kW - 400V 3-phase max 32A','current':'AC', 'kW':22, 'volt':400, 'ampere':22};
chargingCapacity[12] = {'id':12, 'name':'43 kW - 400V 3-phase max 63A','current':'AC', 'kW':43, 'volt':400, 'ampere':63};
chargingCapacity[13] = {'id':13, 'name':'50 kW - 500VDC max 100A','current':'DC', 'kW':50, 'volt':500, 'ampere':100};
chargingCapacity[23] = {'id':23, 'name':'100 kW - 500VDC max 200A','current':'DC', 'kW':100, 'volt':500, 'ampere':200};
chargingCapacity[16] = {'id':16, 'name':'230V 3-phase max 16A','current':'AC', 'kW':3.7, 'volt':230, 'ampere':16};
chargingCapacity[17] = {'id':17, 'name':'230V 3-phase max 32A','current':'AC', 'kW':7.3, 'volt':230, 'ampere':32};
chargingCapacity[18] = {'id':18, 'name':'230V 3-phase max 63A','current':'AC', 'kW':14.7, 'volt':230, 'ampere':64};
chargingCapacity[19] = {'id':19, 'name':'20 kW - 500VDC max 50A','current':'DC', 'kW':20, 'volt':500, 'ampere':50};
chargingCapacity[20] = {'id':20, 'name':'Less then 100 kW + 43 kW - 500VDC max 200A + 400V 3-phase max 63A','current':'DC', 'kW':43, 'volt':400, 'ampere':63};
chargingCapacity[21] = {'id':21, 'name':'Less then 100 kW + 22 kW - 500VDC max 50A + 400V 3-phase max 32A','current':'DC', 'kW':22, 'volt':400, 'ampere':32};
chargingCapacity[22] = {'id':22, 'name':'135 kW - 480VDC max 270A','current':'DC', 'kW':135, 'volt':480, 'ampere':270};


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
var totalSize = 0;
var loadedStations = 0;
var progText;
function generateMarkers(){
    $('#download-progression').show();
    loadedStations = 0;
    totalSize = Object.keys(jsonData).length;
    //TODO: Mer permanent fiks -> La brukeren velge selv
    var isPublic = false;
    try{
        if(document.getElementById("select-car").value !=0)
            carModel = carModels[document.getElementById("select-car").value];
        deleteMarkers();
        for(var station in jsonData){
            try{
                connectors.length = 0;
                isPublic = jsonData[station].attr.st[2].attrvalid == "1";
                if(isPublic){
                    //Checking filter
                    var isMatch = getCarMatch(jsonData[station].csmd.Number_charging_points, station);

                    if(isMatch)
                        addMarker(station);
                }
                loadedStations++;
                progText = loadedStations + ' av ' + totalSize + ' stasjoner er lastet inn.';
                //console.log(progText); //TODO -> printing out loading progression
            }catch(err){
                console.log(err);
            }
        }
        //Telling the app, that it is now allowed to done importing objects, so it can now download stuff if needed.
        $('#download-progression').hide();
        hasDownloaded = true;
    }catch(e){
        $('.dl-progress-text').text("Innlasting har feilet med følgende feilmeling: " + e);
    }
    if(mc == null)
        mc = new MarkerClusterer(map, markers, mcOptions);
    else{
        mc.clearMarkers();
        mc.addMarkers(markers);
    }
    $('#download-progression').hide();
    hasDownloaded = true;
    updateNearbyChargers();
}

function getCarMatch(portCount, station){
    var match = false;
    var connType;
    for(var c = 1; c <= portCount; c++){
        //Checking if any connection ports match the user prefs
        try{
            connType = jsonData[station].attr.conn[c][4].attrvalid; //id
            if(document.getElementById("select-car").value != 0 && !match && ($.inArray(connType, carModel)>0) && (selectedCapacity <= chargingCapacity[jsonData[station].attr.conn[c][5].attrvalid].kW)){
                match = true;
                console.log(document.getElementById("select-car").value +"Selected: " + selectedCapacity + " Current: " + chargingCapacity[jsonData[station].attr.conn[c][5].attrvalid].kW + " ID is: " +jsonData[station].attr.conn[c][5].attrvalid);
            }else if(document.getElementById("select-car").value == 0 && !match && (selectedCapacity <= chargingCapacity[jsonData[station].attr.conn[c][5].attrvalid].kW)){
               //If no car or type is selected
               match = true;
            }
            connectors.push(object.attr.conn[c]);
        }catch(e){
            //console.log(e);
        }
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
    var pos = jsonData[station].csmd.Position.replace(/[()]/g,"").split(",");

    var isLive = jsonData[station].attr.st[21].attrvalid == "1";



    //TODO: Fikse nestet short if: de markørene som har hurtigladekontakt skal ha _v2.svg (den med vinger)

    var markerIcon = {
        url: 'icons/'+(isLive ? 'marker_green_v3':'marker_blue_v3')+'.svg', //Changing the color of the marker based on if it has live status or not.
        anchor: new google.maps.Point(0, 32),
        origin: new google.maps.Point(0, 0),
        scaledSize: new google.maps.Size(32, 51),
        size: new google.maps.Size(64, 64)
    };

    var marker = new google.maps.Marker({
        position:{lat: parseFloat(pos[0]), lng: parseFloat(pos[1])},
        icon: markerIcon,
        map: map,
        title: jsonData[station].csmd.name
    });



    //TODO: Sjekk ut http://en.marnoto.com/2014/09/5-formas-de-personalizar-infowindow.html
    var maxWidth = (isMobile?500:500);
    var maxHeight = (isMobile?300:500);

    var infowindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: maxWidth,
        maxHeight: maxHeight
    });


    infoWindows.push(infowindow);
    markerListeners.push(google.maps.event.addListener(infowindow, 'domready', function() {

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

    }));
    /*
     * Making it so that the popups disappear upon click outside box
     */
    markerListeners.push(google.maps.event.addListener(map, 'click', function() {
        if (infowindow) {
            infowindow.close();
        }
    }));
    markerListeners.push(marker.addListener('click', function() {
        for(iw in infoWindows){
            infoWindows[iw].setContent(null);
            infoWindows[iw].close();
        }
        infowindow.open(map, marker);

        infowindow.setContent(createIWContent(station, isLive));
        //Loading the image now, instead of on page ready to save data and memory usage
        /*TODO: if(!$(".img-to-load").attr("src"))
            $(".img-to-load").prop("src",imgSrc);*/
    }));
    markers.push(marker);

    //Building closest charging stations list
    try{
        if(compareDistance(geopos, pos) <= 10){
            chargers_nearby[jsonData[station].csmd.id] = jsonData[station];
            chargers_nearby[jsonData[station].csmd.id]["distance"] = compareDistance(geopos, pos);
        }
    }catch(e){console.log(e);}
}

//A method for generating the content of a infowindow
function createIWContent(station, isLive) {
    var isInService = true;

    var connStatus = "9";

    var match = false;
    var connType;
    if(document.getElementById("select-car").value !=0)
        carModel = carModels[document.getElementById("select-car").value];

    //Showing a info windows when you click on the marker
    connectorsString = '<div style="margin:0;">';
    for(var c = 1; c <= jsonData[station].csmd.Number_charging_points; c++){
        try{//Could be one single string.. I know..and now it is, WOW
            if(isLive){
                try {
                    isInService = jsonData[station].attr.conn[c][9].attrvalid == "0";
                    connStatus = jsonData[station].attr.conn[c][8].attrvalid;
                } catch(e) {}
            }
            var capacity = (chargingCapacity[jsonData[station].attr.conn[c][5].attrvalid].kW);
            var dass = (capacity >= 43 ? 'Hurtiglader' : (capacity >= 12 ? "Semihurtig": "Vanlig"));
            connectorsString +=
                "<div class='cpelements'>"+
                    "<span style=\'color:black; width:90%; float:left;\'>"+
                        jsonData[station].attr.conn[c][4].trans + "(" + dass +")" +
                        "<br />" + jsonData[station].attr.conn[c][5].trans +
                    "</span>"+
                    "<div class='chargePointColor' style='background-color:"+ (isLive ? (isInService ? (connStatus == "0" ? "lightgreen" : (connStatus == "9" ? "blue" : "yellow")) : "red") : "blue") +";'>"+
                    "</div>"+
                "</div>";
        }catch(e){
            console.log('Failed to build connectorsString for ' + jsonData[station].csmd.name);
        }
    }
    connectorsString += "</div>";


    //var latlng = new Array();//{lat:  lng: };
    //latlng.push();
    //getElevation(new google.maps.LatLng(parseFloat(pos[0]), parseFloat(pos[1])))
    //TODO: var imgSrc = (/kommer/i.test(jsonData[station].csmd.Image.toLowerCase()) || /no.image.svg/i.test(jsonData[station].csmd.Image.toLowerCase())? 'icons/logo.svg' : 'http://www.nobil.no/img/ladestasjonbilder/'+ jsonData[station].csmd.Image);
    contentString =
        "<div id=\"station-tooltip\">"+
            "<div id=\"topBox\">"+
            "</div>"+
            "<div id=\"secondRow\">" +
            "<img class='img-to-load' src=\""+(/kommer/i.test(jsonData[station].csmd.Image.toLowerCase()) || /no.image.svg/i.test(jsonData[station].csmd.Image.toLowerCase())? 'icons/logo.svg' : 'http://www.nobil.no/img/ladestasjonbilder/'+ jsonData[station].csmd.Image) + "\"/>" +
                "<div id='placeNameIcons' style='color:blue;'>"+
                    "<h3>"+ jsonData[station].csmd.name + "(ID:" + station + ")</h3>" +
                "</div>"+
                "<div class='markerColor' style='background-color:"+ (isLive ? "lightgreen" : "blue") +";'>"+
                "</div>"+
            "</div>"+
            "<div id='secondContainer'>"+
                "<div id='infoLeft'>"+
                    "<p><strong>Kontakt info:</strong> "+ jsonData[station].csmd.Contact_info.replace('\r\n','<br />')+"</p>" +
                    "<p><strong>Adresse:</strong> "+ jsonData[station].csmd.Street.replace('\r\n','<br />') +" " + jsonData[station].csmd.House_number.replace('\r\n','<br />') +"</p>"+
                    "<p><strong>Beskrivelse:</strong> "+ jsonData[station].csmd.description +"</p>" + // .replace('\r\n','<br />') her også?
                    "<p><strong>Lokasjonsbeskrivelse:</strong> "+ jsonData[station].csmd.Description_of_location +"</p>" +
                    "<p><strong>Eier:</strong> " + jsonData[station].csmd.Owned_by.replace('\r\n','<br />') +"</p>" +
                    "<p><strong>Kommentarer:</strong> "+ jsonData[station].csmd.User_comment.replace('\r\n','<br />')+"</p>" +
                "</div>"+
                "<div id='chargingPoints'>"+
                    "<p style='border-bottom:1px solid gray;margin-bottom:0;'><strong>Ladepunkter:</strong> "+ jsonData[station].csmd.Number_charging_points+" </p>" +
                    "<div> "+
                    connectorsString +
                    "</div>" +
                "</div>"+
            "</div>"+
            "<div id='lowerContainer'>"+
                '<button onclick="addWaypoint(\'' + station + '\')" >Legg til i rute</button>' +
                '<button onclick="navigateFromUser(geopos, this)" value="'+ jsonData[station].csmd.Position.replace(/[()]/g,"") +'">Ta meg hit</button>'+
            "</div>"+
        "</div>";
    return contentString;
}

/*
 * A method for adding a selected station to the waypoints
 */
function addWaypoint(id){
    var disPos = jsonData[id].csmd.Position.replace(/[()]/g,"").split(",");
    var isLive = jsonData[id].attr.st[21].attrvalid == "1";
    waypoints.push(
        {location: new google.maps.LatLng(disPos[0],disPos[1])}
    );
    waypoints.sort(function (a, b){
        var arr = [a.lat, a.lon];
        var barr = [b.lat, b.lon];
        return compareDistance(arr, barr) > 0 ? 1 : 0;
    });
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

