/**
 * Created by jonas on 03.03.16.
 */
var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 59.91673, lng: 10.74782},
        zoom: 8

    });
    //Showing a marker on the map
    var marker = new google.maps.Marker({
        position:{lat: 59.916667, lng: 10.75},
        map: map,
        title: 'test marker'
    });


    //Showing a info windows when you click on the marker
    var contentString = 'Sted: Oslo' +
                        ' <br> Status: Ledig'+
                        '<br> Ladetyper: type2';


    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });


}
//Showing the current weather for the past 15 minutes in a area
var weatherLayer = new google.maps.weather.WeatherLayer({
    temperatureUnits: google.maps.weather.TemperatureUnit.CELSIUS
});
weatherLayer.setMap(map);

//Showing clouds within the last 3 hours
var cloudLayer = new google.maps.weather.CloudLayer();
cloudLayer.setMap(map);