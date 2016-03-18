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
            if(!$(child).hasClass('toggle')){
                $(child).addClass('toggle');
            }else{
                $(child).removeClass('toggle');
            }
        }
    );
});