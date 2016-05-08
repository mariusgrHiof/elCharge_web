/**
 * Created by jonas on 19.03.16.
 */

var elevationService;
// Load the Visualization API and the columnchart package.
google.load('visualization', '1', {packages: ['columnchart']});




function getElevation(latlng){
    //https://developers.google.com/maps/documentation/elevation/intro#ElevationResponses
    //https://developers.google.com/maps/documentation/javascript/elevation#Elevation
    //https://developers.google.com/maps/documentation/javascript/examples/map-latlng-literal
    //https://maps.googleapis.com/maps/api/elevation/json?locations=39.7391536,-104.9847034&key=AIzaSyAijAKyJWxMHEodrkA3jD2psiz6LmI0hT8
}
var elevationPath = [];
function displayPathElevation(path, elevator){
    elevationPath.length = 0;
    for(var i = 0; i < path.legs.length; i++){
        //The start position
        if(i == 0)
            elevationPath.push(path.legs[i].start_location);

        //Looping through points
        for(var s in path.legs[i].steps){
            //Grabbing the first element, so that we don't overload the elevtion API with points
            elevationPath.push(path.legs[i].steps[s].lat_lngs[0]);
        }
        //The final destination
        if(i == path.legs.length-1)
            elevationPath.push(path.legs[i].end_location);
    }

    elevator.getElevationAlongPath({
        'path': elevationPath,
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