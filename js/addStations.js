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

var connectors = new Array();

function readJsonFile(callback){
    // Gotten from: http://stackoverflow.com/questions/19706046/how-to-read-an-external-local-json-file-in-javascript
    var path = "data/datadump.json";
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", path, true);
    rawFile.onreadystatechange = function() {
        if(rawFile.readyState == 4 && rawFile.status == "200"){
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

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
    deleteMarkers();
    $.getJSON('datadump.json', function ( obj ){
        for(i = 0; i < obj.chargerstations.length; i++){
            //Checking filter
            //if(document.getElementById("select_port").value != 99){
            if(document.getElementById("select-car").value !=0){
                carModel = carModels[document.getElementById("select-car").value];
                var numOfPorts = obj.chargerstations[i].csmd.Number_charging_points;
                //TODO: Fiks sånn at vi sjekker begge ladeportene og ikke kun den første av de.
                var isMatch = getCarMatch(i, numOfPorts, obj);
                if(isMatch){
                    addMarker(i, obj);
                }
            }else{
                //Adding all charging stations
                addMarker(i, obj);
            }
            //TODO: FIX! var mc = new google.maps.MarkerClusterer(map, markers, options);
        }
    });
}

function getCarMatch(index, portCount, object){
    var match = false;
    var connType;
    var connectorArray = new Array();
    for(var c = 1; c <= portCount; c++){
        //Checking if any connection ports match the user prefs
        try{
            //connType = obj.chargerstations[i].attr.conn[c][4].trans;//.attrvalid;//Getting one of the connectors ID
            connType = object.chargerstations[index].attr.conn[c][4].attrvalid; //id
            //if(!isMatch && connType.indexOf(typeIDs[document.getElementById("select_port").value]) >= 0)// == typeID)
            if(!match && ($.inArray(connType, carModel)>0)){
                match = true; //trans
                connectorArray[connectorArray.length-1] = object.chargerstations[index].attr.conn[c][4].trans;
            }
        }catch(e){}
    }

    if(match){
        connectors = connectorArray;
    }
    return match;
}

function getMatchConnectorType(index, portCount, object){
    var match = false;
    var connType;
    var connectorArray = new Array();
    for(var c = 1; c <= portCount; c++){
        console.log("connector num: "+c);
        //Checking if any connection ports match the user prefs
        try{
            connType = object.chargerstations[index].attr.conn[c][4].trans;//.attrvalid;//Getting one of the connectors ID
            if(!match && connType.indexOf(typeIDs[document.getElementById("select_port").value]) >= 0){// == typeID)
                match = true; //trans
                connectorArray[connectorArray.length-1] = object.chargerstations[index].attr.conn[c][4];
            }
        }catch(e){}
    }
    if(match){
        connectors = connectorArray;
    }
    return match;
}

function addMarker(index, object){
    //Adding markers
    var pos = object.chargerstations[index].csmd.Position.replace(/[()]/g,"").split(",");
    var marker = new google.maps.Marker({
        position:{lat: parseFloat(pos[0]), lng: parseFloat(pos[1])},
        map: map,
        title: object.chargerstations[index].csmd.name
    });

    //Showing a info windows when you click on the marker
    var contentString =
        "<div id=\"station-tooltip\">"+
            "<div class='float-left'>" +
                "<img src=\"http://www.nobil.no/img/ladestasjonbilder/"+ object.chargerstations[index].csmd.Image +"\"/>" +
            "</div>"+
            "<div class='float-right'>" +
                "<h3>"+ object.chargerstations[index].csmd.name +"</h3>" +
                "<p>Kontakt info: "+ object.chargerstations[index].csmd.Contact_info+"</p>" +
                "<p>Adresse: "+ object.chargerstations[index].csmd.Street +" " + object.chargerstations[index].csmd.House_number +"</p>"+
                "<p>Beskrivelse: "+ object.chargerstations[index].csmd.description +"</p>" +
                "<p>Lokasjonsbeskrivelse: "+ object.chargerstations[index].csmd.Description_of_location +"</p>" +
                "<p>Eier: " + object.chargerstations[index].csmd.Owned_by +"</p>" +
                "<p>Kommentarer: "+ object.chargerstations[index].csmd.User_comment+"</p>" +
                "<p>Ladepunkter: "+ connectors[0]+"</p>" +
            "</div>"+
            "<button onclick='addWaypoint(" + pos[0] + "," + pos[1] + ",/" + object.chargerstations[index].csmd.name + "/)'>Legg til i rute</button>" +
        "</div>";
    //object.chargerstations[index].csmd.name;


    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });
    markers.push(marker);
}

function addWaypoint(lat, lon, name){
    //var parent = btn.target.parentNode;
    //parent.innerHTML.getElementsByClassName();
    waypoints.push({location: lat + "," + lon});
    document.getElementById('waypoint-list').innerHTML += "<p>" + name +"<button onclick=\"removeWaypoint(this)\">X</button></p>";

    //Refreshing the route if it's active
    if($('#nav-start-pos').val() != "" && $('#nav-end-pos').val() != ""){
        navigate();
    }
}

function removeWaypoint(element){
    var parent = $(element).parent();
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