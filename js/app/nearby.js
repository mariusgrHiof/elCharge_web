/**
 * Created by jonas on 17.04.16.
 */
var nearby = {
  chargers : new Array(),
  compareDistance: function (userPos, stationPos){
    try{
      return google.maps.geometry.spherical.computeDistanceBetween (app.gps.strToLtLng(userPos[0] + "," + userPos[1]), app.gps.strToLtLng(stationPos[0] + "," + stationPos[1]))/1000;
    }catch(e){
      if(app.debug){
        console.log(e);
      }
      return 999;//Unable to get the location so defaulting to unreachable value
    }
  },
  update: function (){
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
  updateHTML: function(){
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
          element += station.getListString(nationalID);
        }catch(e){
          if(app.debug){
            console.log(e);
            console.log(nearby.chargers[id]);
            console.log(id);
          }
        }
      }
    }
    $('#chargers-nearby').html(element);
    station.bindStationNames();
  }
};
