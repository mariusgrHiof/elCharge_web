
<?php
/*
<head>
  <link rel="stylesheet" type="text/css" href="../styles/maps.css"/>
  <link rel="stylesheet" type="text/css" href="../styles/menu.css"/>
  <link rel="stylesheet" type="text/css" href="../styles/tooltips.css"/>
  <link rel="stylesheet" type="text/css" href="../styles/text.css"/>
  <link rel="stylesheet" type="text/css" href="../styles/tablet.css"/>
  <link rel="stylesheet" type="text/css" href="../styles/mobile.css"/>
  <link rel="stylesheet" type="text/css" href="../styles/login.css"/>
  <link rel="stylesheet" type="text/css" href="../styles/colors.css"/>
  <link rel="stylesheet" type="text/css" href="../styles/download.css"/>
  <link rel="stylesheet" type="text/css" href="../styles/footer.css"/>
</head>
*/
?>
<div id="auth">
  <div class="top-bar">
    <button class="float-right close-form">x</button>
  </div><!--
  <button class="show-login"> Logg inn </button>
  <button class="show-register">Registrer bruker</button>-->
  <div id="login-popup">
    <h2>Logg inn</h2>
    <form id="loggin-form" action="javascript:;" onsubmit="app.buttons.login(this)">
      <input class="clear-both" type="text" name="username" placeholder="Brukernavn" required>
      <input class="clear-both" type="password" name="password" placeholder="Passord" required>
      <p id="login-form" class="clear-both"></p>
      <input type="submit" value="Logg inn" class="submit_button">
      <a href="#">Glemt passord (Kommer)</a>
    </form>
  </div>
  <div id="register-popup">
    <h2>Registrer ny bruker</h2>
    <form id="registration-form" action="javascript:;" onsubmit="app.buttons.register(this)">
      <input class="clear-both" type="text" name="username" placeholder="Brukernavn" required>
      <p id="validate-username"></p>
      <em>Passordet må ha store og små bokstaver og tall samt være lengre enn 5 tegn.</em>
      <input class="clear-both" type="password" name="password" placeholder="Passord" required>
      <p id="validate-password"></p>
      <input class="clear-both" type="email" name="mail" placeholder="petter@smart.no" required>
      <p id="validate-mail"></p>
      <p id="register-form" class="clear-both"></p>
      <input type="submit" value="Registrer" class="submit_button">
    </form>
  </div>
</div>
