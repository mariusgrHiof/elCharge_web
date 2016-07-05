/**
 * Created by jonas on 19.03.16.
 */
// Load the Visualization API and the columnchart package.
google.load('visualization', '1', {packages: ['columnchart']});

var elevation = {
  service : {},
  path: [],
  displayForPath: function (path, elevator) {
    elevation.path.length = 0;
    for (var i = 0, x = path.legs.length; i < x; i++) {
      //The start position
      if (i === 0)
        elevation.path.push(path.legs[i].start_location);

      //Looping through points
      for (var s in path.legs[i].steps) {
        //Grabbing the first element, so that we don't overload the elevtion API with points
        elevation.path.push(path.legs[i].steps[s].lat_lngs[0]);
      }
      //The final destination
      if (i === x - 1)
        elevation.path.push(path.legs[i].end_location);
    }
    elevator.getElevationAlongPath({
      'path': elevation.path,
      'samples': 256
    }, elevation.plot);
  },
  plot: function (elevations, status) {
    var chartDiv = document.getElementById('elevation-chart'),
      chart = new google.visualization.ColumnChart(chartDiv),
      data = new google.visualization.DataTable();
    if (status !== google.maps.ElevationStatus.OK) {
      chartDiv.innerHTML = "Request failed because" + status;
      return;
    }
    data.addColumn('string', 'Sample');
    data.addColumn('number', 'Elevation');
    for (var i = 0, x = elevations.length; i < x; i++) {
      data.addRow(['', elevations[i].elevation]);
    }
    chart.draw(data, {
      height: 150,
      legend: 'none',
      titleY: 'Elevation (m)'
    });
  },
  init : function(){
    elevation.service = new google.maps.ElevationService;
  }
};
