//TODO: fiske sånn at du trenger kun å skrive .show(), .hide()
/* Popup script */
$(document).ready(function(){
    //Show login popup
    $('.show_login').click(function(){
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
    $('#login_popup').css({"visibility":"visible"});
    $('#register_popup').css({"visibility":"hidden"});
}

//Hides the login form
function hideLoginPopup(){
    $('#login_popup').css({"visibility":"hidden"});
}


//Shows the register form
function showRegisterPopup(){
    $('#register_popup').css({"visibility":"visible"});
    $('#login_popup').css({"visibility":"hidden"});
}

//hides the register form
function hideRegisterPopup(){
    $('#register_popup').css({"visibility":"hidden"});
}

function closeForm(){
    hideRegisterPopup();
    hideLoginPopup();
}