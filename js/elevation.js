/**
 * Created by jonas on 19.03.16.
 */

var elevationService = new google.maps.ElevationService;
// Load the Visualization API and the columnchart package.
google.load('visualization', '1', {packages: ['columnchart']});


var path = [
    {lat: 36.579, lng: -118.292},  // Mt. Whitney
    {lat: 36.606, lng: -118.0638},  // Lone Pine
    {lat: 36.433, lng: -117.951},  // Owens Lake
    {lat: 36.588, lng: -116.943},  // Beatty Junction
    {lat: 36.34, lng: -117.468},  // Panama Mint Springs
    {lat: 36.24, lng: -116.832}];  // Badwater, Death Valley

function getElevation(latlng){
    //https://developers.google.com/maps/documentation/elevation/intro#ElevationResponses
    //https://developers.google.com/maps/documentation/javascript/elevation#Elevation
    //https://developers.google.com/maps/documentation/javascript/examples/map-latlng-literal
    //https://maps.googleapis.com/maps/api/elevation/json?locations=39.7391536,-104.9847034&key=AIzaSyAijAKyJWxMHEodrkA3jD2psiz6LmI0hT8
}

function hallabruri(path, elevator, map){

    new google.maps.Polyline({
        path: path,
        strokeColor: 'purple',
        opacity: 0.4,
        map: map

    });

    elevator.getElevationAlongPath({
        'path': path,
        'samples': 256
    }, plotElevation);
}

function plotElevation(elevations, status){

    var chartDiv = document.getElementById('elevation-chart');
    if(status !== google.maps.ElevationStatus.OK){

        chartDiv.innerHTML = "Request failed because" + status;
        return;
    }

    var chart = new google.visualization.ColumnChart(chartDiv);

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Sample');
    data.addColumn('number', 'Elevation');
    for (var i = 0; i < elevations.length; i++){
        data.addRow(['', elevations[i].elevation]);
    }

    chart.draw(data, {
        height: 150,
        legend: 'none',
        titleY: 'Elevation (m)'
    });
}