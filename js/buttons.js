/**
 * Dropdown menus
 * If we want slide in, check this out: http://stackoverflow.com/questions/521291/jquery-slide-left-and-show
 */
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
function userLoggin(form){
    var path = "";
    if(phonegap)
        path += "https://frigg.hiof.no/bo16-g6/webapp/";
    path +="includes/checkloggin.php";

    //Logging the user in
    $.post(path,
        {
            //Posting username and password
            username: $(form).children(":input[name='username']").val(),
            password: $(form).children(":input[name='password']").val() },
        function( data ){
            console.log("Logged in feedback = " + data );
            //Populating the user logged in window.
            $('#logged-in').html( data );

            //Populating the favorite chargers and routes window
            /*Some awesome method*/
    });
    return false;
}
function userRegistration(form){
    var path = "";
    if(phonegap)
        path += "https://frigg.hiof.no/bo16-g6/webapp/";
    path +="includes/register.php";

    //Logging the user in
    $.post(path,
        {
            //Posting username and password
            username: $(form).children(":input[name='username']").val(),
            password: $(form).children(":input[name='password']").val() },
        function( data ){
            console.log("Registered user feedback");
            //Populating the user logged in window.
            $('#logged-in').html( data );
            //Populating the favorite chargers and routes window
            /*Some awesome method*/
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
            //Looping through list to disable all but clicked menu item

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

$('input[type=text]#search-box').change(
    function(){
        map.setCenter({lat: -33.8688, lng: 151.2195});
    }
)
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