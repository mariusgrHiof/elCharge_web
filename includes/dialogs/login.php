
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
<div id="auth" class="dialog">
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
      <input type="button" onclick="app.buttons.forgottenPassword(this)" value="Glemt passord" class="submit_button">
    </form>
  </div>
  <div id="register-popup">
    <h2>Registrer ny bruker</h2>
    <form id="registration-form" action="javascript:;" onsubmit="app.buttons.register(this)">
      <input class="clear-both" type="text" name="username" placeholder="Brukernavn" required>
      <p id="validate-username"></p>
      <em>Passordet må ha store og små bokstaver og tall samt være lengre enn 5 tegn.</em>
      <input class="clear-both" type="password" name="password" placeholder="Passord" required>
      <input class="clear-both" type="password" name="password-match" placeholder="Gjenta passordet" required>
      <p id="validate-password"></p>
      <input class="clear-both" type="email" name="mail" placeholder="petter@smart.no" required>
      <p id="validate-mail"></p>
      <p id="register-form" class="clear-both"></p>
      <input type="submit" value="Registrer" class="submit_button">
    </form>
  </div>
  <div id="reset-pt1">
    <h2>Glemt passord</h2>
    <ol>
      <li>Venligst skriv inn din mail adresse og trykk "send nøkkel".</li>
      <li>Når du har motatt nøkkelen i mailen din, trykk "gå videre".</li>
    </ol>
    <form action="javascript:;" onsubmit="app.buttons.sendResetKey(this)">
      <input class="email clear-both" type="text" name="mail" placeholder="petter@smart.no">
      <p class="clear-both error-message"></p>
      <label for="no-key">Jeg har alt nøkkel.</label>
      <input class="no-key" name="no-key" type="checkbox">
      <input type="submit" value="Gå videre" class="submit_button">
    </form>
  </div>
  <div id="reset-pt2">
    <h2>Glemt passord</h2>
    <form action="javascript:;" onsubmit="app.buttons.resetPassword(this)">
      <input class="clear-both" type="text" name="username" placeholder="Brukernavn" required>
      <input class="clear-both" type="text" name="resetkey" placeholder="Tilbakestillingsnøkkel" required>
      <input class="clear-both" type="password" name="password" placeholder="Passord" required>
      <input class="clear-both" type="password" name="password-match" placeholder="Gjenta passordet" required>
      <p class="clear-both error-message"></p>
      <input type="submit" value="Gå tilbake" class="submit_button">
      <input type="submit" value="Bytt passord" class="submit_button">
    </form>
  </div>
</div>
