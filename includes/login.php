<div id="auth">
    <button class="show-login"> Logg inn </button>
    <button class="show-register">Registrer bruker </button>

    <div id="login-popup">
        <form id="loggin-form" action="javascript:;" onsubmit="userLoggin(this)">
            <input type="text" name="username" placeholder="Brukernavn">
            <br>
            <input type="password" name="password" placeholder="Passord">
            <br>
            <br>
            <input type="submit" value="Logg inn" class="submit_button">
            <a href="#" class="close-form">Lukk </a>

        </form>
    </div>

    <div id="register-popup">
        <form id="registration-form" action="javascript:;" onsubmit="userRegistration(this)">
            <input type="text" name="username" placeholder="Brukernavn">
            <br>
            <input type="password" name="password" placeholder="Passord">
            <br>
            <br>
            <input type="submit" value="Registrer" class="submit_button">
            <a href="#" class="close-form">Lukk </a>

        </form>
    </div>
</div>


