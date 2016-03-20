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
    /*
    if(weatherLayer == null){
        weatherLayer = new google.maps.weather.WeatherLayer({
            temperatureUnits: google.maps.weather.TemperatureUnit.CELSIUS
        });
        if(weatherIsActive){
            weatherLayer.setMap(null);
        }else{
            weatherLayer.setMap(map);
        }
    }*/
    $("input[type=checkbox].onoffswitch-checkbox#weather-layer").attr("checked", weatherIsActive);
}

/**
 * Cloud layer
 */
var cloudsIsActive = false;
var cloudLayer;
function cloudOverlay(){
    /*
    if(cloudLayer == null){
        cloudLayer = new google.maps.weather.CloudLayer();
    }
    if(cloudsIsActive){
        cloudLayer.setMap(null);
    }else{
        cloudLayer.setMap(map);
    }*/
    $("input[type=checkbox].onoffswitch-checkbox#cloud-layer").attr("checked", cloudsIsActive);
}