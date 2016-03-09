/**
 * Created by jonas on 03.03.16.
 */
var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 59.91673, lng: 10.74782},
        zoom: 12

    });
    generateMarkers();


}
//Showing the current weather for the past 15 minutes in a area
var weatherLayer = new google.maps.weather.WeatherLayer({
    temperatureUnits: google.maps.weather.TemperatureUnit.CELSIUS
});
weatherLayer.setMap(map);

//Showing clouds within the last 3 hours
var cloudLayer = new google.maps.weather.CloudLayer();
cloudLayer.setMap(map);

function generateMarkers(){
    $.getJSON('datadump.json', function ( obj ){
        for(i = 0; i < obj.chargerstations.length; i++){
            //Checking filter
            if(typeID != 99){
                var numOfPorts = obj.chargerstations[i].csmd.Number_charging_points;
                var trans = "4";
                //TODO: Fiks sånn at vi sjekker begge ladeportene og ikke kun den første av de.
                var connType = obj.chargerstations[i].attr.conn[1][4].attrvalid;//Getting one of the connectors ID
                console.log(connType);
                if(connType == typeID){
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