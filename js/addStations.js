/**
 * Created by jonas on 03.03.16.
 */

var contentString;
var connectorsString;
var infoWindows = [];
var markerListeners = [];
var selectedCapacity = 0;
var occupiedLimit = 0.4;
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

//List of individual connector types
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

//Source: http://ladestasjoner.no/ladehjelpen/praktisk/51-hvilke-elbiler-kan-lade-med-hva
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

var usersCarConns = new Array();

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

function updateCarList(){
    //Adding elements to the car list dropdown
    for(car in carModels){
        document.getElementById('select-car').innerHTML += '<option value="'+car+'">' + car + '</option>';
    }
}
var totalSize = 0;
var loadedStations = 0;
var hasFastCharge = false; // For the marker icons

var faultyConns = 0;
function generateMarkers(){
    $('#download-progression').show();
    loadedStations = 0;
    totalSize = Object.keys(jsonData).length;
    var isPublic = false;
    try{
        if(document.getElementById("select-car").value !=0)
            usersCarConns = carModels[document.getElementById("select-car").value];
        deleteMarkers();
        for(var id in jsonData){
            try{
                connectors.length = 0;
                if(getCarMatch(id))
                    addMarker(jsonData[id].csmd.Number_charging_points, id);
                if(inArray(id, favoriteStations))
                    updateFavoriteStations(id);
            }catch(err){}
        }
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
}

function getCarMatch(id){
    var match = false;
    var connType;
    var hasFastCharge_temp = false;
    var isFaulty = false;
    hasFastCharge = false;
    faultyConns = 0;
    for(var c = 1; c <= jsonData[id].csmd.Number_charging_points; c++){
        //Checking if any connection ports match the user prefs
        try{
            connType = jsonData[id].attr.conn[c][4].attrvalid; //id
            if(document.getElementById("select-car").value != 0 && !match && inArray(connType, usersCarConns) && (selectedCapacity <= chargingCapacity[jsonData[id].attr.conn[c][5].attrvalid].kW))
                match = true;
            else if(document.getElementById("select-car").value == 0 && !match && (selectedCapacity <= chargingCapacity[jsonData[id].attr.conn[c][5].attrvalid].kW))
               //If no car or type is selected
               match = true;
            if(jsonData[id].attr.conn[c][9].attrvalid == 1)//Is a faulty connector
                faultyConns++;
            //For the markers, to indicate if a id has a fast charger or not!
            if(!hasFastCharge_temp && (fastCharge <= chargingCapacity[jsonData[id].attr.conn[c][5].attrvalid].kW))
                hasFastCharge = true;
            connectors.push(object.attr.conn[c]);
        }catch(e){}
    }
    return match;
}

function addMarker(numOfPorts, id){
    //Adding markers
    var pos = jsonData[id].csmd.Position.replace(/[()]/g,"").split(",");
    var isLive = jsonData[id].attr.st[21].attrvalid == "1";
    var marker;
    var markerIcon = {
        url: 'icons/'+(
            isLive ? (hasFastCharge ?
                (faultyConns/numOfPorts == 1 ? 'marker_red_v2' :( isStationOccupiedStatus(id) > occupiedLimit ? 'marker_green_v2' : 'marker_yellow_v2')):
                (faultyConns/numOfPorts == 1 ? 'marker_red_v3' :( isStationOccupiedStatus(id) > occupiedLimit ? 'marker_green_v3' : 'marker_yellow_v3')))
                :(hasFastCharge ? (faultyConns/numOfPorts == 1 ? 'marker_red_v2' :'marker_blue_v2'):(faultyConns/numOfPorts == 1 ? 'marker_red_v3' :'marker_blue_v3')))+'.svg', //Changing the color of the marker based on if it has live status or not.
        anchor: new google.maps.Point(0, 32),
        origin: new google.maps.Point(0, 0),
        scaledSize: new google.maps.Size(32, 51),
        size: new google.maps.Size(64, 64)
    };


    if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
        marker = new google.maps.Marker({
            position:{lat: parseFloat(pos[0]), lng: parseFloat(pos[1])},
            map: map,
            title: jsonData[id].csmd.name
        });
    else
        marker = new google.maps.Marker({
            position:{lat: parseFloat(pos[0]), lng: parseFloat(pos[1])},
            icon: markerIcon,
            map: map,
            title: jsonData[id].csmd.name
        });

    var maxWidth = (isMobile?500:500);
    var maxHeight = (isMobile?300:500);

    var infowindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: maxWidth,
        maxHeight: maxHeight
    });

    infoWindows.push(infowindow);
    markerListeners.push(google.maps.event.addListener(infowindow, 'domready', function() {
        var iwOuter = $('.gm-style-iw');
        var iwBackground = iwOuter.prev();

        // Remove the background shadow DIV
        iwBackground.children(':nth-child(2)').css({'display' : 'none'});

        // Remove the white background DIV
        iwBackground.children(':nth-child(4)').css({'display' : 'none'});

        var iwCloseBtn = iwOuter.next();
        iwCloseBtn.css({
            opacity: '1',
            right: '52px',
            top: '16px'

        });
        iwCloseBtn.addClass('iw-close-btn');

        iwCloseBtn.mouseout(function(){
           $(this).css({opacity: '1'});
        });

    }));

     //Making it so that the popups disappear upon click outside box
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

        infowindow.setContent(createIWContent(id, isLive));
    }));
    markers.push(marker);

    //Building closest charging stations list
    try{
        if(compareDistance(geopos, pos) <= 10){
            chargers_nearby[jsonData[id].csmd.id] = jsonData[id];
            chargers_nearby[jsonData[id].csmd.id]["distance"] = compareDistance(geopos, pos);
        }
    }catch(e){console.log(e);}
}

