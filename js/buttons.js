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

/**
 * Input listeners
 */
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
        console.log("mafakashitkeklol");

        map.setCenter({lat: -33.8688, lng: 151.2195});
    }
)