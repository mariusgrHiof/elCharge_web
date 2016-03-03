/**
 * Created by jonas on 03.03.16.
 */
function readJsonFile(callback){
    // Gotten from: http://stackoverflow.com/questions/19706046/how-to-read-an-external-local-json-file-in-javascript
    var path = "data/datadump.json";
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", path, true);
    rawFile.onreadystatechange = function() {
        if(rawFile.readyState == 4 && rawFile.status == "200"){
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

/* usage
 readTextFile(function(text){
 var data = JSON.parse(text);
 console.log(data);
 });
*/