function isStationOccupiedStatus(id){

    return parseFloat(jsonData[id].csmd.Available_charging_points) / parseFloat(jsonData[id].csmd.Number_charging_points);
}

//A method for generating the content of a infowindow
function createIWContent(id, isLive) {
    if(document.getElementById("select-car").value !=0)
        usersCarConns = carModels[document.getElementById("select-car").value];

    //Showing a info windows when you click on the marker
    connectorsString = generateConnectorString(id, isLive);
    console.log(jsonData[id].csmd.Contact_info);
    contentString =
        "<div id=\"station-tooltip\">"+
            "<div id=\"topBox\">"+
            "</div>"+
            "<div id=\"secondRow\">" +
                "<img class='img-to-load' src=\""+ getStationImage(id) + "\"/>" +
                "<div id='placeNameIcons' style='color:blue;'>"+
                    "<h3>"+ jsonData[id].csmd.name + "(ID:" + id + ")</h3>" +
                    "<p><strong>Tilgjengelighet</strong> "+ jsonData[id].attr.st[2].trans.replace('\r\n','<br />')+"</p>" +
                "</div>"+
                "<div class='markerColor' style='background-color:"+ (faultyConns / jsonData[id].csmd.Number_charging_points == 1 ? "red" : (isLive ? (isStationOccupiedStatus(id) < occupiedLimit ? "yellow":"lightgreen") : "blue")) + ";'>"+
                "</div>"+
            "</div>"+
            "<div id='secondContainer'>"+
                "<div id='infoLeft'>"+
                    "<p><strong>Adresse:</strong> "+ jsonData[id].csmd.Street.replace('\r\n','<br />') +" " + jsonData[id].csmd.House_number.replace('\r\n','<br />') + ", " + jsonData[id].csmd.Zipcode.replace('\r\n','<br />') + " " + jsonData[id].csmd.City.replace('\r\n','<br />') +"</p>"+
                    "<p><strong>Lokasjonsbeskrivelse:</strong> "+ jsonData[id].csmd.Description_of_location +"</p>" +
                    "<p><strong>Eier:</strong> " + jsonData[id].csmd.Owned_by.replace('\r\n','<br />') +"</p>" +
                    "<p><strong>Kommentarer:</strong> "+ jsonData[id].csmd.User_comment.replace('\r\n','<br />')+"</p>" +
                    (jsonData[id].csmd.Contact_info != null ? "<p><strong>Kontakt info:</strong> "+ jsonData[id].csmd.Contact_info.replace('\r\n','<br />')+"</p>" : "") +
                "</div>"+
                "<div id='chargingPoints'>"+
                    "<p style='border-bottom:1px solid gray;margin-bottom:0;'><strong>Ladepunkter:</strong> "+ jsonData[id].csmd.Number_charging_points + " </p>" +
                    "<div> "+
                        connectorsString +
                    "</div>" +
                "</div>"+
            "</div>"+

            "<div id='lowerContainer'>"+
                '<button onclick="addWaypoint(\'' + id + '\')" >Legg til i rute</button>' +
                '<button onclick="navigateFromUser(geopos, this)" value="'+ jsonData[id].csmd.Position.replace(/[()]/g,"") +'">Ta meg hit</button>'+

                '<button onclick="addToFavorites(\'' + id + '\')" >Legg til favoritt</button>' +
            "</div>"+
        "</div>";
    return contentString;
}
function generateConnectorString(station, isLive){
    var isInService = true;
    var connStatus = "9";
    faultyConns = 0;

    var result = '<div style="margin:0.1em 0 0.1em 0;">';
    for(var c = 1; c <= jsonData[station].csmd.Number_charging_points; c++){
        try{
            if(isLive){
                try {
                    isInService = jsonData[station].attr.conn[c][9].attrvalid == "0";
                    connStatus = jsonData[station].attr.conn[c][8].attrvalid;
                    if(jsonData[station].attr.conn[c][9].attrvalid == 1){//Is a faulty connector
                        faultyConns++;
                    }
                } catch(e) {}
            }
            result +=
                "<div class='cpelements'>"+
                    "<span style=\'color:black; width:90%; float:left;\'>"+
                        jsonData[station].attr.conn[c][4].trans + "(" + connCapacityString(station, c) + ")" +
                        connectorImg(jsonData[station].attr.conn[c][4].attrvalid) +
                    "</span>"+
                    "<div class='chargePointColor' style='background-color:" + (isLive ? (isInService ? (connStatus == "0" ? "lightgreen" : (connStatus == "9" ? "blue" : "yellow")) : "red") : "blue") +";'>"+
                    "</div>"+
                "</div>";
        }catch(e){
            console.log('Failed to build connectorsString for ' + jsonData[station].csmd.name + " Error: " + e);
        }
    }
    return result += "</div>";
}

