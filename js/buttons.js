var domain = "http://frigg.hiof.no/bo16-g6/webapp/";
/*
 * Menu
 */
//Dropdown menu
function dropdown(event, parent){
     if(parent){
        var parent = $(event).parent().parent();
        if(!$(parent).hasClass('toggle')){
            $(parent).addClass('toggle');
        }else{
            $(parent).removeClass('toggle');
        }
    }else{
        var child = $(event).next().filter('.sub-item');
        if(!$(child).hasClass('toggle')){
            $(child).addClass('toggle');
        }else{
            $(child).removeClass('toggle');
        }
    }
}
//Slidein menu
function slideIn() {
    try{
        var target = $('.menu');
        if($(target).css("left") == "-700px"){
            $('#menu-toggle').addClass('toggle');
            $(target).animate({left:'0px'}, {queue: false, duration: 300});
        }else{
            $('#menu-toggle').removeClass('toggle');
            $(target).animate({left:'-700px'}, {queue: false, duration: 300});
        }
    }catch(e){console.log(e);}
}
function userLoggin(form){
    var path = "";
    if(phonegap)
        path += domain;
    path +="includes/checkloggin.php";

    //Logging the user in
    $.post(path,
        {
            //Posting username and password
            username: $(form).children(":input[name='username']").val(),
            password: $(form).children(":input[name='password']").val() },
        function( data ){
            console.log("Logged in feedback = " + data );
            console.log(JSON.parse(data));
            console.log(data);
            //Populating the user logged in window.

            //Populating the favorite chargers and routes window
            //Cleaning out the array
            favoriteStations.length = 0;
            $("#favorite-stations").html("");

            if(data != "[{}]"){
                for(var obj in JSON.parse(data))
                    favoriteStations[ JSON.parse(data)[obj].station_id] = JSON.parse(data)[obj];

                updateFavoriteStations();
                $('#auth').hide();
                $('#logged-in').html('Velkommen, ' + JSON.parse(data)[0].username);
            }else {
                $('#logged-in').html('Feil brukernavn eller passord');
            }
        }
    );
    return false;
}

function userRegistration(form){
    var path = "";
    if(phonegap)
        path += domain;
    path +="includes/register.php";

    //Logging the user in
    $.post(path,
        {
            //Posting username and password
            username: $(form).children(":input[name='username']").val(),
            password: $(form).children(":input[name='password']").val() },
        function( data ){
            $('#logged-in').html(data );
        });
    return false;
}

$(function(){
    $('.menu-item').click(
        function(){
            var child = $(this).next().filter('.sub-item');
            var parent = $(this).parent();
            var grandParent = $(this).parent().parent();

            if(!$(child).hasClass('toggle')){
                $(child).addClass('toggle');
                $(this).addClass('title-box');
                $(parent).addClass('parent');
                selectMenuHandeler(grandParent,true);
            }else{
                $(child).removeClass('toggle');
                $(this).removeClass('title-box');
                $(parent).removeClass('parent');
                selectMenuHandeler(grandParent, false);
            }
        }
    );
});

function selectMenuHandeler(parent, remove){
    $(parent).children('li').each(
        function(){
            if(!$(this).children('h2').next().hasClass('toggle')){
                $(this).css('display',remove ? 'none' : 'block');
            }else{
                $(this).css('display','block');
            }
        }
    );
}

function readMore(event, parent){
    if(parent){
        var parent = $(event).parent();
        var element = $(parent).next().filter('.read-more');
        if(!$(element).hasClass('toggle')){
            $(event).text('skjul');
            console.log(event);
            $(element).addClass('toggle');
        }else{
            $(event).text("vis");
            $(element).removeClass('toggle');
        }
    }else{
        var element = $(event).next().filter('.read-more');
        if(!$(element).hasClass('toggle')){
            $(event).text('skjul');
            console.log(event);
            $(element).addClass('toggle');
        }else{
            $(event).text("vis");
            $(element).removeClass('toggle');
        }
    }
}

function readMorev2(ele){
    if(!$(ele).hasClass('toggle')){
        $(ele).addClass('toggle');
    }else{
        $(ele).removeClass('toggle');
    }
}
/**
 * Input listeners
 */
//Turning layers on or off
$('input[type=checkbox].onoffswitch-checkbox').change(
    function(){
        if($(this).attr('id') == 'traffic-layer')
            trafficOverlay();
        if($(this).attr('id') == 'weather-layer')
            weatherOverlay();
        if($(this).attr('id') == 'cloud-layer')
            cloudOverlay();
    });

//Changing the autoupdate interval or deactivate autoupdate
$('input[type=number]#bg-update-timer').change(
    function(){
        if($(this).val() <= 0)
            stopBGDLTimer();
        else
            updateBGDLTimer($(this).val());
    }
);
//Changing the selected car and updating station markers accordingly
$('#select-car').change(
    function(){
        generateMarkers();
    }
);

$("#selected-charger-capacity").change(
    function(){
        selectedCapacity = $(this).children(":input[name='kW']:checked").val();
        console.log("Selected: " + selectedCapacity);
        //Updating the map with markers
        generateMarkers();
    }
);

function lockMapToUser(ele) {
    //Making it so that the user can toggle if they want the map to follow or not
    lockPos = !lockPos;
    $(ele).html(lockPos ? 'U' : 'L');
}

var favoriteRoutes = [];
function getFavoriteRoutes(){
    $.post((phonegap ? domain : '') +"includes/getMyRoutes.php",function (data){
        //Populating the user logged in window.
        //$('#logged-in').html( data );
        console.log("Data fra sql: " + data);
        //Populating the favorite chargers and routes window
        //Cleaning out the array
        favoriteRoutes.length = 0;
        var startPos;
        //var endPos;
        //var waypoints = [];
        console.log("Feeback " + data);
        $("#favorite-routes").html("");
        for(var obj in data){
            startPos = data[obj].start;
            //endPos = JSON.parse(data)[obj].end;
            //waypoints = JSON.parse(data)[obj].waypoints[obj];
            favoriteRoutes[startPos] = data[obj];
        }
    });
}

function logOut(){
    var path = "";
    if(phonegap)
        path += domain;
    path +="includes/logOut.php";

    $.post(path, function data(){
       $('#logged-in').html("logget ut");

    });
    updateFavoriteStations();
}


