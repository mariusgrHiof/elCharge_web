
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
      <input class="clear-both" type="text" name="username" placeholder="Brukernavn">
      <input class="clear-both" type="password" name="password" placeholder="Passord">
      <p id="login-form" class="clear-both"></p>
      <input type="submit" value="Logg inn" class="submit_button">
      <a href="#">Glemt passord (Kommer)</a>
    </form>
  </div>
  <div id="register-popup">
    <h2>Registrer ny bruker</h2>
    <form id="registration-form" action="javascript:;" onsubmit="app.buttons.register(this)">
      <input class="clear-both" type="text" name="username" placeholder="Brukernavn">
      <input class="clear-both" type="password" name="password" placeholder="Passord">
      <input class="clear-both" type="email" name="mail" placeholder="petter@smart.no">
      <p id="register-form" class="clear-both"></p>
      <input type="submit" value="Registrer" class="submit_button">
    </form>
  </div>
</div>
