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
    document.getElementById('traffic-button').innerHTML = (trafficLayerIsActive? "på":"av");
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
    document.getElementById('weather-button').innerHTML = (weatherIsActive? "på":"av");
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
    document.getElementById('cloud-button').innerHTML = (cloudsIsActive? "på":"av");
}