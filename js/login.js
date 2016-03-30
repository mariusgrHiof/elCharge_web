//TODO: fiske sånn at du trenger kun å skrive .show(), .hide()
/* Popup script */
$(document).ready(function(){

    //Show login popup
    //$('#login_popup').hide();
    //$('#register_popup').hide();

    $('.show-login').click(function(){

        showLoginPopup();

    });

    //Show register popup
    $('.show_register').click(function(){
        showRegisterPopup();
    });
    //Close login and register popup
    $('.close_form').click(function(){
        closeForm();
    });
});

//Shows the login form
function showLoginPopup(){

    //TODO: Fikse sånn at det er kun slidedown når knappen blir trykket


        $('div #login_popup').show();



}

//Hides the login form
function hideLoginPopup(){

    $('#login_popup').fadeOut();
}


//Shows the register form
function showRegisterPopup(){

    $('#login_popup').fadeOut();

    $('#register_popup').show();
}

//hides the register form
function hideRegisterPopup(){


    $('#register_popup').fadeOut();
}

function closeForm(){
    hideRegisterPopup();
    hideLoginPopup();
}