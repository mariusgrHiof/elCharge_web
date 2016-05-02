/**
 * Created by jonas on 22.03.16.
 */
/**
 * Global variables
 */
var hasDownloaded = false;

var jsonData = new Array();
var mc;

var typeIDs = new Array();
typeIDs['0'] = "Unspecified";
typeIDs['14'] = "Schuko";
typeIDs['22'] = "Danish (Section 107-2-D1)";
typeIDs['29'] = "Tesla Connector Roadster";
typeIDs['30'] = "CHAdeMO";
typeIDs['31'] = "Type 1";
typeIDs['32'] = "Type 2";
typeIDs['60'] = "Type1/Type2";
typeIDs['34'] = "Blue industrial 3-pin";
typeIDs['35'] = "Blue industrial 4-pin";
typeIDs['36'] = "Red industrial 5-pin";
typeIDs['38'] = "Marechal";
typeIDs['39'] = "CCS/Combo";
typeIDs['40'] = "Tesla Connector Model";
typeIDs['41'] = "Combo + CHAdeMO";
typeIDs['42'] = "CHAdeMO + Type 2";
typeIDs['43'] = "CHAdeMO + Combo + AC-Type2";
typeIDs['50'] = "Type 2 + Schuko";
typeIDs['52'] = "Type 2 + Danish (Section 107-2-D1)";

var schuko = ['14', '50'];
var type1 = ['31', '60'];
var type2 = ['32', '60', '42', '50', '52'];
var type2ac = ['43'];
var chademo = ['30', '41', '42', '43'];
var combo = ['39', '41'];
var ind3pin = ['34'];
var ind4pin = ['35'];
var ind5pin = ['36'];
var teslaModelS = ['40'];
var teslaRoadster = ['29'];

//http://ladestasjoner.no/ladehjelpen/praktisk/51-hvilke-elbiler-kan-lade-med-hva
var carModels = new Array();
carModels['Nissan Leaf'] = schuko.concat(schuko, type1, type2, chademo);
carModels['BMW i3'] = schuko.concat(schuko, type2, combo);
carModels['Buddy'] = schuko;
carModels['Citroën Berlingo'] = schuko.concat(schuko, type1, type2, chademo);
carModels['Citroën C-ZERO'] = schuko.concat(schuko, type1, type2, chademo);
carModels['Ford Focus Electric'] = schuko.concat(schuko,type1, type2);
carModels['Kia Soul Electric'] = schuko.concat(schuko, type1, type2, chademo);
carModels['Mercedes B-klasse ED'] = schuko.concat(schuko, type2);
carModels['Mitsubishi i-MIEV'] = schuko.concat(schuko, type1, type2, chademo);
carModels['Nissan e-NV200/Evalia'] = schuko.concat(schuko, type1, type2, chademo);
carModels['Peugeot iOn'] = schuko.concat(schuko, type1, type2, chademo);
carModels['Peugeot Partner'] = schuko.concat(schuko, type1, type2, chademo);
carModels['Renault Kangoo ZE'] = schuko.concat(schuko, type1, type2);
carModels['Renault Twizy'] = schuko;
carModels['Renault Zoe'] = schuko.concat(schuko,type2);
carModels['Reva'] = schuko;
carModels['Tesla Model S'] = schuko.concat(schuko, type2, ind3pin, ind5pin, teslaModelS);
carModels['Tesla Roadster'] = schuko.concat(schuko, teslaRoadster);
carModels['Think'] = schuko;
carModels['VW e-Golf'] = schuko.concat(schuko, type2, combo);
carModels['VW e-up!'] = schuko.concat(schuko, type1, type2);


$(document).ready(
    function(){
        if(!phonegap){
            downloadDump();
        }else{
            console.log("Is phonegap");
        }
    }
);

function downloadDump(){
    console.log("File download initiated");
    $.ajax({
        xhr: function()
        {
            $('#download-progression').show();
            var xhr = new window.XMLHttpRequest();
            //Upload progress
            xhr.upload.addEventListener("progress", function(evt){
                if (evt.lengthComputable) {
                    var percentComplete = evt.loaded / evt.total;
                    //Do something with upload progress
                    console.log(percentComplete);
                }
            }, false);
            //Download progress
            xhr.addEventListener("progress", function(evt){
                if (evt.lengthComputable) {
                    var percentComplete = evt.loaded / evt.total;
                    var downloaded = (evt.loaded/1000000).toFixed(2);
                    var totalSize = (evt.total/1000000).toFixed(2);
                    //Do something with download progress
                    $('.dl-progress').text(Math.round(percentComplete * 100) + '%');
                    $('.dl-progressbar').css('width', function (){ return Math.round(percentComplete * 100) + '%'});
                    $('.dl-progress-text').text(downloaded + '/' + totalSize + 'MB');
                    console.log(Math.round(percentComplete * 100) + '%');
                }
            }, false);
            return xhr;
        },
        type: 'POST',
        dataType: 'jsonp',
        //TODO: Check out this URL for persistent storage with phonegap - http://docs.phonegap.com/en/2.5.0/cordova_file_file.md.html
        //TODO: "datadump.json",
        url: phonegap && isIOS ? "https://nobil.no/api/server/datadump.php?apikey=274b68192b056e268f128ff63bfcd4a4&fromdate=2005-01-01&format=json":"https://nobil.no/api/server/datadump.php?apikey=274b68192b056e268f128ff63bfcd4a4&fromdate=2005-01-01&format=json",
        data: {},
        success: function(data){
            console.log("File download completed");
            $('#download-progression').hide();
            hasDownloaded = true;
            jsonData = [];

            for(var i = 0; i < data.chargerstations.length; i++){
                jsonData[data.chargerstations[i].csmd.id] = data.chargerstations[i];
            }

            //Adding markers
            generateMarkers();
            try{
                //Starting automatic location update
                if(isMobile && phonegap)
                    navigator.geolocation.watchPosition(onSuccess, onError, {enableHighAccuracy: true, timeout: 100, maximumAge: 20000 });
            }catch(e){}
        }
    });
}