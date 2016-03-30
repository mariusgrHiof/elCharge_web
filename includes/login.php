<div id="login_popup">
    <a href="#" class="show_login">Logg inn </a>
    <a href="#" class="show_register">Registrer</a>
    <form action="includes/checkLoggIn.php" method="post">
        <input type="text" name="username" placeholder="Brukernavn">
        <br>
        <input type="password" name="password" placeholder="Passord">
        <br>
        <br>
        <input type="submit" value="Logg inn" class="submit_button">
        <a href="#" class="close_form">Lukk </a>

    </form>
</div>

<div id="register_popup">
    <a href="#" class="show_login">Logg inn </a>
    <a href="#" class="show_register">Registrer</a>
    <form action="includes/register.php" method="post">
        <input type="text" name="username" placeholder="Brukernavn">
        <br>
        <input type="password" name="password" placeholder="Passord">
        <br>
        <br>
        <input type="submit" value="Registrer" class="submit_button">
        <a href="#" class="close_form">Lukk </a>

    </form>
</div>