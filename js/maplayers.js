/**
 * Traffic layer
 */
var trafficLayerIsActive = false;
var trafficLayer = new google.maps.TrafficLayer();
function trafficLayer(){
    if(!trafficLayerIsActive){
        trafficLayer.setMap(map);
    }else{
        trafficLayer.setMap(null);
    }
}

/**
 * Weather layer
 */


/**
 * Cloud layer
 */