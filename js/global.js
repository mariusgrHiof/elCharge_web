/**
 * Created by jonas on 22.03.16.
 */
/**
 * Global variables
 */
var hasDownloaded = false;
var initDownloaded = false;
var initiatedMap = false;
var downloadFrom = "2005-01-01";
var url = "https://nobil.no/api/server/datadump.php?";
var apiKey = "274b68192b056e268f128ff63bfcd4a4";

var favoriteRoutes = [];
var jsonData = new Array();
var mc;

var dlAnimation;
var animfaded = false;
dlAnimation = setInterval(
    function () {
        if(animfaded){
            $( '.spinning' ).fadeTo( "slow", 1 );
            animfaded = false;
        }
        else{
            $( '.spinning' ).fadeTo( "slow", 0.1 );
            animfaded = true;
        }
    },
    3
);
//Vars to define how many kW is fast and semifast
var semiFastCharge = 12;
var fastCharge = 43;
var rotation = 0;

var backgroundDL;
var intervalTimer;
$(document).ready(
    function(){
        if(!initiatedMap)
            initMap();
        if(!phonegap)
            downloadDump();
        //Background updates once per x minutes
        stopBGDLTimer(5);
    }
);

//Autodownload interval
function updateBGDLTimer(minutes){
    console.log("Timer is now: " + minutes);
    intervalTimer = minutes * 60000;
    clearInterval(backgroundDL);
    backgroundDL = setInterval(function() {
        console.log("The time has come!");
        if(hasDownloaded){
            hasDownloaded = false;
            if(phonegap)
                downloadDumpPG();
            else
                downloadDump();
        }else{
            console.log("nope..");
        }

    }, intervalTimer)
}

//Function for stopping the BG download timer
function stopBGDLTimer(){
    clearInterval(backgroundDL);
}

function updateTime() {
    var date = new Date();
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
}

//Download file for phonegap
function downloadDumpPG(){
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
        crossDomain: true,
        type: 'POST',
        datatype:'json',
        contentType: 'application/json; charset=utf-8',
        url: (downloadFrom == "2005-01-01" && isAndroid ? "datadump.json" : url + "&apikey=" + apiKey + "&fromdate=" + downloadFrom + "&format=json"),
        data: {},
        success: function(i){
            $('.dl-progress-text').html(progText +"<br />Laster inn ladestasjoner");
            var data;
            try{
                data = JSON.parse(i);
            }catch(e){
                data = i;
            }
            processDL(data);
            event.preventDefault();
        },
        error: function(err){
            console.log("Unable to download file: ");
            console.log(JSON.stringify(err));
            $('#download-progression').hide();
            hasDownloaded = true;
        }
    });
}

function dl(){
    jQuery.ajax({
        url: 'https://nobil.no/api/server/datadump.php',
        data: {
            'apikey': apiKey,
            'apiversion': '3',
            'action': "datadump",
            'fromdate': downloadFrom,
        },
        success: function(data){console.log(data)},
        dataType: 'jsonp'
    });
}

function downloadDump(){
    $('#download-progression').show();
    try{
        $('.dl-progress-text').text("Laster ned stasjoner");
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
            dataType: 'jsonp',
            url: 'https://nobil.no/api/server/datadump.php',
            data: {
                'apikey': apiKey,
                'apiversion': '3',
                'action': "datadump",
                'fromdate': downloadFrom
            },
            success: function(data){
                processDL(data);
            },
            error: function(err){
                console.log("Unable to download file: ");
                console.log("URL: "+url);
                console.log(JSON.stringify(err));
                $('#download-progression').hide();
                hasDownloaded = true;
            }
        });
    }catch(err){
        console.log("Failed: " + err);
        $('.dl-progress-text').text("Nedlasingen har feilet med følgende feilmelding: " + err);
    }
}

function processDL(data){
    if(downloadFrom == "2005-01-01")
        jsonData = []; // We only need to create a empty array if we haven't already downloaded.

    var id;
    for(var i = 0; i < data.chargerstations.length; i++){
        id = data.chargerstations[i].csmd.International_id;
        jsonData[id] = data.chargerstations[i];
    }
    //Adding markers
    if(!initDownloaded){
        setTimeout(generateMarkers(),0.001);
        initDownloaded = true;
    }else{
        //TODO:Remove when the K,V markerlist works propperly again
        setTimeout(generateMarkers(),0.001);
        hasDownloaded = true;
    }
    try{
        //Starting automatic location update
        if(isMobile && phonegap)
            navigator.geolocation.watchPosition(onSuccess, onError, {enableHighAccuracy: true, timeout: 100, maximumAge: 1000 });
    }catch(e){
        console.log("Failed: " + e);
        $('.dl-progress-text').text("Innlasting har feilet med følgende feilmeling: " + e);
    }
    downloadFrom = updateTime();
}

//Strive to be lazy
function inArray(key, array) {return $.inArray(key, array)>0;}

function inArrayVal(value, array){
    for(var i in array){
        if(array[i] == value ){
            return true;
        }
    }
    return false;
}

function getStationImage(station){
    try{
        return (/kommer/i.test(jsonData[station].csmd.Image.toLowerCase()) || /no.image.svg/i.test(jsonData[station].csmd.Image.toLowerCase())? 'icons/logo.svg' : 'http://www.nobil.no/img/ladestasjonbilder/'+ jsonData[station].csmd.Image);
    }catch(e){
        console.log("Failed for: " + station + " MSG: " + e)
    }
}

function connCapacityString (station, connectorID){
    var capacity = chargingCapacity[jsonData[station].attr.conn[connectorID][5].attrvalid].kW;
    return capacity >= fastCharge ? capacity + "kW " + 'hurtiglader' : (capacity >= semiFastCharge ? capacity + "kW " +"semihurtig": capacity + "kW "+ "vanlig");
}