function connectorImg(connType) {
    var img;
    if(inArrayVal(connType, schuko))
        img = 'schuko.svg';
    else if(inArrayVal(connType, type1))
        img = 'type1.svg';
    else if(inArrayVal(connType, type2))
        img = 'type2_tesla.svg';
    else if(inArrayVal(connType, chademo))
        img = 'chademo.svg';
    else if(inArrayVal(connType, combo))
        img = 'combo1.svg';
    else if(inArrayVal(connType, ind3pin))
        img = 'industrial3pin.svg';
    else if(inArrayVal(connType, ind4pin))
        img = 'industrial4pin.svg';
    else if(inArrayVal(connType, ind5pin))
        img = 'industrial5pin.svg';
    else if(inArrayVal(connType, teslaModelS))
        img = 'type2_tesla.svg';
    else if(inArrayVal(connType, teslaRoadster))
        img = 'tesla_r.svg';

    return '<img class="float-right" src="icons/conn/'+ img +'" style="max-height:2em; max-width:2em;"/>';
}

function strToLtLng(pos){
    var arr = pos.replace(/[()]/g,"").split(",");
    return new google.maps.LatLng(arr[0],arr[1]);
}

//A method for adding a selected station to the waypoints
function addWaypoint(id){
    try{
        var disPos = jsonData[id].csmd.Position.replace(/[()]/g,"").split(",");
        var isLive = jsonData[id].attr.st[21].attrvalid == "1";
        waypoints.push(
            {location: new google.maps.LatLng(disPos[0],disPos[1])}
        );

        var content =
            "<div class='route-element station-"+ id +"'>" +
            "<img class='cover-third float-left' src=\"" + getStationImage(id) + "\"/>" +
            "<div class='float-left' style='width:calc( 66% - 1.1em );'>"+
            "<Strong>" + jsonData[id].csmd.name +"</Strong>"+
            "</div>"+
            "<div class='markerColor' style='background-color:"+ (faultyConns / jsonData[id].csmd.Number_charging_points == 1 ? "red" : (isLive ? (isStationOccupiedStatus(id) < occupiedLimit ? "yellow":"lightgreen") : "blue")) + ";'>" +
            "<button style='border:none; background:transparent; padding: 0.4em; color:white;' onclick=\"removeWaypoint(this)\">X</button>" +
            "</div>"+
            "<button onclick='readMorev2(this)'>Vis mer</button>"+
            "<div class='read-more clear-both'>" +
            generateConnectorString(id,jsonData[id].attr.st[21].attrvalid == "1") +
            "</div>" +
            "</div>";
        document.getElementById('waypoint-list').innerHTML += content;

        //Refreshing the route if it's active
        if($('#nav-start-pos').val() != "" && $('#nav-end-pos').val() != ""){
            navigate();
        }
    }catch(e){console.log(e);}
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

var favoriteStations = [];
function updateFavoriteStations(){
    $("#favorite-stations").html("");
    for(var id in favoriteStations){
        $('#favorite-stations').append(
            '<li class="border" style="height:4em; width:auto; padding: 0.5em 0 0.5em 0;">' +
                '<img class="cover-third float-left img-height-4em" src=\"' + getStationImage(id) + '\"/>' +
                '<div class="chargePointColor" style="height:4em;background-color:' +
                    (jsonData[id].attr.st[21].attrvalid == "1" ? (isStationOccupiedStatus(id) < occupiedLimit ? 'lightgreen' : 'yellow') : 'blue') + ';"></div>'+
                '<div class="cover-twothird float-right" style="width:calc(66% - 1em);">'+
                    '<strong class="float-left">' + jsonData[id].csmd.name + '</strong><br />'+
                    '<span>' + compareDistance(geopos, jsonData[id].csmd.Position.replace(/[()]/g,"").split(",")).toFixed(2)+ 'km </span>'+
                    '<button class="float-left" onclick="navigateFromUser(geopos, this)" value="'+ jsonData[id].csmd.Position.replace(/[()]/g,"").split(",") +'">Ta meg hit</button>' +
                '<div class="clear-both">' +//read-more
                '</div>' +
                '</div>' +
            '</li>');
    }
}

//Showing and hiding markers
function showHideMarkers(ele){
    var visible = true;

    for(var marker in markers)
        markers[marker].setVisible(!markers[marker].getVisible());

    $(ele).html(!visible ? 'Skjul stasjonsmarkører' : 'Vis stasjonsmarkører');
}
//Add station to favorite list
function addToFavorites(id){
    var path ="";
    if(phonegap)
        path += "http://frigg.hiof.no/bo16-g6/webapp/";
    path +="includes/addToFavorite.php";

    favoriteStations[id] = "";
    $.post( path,{
        stationId: id
    }, function(){
        if(!phonegap)
            updateFavoriteStations();
    });
    return false;
}