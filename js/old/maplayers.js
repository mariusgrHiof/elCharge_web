/**
 * Traffic layer
 */
var trafficLayerIsActive = false;
var trafficLayer;
function trafficOverlay(){
    if(trafficLayer == null)
        trafficLayer = new google.maps.TrafficLayer();

    if(trafficLayerIsActive){
        trafficLayer.setMap(null);
        trafficLayerIsActive = false;
    }else{
        trafficLayer.setMap(map);
        trafficLayerIsActive = true;
    }
    $("input[type=checkbox].onoffswitch-checkbox#traffic-layer").attr("checked", trafficLayerIsActive);
}

/**
 * Weather layer
 */
var weatherIsActive = false;
var weatherLayer;
function weatherOverlay(){
    $("input[type=checkbox].onoffswitch-checkbox#weather-layer").attr("checked", weatherIsActive);
}

/**
 * Cloud layer
 */
var cloudsIsActive = false;
var cloudLayer;
function cloudOverlay(){
    $("input[type=checkbox].onoffswitch-checkbox#cloud-layer").attr("checked", cloudsIsActive);
}