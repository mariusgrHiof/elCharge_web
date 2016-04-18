/**
 * Created by jonas on 17.04.16.
 */

var chargers_nearby = new Array();

/**
 * A method for calculating the distance in KM between two positions on the map
*/
function compareDistance(userPos, stationPos){
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
}

function getNearbyChargers(){
    console.log('Size: ' + chargers_nearby.length);
    var thisPos = [];
    for(var i = 0; i < chargers_nearby.length; i++){
        thisPos = chargers_nearby[i].csmd.Position.replace(/[()]/g,"").split(",");
        console.log("Content: " + chargers_nearby[i].csmd.name);
        $('#chargers-nearby').append(
            '<li class="border">' +
            chargers_nearby[i].csmd.name + ' (' + Math.round(compareDistance(geopos, thisPos)) + 'km unna)' +
            '</li>');
    }
}