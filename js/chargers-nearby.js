/**
 * Created by jonas on 17.04.16.
 */

var chargers_nearby = new Array();

/**
 * A method for calculating the distance in KM between two positions on the map
*/
function compareDistance(userPos, stationPos){
    try{
        //1 deg lat = 110.574 KM
        var m_lat = 110.574;
        var y1 = userPos[0] * m_lat;
        var y2 = stationPos[0] * m_lat;
        //1 deg lon = 111.320*cos(lat) KM
        var m_lon = 111.320;
        var x1 = Math.cos(userPos[1]) * m_lon;
        var x2 = Math.cos(stationPos[1]) * m_lon;

        //Calculating the distance
        return Math.sqrt( Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) );
    }catch(e){
        //console.log("Unable to compare distances: " + e);
        return 999;//Unable to get the location so defaulting to unreachable value
    }
}

//For updating just the nearby charger list and not every chargers
function updateNearbyChargers(){
    chargers_nearby.length = 0;
    $('#chargers-nearby').html("");
    var sPos;
    for(var station in jsonData){
        sPos = jsonData[station].csmd.Position.replace(/[()]/g,"").split(",");
        if(compareDistance(geopos, sPos) <= 10){
            chargers_nearby[jsonData[station].csmd.id] = jsonData[station];
            chargers_nearby[jsonData[station].csmd.id]["distance"] = compareDistance(geopos, sPos);
        }
    }
    getNearbyChargers();
}

function getNearbyChargers(){
    chargers_nearby.sort(function (a, b){
        return a.distance - b.distance;
    });
    var thisPos = [];
    for(var station in chargers_nearby){
        //If it is matching our filters and is available to the public
        if(getCarMatch(chargers_nearby[station].csmd.Number_charging_points, chargers_nearby[station].csmd.International_id) && chargers_nearby[station].attr.st[2].attrvalid == "1"){
            thisPos = chargers_nearby[station].csmd.Position.replace(/[()]/g,"").split(",");
            $('#chargers-nearby').append(
                '<li class="border img-height-4em">' +
                '<img class="cover-third float-left img-height-4em" src=\"' + (/kommer/i.test(chargers_nearby[station].csmd.Image.toLowerCase()) || /no.image.svg/i.test(chargers_nearby[station].csmd.Image.toLowerCase())? 'icons/logo.svg' : 'http://www.nobil.no/img/ladestasjonbilder/'+ chargers_nearby[station].csmd.Image) + '\"/>' +
                '<div class="cover-twothird float-left">'+
                '<strong class="float-left">' + chargers_nearby[station].csmd.name + '</strong><br />'+
                '<span>' + Math.round(chargers_nearby[station].distance)+ 'km</span><br />'+
                '<button onclick="navigateFromUser(geopos, this)" value="'+ thisPos +'">Ta meg hit</button>' +
                '</div>' +
                '</li>');
        }
    }
}