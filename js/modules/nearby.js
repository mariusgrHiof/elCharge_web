/**
 * Created by jonas on 17.04.16.
 */
var nearby = {
  chargers : new Array(),
  compareDistance : function (userPos, stationPos){
    try{
      return google.maps.geometry.spherical.computeDistanceBetween (app.gps.strToLtLng(userPos[0] + "," + userPos[1]), app.gps.strToLtLng(stationPos[0] + "," + stationPos[1]))/1000;
    }catch(e){
      console.log(e);
      return 999;//Unable to get the location so defaulting to unreachable value
    }
  },
  update : function (){
    nearby.chargers.length = 0;
    var sPos;
    for(var id in station.list){
      sPos = station.list[id].csmd.Position.replace(/[()]/g,"").split(",");
      if(nearby.compareDistance(app.gps.geopos, sPos) <= 10){
        nearby.chargers[station.list[id].csmd.id] = station.list[id];
        nearby.chargers[station.list[id].csmd.id]["distance"] = nearby.compareDistance(app.gps.geopos, sPos);
      }
    }
    nearby.updateHTML();
  },
  updateHTML : function(){
    nearby.chargers.sort(function (a, b){
      return a.distance - b.distance;
    });
    var thisPos = [],
      id,
      nationalID,
      element = '';
    for(var id in nearby.chargers){
      nationalID = nearby.chargers[id].csmd.International_id;
      //If it is matching our filters and is available to the public
      if(station.getCarMatch(nationalID)){
        try{
          thisPos = nearby.chargers[id].csmd.Position.replace(/[()]/g,"").split(",");
          element += '<li class="border" style="height:4em; width:auto; padding: 0.5em 0 0.5em 0;">' +
            '<img class="cover-third float-left img-height-4em" src=\"' + station.getImage(nationalID) + '\"/>' +
            '<div class="chargePointColor" style="height:4em;background-color:' +
              (station.list[nationalID].attr.st[21].attrvalid == "1" ? (station.occupiedStatus(nationalID) > 0.4 ? 'lightgreen' : 'yellow') : 'blue') + ';"></div>'+
            '<div class="cover-twothird float-right" style="width:calc(66% - 1em);">'+
              '<strong class="float-left station-title"><a class="station" value="' + nationalID +'" href="#">' + nearby.chargers[id].csmd.name + '</a></strong><br />'+
              '<span>' + nearby.chargers[id].distance.toFixed(2)+ 'km </span>'+
              '<button class="float-left nav-here tooltip" onclick="navigation.fromUser(this)" value="'+ thisPos +'"><p class="tooltiptext">Naviger hit</p>Naviger hit</button>' +
              '<div class="clear-both">' +//read-more
              '</div>' +
            '</div>' +
          '</li>';

        }catch(e){console.log(e); console.log(nearby.chargers[id]); console.log(id);}
      }
    }
    $('#chargers-nearby').html(element);
    station.bindStationNames();
  }
};
