/**
 * Created by jonas on 13.06.16.
 */
var station = {
    /*
     * List of stations
     * TODO: station.list
     */
    list : [],
    user : {
      carConns : []
    },
    hasFastCharge : false,
    hasDownloaded : false,
    markers : [],
    infoWindows : [],
    markerListeners : [],
    contentString : '',
    connectorsString : '',
    selectedCapacity : '',
    occupiedLimit : 0.4,
    semiFastCharge : 12,
    fastCharge : 43,
    markerClusterer : null,
    /*
     * Connectors
     */
    conns : {
        list : [],
        numFaulty : 0,//Overwritten
        carModels : {},
        typesIDs : {
            '0' : 'Unspecified',
            '14' : 'Schuko',
            '22' : 'Danish (Section 107-2-D1)',
            '29' : 'Tesla Connector Roadster',
            '30' : 'CHAdeMO',
            '31' : 'Type 1',
            '32' : 'Type 2',
            '60' : 'Type1/Type2',
            '34' : 'Blue industrial 3-pin',
            '35' : 'Blue industrial 4-pin',
            '36' : 'Red industrial 5-pin',
            '38' : 'Marechal',
            '39' : 'CCS/Combo',
            '40' : 'Tesla Connector Model',
            '41' : 'Combo + CHAdeMO',
            '42' : 'CHAdeMO + Type 2',
            '43' : 'CHAdeMO + Combo + AC-Type2',
            '50' : 'Type 2 + Schuko',
            '52' : 'Type 2 + Danish (Section 107-2-D1)'
        },
        types : {
            schuko : ['14', '50'],
            type1 : ['31', '60'],
            type2 : ['32', '60', '42', '50', '52'],
            type2ac : ['43'],
            chademo : ['30', '41', '42', '43'],
            combo : ['39', '41'],
            ind3pin : ['34'],
            ind4pin : ['35'],
            ind5pin : ['36'],
            teslaModelS : ['40'],
            teslaRoadster : ['29']
        },
        capacity : {
            0 : {'id':0,'name':'Unspecified','current':'ukjent', 'kW':0, 'volt':0, 'ampere':0},
            1 : {'id':1,'name':'Battery exchange','current':'ukjent', 'kW':0, 'volt':0, 'ampere':0},
            7 : {'id':7, 'name':'3,6 kW - 230V 1-phase max 16A','current':'AC', 'kW':3.6, 'volt':230, 'ampere':16},
            8 : {'id':8, 'name':'7,4 kW - 230V 1-phase max 32A','current':'AC', 'kW':7.4, 'volt':230, 'ampere':32},
            10 : {'id':10, 'name':'11 kW - 400V 3-phase max 16A','current':'AC', 'kW':11, 'volt':400, 'ampere':16},
            11 : {'id':11, 'name':'22 kW - 400V 3-phase max 32A','current':'AC', 'kW':22, 'volt':400, 'ampere':22},
            12 : {'id':12, 'name':'43 kW - 400V 3-phase max 63A','current':'AC', 'kW':43, 'volt':400, 'ampere':63},
            13 : {'id':13, 'name':'50 kW - 500VDC max 100A','current':'DC', 'kW':50, 'volt':500, 'ampere':100},
            23 : {'id':23, 'name':'100 kW - 500VDC max 200A','current':'DC', 'kW':100, 'volt':500, 'ampere':200},
            16 : {'id':16, 'name':'230V 3-phase max 16A','current':'AC', 'kW':3.7, 'volt':230, 'ampere':16},
            17 : {'id':17, 'name':'230V 3-phase max 32A','current':'AC', 'kW':7.3, 'volt':230, 'ampere':32},
            18 : {'id':18, 'name':'230V 3-phase max 63A','current':'AC', 'kW':14.7, 'volt':230, 'ampere':64},
            19 : {'id':19, 'name':'20 kW - 500VDC max 50A','current':'DC', 'kW':20, 'volt':500, 'ampere':50},
            20 : {'id':20, 'name':'Less then 100 kW + 43 kW - 500VDC max 200A + 400V 3-phase max 63A','current':'DC', 'kW':43, 'volt':400, 'ampere':63},
            21 : {'id':21, 'name':'Less then 100 kW + 22 kW - 500VDC max 50A + 400V 3-phase max 32A','current':'DC', 'kW':22, 'volt':400, 'ampere':32},
            22 : {'id':22, 'name':'135 kW - 480VDC max 270A','current':'DC', 'kW':135, 'volt':480, 'ampere':270}
        },
        connCapacityString : function (id, connectorID){
            var capacity = station.conns.capacity[station.list[id].attr.conn[connectorID][5].attrvalid].kW;
            return capacity >= station.fastCharge ? capacity + "kW " + 'hurtiglader' : (capacity >= station.semiFastCharge ? capacity + "kW " +"semihurtig": capacity + "kW "+ "vanlig");
        },
        getString : function (id, isLive){
            var isInService = true;
            var connStatus = "9";
            station.conns.numFaulty = 0;

            var result = '<div style="margin:0.1em 0 0.1em 0;">';
            for(var c in station.list[id].attr.conn){
                try{
                    if(isLive){
                        try {
                            isInService = station.list[id].attr.conn[c][9].attrvalid == "0";
                            connStatus = station.list[id].attr.conn[c][8].attrvalid;
                            if(station.list[id].attr.conn[c][9].attrvalid == 1){//Is a faulty connector
                                station.conns.numFaulty++;
                            }
                        } catch(e) {console.log(e);}
                    }
                    result +=
                        "<div class='cpelements'>"+
                            "<span style=\'color:black; width:90%; float:left;\'>"+
                            station.list[id].attr.conn[c][4].trans + "(" + station.conns.connCapacityString(id, c) + ")" +
                            station.conns.getImg(station.list[id].attr.conn[c][4].attrvalid) +
                            "</span>"+
                            "<div class='chargePointColor' style='background-color:" + (isLive ? (isInService ? (connStatus == "0" ? "lightgreen" : (connStatus == "9" ? "blue" : "yellow")) : "red") : "blue") +";'>"+
                            "</div>"+
                        "</div>";
                }catch(e){
                    console.log('Failed to build connectorsString for ' + station.list[id].csmd.name + " Error: " + e);
                }
            }
            return result += "</div>";
        },
        // TODO: connectorImg
        getImg : function (connType) {
            var img;
            if(app.inArrayVal(connType, station.conns.types.schuko))
                img = 'schuko.svg';
            else if(app.inArrayVal(connType, station.conns.types.type1))
                img = 'type1.svg';
            else if(app.inArrayVal(connType, station.conns.types.type2))
                img = 'type2_tesla.svg';
            else if(app.inArrayVal(connType, station.conns.types.chademo))
                img = 'chademo.svg';
            else if(app.inArrayVal(connType, station.conns.types.combo))
                img = 'combo1.svg';
            else if(app.inArrayVal(connType, station.conns.types.ind3pin))
                img = 'industrial3pin.svg';
            else if(app.inArrayVal(connType, station.conns.types.ind4pin))
                img = 'industrial4pin.svg';
            else if(app.inArrayVal(connType, station.conns.types.ind5pin))
                img = 'industrial5pin.svg';
            else if(app.inArrayVal(connType, station.conns.types.teslaModelS))
                img = 'type2_tesla.svg';
            else if(app.inArrayVal(connType, station.conns.types.teslaRoadster))
                img = 'tesla_r.svg';

            return '<img class="float-right" src="icons/conn/'+ img +'" style="max-height:2em; max-width:2em;"/>';
        }
    },
    favorite : {
        stationList : [],
        routeList : [],
        addStation : function (id){
            var path ="";
            if(app.device.phonegap)
                path += app.path;
            path +="includes/addToFavorite.php";

            station.favorite.stationList[id] = "";
            $.post( path,{
                stationId: id
            }, function(){
                if(!app.device.phonegap)
                    station.favorite.updateStations();
            });
            return false;
        },
        updateStations : function (){
            $("#favorite-stations").html("");
            for(var id in station.favorite.stationList){
                $('#favorite-stations').append(
                    '<li class="border" style="height:4em; width:auto; padding: 0.5em 0 0.5em 0;">' +
                        '<img class="cover-third float-left img-height-4em" src=\"' + station.getImage(id) + '\"/>' +
                        '<div class="chargePointColor" style="height:4em;background-color:' +
                            (station.list[id].attr.st[21].attrvalid == "1" ? (station.occupiedStatus(id) < station.occupiedLimit ? 'lightgreen' : 'yellow') : 'blue') + ';"></div>'+
                        '<div class="cover-twothird float-right" style="width:calc(66% - 1em);">'+
                            '<strong class="float-left">' + station.list[id].csmd.name + '</strong><br />'+
                            '<span>' + compareDistance(app.gps.geopos, station.list[id].csmd.Position.replace(/[()]/g,"").split(",")).toFixed(2)+ 'km </span>'+
                            '<button class="float-left" onclick="navigateFromUser(app.gps.geopos, this)" value="'+ station.list[id].csmd.Position.replace(/[()]/g,"").split(",") +'">Ta meg hit</button>' +
                            '<div class="clear-both">' +//read-more
                            '</div>' +
                        '</div>' +
                    '</li>');
            }
        },
    },
    route : {
      waypoints : []
    },
    updateCarList : function(){
        //Adding elements to the car list dropdown
        var txt = '';
        for(var car in station.conns.carModels){
            txt += '<option value="'+car+'">' + car + '</option>';
        }
        $('#select-car').html(txt);
    },
    generateMarkers : function(){
        $('#download-progression').show();
        try{
            if(document.getElementById("select-car").value !=0)
                station.user.carConns = station.conns.carModels[document.getElementById("select-car").value];
            station.deleteMarkers();
            for(var id in station.list){
                //console.log(id);
                try{
                    station.conns.list.length = 0;
                    if(station.getCarMatch(id))
                        station.addMarker(station.list[id].csmd.Number_charging_points, id);
                    if($.inArray(id, station.favorite.stationList))
                        station.favorite.updateStations(id);
                }catch(err){console.log(err);}
            }
            $('#download-progression').hide();
            station.hasDownloaded = true;
        }catch(e){
            $('.dl-progress-text').text("Innlasting har feilet med følgende feilmeling: " + e);
        }
        if(station.markerClusterer == null)
            station.markerClusterer = new MarkerClusterer(app.map, station.markers, app.options.markerCluster);
        else{
            station.markerClusterer.clearMarkers();
            station.markerClusterer.addMarkers(station.markers);
        }
        $('#download-progression').hide();
        hasDownloaded = true;
    },
    deleteMarkers : function(){
        //Memory managenent
        app.setMapOnAll(null);
        station.markerListeners.length = 0;
        station.infoWindows.length = 0;
        chargers_nearby.length = 0;
        station.markers.length = 0;
    },
    getCarMatch : function (id){
        var match = false;
        var connType;
        var hasFastCharge_temp = false;
        var isFaulty = false;
        station.conns.hasFastCharge = false;
        station.conns.numFaulty = 0;
        for(var c in station.list[id].attr.conn){
            //Checking if any connection ports match the user prefs
            try{
                if(document.getElementById("select-car").value != 0 && !match && $.inArray(4, station.list[id].attr.conn[c]) && $.inArray(station.list[id].attr.conn[c][4].attrvalid, station.user.carConns) && (station.selectedCapacity <= station.conns.capacity[station.list[id].attr.conn[c][5].attrvalid].kW))
                    match = true;
                else if(document.getElementById("select-car").value == 0 && !match && (station.selectedCapacity <= station.conns.capacity[station.list[id].attr.conn[c][5].attrvalid].kW))
                //If no car or type is selected
                    match = true;
                if(station.list[id].attr.conn[c][9] != undefined && station.list[id].attr.conn[c][9].attrvalid == 1)//Is a faulty connector
                    station.conns.numFaulty++;
                //For the markers, to indicate if a id has a fast charger or not!
                if(!hasFastCharge_temp && (station.fastCharge <= station.conns.capacity[station.list[id].attr.conn[c][5].attrvalid].kW))
                    station.conns.hasFastCharge = true;
                station.conns.list.push(station.list[id].attr.conn[c]);
            }catch(e){}
        }
        return match;
    },
    //TODO: station.getImage
    getImage : function (id){
        try{
            return (/kommer/i.test(station.list[id].csmd.Image.toLowerCase()) || /no.image.svg/i.test(station.list[id].csmd.Image.toLowerCase())? 'icons/logo.svg' : 'http://www.nobil.no/img/ladestasjonbilder/'+ station.list[id].csmd.Image);
        }catch(e){
            console.log("Failed for: " + id + " MSG: " + e)
        }
    },
    addMarker : function (numOfPorts, id){
        //Adding markers
        var pos = station.list[id].csmd.Position.replace(/[()]/g,"").split(",");
        var isLive = station.list[id].attr.st[21].attrvalid == "1";
        var marker;
        var markerIcon = {
            url: 'icons/'+(
                isLive ? (station.hasFastCharge ?
                    (station.conns.numFaulty/numOfPorts == 1 ? 'marker_red_v2' :( station.occupiedStatus(id) > station.occupiedLimit ? 'marker_green_v2' : 'marker_yellow_v2')):
                    (station.conns.numFaulty/numOfPorts == 1 ? 'marker_red_v3' :( station.occupiedStatus(id) > station.occupiedLimit ? 'marker_green_v3' : 'marker_yellow_v3')))
                    :(station.hasFastCharge ? (station.conns.numFaulty/numOfPorts == 1 ? 'marker_red_v2' :'marker_blue_v2'):(station.conns.numFaulty/numOfPorts == 1 ? 'marker_red_v3' :'marker_blue_v3')))+'.svg', //Changing the color of the marker based on if it has live status or not.
            anchor: new google.maps.Point(0, 32),
            origin: new google.maps.Point(0, 0),
            scaledSize: new google.maps.Size(32, 51),
            size: new google.maps.Size(64, 64)
        };


        if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
            marker = new google.maps.Marker({
                position:{lat: parseFloat(pos[0]), lng: parseFloat(pos[1])},
                map: app.map,
                title: station.list[id].csmd.name
            });
        else
            marker = new google.maps.Marker({
                position:{lat: parseFloat(pos[0]), lng: parseFloat(pos[1])},
                icon: markerIcon,
                map: app.map,
                title: station.list[id].csmd.name
            });

        var maxWidth = (app.device.isMobile?500:500);
        var maxHeight = (app.device.isMobile?300:500);

        var infowindow = new google.maps.InfoWindow({
            content: station.contentString,
            maxWidth: maxWidth,
            maxHeight: maxHeight
        });

        station.infoWindows.push(infowindow);
        station.markerListeners.push(google.maps.event.addListener(infowindow, 'domready', function() {
            var iwOuter = $('.gm-style-iw');
            var iwBackground = iwOuter.prev();

            // Remove the background shadow DIV
            iwBackground.children(':nth-child(2)').css({'display' : 'none'});

            // Remove the white background DIV
            iwBackground.children(':nth-child(4)').css({'display' : 'none'});

            var iwCloseBtn = iwOuter.next();
            iwCloseBtn.css({
                opacity: '1',
                right: '52px',
                top: '16px'

            });
            iwCloseBtn.addClass('iw-close-btn');

            iwCloseBtn.mouseout(function(){
                $(this).css({opacity: '1'});
            });

        }));

        //Making it so that the popups disappear upon click outside box
        station.markerListeners.push(google.maps.event.addListener(map, 'click', function() {
            if (infowindow) {
                infowindow.close();
            }
        }));
        station.markerListeners.push(marker.addListener('click', function() {
            for(iw in station.infoWindows){
                station.infoWindows[iw].setContent(null);
                station.infoWindows[iw].close();
            }
            infowindow.open(map, marker);

            infowindow.setContent(station.getInfoWindowContent(id, isLive));
        }));
        station.markers.push(marker);

        //Building closest charging stations list
        try{
            if(compareDistance(app.gps.geopos, pos) <= 10){
                chargers_nearby[station.list[id].csmd.id] = station.list[id];
                chargers_nearby[station.list[id].csmd.id]["distance"] = compareDistance(app.gps.geopos, pos);
            }
        }catch(e){console.log(e);}
    },
    /*
     *  along a given route
     */
    addWaypoint : function (id){
        try{
            var disPos = station.list[id].csmd.Position.replace(/[()]/g,"").split(",");
            var isLive = station.list[id].attr.st[21].attrvalid == "1";
            station.route.waypoints.push(
                {location: new google.maps.LatLng(disPos[0],disPos[1])}
            );

            var content =
                "<div class='route-element station-"+ id +"'>" +
                    "<img class='cover-third float-left' src=\"" + station.getImage(id) + "\"/>" +
                    "<div class='float-left' style='width:calc( 66% - 1.1em );'>"+
                        "<Strong>" + station.list[id].csmd.name +"</Strong>"+
                    "</div>"+
                    "<div class='markerColor' style='background-color:"+ (station.conns.numFaulty / station.list[id].csmd.Number_charging_points == 1 ? "red" : (isLive ? (station.occupiedStatus(id) < station.occupiedLimit ? "yellow":"lightgreen") : "blue")) + ";'>" +
                        "<button style='border:none; background:transparent; padding: 0.4em; color:white;' onclick=\"station.removeWaypoint(this)\">X</button>" +
                    "</div>"+
                    "<button onclick='readMorev2(this)'>Vis mer</button>"+
                    "<div class='read-more clear-both'>" +
                        station.conns.getString(id,station.list[id].attr.st[21].attrvalid == "1") +
                    "</div>" +
                "</div>";
            document.getElementById('waypoint-list').innerHTML += content;

            //Refreshing the route if it's active
            if($('#nav-start-pos').val() != "" && $('#nav-end-pos').val() != ""){
                navigate();
            }
        }catch(e){console.log(e);}
    },
    removeWaypoint : function (element){
        var parent = $(element).parent().parent();
        var index = $(parent).index();

        //Removing the waypoint from the html
        $(parent).remove();
        //Removing elements from waypoints and moving the other elements down in the array.
        if(index > -1){
            station.route.waypoints.splice(index, 1);
        }

        //Refreshing the route if it's active
        if($('#nav-start-pos').val() != "" && $('#nav-end-pos').val() != ""){
            navigate();
        }
    },
    occupiedStatus : function (id){
        return parseFloat(station.list[id].csmd.Available_charging_points) / parseFloat(station.list[id].csmd.Number_charging_points);
    },
    /*
     * A method for generating the content of a infowindow
     */
    getInfoWindowContent : function (id, isLive) {
        if(document.getElementById("select-car").value !=0)
            station.user.carConns = station.conns.carModels[document.getElementById("select-car").value];

        //Showing a info windows when you click on the marker
        station.connectorsString = station.conns.getString(id, isLive);
        station.contentString =
            "<div id=\"station-tooltip\">"+
                "<div id=\"topBox\">"+
                "</div>"+
                "<div id=\"secondRow\">" +
                    "<img class='img-to-load' src=\""+ station.getImage(id) + "\"/>" +
                    "<div id='placeNameIcons' style='color:blue;'>"+
                        "<h3>"+ station.list[id].csmd.name + "(ID:" + id + ")</h3>" +
                        "<p><strong>Tilgjengelighet</strong> "+ station.list[id].attr.st[2].trans.replace('\r\n','<br />')+"</p>" +
                    "</div>"+
                    "<div class='markerColor' style='background-color:"+ (station.conns.numFaulty / station.list[id].csmd.Number_charging_points == 1 ? "red" : (isLive ? (station.occupiedStatus(id) < station.occupiedLimit ? "yellow":"lightgreen") : "blue")) + ";'>"+
                    "</div>"+
                "</div>"+
                "<div id='secondContainer'>"+
                    "<div id='infoLeft'>"+
                        "<p><strong>Adresse:</strong> "+ station.list[id].csmd.Street.replace('\r\n','<br />') +" " + station.list[id].csmd.House_number.replace('\r\n','<br />') + ", " + station.list[id].csmd.Zipcode.replace('\r\n','<br />') + " " + station.list[id].csmd.City.replace('\r\n','<br />') +"</p>"+
                        "<p><strong>Lokasjonsbeskrivelse:</strong> "+ station.list[id].csmd.Description_of_location +"</p>" +
                        "<p><strong>Eier:</strong> " + station.list[id].csmd.Owned_by.replace('\r\n','<br />') +"</p>" +
                        "<p><strong>Kommentarer:</strong> "+ station.list[id].csmd.User_comment.replace('\r\n','<br />')+"</p>" +
                        (station.list[id].csmd.Contact_info != null ? "<p><strong>Kontakt info:</strong> "+ station.list[id].csmd.Contact_info.replace('\r\n','<br />')+"</p>" : "") +
                    "</div>"+
                    "<div id='chargingPoints'>"+
                        "<p style='border-bottom:1px solid gray;margin-bottom:0;'><strong>Ladepunkter:</strong> "+ station.list[id].csmd.Number_charging_points + " </p>" +
                        "<div> "+
                            station.connectorsString +
                        "</div>" +
                    "</div>"+
                "</div>"+

                "<div id='lowerContainer'>"+
                    '<button onclick="addWaypoint(\'' + id + '\')" >Legg til i rute</button>' +
                    '<button onclick="navigateFromUser(app.gps.geopos, this)" value="'+ station.list[id].csmd.Position.replace(/[()]/g,"") +'">Ta meg hit</button>'+
                    '<button onclick="addToFavorites(\'' + id + '\')" >Legg til favoritt</button>' +
                "</div>"+
            "</div>";
        return station.contentString;
    },
    showHideMarkers : function (ele){
        var visible = true;

        for(var marker in station.markers)
            station.markers[marker].setVisible(!station.markers[marker].getVisible());

        $(ele).html(!visible ? 'Skjul stasjonsmarkører' : 'Vis stasjonsmarkører');
    },
    init : function() {
        station.conns.carModels = {
            'Nissan Leaf' : station.conns.types.schuko.concat(station.conns.types.schuko, station.conns.types.type1, station.conns.types.type2, station.conns.types.chademo),
            'BMW i3' : station.conns.types.schuko.concat(station.conns.types.schuko, station.conns.types.type2, station.conns.types.combo),
            'Buddy' : station.conns.types.schuko,
            'Citroën Berlingo' : station.conns.types.schuko.concat(station.conns.types.schuko, station.conns.types.type1, station.conns.types.type2, station.conns.types.chademo),
            'Citroën C-ZERO' : station.conns.types.schuko.concat(station.conns.types.schuko, station.conns.types.type1, station.conns.types.type2, station.conns.types.chademo),
            'Ford Focus Electric' : station.conns.types.schuko.concat(station.conns.types.schuko,station.conns.types.type1, station.conns.types.type2),
            'Kia Soul Electric' : station.conns.types.schuko.concat(station.conns.types.schuko, station.conns.types.type1, station.conns.types.type2, station.conns.types.chademo),
            'Mercedes B-klasse ED' : station.conns.types.schuko.concat(station.conns.types.schuko, station.conns.types.type2),
            'Mitsubishi i-MIEV' : station.conns.types.schuko.concat(station.conns.types.schuko, station.conns.types.type1, station.conns.types.type2, station.conns.types.chademo),
            'Nissan e-NV200/Evalia' : station.conns.types.schuko.concat(station.conns.types.schuko, station.conns.types.type1, station.conns.types.type2, station.conns.types.chademo),
            'Peugeot iOn' : station.conns.types.schuko.concat(station.conns.types.schuko, station.conns.types.type1, station.conns.types.type2, station.conns.types.chademo),
            'Peugeot Partner' : station.conns.types.schuko.concat(station.conns.types.schuko, station.conns.types.type1, station.conns.types.type2, station.conns.types.chademo),
            'Renault Kangoo ZE' : station.conns.types.schuko.concat(station.conns.types.schuko, station.conns.types.type1, station.conns.types.type2),
            'Renault Twizy' : station.conns.types.schuko,
            'Renault Zoe' : station.conns.types.schuko.concat(station.conns.types.schuko, station.conns.types.type2),
            'Reva' : station.conns.types.schuko,
            'Tesla Model S' : station.conns.types.schuko.concat(station.conns.types.schuko, station.conns.types.type2, station.conns.types.ind3pin, station.conns.types.ind5pin, station.conns.types.teslaModelS),
            'Tesla Roadster' : station.conns.types.schuko.concat(station.conns.types.schuko, station.conns.types.teslaRoadster),
            'Think' : station.conns.types.schuko,
            'VW e-Golf' : station.conns.types.schuko.concat(station.conns.types.schuko, station.conns.types.type2, station.conns.types.combo),
            'VW e-up!' : station.conns.types.schuko.concat(station.conns.types.schuko, station.conns.types.type1, station.conns.types.type2),
        }
    }
};
