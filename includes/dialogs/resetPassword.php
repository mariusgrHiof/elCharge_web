
<?php

?>
<head>
  <link rel="stylesheet" type="text/css" href="../../style.css"/>
</head>
<div id="auth" class="dialog" style="display:block;">
  <div class="top-bar">
    <button class="float-right close-form">x</button>
  </div><!--
  <button class="show-login"> Logg inn </button>
  <button class="show-register">Registrer bruker</button>-->
  <div id="reset-pt1">
    <h2>Glemt passord</h2>
    <ol>
      <li>Venligst skriv inn din mail adresse og trykk "send nøkkel".</li>
      <li>Når du har motatt nøkkelen i mailen din, trykk "gå videre".</li>
    </ol>
    <form id="loggin-form" action="javascript:;" onsubmit="app.buttons.resetPassword(this)">
      <input class="clear-both" type="text" name="mail" placeholder="petter@smart.no" required>
      <p class="clear-both error-message"></p>
      <input type="submit" value="Send nøkkel" class="submit_button">
      <input type="submit" value="Gå videre" class="submit_button" disabled="true">
    </form>
  </div>
  <div id="reset-pt2">
    <h2>Glemt passord</h2>
    <form id="loggin-form" action="javascript:;" onsubmit="app.buttons.resetPassword(this)">
      <input class="clear-both" type="text" name="username" placeholder="Brukernavn" required>
      <input class="clear-both" type="text" name="resetkey" placeholder="Tilbakestillingsnøkkel" required>
      <input class="clear-both" type="password" name="password" placeholder="Passord" required>
      <input class="clear-both" type="password" name="password" placeholder="Gjenta passordet" required>
      <p class="clear-both error-message"></p>
      <input type="submit" value="Gå tilbake" class="submit_button">
      <input type="submit" value="Bytt passord" class="submit_button">
    </form>
  </div>
</div>
