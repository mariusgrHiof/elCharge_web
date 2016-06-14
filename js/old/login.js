//TODO: fiske sånn at du trenger kun å skrive .show(), .hide()
/* Popup script */
$(document).ready(function(){
    //Show login popup
    $('#show-login').click(function(){
        showLoginPopup();

    });

    //Show register popup
    $('.show-register').click(function(){
        showRegisterPopup();
        hideLoginPopup();
    });

    //show login from the registrer form
    $('.show-login').click(function(){
        showLoginPopup();
    });

    //Close login and register popup
    $('.close-form').click(function(){
        closeForm();
    });
});

//Shows the login form
function showLoginPopup(){
    $('#register-popup').hide();
    $('#login-popup').show();
}

//Hides the login form
function hideLoginPopup(){
    $('#login-popup').fadeOut();
}

//Shows the register form
function showRegisterPopup(){
    $('#register-popup').show();
}

//hides the register form
function hideRegisterPopup(){
    $('#register-popup').fadeOut();
}

function closeForm(){
    hideRegisterPopup();
    hideLoginPopup();
}