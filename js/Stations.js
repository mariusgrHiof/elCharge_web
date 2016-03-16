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

function generateMarkers(){
    $.getJSON('datadump.json', function ( obj ){
        for(i = 0; i < obj.chargerstations.length; i++){
            //Checking filter
            if(typeID != 99){
                var numOfPorts = obj.chargerstations[i].csmd.Number_charging_points;
                var trans = "4";
                //TODO: Fiks sånn at vi sjekker begge ladeportene og ikke kun den første av de.
                var isMatch = false;
                var connType;
                for(var c = 1; c <= numOfPorts; c++){
                    console.log("connector num: "+c);
                    //Checking if any connection ports match the user prefs
                    try{
                        connType = obj.chargerstations[i].attr.conn[c][4].trans;//.attrvalid;//Getting one of the connectors ID
                        console.log("kriterie "+typeIDs[typeID] + " sammenligning: " + connType);
                        if(!isMatch && connType.indexOf(typeIDs[typeID]) >= 0)// == typeID)
                            isMatch = true; //trans
                    }catch(e){}
                }
                console.log(connType);
                if(isMatch){
                    //Adding markers
                    var pos = obj.chargerstations[i].csmd.Position.replace(/[()]/g,"").split(",");
                    console.log(pos);
                    var marker = new google.maps.Marker({
                        position:{lat: parseFloat(pos[0]), lng: parseFloat(pos[1])},
                        map: map,
                        title: obj.chargerstations[i].csmd.name
                    });

                    //Showing a info windows when you click on the marker
                    var contentString = 'Sted: Oslo' +
                        ' <br> Status: Ledig'+
                        '<br> Ladetyper: type2' + map.getBounds();


                    var infowindow = new google.maps.InfoWindow({
                        content: contentString
                    });

                    marker.addListener('click', function() {
                        infowindow.open(map, marker);
                    });
                }
            }else{
                //Adding markers
                var pos = obj.chargerstations[i].csmd.Position.replace(/[()]/g,"").split(",");
                console.log(pos);
                var marker = new google.maps.Marker({
                    position:{lat: parseFloat(pos[0]), lng: parseFloat(pos[1])},
                    map: map,
                    title: obj.chargerstations[i].csmd.name
                });

                //Showing a info windows when you click on the marker
                var contentString = 'Sted: Oslo' +
                    ' <br> Status: Ledig'+
                    '<br> Ladetyper: type2' + map.getBounds();


                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });

                marker.addListener('click', function() {
                    infowindow.open(map, marker);
                });
            }
        }
    });
}